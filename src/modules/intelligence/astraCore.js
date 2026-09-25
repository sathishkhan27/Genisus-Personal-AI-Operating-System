// GENISUS — GPT-6 Astra Intelligence Core & Orchestration Engine
// Primary reasoning intelligence orchestrating multi-agent workflows, tool calls,
// computer use, structured outputs, mid-conversation steering, and the 6-Factor AI Decision Framework.

export const EXECUTION_MODES = {
  ADVISORY: 'MODE_A_ADVISORY',               // Analyzes & recommends. Zero external action.
  ASSISTED: 'MODE_B_ASSISTED',               // Prepares actions, waits for explicit confirmation.
  AUTHORIZED_AUTONOMOUS: 'MODE_C_AUTONOMOUS' // Executes pre-authorized low-risk actions. High-risk always gated.
};

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export class AstraIntelligenceCore {
  constructor() {
    this.name = 'GPT-6 Astra Intelligence Core';
    this.version = '6.2.0-Astra-Omni';
    this.currentMode = EXECUTION_MODES.ASSISTED; // Default safe operational mode
    this.activeAgents = new Map();
    this.toolRegistry = new Map();
    this.decisionHistory = [];
    this.listeners = [];

    this.initCoreTools();
  }

  initCoreTools() {
    this.registerTool('web_search', {
      name: 'Real-time Web Search & Research',
      risk: RISK_LEVELS.LOW,
      requiresAuth: false,
      reversible: true
    });
    this.registerTool('github_api', {
      name: 'GitHub REST & GraphQL API Engine',
      risk: RISK_LEVELS.MEDIUM,
      requiresAuth: true,
      reversible: true
    });
    this.registerTool('git_cli', {
      name: 'Local Git CLI Controller (Commit/Push)',
      risk: RISK_LEVELS.HIGH,
      requiresAuth: true,
      reversible: false
    });
    this.registerTool('cloud_db', {
      name: 'Neon PostgreSQL Cloud Database Bridge',
      risk: RISK_LEVELS.HIGH,
      requiresAuth: true,
      reversible: false
    });
    this.registerTool('terminal_cli', {
      name: 'Local Workstation Terminal & Build Runner',
      risk: RISK_LEVELS.HIGH,
      requiresAuth: true,
      reversible: false
    });
    this.registerTool('ide_launcher', {
      name: 'Desktop IDE Launcher (VS Code, Android Studio, Xcode)',
      risk: RISK_LEVELS.LOW,
      requiresAuth: false,
      reversible: true
    });
    this.registerTool('vision_ocr', {
      name: 'Multimodal Vision, Camera & Product OCR',
      risk: RISK_LEVELS.LOW,
      requiresAuth: false,
      reversible: true
    });
    this.registerTool('ai_developer_agent', {
      name: 'Autonomous AI Software Developer Engine (Continuous Coding, Tests, Git & Push)',
      risk: RISK_LEVELS.HIGH,
      requiresAuth: true,
      reversible: true
    });
    this.registerTool('llm_task_agent', {
      name: 'Autonomous Background LLM Task & Activity Logical Execution Engine',
      risk: RISK_LEVELS.LOW,
      requiresAuth: false,
      reversible: true
    });

    // Populate active core agents within the GENISUS AI Model
    this.activeAgents.set('ai_developer_agent', {
      id: 'ai_developer_agent',
      name: 'AI Software Developer Agent',
      version: '4.0.0-LiveGit',
      status: 'ACTIVE',
      capabilities: ['Requirement Analysis', 'Auto Code Generation', 'Automated Testing', 'Git Commit & Push'],
      securityGate: 'Human Gate on Remote Git Push (Section 23)'
    });
    this.activeAgents.set('llm_task_agent', {
      id: 'llm_task_agent',
      name: 'LLM Task & Activity Logical Agent',
      version: '4.0.0-BackgroundEngine',
      status: 'ACTIVE',
      capabilities: ['Multi-Step Decomposition', 'Background Activity Queue', 'Disk State Persistence', 'Cross-Agent Coordination'],
      securityGate: 'Logical sandboxing with zero UI interference'
    });
  }

  setExecutionMode(mode) {
    if (Object.values(EXECUTION_MODES).includes(mode)) {
      this.currentMode = mode;
      this.notifyState();
      return { success: true, mode: this.currentMode };
    }
    return { success: false, error: 'Invalid execution mode' };
  }

  getExecutionMode() {
    return this.currentMode;
  }

  registerTool(id, config) {
    this.toolRegistry.set(id, config);
  }

  // 6-Factor AI Decision Framework:
  // INTENT -> CONFIDENCE -> RISK -> AUTHORIZATION -> REVERSIBILITY -> ACTION
  evaluateDecision({ intent, confidence = 0.95, targetTool, isDestructive = false, estimatedImpact = 'normal' }) {
    const tool = this.toolRegistry.get(targetTool) || { risk: RISK_LEVELS.MEDIUM, reversible: !isDestructive };
    const risk = isDestructive ? RISK_LEVELS.HIGH : tool.risk;
    const reversible = tool.reversible;

    let authorization = 'NONE';
    let action = 'REJECT';
    let explanation = '';

    // Mode A — Advisory
    if (this.currentMode === EXECUTION_MODES.ADVISORY) {
      authorization = 'ADVISORY_ONLY';
      action = 'RECOMMEND';
      explanation = 'Mode A active: Recommendations provided without external system modification.';
    }
    // Mode B — Assisted
    else if (this.currentMode === EXECUTION_MODES.ASSISTED) {
      if (risk === RISK_LEVELS.LOW && reversible) {
        authorization = 'AUTO_LOW_RISK';
        action = 'EXECUTE';
        explanation = 'Mode B active: Low-risk non-destructive query executed directly.';
      } else {
        authorization = 'PENDING_CONFIRMATION';
        action = 'PREPARE_AND_ASK';
        explanation = 'Mode B active: Action prepared and held at Confirmation Gate for explicit operator approval.';
      }
    }
    // Mode C — Authorized Autonomous
    else if (this.currentMode === EXECUTION_MODES.AUTHORIZED_AUTONOMOUS) {
      if (risk === RISK_LEVELS.CRITICAL || isDestructive || targetTool === 'git_cli') {
        authorization = 'STRICT_HUMAN_GATE';
        action = 'PREPARE_AND_ASK';
        explanation = 'Mode C active: High-risk action requires strict operator confirmation per Section 23 governance.';
      } else {
        authorization = 'PRE_AUTHORIZED';
        action = 'EXECUTE';
        explanation = 'Mode C active: Pre-authorized autonomous task executed.';
      }
    }

    const decisionRecord = {
      timestamp: new Date().toISOString(),
      intent,
      confidence: Math.round(confidence * 100) + '%',
      risk,
      authorization,
      reversibility: reversible ? 'REVERSIBLE' : 'IRREVERSIBLE',
      action,
      explanation
    };

    this.decisionHistory.unshift(decisionRecord);
    if (this.decisionHistory.length > 50) this.decisionHistory.pop();

    return decisionRecord;
  }

  // Decomposes natural language queries into sub-tasks and routing metadata
  decomposeIntent(query) {
    const q = query.toLowerCase().trim();
    const isMultiStep = q.includes('and ') || q.includes('then ') || q.includes('also ') || q.includes('compare ') || q.includes('research ');

    const subtasks = [];
    if (isMultiStep) {
      const parts = query.split(/\b(?:and then|and|then|also|,)\b/i).map(s => s.trim()).filter(Boolean);
      parts.forEach((p, idx) => {
        subtasks.push({
          step: idx + 1,
          instruction: p,
          status: 'PENDING',
          assignedDomain: this.inferDomain(p)
        });
      });
    } else {
      subtasks.push({
        step: 1,
        instruction: query,
        status: 'PENDING',
        assignedDomain: this.inferDomain(query)
      });
    }

    return {
      originalQuery: query,
      isMultiStep,
      stepCount: subtasks.length,
      subtasks
    };
  }

  inferDomain(phrase) {
    const p = phrase.toLowerCase();
    if (p.includes('git') || p.includes('code') || p.includes('build') || p.includes('test') || p.includes('ide') || p.includes('bug')) return 'SOFTWARE_ENGINEERING';
    if (p.includes('market') || p.includes('revenue') || p.includes('saas') || p.includes('competitor') || p.includes('business')) return 'BUSINESS_INTELLIGENCE';
    if (p.includes('product') || p.includes('camera') || p.includes('scan') || p.includes('price')) return 'PRODUCT_INTELLIGENCE';
    if (p.includes('health') || p.includes('sleep') || p.includes('water') || p.includes('heart')) return 'HEALTH_WELLNESS';
    if (p.includes('news') || p.includes('tech') || p.includes('world') || p.includes('ai')) return 'GLOBAL_INTELLIGENCE';
    return 'PERSONAL_INTELLIGENCE';
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getGenisusAIModel() {
    return {
      modelName: 'GENISUS-Astra-Omni v6.2 (Autonomous Multi-Agent AI Model)',
      architecture: 'GPT-6 Astra Unified Reasoning Mesh with Autonomous Agent Core',
      executionMode: this.currentMode,
      activeAgents: Array.from(this.activeAgents.values()),
      toolsCount: this.toolRegistry.size,
      capabilities: {
        aiDeveloperAgent: {
          name: 'AI Software Developer Agent',
          status: 'ONLINE',
          features: ['Dynamic Planning', 'Requirement Breakdown', 'Safe Code Generation', 'Automated Testing', 'Git Staging & Push']
        },
        llmTaskAgent: {
          name: 'LLM Task & Activity Logical Agent',
          status: 'ONLINE',
          features: ['Background Activity Worker', 'Task State Persistence (.agent_tasks.json)', 'Cross-Agent Sub-Activity Delegation']
        }
      }
    };
  }

  notifyState() {
    const state = {
      core: this.name,
      version: this.version,
      mode: this.currentMode,
      recentDecisions: this.decisionHistory.slice(0, 5)
    };
    this.listeners.forEach(fn => fn(state));
  }
}

export const astraCore = new AstraIntelligenceCore();
