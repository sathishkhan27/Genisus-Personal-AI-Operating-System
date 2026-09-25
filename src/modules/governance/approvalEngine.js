/**
 * Human-In-The-Loop (HITL) Approval Engine
 * Provides multi-tier approval routing for high-risk agent directives,
 * maintaining accountability, audit trails, and execution safeguards.
 */

import { RISK_LEVELS } from './policyEngine.js';

export const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  EXPIRED: 'EXPIRED'
};

export class ApprovalEngine {
  constructor() {
    this.requests = [];
    this.subscribers = new Set();
    this.loadSampleApprovals();
  }

  loadSampleApprovals() {
    this.requests = [
      {
        id: 'APP-101',
        agentId: 'agent-dev-01',
        agentName: 'AI Code Deployment Agent',
        actionType: 'DEPLOY_CODE',
        title: 'Deploy Hotfix v2.4.1 to Production Cluster',
        description: 'Automated patch for API rate limiting and token cache invalidation.',
        riskLevel: RISK_LEVELS.HIGH,
        requestedBy: 'SYSTEM_AUTOMATION',
        requestedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        status: APPROVAL_STATUS.PENDING,
        payload: {
          environment: 'production',
          commitSha: 'a8b7c3d',
          testsPassed: true,
          affectedServices: ['auth-service', 'api-gateway']
        },
        policyViolations: ['POL-005: Production Code Deployment Guardrail (Human sign-off required)'],
        decision: null
      },
      {
        id: 'APP-102',
        agentId: 'agent-fin-03',
        agentName: 'Vendor Invoice Reconciler',
        actionType: 'FINANCIAL_TRANSACTION',
        title: 'Authorize Cloud Infrastructure Payout ₹24,850',
        description: 'Payment to AWS & Cloudflare monthly reserved instances.',
        riskLevel: RISK_LEVELS.MEDIUM,
        requestedBy: 'AI Invoice Reconciliation Agent',
        requestedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
        status: APPROVAL_STATUS.PENDING,
        payload: {
          vendor: 'AWS Cloud Services',
          amount: 24850,
          currency: 'INR',
          accountNumber: '•••• 4921'
        },
        policyViolations: ['POL-001: Financial Transaction Limit (Threshold > ₹10,000)'],
        decision: null
      },
      {
        id: 'APP-103',
        agentId: 'agent-sec-02',
        agentName: 'Enterprise Access Provisioner',
        actionType: 'IAM_PERMISSION_GRANT',
        title: 'Grant Production Read-Replica Access to Data Engineer',
        description: 'Temporary 48-hour access for quarterly BI reporting extraction.',
        riskLevel: RISK_LEVELS.HIGH,
        requestedBy: 'HR Onboarding Agent',
        requestedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        status: APPROVAL_STATUS.APPROVED,
        payload: {
          userEmail: 'karthik.r@enterprise.io',
          role: 'ReadReplica_Reporting',
          durationHours: 48
        },
        policyViolations: ['POL-003: Database Access Guardrail'],
        decision: {
          approver: 'sathish.s (Admin)',
          decidedAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
          notes: 'Approved for 48h scheduled audit reporting.'
        }
      }
    ];
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers() {
    for (const sub of this.subscribers) {
      try {
        sub(this.getPendingApprovals());
      } catch (err) {
        console.error('Approval subscriber notification error:', err);
      }
    }
  }

  getPendingApprovals() {
    return this.requests.filter(r => r.status === APPROVAL_STATUS.PENDING);
  }

  getAllRequests() {
    return [...this.requests].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  }

  getRequestById(id) {
    return this.requests.find(r => r.id === id);
  }

  /**
   * Creates a new pending approval item from an evaluated policy decision
   */
  createApprovalRequest({
    agentId,
    agentName = 'Enterprise Agent',
    actionType,
    title,
    description,
    riskLevel = RISK_LEVELS.HIGH,
    payload = {},
    policyViolations = [],
    requestedBy = 'SYSTEM'
  }) {
    const nextId = `APP-${100 + this.requests.length + 1}`;
    const newRequest = {
      id: nextId,
      agentId,
      agentName,
      actionType,
      title: title || `${actionType} requested by ${agentName}`,
      description: description || 'Autonomous action flagged for Human-in-the-Loop review.',
      riskLevel,
      requestedBy,
      requestedAt: new Date().toISOString(),
      status: APPROVAL_STATUS.PENDING,
      payload,
      policyViolations,
      decision: null
    };

    this.requests.unshift(newRequest);
    this.notifySubscribers();
    return newRequest;
  }

  /**
   * Approves a request
   */
  approveRequest(id, approver = 'sathish.s (Admin)', notes = 'Approved via Governance HUD') {
    const request = this.getRequestById(id);
    if (!request) return { success: false, error: 'Request not found' };
    if (request.status !== APPROVAL_STATUS.PENDING) {
      return { success: false, error: `Request is already ${request.status}` };
    }

    request.status = APPROVAL_STATUS.APPROVED;
    request.decision = {
      approver,
      decidedAt: new Date().toISOString(),
      notes
    };

    this.notifySubscribers();
    return { success: true, request };
  }

  /**
   * Rejects a request
   */
  rejectRequest(id, approver = 'sathish.s (Admin)', reason = 'Action rejected under security compliance policy') {
    const request = this.getRequestById(id);
    if (!request) return { success: false, error: 'Request not found' };
    if (request.status !== APPROVAL_STATUS.PENDING) {
      return { success: false, error: `Request is already ${request.status}` };
    }

    request.status = APPROVAL_STATUS.REJECTED;
    request.decision = {
      approver,
      decidedAt: new Date().toISOString(),
      reason
    };

    this.notifySubscribers();
    return { success: true, request };
  }
}

export const approvalEngine = new ApprovalEngine();
