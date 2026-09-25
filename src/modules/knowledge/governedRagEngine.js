/**
 * Enterprise Governed RAG Engine
 * Implements permission-aware semantic/keyword retrieval,
 * document ACL enforcement, chunk lineage, and verifiable source citations.
 */

export class GovernedRagEngine {
  constructor() {
    this.documents = [];
    this.chunks = [];
    this.seedDefaultKnowledgeBase();
  }

  seedDefaultKnowledgeBase() {
    const defaultDocs = [
      {
        id: 'DOC-POL-01',
        title: 'Enterprise AI Governance & Zero-Trust Architecture Standard',
        category: 'Policy & Architecture',
        classification: 'Internal',
        allowedRoles: ['admin', 'engineering', 'compliance', 'analyst', 'public'],
        content: `
        Section 1: Core Architecture Principles
        Genisus AI operates on model agnosticism, MCP interoperability, governed RAG, and autonomous multi-agent orchestration.
        Every external API call must pass through the zero-trust policy engine. No autonomous agent is permitted to write directly
        to production databases without two-party human-in-the-loop review.
        
        Section 2: Security & Access Boundaries
        Tokens and credentials must be stored in secure isolated vaults. All agent activities produce immutable SHA-chained audit logs.
        Data loss prevention (DLP) filters inspect both incoming user context and outbound model generations.
        `
      },
      {
        id: 'DOC-FIN-02',
        title: 'Corporate Financial Delegation of Authority & Payout Limits',
        category: 'Finance & Compliance',
        classification: 'Confidential',
        allowedRoles: ['admin', 'finance', 'executive'],
        content: `
        Section 1: Automated Payment Thresholds
        AI financial agents may autonomously reconcile and approve invoices up to INR 10,000.
        Transactions between INR 10,001 and INR 50,000 require single Manager sign-off in the Human-in-the-Loop portal.
        Transactions above INR 50,000 require dual authorization (Finance Director + VP of Operations).
        
        Section 2: Vendor Whitelist & Banking Safeguards
        Payouts may only be directed towards validated vendors registered in the Enterprise ERP ledger.
        Any change in vendor bank account numbers locks the account for 72 hours pending manual telephone verification.
        `
      },
      {
        id: 'DOC-SEC-03',
        title: 'Customer Data Protection & PII Masking Standards (DPDP Act)',
        category: 'Data Privacy',
        classification: 'Restricted',
        allowedRoles: ['admin', 'compliance', 'legal'],
        content: `
        Section 1: Indian DPDP Act 2023 Compliance
        Aadhaar numbers, PAN cards, phone numbers, and home addresses must undergo strict synthetic tokenization or masking before entering LLM context windows.
        Employees in customer support may only view partial data (last 4 digits).
        
        Section 2: Incident Escalation Protocol
        Any potential PII exposure must be reported to the Data Protection Officer within 6 hours.
        The auditManager records all extraction attempts with cryptographic proof.
        `
      },
      {
        id: 'DOC-ENG-04',
        title: 'CI/CD Automated Deployment Guidelines & Canary Safeguards',
        category: 'Engineering & DevOps',
        classification: 'Internal',
        allowedRoles: ['admin', 'engineering', 'qa'],
        content: `
        Section 1: Automated Release Checklist
        Before any code is promoted to staging or production, all unit tests, integration tests, and static security scans must return exit code 0.
        The AI Software Development Agent must generate a complete architectural impact report.
        
        Section 2: Canary Routing
        New releases are deployed to 5% of internal traffic for 15 minutes before 100% rollout.
        If error rate exceeds 0.05%, automated rollback is initiated immediately.
        `
      }
    ];

    for (const doc of defaultDocs) {
      this.ingestDocument(doc);
    }
  }

  /**
   * Ingests and chunks a document with ACL tags
   */
  ingestDocument({ id, title, category, classification = 'Internal', allowedRoles = ['admin'], content }) {
    const docId = id || `DOC-${Date.now()}`;
    const doc = {
      id: docId,
      title,
      category,
      classification,
      allowedRoles,
      ingestedAt: new Date().toISOString()
    };
    this.documents.push(doc);

    // Naive semantic chunking by sections or paragraphs
    const rawChunks = content.split('\n\n').map(c => c.trim()).filter(Boolean);
    rawChunks.forEach((chunkText, idx) => {
      this.chunks.push({
        chunkId: `${docId}-C${idx + 1}`,
        docId,
        docTitle: title,
        classification,
        allowedRoles,
        text: chunkText,
        keywords: this.extractKeywords(chunkText)
      });
    });

    return { success: true, docId, chunksCreated: rawChunks.length };
  }

  extractKeywords(text) {
    return Array.from(new Set(
      text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 3)
    ));
  }

  /**
   * Performs permission-aware retrieval strictly filtered by requesting user's roles
   * @param {Object} params
   * @param {string} params.query
   * @param {string[]} [params.userRoles] Roles held by user, e.g. ['analyst'] or ['admin', 'finance']
   * @param {number} [params.topK] Maximum chunks to return
   */
  queryKnowledge({ query, userRoles = ['analyst'], topK = 4 }) {
    const queryTerms = this.extractKeywords(query);
    if (queryTerms.length === 0) {
      return { chunks: [], citations: [], accessDeniedCount: 0 };
    }

    let accessDeniedCount = 0;
    const scoredChunks = [];

    for (const chunk of this.chunks) {
      // 1. ACL Permission Check
      const hasAccess = chunk.allowedRoles.some(r => userRoles.includes(r) || r === 'public');
      
      // Calculate keyword overlap score
      let matchCount = 0;
      for (const term of queryTerms) {
        if (chunk.keywords.includes(term)) matchCount++;
      }

      if (matchCount > 0) {
        if (!hasAccess) {
          accessDeniedCount++;
          continue; // Filter out chunk strictly
        }

        const score = matchCount / queryTerms.length;
        scoredChunks.push({
          chunkId: chunk.chunkId,
          docTitle: chunk.docTitle,
          classification: chunk.classification,
          text: chunk.text,
          relevanceScore: Number(score.toFixed(2)),
          allowedRoles: chunk.allowedRoles
        });
      }
    }

    // Sort by relevance score descending
    scoredChunks.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topResults = scoredChunks.slice(0, topK);

    // Form citations
    const citations = topResults.map(c => ({
      source: c.docTitle,
      chunkRef: c.chunkId,
      classification: c.classification,
      relevance: `${Math.round(c.relevanceScore * 100)}%`
    }));

    return {
      query,
      userRoles,
      chunks: topResults,
      citations,
      accessDeniedCount,
      totalMatched: topResults.length
    };
  }

  getAllDocuments() {
    return this.documents.map(d => ({
      ...d,
      chunkCount: this.chunks.filter(c => c.docId === d.id).length
    }));
  }
}

export const governedRagEngine = new GovernedRagEngine();
