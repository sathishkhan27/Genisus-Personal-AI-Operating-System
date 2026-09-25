// GENISUS — Agent Marketplace & Dynamic Worker Registry
// Provides an extensible architecture where specialized agents can be dynamically added,
// versioned, monitored, and audited under strict security governance.

export class AgentMarketplace {
  constructor() {
    this.agents = new Map();
    this.initDefaultMarketplace();
  }

  registerAgent(agentConfig) {
    const requiredFields = ['id', 'name', 'purpose', 'version', 'permissions', 'tools', 'securityPolicy'];
    for (const field of requiredFields) {
      if (!agentConfig[field]) {
        throw new Error(`Agent registration error: Missing required field "${field}"`);
      }
    }

    const fullConfig = {
      status: 'ACTIVE', // ACTIVE, PAUSED, DEPRECATED, TESTING
      health: 'HEALTHY', // HEALTHY, DEGRADED, OFFLINE
      latencyAvg: '18ms',
      totalInvocations: 0,
      model: agentConfig.model || 'gpt-6-astra-omni',
      temperature: agentConfig.temperature ?? 0.7,
      maxTokens: agentConfig.maxTokens ?? 2048,
      riskLevel: agentConfig.riskLevel || 'MEDIUM',
      requiresApproval: agentConfig.requiresApproval ?? false,
      systemPrompt: agentConfig.systemPrompt || '',
      inputSchema: agentConfig.inputSchema || { query: 'string', language: 'string' },
      outputSchema: agentConfig.outputSchema || { speechText: 'string', displayText: 'string', data: 'object' },
      testSuite: agentConfig.testSuite || ['Unit smoke test', 'Security policy validation'],
      createdAt: new Date().toISOString(),
      ...agentConfig
    };

    this.agents.set(agentConfig.id, fullConfig);
    return fullConfig;
  }

