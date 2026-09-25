/**
 * Multi-Agent Workflow Engine
 * Orchestrates multi-step, multi-agent enterprise business workflows
 * with conditional routing, policy evaluation, tool calls, and human approval gates.
 */

import { policyEngine, RISK_LEVELS } from './policyEngine.js';
import { approvalEngine } from './approvalEngine.js';
import { auditManager } from './auditManager.js';
import { telemetryEngine } from './telemetryEngine.js';

export const WORKFLOW_STATUS = {
  IDLE: 'IDLE',
  RUNNING: 'RUNNING',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export class WorkflowEngine {
  constructor() {
    this.workflows = this.loadDefaultWorkflows();
    this.executionHistory = [];
  }

  loadDefaultWorkflows() {
    return [
      {
        id: 'WF-DEV-01',
        name: 'Enterprise Software Delivery & Deployment Pipeline',
        category: 'DevOps & Engineering',
        description: 'End-to-end governed software delivery: Requirement Spec -> Code Synthesis -> Static Analysis -> Security Scan -> Testing -> Human Approval Gate -> Production Deploy.',
        riskLevel: RISK_LEVELS.HIGH,
        steps: [
          { stepId: 1, name: 'Requirement Analysis', agent: 'AI Product Architect', tool: 'SpecAnalyzer', requiresApproval: false },
          { stepId: 2, name: 'Code Generation & Patching', agent: 'AI Developer Agent', tool: 'CodeGenerator', requiresApproval: false },
          { stepId: 3, name: 'Static Analysis & Linting', agent: 'Code Quality Inspector', tool: 'ESLintSecurity', requiresApproval: false },
          { stepId: 4, name: 'Automated Regression Suite', agent: 'Test Automation Agent', tool: 'ViteTestRunner', requiresApproval: false },
          { stepId: 5, name: 'Zero-Trust Policy Check', agent: 'Governance Gatekeeper', tool: 'PolicyEngine', requiresApproval: false },
          { stepId: 6, name: 'Human-in-the-Loop Release Approval', agent: 'Production Release Manager', tool: 'ApprovalEngine', requiresApproval: true },
          { stepId: 7, name: 'Canary Deployment & Verification', agent: 'Infrastructure Deployer', tool: 'K8sCanary', requiresApproval: false }
        ]
      },
      {
        id: 'WF-API-02',
        name: 'Autonomous API Quality & Security Assessment',
        category: 'Quality Assurance',
        description: 'Parses OpenAPI/Swagger specs, tests rate limits, verifies authentication boundaries, and produces an enterprise audit report.',
        riskLevel: RISK_LEVELS.MEDIUM,
        steps: [
          { stepId: 1, name: 'Swagger / OpenAPI Spec Parsing', agent: 'Spec Parser Agent', tool: 'OpenApiLoader', requiresApproval: false },
          { stepId: 2, name: 'Dynamic Contract Testing', agent: 'Contract Validator', tool: 'ContractRunner', requiresApproval: false },
          { stepId: 3, name: 'Auth & SQL Injection PenTest', agent: 'Security PenTester', tool: 'SecurityFuzzer', requiresApproval: false },
          { stepId: 4, name: 'Compliance & Audit Report Synthesis', agent: 'Audit Reporter', tool: 'AuditDocGen', requiresApproval: false }
        ]
      },
      {
        id: 'WF-IAM-03',
        name: 'Zero-Trust Employee IAM Access Review & Provisioning',
        category: 'Identity & Access Management',
        description: 'Validates internal identity requests, checks segregation of duties, calculates access risk, requests manager sign-off, and provisions time-bound credentials.',
        riskLevel: RISK_LEVELS.CRITICAL,
        steps: [
          { stepId: 1, name: 'Identity & HRMS Verification', agent: 'HR Onboarding Agent', tool: 'WorkdayAPI', requiresApproval: false },
          { stepId: 2, name: 'Segregation of Duties (SoD) Risk Check', agent: 'Risk Assessor', tool: 'SoDMatrixEvaluator', requiresApproval: false },
          { stepId: 3, name: 'Department Head & Security Approval', agent: 'Approval Dispatcher', tool: 'ApprovalEngine', requiresApproval: true },
          { stepId: 4, name: 'Time-Bound Token Provisioning', agent: 'IAM Provisioner', tool: 'VaultKeyGen', requiresApproval: false }
        ]
      }
    ];
  }

  getWorkflows() {
    return this.workflows;
  }

  getWorkflowById(id) {
    return this.workflows.find(w => w.id === id);
  }

  /**
   * Executes a workflow step by step with simulated telemetry, policy checks, and approval gates
   * @param {string} workflowId
   * @param {Object} inputContext
   * @param {Function} [onProgress] Callback for UI step-by-step progress updates
   */
  async executeWorkflow(workflowId, inputContext = {}, onProgress = null) {
    const wf = this.getWorkflowById(workflowId);
    if (!wf) {
      return { success: false, error: 'Workflow not found' };
    }

    const runId = `RUN-${Date.now().toString().slice(-6)}`;
    const runRecord = {
      runId,
      workflowId: wf.id,
      workflowName: wf.name,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: WORKFLOW_STATUS.RUNNING,
      completedSteps: [],
      currentStep: 1,
      approvalRequestId: null,
      output: null
    };

    this.executionHistory.unshift(runRecord);

    for (const step of wf.steps) {
      runRecord.currentStep = step.stepId;
      if (onProgress) {
        onProgress({
          runId,
          stepId: step.stepId,
          stepName: step.name,
          agent: step.agent,
          status: 'IN_PROGRESS'
        });
      }

      // If step requires human approval gate
      if (step.requiresApproval) {
        const approvalReq = approvalEngine.createApprovalRequest({
          agentId: `wf-${wf.id}`,
          agentName: step.agent,
          actionType: 'WORKFLOW_APPROVAL_GATE',
          title: `Authorize Step ${step.stepId}: ${step.name}`,
          description: `Multi-agent workflow '${wf.name}' reached a critical checkpoint requiring human clearance.`,
          riskLevel: wf.riskLevel,
          payload: { workflowId: wf.id, runId, stepId: step.stepId, inputContext }
        });

        runRecord.status = WORKFLOW_STATUS.WAITING_FOR_APPROVAL;
        runRecord.approvalRequestId = approvalReq.id;

        auditManager.recordEvent({
          agentId: `wf-${wf.id}`,
          agentName: step.agent,
          actionType: 'WORKFLOW_PAUSED_FOR_APPROVAL',
          inputs: { workflowId: wf.id, runId, step: step.name },
          riskLevel: wf.riskLevel,
          approverId: 'PENDING_APPROVAL',
          output: `Workflow execution paused. Approval request ${approvalReq.id} generated.`,
          outcome: 'HALTED_FOR_APPROVAL'
        });

        telemetryEngine.recordExecution({
          agentId: `wf-${wf.id}`,
          agentName: step.agent,
          durationMs: 120,
          tokens: 280,
          haltedForApproval: true
        });

        if (onProgress) {
          onProgress({
            runId,
            stepId: step.stepId,
            stepName: step.name,
            agent: step.agent,
            status: 'WAITING_FOR_APPROVAL',
            approvalId: approvalReq.id
          });
        }

        return {
          runId,
          status: WORKFLOW_STATUS.WAITING_FOR_APPROVAL,
          message: `Workflow halted at step ${step.stepId} (${step.name}) awaiting human review.`,
          approvalRequest: approvalReq
        };
      }

      // Simulate step execution delay & telemetry
      const stepDuration = 300 + Math.floor(Math.random() * 200);
      await new Promise(r => setTimeout(r, stepDuration));

      runRecord.completedSteps.push({
        stepId: step.stepId,
        name: step.name,
        agent: step.agent,
        tool: step.tool,
        durationMs: stepDuration,
        status: 'SUCCESS'
      });

      telemetryEngine.recordExecution({
        agentId: `wf-${wf.id}`,
        agentName: step.agent,
        durationMs: stepDuration,
        tokens: 350 + Math.floor(Math.random() * 150),
        success: true
      });

      auditManager.recordEvent({
        agentId: `wf-${wf.id}`,
        agentName: step.agent,
        actionType: 'WORKFLOW_STEP_COMPLETED',
        inputs: { stepId: step.stepId, stepName: step.name },
        riskLevel: 'LOW',
        output: `Completed step execution with tool ${step.tool}.`,
        outcome: 'SUCCESS'
      });

      if (onProgress) {
        onProgress({
          runId,
          stepId: step.stepId,
          stepName: step.name,
          agent: step.agent,
          status: 'COMPLETED'
        });
      }
    }

    runRecord.status = WORKFLOW_STATUS.COMPLETED;
    runRecord.completedAt = new Date().toISOString();
    runRecord.output = `Workflow '${wf.name}' executed all ${wf.steps.length} steps with 100% policy compliance.`;

    return {
      runId,
      status: WORKFLOW_STATUS.COMPLETED,
      completedSteps: runRecord.completedSteps,
      summary: runRecord.output
    };
  }

  getExecutionHistory() {
    return this.executionHistory;
  }
}

export const workflowEngine = new WorkflowEngine();
