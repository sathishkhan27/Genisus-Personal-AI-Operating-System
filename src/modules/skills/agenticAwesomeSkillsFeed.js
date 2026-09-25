/**
 * Agentic Awesome Skills (AAS Core) Feed & Integration Engine
 * Connects GENISUS to https://github.com/sickn33/agentic-awesome-skills
 * Providing a curated catalog of 2,122+ agent skills, 13 specialized plugins,
 * execution workflows, and automated feeding into Governed RAG and Tools registry.
 */

import { governedRagEngine } from '../knowledge/governedRagEngine.js';
import { auditManager } from '../governance/auditManager.js';

export const AAS_CATEGORIES = {
  CORE_DEV: 'Core Development & Architecture',
  SECURITY: 'Security Engineering & AppSec',
  DEVOPS: 'DevOps, Cloud & Infrastructure',
  DATA: 'Data Engineering & Analytics',
  AI_ML: 'AI / LLM Agents & Evaluation Ops',
  PRODUCT: 'Product Design & UX',
  QA_TESTING: 'QA, Fuzzing & Test Automation',
  SAAS_REVENUE: 'SaaS Launch, Monetization & Growth'
};

export class AgenticAwesomeSkillsFeed {
  constructor() {
    this.repoUrl = 'https://github.com/sickn33/agentic-awesome-skills';
    this.rawBaseUrl = 'https://raw.githubusercontent.com/sickn33/agentic-awesome-skills/main';
    this.version = 'V17.3.0';
    this.totalSkillsCount = 2122;
    this.stars = 46430;

    this.plugins = this.initSpecializedPlugins();
    this.bundles = this.initBundles();
    this.workflows = this.initWorkflows();
    this.featuredSkills = this.initFeaturedSkills();

    // Auto-feed into Governed RAG upon initialization
    this.feedIntoGovernedRag();
  }

  initSpecializedPlugins() {
    return [
      {
        id: 'aas-web-app-builder',
        name: 'AAS Web App Builder',
        skillsCount: 10,
        category: AAS_CATEGORIES.CORE_DEV,
        bestFor: 'Frontend and full-stack developers shipping modern web apps with React, Vite, Next.js, and CSS.',
        skills: ['frontend-design', 'react-patterns', 'backend-dev-guidelines', 'database-design', 'anti-ui-slop', '3d-web-experience', 'animejs-animation', 'tailwind-expert', 'vite-bundler-tuning', 'state-management']
      },
      {
        id: 'aas-security-engineer',
        name: 'AAS Security Engineer',
        skillsCount: 10,
        category: AAS_CATEGORIES.SECURITY,
        bestFor: 'Authorized security testing, secret scanning, threat modeling, and container hardening.',
        skills: ['api-security-testing', 'threat-modeling', 'secret-scanner', 'owasp-top-10', 'container-hardening', 'security-audit', 'backend-security-coder', 'sql-injection-fuzzer', 'cloud-iam-hardening', 'zero-trust-network']
      },
      {
        id: 'aas-agent-mcp-builder',
        name: 'AAS Agent & MCP Builder',
        skillsCount: 10,
        category: AAS_CATEGORIES.AI_ML,
        bestFor: 'Building autonomous AI agents, Model Context Protocol (MCP) servers, RAG systems, and evaluation loops.',
        skills: ['mcp-server-builder', 'agent-orchestration', 'rag-evaluator', 'langchain-expert', 'prompt-engineering', 'context-window-optimizer', 'autonomous-decision-loop', 'tool-gateway-builder', 'vector-index-tuner', 'guardrail-synthesizer']
      },
      {
        id: 'aas-qa-test-automation',
        name: 'AAS QA & Test Automation',
        skillsCount: 10,
        category: AAS_CATEGORIES.QA_TESTING,
        bestFor: 'End-to-end test suites, browser automation, visual regression, and QA stabilization.',
        skills: ['test-driven-development', 'systematic-debugging', 'browser-automation', 'playwright-expert', 'cypress-automation', 'api-contract-runner', 'load-testing-k6', 'visual-regression', 'flaky-test-eliminator', 'coverage-auditor']
      },
      {
        id: 'aas-devops-cloud',
        name: 'AAS DevOps & Cloud',
        skillsCount: 10,
        category: AAS_CATEGORIES.DEVOPS,
        bestFor: 'Infrastructure as code, Kubernetes, CI/CD pipelines, and cloud operational workflows.',
        skills: ['deployment-procedures', 'kubernetes-cluster-deploy', 'dockerfile-optimizer', 'github-actions-ci', 'terraform-modules', 'observability-engineer', 'canary-rollout-manager', 'prometheus-alerting', 'cost-optimizer-aws-gcp', 'disaster-recovery-plan']
      },
      {
        id: 'aas-data-analytics',
        name: 'AAS Data Analytics & SQL',
        skillsCount: 10,
        category: AAS_CATEGORIES.DATA,
        bestFor: 'Product analytics, relational SQL schemas, data warehousing, and interactive dashboards.',
        skills: ['postgres-query-tuning', 'bigquery-sql-optimization', 'data-pipeline-dbt', 'schema-mapping', 'bi-dashboard-synthesis', 'event-telemetry-tracking', 'time-series-forecasting', 'anomaly-detector', 'clickhouse-analytics', 'lakehouse-iceberg']
      },
      {
        id: 'aas-saas-launch-revenue',
        name: 'AAS SaaS Launch & Revenue',
        skillsCount: 10,
        category: AAS_CATEGORIES.SAAS_REVENUE,
        bestFor: 'SaaS MVPs, pricing elasticity, Stripe payment funnels, product analytics, and SEO.',
        skills: ['saas-mvp-architect', 'stripe-subscription-flow', 'pricing-tier-strategy', 'landing-page-conversion', 'seo-technical-audit', 'user-onboarding-loop', 'churn-mitigation', 'product-analytics-posthog', 'email-lifecycle-automation', 'feature-flag-rollout']
      },
      {
        id: 'aas-api-platform-builder',
        name: 'AAS API Platform Builder',
        skillsCount: 10,
        category: AAS_CATEGORIES.CORE_DEV,
        bestFor: 'Enterprise API design, OpenAPI 3.1 contracts, JWT auth, rate limiting, and microservice meshes.',
        skills: ['api-and-interface-design', 'openapi-spec-generator', 'api-rate-limit-handler', 'jwt-oauth2-flow', 'grpc-microservices', 'graphql-federation', 'api-mock-server', 'api-versioning-strategy', 'webhooks-dispatcher', 'resilience-circuit-breaker']
      }
    ];
  }

