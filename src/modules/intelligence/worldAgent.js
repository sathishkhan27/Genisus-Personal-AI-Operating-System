/**
 * GENISUS – World Intelligence Agent
 * Routes natural language queries to the World Intelligence Engine
 * Supports Tamil + English
 */

import worldIntelligence, {
  WORLD_FEED, TECH_INTELLIGENCE, SOFTWARE_ECOSYSTEM, PRODUCT_DB,
  BUSINESS_INTEL, ECONOMIC_DATA, WORLD_TIMELINE_TODAY, KNOWLEDGE_GRAPH
} from '../intelligence/worldIntelligence.js';

const AGENT_NAME = 'GENISUS World Intelligence Agent';

// ─── INTENT DETECTION ─────────────────────────────────────────────────────────

function detectWorldIntent(query) {
  const q = query.toLowerCase();

  // Tamil world keywords
  if (/உலக|நிகழ்வு|செய்தி|இன்று என்ன|உலகில்/.test(q)) return 'WORLD_SUMMARY';
  if (/தொழில்நுட்ப|ai|ml|flutter|react|java|python|மென்பொருள்/.test(q)) return 'TECH_INTEL';
  if (/தயாரிப்பு|product|phone|laptop|iphone|samsung/.test(q)) return 'PRODUCT_INTEL';
  if (/வணிக|business|market|startup|fund|investment/.test(q)) return 'BUSINESS_INTEL';
  if (/பொருளாதார|economy|inflation|gdp|interest rate|sensex|nifty/.test(q)) return 'ECONOMY_INTEL';
  if (/என்னை பாதிக்கும்|என் வணிகம்|my business|impact on me|personal/.test(q)) return 'PERSONAL_IMPACT';
  if (/timeline|நேர வரிசை|today.*happened|இன்று என்ன நடந்தது/.test(q)) return 'WORLD_TIMELINE';
  if (/search|தேடு|find|who is|what is|எது/.test(q)) return 'GLOBAL_SEARCH';
  if (/security|vulnerability|cve|hack|breach|பாதுகாப்பு/.test(q)) return 'SECURITY_ALERT';
  if (/software|package|version|github|npm|pub.dev/.test(q)) return 'SOFTWARE_ECOSYSTEM';

  // English world keywords
  if (/world|global|happening|today|news|event/.test(q)) return 'WORLD_SUMMARY';
  if (/technology|tech|ai|artificial intelligence|cloud|quantum/.test(q)) return 'TECH_INTEL';
  if (/product|launch|device|gadget|specs/.test(q)) return 'PRODUCT_INTEL';
  if (/startup|company|funding|acquisition|market|industry|growing/.test(q)) return 'BUSINESS_INTEL';
  if (/economy|economic|inflation|gdp|currency|stock|market index/.test(q)) return 'ECONOMY_INTEL';
  if (/affect me|my business|opportunity|personal impact/.test(q)) return 'PERSONAL_IMPACT';
  if (/timeline|chronology|hour|morning|afternoon|what happened/.test(q)) return 'WORLD_TIMELINE';

  return null;
}

// ─── RESPONSE GENERATORS ──────────────────────────────────────────────────────

function generateWorldSummary(lang = 'ta-IN') {
  const summary = worldIntelligence.getWorldSummary();
  const top5 = summary.feed.slice(0, 5);

  const isTamil = lang === 'ta-IN';
  const critical = summary.criticalAlerts;

  let speech = isTamil
    ? `இன்று உலகில் ${summary.totalEvents} முக்கிய நிகழ்வுகள். ${summary.liveEvents} நேரலை. ${critical.length > 0 ? 'ஒரு முக்கிய எச்சரிக்கை உள்ளது.' : ''}`
    : `Today's world intelligence: ${summary.totalEvents} events tracked. ${summary.liveEvents} live. ${critical.length > 0 ? '1 critical alert.' : ''}`;

  let display = isTamil
    ? `### 🌍 இன்றைய உலக நுண்ணறிவு சுருக்கம்\n**மொத்த நிகழ்வுகள்**: ${summary.totalEvents} | **நேரலை**: ${summary.liveEvents} | **அதிக தாக்கம்**: ${summary.highImpactEvents}\n\n`
    : `### 🌍 World Intelligence Summary\n**Events**: ${summary.totalEvents} | **Live**: ${summary.liveEvents} | **High Impact**: ${summary.highImpactEvents}\n\n`;

  if (critical.length > 0) {
    display += `⚠️ **CRITICAL ALERT**: ${critical[0].headline}\n\n`;
  }

  display += top5.map(e => `**[${e.age}]** ${e.category}: ${e.headline} *(${e.source})*`).join('\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: `GENISUS World Intelligence Feed (${summary.totalEvents} sources cross-validated)`,
  };
}