  createEnterpriseAgent({
    name,
    purpose,
    model = 'gpt-6-astra-omni',
    systemPrompt = '',
    temperature = 0.7,
    maxTokens = 2048,
    tools = [],
    permissions = [],
    riskLevel = 'MEDIUM',
    requiresApproval = false,
    securityPolicy = 'Zero-trust runtime policy'
  }) {
    const id = `agent-${name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const newAgent = this.registerAgent({
      id,
      name,
      purpose,
      version: '1.0.0',
      model,
      systemPrompt,
      temperature,
      maxTokens,
      tools,
      permissions,
      riskLevel,
      requiresApproval,
      securityPolicy
    });
    return newAgent;
  }

  getAgent(id) {
    return this.agents.get(id);
  }

  listAgents() {
    return Array.from(this.agents.values());
  }

  initDefaultMarketplace() {
    // 1. PersonalAgent
    this.registerAgent({
      id: 'personal-agent',
      name: 'PersonalAgent (JARVIS Lifestyle & Agenda)',
      version: '2.4.0',
      purpose: 'Coordinates daily tasks, priorities, calendar, personal notes, and time-aware workflows.',
      tools: ['memory_store', 'knowledge_rag', 'priority_matrix'],
      permissions: ['READ_PERSONAL_DOCS', 'WRITE_LOCAL_TASKS'],
      securityPolicy: 'Strict isolation of personal health, family, and financial notes.'
    });

    // 2. BusinessAgent (GENISUS Business Brain)
    this.registerAgent({
      id: 'business-agent',
      name: 'BusinessAgent (GENISUS Business Brain)',
      version: '3.1.0',
      purpose: 'Tracks revenue pipelines, pricing elasticity, CAC/LTV, competitor gaps, and SaaS metrics.',
      tools: ['neon_db', 'analytics_engine', 'financial_models'],
      permissions: ['READ_BUSINESS_TELEMETRY', 'GENERATE_FINANCIAL_REPORTS'],
      securityPolicy: 'Encrypted storage for corporate and revenue telemetry.'
    });

    // 3. RevenueAgent
    this.registerAgent({
      id: 'revenue-agent',
      name: 'RevenueAgent (Opportunity & Monetization Engine)',
      version: '2.8.0',
      purpose: 'Discovers micro-SaaS opportunities, digital product niches, and automated revenue funnels.',
      tools: ['market_scanner', 'seo_crawler', 'pricing_matrix'],
      permissions: ['SCAN_MARKET_TRENDS', 'FORMULATE_MVP_PLANS'],
      securityPolicy: 'Read-only external market research; zero automated financial commitments.'
    });

    // 4. ResearchAgent
    this.registerAgent({
      id: 'research-agent',
      name: 'ResearchAgent (Deep Synthesis & Academic Intel)',
      version: '2.1.0',
      purpose: 'Conducts multi-source investigation across science, AI architectures, and technical papers.',
      tools: ['web_search', 'arxiv_reader', 'citation_validator'],
      permissions: ['READ_PUBLIC_WEB', 'CROSS_CHECK_SOURCES'],
      securityPolicy: 'Mandatory source citation with confidence metrics; zero ungrounded facts.'
    });

    // 5. CodingAgent (AI Developer Agent)
    this.registerAgent({
      id: 'coding-agent',
      name: 'CodingAgent (AI Software Engineering Agent)',
      version: '4.0.0-LiveGit',
      purpose: 'Autonomous repository navigation, code analysis, non-breaking refactoring, testing, and git operations.',
      tools: ['git_cli', 'node_build_runner', 'ide_bridge', 'ast_parser'],
      permissions: ['READ_WORKSPACE_FILES', 'WRITE_WORKSPACE_FILES', 'RUN_LOCAL_TESTS'],
      securityPolicy: 'Zero silent pushes. Explicit operator confirmation required for remote git changes.'
    });

    // 6. ProductAgent (Product Vision & Intelligence)
    this.registerAgent({
      id: 'product-agent',
      name: 'ProductAgent (Universal Product Intelligence & 3D HUD)',
      version: '2.5.0',
      purpose: 'Physical product identification, OCR, price comparison, specification audit, and 3D rendering.',
      tools: ['camera_stream', 'ocr_engine', 'pricing_db', 'three_js_renderer'],
      permissions: ['ACCESS_CAMERA', 'QUERY_PRODUCT_APIS'],
      securityPolicy: 'No unauthorized image uploads or telemetry transmission.'
    });

    // 7. HealthAgent
    this.registerAgent({
      id: 'health-agent',
      name: 'HealthAgent (Biometric & Vitality Companion)',
      version: '1.9.0',
      purpose: 'Monitors sleep patterns, hydration, posture, recovery, and cognitive ergonomics.',
      tools: ['biometric_sensors', 'hydration_tracker', 'sleep_analyzer'],
      permissions: ['READ_WELLNESS_DATA'],
      securityPolicy: 'Non-diagnostic wellness guidance only. Emergency medical disclaimer enforced.'
    });

    // 8. FinanceAgent
    this.registerAgent({
      id: 'finance-agent',
      name: 'FinanceAgent (Personal Portfolio & Wealth Strategy)',
      version: '2.0.0',
      purpose: 'Portfolio tracking, dividend analysis, currency hedging, and budget forecasting.',
      tools: ['market_tickers', 'exchange_rates_api', 'tax_calculator'],
      permissions: ['READ_PORTFOLIO_TELEMETRY'],
      securityPolicy: 'Strict read-only analysis. No execution of monetary transactions.'
    });

    // 9. TravelAgent
    this.registerAgent({
      id: 'travel-agent',
      name: 'TravelAgent (Logistics & Itinerary Orchestrator)',
      version: '1.5.0',
      purpose: 'Optimal travel route planning, flight tracking, hotel reviews, and weather forecasting.',
      tools: ['maps_platform', 'weather_api', 'flight_tracker'],
      permissions: ['READ_CALENDAR', 'QUERY_TRANSIT_APIS'],
      securityPolicy: 'Privacy-first location caching; zero persistent location sharing.'
    });

    // 10. EducationAgent
    this.registerAgent({
      id: 'education-agent',
      name: 'EducationAgent (Adaptive Skill & Career Tutor)',
      version: '2.2.0',
      purpose: 'Generates structured technical roadmaps, interactive coding quizzes, and concept explanations.',
      tools: ['curriculum_graph', 'code_sandbox', 'quiz_engine'],
      permissions: ['READ_LEARNING_GOALS'],
      securityPolicy: 'Socratic tutoring mode; verified pedagogical sources.'
    });

    // 11. SecurityAgent
    this.registerAgent({
      id: 'security-agent',
      name: 'SecurityAgent (Zero-Trust Guardrails & Audit Core)',
      version: '3.0.0',
      purpose: 'Enforces permission policies, scans for leaked API keys/tokens, and blocks silent privilege escalation.',
      tools: ['secret_scanner', 'audit_logger', 'permission_gate'],
      permissions: ['AUDIT_ALL_OPERATIONS', 'INTERCEPT_UNAUTHORIZED_ACTIONS'],
      securityPolicy: 'Immutable audit logs. Cannot be bypassed or silenced by any agent.'
    });

    // 12. AutomationAgent
    this.registerAgent({
      id: 'automation-agent',
      name: 'AutomationAgent (Smart Environment & Cron Scheduler)',
      version: '2.3.0',
      purpose: 'Orchestrates background timers, recurring health checks, desktop window management, and device control.',
      tools: ['system_timer', 'cron_executor', 'hardware_bridge'],
      permissions: ['MANAGE_LOCAL_ALARMS', 'DISPATCH_BACKGROUND_TASKS'],
      securityPolicy: 'Operator-killable processes with isolated sandboxing.'
    });

    // 13. VisionAgent
    this.registerAgent({
      id: 'vision-agent',
      name: 'VisionAgent (Real-Time Spatial & Optical Intelligence)',
      version: '2.6.0',
      purpose: 'Analyzes live webcam video, detects physical objects, reads diagrams, and guides spatial awareness.',
      tools: ['webcam_driver', 'object_detection', 'scene_graph'],
      permissions: ['STREAM_LOCAL_VIDEO'],
      securityPolicy: 'Local client-side frame processing; ephemeral memory retention.'
    });

    // 14. VoiceAgent
    this.registerAgent({
      id: 'voice-agent',
      name: 'VoiceAgent (Multilingual Acoustic Engine & TTS/STT)',
      version: '3.5.0',
      purpose: 'Continuous hotword detection, speech synthesis in Tamil and English, acoustic audio visualization.',
      tools: ['web_speech_api', 'audio_synthesizer', 'fourier_visualizer'],
      permissions: ['ACCESS_MICROPHONE', 'SPEAKER_OUTPUT'],
      securityPolicy: 'Local voice processing; instant mute on operator command.'
    });

    // 15. DataAgent
    this.registerAgent({
      id: 'data-agent',
      name: 'DataAgent (Relational SQL & Knowledge Graph Miner)',
      version: '2.7.0',
      purpose: 'Executes parameterized queries across Neon PostgreSQL, vector indexes, and relational schemas.',
      tools: ['postgres_driver', 'sql_parser', 'vector_search'],
      permissions: ['EXECUTE_SELECT_QUERIES'],
      securityPolicy: 'Strict read-only query sandboxing. DROP / TRUNCATE operations categorically blocked.'
    });

    // 16. MarketAgent
    this.registerAgent({
      id: 'market-agent',
      name: 'MarketAgent (Global Macroeconomic & Tech Trend Sentinel)',
      version: '2.9.0',
      purpose: 'Monitors global stock indexes, commodity benchmarks, AI semiconductor demand, and venture funding.',
      tools: ['global_intel_feed', 'sec_filings_api', 'trend_correlator'],
      permissions: ['QUERY_PUBLIC_MARKET_DATA'],
      securityPolicy: 'Strict fact tagging: distinguishes historical facts from speculative projections.'
    });

    // 17. WritingEnhancerAgent (from ForestStudentView/ai-writing-assistant-enhancer)
    this.registerAgent({
      id: 'writing-enhancer-agent',
      name: 'WritingEnhancerAgent (AI Writing Assistant & Content Polisher)',
      version: '3.5.0-Astra',
      purpose: 'Real-time grammar correction, tone shifting (Jarvis, Executive, Academic, Tamil), vocabulary elevation, and technical doc generation inspired by ForestStudentView/ai-writing-assistant-enhancer.',
      tools: ['writing_assistant_engine', 'grammar_checker', 'tone_modulator', 'doc_generator'],
      permissions: ['ENHANCE_LOCAL_TEXT', 'GENERATE_DOCUMENTATION'],
      securityPolicy: 'Zero text telemetry leaked; processing conducted in local/sandboxed memory.'
    });

    // 18. JarvisSystemAgent (from github.com/topics/jarvis-ai)
    this.registerAgent({
      id: 'jarvis-system-agent',
      name: 'JarvisSystemAgent (JARVIS Desktop & OS Automation Hub)',
      version: '4.2.0-Jarvis',
      purpose: 'Voice-first OS desktop command execution, application launching, hardware telemetry, and automated research protocols inspired by github.com/topics/jarvis-ai.',
      tools: ['system_bridge', 'app_launcher', 'hardware_telemetry', 'whisper_voice_mesh'],
      permissions: ['LAUNCH_APPROVED_IDES', 'QUERY_SYSTEM_HARDWARE', 'EXECUTE_DEV_PIPELINES'],
      securityPolicy: 'Strict 6-Factor Decision Framework enforced before any OS command execution.'
    });

    // 19. LLMTaskAgent (Dedicated LLM Task & Activity Orchestrator)
    this.registerAgent({
      id: 'llm-task-agent',
      name: 'LLMTaskAgent (General Purpose LLM Task & Activity Coordinator)',
      version: '4.0.0-AstraMesh',
      purpose: 'Converts high-level goals into multi-agent sub-activities, schedules tasks, manages dependencies, and tracks real-time activity lifecycles.',
      tools: ['llm_reasoning_mesh', 'activity_tracker', 'task_planner', 'agent_delegator'],
      permissions: ['CREATE_TASKS', 'DISPATCH_ACTIVITIES', 'UPDATE_KNOWLEDGE_BASE'],
      securityPolicy: 'Strict permission boundary check before cross-agent delegation.'
    });
  }
}

export const agentMarketplace = new AgentMarketplace();
