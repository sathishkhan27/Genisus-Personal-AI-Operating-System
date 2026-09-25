/**
 * Enterprise GRC & Risk Management Engine
 * Implements Risk Register, Key Risk Indicators (KRI),
 * Control Mapping (ISO 27001, SOC 2, DPDP Act, GDPR, RBI AI Directives),
 * and dynamic risk heatmaps.
 */

export const RISK_IMPACT = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
};

export const RISK_LIKELIHOOD = {
  RARE: 1,
  UNLIKELY: 2,
  POSSIBLE: 3,
  PROBABLE: 4
};

export class RiskManagementModule {
  constructor() {
    this.riskRegister = this.initRiskRegister();
    this.frameworks = this.initComplianceFrameworks();
    this.kris = this.initKRIs();
  }

  initRiskRegister() {
    return [
      {
        id: 'RSK-01',
        title: 'Unauthorized Production Database Schema Mutation',
        category: 'Data Integrity & Availability',
        inherentImpact: 'CRITICAL',
        inherentLikelihood: 'POSSIBLE',
        inherentScore: 12, // 4 * 3
        controlsApplied: ['POL-003: DB Write Lock', 'Two-Person Human-in-the-Loop Sign-off'],
        residualImpact: 'LOW',
        residualLikelihood: 'RARE',
        residualScore: 1, // 1 * 1
        status: 'MITIGATED',
        owner: 'SecOps & DBA Lead',
        frameworkMappings: ['SOC2-CC6.1', 'ISO27001-A.12.1.2']
      },
      {
        id: 'RSK-02',
        title: 'Customer PII Leakage via Agent Responses or RAG',
        category: 'Data Privacy & Compliance',
        inherentImpact: 'HIGH',
        inherentLikelihood: 'PROBABLE',
        inherentScore: 12, // 3 * 4
        controlsApplied: ['POL-004: DPDP/GDPR Redaction Filter', 'ACL-Gated Vector RAG'],
        residualImpact: 'LOW',
        residualLikelihood: 'UNLIKELY',
        residualScore: 2, // 1 * 2
        status: 'CONTROLLED',
        owner: 'Data Protection Officer',
        frameworkMappings: ['DPDP-Act-2023', 'GDPR-Art.32', 'ISO27001-A.18.1.4']
      },
      {
        id: 'RSK-03',
        title: 'Autonomous Financial Over-Disbursement',
        category: 'Financial Loss',
        inherentImpact: 'HIGH',
        inherentLikelihood: 'POSSIBLE',
        inherentScore: 9, // 3 * 3
        controlsApplied: ['POL-001: ₹50k Hard Ceiling', 'HITL approval above ₹10k'],
        residualImpact: 'MEDIUM',
        residualLikelihood: 'RARE',
        residualScore: 2,
        status: 'MITIGATED',
        owner: 'Finance Controller',
        frameworkMappings: ['RBI-Cyber-Framework', 'SOX-ITGC-3']
      },
      {
        id: 'RSK-04',
        title: 'Malicious External API Tool Exploitation / Data Exfiltration',
        category: 'Network & Perimeter Security',
        inherentImpact: 'CRITICAL',
        inherentLikelihood: 'POSSIBLE',
        inherentScore: 12,
        controlsApplied: ['POL-002: Zero-Trust Domain Whitelisting', 'MCP Sandbox Isolation'],
        residualImpact: 'LOW',
        residualLikelihood: 'UNLIKELY',
        residualScore: 2,
        status: 'MITIGATED',
        owner: 'CISO Office',
        frameworkMappings: ['ISO27001-A.13.1.1', 'SOC2-CC6.6']
      },
      {
        id: 'RSK-05',
        title: 'Model Hallucination in Automated Code Deployment',
        category: 'Software Reliability',
        inherentImpact: 'HIGH',
        inherentLikelihood: 'PROBABLE',
        inherentScore: 12,
        controlsApplied: ['POL-005: Mandated Regression Test Suite', 'Staging Validation Gate'],
        residualImpact: 'LOW',
        residualLikelihood: 'UNLIKELY',
        residualScore: 2,
        status: 'CONTROLLED',
        owner: 'Engineering Lead',
        frameworkMappings: ['ISO27001-A.14.2.8']
      }
    ];
  }

  initComplianceFrameworks() {
    return [
      {
        id: 'ISO-27001',
        name: 'ISO/IEC 27001:2022',
        complianceScore: '96%',
        controlsTotal: 93,
        controlsPassing: 89,
        description: 'Information Security Management System standards for autonomous AI operations.'
      },
      {
        id: 'SOC2-TYPE-II',
        name: 'SOC 2 Type II (Trust Services Criteria)',
        complianceScore: '94%',
        controlsTotal: 64,
        controlsPassing: 60,
        description: 'Security, Availability, and Confidentiality controls for cloud AI multi-tenancy.'
      },
      {
        id: 'DPDP-2023',
        name: 'India Digital Personal Data Protection (DPDP) Act 2023',
        complianceScore: '98%',
        controlsTotal: 28,
        controlsPassing: 27,
        description: 'Statutory compliance for customer data redaction, purpose limitation, and consent.'
      },
      {
        id: 'RBI-AI-GOV',
        name: 'Reserve Bank of India (RBI) AI & IT Governance Directives',
        complianceScore: '92%',
        controlsTotal: 40,
        controlsPassing: 37,
        description: 'Financial transaction thresholds, explainable decisioning, and non-repudiation.'
      }
    ];
  }

  initKRIs() {
    return [
      {
        id: 'KRI-01',
        name: 'Policy Block Rate',
        currentValue: '0.84%',
        threshold: '< 2.0%',
        status: 'HEALTHY',
        description: 'Percentage of agent actions blocked by zero-trust guardrails.'
      },
      {
        id: 'KRI-02',
        name: 'Pending Approvals Aging',
        currentValue: '18 min',
        threshold: '< 60 min',
        status: 'HEALTHY',
        description: 'Average human-in-the-loop review queue resolution time.'
      },
      {
        id: 'KRI-03',
        name: 'PII Detection Exposure',
        currentValue: '0 incidents',
        threshold: '0 incidents',
        status: 'OPTIMAL',
        description: 'Zero unmasked PII records emitted across all agent output channels.'
      }
    ];
  }

  getRiskRegister() {
    return this.riskRegister;
  }

  getFrameworks() {
    return this.frameworks;
  }

  getKRIs() {
    return this.kris;
  }

  calculateOverallPosture() {
    const totalRisks = this.riskRegister.length;
    const mitigated = this.riskRegister.filter(r => r.status === 'MITIGATED' || r.status === 'CONTROLLED').length;
    const avgCompliance = Math.round(
      this.frameworks.reduce((acc, f) => acc + parseInt(f.complianceScore), 0) / this.frameworks.length
    );

    return {
      totalRisks,
      mitigatedRisks: mitigated,
      riskMitigationRate: `${Math.round((mitigated / totalRisks) * 100)}%`,
      averageComplianceScore: `${avgCompliance}%`,
      activeKRIs: this.kris.length,
      kriHealth: 'ALL_NOMINAL'
    };
  }
}

export const riskManagementModule = new RiskManagementModule();
