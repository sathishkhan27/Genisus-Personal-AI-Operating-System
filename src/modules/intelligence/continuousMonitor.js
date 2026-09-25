// GENISUS — Continuous Background Monitoring Engine (Section 19)
// Continuously tracks user-configured triggers:
// MONITOR ➔ NEW INFORMATION ➔ CHANGE DETECTED ➔ RELEVANCE ANALYSIS ➔ USER IMPACT ➔ NOTIFICATION

export class ContinuousMonitor {
  constructor() {
    this.watchlist = [];
    this.alerts = [];
    this.listeners = [];

    this.initDefaultWatchlist();
  }

  initDefaultWatchlist() {
    this.addMonitor({
      id: 'mon-flutter-releases',
      category: 'FRAMEWORK',
      target: 'Flutter / Dart Major Releases',
      triggerCondition: 'New Flutter 3.x / 4.x stable version tagged on GitHub',
      relevance: 'Direct impact on mobile applications (Shreeja Ulagam, PingZO Delivery)',
      status: 'ACTIVE',
      lastChecked: '2 minutes ago'
    });

    this.addMonitor({
      id: 'mon-ai-coding-models',
      category: 'AI_TECH',
      target: 'AI Coding & Agentic Models',
      triggerCondition: 'New coding benchmark release or context window expansion',
      relevance: 'Updates career roadmap and GENISUS AI Developer Agent capabilities',
      status: 'ACTIVE',
      lastChecked: '5 minutes ago'
    });

    this.addMonitor({
      id: 'mon-github-ci',
      category: 'DEVOPS',
      target: 'GitHub CI/CD on sathishkhan27 Repos',
      triggerCondition: 'Workflow failure or failing build on main branch',
      relevance: 'High priority: Triggers automatic AI Root Cause Analysis & bugfix workflow',
      status: 'ACTIVE',
      lastChecked: 'Just now'
    });

    this.addMonitor({
      id: 'mon-cloud-db-latency',
      category: 'INFRASTRUCTURE',
      target: 'Neon PostgreSQL Compute Latency',
      triggerCondition: 'Query roundtrip exceeding 250ms or compute suspension',
      relevance: 'Ensures uninterrupted real-time telemetry for PingZO & BookNowGo',
      status: 'ACTIVE',
      lastChecked: '1 minute ago'
    });
  }

  addMonitor(config) {
    const item = {
      id: config.id || 'mon-' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      ...config
    };
    this.watchlist.push(item);
    this.notify();
    return item;
  }

  triggerAlert({ monitorId, title, changeDetail, userImpact, severity = 'INFO' }) {
    const monitor = this.watchlist.find(m => m.id === monitorId) || { target: 'General Watchlist' };
    const alertRecord = {
      id: 'alert-' + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      monitorId,
      target: monitor.target,
      title,
      changeDetail,
      userImpact,
      severity // INFO, WARNING, CRITICAL
    };

    this.alerts.unshift(alertRecord);
    if (this.alerts.length > 50) this.alerts.pop();

    this.notify();
    return alertRecord;
  }

  getWatchlist() {
    return this.watchlist;
  }

  getAlerts() {
    return this.alerts;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const state = { watchlist: this.watchlist, alerts: this.alerts };
    this.listeners.forEach(fn => fn(state));
  }
}

export const continuousMonitor = new ContinuousMonitor();
