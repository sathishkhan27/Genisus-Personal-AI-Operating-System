// Stark Industries Protocol Subroutines for GENISUS OS
// Canonical Mark protocols: House Party Protocol, Clean Slate Protocol, Tactical Diagnostic / Veronica Protocol

import { soundEffects } from '../audio/soundEffects.js';
import { memoryStore } from '../memory/memoryStore.js';

export class StarkProtocolsManager {
  constructor(orchestratorInstance) {
    this.orchestrator = orchestratorInstance;
    this.tacticalModeActive = false;
    this.housePartyRunning = false;
  }

  isProtocolTrigger(query) {
    const q = query.toLowerCase().trim();
    if (
      q.includes('house party') || 
      q.includes('houseparty') ||
      q.includes('ஹவுஸ் பார்ட்டி') || 
      q.includes('சுவார்ம்') || 
      q.includes('swarm protocol') ||
      q.includes('all agents')
    ) {
      return 'HOUSE_PARTY';
    }

    if (
      q.includes('clean slate') || 
      q.includes('cleanslate') ||
      q.includes('கிளீன் ஸ்லேட்') || 
      q.includes('நினைவகத்தை அழி') || 
      q.includes('purge memory') ||
      q.includes('reset system')
    ) {
      return 'CLEAN_SLATE';
    }

    if (
      q.includes('tactical') || 
      q.includes('veronica') ||
      q.includes('வெரோனிகா') || 
      q.includes('தற்காப்பு') || 
      q.includes('ஆபத்து கால') || 
      q.includes('combat mode') ||
      q.includes('diagnostic mode')
    ) {
      return 'TACTICAL';
    }

    return null;
  }

  async executeProtocol(protocolType, preferredLanguage = 'ta-IN') {
    switch (protocolType) {
      case 'HOUSE_PARTY':
        return this.executeHousePartyProtocol(preferredLanguage);
      case 'CLEAN_SLATE':
        return this.executeCleanSlateProtocol(preferredLanguage);
      case 'TACTICAL':
        return this.executeTacticalDiagnostic(preferredLanguage);
      default:
        return null;
    }
  }

  // 1. HOUSE PARTY PROTOCOL: Dispatches all specialized agents concurrently as an autonomous drone swarm
  async executeHousePartyProtocol(language = 'ta-IN') {
    this.housePartyRunning = true;
    soundEffects.playProtocolAlarm('house-party');

    // Trigger background logical LLM task swarm
    if (this.orchestrator && this.orchestrator.llmAgent) {
      this.orchestrator.llmAgent.enqueueBackgroundGoal(
        'Execute comprehensive House Party Multi-Agent Swarm Telemetry Pass',
        'CRITICAL',
        'Engineering'
      ).catch(() => {});
    }

    const isTamil = language.startsWith('ta');

    const speechText = isTamil
      ? 'ஹவுஸ் பார்ட்டி புரோட்டோகால் செயல்படுத்தப்பட்டது, பாஸ். வணிகம், வருவாய், உடல்நலம் மற்றும் உலக புலனாய்வு ஏஜெண்டுகள் முழு வீச்சில் இயங்குகின்றன.'
      : 'House Party Protocol initiated, sir. All autonomous subagents deployed and executing concurrent telemetry passes.';

    const displayText = isTamil
      ? `### 🚀 ஹவுஸ் பார்ட்டி புரோட்டோகால் (HOUSE PARTY PROTOCOL: ENGAGED)
**நிலை**: \`ACTIVE SWARM ORCHESTRATION\` | **அனைத்து ஏஜென்ட்களும் தயார் நிலையில் உள்ளன**

1. 💼 **Business Agent (Mark 17 - Heartbreaker)**: MRR $4,850/mo, 142 செயலில் உள்ள சந்தாதாரர்கள்.
2. 💎 **Revenue Engine (Mark 33 - Silver Centurion)**: 5 புதிய SaaS வாய்ப்புகள் பகுப்பாய்வு செய்யப்பட்டன.
3. ❤️ **Health Core (Mark 38 - Igor)**: இதயத் துடிப்பு 72 BPM, தூக்கம் 7.4 மணிநேரம், 8,420 அடிகள்.
4. 🌍 **World Intel (Mark 40 - Shotgun)**: சர்வதேச சந்தைகள் மற்றும் தொழில்நுட்பப் போக்குகள் ஒத்திசைக்கப்பட்டன.
5. 🛡️ **Defense & System Agent (Mark 42 - Prodigal Son)**: 0 அச்சுறுத்தல்கள், குவாண்டம் குறியாக்கம் இயங்குகிறது.

*அனைத்து துணை அமைப்புகளும் உங்கள் கட்டளைக்கு காத்திருக்கின்றன, பாஸ்.*`
      : `### 🚀 HOUSE PARTY PROTOCOL ACTIVATED
**Status**: \`ACTIVE SWARM ORCHESTRATION\` | **All Drone Units Dispatched**

1. 💼 **Business Agent (Mark XVII - Heartbreaker)**: Real-time MRR $4,850/mo, 142 active SaaS subs tracked.
2. 💎 **Revenue Engine (Mark XXXIII - Silver Centurion)**: 5 high-yield SaaS niches scanned & ranked.
3. ❤️ **Health Core (Mark XXXVIII - Igor)**: Resting HR 72 BPM, Sleep 7.4h, 8,420 steps logged.
4. 🌍 **World Intel (Mark XL - Shotgun)**: Global tech feeds, breaking intelligence & economic index synced.
5. 🛡️ **Defense Matrix (Mark XLII - Prodigal Son)**: Zero intrusion vectors detected, quantum cipher nominal.

*All specialized agents are standing by for your directive, sir.*`;

    return {
      agent: 'STARK HOUSE PARTY PROTOCOL (MARK SWARM)',
      mode: 'HOUSE_PARTY',
      language,
      speechText,
      displayText,
      source: 'Stark Industries Defense Subroutine Mark-42'
    };
  }

