/**
 * Governance Platform UI Controller
 * Bridges the HUD DOM view with the underlying policyEngine, approvalEngine,
 * auditManager, telemetryEngine, riskManagementModule, workflowEngine, and governedRagEngine.
 */

import { policyEngine, RISK_LEVELS } from './policyEngine.js';
import { approvalEngine, APPROVAL_STATUS } from './approvalEngine.js';
import { auditManager } from './auditManager.js';
import { telemetryEngine } from './telemetryEngine.js';
import { riskManagementModule } from './riskManagementModule.js';
import { workflowEngine } from './workflowEngine.js';
import { governedRagEngine } from '../knowledge/governedRagEngine.js';
import { agentMarketplace } from '../agents/agentMarketplace.js';
import { agenticAwesomeSkillsFeed } from '../skills/agenticAwesomeSkillsFeed.js';

export class GovernanceController {
  constructor() {
    this.currentSubTab = 'control-center';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.bindEvents();
    this.renderAll();
    this.initialized = true;

    // Listen to approval queue updates
    approvalEngine.subscribe(() => {
      this.renderApprovals();
      this.updateCounters();
    });
  }

  bindEvents() {
    // Sub-tab switching
    document.querySelectorAll('.gov-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-gov-tab');
        this.switchSubTab(tab);
      });
    });

    // Refresh buttons
    document.getElementById('btn-refresh-telemetry')?.addEventListener('click', () => {
      this.renderControlCenter();
    });

    document.getElementById('btn-refresh-approvals')?.addEventListener('click', () => {
      this.renderApprovals();
    });

    // Agent Builder Form
    const agentForm = document.getElementById('gov-create-agent-form');
    if (agentForm) {
      agentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCreateAgent();
      });
    }

    // RAG Search Query
    document.getElementById('btn-gov-rag-search')?.addEventListener('click', () => {
      this.handleRagSearch();
    });
    document.getElementById('gov-rag-query-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleRagSearch();
    });

    // Audit Exports
    document.getElementById('btn-export-audit-json')?.addEventListener('click', () => {
      const data = auditManager.exportAuditJSON();
      this.downloadFile('genisus_audit_trail.json', data, 'application/json');
    });

    document.getElementById('btn-export-audit-csv')?.addEventListener('click', () => {
      const data = auditManager.exportAuditCSV();
      this.downloadFile('genisus_audit_trail.csv', data, 'text/csv');
    });

    // AAS Skills Search & Filters
    document.getElementById('btn-aas-search')?.addEventListener('click', () => {
      this.handleAasSearch();
    });
    document.getElementById('aas-search-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handleAasSearch();
    });
    document.getElementById('aas-category-filter')?.addEventListener('change', () => {
      this.handleAasSearch();
    });
  }

  switchSubTab(tabName) {
    this.currentSubTab = tabName;
    document.querySelectorAll('.gov-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-gov-tab') === tabName);
    });

    document.querySelectorAll('.gov-tab-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`gov-panel-${tabName}`);
    if (activePanel) {
      activePanel.classList.add('active');
    }

    // Refresh tab content
    if (tabName === 'control-center') this.renderControlCenter();
    if (tabName === 'agent-builder') this.renderAgentBuilder();
    if (tabName === 'workflows') this.renderWorkflows();
    if (tabName === 'approvals') this.renderApprovals();
    if (tabName === 'policies') this.renderPolicies();
    if (tabName === 'rag') this.renderRag();
    if (tabName === 'audit') this.renderAudit();
    if (tabName === 'aas-skills') this.renderAasSkills();

    if (window.lucide) window.lucide.createIcons();
  }

  renderAll() {
    this.updateCounters();
    this.renderControlCenter();
    this.renderAgentBuilder();
    this.renderWorkflows();
    this.renderApprovals();
    this.renderPolicies();
    this.renderRag();
    this.renderAudit();
    this.renderAasSkills();
    if (window.lucide) window.lucide.createIcons();
  }

  updateCounters() {
    const pending = approvalEngine.getPendingApprovals();
    const counterEl = document.getElementById('gov-pending-counter');
    if (counterEl) {
      counterEl.textContent = pending.length;
      counterEl.style.display = pending.length > 0 ? 'inline-block' : 'none';
    }
  }

  // TAB 1: Control Center
  renderControlCenter() {
    const metrics = telemetryEngine.getDashboardMetrics();
    const invEl = document.getElementById('kpi-total-invocations');
    const blkEl = document.getElementById('kpi-policy-blocks');
    const hltEl = document.getElementById('kpi-halted-approvals');
    const tknEl = document.getElementById('kpi-token-cost');

    if (invEl) invEl.textContent = Number(metrics.totalInvocations).toLocaleString();
    if (blkEl) blkEl.textContent = metrics.policyBlocks;
    if (hltEl) hltEl.textContent = metrics.haltedForApproval;
    if (tknEl) tknEl.textContent = `${(metrics.totalTokensConsumed / 1000000).toFixed(1)}M / $${metrics.estimatedCostUSD}`;

    const tbody = document.getElementById('gov-telemetry-tbody');
    if (tbody) {
      tbody.innerHTML = metrics.agents.map(a => `
        <tr>
          <td><strong>${a.name}</strong><br/><span style="font-size: 10px; color: var(--text-dim);">${a.id}</span></td>
          <td><span class="badge-tag cyan">GENISUS-Astra</span></td>
          <td>${a.calls}</td>
          <td><span style="color: #30d158;">${Math.round((a.success / (a.calls || 1)) * 100)}%</span></td>
          <td>${a.avgMs}ms</td>
          <td>${Number(a.tokens).toLocaleString()}</td>
          <td><span class="badge-tag emerald">ONLINE</span></td>
        </tr>
      `).join('');
    }
  }

  // TAB 2: Agent Builder
  renderAgentBuilder() {
    const listEl = document.getElementById('gov-registered-agents-grid');
    if (!listEl) return;

    const allAgents = agentMarketplace.listAgents().slice(0, 10);
    listEl.innerHTML = allAgents.map(ag => `
      <div class="gov-agent-card">
        <div>
          <div class="gov-agent-card-title">${ag.name}</div>
          <div class="gov-agent-card-sub">${ag.purpose}</div>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <span class="badge-tag cyan">${ag.model || 'gpt-6-astra'}</span>
            <span class="risk-badge ${String(ag.riskLevel || 'medium').toLowerCase()}">${ag.riskLevel || 'MEDIUM'}</span>
            ${ag.requiresApproval ? '<span class="badge-tag amber">HITL GATE</span>' : '<span class="badge-tag emerald">AUTONOMOUS</span>'}
          </div>
        </div>
      </div>
    `).join('');

    const badge = document.getElementById('gov-agent-count-badge');
    if (badge) badge.textContent = `${allAgents.length} Active`;
  }

  handleCreateAgent() {
    const name = document.getElementById('agent-form-name').value.trim();
    const model = document.getElementById('agent-form-model').value;
    const purpose = document.getElementById('agent-form-purpose').value.trim();
    const systemPrompt = document.getElementById('agent-form-prompt').value.trim();
    const riskLevel = document.getElementById('agent-form-risk').value;
    const requiresApproval = document.getElementById('agent-form-approval').value === 'true';

    const toolBoxes = document.querySelectorAll('.gov-tool-checkboxes input[type="checkbox"]:checked');
    const tools = Array.from(toolBoxes).map(b => b.value);

    const created = agentMarketplace.createEnterpriseAgent({
      name,
      purpose,
      model,
      systemPrompt,
      riskLevel,
      requiresApproval,
      tools,
      permissions: ['EXECUTE_WITHIN_GUARDRAILS']
    });

    auditManager.recordEvent({
      agentId: created.id,
      agentName: created.name,
      actionType: 'AGENT_PROVISIONED',
      inputs: { model, riskLevel, requiresApproval, tools },
      riskLevel,
      approverId: 'sathish.s (Admin)',
      output: `Enterprise agent '${name}' successfully registered and deployed into runtime mesh.`,
      outcome: 'SUCCESS'
    });

    // Reset form & notify
    document.getElementById('gov-create-agent-form').reset();
    this.renderAgentBuilder();
    alert(`Agent "${name}" deployed successfully under Zero-Trust Governance.`);
  }

  // TAB 3: Workflows
  renderWorkflows() {
    const container = document.getElementById('gov-workflows-container');
    if (!container) return;

    const workflows = workflowEngine.getWorkflows();
    container.innerHTML = workflows.map(wf => `
      <div class="gov-workflow-card" id="card-${wf.id}">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-family: var(--font-tech); font-size: 13px; font-weight: 700; color: #fff;">${wf.name}</span>
            <span class="risk-badge ${wf.riskLevel.toLowerCase()}" style="margin-left: 8px;">${wf.riskLevel}</span>
          </div>
          <button class="gov-btn-primary" data-wf-id="${wf.id}" style="padding: 5px 12px; font-size: 11px;">
            <i data-lucide="play"></i> Execute Pipeline
          </button>
        </div>
        <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px;">${wf.description}</div>
        
        <div class="gov-wf-steps-flow">
          ${wf.steps.map(s => `
            <div class="gov-wf-step-chip ${s.requiresApproval ? 'approval' : ''}">
              <span>${s.stepId}. ${s.name}</span>
              ${s.requiresApproval ? ' ⚠️ (HITL Gate)' : ''}
            </div>
          `).join(' ➔ ')}
        </div>
      </div>
    `).join('');

    // Attach click listeners to execute buttons
    container.querySelectorAll('button[data-wf-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const wfId = e.currentTarget.getAttribute('data-wf-id');
        this.runWorkflow(wfId);
      });
    });
  }

  async runWorkflow(workflowId) {
    const consoleEl = document.getElementById('gov-workflow-console');
    const stepsList = document.getElementById('gov-workflow-steps-list');
    const liveStatus = document.getElementById('gov-workflow-live-status');

    if (consoleEl) consoleEl.style.display = 'block';
    if (stepsList) stepsList.innerHTML = '';
    if (liveStatus) {
      liveStatus.textContent = 'RUNNING';
      liveStatus.className = 'badge-tag amber';
    }

    const onProgress = (stepData) => {
      if (!stepsList) return;
      const stepDiv = document.createElement('div');
      stepDiv.className = 'prog-step active';
      stepDiv.style.padding = '4px 0';
      stepDiv.innerHTML = `
        <span class="step-check ${stepData.status === 'COMPLETED' ? 'done' : ''}"><i data-lucide="${stepData.status === 'COMPLETED' ? 'check' : 'loader'}"></i></span>
        <span style="color: ${stepData.status === 'WAITING_FOR_APPROVAL' ? '#ffd60a' : 'var(--text-primary)'}">
          Step ${stepData.stepId}: ${stepData.stepName} (${stepData.agent}) ➔ <strong>${stepData.status}</strong>
        </span>
      `;
      stepsList.appendChild(stepDiv);
      if (window.lucide) window.lucide.createIcons();
    };

    const res = await workflowEngine.executeWorkflow(workflowId, { operator: 'sathish.s' }, onProgress);

    if (res.status === 'WAITING_FOR_APPROVAL') {
      if (liveStatus) {
        liveStatus.textContent = 'WAITING FOR APPROVAL';
        liveStatus.className = 'badge-tag red-pulse';
      }
      this.renderApprovals();
      this.updateCounters();
    } else {
      if (liveStatus) {
        liveStatus.textContent = 'COMPLETED';
        liveStatus.className = 'badge-tag emerald';
      }
    }
  }

  // TAB 4: Approvals
  renderApprovals() {
    const listEl = document.getElementById('gov-approvals-list');
    if (!listEl) return;

    const allRequests = approvalEngine.getAllRequests();
    if (allRequests.length === 0) {
      listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 24px;">No pending or historical approval requests.</div>`;
      return;
    }

    listEl.innerHTML = allRequests.map(r => {
      const isPending = r.status === APPROVAL_STATUS.PENDING;
      const isApproved = r.status === APPROVAL_STATUS.APPROVED;
      const cardClass = isPending
        ? (r.riskLevel === RISK_LEVELS.CRITICAL || r.riskLevel === RISK_LEVELS.HIGH ? 'high-risk' : '')
        : (isApproved ? 'approved' : 'rejected');

      return `
        <div class="gov-approval-card ${cardClass}" id="card-${r.id}">
          <div class="gov-approval-header">
            <div>
              <span class="gov-approval-title">[${r.id}] ${r.title}</span>
              <span class="risk-badge ${r.riskLevel.toLowerCase()}" style="margin-left: 8px;">${r.riskLevel}</span>
            </div>
            <span class="badge-tag ${isPending ? 'amber' : (isApproved ? 'emerald' : 'red')}">${r.status}</span>
          </div>
          <div class="gov-approval-body">${r.description}</div>
          <div class="gov-approval-meta">
            <span>Agent: <strong>${r.agentName}</strong></span>
            <span>Requested By: <strong>${r.requestedBy}</strong></span>
            <span>Time: ${new Date(r.requestedAt).toLocaleTimeString()}</span>
          </div>
          ${r.policyViolations?.length ? `
            <div style="background: rgba(255, 69, 58, 0.08); border-left: 3px solid #ff453a; padding: 6px 10px; margin-bottom: 10px; font-size: 11px; color: #ff9f0a;">
              ${r.policyViolations.map(v => `<div>⚠️ ${v}</div>`).join('')}
            </div>
          ` : ''}
          ${r.decision ? `
            <div style="font-size: 11px; color: var(--text-dim); margin-bottom: 8px;">
              Decided by: <strong>${r.decision.approver}</strong> at ${new Date(r.decision.decidedAt).toLocaleTimeString()} · <em>${r.decision.notes || r.decision.reason}</em>
            </div>
          ` : ''}
          ${isPending ? `
            <div class="gov-approval-actions">
              <button class="btn-reject" data-app-reject="${r.id}"><i data-lucide="x"></i> Reject Directive</button>
              <button class="btn-approve" data-app-approve="${r.id}"><i data-lucide="check"></i> Authorize Execution</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    // Wire action buttons
    listEl.querySelectorAll('button[data-app-approve]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-app-approve');
        approvalEngine.approveRequest(id, 'sathish.s (Admin)', 'Approved via Governance Hub');
        this.renderApprovals();
        this.updateCounters();
      });
    });

    listEl.querySelectorAll('button[data-app-reject]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-app-reject');
        approvalEngine.rejectRequest(id, 'sathish.s (Admin)', 'Rejected via Governance Hub');
        this.renderApprovals();
        this.updateCounters();
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  // TAB 5: Policies
  renderPolicies() {
    const grid = document.getElementById('gov-policy-cards-grid');
    if (!grid) return;

    const policies = policyEngine.getAllPolicies();
    grid.innerHTML = policies.map(p => `
      <div class="gov-policy-card">
        <div class="gov-policy-header">
          <span class="gov-policy-title">[${p.id}] ${p.name}</span>
          <span class="risk-badge ${p.riskLevel.toLowerCase()}">${p.riskLevel}</span>
        </div>
        <div class="gov-policy-desc">${p.description}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
          <span style="font-size: 10.5px; color: var(--text-dim); font-family: var(--font-mono);">${p.type}</span>
          <label style="display: flex; align-items: center; gap: 6px; font-size: 11px; cursor: pointer;">
            <input type="checkbox" ${p.enabled ? 'checked' : ''} data-policy-toggle="${p.id}" />
            <span style="color: ${p.enabled ? '#30d158' : 'var(--text-muted)'}">${p.enabled ? 'Active' : 'Disabled'}</span>
          </label>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('input[data-policy-toggle]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const polId = e.currentTarget.getAttribute('data-policy-toggle');
        policyEngine.togglePolicy(polId, e.currentTarget.checked);
        this.renderPolicies();
      });
    });
  }

  // TAB 6: Governed RAG
  renderRag() {
    const docsContainer = document.getElementById('gov-docs-list');
    if (docsContainer) {
      const docs = governedRagEngine.getAllDocuments();
      docsContainer.innerHTML = docs.map(d => `
        <div class="gov-doc-item" style="background: rgba(8, 14, 26, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 10px; margin-bottom: 8px;">
          <div style="font-family: var(--font-tech); font-size: 12px; font-weight: 700; color: #fff;">${d.title}</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Category: ${d.category} · Chunks: ${d.chunkCount}</div>
          <div style="display: flex; gap: 6px; margin-top: 6px;">
            <span class="badge-tag cyan">${d.classification}</span>
            <span style="font-size: 10px; color: var(--text-dim);">ACL Roles: ${d.allowedRoles.join(', ')}</span>
          </div>
        </div>
      `).join('');
    }
  }

  handleRagSearch() {
    const query = document.getElementById('gov-rag-query-input')?.value.trim();
    const role = document.getElementById('gov-rag-role-select')?.value || 'admin';
    const resultsBox = document.getElementById('gov-rag-results-container');
    if (!query || !resultsBox) return;

    const res = governedRagEngine.queryKnowledge({ query, userRoles: [role], topK: 3 });

    if (res.chunks.length === 0) {
      resultsBox.innerHTML = `
        <div style="color: #ff453a; font-size: 11px; padding: 10px;">
          ⚠️ No authorized records found. (${res.accessDeniedCount} chunks blocked by ACL for role: <strong>${role}</strong>)
        </div>
      `;
      return;
    }

    resultsBox.innerHTML = `
      <div style="margin-bottom: 8px; font-size: 11px; color: var(--cyan);">
        Retrieved ${res.chunks.length} authorized chunks (${res.accessDeniedCount} filtered out by ACL guardrail):
      </div>
      ${res.chunks.map(c => `
        <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 6px; padding: 8px; margin-bottom: 6px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #fff;">
            <span>${c.docTitle} [${c.classification}]</span>
            <span class="badge-tag emerald">${Math.round(c.relevanceScore * 100)}% Match</span>
          </div>
          <div style="font-size: 11.5px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;">
            ${c.text}
          </div>
        </div>
      `).join('')}
    `;
  }

  // TAB 7: Audit & Risk
  renderAudit() {
    const auditScroll = document.getElementById('gov-audit-logs-container');
    if (auditScroll) {
      const logs = auditManager.getRecentLogs(15);
      auditScroll.innerHTML = logs.map(l => `
        <div class="gov-audit-item">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 700; color: #fff;">${l.actionType}</span>
            <span class="gov-hash-badge">${l.hash.substring(0, 16)}...</span>
          </div>
          <div style="color: var(--text-muted); font-size: 11px;">
            Agent: <strong>${l.agentName}</strong> · Approver: ${l.approverId} · Outcome: <span style="color: ${l.outcome === 'SUCCESS' || l.outcome === 'APPROVED_AND_EXECUTED' ? '#30d158' : '#ffd60a'}">${l.outcome}</span>
          </div>
          <div style="color: var(--text-dim); font-size: 10.5px; margin-top: 2px;">
            ${l.output}
          </div>
        </div>
      `).join('');
    }

    const grcContainer = document.getElementById('gov-grc-container');
    if (grcContainer) {
      const frameworks = riskManagementModule.getFrameworks();
      const risks = riskManagementModule.getRiskRegister();

      grcContainer.innerHTML = `
        <div style="margin-bottom: 12px;">
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">STATUTORY COMPLIANCE FRAMEWORKS</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            ${frameworks.map(f => `
              <div style="background: rgba(8, 14, 26, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 700;">
                  <span>${f.name}</span>
                  <span style="color: #30d158;">${f.complianceScore}</span>
                </div>
                <div style="font-size: 10px; color: var(--text-dim); margin-top: 2px;">${f.controlsPassing}/${f.controlsTotal} Controls Operational</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">KEY ENTERPRISE RISK REGISTER</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${risks.map(r => `
              <div style="background: rgba(8, 14, 26, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 8px; font-size: 11px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 700; color: #fff;">[${r.id}] ${r.title}</span>
                  <span class="badge-tag emerald">${r.status}</span>
                </div>
                <div style="color: var(--text-dim); font-size: 10px; margin-top: 2px;">
                  Controls: ${r.controlsApplied.join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
  }

  // TAB 8: AAS Skills Feed & Catalog
  renderAasSkills(filterQuery = '', filterCat = 'ALL') {
    const skillsContainer = document.getElementById('aas-skills-container');
    const pluginsContainer = document.getElementById('aas-plugins-container');
    const workflowsContainer = document.getElementById('aas-workflows-container');
    const countBadge = document.getElementById('aas-skills-count-badge');

    if (!skillsContainer) return;

    let skills = agenticAwesomeSkillsFeed.featuredSkills;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      skills = skills.filter(s =>
        s.id.includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    if (filterCat !== 'ALL') {
      skills = skills.filter(s => s.category.toLowerCase().includes(filterCat.toLowerCase()));
    }

    if (countBadge) countBadge.textContent = `${skills.length} Loaded`;

    // Render Skills Playbooks
    if (skills.length === 0) {
      skillsContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 20px;">No skills matched query "${filterQuery}". (Check full catalog at GitHub: sickn33/agentic-awesome-skills)</div>`;
    } else {
      skillsContainer.innerHTML = skills.map(sk => `
        <div class="gov-agent-card" style="flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <span class="gov-agent-card-title"><i data-lucide="zap" class="amber" style="width: 13px; height: 13px; display: inline;"></i> ${sk.name}</span>
            <span class="risk-badge low">VERIFIED PLAYBOOK</span>
          </div>
          <div style="font-size: 11.5px; color: var(--text-muted); line-height: 1.4;">${sk.description}</div>
          <div style="background: rgba(0, 240, 255, 0.05); border-left: 3px solid var(--cyan); padding: 6px 10px; font-size: 11px; color: var(--text-primary); font-family: var(--font-mono); margin: 4px 0;">
            ${sk.playbook}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 4px;">
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              ${sk.tags.map(t => `<span style="background: rgba(255, 255, 255, 0.06); padding: 2px 6px; border-radius: 4px; font-size: 10px; color: var(--text-dim);">${t}</span>`).join('')}
            </div>
            <button class="gov-action-btn small" data-load-skill="${sk.id}"><i data-lucide="download-cloud"></i> Load Playbook</button>
          </div>
        </div>
      `).join('');
    }

    // Render Specialized Plugins
    if (pluginsContainer) {
      const plugins = agenticAwesomeSkillsFeed.getPlugins();
      pluginsContainer.innerHTML = plugins.map(p => `
        <div style="background: rgba(8, 14, 26, 0.75); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="font-family: var(--font-tech); font-size: 11.5px; font-weight: 700; color: #fff;">${p.name}</div>
            <div style="font-size: 10.5px; color: var(--text-muted); margin-top: 2px; line-height: 1.3;">${p.bestFor}</div>
          </div>
          <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span class="badge-tag cyan">${p.skillsCount} Skills</span>
            <span style="font-size: 10px; color: var(--text-dim);">${p.category.split(' ')[0]}</span>
          </div>
        </div>
      `).join('');
    }

    // Render Execution Workflows
    if (workflowsContainer) {
      const wfs = agenticAwesomeSkillsFeed.getWorkflows();
      workflowsContainer.innerHTML = wfs.map(wf => `
        <div style="background: rgba(8, 14, 26, 0.75); border: 1px solid rgba(0, 240, 255, 0.15); border-radius: 6px; padding: 10px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="font-family: var(--font-tech); font-size: 12px; font-weight: 700; color: #fff;">${wf.name}</span>
            <span class="badge-tag emerald">${wf.category}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 3px;">${wf.description}</div>
          <div style="display: flex; gap: 4px; margin-top: 8px; overflow-x: auto; padding-bottom: 2px;">
            ${wf.steps.map(s => `<span style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; padding: 2px 6px; font-size: 10px; white-space: nowrap; color: var(--text-dim);">${s.step}. ${s.title}</span>`).join(' ➔ ')}
          </div>
        </div>
      `).join('');
    }

    // Wire Load Playbook buttons
    skillsContainer.querySelectorAll('button[data-load-skill]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-load-skill');
        const skill = agenticAwesomeSkillsFeed.getSkill(id);
        alert(`Loaded AAS Playbook "${skill.name}" into active GENISUS intelligence mesh.\n\nProtocol:\n${skill.playbook}`);
      });
    });

    if (window.lucide) window.lucide.createIcons();
  }

  handleAasSearch() {
    const query = document.getElementById('aas-search-input')?.value.trim() || '';
    const cat = document.getElementById('aas-category-filter')?.value || 'ALL';
    this.renderAasSkills(query, cat);
  }

  downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const governanceController = new GovernanceController();
