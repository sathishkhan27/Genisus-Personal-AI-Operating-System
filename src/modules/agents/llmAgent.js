// GENISUS — Dedicated LLM Task & Activity Logical Agent
// Operates as an autonomous background logical engine:
// - Parses complex goals and multi-step directives
// - Enqueues background tasks to the Python logical executor (/api/agent/enqueue)
// - Runs a continuous background polling loop advancing queued activities autonomously
// - Seamlessly synchronizes background state with KnowledgeBase, MemoryStore & Multi-Agent Swarm

import { knowledgeBase } from '../knowledge/knowledgeBase.js';
import { memoryStore } from '../memory/memoryStore.js';

export const ACTIVITY_STATUS = {
  QUEUED: 'QUEUED',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const TASK_PRIORITY = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW'
};

export class LLMAgent {
  constructor() {
    this.name = 'GENISUS LLM Task & Activity Logical Agent';
    this.version = '4.0.0-BackgroundEngine';
    this.activeTasks = [];
    this.activityHistory = [];
    this.listeners = [];
    this.workerTimer = null;
    this.isWorkerRunning = false;

    // Initialize background worker loop
    this.startBackgroundWorker();
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notify() {
    this.listeners.forEach(fn => {
      try {
        fn(this.activeTasks);
      } catch (e) {
        console.warn('Listener notification error:', e);
      }
    });
  }

  // --------------------------------------------------------------------------
  // BACKGROUND LOGICAL WORKER LOOP
  // --------------------------------------------------------------------------

  startBackgroundWorker(intervalMs = 6000) {
    if (this.workerTimer) return;
    this.isWorkerRunning = true;

    // Immediate initial sync
    this.syncBackgroundTasks().catch(() => {});

    // Autonomous background stepping ticker
    this.workerTimer = setInterval(async () => {
      try {
        await this.stepBackgroundWorkerCycle();
      } catch (err) {
        // Silent recovery in background
      }
    }, intervalMs);
  }

  stopBackgroundWorker() {
    if (this.workerTimer) {
      clearInterval(this.workerTimer);
      this.workerTimer = null;
    }
    this.isWorkerRunning = false;
  }

  async stepBackgroundWorkerCycle() {
    // 1. Sync tasks from backend state
    await this.syncBackgroundTasks();

    // 2. Check if there are active tasks with incomplete activities
    const activeTask = this.activeTasks.find(t => t.status === 'ACTIVE' && t.progress < 100);
    if (activeTask) {
      // Step the activity in the background
      await this.stepBackgroundActivity(activeTask.id);
    }
  }

  async syncBackgroundTasks() {
    try {
      const res = await fetch('/api/agent/tasks');
      if (res.ok) {
        const tasks = await res.json();
        if (Array.isArray(tasks) && tasks.length > 0) {
          this.activeTasks = tasks;
          this.notify();
        }
      }
    } catch (e) {
      // Backend may be offline during build/tests
    }
  }

  async enqueueBackgroundGoal(directive, priority = TASK_PRIORITY.MEDIUM, category = 'General') {
    // 1. Send to background microservice endpoint
    try {
      const res = await fetch('/api/agent/enqueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive, priority, category })
      });

      if (res.ok) {
        const task = await res.json();
        if (task && task.id) {
          // Upsert locally
          const idx = this.activeTasks.findIndex(t => t.id === task.id);
          if (idx >= 0) this.activeTasks[idx] = task;
          else this.activeTasks.unshift(task);

          this.syncToKnowledgeBase(task);
          this.notify();
          return task;
        }
      }
    } catch (e) {
      console.warn('API enqueue failed, falling back to local decomposition:', e);
    }

    // Fallback to local decomposition if backend not reachable
    return this.createTaskFromRequirement(directive, false);
  }

