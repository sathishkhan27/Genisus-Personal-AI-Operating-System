// GENISUS — Multi-Level Memory & Project Knowledge Store
// Implements Section 5, 23 & 24 of the Genisus AI Master Requirements:
// 1. Short-Term Memory: Sliding window of recent turns with roles & metadata
// 2. Session Memory: Active working context (active goal, tech, files, ongoing task)
// 3. Project Memory Layer (/project): Architecture, API specs, DB schema, standards, dependencies, decisions
// 4. User Preferences: Coding style, preferred frameworks, response styles, and language
// 5. Context Priority Enforcement: Section 24 order (Explicit instruction > Project state > Tool results > Memory)

export class MemoryStore {
  constructor() {
    this.storageKey = 'genisus_memory_store_v2';
    this.shortTermMemory = [];
    this.auditLogs = [];
    this.sessionMemory = {
      activeGoal: '',
      activeTechnology: '',
      activeTopic: '',
      activeFiles: [],
      lastAction: '',
      pendingConfirmation: null,
      turnCount: 0
    };
    this.loadState();
  }

  getDefaultData() {
    return {
      userPreferences: {
        name: 'Sathish',
        github: '@sathishkhan27',
        primaryRole: 'Full-Stack & Autonomous AI Systems Architect',
        preferredLanguages: ['ta-IN', 'en-US'],
        preferredFrameworks: ['Flutter (Dart)', 'Node.js (Express)', 'React / Next.js', 'Python (AsyncIO)'],
        preferredStateManagement: 'BLoC & Streams (Flutter), Lightweight Stores (Web)',
        responseStyle: 'direct_action_oriented',
        codingConventions: 'Clean Architecture, production-grade typing, minimal surgical diffs, zero placeholders'
      },
      projectKnowledgeLayer: {
        architecture: {
          style: 'Autonomous Multi-Agent Swarm with Holographic 3D HUD & Local Git Engine',
          frontend: 'Vite + Vanilla Modern JS (ES Modules) + Three.js Hologram Core + Canvas Confetti',
          backend: 'Node.js Internal Vite Middleware API Bridge + Python 3.11 Background LLM Task Worker',
          cloudDatabase: 'Neon Serverless PostgreSQL (aws-us-east-2), PG version 18, 33 tables tracked',
          gitModel: 'Direct Node.js child_process Git CLI Bridge with Human Gate on Remote Push (Section 23)'
        },
        requirements: [
          'Full real-time requirement-to-code workflow with real file modifications',
          'Multi-step autonomous task decomposition with background worker daemon',
          'Truthful validation: never claim tests passed without executing real runners',
          'Bilingual natural conversation and voice synthesis in Tamil and English'
        ],
        apiSpecification: [
          { endpoint: '/api/dev/real-projects', method: 'GET', desc: 'Discovers active local repositories' },
          { endpoint: '/api/dev/git-status', method: 'GET', desc: 'Authentic porcelain git status' },
          { endpoint: '/api/dev/git-diff', method: 'GET', desc: 'Granular file & unstaged diffs' },
          { endpoint: '/api/dev/run-test', method: 'POST', desc: 'Executes real test suites (npm test / build)' },
          { endpoint: '/api/dev/git-commit', method: 'POST', desc: 'Staged conventional git commits' },
          { endpoint: '/api/dev/git-push', method: 'POST', desc: 'Remote git push to GitHub origin' },
          { endpoint: '/api/ai/ask', method: 'POST', desc: 'OpenAI Frontier / GPT-6 Astra reasoning gateway' },
          { endpoint: '/api/agent/enqueue', method: 'POST', desc: 'Enqueues background logical activities' },
          { endpoint: '/api/agent/tasks', method: 'GET', desc: 'Fetches persistent disk task queue' },
          { endpoint: '/api/cloud-telemetry', method: 'GET', desc: 'Live Neon PostgreSQL cloud telemetry' }
        ],
        database: {
          provider: 'Neon Cloud Serverless PostgreSQL',
          region: 'aws-us-east-2',
          databases: ['pingzo-db', 'booknowgo'],
          keyTables: ['supermarket_orders', 'delivery_partners', 'customers', 'products', 'bookings', 'payments']
        },
        codingStandards: {
          general: 'Production-ready, modular, secure, and compatible with installed toolchains',
          git: 'Conventional commit format: feat(scope): message, fix(scope): message',
          safety: 'Human Gate required prior to destructive operations (push, rm, drop table)'
        },
        decisions: [
          { id: 'ADR-001', decision: 'Mode B (Assisted) as default with human confirmation gate for live push', date: '2026-08-10' },
          { id: 'ADR-002', decision: 'Dual Autonomous Cores (AI Developer Agent + LLM Task Agent) inside GENISUS AI Model', date: '2026-09-12' },
          { id: 'ADR-003', decision: 'Truthful Validation Principle: Never fake test or git operations', date: '2026-09-15' }
        ]
      },
      projectMemory: [
        {
          id: 'proj-1',
          name: 'GENISUS AI OS',
          path: '/Users/sathish.s/Documents/genisus',
          type: 'Vite / JavaScript / Python',
          branch: 'main',
          status: 'Active Command Center'
        },
        {
          id: 'proj-2',
          name: 'PingZO Ecosystem',
          path: '/Users/sathish.s/Documents/flutter_ecommerce_app',
          type: 'Flutter / Dart',
          branch: 'main',
          status: 'Hyperlocal E-Commerce'
        },
        {
          id: 'proj-3',
          name: 'BookNowGo',
          path: '/Users/sathish.s/Documents/booknowgo-frontend',
          type: 'React / Next.js',
          branch: 'main',
          status: 'Travel & Reservation SaaS'
        },
        {
          id: 'proj-4',
          name: 'Shreeja Ulagam',
          path: '/Users/sathish.s/Documents/sreejaulagam/shreeja_ulagam',
          type: 'Flutter / Dart',
          branch: 'main',
          status: 'Retail Community App'
        }
      ],
      permissions: {
        accessBusinessData: true,
        accessHealthData: true,
        accessCamera: true,
        accessWebSearch: true,
        enableProactiveAlerts: true,
        storeNewMemories: true
      }
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.data = this.getDefaultData();
        this.saveState();
      }
    } catch (e) {
      this.data = this.getDefaultData();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // 1. SHORT-TERM CONVERSATION MEMORY (Sliding Window)
  // --------------------------------------------------------------------------
  addShortTermMessage(role, text, metadata = {}) {
    const entry = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      role,
      text,
      metadata,
      timestamp: new Date().toISOString()
    };
    this.shortTermMemory.push(entry);
    if (this.shortTermMemory.length > 25) {
      this.shortTermMemory.shift();
    }
    this.sessionMemory.turnCount++;
    this.logAudit('CONVERSATION', `Logged dialogue turn from ${role}`, { preview: text.slice(0, 50) });
    return entry;
  }