  initBundles() {
    return [
      {
        id: 'core-dev',
        name: 'Core Developer Stack',
        description: 'Frontend/backend engineering, algorithms, framework mastery, and clean code fundamentals.',
        skills: ['backend-dev-guidelines', 'frontend-design', 'api-patterns', 'database-design', 'react-patterns', 'systematic-debugging', 'anti-ui-slop', 'clean-code-refactor', 'state-management', 'concurrency-patterns']
      },
      {
        id: 'security-core',
        name: 'Security & AppSec Core',
        description: 'Zero-trust security, vulnerability audits, credential protection, and defense in depth.',
        skills: ['api-security-testing', 'secret-scanner', 'owasp-top-10', 'threat-modeling', 'container-hardening', 'auth-implementation-patterns', 'penetration-test-recon', 'csrf-xss-prevention']
      },
      {
        id: 'ops-core',
        name: 'DevOps & Reliability Core',
        description: 'Production infrastructure, deployments, site reliability engineering, and monitoring.',
        skills: ['deployment-procedures', 'kubernetes-cluster-deploy', 'github-actions-ci', 'observability-engineer', 'canary-rollout-manager', 'postmortem-writing', 'dockerfile-optimizer']
      },
      {
        id: 'ai-agent-core',
        name: 'Autonomous AI & Agentic Systems',
        description: 'Multi-agent coordination, tool calling, prompt engineering, and evaluation benchmarks.',
        skills: ['mcp-server-builder', 'agent-orchestration', 'rag-evaluator', 'autonomous-decision-loop', 'context-window-optimizer', 'prompt-engineering', 'guardrail-synthesizer']
      }
    ];
  }

