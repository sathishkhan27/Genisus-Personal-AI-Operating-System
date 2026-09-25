/**
 * Central Zero-Trust Policy Engine
 * Enforces enterprise guardrails, transaction limits, PII protection, database write locks, and risk tiering.
 */

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

export const POLICY_TYPES = {
  TRANSACTION_LIMIT: 'TRANSACTION_LIMIT',
  EXTERNAL_API_WHITELIST: 'EXTERNAL_API_WHITELIST',
  DATABASE_ACCESS: 'DATABASE_ACCESS',
  PII_PROTECTION: 'PII_PROTECTION',
  CODE_DEPLOYMENT: 'CODE_DEPLOYMENT',
  CUSTOMER_COMMUNICATION: 'CUSTOMER_COMMUNICATION',
  INFRASTRUCTURE_MUTATION: 'INFRASTRUCTURE_MUTATION'
};

export class PolicyEngine {
  constructor() {
    this.policies = this.loadDefaultPolicies();
  }

  loadDefaultPolicies() {
    return [
      {
        id: 'POL-001',
        name: 'Financial Transaction Limit',
        type: POLICY_TYPES.TRANSACTION_LIMIT,
        enabled: true,
        riskLevel: RISK_LEVELS.HIGH,
        parameters: {
          maxAmountINR: 50000,
          requiresApprovalAbove: 10000
        },
        description: 'Blocks automated financial transactions above ₹50,000; requires Human-in-the-Loop review above ₹10,000.'
      },
      {
        id: 'POL-002',
        name: 'Enterprise External API Whitelist',
        type: POLICY_TYPES.EXTERNAL_API_WHITELIST,
        enabled: true,
        riskLevel: RISK_LEVELS.MEDIUM,
        parameters: {
          allowedDomains: [
            'api.openai.com',
            'api.anthropic.com',
            'generativelanguage.googleapis.com',
            'api.github.com',
            'api.slack.com',
            'api.atlassian.com',
            'localhost',
            '127.0.0.1'
          ]
        },
        description: 'Strictly forbids calling unverified 3rd party outbound endpoints without security review.'
      },
      {
        id: 'POL-003',
        name: 'Production Database Guardrail',
        type: POLICY_TYPES.DATABASE_ACCESS,
        enabled: true,
        riskLevel: RISK_LEVELS.CRITICAL,
        parameters: {
          allowDirectDropOrTruncate: false,
          allowWriteWithoutApproval: false,
          protectedTables: ['users', 'financial_ledgers', 'auth_tokens', 'compliance_audit']
        },
        description: 'Blocks automated schema destruction (DROP/TRUNCATE) and requires admin sign-off for mutations on core tables.'
      },
      {
        id: 'POL-004',
        name: 'PII & Customer Data Privacy (DPDP & GDPR)',
        type: POLICY_TYPES.PII_PROTECTION,
        enabled: true,
        riskLevel: RISK_LEVELS.HIGH,
        parameters: {
          redactAadhaar: true,
          redactPAN: true,
          redactCardNumbers: true,
          requireManagerApprovalForRawPII: true
        },
        description: 'Automatic redaction of Indian Aadhaar, PAN, and payment cards; raw PII view requires supervisor authorization.'
      },
      {
        id: 'POL-005',
        name: 'Production Code Deployment Guardrail',
        type: POLICY_TYPES.CODE_DEPLOYMENT,
        enabled: true,
        riskLevel: RISK_LEVELS.HIGH,
        parameters: {
          requireAutomatedTestsPassed: true,
          requirePeerReview: true,
          requireHumanApprovalBeforeDeploy: true
        },
        description: 'No automated agent may deploy code directly to production without passing tests and human sign-off.'
      },
      {
        id: 'POL-006',
        name: 'Customer-Facing Communication Gate',
        type: POLICY_TYPES.CUSTOMER_COMMUNICATION,
        enabled: true,
        riskLevel: RISK_LEVELS.MEDIUM,
        parameters: {
          autoSendThreshold: 0.95,
          requireApprovalForMassEmail: true
        },
        description: 'Autonomous communications to >10 customers or with confidence <95% require agent manager review.'
      }
    ];
  }

  getAllPolicies() {
    return this.policies;
  }

  getPolicy(id) {
    return this.policies.find(p => p.id === id);
  }

  updatePolicy(id, updates) {
    const policy = this.getPolicy(id);
    if (policy) {
      Object.assign(policy, updates);
      return { success: true, policy };
    }
    return { success: false, error: 'Policy not found' };
  }

  togglePolicy(id, enabled) {
    const policy = this.getPolicy(id);
    if (policy) {
      policy.enabled = enabled !== undefined ? enabled : !policy.enabled;
      return { success: true, policy };
    }
    return { success: false, error: 'Policy not found' };
  }

  addPolicy(newPolicy) {
    const id = newPolicy.id || `POL-${String(this.policies.length + 1).padStart(3, '0')}`;
    const policy = {
      id,
      name: newPolicy.name || 'Custom Policy',
      type: newPolicy.type || 'CUSTOM',
      enabled: newPolicy.enabled ?? true,
      riskLevel: newPolicy.riskLevel || RISK_LEVELS.MEDIUM,
      parameters: newPolicy.parameters || {},
      description: newPolicy.description || 'User-defined zero trust policy'
    };
    this.policies.push(policy);
    return { success: true, policy };
  }