  getShortTermContext() {
    return this.shortTermMemory;
  }

  getLastUserMessage() {
    const userMsgs = this.shortTermMemory.filter(m => m.role === 'user');
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;
  }

  // --------------------------------------------------------------------------
  // 2. SESSION WORKING MEMORY (Multi-Turn Continuity & Active Context)
  // --------------------------------------------------------------------------
  setSessionGoal(goal, technology = null) {
    this.sessionMemory.activeGoal = goal;
    if (technology) this.sessionMemory.activeTechnology = technology;
    this.sessionMemory.lastAction = 'SET_GOAL';
    this.logAudit('SESSION', `Updated active goal: "${goal}" (Tech: ${technology || 'auto'})`);
  }

  updateSessionGoal({ activeGoal, activeTopic, intentCategory, responseMode, isContinuation } = {}) {
    if (activeGoal) this.sessionMemory.activeGoal = activeGoal;
    if (activeTopic) this.sessionMemory.activeTopic = activeTopic;
    if (intentCategory) this.sessionMemory.intentCategory = intentCategory;
    if (responseMode) this.sessionMemory.responseMode = responseMode;
    this.sessionMemory.isContinuation = !!isContinuation;
    this.sessionMemory.turnCount = (this.sessionMemory.turnCount || 0) + 1;
    this.logAudit('SESSION', `Updated active session goal: "${this.sessionMemory.activeGoal}"`);
  }

  setSessionTechnology(technology) {
    this.sessionMemory.activeTechnology = technology;
    this.logAudit('SESSION', `Set session technology: "${technology}"`);
  }

  updateSession(key, value) {
    if (this.sessionMemory.hasOwnProperty(key)) {
      this.sessionMemory[key] = value;
      this.logAudit('SESSION', `Updated session key ${key}`);
    }
  }

  getSessionContext() {
    return this.sessionMemory;
  }

  clearSession() {
    this.sessionMemory = {
      activeGoal: '',
      activeTechnology: '',
      activeTopic: '',
      activeFiles: [],
      lastAction: '',
      pendingConfirmation: null,
      turnCount: 0
    };
    this.shortTermMemory = [];
    this.logAudit('SESSION_RESET', 'Cleared session memory and recent conversation');
  }

  // --------------------------------------------------------------------------
  // 3. PROJECT KNOWLEDGE LAYER (Section 23: /project)
  // --------------------------------------------------------------------------
  getProjectKnowledgeLayer() {
    return this.data.projectKnowledgeLayer || this.getDefaultData().projectKnowledgeLayer;
  }

  getUserPreferences() {
    return this.data.userPreferences || this.getDefaultData().userPreferences;
  }

  // --------------------------------------------------------------------------
  // 4. CONTEXT RESOLUTION ENGINE (Section 24: Context Priority Hierarchy)
  // --------------------------------------------------------------------------
  resolveContext(query = '') {
    const q = (query || '').toLowerCase();
    const shortTerm = this.shortTermMemory.slice(-4);
    const session = this.sessionMemory;
    const prefs = this.getUserPreferences();
    const proj = this.getProjectKnowledgeLayer();

    const lines = [];

    // Priority 1 & 2: Active Session Goal & Working Context
    if (session.activeGoal) {
      lines.push(`ACTIVE SESSION GOAL: "${session.activeGoal}" (Technology: ${session.activeTechnology || 'Inferred'})`);
    }
    if (session.activeTopic) {
      lines.push(`CURRENT DOMAIN TOPIC: ${session.activeTopic}`);
    }

    // Priority 3 & 4: Relevant Project Architecture & Standards
    lines.push(`CORE ARCHITECTURE: ${proj.architecture.style}`);
    lines.push(`CODING CONVENTIONS: ${prefs.codingConventions}`);

    // Priority 5: Recent Dialogue Context
    if (shortTerm.length > 0) {
      const recentHistory = shortTerm.map(m => `${m.role.toUpperCase()}: ${m.text.substring(0, 100)}`).join(' | ');
      lines.push(`RECENT CONVERSATION HISTORY: ${recentHistory}`);
    }

    return lines.join('\n');
  }

  logAudit(actionType, description, details = {}) {
    const log = {
      id: 'audit-' + Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      actionType,
      description,
      details
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) this.auditLogs.pop();
  }
}

export const memoryStore = new MemoryStore();