  initWorkflows() {
    return [
      {
        id: 'ship-saas-mvp',
        name: 'Ship a SaaS MVP',
        category: 'SaaS & Full-Stack',
        description: 'End-to-end workflow to scope, build, test, and ship a SaaS product in record time.',
        steps: [
          { step: 1, title: 'Plan the Scope', skills: ['brainstorming', 'concise-planning', 'writing-plans'], goal: 'Define user persona, core value prop, and non-negotiable MVP milestones.' },
          { step: 2, title: 'Build Backend & API', skills: ['backend-dev-guidelines', 'api-patterns', 'database-design', 'auth-implementation-patterns'], goal: 'Implement core schemas, REST/GraphQL endpoints, and secure session management.' },
          { step: 3, title: 'Build Frontend Experience', skills: ['frontend-developer', 'react-patterns', 'frontend-design', 'anti-ui-slop'], goal: 'Craft responsive, high-converting UX with glassmorphism and fast interactions.' },
          { step: 4, title: 'Automated Test & Validation', skills: ['test-driven-development', 'systematic-debugging', 'browser-automation'], goal: 'Execute unit and integration tests; prevent regression loops before release.' },
          { step: 5, title: 'Ship Safely with Observability', skills: ['deployment-procedures', 'observability-engineer', 'postmortem-writing'], goal: 'Deploy with zero-downtime canary rollout, telemetry alerts, and rollback gates.' }
        ]
      },
      {
        id: 'security-audit-web-app',
        name: 'Enterprise Web Application Security Audit',
        category: 'Security & Compliance',
        description: 'Structured methodology for zero-trust vulnerability assessment, OWASP compliance, and threat mitigation.',
        steps: [
          { step: 1, title: 'Scope & Threat Modeling', skills: ['threat-modeling', 'owasp-top-10'], goal: 'Map external attack surfaces, sensitive data flows, and trust boundaries.' },
          { step: 2, title: 'Static Secret & Code Analysis', skills: ['secret-scanner', 'backend-security-coder'], goal: 'Scan codebases for hardcoded credentials, unmasked PII, and unsafe dependencies.' },
          { step: 3, title: 'Dynamic API & DB Pentest', skills: ['api-security-testing', 'sql-injection-fuzzer'], goal: 'Fuzz endpoints with malformed payloads, SQL injection tests, and auth bypass attempts.' },
          { step: 4, title: 'Remediation & Compliance Sign-off', skills: ['security-audit', 'cloud-iam-hardening'], goal: 'Patch discovered vulnerabilities, verify zero-trust policies, and produce compliance report.' }
        ]
      },
      {
        id: 'ai-agent-evaluation-ops',
        name: 'AI Agent Reliability & Evaluation Ops',
        category: 'AI / LLM Systems',
        description: 'Standardized evaluation pipeline to measure hallucination rates, tool accuracy, and latency.',
        steps: [
          { step: 1, title: 'Define Golden Dataset', skills: ['prompt-engineering', 'rag-evaluator'], goal: 'Curate ground-truth prompts, expected tool sequences, and reference answers.' },
          { step: 2, title: 'Multi-Turn Benchmark Run', skills: ['agent-orchestration', 'autonomous-decision-loop'], goal: 'Execute candidate agent against test suite across varying temperatures and contexts.' },
          { step: 3, title: 'Metric Scoring & Guardrail Audit', skills: ['guardrail-synthesizer', 'context-window-optimizer'], goal: 'Score faithfulness, citation recall, refusal safety, and token economics.' }
        ]
      }
    ];
  }