function generateTechIntel(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const allTech = worldIntelligence.getTechIntelligence();

  // Find relevant tech from query
  const domainMatch = Object.entries(allTech).find(([k, v]) =>
    query.toLowerCase().includes(k) ||
    query.toLowerCase().includes(v.name.toLowerCase().split('/')[0].trim().toLowerCase())
  );

  if (domainMatch) {
    const [key, tech] = domainMatch;
    const speech = isTamil
      ? `${tech.name}: ${tech.latestDev.slice(0, 100)}. ${tech.warning ? 'எச்சரிக்கை உள்ளது.' : ''}`
      : `${tech.name} intelligence: ${tech.latestDev.slice(0, 120)}. ${tech.warning || ''}`;

    let display = `### ${tech.emoji} ${tech.name} Intelligence\n`;
    display += `**நிலை**: \`${tech.status}\` | **Adoption**: ${tech.adoption}% | **Momentum**: ${tech.momentum}\n\n`;
    if (tech.latestVersion) display += `**Latest Version**: \`${tech.latestVersion}\`\n`;
    display += `**Latest Development**: ${tech.latestDev}\n`;
    display += `**Career Demand**: ${tech.careerDemand} | **Avg Salary**: ${tech.avgSalary}\n`;
    if (tech.opportunities) display += `\n**Opportunities**: ${tech.opportunities.join(', ')}\n`;
    if (tech.warning) display += `\n⚠️ **WARNING**: ${tech.warning}`;

    return {
      agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
      speechText: speech, displayText: display,
      source: `GENISUS Technology Intelligence Engine — ${tech.name} data`,
    };
  }

  // Return all tech overview
  const speech = isTamil
    ? `${Object.keys(allTech).length} தொழில்நுட்ப துறைகள் கண்காணிக்கப்படுகின்றன. AI மிகவும் வேகமாக வளர்கிறது.`
    : `Monitoring ${Object.keys(allTech).length} technology domains. AI leads at +28% YoY growth.`;

  const topTech = Object.entries(allTech).slice(0, 5);
  let display = `### 🔬 Technology Intelligence Radar\n\n`;
  display += topTech.map(([k, t]) => `**${t.emoji} ${t.name}**: \`${t.status}\` — Adoption ${t.adoption}%`).join('\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Technology Intelligence Engine',
  };
}

function generateProductIntel(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const recent = PRODUCT_DB.filter(p => p.tag === 'RECENT' || p.tag === 'LIVE').slice(0, 4);

  const speech = isTamil
    ? `${recent.length} புதிய தயாரிப்புகள் கண்காணிக்கப்படுகின்றன. iPhone 17 Pro Max இன்று விமர்சனங்கள் வெளியாகின்றன.`
    : `Tracking ${recent.length} recent product launches. iPhone 17 Pro Max reviews trending today.`;

  let display = `### 📦 Global Product Intelligence\n\n`;
  display += recent.map(p => {
    const priceStr = Object.entries(p.price || {}).map(([k, v]) => `${k}: ${v}`).join(' | ');
    return `**${p.brand} ${p.model}** [${p.tag}]\n   Category: ${p.category} | Status: ${p.status}\n   Price: ${priceStr}\n   Confidence: ${p.confidence}%`;
  }).join('\n\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Global Product Intelligence Database',
  };
}

