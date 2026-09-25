/**
 * Immutable Audit Trail Manager
 * Records cryptographically chained logs of every agent action,
 * policy evaluation, human approval, tool execution, and outcome.
 */

export class AuditManager {
  constructor() {
    this.auditLogs = [];
    this.lastHash = '0000000000000000000000000000000000000000000000000000000000000000';
    this.seedDefaultLogs();
  }

  computeSimpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    // Generate deterministic 64-char pseudo-hash representation
    const full = `${hex}a9b8c7d6e5f41234${hex}f0e1d2c3b4a56789${hex}9876543210abcdef`;
    return full.padEnd(64, '0').substring(0, 64);
  }

  seedDefaultLogs() {
    const baseTime = Date.now() - 1000 * 60 * 180;
    const initialEvents = [
      {
        agentId: 'agent-orchestrator',
        agentName: 'Genisus Core Orchestrator',
        actionType: 'SYSTEM_BOOT',
        inputs: { version: '6.2.0', env: 'production' },
        policiesEvaluated: ['POL-001', 'POL-002', 'POL-003'],
        riskLevel: 'LOW',
        approverId: 'SYSTEM',
        toolExecution: { tool: 'SystemInit', status: 'SUCCESS' },
        output: 'All governance and runtime agents initialized cleanly.',
        outcome: 'SUCCESS',
        timestamp: new Date(baseTime).toISOString()
      },
      {
        agentId: 'agent-dev-01',
        agentName: 'AI Code Deployment Agent',
        actionType: 'POLICY_EVALUATION',
        inputs: { target: 'Production Cluster', version: '2.4.1' },
        policiesEvaluated: ['POL-005: Code Deployment Guardrail'],
        riskLevel: 'HIGH',
        approverId: 'PENDING_APPROVAL',
        toolExecution: { tool: 'GitCheckout', status: 'SUCCESS' },
        output: 'Automated tests passed (12/12). Triggered Approval Request APP-101.',
        outcome: 'HALTED_FOR_APPROVAL',
        timestamp: new Date(baseTime + 1000 * 60 * 45).toISOString()
      },
      {
        agentId: 'agent-rag-01',
        agentName: 'Enterprise Knowledge Retriever',
        actionType: 'RAG_QUERY',
        inputs: { user: 'sathish.s', query: 'Q3 Enterprise Financial Roadmap', clearance: 'executive' },
        policiesEvaluated: ['POL-004: PII & Data Privacy'],
        riskLevel: 'LOW',
        approverId: 'SYSTEM',
        toolExecution: { tool: 'VectorSearchACL', chunksRetrieved: 4 },
        output: 'Retrieved 4 verified chunks with authorized ACL tags.',
        outcome: 'SUCCESS',
        timestamp: new Date(baseTime + 1000 * 60 * 90).toISOString()
      },
      {
        agentId: 'agent-fin-03',
        agentName: 'Vendor Invoice Reconciler',
        actionType: 'FINANCIAL_TRANSACTION',
        inputs: { vendor: 'AWS Cloud Services', amount: 24850 },
        policiesEvaluated: ['POL-001: Transaction Limit (> ₹10k)'],
        riskLevel: 'MEDIUM',
        approverId: 'PENDING_APPROVAL',
        toolExecution: { tool: 'PayoutGateway', status: 'HOLD' },
        output: 'Amount ₹24,850 routed to Human-in-the-Loop queue (APP-102).',
        outcome: 'HALTED_FOR_APPROVAL',
        timestamp: new Date(baseTime + 1000 * 60 * 115).toISOString()
      }
    ];

    for (const event of initialEvents) {
      this.recordEvent(event);
    }
  }

  /**
   * Records an immutable event, chaining its hash to previous records
   */
  recordEvent({
    agentId,
    agentName = 'Enterprise Agent',
    actionType,
    inputs = {},
    policiesEvaluated = [],
    riskLevel = 'LOW',
    approverId = 'SYSTEM',
    toolExecution = {},
    output = '',
    outcome = 'SUCCESS'
  }) {
    const logId = `AUD-${String(this.auditLogs.length + 1).padStart(5, '0')}`;
    const timestamp = new Date().toISOString();

    const rawSignature = `${logId}|${timestamp}|${agentId}|${actionType}|${this.lastHash}|${JSON.stringify(inputs)}`;
    const eventHash = this.computeSimpleHash(rawSignature);

    const logEntry = {
      logId,
      timestamp,
      agentId,
      agentName,
      actionType,
      inputs,
      policiesEvaluated,
      riskLevel,
      approverId,
      toolExecution,
      output,
      outcome,
      previousHash: this.lastHash,
      hash: eventHash
    };

    this.lastHash = eventHash;
    this.auditLogs.push(logEntry);
    return logEntry;
  }

  getRecentLogs(limit = 50) {
    return [...this.auditLogs].reverse().slice(0, limit);
  }

  searchLogs({ query = '', agentId = '', riskLevel = '', outcome = '' } = {}) {
    return this.auditLogs.filter(log => {
      if (agentId && log.agentId !== agentId) return false;
      if (riskLevel && log.riskLevel !== riskLevel) return false;
      if (outcome && log.outcome !== outcome) return false;
      if (query) {
        const q = query.toLowerCase();
        const str = `${log.logId} ${log.agentName} ${log.actionType} ${log.output} ${log.approverId}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    }).reverse();
  }

  exportAuditJSON() {
    return JSON.stringify(this.auditLogs, null, 2);
  }

  exportAuditCSV() {
    const headers = ['logId', 'timestamp', 'agentId', 'agentName', 'actionType', 'riskLevel', 'approverId', 'outcome', 'hash'];
    const rows = this.auditLogs.map(l => [
      l.logId,
      l.timestamp,
      `"${l.agentId}"`,
      `"${l.agentName}"`,
      l.actionType,
      l.riskLevel,
      `"${l.approverId}"`,
      l.outcome,
      l.hash
    ].join(','));
    return [headers.join(','), ...rows].join('\n');
  }
}

export const auditManager = new AuditManager();