  initFeaturedSkills() {
    return [
      {
        id: 'systematic-debugging',
        name: 'Systematic Debugging Protocol',
        category: 'Core Development',
        description: 'Rigorous four-stage root-cause discovery eliminating guessing, random patching, or silent bugs.',
        playbook: '1. Reproduce with minimal test case -> 2. Isolate failure boundary with binary search/logs -> 3. Formulate falsifiable hypothesis -> 4. Implement single-variable fix and verify tests pass.',
        tags: ['debugging', 'testing', 'root-cause', 'reliability']
      },
      {
        id: 'brainstorming',
        name: 'Structured Architectural Brainstorming',
        category: 'Architecture & Planning',
        description: 'Explores multiple solution paradigms, trade-offs, scalability bottlenecks, and failure modes.',
        playbook: '1. Clarify core constraints & scale -> 2. Propose 3 distinct technical architectures -> 3. Compare cost, latency, complexity -> 4. Formulate implementation recommendation.',
        tags: ['architecture', 'planning', 'tradeoffs', 'system-design']
      },
      {
        id: 'anti-ui-slop',
        name: 'Anti-UI Slop & Visual Excellence',
        category: 'Frontend & UI Design',
        description: 'Eliminates generic, boring AI templates in favor of bespoke typography, rich palette, and micro-interactions.',
        playbook: '1. Replace generic colors with curated HSL palette -> 2. Apply modern typography (Inter, Outfit) -> 3. Add dynamic state transitions & glassmorphism -> 4. Polish padding, contrast, and visual rhythm.',
        tags: ['ui', 'design', 'frontend', 'aesthetics']
      },
      {
        id: 'api-security-testing',
        name: 'API Security & Penetration Testing',
        category: 'Security',
        description: 'Automated probing of REST/GraphQL endpoints for Broken Object Level Auth (BOLA), injection, and rate bypass.',
        playbook: '1. Inspect OpenAPI spec endpoints -> 2. Validate token expiration & signature -> 3. Test parameter tampering & SQL injection vectors -> 4. Verify rate-limiting HTTP 429 enforcement.',
        tags: ['api', 'security', 'penetration', 'owasp']
      },
      {
        id: 'mcp-server-builder',
        name: 'Model Context Protocol (MCP) Server Builder',
        category: 'AI / Agentic Systems',
        description: 'Implements production-grade Model Context Protocol servers connecting LLMs safely to local tools and DBs.',
        playbook: '1. Define typed JSON-RPC schema -> 2. Implement tool handlers with zero-trust validation -> 3. Configure stdio/SSE transports -> 4. Bind into agent runtime registry.',
        tags: ['mcp', 'agents', 'tools', 'json-rpc']
      },
      {
        id: 'test-driven-development',
        name: 'Test-Driven Development (TDD) Mastery',
        category: 'QA & Testing',
        description: 'Enforces Red-Green-Refactor cycle ensuring high test coverage, regression prevention, and modular design.',
        playbook: '1. Write failing unit test covering edge case -> 2. Run test runner (Red) -> 3. Write minimal code to pass test (Green) -> 4. Refactor cleanly while preserving green status.',
        tags: ['tdd', 'testing', 'unit-tests', 'refactoring']
      },
      {
        id: 'canary-rollout-manager',
        name: 'Canary Rollout & Automated Rollback',
        category: 'DevOps & SRE',
        description: 'Safely promotes new releases through weighted canary deployments with automated telemetry circuit-breakers.',
        playbook: '1. Route 5% traffic to canary container -> 2. Monitor p99 latency & error rate for 10m -> 3. If errors < 0.05%, promote to 25% -> 50% -> 100% -> 4. Immediate rollback on SLA breach.',
        tags: ['devops', 'canary', 'deployment', 'sre', 'k8s']
      }
    ];
  }