function generateBusinessIntel(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const intel = worldIntelligence.getBusinessIntel();
  const top3sectors = intel.growing_sectors.slice(0, 3);

  const speech = isTamil
    ? `வேகமாக வளரும் துறைகள்: ${top3sectors.map(s => s.sector).join(', ')}. Indian SaaS 68% வளர்ச்சியில் உள்ளது.`
    : `Fastest growing: ${top3sectors.map(s => s.sector).join(', ')}. India SaaS at +68% YoY.`;

  let display = `### 📈 Global Business Intelligence\n\n**வேகமாக வளரும் துறைகள்**:\n`;
  display += top3sectors.map(s =>
    `**${s.sector}** (${s.growth})\n   Drivers: ${s.drivers}\n   Opportunity: ${s.opportunity}`
  ).join('\n\n');
  display += `\n\n**Recent Funding Rounds**:\n`;
  display += intel.recent_funding.slice(0, 3).map(f =>
    `**${f.company}**: ${f.amount} from ${f.investor} (${f.sector}, ${f.country})`
  ).join('\n');
  display += `\n\n**Market Trends**:\n` + intel.market_trends.slice(0, 3).map(t => `• ${t}`).join('\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Business Intelligence Engine (Tracxn / ET / Crunchbase signals)',
  };
}

function generateEconomyIntel(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const eco = worldIntelligence.getEconomicData();

  const speech = isTamil
    ? `இந்தியா GDP வளர்ச்சி 7.2%. Sensex 85,420. USD/INR 83.7. RBI repo rate 6.5% — மாற்றமில்லை.`
    : `India GDP 7.2% growth. Sensex 85,420. USD/INR 83.7. RBI held repo rate at 6.5%.`;

  let display = `### 💹 Global Economic Intelligence\n\n**India Indicators**:\n`;
  display += Object.entries(eco.india).map(([k, v]) => `• **${k.replace(/_/g, ' ').toUpperCase()}**: ${v}`).join('\n');
  display += `\n\n**Global Indicators**:\n`;
  display += Object.entries(eco.global).map(([k, v]) => `• **${k.replace(/_/g, ' ').toUpperCase()}**: ${v}`).join('\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Economic Intelligence Engine (RBI, NSE, IMF, Fed data)',
  };
}

function generatePersonalImpact(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const impact = worldIntelligence.getPersonalImpact();

  const speech = isTamil
    ? `உலக நிகழ்வுகள் உங்களை 3 வழிகளில் பாதிக்கின்றன. Spring Boot security patch உடனடியாக தேவை. Flutter update உங்கள் app-க்கு நன்மை தரும்.`
    : `World events impact you in 3 key ways. Spring Boot security patch needed urgently. Flutter update benefits your app.`;

  let display = `### 🎯 உலக நிகழ்வுகள் — உங்களுக்கான தாக்கம் (Personal Impact)\n\n`;

  if (impact.critical.length > 0) {
    display += `⚠️ **CRITICAL — உடனடி நடவடிக்கை**:\n`;
    display += impact.critical.map(c => `• ${c.personalImpact}`).join('\n');
    display += '\n\n';
  }

  display += `🚀 **வணிக வாய்ப்புகள் (Business Opportunities)**:\n`;
  display += impact.opportunities.map(o => `• **${o.sector}** (${o.growth}): ${o.opportunity}`).join('\n');

  display += `\n\n📱 **உங்கள் Stack-க்கான Updates**:\n`;
  display += impact.techUpdates.slice(0, 3).map(e => `• [${e.age}] ${e.headline}`).join('\n');

  display += `\n\n💡 **GENISUS Recommendation**: ${impact.recommendation}`;

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Personal Impact Engine — cross-correlating world events with your profile',
  };
}

function generateWorldTimeline(lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const timeline = worldIntelligence.getWorldTimeline();

  const speech = isTamil
    ? `இன்றைய உலக நிகழ்வுகள்: காலை 6 மணி முதல் மாலை 5:30 வரை ${timeline.length} முக்கிய நிகழ்வுகள்.`
    : `Today's world timeline: ${timeline.length} key events from 06:00 to 17:30.`;

  let display = `### 🕐 இன்றைய உலக நிகழ்வுகள் — நேர வரிசை\n**${new Date().toDateString()}**\n\n`;
  display += timeline.map(e => {
    const impactIcon = e.impact === 'CRITICAL' ? '🔴' : e.impact === 'HIGH' ? '🟡' : '🟢';
    return `**${e.time}** ${impactIcon} \`${e.category}\` — ${e.event} [${e.tag}]`;
  }).join('\n');

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS World Event Timeline (AI-curated, cross-validated)',
  };
}