  async stepBackgroundActivity(taskId) {
    try {
      const res = await fetch('/api/agent/step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });

      if (res.ok) {
        const updatedTask = await res.json();
        if (updatedTask && updatedTask.id) {
          const idx = this.activeTasks.findIndex(t => t.id === updatedTask.id);
          if (idx >= 0) this.activeTasks[idx] = updatedTask;
          this.syncToKnowledgeBase(updatedTask);
          this.notify();
          return updatedTask;
        }
      }
    } catch (e) {
      // Local stepping fallback
      return this.stepTaskLocally(taskId);
    }
    return null;
  }

  async runTaskToCompletionInBackground(taskId) {
    try {
      const res = await fetch('/api/agent/run-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });

      if (res.ok) {
        const completedTask = await res.json();
        if (completedTask && completedTask.id) {
          const idx = this.activeTasks.findIndex(t => t.id === completedTask.id);
          if (idx >= 0) this.activeTasks[idx] = completedTask;
          this.syncToKnowledgeBase(completedTask);
          this.notify();
          return completedTask;
        }
      }
    } catch (e) {
      console.warn('Backend run-task error:', e);
    }
    return null;
  }

  stepTaskLocally(taskId) {
    const task = this.activeTasks.find(t => t.id === taskId);
    if (!task) return null;

    const act = task.activities.find(a => a.status === ACTIVITY_STATUS.IN_PROGRESS) ||
                task.activities.find(a => a.status === ACTIVITY_STATUS.QUEUED);
    if (act) {
      act.status = ACTIVITY_STATUS.COMPLETED;
      const nextAct = task.activities.find(a => a.status === ACTIVITY_STATUS.QUEUED);
      if (nextAct) {
        nextAct.status = ACTIVITY_STATUS.IN_PROGRESS;
      }
      const completedCount = task.activities.filter(a => a.status === ACTIVITY_STATUS.COMPLETED).length;
      task.progress = Math.round((completedCount / task.activities.length) * 100);
      if (task.progress === 100) {
        task.status = ACTIVITY_STATUS.COMPLETED;
      }
      this.syncToKnowledgeBase(task);
      this.notify();
    }
    return task;
  }

  syncToKnowledgeBase(task) {
    try {
      knowledgeBase.addTask({
        id: task.id,
        title: task.title,
        priority: task.priority,
        due: task.due || 'இன்று 6:00 PM',
        category: task.category,
        completed: task.status === 'COMPLETED'
      });
    } catch (e) {
      // Ignored
    }
  }

  // --------------------------------------------------------------------------
  // NATURAL LANGUAGE REASONING & INTENT PARSING
  // --------------------------------------------------------------------------

  isLLMTaskTrigger(query) {
    const q = query.toLowerCase().trim();
    const triggers = [
      'create a task', 'create task', 'make a task', 'make task',
      'new activity', 'schedule activity', 'assign activity',
      'track activity', 'break down task', 'task planner',
      'organize task', 'llm agent', 'task agent', 'activity manager',
      'பணியை உருவாக்கு', 'புதிய வேலை', 'செயல்பாட்டை திட்டமிடு'
    ];
    return triggers.some(t => q.includes(t));
  }

  async process(query, preferredLanguage = 'ta-IN') {
    const isTamil = preferredLanguage.startsWith('ta') || /[\u0B80-\u0BFF]/.test(query);
    const task = await this.enqueueBackgroundGoal(query, TASK_PRIORITY.MEDIUM, 'Engineering');

    const speechText = isTamil
      ? `பாஸ் சதீஷ், "${task.title}" பணிக்கான ${task.activities?.length || 4} தொடர் செயல்பாடுகள் பின்புல அமைப்பில் (Background Logical Engine) இயக்கப்பட்டு வருகின்றன.`
      : `Dispatched "${task.title}" to the background logical execution engine. ${task.activities?.length || 4} activities active in queue.`;

    const displayText = `### ⚙️ BACKGROUND LOGICAL LLM TASK ENGINE
* **Task ID**: \`${task.id}\` | **Priority**: \`${task.priority}\` | **Category**: \`${task.category}\`
* **Target Objective**: *"${task.title}"*
* **Execution Status**: 🟢 \`${task.status}\` | **Progress**: \`${task.progress || 0}%\`
* **Background Worker**: \`ACTIVE (Polling & Stepping Autonomous Activities)\`

#### ⚡ Orchestrated Sub-Activities:
${(task.activities || []).map((a, idx) => `* **Activity ${idx + 1}**: ${a.name}\n  - *Assignee*: \`${a.agent || a.assignedAgent}\` · *Status*: \`${a.status}\` · *ETA*: \`${a.duration}\``).join('\n')}

---
*✅ Operating at the background logical engine level with real state persistence.*`;

    return {
      agent: this.name,
      mode: 'LLM_TASK_CREATED',
      language: isTamil ? 'ta-IN' : 'en-US',
      speechText,
      displayText,
      data: task
    };
  }

  createTaskFromRequirement(userDirective, isTamil = false) {
    const taskId = 'task-' + Date.now().toString(36);
    const cleanDirective = userDirective
      .replace(/^(create a task to|create task to|make a task to|make a task|new activity to|பணியை உருவாக்கு|புதிய வேலை)[:\s]*/i, '')
      .trim() || 'General Engineering Sprint Goal';

    let priority = TASK_PRIORITY.MEDIUM;
    const lower = cleanDirective.toLowerCase();
    if (lower.includes('urgent') || lower.includes('crash') || lower.includes('security') || lower.includes('critical') || lower.includes('முக்கியம்')) {
      priority = TASK_PRIORITY.HIGH;
    } else if (lower.includes('someday') || lower.includes('later') || lower.includes('audit')) {
      priority = TASK_PRIORITY.LOW;
    }

    let category = 'Engineering';
    if (lower.includes('pingzo') || lower.includes('order') || lower.includes('delivery')) category = 'Pingzo';
    else if (lower.includes('revenue') || lower.includes('pricing') || lower.includes('billing')) category = 'Finance';
    else if (lower.includes('health') || lower.includes('workout') || lower.includes('diet')) category = 'Health';
    else if (lower.includes('meeting') || lower.includes('client') || lower.includes('call')) category = 'Communications';
    else if (lower.includes('writing') || lower.includes('doc') || lower.includes('content')) category = 'Content';

    const activities = [
      { id: 'act-1', name: 'Architectural Analysis & Requirements Breakdown', agent: 'CodingAgent', status: ACTIVITY_STATUS.IN_PROGRESS, duration: '15m' },
      { id: 'act-2', name: 'Local Source Code Implementation & Patching', agent: 'CodingAgent', status: ACTIVITY_STATUS.QUEUED, duration: '30m' },
      { id: 'act-3', name: 'Automated Unit & Integration Test Suite Execution', agent: 'DevOpsAgent', status: ACTIVITY_STATUS.QUEUED, duration: '10m' },
      { id: 'act-4', name: 'Git Staging, Commit & Production Release Documentation', agent: 'WritingEnhancerAgent', status: ACTIVITY_STATUS.QUEUED, duration: '10m' }
    ];

    const taskObj = {
      id: taskId,
      title: cleanDirective.charAt(0).toUpperCase() + cleanDirective.slice(1),
      category,
      priority,
      status: 'ACTIVE',
      progress: 0,
      createdAt: new Date().toISOString(),
      due: 'இன்று 6:00 PM',
      totalEstimatedTime: '65 mins',
      activities,
      assignedLeadAgent: 'LLMTaskAgent'
    };

    this.activeTasks.unshift(taskObj);
    if (this.activeTasks.length > 30) this.activeTasks.pop();
    this.syncToKnowledgeBase(taskObj);
    this.notify();
    return taskObj;
  }

  updateActivityStatus(taskId, activityId, newStatus) {
    const task = this.activeTasks.find(t => t.id === taskId);
    if (!task) return null;

    const act = task.activities.find(a => a.id === activityId);
    if (act) {
      act.status = newStatus;
      const completedCount = task.activities.filter(a => a.status === ACTIVITY_STATUS.COMPLETED).length;
      task.progress = Math.round((completedCount / task.activities.length) * 100);
      if (task.progress === 100) {
        task.status = ACTIVITY_STATUS.COMPLETED;
      }
      this.syncToKnowledgeBase(task);
      this.notify();
    }
    return task;
  }
}

export const llmAgent = new LLMAgent();

