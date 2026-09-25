/**
 * Agent Telemetry & Observability Engine
 * Tracks active agents, invocations, token/cost counters, latency metrics,
 * policy evaluation statistics, and operational health.
 */

export class TelemetryEngine {
  constructor() {
    this.metrics = {
      totalInvocations: 1420,
      successfulInvocations: 1398,
      failedInvocations: 8,
      haltedForApproval: 14,
      policyBlocks: 12,
      totalTokensConsumed: 1845200,
      estimatedCostUSD: 4.82,
      averageLatencyMs: 412,
      activeAgentsCount: 8,
      lastUpdated: new Date().toISOString()
    };

    this.agentStats = new Map();
    this.initDefaultAgentStats();
  }

  initDefaultAgentStats() {
    const agents = [
      { id: 'agent-dev-01', name: 'AI Code Deployment Agent', calls: 320, success: 312, tokens: 480000, avgMs: 620 },
      { id: 'agent-sec-02', name: 'Enterprise Access Provisioner', calls: 190, success: 185, tokens: 210000, avgMs: 380 },
      { id: 'agent-fin-03', name: 'Vendor Invoice Reconciler', calls: 145, success: 141, tokens: 195000, avgMs: 450 },
      { id: 'agent-rag-01', name: 'Enterprise Knowledge Retriever', calls: 410, success: 410, tokens: 520000, avgMs: 290 },
      { id: 'agent-orchestrator', name: 'Genisus Core Orchestrator', calls: 355, success: 350, tokens: 440200, avgMs: 320 }
    ];

    for (const a of agents) {
      this.agentStats.set(a.id, a);
    }
  }

  recordExecution({
    agentId,
    agentName = 'Enterprise Agent',
    durationMs = 350,
    tokens = 450,
    success = true,
    policyBlocked = false,
    haltedForApproval = false
  }) {
    this.metrics.totalInvocations++;
    this.metrics.totalTokensConsumed += tokens;

    // Approximate cost: $0.002 per 1k tokens blended
    const additionalCost = (tokens / 1000) * 0.002;
    this.metrics.estimatedCostUSD = Number((this.metrics.estimatedCostUSD + additionalCost).toFixed(4));

    if (policyBlocked) {
      this.metrics.policyBlocks++;
    } else if (haltedForApproval) {
      this.metrics.haltedForApproval++;
    } else if (success) {
      this.metrics.successfulInvocations++;
    } else {
      this.metrics.failedInvocations++;
    }

    // Rolling latency calculation
    this.metrics.averageLatencyMs = Math.round(
      (this.metrics.averageLatencyMs * 0.9) + (durationMs * 0.1)
    );
    this.metrics.lastUpdated = new Date().toISOString();

    // Agent level stats
    const stats = this.agentStats.get(agentId) || {
      id: agentId,
      name: agentName,
      calls: 0,
      success: 0,
      tokens: 0,
      avgMs: durationMs
    };

    stats.calls++;
    if (success) stats.success++;
    stats.tokens += tokens;
    stats.avgMs = Math.round((stats.avgMs * 0.85) + (durationMs * 0.15));

    this.agentStats.set(agentId, stats);
  }

  getDashboardMetrics() {
    const agentList = Array.from(this.agentStats.values());
    return {
      ...this.metrics,
      activeAgentsCount: this.agentStats.size,
      agents: agentList,
      successRate: (
        (this.metrics.successfulInvocations / (this.metrics.totalInvocations || 1)) * 100
      ).toFixed(1) + '%'
    };
  }
}

export const telemetryEngine = new TelemetryEngine();