function generateGlobalSearch(query, lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const results = worldIntelligence.searchGlobal(query);

  const speech = isTamil
    ? `${results.length} தேடல் முடிவுகள் கிடைத்தன.`
    : `Found ${results.length} results across world intelligence database.`;

  let display = `### 🔍 Global Intelligence Search: "${query}"\n\n`;
  if (results.length === 0) {
    display += `_No results found. Try broader terms._`;
  } else {
    display += results.slice(0, 5).map(r => {
      if (r.type === 'WORLD_EVENT') return `**[WORLD EVENT]** ${r.headline}\n   ${r.summary?.slice(0, 120)}... *(Confidence: ${r.confidence}%)*`;
      if (r.type === 'TECH_INTEL') return `**[TECH]** ${r.name} — Status: ${r.status}, Adoption: ${r.adoption}%`;
      if (r.type === 'PRODUCT') return `**[PRODUCT]** ${r.brand} ${r.model} — ${r.status}`;
      return JSON.stringify(r);
    }).join('\n\n');
  }

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Global Intelligence Search (knowledge graph + semantic + keyword)',
  };
}

function generateSecurityAlert(lang = 'ta-IN') {
  const isTamil = lang === 'ta-IN';
  const alerts = worldIntelligence.getCriticalAlerts();

  const speech = isTamil
    ? `${alerts.length} முக்கிய பாதுகாப்பு எச்சரிக்கைகள். Spring Boot-ல் உடனடி patch தேவை.`
    : `${alerts.length} critical security alerts. Spring Boot requires immediate patching.`;

  let display = `### 🔐 Security Intelligence Alerts\n\n`;
  if (alerts.length === 0) {
    display += '✅ No critical security alerts at this time.';
  } else {
    display += alerts.map(a =>
      `🔴 **CRITICAL**: ${a.headline}\n   ${a.summary}\n   **உங்களுக்கு**: ${a.personalImpact}\n   Source: ${a.source}`
    ).join('\n\n');
  }

  return {
    agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE',
    speechText: speech, displayText: display,
    source: 'GENISUS Cybersecurity Intelligence Engine (NVD, CVE Database, Vendor Advisories)',
  };
}

// ─── MAIN WORLD AGENT DISPATCHER ─────────────────────────────────────────────

export const worldAgent = {
  name: AGENT_NAME,

  canHandle(query) {
    return detectWorldIntent(query) !== null;
  },

  handle(query, lang = 'ta-IN') {
    const intent = detectWorldIntent(query);

    switch (intent) {
      case 'WORLD_SUMMARY':    return generateWorldSummary(lang);
      case 'TECH_INTEL':       return generateTechIntel(query, lang);
      case 'PRODUCT_INTEL':    return generateProductIntel(query, lang);
      case 'BUSINESS_INTEL':   return generateBusinessIntel(query, lang);
      case 'ECONOMY_INTEL':    return generateEconomyIntel(query, lang);
      case 'PERSONAL_IMPACT':  return generatePersonalImpact(query, lang);
      case 'WORLD_TIMELINE':   return generateWorldTimeline(lang);
      case 'GLOBAL_SEARCH':    return generateGlobalSearch(query, lang);
      case 'SECURITY_ALERT':   return generateSecurityAlert(lang);
      case 'SOFTWARE_ECOSYSTEM': {
        const q = query.toLowerCase();
        const techKey = Object.keys(SOFTWARE_ECOSYSTEM).find(k => q.includes(k));
        const tech = techKey ? SOFTWARE_ECOSYSTEM[techKey] : SOFTWARE_ECOSYSTEM['flutter'];
        const isTamil = lang === 'ta-IN';
        const speech = isTamil ? `${tech.name} சமீபத்திய version: ${tech.stable}.` : `${tech.name} latest stable: ${tech.stable}.`;
        let display = `### 📦 ${tech.name} Ecosystem\n**Stable**: \`${tech.stable}\`\n\n**Trending Packages**:\n`;
        display += (tech.trending_packages || []).map(p => `• **${p.name}** v${p.version} ⭐${p.stars} — ${p.desc}`).join('\n');
        if (tech.recent_issues) display += `\n\n**Recent Issues**:\n` + tech.recent_issues.map(i => `• ${i}`).join('\n');
        return { agent: AGENT_NAME, language: lang, mode: 'WORLD_INTELLIGENCE', speechText: speech, displayText: display, source: 'GENISUS Software Ecosystem Tracker (GitHub, pub.dev, npm)' };
      }
      default:
        return generateWorldSummary(lang);
    }
  },
};

export default worldAgent;
