// GENISUS — Self-Improvement & Continuous Evolution Engine
// Systematically evaluates capability, latency, tool call frequencies, reliability,
// and operator feedback to formulate governed GENISUS Improvement Proposals.
//
// STRICT GOVERNANCE (Section 23):
// GENISUS must NEVER silently modify its core security model, disable audit logs,
// alter confirmation gates, or grant itself unauthorized permissions.

export class EvolutionEngine {
  constructor() {
    this.proposals = [];
    this.telemetryLogs = [];
    this.governanceViolations = [];
    this.listeners = [];

    this.initBaselineProposals();
  }

  // Baseline initial improvement proposals observed during development
  initBaselineProposals() {
    this.proposals.push({
      id: 'prop-001',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      agentId: 'product-agent',
      agentName: 'ProductAgent v2.5',
      observedIssue: 'Product searches executed 5 sequential tool calls across separate pricing and OCR endpoints.',
      recommendation: 'Implement Parallel Retrieval & Cache in ProductResearchAgent pipeline.',
      expectedImprovement: '↓ 38% latency, ↓ duplicate API searches, ↑ consistency',
      risk: 'LOW',
      governanceAudit: 'PASSED (Zero security boundary alterations)',
      status: 'WAITING_FOR_APPROVAL' // WAITING_FOR_APPROVAL, APPROVED, REJECTED, STAGED_IN_SANDBOX
    });

    this.proposals.push({
      id: 'prop-002',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      agentId: 'coding-agent',
      agentName: 'CodingAgent v4.0',
      observedIssue: 'Large multi-file git diff rendering in single viewport causes layout height shift.',
      recommendation: 'Pre-compute hunk summaries and cache unified diffs in virtualized scrolling DOM.',
      expectedImprovement: '↓ DOM memory by 45%, smoother 60fps animations in Cockpit HUD.',
      risk: 'LOW',
      governanceAudit: 'PASSED (Local UI enhancement only)',
      status: 'WAITING_FOR_APPROVAL'
    });
  }

  // Record operational telemetry (e.g. latency, tool count, user corrections)
  logTelemetry({ agentId, action, durationMs, toolCallsCount = 1, success = true, userCorrection = null }) {
    const entry = {
      timestamp: new Date().toISOString(),
      agentId,
      action,
      durationMs,
      toolCallsCount,
      success,
      userCorrection
    };

    this.telemetryLogs.unshift(entry);
    if (this.telemetryLogs.length > 200) this.telemetryLogs.pop();

    // If excessive tool calls or user corrections detected, generate an improvement proposal
    if (toolCallsCount >= 4 || userCorrection) {
      this.generateProposalFromTelemetry(entry);
    }
  }

  generateProposalFromTelemetry(telemetry) {
    const propId = 'prop-' + Date.now().toString(36);
    const proposal = {
      id: propId,
      timestamp: new Date().toISOString(),
      agentId: telemetry.agentId,
      agentName: `${telemetry.agentId} Telemetry Auto-Optimizer`,
      observedIssue: telemetry.userCorrection
        ? `Operator correction recorded on action "${telemetry.action}": "${telemetry.userCorrection}"`
        : `Elevated tool calls (${telemetry.toolCallsCount}) detected in ${telemetry.action} (${telemetry.durationMs}ms).`,
      recommendation: telemetry.userCorrection
        ? `Incorporate operator nuance into specialized prompt embeddings and memory weights.`
        : `Optimize workflow routing with composite tool pre-fetching.`,
      expectedImprovement: '↓ Latency by ~25%, ↑ contextual accuracy.',
      risk: 'LOW',
      governanceAudit: this.auditGovernanceSafety(proposal),
      status: 'WAITING_FOR_APPROVAL'
    };

    this.proposals.unshift(proposal);
    this.notify();
    return proposal;
  }

  // Strict Governance Audit per Section 23
  auditGovernanceSafety(proposal) {
    const forbiddenPatterns = [
      'security model', 'disable audit', 'remove confirmation',
      'grant permission', 'silent push', 'bypass gate', 'exfiltrate'
    ];

    const text = (proposal?.recommendation || '').toLowerCase();
    const violation = forbiddenPatterns.find(p => text.includes(p));

    if (violation) {
      this.governanceViolations.push({
        timestamp: new Date().toISOString(),
        proposalId: proposal.id,
        violation: `Attempted forbidden self-modification matching "${violation}"`
      });
      return 'FAILED: Prohibited security boundary change categorically blocked.';
    }

    return 'PASSED: Complies with Section 23 Self-Improvement Governance.';
  }

  approveProposal(propId) {
    const p = this.proposals.find(item => item.id === propId);
    if (p) {
      p.status = 'APPROVED';
      p.approvedAt = new Date().toISOString();
      this.notify();
      return { success: true, proposal: p };
    }
    return { success: false, error: 'Proposal not found' };
  }

  rejectProposal(propId) {
    const p = this.proposals.find(item => item.id === propId);
    if (p) {
      p.status = 'REJECTED';
      this.notify();
      return { success: true, proposal: p };
    }
    return { success: false, error: 'Proposal not found' };
  }

  listProposals() {
    return this.proposals;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.proposals));
  }
}

export const evolutionEngine = new EvolutionEngine();