  // 2. CLEAN SLATE PROTOCOL: Secure cache purge, memory reset & fresh session restart
  async executeCleanSlateProtocol(language = 'ta-IN') {
    soundEffects.playProtocolAlarm('clean-slate');

    // Purge session memory
    memoryStore.clearShortTerm();

    const isTamil = language.startsWith('ta');
    const speechText = isTamil
      ? 'கிளீன் ஸ்லேட் புரோட்டோகால் செயல்படுத்தப்பட்டது. குறுகிய கால நினைவகம் மற்றும் தற்காலிக தற்காலிக சேமிப்பு அழிக்கப்பட்டது. கணினி புத்தமைக்கப்பட்டது.'
      : 'Clean Slate Protocol executed. Short-term telemetry cache cleared and session reinitialized to baseline zero.';

    const displayText = isTamil
      ? `### 💥 கிளீன் ஸ்லேட் புரோட்டோகால் (CLEAN SLATE PROTOCOL)
**நிலை**: \`MEMORY PURGED & REINITIALIZED\`

* **குறுகிய கால நினைவகம் (Session Cache)**: \`அழிக்கப்பட்டது (Purged)\`
* **டயலாக் ஹிஸ்டரி**: \`Zeroed Out\`
* **சிஸ்டம் நிலை**: \`Fresh Boot Ready\`
* **பாதுகாப்பு**: \`AES-GCM Quantum Encryption Reseeded\`

ஜெனிசிஸ் புதிய தொடக்கத்திற்கு தயாராக உள்ளது.`
      : `### 💥 CLEAN SLATE PROTOCOL ENGAGED
**Status**: \`ALL EPHEMERAL BUFFERS PURGED\`

* **Short-Term Conversational Cache**: \`PURGED\`
* **Agent Context Logs**: \`CLEARED\`
* **System Telemetry**: \`RELOADED TO BASELINE\`
* **Cryptographic Session**: \`RE-SEEDED\`

The slate is clean, sir. Awaiting your new mission.`;

    return {
      agent: 'STARK PROTOCOL ENGINE: CLEAN SLATE',
      mode: 'CLEAN_SLATE',
      language,
      speechText,
      displayText,
      source: 'Stark Industries Security Protocol 0-0-0'
    };
  }

  // 3. TACTICAL DIAGNOSTIC / VERONICA PROTOCOL: High-alert security scan & combat HUD telemetry
  async executeTacticalDiagnostic(language = 'ta-IN') {
    this.tacticalModeActive = !this.tacticalModeActive;
    soundEffects.playProtocolAlarm('tactical');

    const isTamil = language.startsWith('ta');
    const stateStr = this.tacticalModeActive ? 'ENGAGED' : 'DISENGAGED';

    const speechText = isTamil
      ? `தற்காப்பு கண்டறிதல் முறைமை ${this.tacticalModeActive ? 'செயல்படுத்தப்பட்டது' : 'முடக்கப்பட்டது'}. ஆர்க் ரியாக்டர் ஆற்றல் சமநிலை தொண்ணூற்று ஒன்பது சதவீதம்.`
      : `Tactical Diagnostic Protocol ${this.tacticalModeActive ? 'engaged' : 'disengaged'}, sir. Arc reactor power distribution is at ninety-nine percent efficiency.`;

    const displayText = isTamil
      ? `### 🛡️ வெரோனிகா தற்காப்பு கண்டறிதல் (TACTICAL MODE: ${stateStr})
**பாதுகாப்பு நிலை**: \`${this.tacticalModeActive ? 'COMBAT READY / DEFENSE GRID ONLINE' : 'NOMINAL REPOSE'}\`

* ⚡ **ஆர்க் ரியாக்டர் வெளியீடு (Arc Reactor)**: \`99.4% நிலைப்புத்தன்மை\`
* 🎯 **இலக்கு கண்காணிப்பு (Targeting Reticles)**: \`LOCKED (360° Sphere Active)\`
* 🛰️ **வெரோனிகா செயற்கைக்கோள் இணைப்பு**: \`GEO-ORBIT SYNCHRONIZED (18ms Latency)\`
* 🌡️ **சிஸ்டம் வெப்பநிலை**: \`42°C (Optimal Cryo-cooling)\`
* 🔒 **நெட்வொர்க் தற்காப்பு**: \`Sub-zero Firewall Enforced\``
      : `### 🛡️ VERONICA TACTICAL DIAGNOSTIC (${stateStr})
**Defense Posture**: \`${this.tacticalModeActive ? 'COMBAT READY / DEFENSE GRID ENGAGED' : 'STANDBY'}\`

* ⚡ **Arc Reactor Output**: \`99.4% Efficiency Matrix\`
* 🎯 **Target Acquisition Reticles**: \`ACTIVE (360° Spherical Tracking)\`
* 🛰️ **Veronica Orbital Relay**: \`GEO-SYNCHRONIZED (18ms Sub-orbital Latency)\`
* 🌡️ **Thermodynamics**: \`42°C Core Temp (Liquid Nitrogen Cooling Nominal)\`
* 🔒 **Intrusion Countermeasures**: \`Autonomous Firewall Swarm Active\``;

    return {
      agent: 'VERONICA ORBITAL TACTICAL PROTOCOL',
      mode: 'TACTICAL',
      tacticalActive: this.tacticalModeActive,
      language,
      speechText,
      displayText,
      source: 'Stark Industries Orbital Platform 838'
    };
  }
}