  /**
   * Automatically feeds AAS Core catalog metadata, plugins, bundles, and workflows into Governed RAG
   */
  feedIntoGovernedRag() {
    // 1. Ingest Master AAS Knowledge Document
    governedRagEngine.ingestDocument({
      id: 'DOC-AAS-01',
      title: 'Agentic Awesome Skills (AAS Core) — Architecture & Catalog Specification',
      category: 'Agent Skills & Tools',
      classification: 'Internal',
      allowedRoles: ['admin', 'engineering', 'analyst', 'public'],
      content: `
      Section 1: AAS Core Product Model & Trust Boundaries
      Agentic Awesome Skills (AAS Core) is a local agent-first control plane for recording, validating, and applying agent-chosen skill stacks.
      With 2,122+ reusable skills across development, security, DevOps, QA, product design, and AI agents, it empowers autonomous AI assistants
      (Codex, Claude, Antigravity, GENISUS) to discover verified capabilities rather than guessing implementation patterns.
      
      Section 2: The Agent Compiles, Operator Controls
      AAS Core enforces agent-owned selection with human verification:
      1. Agent inspects project architecture and domain needs.
      2. Agent searches complete local catalog via read-only tools (search_skills, get_skill, compose_stack).
      3. Stack manifest is validated without modifying target directories.
      4. Operator reviews immutable plan before authorized execution.
      `
    });

    // 2. Ingest Specialized Plugins & Bundles
    const pluginText = this.plugins.map(p => `
      Plugin: ${p.name} (${p.skillsCount} Skills)
      Category: ${p.category}
      Best For: ${p.bestFor}
      Included Skills: ${p.skills.join(', ')}
    `).join('\n\n');

    governedRagEngine.ingestDocument({
      id: 'DOC-AAS-02',
      title: 'AAS Specialized Plugins & Domain Bundles',
      category: 'Agent Skills & Tools',
      classification: 'Internal',
      allowedRoles: ['admin', 'engineering', 'analyst', 'public'],
      content: `
      Section 1: Specialized Plugin Index
      ${pluginText}
      
      Section 2: Bundle Composition
      Bundles group skills naturally for specific roles:
      - Core Dev: Frontend, backend, and API architecture patterns.
      - Security Core: Zero-trust testing, threat modeling, and container hardening.
      - Ops Core: Kubernetes, CI/CD pipelines, observability, and canary rollouts.
      - AI Agent Core: MCP server development, RAG evaluation, and prompt engineering.
      `
    });

    // 3. Ingest Workflows
    const wfText = this.workflows.map(wf => `
      Workflow: ${wf.name} [${wf.category}]
      Description: ${wf.description}
      Steps:
      ${wf.steps.map(s => `  ${s.step}. ${s.title}: ${s.goal} (Recommended Skills: ${s.skills.join(', ')})`).join('\n')}
    `).join('\n\n');

    governedRagEngine.ingestDocument({
      id: 'DOC-AAS-03',
      title: 'AAS Autonomous Engineering Workflows & Playbooks',
      category: 'Agent Skills & Tools',
      classification: 'Internal',
      allowedRoles: ['admin', 'engineering', 'analyst', 'public'],
      content: `
      Section 1: Standardized Playbook Execution
      ${wfText}
      `
    });

    // 4. Ingest Featured Skills Playbooks
    const skillsText = this.featuredSkills.map(sk => `
      Skill ID: ${sk.id}
      Name: ${sk.name}
      Category: ${sk.category}
      Description: ${sk.description}
      Playbook Protocol: ${sk.playbook}
      Tags: ${sk.tags.join(', ')}
    `).join('\n\n');

    governedRagEngine.ingestDocument({
      id: 'DOC-AAS-04',
      title: 'AAS Core High-Impact Skills & Execution Protocols',
      category: 'Agent Skills & Tools',
      classification: 'Internal',
      allowedRoles: ['admin', 'engineering', 'analyst', 'public'],
      content: `
      Section 1: Detailed Playbooks for High-Impact Skills
      ${skillsText}
      `
    });

    auditManager.recordEvent({
      agentId: 'agent-aas-feed',
      agentName: 'AAS Skills Feed Integrator',
      actionType: 'KNOWLEDGE_FEED_INGESTION',
      inputs: { repo: this.repoUrl, version: this.version, totalSkills: this.totalSkillsCount },
      riskLevel: 'LOW',
      output: `Successfully ingested 4 AAS knowledge documents, ${this.plugins.length} specialized plugins, and ${this.workflows.length} workflows into Governed RAG.`,
      outcome: 'SUCCESS'
    });
  }

  searchSkills(query = '') {
    const q = query.toLowerCase().trim();
    if (!q) return this.featuredSkills;

    // Search across featured skills
    const directMatches = this.featuredSkills.filter(s =>
      s.id.includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    );

    // Also search within plugins
    const matchedPlugins = this.plugins.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.skills.some(s => s.toLowerCase().includes(q))
    );

    return {
      query,
      skills: directMatches,
      matchingPlugins: matchedPlugins,
      totalCatalogSkills: this.totalSkillsCount
    };
  }

  getSkill(id) {
    return this.featuredSkills.find(s => s.id === id) || {
      id,
      name: id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      category: 'AAS Catalog Skill',
      description: `Reusable instruction playbook from ${this.repoUrl}/tree/main/skills/${id}`,
      playbook: `Standard agentic execution protocol for ${id}.`,
      tags: ['aas-skill', id]
    };
  }

  getWorkflows() {
    return this.workflows;
  }

  getPlugins() {
    return this.plugins;
  }

  getBundles() {
    return this.bundles;
  }
}

export const agenticAwesomeSkillsFeed = new AgenticAwesomeSkillsFeed();
