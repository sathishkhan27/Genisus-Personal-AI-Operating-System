// GENISUS — Intent & Context Intelligence Core
// Implements Section 2, 3, 4, 18, 19 of the Genisus AI Master Requirements:
// - Intent Understanding & Task Classification across 25+ structured categories
// - Context Awareness: Resolves elliptical phrases and multi-turn continuations (e.g. "Spring Boot" -> "Add JWT")
// - Response Mode Auto-Selection (Quick Mode, Detailed Mode, Dev Agent Mode, Research Mode, Planning Mode)
// - Pragmatic Intent Interpretation (e.g., "passport received" -> drafts professional acknowledgement)

export const INTENT_CATEGORIES = {
  GENERAL_QUESTION: 'GENERAL_QUESTION',
  EXPLANATION: 'EXPLANATION',
  CODING_NEW: 'CODING_NEW',
  CODE_MODIFICATION: 'CODE_MODIFICATION',
  BUG_FIXING: 'BUG_FIXING',
  DEBUGGING: 'DEBUGGING',
  REFACTORING: 'REFACTORING',
  ARCHITECTURE: 'ARCHITECTURE',
  PROJECT_PLANNING: 'PROJECT_PLANNING',
  DOCUMENTATION: 'DOCUMENTATION',
  RESEARCH: 'RESEARCH',
  REALTIME_INFO: 'REALTIME_INFO',
  FILE_ANALYSIS: 'FILE_ANALYSIS',
  REPO_ANALYSIS: 'REPO_ANALYSIS',
  DATA_ANALYSIS: 'DATA_ANALYSIS',
  AUTOMATION: 'AUTOMATION',
  DEPLOYMENT: 'DEPLOYMENT',
  DEVOPS: 'DEVOPS',
  TESTING: 'TESTING',
  SECURITY: 'SECURITY',
  COMPARISON: 'COMPARISON',
  RECOMMENDATION: 'RECOMMENDATION',
  PROFESSIONAL_RESPONSE: 'PROFESSIONAL_RESPONSE',
  GOVERNANCE: 'GOVERNANCE',
  WORKFLOW: 'WORKFLOW',
  CONVERSATION: 'CONVERSATION'
};

export const RESPONSE_MODES = {
  QUICK_MODE: 'QUICK_MODE',         // Concise, direct answer for simple questions
  DETAILED_MODE: 'DETAILED_MODE',   // Structured explanation & code for learning/architecture
  DEV_AGENT_MODE: 'DEV_AGENT_MODE', // Workspace repository inspection, file editing, test validation
  RESEARCH_MODE: 'RESEARCH_MODE',   // Broad knowledge synthesis or dynamic data
  PLANNING_MODE: 'PLANNING_MODE'    // Multi-step task decomposition and roadmap
};

export class IntentClassifier {
  constructor() {
    this.name = 'Genisus Intent & Context Engine';
  }

