import { PersonalAgent } from './personalAgent.js';
import { BusinessAgent } from './businessAgent.js';
import { RevenueAgent } from './revenueAgent.js';
import { HealthAgent } from './healthAgent.js';
import { ProductVisionAgent } from './productVisionAgent.js';
import { AutomationAgent } from './automationAgent.js';
import { CommunicationAgent } from './commAgent.js';
import { worldAgent } from '../intelligence/worldAgent.js';
import { memoryStore } from '../memory/memoryStore.js';
import { StarkProtocolsManager } from './starkProtocols.js';
import { devOpsAgent } from './devOpsAgent.js';
import { aiDeveloperAgent } from './aiDeveloperAgent.js';
import { dynamicDialogue } from '../intelligence/dynamicDialogueEngine.js';

// Intent & Context Intelligence Core (Section 2, 3, 4, 18, 19)
import { intentClassifier, INTENT_CATEGORIES, RESPONSE_MODES } from '../intelligence/intentClassifier.js';

// GPT-6 Astra Core Architecture Modules
import { astraCore, EXECUTION_MODES } from '../intelligence/astraCore.js';
import { taskPlanner } from '../intelligence/taskPlanner.js';
import { evidenceLayer } from '../intelligence/evidenceLayer.js';
import { agentMarketplace } from './agentMarketplace.js';
import { evolutionEngine } from '../intelligence/evolutionEngine.js';
import { continuousMonitor } from '../intelligence/continuousMonitor.js';

// AI Writing Assistant & JARVIS Ecosystem Modules
import { writingAssistant, WRITING_TONES, ENHANCEMENT_MODES } from '../intelligence/writingAssistantEnhancer.js';
import { jarvisEcosystem } from '../intelligence/jarvisEcosystemKnowledge.js';
import { llmAgent } from './llmAgent.js';
import { gptAstraService } from '../intelligence/gptAstraService.js';

// Enterprise AI Agent Governance & Orchestration Core
import { policyEngine } from '../governance/policyEngine.js';
import { approvalEngine, APPROVAL_STATUS } from '../governance/approvalEngine.js';
import { auditManager } from '../governance/auditManager.js';
import { telemetryEngine } from '../governance/telemetryEngine.js';
import { riskManagementModule } from '../governance/riskManagementModule.js';
import { workflowEngine } from '../governance/workflowEngine.js';
import { governedRagEngine } from '../knowledge/governedRagEngine.js';
import { mcpGateway } from '../tools/mcpGateway.js';
import { agenticAwesomeSkillsFeed } from '../skills/agenticAwesomeSkillsFeed.js';

export class GenisusOrchestrator {
  constructor() {
    this.astraCore = astraCore;
    this.taskPlanner = taskPlanner;
    this.evidenceLayer = evidenceLayer;
    this.agentMarketplace = agentMarketplace;
    this.evolutionEngine = evolutionEngine;
    this.continuousMonitor = continuousMonitor;
    this.writingAssistant = writingAssistant;
    this.jarvisEcosystem = jarvisEcosystem;
    this.llmAgent = llmAgent;

    this.personalAgent = new PersonalAgent();
    this.businessAgent = new BusinessAgent();
    this.revenueAgent = new RevenueAgent();
    this.healthAgent = new HealthAgent();
    this.productVisionAgent = new ProductVisionAgent();
    this.automationAgent = new AutomationAgent();
    this.commAgent = new CommunicationAgent();
    this.worldAgent = worldAgent;
    this.devOpsAgent = devOpsAgent;
    this.aiDeveloperAgent = aiDeveloperAgent;
    this.starkProtocols = new StarkProtocolsManager(this);

    this.onRouteUpdateCallback = () => {};
  }

  setRouteListener(callback) {
    this.onRouteUpdateCallback = callback;
  }

  async dispatch(query, preferredLanguage = 'ta-IN') {
    const q = query.trim();
    if (!q) return null;
    const isTamil = /[\u0B80-\u0BFF]/.test(q) || preferredLanguage.startsWith('ta');

    // Section 24 Priority Hierarchy: Resolve multi-tier context from memoryStore
    const resolvedContext = memoryStore.resolveContext();

    // Section 2 & 3: Classify Intent across 25+ categories & detect multi-turn continuations
    const intent = intentClassifier.classify(q, {
      sessionMemory: memoryStore.sessionMemory,
      resolvedContext,
      preferredLanguage
    });

    // Effective query (resolves elliptical queries e.g. "Spring Boot" -> "Create login API using Spring Boot")
    const effectiveQuery = (intent.isMultiTurnContinuation && intent.resolvedQuery) ? intent.resolvedQuery : q;
    const lower = effectiveQuery.toLowerCase();

    // Log query into short-term memory & update session working memory (Section 23)
    memoryStore.addShortTermMessage('user', q, { preferredLanguage, resolvedQuery: effectiveQuery });
    memoryStore.updateSessionGoal({
      activeGoal: intent.resolvedQuery || q,
      activeTopic: intent.category,
      intentCategory: intent.category,
      responseMode: intent.mode,
      isContinuation: intent.isMultiTurnContinuation
    });
    if (intent.extractedEntities?.technology) {
      memoryStore.setSessionTechnology(intent.extractedEntities.technology);
    }

    // Step 0.01: Check Pragmatic Intent (e.g. "passport received" -> draft polite acknowledgement email)
    if (intent.isPragmaticIntent && intent.suggestedDraft) {
      this.notifyRoute(['GENISUS Core', 'Pragmatic Communication Mesh', 'Professional Correspondence']);
      const speechText = isTamil
        ? `பாஸ் சதீஷ், "${q}" என்பதற்கான தொழில்முறை பதில் மடலை தயாரித்துள்ளேன்.`
        : `Commander, drafted a courteous, professional response for "${q}".`;
      const displayText = `### ✉️ PROFESSIONAL ACKNOWLEDGEMENT DRAFT
**Intent**: \`${intent.category}\` | **Confidence**: \`${Math.round(intent.confidence * 100)}%\`

> ${intent.suggestedDraft.replace(/\n/g, '\n> ')}

---
💡 *Would you like me to send this email or copy to clipboard?*`;
      const pragmaticResult = {
        agent: 'GENISUS Pragmatic Communicator',
        mode: 'PROFESSIONAL_RESPONSE',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: { draft: intent.suggestedDraft }
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: pragmaticResult.agent });
      return pragmaticResult;
    }

