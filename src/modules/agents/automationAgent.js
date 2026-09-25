import { memoryStore } from '../memory/memoryStore.js';

export class AutomationAgent {
  constructor() {
    this.name = 'Automation & Security Agent';
    this.role = 'Proactive Monitoring, Scheduled Triggers & Safety Gates';
    this.monitoredItems = [
      { id: 'mon-1', type: 'PRICE_WATCH', target: 'MacBook Pro M3 Max', threshold: '₹3,40,000', status: 'Active' },
      { id: 'mon-2', type: 'DEADLINE', target: 'Portfolio Builder Template Schema Review', due: 'Today 6:00 PM', status: 'Approaching' },
      { id: 'mon-3', type: 'EXPENSE_SENTRY', target: 'Cloud GPU Inference API Billing', threshold: '₹75,000', status: 'Warning (82%)' }
    ];
  }

  getProactiveAlerts() {
    return [
      {
        id: 'alt-1',
        severity: 'URGENT',
        title: 'Project Deadline Approaching',
        message: 'Portfolio Builder template schema review is scheduled for 6:00 PM today.',
        time: 'Just now'
      },
      {
        id: 'alt-2',
        severity: 'OPPORTUNITY',
        title: 'New SaaS Market Gap Detected',
        message: 'Surge in developer searches for "Indian GST Invoice API for Stripe/Paddle" (+38%).',
        time: '12m ago'
      },
      {
        id: 'alt-3',
        severity: 'INFO',
        title: 'Cloud Cost Optimization',
        message: 'Switching test image models to quantized edge endpoints can reduce burn by ₹14,000/mo.',
        time: '1h ago'
      }
    ];
  }

  process(query) {
    const q = query.toLowerCase();

    // User Control: "Stop"
    if (q === 'stop' || q.includes('stop talking') || q.includes('silence') || q.includes('நிறுத்து') || q.includes('ருக்கோ')) {
      return {
        agent: this.name,
        mode: 'COMMAND_FEEDBACK',
        language: 'en-US',
        speechText: '', // Stay silent!
        displayText: '🛑 **GENISUS voice output interrupted.** All ongoing speech and processes paused.',
        source: 'User Immediate Control Directive'
      };
    }

    // User Control: "Forget this" / "Don't remember this"
    if (q.includes('forget') || q.includes('don\'t remember') || q.includes('erase') || q.includes('மறந்துவிடு')) {
      memoryStore.forgetRecentConversation();
      return {
        agent: this.name,
        mode: 'COMMAND_FEEDBACK',
        language: 'en-US',
        speechText: 'Context erased. I have forgotten our recent conversation history as instructed.',
        displayText: `🛡️ **Memory Sanitized**: Short-term session memory purged.
- **Audit**: Logged event \`MEMORY_PURGE\`
- **Permission**: Zero telemetry retained for this session.`,
        source: 'User Privacy Enforcement'
      };
    }

    // User Control: "Why did you recommend this?" / "Show sources"
    if (q.includes('source') || q.includes('why') && q.includes('recommend') || q.includes('data you used')) {
      return {
        agent: this.name,
        mode: 'AUDIT_INSPECTION',
        language: 'en-US',
        speechText: 'Displaying complete data origin, confidence ratings, and permission authorizations.',
        displayText: `### 🛡️ GENISUS Data Transparency & Provenance
- **Active Data Sources**:
  1. Local Project Repositories (\`scratch/portfolio-builder\`, \`scratch/pingzo-app\`, \`scratch/booknowgo\`)
  2. Verified Financial Ledger (August-September 2026 MRR records)
  3. Wearable Biometric Sensor Cache (Sleep, HR, Step metrics)
  4. Universal Product Catalog (EAN/Barcode verified Apple & Google stores)
- **Security Posture**: End-to-end encrypted storage, Role-based permission gate active.`,
        source: 'Security Audit & Compliance Layer'
      };
    }

    // Dangerous/Sensitive action trigger requiring confirmation
    if (q.includes('delete') || q.includes('deploy production') || q.includes('transfer money') || q.includes('drop database')) {
      return {
        agent: this.name,
        mode: 'SECURITY_CONFIRMATION_REQUIRED',
        language: 'en-US',
        speechText: 'Sensitive action detected. Explicit confirmation is required before proceeding.',
        displayText: `⚠️ **Action Requires Explicit Authorization**:
The requested operation: \`"${query}"\` involves critical data or financial/deployment systems.
Please confirm in the security prompt to proceed.`,
        data: { query, requiresConfirmation: true },
        source: 'GENISUS Security Guardrail'
      };
    }

    // Automation / Remind query
    if (q.includes('remind') || q.includes('monitor') || q.includes('schedule') || q.includes('alert')) {
      return {
        agent: this.name,
        mode: 'AUTOMATION_ACTIVE',
        language: 'en-US',
        speechText: `Scheduled automated monitoring rule: "${query}". I will proactively alert you.`,
        displayText: `⚡ **Automation Trigger Initialized**:
- **Rule**: \`${query}\`
- **Schedule Engine**: Background Sentry Daemon Active
- **Notification**: Instant Voice & HUD Broadcast upon trigger condition`,
        source: 'Automation & Scheduler Daemon'
      };
    }

    return null;
  }
}
