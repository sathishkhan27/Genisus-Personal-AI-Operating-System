// GENISUS — Dynamic Task Planning & Mid-Turn Steering Engine
// Converts complex natural-language user requests into structured, executable plans.
// Incorporates mid-turn requirement adjustments (e.g. "Also include Python") dynamically without restarting.

export class TaskPlanner {
  constructor() {
    this.activePlan = null;
    this.planHistory = [];
    this.listeners = [];
  }

  // Generate an executable plan from user natural language
  createPlan(userRequirement) {
    const planId = 'plan-' + Date.now().toString(36);
    const steps = this.decomposeRequirement(userRequirement);

    this.activePlan = {
      id: planId,
      originalRequirement: userRequirement,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'EXECUTING', // PLANNING, EXECUTING, AWAITING_AUTHORIZATION, COMPLETED, CANCELLED
      currentStepIndex: 0,
      steps: steps.map((s, idx) => ({
        id: `step-${idx + 1}`,
        stepNumber: idx + 1,
        title: s.title,
        detail: s.detail,
        status: idx === 0 ? 'ACTIVE' : 'PENDING', // PENDING, ACTIVE, COMPLETED, SKIPPED, FAILED
        result: null,
        duration: null
      })),
      history: [
        {
          timestamp: new Date().toISOString(),
          type: 'PLAN_CREATED',
          message: `Plan initialized with ${steps.length} steps.`
        }
      ]
    };

    this.notify();
    return this.activePlan;
  }

  // Mid-Turn Steering: Adjust active plan dynamically without discarding completed work
  incorporateMidTaskChange(changeInstruction) {
    if (!this.activePlan) {
      return this.createPlan(changeInstruction);
    }

    const cleanChange = changeInstruction.replace(/^(also|plus|and|in addition|include|add)\s+/i, '').trim();

    // Insert new step before the final authorization/completion step
    const insertIdx = Math.max(this.activePlan.currentStepIndex + 1, this.activePlan.steps.length - 1);
    const newStepNumber = insertIdx + 1;

    const newStep = {
      id: `step-${Date.now().toString(36)}`,
      stepNumber: newStepNumber,
      title: `Incorporate: ${cleanChange}`,
      detail: `Dynamically steered into execution plan per operator mid-turn directive: "${changeInstruction}"`,
      status: 'PENDING',
      result: null,
      duration: null,
      isDynamicallyAdded: true
    };

    this.activePlan.steps.splice(insertIdx, 0, newStep);

    // Re-number subsequent steps
    this.activePlan.steps.forEach((s, idx) => {
      s.stepNumber = idx + 1;
    });

    this.activePlan.updatedAt = new Date().toISOString();
    this.activePlan.history.push({
      timestamp: new Date().toISOString(),
      type: 'MID_TURN_STEERING',
      message: `Incorporated: "${changeInstruction}". Plan expanded to ${this.activePlan.steps.length} steps.`
    });

    this.notify();
    return this.activePlan;
  }

  isMidTaskChangeTrigger(query) {
    if (!this.activePlan || this.activePlan.status === 'COMPLETED') return false;
    const q = query.toLowerCase().trim();
    return (
      q.startsWith('also ') ||
      q.startsWith('also include') ||
      q.startsWith('include ') ||
      q.startsWith('add ') ||
      q.startsWith('plus ') ||
      q.includes('also include python') ||
      q.includes('also add')
    );
  }

  advanceStep(result = null) {
    if (!this.activePlan) return null;
    const currentStep = this.activePlan.steps[this.activePlan.currentStepIndex];
    if (currentStep) {
      currentStep.status = 'COMPLETED';
      currentStep.result = result;
    }

    this.activePlan.currentStepIndex++;
    if (this.activePlan.currentStepIndex < this.activePlan.steps.length) {
      this.activePlan.steps[this.activePlan.currentStepIndex].status = 'ACTIVE';
    } else {
      this.activePlan.status = 'COMPLETED';
      this.planHistory.unshift(this.activePlan);
    }

    this.activePlan.updatedAt = new Date().toISOString();
    this.notify();
    return this.activePlan;
  }

  decomposeRequirement(req) {
    const r = req.toLowerCase();

    // Specific Pattern A: AI / Career / Learning Roadmap pattern
    if (r.includes('research') && (r.includes('career') || r.includes('roadmap') || r.includes('compare'))) {
      return [
        { title: 'Research AI coding technologies', detail: 'Retrieve and survey state-of-the-art coding models and tools.' },
        { title: 'Retrieve current telemetry & data', detail: 'Query real-time benchmarks and verified developer ecosystem data.' },
        { title: 'Compare architectural capabilities', detail: 'Synthesize latency, accuracy, context window, and tool-use benchmarks.' },
        { title: 'Analyze career relevance', detail: 'Evaluate synergy with user tech stack (Flutter, Dart, Node.js, Cloud).' },
        { title: 'Generate structured learning roadmap', detail: 'Create phased progression milestones and practical project prompts.' },
        { title: 'Create prioritized action tasks', detail: 'Map learning roadmap items into personal task manager.' },
        { title: 'Request authorization for external changes', detail: 'Strict confirmation gate prior to syncing external calendars/repos.' }
      ];
    }

    // Specific Pattern B: Code feature / bugfix / optimization
    if (r.includes('fix') || r.includes('optimize') || r.includes('build') || r.includes('code')) {
      return [
        { title: 'Analyze requirement & symptoms', detail: 'Parse target module, parameters, and constraints.' },
        { title: 'Scan codebase & impact area', detail: 'Inspect AST, dependency graph, and uncommitted git diffs.' },
        { title: 'Formulate non-breaking patch', detail: 'Implement optimized logic in target files.' },
        { title: 'Execute automated test suite', detail: 'Run unit, regression, and build verification.' },
        { title: 'Present visual diff to operator', detail: 'Stage changes in Visual Code Diff Inspector.' },
        { title: 'Strict Confirmation Gate', detail: 'Require explicit operator approval before commit/push.' }
      ];
    }

    // Default 4-step dynamic decomposition
    return [
      { title: `Analyze intent: "${req.slice(0, 40)}..."`, detail: 'Deconstruct parameters and identify required agents.' },
      { title: 'Execute domain queries & retrieval', detail: 'Consult specialized agents, hybrid RAG, and live APIs.' },
      { title: 'Synthesize evidence & recommendation', detail: 'Verify confidence and cross-check facts.' },
      { title: 'Deliver validated insight & actions', detail: 'Present actionable summary with operator review options.' }
    ];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.activePlan));
  }
}

export const taskPlanner = new TaskPlanner();
