/**
 * Governed MCP & Enterprise Tool Gateway
 * Acts as an audited proxy for all tool invocations (GitHub, Jira, PostgreSQL, Slack, REST, Docker)
 * enforcing zero-trust pre-execution policy checks, sandbox isolation, and telemetry recording.
 */

import { policyEngine, RISK_LEVELS } from '../governance/policyEngine.js';
import { auditManager } from '../governance/auditManager.js';
import { telemetryEngine } from '../governance/telemetryEngine.js';
import { approvalEngine } from '../governance/approvalEngine.js';

export class McpGateway {
  constructor() {
    this.registeredTools = this.initRegisteredTools();
  }

  initRegisteredTools() {
    return [
      {
        id: 'tool-github',
        name: 'GitHub Enterprise MCP Connector',
        category: 'Source Control',
        status: 'CONNECTED',
        capabilities: ['create_pull_request', 'review_code', 'merge_pull_request', 'read_repository'],
        riskTier: RISK_LEVELS.MEDIUM,
        requiresApprovalFor: ['merge_pull_request']
      },
      {
        id: 'tool-postgres',
        name: 'Neon PostgreSQL Database Gateway',
        category: 'Databases',
        status: 'CONNECTED',
        capabilities: ['query_read', 'query_write', 'schema_describe', 'explain_plan'],
        riskTier: RISK_LEVELS.HIGH,
        requiresApprovalFor: ['query_write']
      },
      {
        id: 'tool-jira',
        name: 'Atlassian Jira Project Manager',
        category: 'Issue Tracking',
        status: 'CONNECTED',
        capabilities: ['create_ticket', 'update_status', 'assign_engineer', 'search_issues'],
        riskTier: RISK_LEVELS.LOW,
        requiresApprovalFor: []
      },
      {
        id: 'tool-slack',
        name: 'Slack Enterprise Alert Dispatcher',
        category: 'Communication',
        status: 'CONNECTED',
        capabilities: ['send_channel_alert', 'send_dm', 'request_approval_ping'],
        riskTier: RISK_LEVELS.LOW,
        requiresApprovalFor: []
      },
      {
        id: 'tool-k8s',
        name: 'Kubernetes Cluster Controller',
        category: 'Cloud Infrastructure',
        status: 'CONNECTED',
        capabilities: ['get_pods', 'scale_deployment', 'restart_pod', 'apply_manifest'],
        riskTier: RISK_LEVELS.CRITICAL,
        requiresApprovalFor: ['scale_deployment', 'apply_manifest']
      },
      {
        id: 'tool-rest-api',
        name: 'Outbound REST API Client',
        category: 'Network',
        status: 'CONNECTED',
        capabilities: ['http_get', 'http_post', 'http_put'],
        riskTier: RISK_LEVELS.MEDIUM,
        requiresApprovalFor: ['http_post', 'http_put']
      }
    ];
  }

  getTools() {
    return this.registeredTools;
  }

  getTool(toolId) {
    return this.registeredTools.find(t => t.id === toolId);
  }

  /**
   * Executes a tool invocation under zero-trust governance
   * @param {Object} params
   * @param {string} params.agentId
   * @param {string} params.agentName
   * @param {string} params.toolId
   * @param {string} params.action
   * @param {Object} params.payload
   * @param {string} [params.userRole]
   */
  async invokeTool({ agentId, agentName, toolId, action, payload = {}, userRole = 'analyst' }) {
    const tool = this.getTool(toolId);
    if (!tool) {
      return { success: false, error: `Tool '${toolId}' is not registered in MCP Gateway.` };
    }

    const startTime = Date.now();

    // 1. Evaluate zero-trust policy
    let actionType = 'TOOL_INVOCATION';
    if (toolId === 'tool-postgres') actionType = action === 'query_write' ? 'DATABASE_EXEC' : 'DATABASE_QUERY';
    if (toolId === 'tool-rest-api') actionType = 'CALL_EXTERNAL_API';
    if (toolId === 'tool-k8s') actionType = 'INFRASTRUCTURE_MUTATION';

    const policyEval = policyEngine.evaluateAction({
      agentId,
      actionType,
      payload,
      userRole
    });

    // If tool specifies inherent approval requirement
    if (tool.requiresApprovalFor.includes(action)) {
      policyEval.requiresApproval = true;
    }

    if (policyEval.requiresApproval) {
      const approvalReq = approvalEngine.createApprovalRequest({
        agentId,
        agentName,
        actionType: `${tool.name}::${action}`,
        title: `Execute ${action} on ${tool.name}`,
        description: `Agent requested execution of ${action} with parameters: ${JSON.stringify(payload).slice(0, 100)}...`,
        riskLevel: tool.riskTier,
        payload: { toolId, action, payload },
        policyViolations: policyEval.policyViolations.map(v => v.message)
      });

      auditManager.recordEvent({
        agentId,
        agentName,
        actionType: `TOOL_${action.toUpperCase()}_HALTED`,
        inputs: { toolId, action, payload },
        policiesEvaluated: policyEval.policyViolations.map(v => v.policyId),
        riskLevel: tool.riskTier,
        approverId: 'PENDING_APPROVAL',
        output: `Tool invocation paused. Human approval request ${approvalReq.id} generated.`,
        outcome: 'HALTED_FOR_APPROVAL'
      });

      telemetryEngine.recordExecution({
        agentId,
        agentName,
        durationMs: Date.now() - startTime,
        tokens: 150,
        haltedForApproval: true
      });

      return {
        success: false,
        status: 'HALTED_FOR_APPROVAL',
        message: `Action requires human clearance. Approval ticket ${approvalReq.id} created.`,
        approvalRequestId: approvalReq.id
      };
    }

    if (!policyEval.allowed) {
      auditManager.recordEvent({
        agentId,
        agentName,
        actionType: `TOOL_${action.toUpperCase()}_BLOCKED`,
        inputs: { toolId, action, payload },
        policiesEvaluated: policyEval.policyViolations.map(v => v.policyId),
        riskLevel: policyEval.riskLevel,
        output: 'Action prohibited by zero-trust policy.',
        outcome: 'BLOCKED_BY_POLICY'
      });

      telemetryEngine.recordExecution({
        agentId,
        agentName,
        durationMs: Date.now() - startTime,
        tokens: 100,
        policyBlocked: true
      });

      return {
        success: false,
        status: 'BLOCKED',
        violations: policyEval.policyViolations,
        message: 'Tool call blocked by active security guardrails.'
      };
    }

    // 2. Simulated tool execution
    const executionDuration = 120 + Math.floor(Math.random() * 150);
    await new Promise(r => setTimeout(r, executionDuration));

    const simulatedResult = {
      toolId,
      action,
      executedAt: new Date().toISOString(),
      outputSummary: `Successfully executed ${action} via ${tool.name}.`,
      data: { status: 'OK', recordsAffected: 1 }
    };

    // 3. Telemetry and Immutable Audit record
    telemetryEngine.recordExecution({
      agentId,
      agentName,
      durationMs: Date.now() - startTime,
      tokens: 280,
      success: true
    });

    auditManager.recordEvent({
      agentId,
      agentName,
      actionType: `TOOL_${action.toUpperCase()}`,
      inputs: { toolId, action, payload },
      policiesEvaluated: ['ZERO_TRUST_PASS'],
      riskLevel: 'LOW',
      toolExecution: { tool: tool.name, action, status: 'SUCCESS' },
      output: simulatedResult.outputSummary,
      outcome: 'SUCCESS'
    });

    return {
      success: true,
      status: 'SUCCESS',
      result: simulatedResult
    };
  }
}

export const mcpGateway = new McpGateway();