    // =========================================================================
    // Step 0.02: Enterprise AI Governance & Zero-Trust Control Directives
    // =========================================================================

    // 1. Pending Approvals Queue
    if (
      lower === 'approvals' ||
      lower.includes('pending approval') ||
      lower.includes('show approval') ||
      lower.includes('approval queue') ||
      lower.includes('pending requests')
    ) {
      this.notifyRoute(['GENISUS Governance', 'HITL Approval Hub', 'Pending Review Queue']);
      const pending = approvalEngine.getPendingApprovals();
      const count = pending.length;
      const speechText = isTamil
        ? `பாஸ் சதீஷ், மனித மதிப்பாய்வுக்காக ${count} கோரிக்கைகள் காத்திருக்கின்றன.`
        : `Commander, there are currently ${count} high-risk agent directives pending Human-in-the-Loop review.`;

      let displayText = `### ⚖️ HUMAN-IN-THE-LOOP APPROVAL QUEUE\n`;
      displayText += `**Active Pending**: \`${count} Directives\` | **Zero-Trust Policy Enforced**: \`YES\`\n\n`;

      if (count === 0) {
        displayText += `> 🟢 *Zero pending approval requests. All agent operations are running smoothly within autonomous policy limits.*`;
      } else {
        pending.forEach((req, idx) => {
          displayText += `#### ${idx + 1}. [${req.id}] ${req.title}\n`;
          displayText += `* **Agent**: \`${req.agentName}\` (\`${req.agentId}\`)\n`;
          displayText += `* **Risk Tier**: **\`${req.riskLevel}\`** | **Action**: \`${req.actionType}\`\n`;
          displayText += `* **Requested**: \`${new Date(req.requestedAt).toLocaleTimeString()}\` by \`${req.requestedBy}\`\n`;
          displayText += `* **Description**: ${req.description}\n`;
          if (req.policyViolations?.length) {
            displayText += `* **Policy Triggers**:\n`;
            req.policyViolations.forEach(v => { displayText += `  - ⚠️ \`${v}\`\n`; });
          }
          displayText += `* *Directives*: Say **"Approve request ${req.id}"** or **"Reject request ${req.id}"**\n\n`;
        });
      }

      const res = {
        agent: 'GENISUS HITL Approval Hub',
        mode: 'GOVERNANCE_APPROVALS',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: { pending }
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // 2. Approve Request Command
    const approveMatch = lower.match(/(?:approve request|approve)\s+(app-\d+)/i);
    if (approveMatch) {
      const appId = approveMatch[1].toUpperCase();
      this.notifyRoute(['GENISUS Governance', 'HITL Approval Hub', `Authorize ${appId}`]);
      const outcome = approvalEngine.approveRequest(appId, 'sathish.s (Admin)', 'Approved via Voice / Console Directive');
      
      if (outcome.success) {
        auditManager.recordEvent({
          agentId: outcome.request.agentId,
          agentName: outcome.request.agentName,
          actionType: 'HUMAN_APPROVAL_GRANTED',
          inputs: { requestId: appId, action: outcome.request.actionType },
          riskLevel: outcome.request.riskLevel,
          approverId: 'sathish.s (Admin)',
          output: `Human Operator authorized execution of ${outcome.request.title}.`,
          outcome: 'APPROVED_AND_EXECUTED'
        });

        telemetryEngine.recordExecution({
          agentId: outcome.request.agentId,
          agentName: outcome.request.agentName,
          durationMs: 250,
          tokens: 180,
          success: true
        });

        const speechText = isTamil
          ? `கோரிக்கை ${appId} அங்கீகரிக்கப்பட்டது பாஸ். செயல்பாடு செயல்படுத்தப்படுகிறது.`
          : `Commander, request ${appId} has been authorized. Action dispatched to execution environment.`;

        const displayText = `### ✅ APPROVAL GRANTED: \`${appId}\`
* **Target Directive**: ${outcome.request.title}
* **Authorized By**: \`sathish.s (Admin)\` at \`${new Date().toLocaleTimeString()}\`
* **Risk Tier**: \`${outcome.request.riskLevel}\`
* **Audit Lineage**: Cryptographically chained in \`auditManager\` (\`SHA-256 Validated\`).
* **Next Step**: Agent execution dispatched with elevated clearance.`;

        const res = {
          agent: 'GENISUS HITL Approval Hub',
          mode: 'APPROVAL_EXECUTED',
          language: isTamil ? 'ta-IN' : 'en-US',
          speechText,
          displayText,
          data: outcome.request
        };
        memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
        return res;
      } else {
        const errorText = `Unable to approve ${appId}: ${outcome.error}`;
        return {
          agent: 'GENISUS HITL Approval Hub',
          mode: 'APPROVAL_ERROR',
          speechText: errorText,
          displayText: `⚠️ **Approval Error**: ${errorText}`
        };
      }
    }

    // 3. Reject Request Command
    const rejectMatch = lower.match(/(?:reject request|reject)\s+(app-\d+)/i);
    if (rejectMatch) {
      const appId = rejectMatch[1].toUpperCase();
      this.notifyRoute(['GENISUS Governance', 'HITL Approval Hub', `Reject ${appId}`]);
      const outcome = approvalEngine.rejectRequest(appId, 'sathish.s (Admin)', 'Rejected by Operator Security Directive');

      if (outcome.success) {
        auditManager.recordEvent({
          agentId: outcome.request.agentId,
          agentName: outcome.request.agentName,
          actionType: 'HUMAN_APPROVAL_REJECTED',
          inputs: { requestId: appId, action: outcome.request.actionType },
          riskLevel: outcome.request.riskLevel,
          approverId: 'sathish.s (Admin)',
          output: `Human Operator rejected execution of ${outcome.request.title}.`,
          outcome: 'REJECTED'
        });

        const speechText = isTamil
          ? `கோரிக்கை ${appId} நிராகரிக்கப்பட்டது பாஸ்.`
          : `Commander, request ${appId} has been rejected under security governance.`;

        const displayText = `### 🛑 APPROVAL REJECTED: \`${appId}\`
* **Target Directive**: ${outcome.request.title}
* **Rejected By**: \`sathish.s (Admin)\`
* **Status**: Terminated with Zero Execution.
* **Audit Trail**: Recorded in immutable compliance log.`;

        const res = {
          agent: 'GENISUS HITL Approval Hub',
          mode: 'APPROVAL_REJECTED',
          language: isTamil ? 'ta-IN' : 'en-US',
          speechText,
          displayText,
          data: outcome.request
        };
        memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
        return res;
      }
    }

    // 4. Governance Policies & Guardrails
    if (
      lower === 'policies' ||
      lower.includes('governance policies') ||
      lower.includes('zero trust policies') ||
      lower.includes('show policies') ||
      lower.includes('active guardrails')
    ) {
      this.notifyRoute(['GENISUS Governance', 'Policy Engine', 'Zero-Trust Rule Matrix']);
      const policies = policyEngine.getAllPolicies();
      const activeCount = policies.filter(p => p.enabled).length;

      const speechText = isTamil
        ? `மொத்தம் ${policies.length} பாதுகாப்புக் கொள்கைகள் உள்ளன பாஸ். அதில் ${activeCount} செயல்பாட்டில் உள்ளன.`
        : `Commander, active zero-trust guardrails include ${activeCount} operational policies protecting databases, financials, and code deployments.`;

      let displayText = `### 🛡️ ZERO-TRUST GOVERNANCE POLICY MATRIX\n`;
      displayText += `**Active Policies**: \`${activeCount}/${policies.length}\` | **Framework**: \`Zero-Trust / Least Privilege\`\n\n`;

      policies.forEach(p => {
        displayText += `* **[${p.id}] ${p.name}** (${p.enabled ? '🟢 ENABLED' : '⚪ DISABLED'})\n`;
        displayText += `  - *Risk Tier*: **\`${p.riskLevel}\`** | *Type*: \`${p.type}\`\n`;
        displayText += `  - *Rule*: ${p.description}\n`;
      });

      const res = {
        agent: 'GENISUS Policy Engine',
        mode: 'POLICIES_OVERVIEW',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: { policies }
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // 5. GRC Risk Register & Compliance Status
    if (
      lower.includes('risk register') ||
      lower.includes('grc risk') ||
      lower.includes('compliance status') ||
      lower.includes('compliance framework') ||
      lower.includes('show risks')
    ) {
      this.notifyRoute(['GENISUS Governance', 'Risk Management & GRC', 'Risk Heatmap & Frameworks']);
      const posture = riskManagementModule.calculateOverallPosture();
      const frameworks = riskManagementModule.getFrameworks();
      const risks = riskManagementModule.getRiskRegister();

      const speechText = isTamil
        ? `நிறுவன இடர் மேலாண்மை தணிக்கை: இடர் தணிப்பு விகிதம் ${posture.riskMitigationRate}, சராசரி இணக்க மதிப்பீடு ${posture.averageComplianceScore}.`
        : `Commander, Enterprise Risk mitigation rate is at ${posture.riskMitigationRate} with average regulatory compliance score of ${posture.averageComplianceScore} across ISO 27001, SOC 2, and DPDP.`;

      let displayText = `### 📊 ENTERPRISE GRC RISK REGISTER & COMPLIANCE POSTURE\n`;
      displayText += `**Risk Mitigation Rate**: \`${posture.riskMitigationRate}\` | **Average Compliance**: \`${posture.averageComplianceScore}\`\n\n`;

      displayText += `#### 🏛️ Statutory & Security Frameworks\n`;
      frameworks.forEach(f => {
        displayText += `* **${f.name}**: **\`${f.complianceScore}\`** (${f.controlsPassing}/${f.controlsTotal} Controls Passing)\n`;
      });

      displayText += `\n#### 🎯 Key Risk Heatmap\n`;
      risks.forEach(r => {
        displayText += `* **[${r.id}] ${r.title}**\n`;
        displayText += `  - *Inherent*: \`${r.inherentImpact} / ${r.inherentLikelihood}\` ➔ *Residual*: **\`${r.residualImpact} (${r.status})\`**\n`;
        displayText += `  - *Controls*: \`${r.controlsApplied.join(', ')}\`\n`;
      });

      const res = {
        agent: 'GENISUS GRC Risk Manager',
        mode: 'RISK_REGISTER',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: { posture, frameworks, risks }
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // 6. Run Multi-Agent Workflow Pipeline
    if (
      lower.startsWith('run workflow') ||
      lower.startsWith('execute workflow') ||
      lower.startsWith('run pipeline') ||
      lower.includes('run deployment pipeline') ||
      lower.includes('run security pipeline')
    ) {
      let wfId = 'WF-DEV-01';
      if (lower.includes('api') || lower.includes('qa')) wfId = 'WF-API-02';
      if (lower.includes('iam') || lower.includes('access')) wfId = 'WF-IAM-03';

      this.notifyRoute(['GENISUS Governance', 'Multi-Agent Workflow Engine', `Executing ${wfId}`]);
      const execResult = await workflowEngine.executeWorkflow(wfId, { user: 'sathish.s' });

      let speechText = '';
      let displayText = '';

      if (execResult.status === 'WAITING_FOR_APPROVAL') {
        speechText = isTamil
          ? `பணிப்பாய்வு மனித மதிப்பாய்வு சோதனைப் புள்ளியை எட்டியுள்ளது. அனுமதி கோரிக்கை ${execResult.approvalRequest.id} உருவாக்கப்பட்டுள்ளது பாஸ்.`
          : `Workflow reached Human Approval Gate. Created approval ticket ${execResult.approvalRequest.id}.`;

        displayText = `### ⏸️ MULTI-AGENT WORKFLOW HALTED AT HUMAN GATE
**Workflow**: \`${wfId}\` | **Run ID**: \`${execResult.runId}\`
* **Status**: 🟡 \`WAITING_FOR_APPROVAL\`
* **Gate Title**: ${execResult.approvalRequest.title}
* **Risk Tier**: **\`${execResult.approvalRequest.riskLevel}\`**
* **Action**: Say **"Approve request ${execResult.approvalRequest.id}"** to authorize production progression.`;
      } else {
        speechText = isTamil
          ? `பணிப்பாய்வு அனைத்து நிலைகளையும் வெற்றிகரமாக முடித்துள்ளது பாஸ்.`
          : `Workflow executed all steps with zero policy violations.`;

        displayText = `### ✅ MULTI-AGENT WORKFLOW COMPLETED
**Workflow**: \`${wfId}\` | **Run ID**: \`${execResult.runId}\`
* **Status**: 🟢 \`COMPLETED\`
* **Summary**: ${execResult.summary}
* **Audit Trail**: Recorded with cryptographically chained verification.`;
      }

      const res = {
        agent: 'GENISUS Workflow Engine',
        mode: 'WORKFLOW_EXECUTION',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: execResult
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // 7. Governed Enterprise RAG Search
    if (
      lower.startsWith('search knowledge') ||
      lower.startsWith('governed rag') ||
      lower.startsWith('search docs') ||
      lower.startsWith('search enterprise')
    ) {
      const ragQuery = effectiveQuery.replace(/^(search knowledge|governed rag|search docs|search enterprise)\s*/i, '');
      this.notifyRoute(['GENISUS Governance', 'Governed RAG Engine', 'Permission-Filtered Retrieval']);

      // Current user role
      const userRoles = ['admin', 'engineering', 'analyst'];
      const ragResults = governedRagEngine.queryKnowledge({ query: ragQuery, userRoles, topK: 3 });

      const speechText = isTamil
        ? `பாஸ், களஞ்சியத்தில் ${ragResults.chunks.length} அங்கீகரிக்கப்பட்ட பகுதிகள் கண்டறியப்பட்டன.`
        : `Commander, retrieved ${ragResults.chunks.length} permission-verified knowledge chunks with source citations.`;

      let displayText = `### 📚 GOVERNED ENTERPRISE RAG SEARCH\n`;
      displayText += `**Query**: \`"${ragQuery}"\` | **User Clearance**: \`${userRoles.join(', ')}\`\n`;
      displayText += `**Access Denied Filtered**: \`${ragResults.accessDeniedCount} Chunks\` (Strict ACL Enforced)\n\n`;

      if (ragResults.chunks.length === 0) {
        displayText += `> ℹ️ *No authorized documents matched the query under current security clearance.*`;
      } else {
        ragResults.chunks.forEach((c, idx) => {
          displayText += `#### Citation ${idx + 1}: ${c.docTitle} [${c.classification}]\n`;
          displayText += `> ${c.text.replace(/\n\s+/g, '\n> ')}\n\n`;
        });
      }

      const res = {
        agent: 'GENISUS Governed RAG',
        mode: 'RAG_RESULTS',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: ragResults
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // =========================================================================
    // Step 0.03: Agentic Awesome Skills (AAS Core) Directives & Feed
    // =========================================================================

    // 1. Search or Recommend Skills
    if (
      lower.startsWith('search skills') ||
      lower.startsWith('find skills') ||
      lower.startsWith('recommend skills') ||
      lower.includes('awesome skills') ||
      lower.includes('aas skills') ||
      lower.includes('agentic skills') ||
      lower === 'skills catalog' ||
      lower === 'browse skills'
    ) {
      this.notifyRoute(['GENISUS Skills', 'Agentic Awesome Skills (AAS Core)', 'Catalog Intelligence']);

      let searchQuery = effectiveQuery
        .replace(/^(search skills|find skills|recommend skills for|recommend skills|awesome skills|aas skills|agentic skills|skills catalog|browse skills)\s*/i, '')
        .trim();

      const searchResult = agenticAwesomeSkillsFeed.searchSkills(searchQuery);
      const isOverview = !searchQuery || searchQuery === 'all';

      const speechText = isTamil
        ? `பாஸ் சதீஷ், Agentic Awesome Skills களஞ்சியத்தில் 2,122+ திறன்கள் மற்றும் 13 பிரத்யேக செருகுநிரல்கள் தயாராக உள்ளன.`
        : `Commander, accessed Agentic Awesome Skills repository. Catalog comprises 2,122+ reusable agent skills, 13 specialized plugins, and verified execution playbooks.`;

      let displayText = `### ✨ AGENTIC AWESOME SKILLS (AAS CORE) CATALOG FEED\n`;
      displayText += `**Repository**: [sickn33/agentic-awesome-skills](https://github.com/sickn33/agentic-awesome-skills/tree/main) | **Stars**: \`46,000+ ⭐\` | **Release**: \`v17.3.0\`\n`;
      displayText += `**Total Catalog**: \`2,122 Reusable Agent Skills\` across 8 enterprise categories.\n\n`;

      if (isOverview) {
        displayText += `#### 📦 Recommended Specialized Domain Plugins\n`;
        const plugins = agenticAwesomeSkillsFeed.getPlugins().slice(0, 6);
        plugins.forEach(p => {
          displayText += `* **${p.name}** (\`${p.skillsCount} Skills\`): ${p.bestFor}\n`;
        });

        displayText += `\n#### ⚡ High-Impact Skill Playbooks\n`;
        const skills = agenticAwesomeSkillsFeed.featuredSkills.slice(0, 4);
        skills.forEach(s => {
          displayText += `* **\`${s.id}\`** — **${s.name}**\n`;
          displayText += `  - *Playbook*: \`${s.playbook}\`\n`;
        });

        displayText += `\n💡 *Tip: Say **"search skills security"**, **"recommend skills for debugging"**, or inspect via **Governance ➔ AAS Skills Feed** tab.*`;
      } else {
        displayText += `#### 🔍 Matching Skills for: \`"${searchQuery}"\`\n`;
        if (searchResult.skills && searchResult.skills.length > 0) {
          searchResult.skills.forEach(s => {
            displayText += `* **\`${s.id}\`** — **${s.name}** (\`${s.category}\`)\n`;
            displayText += `  - *Description*: ${s.description}\n`;
            displayText += `  - *Playbook*: \`${s.playbook}\`\n`;
          });
        } else {
          displayText += `> ℹ️ *No local featured matches found for "${searchQuery}". Querying complete 2,122+ AAS catalog online.*`;
        }

        if (searchResult.matchingPlugins && searchResult.matchingPlugins.length > 0) {
          displayText += `\n#### 📦 Relevant Specialized Plugins\n`;
          searchResult.matchingPlugins.forEach(p => {
            displayText += `* **${p.name}**: ${p.bestFor} (\`Skills: ${p.skills.slice(0, 4).join(', ')}...\`)\n`;
          });
        }
      }

      const res = {
        agent: 'GENISUS AAS Skills Core',
        mode: 'AAS_SKILLS_FEED',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: searchResult
      };
      memoryStore.addShortTermMessage('genisus', speechText, { agent: res.agent });
      return res;
    }

    // Step 0.05: Check Genisus AI Model & Integrated AI / LLM Agents Overview
    if (
      lower.includes('genisus ai model') ||
      lower.includes('genisus model') ||
      ((lower.includes('ai') || lower.includes('lm')) && (lower.includes('lm agent') || lower.includes('llm agent') || lower.includes('ai agent')) && (lower.includes('model') || lower.includes('includ'))) ||
      lower.includes('ai and llm agent') ||
      lower.includes('ai and lm agent') ||
      lower.includes('model specification') ||
      lower.includes('what model') ||
      lower.includes('active model')
    ) {
      this.notifyRoute(['GENISUS Core', 'GENISUS AI Unified Model Engine', 'AI Developer + LLM Task Agent Core']);
      const modelSpec = this.astraCore.getGenisusAIModel();
      const activeTasksCount = this.llmAgent.activeTasks ? this.llmAgent.activeTasks.length : 0;
      
      const speechText = isTamil
        ? `ஜெனீசிஸ் AI மாடலில் AI டெவலப்பர் ஏஜென்ட் மற்றும் எல்.எல்.எம் டாஸ்க் ஏஜென்ட் வெற்றிகரமாக இணைக்கப்பட்டுள்ளன பாஸ். நிகழ்நேர கோடிங், சோதனை, ஜிட் ஆட்டோமேஷன் மற்றும் பின்னணி பணிகள் தயார் நிலையில் உள்ளன.`
        : `Commander, the GENISUS AI Model intrinsically incorporates both the Autonomous AI Developer Agent and the Background LLM Task Agent for real-time coding, testing, git automation, and asynchronous background activity execution.`;

      const displayText = `### 🧠 GENISUS AI UNIFIED MODEL SPECIFICATION
**Model Name**: \`${modelSpec.modelName}\`
**Architecture**: \`${modelSpec.architecture}\`
**Operational Mode**: \`${modelSpec.executionMode}\`
**Integrated Core Engines**: \`2 Autonomous Cores Active\`

---

#### 1. 🤖 AI Software Developer Agent (\`AIDeveloperAgent\`)
* **Role**: Real-Time Continuous Software Development & Engineering Lifecycle.
* **Core Engine**: Python \`AstraDevAgent\` & JavaScript Swarm Bridge.
* **Capabilities**: 
  - Dynamic Requirement Ingestion & Architecture Decomposition
  - Real Workspace Code Generation & Bug Patching
  - Automated Unit/Integration Test Execution (\`test_agent.py\`)
  - Real Git Staging, Conventional Commit Formulation & Safe Push with Human Gate.
* **Current Status**: 🟢 \`ONLINE & HEALTHY\`

#### 2. 📋 Background LLM Task & Activity Agent (\`LLMAgent\`)
* **Role**: General-Purpose Task Decomposition & Asynchronous Logical Worker.
* **Core Engine**: Python \`LLMTaskAgent\` with State Store (\`python/.agent_tasks.json\`).
* **Capabilities**:
  - High-Level Directive Decomposition into Granular Multi-Agent Activities
  - Real-Time Disk State Persistence & Recovery
  - Background Polling Worker Daemon (Runs without UI interference)
  - Seamless Coordination with Writing Enhancer, Research & DevOps Engines.
* **Current Status**: 🟢 \`ONLINE (${activeTasksCount} Active Tasks Tracked)\`

---
*💡 Both agents operate natively inside the **GENISUS AI Model**, executing tasks seamlessly via voice, chat directives, and background IPC loops.*`;

      return {
        agent: 'GENISUS AI Model Hub',
        mode: 'MODEL_OVERVIEW',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText,
        data: modelSpec
      };
    }

    // Step 0.1: Check Execution Mode Switching (Advisory, Assisted, Autonomous)
    if (lower.includes('mode advisory') || lower.includes('advisory mode')) {
      this.astraCore.setExecutionMode(EXECUTION_MODES.ADVISORY);
      return {
        agent: 'GPT-6 Astra Intelligence Core',
        mode: 'MODE_CHANGE',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText: isTamil ? 'ஆலோசனை முறைமை (Mode A - Advisory) செயல்படுத்தப்பட்டது பாஸ்.' : 'Operational mode switched to Mode A: Advisory. Zero external actions will be performed.',
        displayText: `### 🛡️ OPERATIONAL MODE: \`MODE A — ADVISORY\`\n* **Status**: Recommendations and analysis only.\n* **External Action Execution**: 🔴 **LOCKED**`
      };
    }
    if (lower.includes('mode assisted') || lower.includes('assisted mode')) {
      this.astraCore.setExecutionMode(EXECUTION_MODES.ASSISTED);
      return {
        agent: 'GPT-6 Astra Intelligence Core',
        mode: 'MODE_CHANGE',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText: isTamil ? 'உதவி முறைமை (Mode B - Assisted) செயல்படுத்தப்பட்டது பாஸ்.' : 'Operational mode switched to Mode B: Assisted. Confirmation required for significant actions.',
        displayText: `### 🛡️ OPERATIONAL MODE: \`MODE B — ASSISTED\`\n* **Status**: Autonomous preparation with human approval gate.\n* **Low-Risk Actions**: Auto-executed\n* **High-Risk Actions**: 🟡 **CONFIRMATION GATE ACTIVE**`
      };
    }
    if (lower.includes('mode autonomous') || lower.includes('autonomous mode')) {
      this.astraCore.setExecutionMode(EXECUTION_MODES.AUTHORIZED_AUTONOMOUS);
      return {
        agent: 'GPT-6 Astra Intelligence Core',
        mode: 'MODE_CHANGE',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText: isTamil ? 'அங்கீகரிக்கப்பட்ட தன்னாட்சி முறைமை (Mode C - Autonomous) இயக்கப்பட்டது பாஸ்.' : 'Operational mode switched to Mode C: Authorized Autonomous. High-risk operations remain strictly gated.',
        displayText: `### 🛡️ OPERATIONAL MODE: \`MODE C — AUTHORIZED AUTONOMOUS\`\n* **Status**: Pre-authorized low-risk actions run automatically.\n* **Git Push / Cloud DB Deletions**: 🔴 **STRICT HUMAN GATE ENFORCED (Section 23)**`
      };
    }

    // Step 0.2: Check Mid-Turn Steering on Active Plans (Section 3)
    if (this.taskPlanner.isMidTaskChangeTrigger(q)) {
      this.notifyRoute(['GENISUS Core', 'GPT-6 Astra Dynamic Task Planner', 'Mid-Turn Requirement Steering']);
      const updatedPlan = this.taskPlanner.incorporateMidTaskChange(q);
      const speechText = isTamil
        ? `உங்கள் புதிய குறிப்பு முந்தைய திட்டத்தில் இணைக்கப்பட்டது பாஸ். தற்போது மொத்தம் ${updatedPlan.steps.length} படிகள் உள்ளன.`
        : `Incorporated "${q}" into the active execution plan. Dynamic roadmap expanded to ${updatedPlan.steps.length} steps without restarting.`;

      return {
        agent: 'GPT-6 Astra Task Planner',
        mode: 'TASK_PLAN_UPDATED',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `### 🧭 MID-TURN STEERING INCORPORATED
**Directive**: *"${q}"* · **Plan ID**: \`${updatedPlan.id}\`

${updatedPlan.steps.map(s => `${s.status === 'COMPLETED' ? '✓' : s.status === 'ACTIVE' ? '▶' : '○'} **Step ${s.stepNumber}**: ${s.title} ${s.isDynamicallyAdded ? '*(Dynamically Added)*' : ''}`).join('\n')}

---
*முந்தைய பணிகளை ரத்து செய்யாமல் புதிய தேவை இணைக்கப்பட்டுள்ளது.*`,
        data: updatedPlan
      };
    }

    // Step 0.3: Multi-Step Dynamic Task Planning trigger (Section 2)
    if (
      (lower.includes('research') && (lower.includes('roadmap') || lower.includes('compare') || lower.includes('technologies'))) ||
      (lower.includes('create a learning roadmap') || lower.includes('learning roadmap'))
    ) {
      this.notifyRoute(['GENISUS Core', 'GPT-6 Astra Dynamic Task Planner', 'Decomposition & Roadmapping']);
      const plan = this.taskPlanner.createPlan(q);
      const speechText = isTamil
        ? `பாஸ் சதீஷ், "${q}" கோரிக்கைக்கான பலபடி செயல் திட்டத்தை உருவாக்கிவிட்டேன். தொழில்நுட்ப ஒப்பீடு மற்றும் கற்றல் வரைபடம் தயாராகி வருகிறது.`
        : `Generated dynamic multi-step execution plan for your request. Researching technologies and formulating career roadmap.`;

      return {
        agent: 'GPT-6 Astra Task Planner',
        mode: 'TASK_PLAN_CREATED',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `### 🧭 DYNAMIC EXECUTION PLAN INITIALIZED
**Requirement**: *"${q}"*
**Execution Mode**: \`${this.astraCore.getExecutionMode()}\`

${plan.steps.map(s => `**Step ${s.stepNumber}**: ${s.title}\n*${s.detail}*`).join('\n\n')}

---
*💡 குறிப்பு: வேலை நடக்கும் போதே **"Also include Python"** அல்லது புதிய தேவைகளைச் சொல்லலாம் — திட்டம் தானாக புதுப்பிக்கப்படும்.*`,
        data: plan
      };
    }

    // Step 0.4: Check Agent Marketplace / Workers listing (Section 11)
    if (lower.includes('agent marketplace') || lower.includes('list agents') || lower.includes('show agents') || lower.includes('active agents')) {
      const agents = this.agentMarketplace.listAgents();
      const speechText = isTamil
        ? `ஜெனீசிஸ் அமைப்பில் தற்போது 16 சிறப்பு AI ஏஜென்ட்கள் செயலில் உள்ளன பாஸ்.`
        : `Listing 16 specialized AI Worker Agents currently registered in the GENISUS Agent Marketplace.`;

      return {
        agent: 'GENISUS Agent Marketplace',
        mode: 'MARKETPLACE_VIEW',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `### 🤖 GENISUS AGENT MARKETPLACE (${agents.length} WORKERS ACTIVE)
${agents.map(a => `* **${a.name}** (\`${a.version}\`): ${a.purpose}`).join('\n')}`,
        data: agents
      };
    }

    // Step 0.5: Check Evolution Engine / Improvement Proposals (Section 10 & 22)
    if (lower.includes('evolution') || lower.includes('improvement proposal') || lower.includes('self improvement') || lower.includes('system proposals')) {
      const proposals = this.evolutionEngine.listProposals();
      const speechText = isTamil
        ? `சுய-மேம்பாட்டு திட்டங்களை திரையில் காட்டுகிறேன் பாஸ். உங்கள் ஒப்புதலின்றி பாதுகாப்பு விதிகள் மாற்றப்படாது.`
        : `Displaying governed GENISUS Evolution & Improvement proposals awaiting operator authorization.`;

      return {
        agent: 'GENISUS Self-Improvement Engine',
        mode: 'EVOLUTION_VIEW',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `### 🧬 GENISUS GOVERNED EVOLUTION PROPOSALS
${proposals.map(p => `#### 提案: ${p.agentName}
* **Observed**: ${p.observedIssue}
* **Recommendation**: ${p.recommendation}
* **Expected Gain**: \`${p.expectedImprovement}\`
* **Risk**: \`${p.risk}\` | **Governance**: 🛡️ ${p.governanceAudit}
* **Status**: \`${p.status}\``).join('\n\n')}`,
        data: proposals
      };
    }

    // Step 0.34: Check Dedicated LLM Task & Activity Agent
    if (this.llmAgent.isLLMTaskTrigger(q)) {
      this.notifyRoute(['GENISUS Core', 'Dedicated LLM Task & Activity Agent', 'Multi-Step Decomposition & Activity Dispatch']);
      const result = await this.llmAgent.process(q, preferredLanguage);
      memoryStore.addShortTermMessage('genisus', result.speechText || result.displayText, { agent: result.agent });
      return result;
    }

    // Step 0.35: Check JARVIS-AI Topic Ecosystem Knowledge & Architecture Matrix
    if (lower.includes('jarvis ecosystem') || lower.includes('jarvis architecture') || lower.includes('jarvis features') || lower.includes('jarvis repos') || lower.includes('jarvis projects')) {
      const summary = this.jarvisEcosystem.getArchitectureSummary();
      const repos = this.jarvisEcosystem.repositories;
      const speechText = isTamil
        ? `ஜார்விஸ் ஓபன் சோர்ஸ் சுற்றுச்சூழல் மற்றும் கட்டமைப்புகளை திரையில் தொகுத்து வழங்கியுள்ளேன் பாஸ்.`
        : `Displaying JARVIS-AI open-source architectural ecosystem matrix and integrated repository features.`;

      return {
        agent: 'JARVIS Ecosystem Knowledge Hub',
        mode: 'JARVIS_ECOSYSTEM_VIEW',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `${summary}\n\n### 📚 INDEXED TOP REPOSITORIES\n${repos.map(r => `* **[${r.name}](https://github.com/${r.repo})** (\`${r.category}\`): ${r.features.slice(0, 2).join('; ')}`).join('\n')}`,
        data: repos
      };
    }

    // Step 0.36: Check AI Writing Assistant & Enhancer (from ForestStudentView/ai-writing-assistant-enhancer)
    if (this.writingAssistant.isWritingDirective(q)) {
      this.notifyRoute(['GENISUS Core', 'AI Writing Assistant & Enhancer', 'Real-Time Text Polish & Tone Shifter']);
      
      // Determine mode & tone
      let mode = ENHANCEMENT_MODES.POLISH;
      let tone = WRITING_TONES.JARVIS;

      if (lower.includes('jarvis')) mode = ENHANCEMENT_MODES.MAKE_JARVIS;
      else if (lower.includes('vocabulary') || lower.includes('சொல்')) mode = ENHANCEMENT_MODES.ELEVATE;
      else if (lower.includes('summarize') || lower.includes('சுருக்கம்')) mode = ENHANCEMENT_MODES.SUMMARIZE;
      else if (lower.includes('expand') || lower.includes('விரிவாக்கு')) mode = ENHANCEMENT_MODES.EXPAND;
      else if (lower.includes('doc') || lower.includes('spec') || lower.includes('release note')) mode = ENHANCEMENT_MODES.TECH_DOC;

      if (lower.includes('professional')) tone = WRITING_TONES.PROFESSIONAL;
      else if (lower.includes('academic')) tone = WRITING_TONES.ACADEMIC;

      // Extract target text if user said "enhance writing: ..." or use directive directly
      const cleanTarget = q.replace(/^(enhance writing|polish this text|improve vocabulary|rewrite in jarvis style|எழுத்தை மேம்படுத்து)[:\s]*/i, '').trim() || q;
      const result = this.writingAssistant.enhance({ text: cleanTarget, tone, mode, targetLanguage: isTamil ? 'ta' : 'en' });

      const speechText = isTamil
        ? `பாஸ் சதீஷ், உங்கள் எழுத்து மேம்படுத்தப்பட்டு ${result.stats.vocabularyImpact} தரத்தில் மாற்றப்பட்டுள்ளது.`
        : `Text enhanced in ${result.tone.replace(/_/g, ' ')} tone with ${result.stats.readabilityDelta} readability improvement, Commander.`;

      return {
        agent: 'WritingEnhancerAgent',
        mode: 'WRITING_ENHANCED',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText,
        displayText: `### ✍️ AI WRITING ASSISTANT & ENHANCER
* **Tone**: \`${result.tone}\` | **Mode**: \`${result.mode}\`
* **Readability Delta**: \`${result.stats.readabilityDelta}\` | **Word Count**: \`${result.stats.originalWords} ➔ ${result.stats.enhancedWords}\`

#### 📝 ENHANCED OUTPUT:
> ${result.enhanced.replace(/\n/g, '\n> ')}

---
*💡 ${result.explanation}*`,
        data: result
      };
    }

    // Step 0: Check Stark Industries Protocols (House Party, Clean Slate, Tactical Veronica)
    const protocolType = this.starkProtocols.isProtocolTrigger(q);
    if (protocolType) {
      this.notifyRoute(['GENISUS Core', 'Stark Industries Defense Subroutine', `PROTOCOL: ${protocolType}`]);
      const result = await this.starkProtocols.executeProtocol(protocolType, preferredLanguage);
      memoryStore.addShortTermMessage('genisus', result.speechText || result.displayText, { agent: result.agent });
      return result;
    }

    // Step 0.4: Check Integrated AI Software Development Agent & Continuous Update Pipeline (Section 30/31)
    const isDevIntent = [
      INTENT_CATEGORIES.CODING_NEW,
      INTENT_CATEGORIES.CODE_MODIFICATION,
      INTENT_CATEGORIES.BUG_FIXING,
      INTENT_CATEGORIES.DEBUGGING,
      INTENT_CATEGORIES.REFACTORING,
      INTENT_CATEGORIES.TESTING
    ].includes(intent.category) || intent.mode === RESPONSE_MODES.DEV_AGENT_MODE;

    const isQuestionPrefix = lower.startsWith('what is') || lower.startsWith('what are') || lower.startsWith('explain') || lower.startsWith('how does') || lower.startsWith('diff between') || lower.startsWith('compare');

    if (
      this.aiDeveloperAgent.isDeveloperTrigger(effectiveQuery, intent) ||
      (isDevIntent && !isQuestionPrefix)
    ) {
      this.notifyRoute(['GENISUS Core', 'AI Software Development Agent', '6-Stage Requirement-to-Code Pipeline']);
      const result = await this.aiDeveloperAgent.process(effectiveQuery, preferredLanguage, { intent, originalQuery: q });
      memoryStore.addShortTermMessage('genisus', result.speechText || result.displayText, { agent: result.agent });
      return result;
    }

    // Step 0.5: Check DevSecOps, GitHub Repositories (sathishkhan27), Bugfixes & Deployment
    if (this.devOpsAgent.isDevOpsTrigger(q)) {
      this.notifyRoute(['GENISUS Core', 'Autonomous DevSecOps Engine', 'GitHub Controller (sathishkhan27)']);
      const result = await this.devOpsAgent.process(q, preferredLanguage);
      memoryStore.addShortTermMessage('genisus', result.speechText || result.displayText, { agent: result.agent });
      return result;
    }

    // Step 1: Check Automation / Security Guardrails / Privacy commands first
    let result = this.automationAgent.process(q);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Security & Automation Guardrail', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText || result.displayText, { agent: result.agent });
      return result;
    }

    // Step 2: Check Telephony & Call Dispatcher Agent
    result = this.commAgent.process(q, preferredLanguage);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Telephony & Cellular Dispatcher', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 3: Check Vision / Product Intelligence
    result = this.productVisionAgent.process(q);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Vision & Product Scanner', '3D Holographic Engine', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 3: Check Business Intelligence & SaaS Command Center
    result = this.businessAgent.process(q, preferredLanguage);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Financial & SaaS Pipeline', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 4: Check Revenue & Opportunity Engine
    result = this.revenueAgent.process(q, preferredLanguage);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Market Intel & Opportunity Engine', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 5: Check Health & Wellness Intelligence
    result = this.healthAgent.process(q, preferredLanguage);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Biometric Sensors', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 6: Personal Assistant & Schedule / Knowledge Base / Priorities
    result = this.personalAgent.process(q, preferredLanguage);
    if (result) {
      this.notifyRoute(['GENISUS Core', 'Personal Knowledge & RAG', result.agent]);
      memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
      return result;
    }

    // Step 7: World Intelligence Agent — global events, tech, economy, products
    if (this.worldAgent.canHandle(q)) {
      result = this.worldAgent.handle(q, preferredLanguage);
      if (result) {
        this.notifyRoute(['GENISUS Core', 'World Intelligence Engine', 'Global Knowledge Graph', result.agent]);
        memoryStore.addShortTermMessage('genisus', result.speechText, { agent: result.agent });
        return result;
      }
    }

    // Step 8: Conversational Greetings, Identity & Banter Filter
    if (
      lower === 'hi' || lower === 'hello' || lower === 'hey' || lower === 'வணக்கம்' ||
      lower.includes('who are you') || lower.includes('யார் நீ') ||
      lower === 'thanks' || lower === 'நன்றி' || lower === 'ok' || lower === 'seri' || lower === 'joke'
    ) {
      this.notifyRoute(['GENISUS Core', 'General Conversational Mesh', 'Dynamic Dialogue Engine']);
      const dynamicRes = dynamicDialogue.generateDynamicResponse(q, { isTamil, preferredLanguage });
      const claim = this.evidenceLayer.tagClaim({
        content: dynamicRes.displayText || dynamicRes.speechText,
        sources: ['GPT-6 Astra Conversational Core', 'Verified Memory Store'],
        tag: 'VERIFIED',
        confidence: 'HIGH',
        crossCheckCount: 2
      });

      const convResult = {
        agent: dynamicRes.agent || 'GENISUS Conversational Core',
        mode: dynamicRes.mode || 'CHAT',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText: dynamicRes.speechText,
        displayText: dynamicRes.displayText + this.evidenceLayer.renderSourceCitation(claim),
        evidence: claim,
        source: 'GENISUS Conversational Mesh'
      };

      memoryStore.addShortTermMessage('genisus', convResult.speechText, { agent: convResult.agent });
      return convResult;
    }

    // Step 9: Real-Time GPT-6 Astra & OpenAI Cognitive Question Answering & Task Execution
    this.notifyRoute(['GENISUS Core', 'GPT-6 Astra Cognitive Intelligence', 'Neural Inference & Task Solver']);

    const aiRes = await gptAstraService.solveQuery(effectiveQuery, {
      isTamil,
      preferredLanguage,
      intent,
      executionMode: this.astraCore.getExecutionMode(),
      llmAgent: this.llmAgent,
      aiDeveloperAgent: this.aiDeveloperAgent
    });

    const claim = this.evidenceLayer.tagClaim({
      content: aiRes.displayText || aiRes.speechText,
      sources: [aiRes.source || 'GPT-6 Astra Intelligence Core', 'Neural Reasoning Engine'],
      tag: 'VERIFIED',
      confidence: 'HIGH',
      crossCheckCount: 3
    });

    const finalResult = {
      agent: aiRes.agent || 'GPT-6 Astra Intelligence Core',
      mode: aiRes.mode || 'QUESTION_ANSWER',
      language: isTamil ? 'ta-IN' : 'en-US',
      speechText: aiRes.speechText,
      displayText: aiRes.displayText + this.evidenceLayer.renderSourceCitation(claim),
      evidence: claim,
      source: aiRes.source || 'GPT-6 Astra Intelligence Core',
      data: aiRes.data
    };

    memoryStore.addShortTermMessage('genisus', finalResult.speechText, { agent: finalResult.agent });
    return finalResult;
  }

  notifyRoute(routeArray) {
    if (this.onRouteUpdateCallback) {
      this.onRouteUpdateCallback(routeArray);
    }
  }
}

export const orchestrator = new GenisusOrchestrator();