  /**
   * Evaluates an intended agent action against active zero-trust policies
   * @param {Object} context
   * @param {string} context.agentId
   * @param {string} context.actionType
   * @param {Object} context.payload
   * @param {string} [context.userRole]
   * @returns {Object} Evaluation report with allowed, requiresApproval, riskLevel, violations
   */
  evaluateAction({ agentId, actionType, payload = {}, userRole = 'analyst' }) {
    const violations = [];
    let requiresApproval = false;
    let highestRiskLevel = RISK_LEVELS.LOW;

    const escalateRisk = (level) => {
      const hierarchy = [RISK_LEVELS.LOW, RISK_LEVELS.MEDIUM, RISK_LEVELS.HIGH, RISK_LEVELS.CRITICAL];
      if (hierarchy.indexOf(level) > hierarchy.indexOf(highestRiskLevel)) {
        highestRiskLevel = level;
      }
    };

    for (const policy of this.policies) {
      if (!policy.enabled) continue;

      // 1. Transaction Limit Policy
      if (policy.type === POLICY_TYPES.TRANSACTION_LIMIT && actionType === 'FINANCIAL_TRANSACTION') {
        const amount = Number(payload.amount || 0);
        if (amount > policy.parameters.maxAmountINR) {
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.CRITICAL,
            message: `Requested ₹${amount} exceeds ceiling of ₹${policy.parameters.maxAmountINR}. Action blocked.`
          });
          escalateRisk(RISK_LEVELS.CRITICAL);
        } else if (amount > policy.parameters.requiresApprovalAbove) {
          requiresApproval = true;
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.HIGH,
            message: `Amount ₹${amount} requires Human-in-the-Loop review before dispatch.`
          });
          escalateRisk(RISK_LEVELS.HIGH);
        }
      }

      // 2. Outbound API Whitelist
      if (policy.type === POLICY_TYPES.EXTERNAL_API_WHITELIST && actionType === 'CALL_EXTERNAL_API') {
        const targetUrl = payload.url || '';
        let domain = '';
        try {
          domain = new URL(targetUrl).hostname;
        } catch {
          domain = targetUrl;
        }
        const isAllowed = policy.parameters.allowedDomains.some(d => domain === d || domain.endsWith('.' + d));
        if (!isAllowed) {
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.HIGH,
            message: `Destination host '${domain}' is not on the corporate API whitelist.`
          });
          escalateRisk(RISK_LEVELS.HIGH);
          requiresApproval = true;
        }
      }

      // 3. Database Write & Destructive Operation Guardrail
      if (policy.type === POLICY_TYPES.DATABASE_ACCESS && (actionType === 'DATABASE_QUERY' || actionType === 'DATABASE_EXEC')) {
        const sql = (payload.query || payload.sql || '').toUpperCase();
        if (sql.includes('DROP ') || sql.includes('TRUNCATE ') || sql.includes('DELETE FROM')) {
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.CRITICAL,
            message: 'Destructive SQL operation detected. Direct execution prohibited.'
          });
          escalateRisk(RISK_LEVELS.CRITICAL);
          requiresApproval = true;
        }

        const isMutation = sql.includes('INSERT ') || sql.includes('UPDATE ') || sql.includes('ALTER ');
        if (isMutation && policy.parameters.protectedTables) {
          for (const tbl of policy.parameters.protectedTables) {
            if (sql.includes(tbl.toUpperCase())) {
              violations.push({
                policyId: policy.id,
                policyName: policy.name,
                severity: RISK_LEVELS.HIGH,
                message: `Mutation on protected production table '${tbl}' requires explicit manager approval.`
              });
              escalateRisk(RISK_LEVELS.HIGH);
              requiresApproval = true;
            }
          }
        }
      }

      // 4. PII Redaction & Access
      if (policy.type === POLICY_TYPES.PII_PROTECTION && (actionType === 'DATA_EXTRACTION' || actionType === 'CUSTOMER_DATA_READ')) {
        if (payload.containsPII) {
          if (userRole !== 'admin' && userRole !== 'compliance_officer') {
            violations.push({
              policyId: policy.id,
              policyName: policy.name,
              severity: RISK_LEVELS.HIGH,
              message: 'Accessing unmasked customer PII requires supervisor approval for role: ' + userRole
            });
            escalateRisk(RISK_LEVELS.HIGH);
            requiresApproval = true;
          }
        }
      }

      // 5. Code Deployment
      if (policy.type === POLICY_TYPES.CODE_DEPLOYMENT && actionType === 'DEPLOY_CODE') {
        escalateRisk(RISK_LEVELS.HIGH);
        requiresApproval = true;
        if (!payload.testsPassed) {
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.CRITICAL,
            message: 'Deployment blocked: Verification test suite has not run or has failed.'
          });
          escalateRisk(RISK_LEVELS.CRITICAL);
        }
      }

      // 6. Mass Customer Communication
      if (policy.type === POLICY_TYPES.CUSTOMER_COMMUNICATION && actionType === 'SEND_COMMUNICATION') {
        const recipientCount = Number(payload.recipientCount || 1);
        if (recipientCount > 10) {
          violations.push({
            policyId: policy.id,
            policyName: policy.name,
            severity: RISK_LEVELS.MEDIUM,
            message: `Outbound campaign to ${recipientCount} recipients requires review.`
          });
          escalateRisk(RISK_LEVELS.MEDIUM);
          requiresApproval = true;
        }
      }
    }

    const isDirectlyBlocked = violations.some(v => v.severity === RISK_LEVELS.CRITICAL && !requiresApproval);
    const allowed = violations.length === 0 || (!isDirectlyBlocked && !requiresApproval);

    return {
      agentId,
      actionType,
      allowed,
      requiresApproval,
      riskLevel: highestRiskLevel,
      policyViolations: violations,
      timestamp: new Date().toISOString()
    };
  }
}

export const policyEngine = new PolicyEngine();