  /**
   * Classify user input considering current query, conversation history, and active session context.
   * @param {string} query Raw user request
   * @param {Object} context Session and conversation context from MemoryStore
   * @returns {Object} Structured intent classification
   */
  classify(query, context = {}) {
    const raw = query.trim();
    const lower = raw.toLowerCase();
    const isTamil = /[\u0B80-\u0BFF]/.test(raw) || (context.preferredLanguage && context.preferredLanguage.startsWith('ta'));

    // 1. Check for Pragmatic Intent (e.g. "passport received", "email sent", "meeting completed")
    const pragmaticIntent = this.detectPragmaticIntent(raw, lower, isTamil);
    if (pragmaticIntent) {
      return pragmaticIntent;
    }

    // 2. Check for Multi-Turn Elliptical Continuation (e.g. user previously asked "Create login API", now says "Spring Boot", then "Add JWT")
    const continuation = this.detectContinuation(raw, lower, context);
    if (continuation.isContinuation) {
      return this.enrichClassification({
        category: continuation.category,
        mode: RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: continuation.resolvedQuery,
        extractedEntities: continuation.extractedEntities || {},
        isElliptical: true,
        isMultiTurnContinuation: true,
        originalQuery: raw,
        confidence: 0.94,
        requiredTools: ['file_editor', 'test_runner', 'git_bridge']
      }, isTamil);
    }

    // 3. Bug Fixing & Debugging
    if (
      lower.includes('fix ') || lower.includes('bug') || lower.includes('error') ||
      lower.includes('exception') || lower.includes('crash') || lower.includes('failing') ||
      lower.includes('சரிசெய்') || lower.includes('பிழை') || lower.includes('பிரச்சனை')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.BUG_FIXING,
        mode: RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: raw,
        confidence: 0.92,
        requiredTools: ['file_inspector', 'test_runner', 'git_bridge']
      }, isTamil);
    }

    // 4. Code Modification & Refactoring
    if (
      lower.includes('add ') || lower.includes('modify ') || lower.includes('update ') ||
      lower.includes('refactor') || lower.includes('implement ') || lower.includes('change ') ||
      lower.includes('சேர்') || lower.includes('மாற்று')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.CODE_MODIFICATION,
        mode: RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: raw,
        confidence: 0.89,
        requiredTools: ['file_editor', 'test_runner']
      }, isTamil);
    }

    // 5. Code Generation / New Architecture
    if (
      lower.startsWith('create ') || lower.startsWith('build ') || lower.startsWith('write ') ||
      lower.startsWith('generate ') || lower.startsWith('make ') || lower.includes('write code') ||
      lower.includes('உருவாக்கு') || lower.includes('எழுது')
    ) {
      const isMultiStep = lower.includes(' and ') || lower.includes(' with ') || lower.includes('service') || lower.split(' ').length > 8;
      return this.enrichClassification({
        category: INTENT_CATEGORIES.CODING_NEW,
        mode: isMultiStep ? RESPONSE_MODES.PLANNING_MODE : RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: raw,
        confidence: 0.90,
        requiredTools: isMultiStep ? ['task_planner', 'file_editor'] : ['file_editor']
      }, isTamil);
    }

    // 6. Project Planning & Multi-Step Roadmaps
    if (
      lower.includes('roadmap') || lower.includes('plan ') || lower.includes('phases') ||
      lower.includes('architecture plan') || lower.includes('திட்டம்') || lower.includes('வரைபடம்')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.PROJECT_PLANNING,
        mode: RESPONSE_MODES.PLANNING_MODE,
        resolvedQuery: raw,
        confidence: 0.88,
        requiredTools: ['task_planner']
      }, isTamil);
    }

    // 7. Architecture & Technology Comparison
    if (
      lower.includes(' vs ') || lower.includes('difference between') || lower.includes('compare ') ||
      lower.includes('clean architecture') || lower.includes('bloc vs') || lower.includes('வித்தியாசம்')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.ARCHITECTURE,
        mode: RESPONSE_MODES.DETAILED_MODE,
        resolvedQuery: raw,
        confidence: 0.91,
        requiredTools: ['knowledge_base']
      }, isTamil);
    }

    // 8. Testing & QA
    if (
      lower.includes('test ') || lower.includes('run tests') || lower.includes('unit test') ||
      lower.includes('integration test') || lower.includes('சோதனை')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.TESTING,
        mode: RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: raw,
        confidence: 0.95,
        requiredTools: ['test_runner']
      }, isTamil);
    }

    // 9. DevOps, Git, Deployment & Cloud
    if (
      lower.includes('commit') || lower.includes('push') || lower.includes('deploy') ||
      lower.includes('git ') || lower.includes('docker') || lower.includes('branch') ||
      lower.includes('status') || lower.includes('கமிட்')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.DEVOPS,
        mode: RESPONSE_MODES.DEV_AGENT_MODE,
        resolvedQuery: raw,
        confidence: 0.93,
        requiredTools: ['git_bridge', 'cloud_telemetry']
      }, isTamil);
    }

    // 10. Real-time / Dynamic Information
    if (
      lower.includes('latest version') || lower.includes('today') || lower.includes('current price') ||
      lower.includes('market') || lower.includes('rate') || lower.includes('news') ||
      lower.includes('தற்போதைய') || lower.includes('இன்றைய')
    ) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.REALTIME_INFO,
        mode: RESPONSE_MODES.RESEARCH_MODE,
        resolvedQuery: raw,
        confidence: 0.85,
        requiredTools: ['world_intelligence', 'web_search']
      }, isTamil);
    }

    // 11. Simple Questions vs Complex Explanations
    const wordCount = raw.split(/\s+/).length;
    if (wordCount <= 5 && (lower.startsWith('what is') || lower.startsWith('define') || lower.startsWith('என்ன'))) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.GENERAL_QUESTION,
        mode: RESPONSE_MODES.QUICK_MODE,
        resolvedQuery: raw,
        confidence: 0.90,
        requiredTools: []
      }, isTamil);
    }

    if (lower.startsWith('explain') || lower.startsWith('how does') || lower.startsWith('விளக்கு')) {
      return this.enrichClassification({
        category: INTENT_CATEGORIES.EXPLANATION,
        mode: RESPONSE_MODES.DETAILED_MODE,
        resolvedQuery: raw,
        confidence: 0.88,
        requiredTools: ['knowledge_base']
      }, isTamil);
    }

    // 12. Fallback General Question / Conversation
    return this.enrichClassification({
      category: INTENT_CATEGORIES.GENERAL_QUESTION,
      mode: wordCount < 6 ? RESPONSE_MODES.QUICK_MODE : RESPONSE_MODES.DETAILED_MODE,
      resolvedQuery: raw,
      confidence: 0.75,
      requiredTools: []
    }, isTamil);
  }

  detectPragmaticIntent(raw, lower, isTamil) {
    // Example from Master Requirement Section 3:
    // User says "passport received" -> user wants a polite, professional reply acknowledgment
    if (
      lower === 'passport received' || lower.includes('received passport') ||
      lower === 'parcel received' || lower === 'got the email' || lower === 'package delivered' ||
      lower === 'document received'
    ) {
      return {
        category: INTENT_CATEGORIES.PROFESSIONAL_RESPONSE,
        mode: RESPONSE_MODES.QUICK_MODE,
        resolvedQuery: `Draft professional receipt acknowledgement for: "${raw}"`,
        isElliptical: false,
        confidence: 0.98,
        requiredTools: [],
        suggestedDraft: isTamil
          ? 'வணக்கம். நான் கடவுச்சீட்டை (Passport) பெற்றுக்கொண்டேன். தங்களின் உடனடி சேவைக்கு மிக்க நன்றி.'
          : 'Good day. I confirm that I have safely received my passport. Thank you very much for your prompt assistance and support.'
      };
    }
    return null;
  }

  detectContinuation(raw, lower, context) {
    const session = context.sessionMemory || {};
    const lastGoal = session.activeGoal || '';
    const lastTopic = session.activeTopic || '';

    if (!lastGoal && !lastTopic) {
      return { isContinuation: false };
    }

    // Technology keywords that often appear as elliptical turn 2 (e.g. "Spring Boot", "Flutter", "React", "FastAPI")
    const techModifiers = [
      'spring boot', 'flutter', 'react', 'next.js', 'vue', 'python', 'fastapi',
      'express', 'nodejs', 'node', 'django', 'go', 'golang', 'rust', 'kotlin', 'swift', 'dart'
    ];

    if (techModifiers.includes(lower)) {
      return {
        isContinuation: true,
        category: INTENT_CATEGORIES.CODING_NEW,
        resolvedQuery: `${lastGoal} using ${raw}`,
        extractedEntities: { technology: raw }
      };
    }

    // Feature additions that appear as turn 3 (e.g. "Add JWT", "Add pagination", "Add dark mode")
    if (lower.startsWith('add ') || lower.startsWith('with ') || lower.startsWith('also ')) {
      const addition = raw.replace(/^(add|with|also)\s+/i, '').trim();
      return {
        isContinuation: true,
        category: INTENT_CATEGORIES.CODE_MODIFICATION,
        resolvedQuery: `Add ${addition} to ${lastGoal || lastTopic}`
      };
    }

    // Testing/Fixing references (e.g. "how to test it?", "test it", "fix it")
    if (lower === 'test it' || lower === 'how to test it' || lower === 'run it') {
      return {
        isContinuation: true,
        category: INTENT_CATEGORIES.TESTING,
        resolvedQuery: `Test and validate implementation for ${lastGoal || lastTopic}`
      };
    }

    return { isContinuation: false };
  }

  enrichClassification(obj, isTamil) {
    return {
      ...obj,
      isTamil,
      timestamp: new Date().toISOString()
    };
  }
}

export const intentClassifier = new IntentClassifier();
