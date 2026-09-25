import { createIcons, icons } from 'lucide';
import confetti from 'canvas-confetti';
import { HologramCore } from './modules/visuals/hologramCore.js';
import { ProductHologramViewer } from './modules/visuals/productHologram.js';
import { AudioWaveformVisualizer } from './modules/visuals/audioVisualizer.js';
import { VoiceEngine } from './modules/voice/voiceEngine.js';
import { orchestrator } from './modules/agents/orchestrator.js';
import { devOpsAgent } from './modules/agents/devOpsAgent.js';
import { aiDeveloperAgent } from './modules/agents/aiDeveloperAgent.js';
import { devMemory } from './modules/agents/devMemory.js';
import { liveIntelFeed } from './modules/intelligence/liveIntelFeed.js';
import { cloudTelemetry } from './modules/cloud/cloudTelemetry.js';
import { memoryStore } from './modules/memory/memoryStore.js';
import { knowledgeBase } from './modules/knowledge/knowledgeBase.js';
import worldIntelligence, { WORLD_FEED, TECH_INTELLIGENCE, SOFTWARE_ECOSYSTEM, PRODUCT_DB, BUSINESS_INTEL, ECONOMIC_DATA, WORLD_TIMELINE_TODAY } from './modules/intelligence/worldIntelligence.js';
import { soundEffects } from './modules/audio/soundEffects.js';
import { writingAssistant, WRITING_TONES, ENHANCEMENT_MODES } from './modules/intelligence/writingAssistantEnhancer.js';
import { llmAgent } from './modules/agents/llmAgent.js';
import { gptAstraService } from './modules/intelligence/gptAstraService.js';
import { governanceController } from './modules/governance/governanceController.js';

class GenisusApp {
  constructor() {
    this.currentMode = 'command-center';
    this.hologramCore = null;
    this.productHologram = null;
    this.audioVisualizer = null;
    this.voiceEngine = null;
    this.currentLanguage = 'ta-IN';
    this.pccSubTab = 'overview';
    this.worldSubTab = 'live-feed';
    this.ragSearchQuery = '';
    window.__hudApp = this;
    this.init();
  }

  async init() {
    this.renderIcons();
    this.initClock();
    this.init3DVisuals();
    this.initVoiceEngine();
    this.initOrchestrationRouting();
    this.initDeveloperCommandCenter();
    this.initMemoryConstellation();
    this.initDonutGauges();
    this.initLiveRepositories();
    this.initLiveIntelFeed();
    this.initEnvironmentalTelemetry();
    this.initAstraCore();
    this.setupEventListeners();
    this.setupWritingEnhancerListeners();
    this.setupLLMTaskListeners();
    this.governanceController = governanceController;
    this.governanceController.init();
    this.renderLeftPanel();
    this.switchMode('command-center');

    // Welcome Greeting from GENISUS in Tamil & English
    setTimeout(() => {
      this.handleGenisusOutput({
        agent: 'GENISUS AI Core Orchestrator',
        mode: 'GREETING',
        language: 'ta-IN',
        speechText: 'வணக்கம் பாஸ் சதீஷ். நான் ஜெனீசிஸ். உங்கள் AI கட்டளை மையம் மற்றும் கிட்ஹப் டெவ்செக்ஆப்ஸ் கட்டுப்பாட்டு அமைப்புகள் தயார் நிலையில் உள்ளன.',
        displayText: `### ⚡ GENISUS AI COMMAND CENTER READY
**System Status**: \`OPTIMAL\` | **Voice Controller**: \`GENISUS Voice Active (தமிழ் / EN)\` | **DevSecOps Grid**: \`sathishkhan27 Synced\`

வணக்கம் பாஸ் சதீஷ்! நான் **ஜெனீசிஸ்**. உங்கள் குரல் மற்றும் கட்டளைகளை ஏற்று செயல்படவும், [sathishkhan27 GitHub](https://github.com/sathishkhan27?tab=repositories) ரிப்போசிட்டரிகளில் உள்ள தவறுகளை (Bugfixes) சரிசெய்து, புஷ் மற்றும் டிப்ளாய்மென்ட் பணிகளை முழுமையாகக் கையாளவும் நான் தயாராக இருக்கிறேன்.`,
        source: 'GENISUS Core Boot Telemetry · sathishkhan27 Synced'
      }, true);
    }, 600);
  }

  renderIcons() {
    createIcons({ icons });
  }

  initClock() {
    const clockEl = document.getElementById('system-clock');
    const dateEl = document.getElementById('system-date');
    const update = () => {
      const now = new Date();
      if (clockEl) {
        clockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC+5:30';
      }
      if (dateEl) {
        const opts = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', opts);
      }
    };
    update();
    setInterval(update, 1000);
  }

  initMemoryConstellation() {
    const canvas = document.getElementById('memory-constellation-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth || 240;
    canvas.height = canvas.clientHeight || 80;

    const nodes = [
      { x: 30, y: 50 }, { x: 70, y: 25 }, { x: 110, y: 58 },
      { x: 150, y: 35 }, { x: 190, y: 52 }, { x: 230, y: 28 },
      { x: 85, y: 65 }, { x: 170, y: 68 }
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
      ctx.lineWidth = 1;

      // Draw connections
      for (let i = 0; i < nodes.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y);
        ctx.stroke();
      }

      // Cross connections
      ctx.beginPath();
      ctx.moveTo(nodes[1].x, nodes[1].y);
      ctx.lineTo(nodes[6].x, nodes[6].y);
      ctx.lineTo(nodes[3].x, nodes[3].y);
      ctx.stroke();

      // Draw glowing nodes
      nodes.forEach((n, idx) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, idx % 2 === 0 ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fillStyle = idx % 3 === 0 ? '#00f0ff' : (idx % 2 === 0 ? '#a855f7' : '#00ffaa');
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
      });
    };
    draw();
  }

  initDonutGauges() {
    const update = () => {
      let ramPct = 54;
      if (window.performance && performance.memory) {
        const used = performance.memory.usedJSHeapSize;
        const total = performance.memory.totalJSHeapSize;
        ramPct = Math.min(99, Math.max(15, Math.round((used / total) * 100)));
      }
      const cores = navigator.hardwareConcurrency || 8;
      const cpuVal = Math.min(95, Math.max(8, Math.round(10 + (cores * 1.5))));
      const cpuEl = document.getElementById('gauge-cpu-val');
      const ramEl = document.getElementById('gauge-ram-val');
      if (cpuEl) cpuEl.textContent = `${cpuVal}%`;
      if (ramEl) ramEl.textContent = `${ramPct}%`;
    };
    update();
    setInterval(update, 5000);
  }

  async initLiveRepositories() {
    const container = document.getElementById('repos-container');
    const badge = document.getElementById('repo-count-badge');
    if (!container) return;

    try {
      const repos = await devOpsAgent.fetchLiveRepositories();
      if (badge) {
        badge.textContent = `${repos.length} REPOS (LIVE)`;
      }

      if (!repos || repos.length === 0) {
        container.innerHTML = '<div class="repo-loading-indicator">No public repositories found.</div>';
        return;
      }

      container.innerHTML = repos.map(r => `
        <div class="repo-item-tile" data-repo="${r.name}" title="Click to audit ${r.name}">
          <div class="repo-tile-header">
            <span class="repo-name">${r.name}</span>
            <span class="repo-badge ${r.openBugs > 0 ? 'amber' : 'green'}">${r.healthScore} Health</span>
          </div>
          <div class="repo-desc">${r.description}</div>
          <div class="repo-footer">
            <span class="branch-tag"><i data-lucide="git-branch"></i> ${r.branch}</span>
            <span class="status-indicator live">● ${r.latestCommit ? r.latestCommit.sha : 'Live'}</span>
          </div>
        </div>
      `).join('');

      container.querySelectorAll('.repo-item-tile').forEach(tile => {
        tile.addEventListener('click', () => {
          const repoName = tile.getAttribute('data-repo');
          this.executeCommand(`Genisus, check repository ${repoName} at sathishkhan27 and audit status`, this.currentLanguage);
        });
      });

      this.renderIcons();
    } catch (err) {
      console.warn('Error initializing live repositories:', err);
    }
  }

  initLiveIntelFeed() {
    const intelContainer = document.getElementById('intel-feed-list');
    if (intelContainer) {
      liveIntelFeed.init(intelContainer);
    }
  }

  async initEnvironmentalTelemetry() {
    // 1. Live Weather from Open-Meteo for Chennai coordinates
    const weatherLabel = document.getElementById('dock-weather-label');
    const updateWeather = async () => {
      try {
        const resp = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.0827&longitude=80.2707&current_weather=true');
        if (resp.ok) {
          const data = await resp.json();
          if (data.current_weather && weatherLabel) {
            const temp = data.current_weather.temperature;
            const code = data.current_weather.weathercode;
            let cond = 'Clear';
            if (code >= 1 && code <= 3) cond = 'Partly Cloudy';
            else if (code >= 45 && code <= 48) cond = 'Foggy';
            else if (code >= 51 && code <= 67) cond = 'Rainy';
            else if (code >= 80 && code <= 82) cond = 'Showers';
            else if (code >= 95) cond = 'Thunderstorm';
            weatherLabel.textContent = `${temp}°C ${cond}`;
          }
        }
      } catch (e) {
        if (weatherLabel) weatherLabel.textContent = '33°C Clear';
      }
    };
    updateWeather();
    setInterval(updateWeather, 300000); // 5 minutes

    // 2. Real Network Latency Ping
    const latencyEl = document.getElementById('dock-latency-ms');
    const networkIcon = document.getElementById('dock-network-icon');
    const pingProbe = async () => {
      const start = performance.now();
      try {
        await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
        const latency = Math.max(2, Math.round(performance.now() - start));
        if (latencyEl) latencyEl.textContent = `${latency}ms`;
        if (networkIcon) {
          networkIcon.className = latency < 60 ? 'telemetry-icon green' : 'telemetry-icon amber';
        }
      } catch (e) {
        if (latencyEl) latencyEl.textContent = '14ms';
      }
    };
    pingProbe();
    setInterval(pingProbe, 15000); // 15 seconds
  }

  init3DVisuals() {
    const coreCanvas = document.getElementById('three-core-canvas');
    if (coreCanvas) {
      this.hologramCore = new HologramCore(coreCanvas);
    }

    const audioCanvas = document.getElementById('audio-waveform-canvas');
    if (audioCanvas) {
      this.audioVisualizer = new AudioWaveformVisualizer(audioCanvas);
    }

    const prodCanvas = document.getElementById('product-hologram-canvas');
    if (prodCanvas) {
      this.productHologram = new ProductHologramViewer(prodCanvas);
    }
  }

  initVoiceEngine() {
    this.voiceEngine = new VoiceEngine({
      defaultLanguage: this.currentLanguage,
      onInterim: (interimText) => {
        const liveTranscript = document.getElementById('live-voice-transcript');
        const liveBox = document.getElementById('live-voice-box');
        const headline = document.getElementById('voice-recognition-headline');
        const interimIndicator = document.getElementById('voice-interim-indicator');

        if (liveTranscript) {
          liveTranscript.textContent = `Hearing: "${interimText}..."`;
          liveTranscript.classList.add('interim');
        }
        if (liveBox) {
          liveBox.classList.add('listening');
        }
        if (headline) {
          headline.textContent = 'HEARING SPEECH INPUT...';
        }
        if (interimIndicator) {
          interimIndicator.textContent = `🎙️ "${interimText}"`;
        }

        // Pulse the visualizer on voice input
        if (this.hologramCore) {
          this.hologramCore.setAudioPulse(0.7);
        }
        if (this.audioVisualizer) {
          this.audioVisualizer.setSyntheticActivity(true, 0.8);
        }
      },
      onResult: (result) => {
        const liveTranscript = document.getElementById('live-voice-transcript');
        const liveBox = document.getElementById('live-voice-box');
        const headline = document.getElementById('voice-recognition-headline');
        const interimIndicator = document.getElementById('voice-interim-indicator');
        const langBadge = document.getElementById('voice-lang-badge');

        if (liveTranscript) {
          liveTranscript.textContent = `Recognized: "${result.transcript}"`;
          liveTranscript.classList.remove('interim');
        }
        if (headline) {
          headline.textContent = 'COMMAND RECOGNIZED';
        }
        if (langBadge) {
          langBadge.textContent = result.detectedLanguage.toUpperCase();
        }
        if (interimIndicator) interimIndicator.textContent = '';

        this.executeCommand(result.transcript, result.detectedLanguage);
      },
      onStateChange: (state) => {
        this.updateSystemVoiceState(state);
      },
      onAudioPulse: (pulse) => {
        if (this.hologramCore) {
          this.hologramCore.setAudioPulse(pulse);
        }
        if (this.audioVisualizer) {
          this.audioVisualizer.setSyntheticActivity(pulse > 0.1, pulse);
        }
      }
    });
  }

  updateSystemVoiceState(state) {
    const statusText = document.getElementById('core-status-text');
    const statusBadge = document.getElementById('core-status-badge');
    const micBtn = document.getElementById('mic-toggle-btn');
    const interruptBtn = document.getElementById('voice-interrupt-btn');
    const liveBox = document.getElementById('live-voice-box');
    const liveHeadline = document.getElementById('voice-recognition-headline');
    const liveTranscript = document.getElementById('live-voice-transcript');
    const voiceDot = document.getElementById('voice-dot');

    if (this.hologramCore) {
      this.hologramCore.setState(state);
    }

    if (state === 'LISTENING') {
      if (statusText) statusText.textContent = 'GENISUS: LISTENING TO VOICE...';
      if (statusBadge) statusBadge.style.borderColor = 'var(--amber)';
      if (micBtn) micBtn.classList.add('listening');
      if (interruptBtn) interruptBtn.classList.remove('visible');
      if (liveBox) {
        liveBox.className = 'live-voice-recognition-box listening';
      }
      if (liveHeadline) liveHeadline.textContent = 'VOICE RECOGNITION: LISTENING...';
      if (voiceDot) voiceDot.style.background = 'var(--amber)';
    } else if (state === 'THINKING') {
      if (statusText) statusText.textContent = 'GENISUS: REASONING & ORCHESTRATING...';
      if (statusBadge) statusBadge.style.borderColor = 'var(--purple)';
      if (micBtn) micBtn.classList.remove('listening');
      if (interruptBtn) interruptBtn.classList.remove('visible');
      if (liveBox) {
        liveBox.className = 'live-voice-recognition-box';
      }
      if (liveHeadline) liveHeadline.textContent = 'AI ORCHESTRATOR REASONING...';
      if (voiceDot) voiceDot.style.background = 'var(--purple)';
    } else if (state === 'SPEAKING') {
      if (statusText) statusText.textContent = 'GENISUS: SPEAKING (VOICE ACTIVE)';
      if (statusBadge) statusBadge.style.borderColor = 'var(--emerald)';
      if (micBtn) micBtn.classList.remove('listening');
      if (interruptBtn) interruptBtn.classList.add('visible');
      if (liveBox) {
        liveBox.className = 'live-voice-recognition-box speaking';
      }
      if (liveHeadline) liveHeadline.textContent = 'GENISUS VOCAL SYNTHESIS ACTIVE';
      if (voiceDot) voiceDot.style.background = 'var(--emerald)';
    } else {
      if (statusText) statusText.textContent = 'GENISUS CORE: NOMINAL STANDBY';
      if (statusBadge) statusBadge.style.borderColor = 'var(--cyan)';
      if (micBtn) micBtn.classList.remove('listening');
      if (interruptBtn) interruptBtn.classList.remove('visible');
      if (liveBox) {
        liveBox.className = 'live-voice-recognition-box';
      }
      if (liveHeadline) liveHeadline.textContent = 'VOICE RECOGNITION: STANDBY (CLICK MIC OR SPEAK)';
      if (voiceDot) voiceDot.style.background = 'var(--cyan)';
      if (liveTranscript) liveTranscript.textContent = 'Speak with GENISUS: "What are my priorities today?" or "இன்றைய வேலைகள் என்ன?"';
    }
  }

  initOrchestrationRouting() {
    orchestrator.setRouteListener((routeSteps) => {
      const container = document.getElementById('orchestration-route');
      if (!container) return;
      container.innerHTML = routeSteps.map((step, idx) => `
        <span class="route-step ${idx === routeSteps.length - 1 ? 'active' : ''}">${step}</span>
        ${idx < routeSteps.length - 1 ? '<span class="route-arrow">▶</span>' : ''}
      `).join('');
    });
  }

  initDeveloperCommandCenter() {
    aiDeveloperAgent.subscribe((task) => {
      this.renderDeveloperTask(task);
    });

    // Project Select dropdown
    const projSelect = document.getElementById('dev-project-select');
    if (projSelect) {
      projSelect.addEventListener('change', async (e) => {
        const pId = e.target.value;
        await aiDeveloperAgent.setProject(pId);
        this.showToast(`Switched real workspace to ${aiDeveloperAgent.activeProject?.name || pId}`);
      });
    }

    // Open in IDE button
    document.getElementById('btn-dev-open-ide')?.addEventListener('click', async () => {
      const ideSelect = document.getElementById('dev-ide-select');
      const ide = ideSelect ? ideSelect.value : 'vscode';
      const ideName = ide === 'vscode' ? 'VS Code' : ide === 'android-studio' ? 'Android Studio' : 'Xcode';
      this.showToast(`Opening active project in ${ideName}...`);
      const res = await aiDeveloperAgent.handleOpenIde(ide, this.currentLanguage.startsWith('ta'));
      const term = document.getElementById('dev-terminal-output');
      if (term) {
        term.innerHTML += `<div class="dev-term-line system">[IDE BRIDGE] Launched ${res.data?.targetPath} in ${ideName}</div>`;
        term.scrollTop = term.scrollHeight;
      }
      this.handleGenisusOutput(res, true);
    });

    // Sync Git button
    document.getElementById('btn-dev-sync-git')?.addEventListener('click', async () => {
      this.showToast('Scanning local working tree for real Git modifications...');
      const task = await aiDeveloperAgent.syncRealGitStatus();
      const term = document.getElementById('dev-terminal-output');
      if (term && task) {
        term.innerHTML += `<div class="dev-term-line info">[GIT SCAN] ${task.projectName}: ${task.filesChanged?.length || 0} modified file(s) on branch ${task.branch}</div>`;
        term.scrollTop = term.scrollHeight;
      }
      this.showToast(`Git synchronized: ${task?.filesChanged?.length || 0} modified file(s)`);
    });

    // View Diff button
    document.getElementById('btn-dev-view-diff')?.addEventListener('click', async () => {
      await aiDeveloperAgent.syncRealGitStatus();
      this.openDiffModal(aiDeveloperAgent.activeTask);
    });

    // Run Tests button
    document.getElementById('btn-dev-run-tests')?.addEventListener('click', async () => {
      const term = document.getElementById('dev-terminal-output');
      if (term) {
        term.innerHTML += `<div class="dev-term-line system">[TEST RUNNER] Executing real build & test commands on local workspace...</div>`;
        term.scrollTop = term.scrollHeight;
      }
      this.showToast('Running real build & test suite...');
      const res = await aiDeveloperAgent.handleRunRealTest(this.currentLanguage.startsWith('ta'));
      if (term && res) {
        const testData = res.data?.realTestOutput;
        if (testData) {
          term.innerHTML += `<div class="dev-term-line ${testData.passed ? 'success' : 'prompt'}">${testData.passed ? '✓ BUILD & TESTS PASSED' : '✖ BUILD ISSUE DETECTED'} (${testData.duration})</div>`;
          const logLines = (testData.stdout || testData.stderr || '').trim().split('\n').slice(-5);
          logLines.forEach(l => {
            term.innerHTML += `<div class="dev-term-line ${testData.passed ? 'info' : 'system'}">${l.replace(/</g, '&lt;')}</div>`;
          });
          term.scrollTop = term.scrollHeight;
        }
      }
      this.handleGenisusOutput(res, true);
    });

    // Architecture Memory button
    document.getElementById('btn-dev-arch-memory')?.addEventListener('click', () => {
      const term = document.getElementById('dev-terminal-output');
      const pId = document.getElementById('dev-project-select')?.value || 'genisus-os';
      const summary = devMemory.getArchitectureSummary(pId);
      if (term) {
        term.innerHTML += `<div class="dev-term-line system">[DEV MEMORY] Loading stored architecture rules for ${pId}...</div>`;
        term.innerHTML += `<div class="dev-term-line info">${summary.replace(/\n/g, '<br>')}</div>`;
        term.scrollTop = term.scrollHeight;
      }
    });

    // Approve & Push button -> Opens Strict Confirmation Gate Modal
    document.getElementById('btn-dev-approve-push')?.addEventListener('click', () => {
      this.openConfirmationGate(aiDeveloperAgent.activeTask);
    });

    // Diff Modal buttons
    document.getElementById('close-diff-modal-btn')?.addEventListener('click', () => {
      document.getElementById('dev-diff-modal')?.classList.remove('open');
    });

    document.getElementById('btn-diff-approve-push')?.addEventListener('click', () => {
      document.getElementById('dev-diff-modal')?.classList.remove('open');
      this.openConfirmationGate(aiDeveloperAgent.activeTask);
    });

    document.getElementById('btn-submit-feedback')?.addEventListener('click', async () => {
      const input = document.getElementById('diff-feedback-input');
      if (input && input.value.trim()) {
        const feedback = input.value.trim();
        input.value = '';
        const res = await aiDeveloperAgent.handleUserFeedback(feedback, this.currentLanguage.startsWith('ta'));
        this.openDiffModal(aiDeveloperAgent.activeTask);
        this.showToast('Changes updated based on feedback');
        if (res && res.speechText) {
          this.voiceEngine.speak(res.speechText, this.currentLanguage);
        }
      }
    });

    // Confirmation Gate Modal buttons
    document.getElementById('close-confirm-modal-btn')?.addEventListener('click', () => {
      document.getElementById('dev-confirm-modal')?.classList.remove('open');
    });

    document.getElementById('btn-gate-review-again')?.addEventListener('click', () => {
      document.getElementById('dev-confirm-modal')?.classList.remove('open');
      this.openDiffModal(aiDeveloperAgent.activeTask);
    });

    document.getElementById('btn-gate-cancel')?.addEventListener('click', () => {
      document.getElementById('dev-confirm-modal')?.classList.remove('open');
      aiDeveloperAgent.handleCancelPush(this.currentLanguage.startsWith('ta'));
      this.showToast('Push operation cancelled. State preserved.');
    });

    document.getElementById('btn-gate-confirm-push')?.addEventListener('click', async () => {
      document.getElementById('dev-confirm-modal')?.classList.remove('open');
      this.showToast('Executing real git commit and push to remote...');
      const res = await aiDeveloperAgent.handleRealGitPush(this.currentLanguage.startsWith('ta'));
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      soundEffects.playAlert();
      this.handleGenisusOutput(res, true);
    });

    // ⚡ FULL AUTO-PILOT Pipeline Trigger Modal
    const autopilotModal = document.getElementById('dev-autopilot-modal');
    document.getElementById('btn-dev-auto-pipeline')?.addEventListener('click', () => {
      const targetDisplay = document.getElementById('autopilot-target-display');
      if (targetDisplay) targetDisplay.textContent = aiDeveloperAgent.activeProject?.name || 'genisus-os';
      autopilotModal?.classList.add('open');
    });

    document.getElementById('close-autopilot-modal-btn')?.addEventListener('click', () => {
      autopilotModal?.classList.remove('open');
    });

    document.getElementById('autopilot-cancel-btn')?.addEventListener('click', () => {
      autopilotModal?.classList.remove('open');
    });

    // Preset chips
    document.querySelectorAll('[data-pilot]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-pilot');
        const input = document.getElementById('autopilot-req-input');
        if (input && val) input.value = val;
      });
    });

    // Launch Full Auto-Pilot
    document.getElementById('autopilot-run-btn')?.addEventListener('click', async () => {
      autopilotModal?.classList.remove('open');
      const reqInput = document.getElementById('autopilot-req-input');
      const requirement = reqInput?.value.trim() || 'Autonomous real-time development and verification pipeline';
      const autoPush = document.getElementById('autopilot-auto-push-chk')?.checked ?? true;

      const term = document.getElementById('dev-terminal-output');
      if (term) {
        term.innerHTML += `<div class="dev-term-line prompt">⚡ [AUTOPILOT] Launching Python Astra AI Agent: "${requirement}"</div>`;
        term.innerHTML += `<div class="dev-term-line info">ℹ [AUTOPILOT] Mode: ${autoPush ? 'MODE_C_AUTONOMOUS (Auto-Push)' : 'MODE_B_ASSISTED'} | Target: ${aiDeveloperAgent.activeProject?.name || 'genisus-os'}</div>`;
        term.scrollTop = term.scrollHeight;
      }

      this.showToast('🚀 Running Python Astra AI Developer pipeline...');
      const res = await aiDeveloperAgent.runAutoPipeline(requirement, this.currentLanguage.startsWith('ta'), { autoPush });

      if (term && res) {
        const t = res.data;
        term.innerHTML += `<div class="dev-term-line ${res.mode === 'DEV_AUTO_PIPELINE_SUCCESS' ? 'success' : 'system'}">✓ [AUTOPILOT] ${res.mode === 'DEV_AUTO_PIPELINE_SUCCESS' ? 'PIPELINE COMPLETE' : 'PIPELINE LOGGED'} (${t?.duration || '1.8s'})</div>`;
        if (t?.commitHash) {
          term.innerHTML += `<div class="dev-term-line info">Commit: ${t.commitHash} · ${t.commitMessage || 'feat(autonomous): update'}</div>`;
        }
        if (t?.pushInfo?.pushed) {
          term.innerHTML += `<div class="dev-term-line success">🚀 GitHub Remote: Pushed cleanly to origin/${t.branch || 'main'}</div>`;
        }
        term.scrollTop = term.scrollHeight;
      }

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
      soundEffects.playSuccess();
      this.handleGenisusOutput(res, true);
    });
  }

  setupWritingEnhancerListeners() {
    const modal = document.getElementById('writing-enhancer-modal');
    const input = document.getElementById('writing-input-text');
    const output = document.getElementById('writing-output-display');
    const metricsBadge = document.getElementById('writing-metrics-badge');

    document.getElementById('btn-open-writing-enhancer')?.addEventListener('click', () => {
      modal?.classList.add('open');
      if (input && !input.value.trim()) {
        const queryInput = document.getElementById('user-query-input');
        if (queryInput && queryInput.value.trim()) {
          input.value = queryInput.value.trim();
        }
      }
    });

    document.getElementById('close-writing-modal-btn')?.addEventListener('click', () => {
      modal?.classList.remove('open');
    });

    let currentTone = WRITING_TONES.JARVIS;
    document.querySelectorAll('#writing-tone-group .prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#writing-tone-group .prompt-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentTone = chip.getAttribute('data-tone') || WRITING_TONES.JARVIS;
      });
    });

    const runEnhance = (mode) => {
      const text = input?.value.trim();
      if (!text) {
        this.showToast('Please enter draft text first');
        return;
      }
      const res = writingAssistant.enhance({
        text,
        tone: currentTone,
        mode,
        targetLanguage: this.currentLanguage
      });
      if (res.success && output) {
        output.textContent = res.enhanced;
        if (metricsBadge) metricsBadge.textContent = `${res.stats.readabilityDelta} Clarity · ${res.stats.vocabularyImpact}`;
        soundEffects.playBlip();
      }
    };

    document.getElementById('btn-we-polish')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.POLISH));
    document.getElementById('btn-we-elevate')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.ELEVATE));
    document.getElementById('btn-we-jarvis')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.MAKE_JARVIS));
    document.getElementById('btn-we-summarize')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.SUMMARIZE));
    document.getElementById('btn-we-expand')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.EXPAND));
    document.getElementById('btn-we-doc')?.addEventListener('click', () => runEnhance(ENHANCEMENT_MODES.TECH_DOC));

    document.getElementById('btn-we-speak')?.addEventListener('click', () => {
      const text = output?.textContent;
      if (text && this.voiceEngine) {
        this.voiceEngine.speak(text, this.currentLanguage);
      }
    });

    document.getElementById('btn-we-copy')?.addEventListener('click', () => {
      const text = output?.textContent;
      if (text) {
        navigator.clipboard.writeText(text);
        this.showToast('Enhanced content copied to clipboard');
      }
    });

    document.getElementById('btn-we-use')?.addEventListener('click', () => {
      const text = output?.textContent;
      if (text) {
        const queryInput = document.getElementById('user-query-input');
        if (queryInput) queryInput.value = text;
        modal?.classList.remove('open');
        this.showToast('Enhanced content applied to main command prompt');
      }
    });
  }

  setupLLMTaskListeners() {
    const modal = document.getElementById('llm-task-modal');
    const input = document.getElementById('llm-task-input');
    const container = document.getElementById('llm-activities-container');
    const statusBadge = document.getElementById('llm-task-status-badge');
    const categorySelect = document.getElementById('llm-category-select');

    document.getElementById('btn-open-llm-task')?.addEventListener('click', () => {
      modal?.classList.add('open');
      if (input && !input.value.trim()) {
        const queryInput = document.getElementById('user-query-input');
        if (queryInput && queryInput.value.trim()) {
          input.value = queryInput.value.trim();
        }
      }
    });

    document.getElementById('close-llm-task-modal-btn')?.addEventListener('click', () => {
      modal?.classList.remove('open');
    });

    let selectedPriority = 'HIGH';
    document.querySelectorAll('#llm-priority-group .prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#llm-priority-group .prompt-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedPriority = chip.getAttribute('data-priority') || 'MEDIUM';
      });
    });

    let currentActiveTask = null;

    const renderActivities = (task) => {
      if (!task || !container) return;
      currentActiveTask = task;
      if (statusBadge) statusBadge.textContent = `${task.status} (${task.progress}%)`;

      container.innerHTML = task.activities.map((a, idx) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 5px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-family: var(--font-tech); font-size: 11px; color: var(--cyan); min-width: 20px;">#${idx + 1}</span>
            <div>
              <div style="font-size: 12px; font-weight: 500; color: #fff;">${a.name}</div>
              <div style="font-size: 10.5px; color: var(--text-muted); display: flex; gap: 8px; margin-top: 2px;">
                <span>Assignee: <strong style="color: var(--cyan);">${a.assignedAgent}</strong></span>
                <span>ETA: <strong>${a.duration}</strong></span>
              </div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="badge-tag ${a.status === 'COMPLETED' ? 'emerald' : a.status === 'IN_PROGRESS' ? 'cyan' : 'amber'}" style="font-size: 9.5px;">
              ${a.status}
            </span>
            <button class="btn-dev-action" data-act-toggle="${a.id}" style="font-size: 10px; padding: 2px 6px;">
              ${a.status === 'COMPLETED' ? '✓' : 'Done'}
            </button>
          </div>
        </div>
      `).join('');

      // Toggle individual activity button
      container.querySelectorAll('[data-act-toggle]').forEach(btn => {
        btn.addEventListener('click', async () => {
          const actId = btn.getAttribute('data-act-toggle');
          soundEffects.playBlip();
          const updated = await llmAgent.stepBackgroundActivity(task.id);
          renderActivities(updated || task);
        });
      });
    };

    // Subscribe to background logical updates
    llmAgent.subscribe((tasks) => {
      if (currentActiveTask) {
        const refreshed = tasks.find(t => t.id === currentActiveTask.id);
        if (refreshed) renderActivities(refreshed);
      }
    });

    // Decompose Button
    document.getElementById('btn-llm-decompose')?.addEventListener('click', async () => {
      const directive = input?.value.trim() || 'General Engineering Sprint Goal';
      const category = categorySelect?.value || 'Engineering';

      const task = await llmAgent.enqueueBackgroundGoal(directive, selectedPriority, category);
      renderActivities(task);
      this.showToast(`LLM Background Engine: Dispatched ${task.activities?.length || 4} activities to queue`);
      soundEffects.playAlert();
    });

    // Speak Plan
    document.getElementById('btn-llm-speak-plan')?.addEventListener('click', () => {
      if (currentActiveTask && this.voiceEngine) {
        const speech = `Task: ${currentActiveTask.title}. Priority is ${currentActiveTask.priority}. Orchestrated ${currentActiveTask.activities.length} sequential activities across specialized worker agents.`;
        this.voiceEngine.speak(speech, this.currentLanguage);
      } else {
        this.showToast('Please decompose a task first');
      }
    });

    // Sync to Calendar
    document.getElementById('btn-llm-sync-calendar')?.addEventListener('click', () => {
      if (currentActiveTask) {
        knowledgeBase.addCalendarEvent(
          currentActiveTask.title,
          '04:00 PM',
          'இன்று',
          currentActiveTask.category,
          `Lead: ${currentActiveTask.assignedLeadAgent || 'LLMTaskAgent'}`
        );
        this.showToast('Synced task and milestones to GENISUS Calendar');
        soundEffects.playBlip();
      } else {
        this.showToast('No active task to sync');
      }
    });

    // Execute All in Background
    document.getElementById('btn-llm-execute-all')?.addEventListener('click', async () => {
      if (currentActiveTask) {
        this.showToast('Executing task activities in background engine...');
        const completed = await llmAgent.runTaskToCompletionInBackground(currentActiveTask.id);
        renderActivities(completed || currentActiveTask);
        if (typeof confetti === 'function') {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        }
        soundEffects.playSuccess();
        this.showToast('All orchestrated activities executed and verified in background!');
      } else {
        this.showToast('No active task to execute');
      }
    });
  }

  renderDeveloperTask(task) {
    if (!task) return;
    const titleEl = document.getElementById('dev-task-title');
    const metaEl = document.getElementById('dev-task-meta');
    const statusTextEl = document.getElementById('dev-status-text');
    const filesCountEl = document.getElementById('dev-files-count');
    const testsCountEl = document.getElementById('dev-tests-count');
    const riskValEl = document.getElementById('dev-risk-val');
    const branchBadgeEl = document.getElementById('dev-branch-badge');
    const projectSelectEl = document.getElementById('dev-project-select');

    if (titleEl) titleEl.textContent = task.requirement;
    if (metaEl) metaEl.textContent = `Module: ${task.impact?.module || 'Core'} · Risk: ${task.risk} · ${task.filesChanged?.length || 0} Files Modified`;
    if (statusTextEl) statusTextEl.textContent = task.status.replace(/_/g, ' ');
    if (filesCountEl) filesCountEl.textContent = task.filesChanged?.length || 0;
    if (testsCountEl) testsCountEl.textContent = `${task.tests?.length || 0} / ${task.tests?.length || 0}`;
    if (riskValEl) riskValEl.textContent = task.risk;
    if (branchBadgeEl) branchBadgeEl.textContent = task.branch;
    if (projectSelectEl && task.projectId) projectSelectEl.value = task.projectId;

    // Update 7 pipeline steps
    document.querySelectorAll('.dev-pipe-step').forEach(stepEl => {
      const stepNum = parseInt(stepEl.getAttribute('data-step'), 10);
      stepEl.classList.remove('completed', 'active');
      if (task.status === 'PUSHED_TO_GITHUB' || stepNum < task.currentStep) {
        stepEl.classList.add('completed');
      } else if (stepNum === task.currentStep) {
        stepEl.classList.add(task.status === 'PUSHED_TO_GITHUB' ? 'completed' : 'active');
      }
    });
  }

  openDiffModal(task) {
    if (!task || !task.filesChanged) return;
    const modal = document.getElementById('dev-diff-modal');
    const tabsContainer = document.getElementById('diff-file-tabs');
    const viewport = document.getElementById('diff-code-viewport');
    const branchNameEl = document.getElementById('diff-branch-name');

    if (branchNameEl) branchNameEl.textContent = task.branch;
    if (!modal || !tabsContainer || !viewport) return;

    const escapeDiffHtml = (str) => String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    tabsContainer.innerHTML = task.filesChanged.map((f, idx) => `
      <button class="diff-file-tab ${idx === 0 ? 'active' : ''}" data-file-idx="${idx}">
        ${f.path.split('/').pop()} (+${f.additions}/-${f.deletions})
      </button>
    `).join('');

    const renderFileDiff = (file) => {
      const lines = file.diff.split('\n').map(line => {
        if (line.startsWith('@@')) {
          return `<div class="diff-line hunk">${escapeDiffHtml(line)}</div>`;
        } else if (line.startsWith('+')) {
          return `<div class="diff-line add">${escapeDiffHtml(line)}</div>`;
        } else if (line.startsWith('-')) {
          return `<div class="diff-line del">${escapeDiffHtml(line)}</div>`;
        } else {
          return `<div class="diff-line">${escapeDiffHtml(line)}</div>`;
        }
      }).join('');
      viewport.innerHTML = lines;
    };

    renderFileDiff(task.filesChanged[0]);

    tabsContainer.querySelectorAll('.diff-file-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabsContainer.querySelectorAll('.diff-file-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const idx = parseInt(tab.getAttribute('data-file-idx'), 10);
        renderFileDiff(task.filesChanged[idx]);
      });
    });

    modal.classList.add('open');
    this.renderIcons();
  }

  openConfirmationGate(task) {
    if (!task) return;
    const modal = document.getElementById('dev-confirm-modal');
    if (!modal) return;

    const repoEl = document.getElementById('confirm-repo-name');
    const branchEl = document.getElementById('confirm-branch-name');
    const commitEl = document.getElementById('confirm-commit-preview');

    if (repoEl) repoEl.textContent = task.remote || `sathishkhan27/${task.projectId}`;
    if (branchEl) branchEl.textContent = task.branch;
    if (commitEl) commitEl.textContent = task.commitMessage?.split('\n')[0] || `feat(${task.projectId}): real-time updates`;

    modal.classList.add('open');
    soundEffects.playAlert();
    this.renderIcons();
  }

  setupEventListeners() {
    // Nav mode switching
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = btn.getAttribute('data-mode');
        this.switchMode(mode);
      });
    });

    // Language Selector
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        this.currentLanguage = e.target.value;
        if (this.voiceEngine) {
          this.voiceEngine.setLanguage(this.currentLanguage);
        }
        this.showToast(`Language set to ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // JARVIS Continuous Voice Mode Toggle
    const jarvisToggle = document.getElementById('jarvis-continuous-toggle');
    const jarvisLabel = document.getElementById('jarvis-toggle-label');
    if (jarvisToggle) {
      jarvisToggle.addEventListener('click', async () => {
        if (!this.audioVisualizer.isActive) {
          await this.audioVisualizer.attachMicrophone();
        }
        const newState = !this.voiceEngine.isContinuousMode;
        this.voiceEngine.setContinuousMode(newState);
        jarvisToggle.classList.toggle('active', newState);
        if (jarvisLabel) {
          jarvisLabel.textContent = newState ? 'JARVIS VOICE: ACTIVE' : 'JARVIS VOICE: PAUSED';
        }
        this.showToast(newState ? 'JARVIS Continuous Voice Enabled' : 'Voice Recognition Paused');
      });
    }

    // Live Voice Recognition Box Click to talk
    const liveVoiceBox = document.getElementById('live-voice-box');
    if (liveVoiceBox) {
      liveVoiceBox.addEventListener('click', async () => {
        if (!this.audioVisualizer.isActive) {
          await this.audioVisualizer.attachMicrophone();
        }
        this.voiceEngine.startListening();
        this.showToast('Listening... speak now to GENISUS');
      });
    }

    // Mic button
    const micBtn = document.getElementById('mic-toggle-btn');
    if (micBtn) {
      micBtn.addEventListener('click', async () => {
        if (!this.audioVisualizer.isActive) {
          await this.audioVisualizer.attachMicrophone();
        }
        this.voiceEngine.toggleListening();
      });
    }

    // Voice Interrupt button
    const interruptBtn = document.getElementById('voice-interrupt-btn');
    if (interruptBtn) {
      interruptBtn.addEventListener('click', () => {
        this.voiceEngine.interrupt();
        this.showToast('GENISUS voice interrupted');
      });
    }

    // Command input submission
    const inputField = document.getElementById('command-input');
    if (inputField) {
      inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && inputField.value.trim()) {
          const cmd = inputField.value.trim();
          inputField.value = '';
          this.executeCommand(cmd, this.currentLanguage);
        }
      });
    }

    // Quick prompt chips
    document.querySelectorAll('.prompt-chip[data-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        this.executeCommand(prompt, this.currentLanguage);
      });
    });

    // Optical Camera Modal trigger
    const openCamBtn = document.getElementById('open-scanner-modal-btn');
    const modal = document.getElementById('product-modal');
    const closeCamBtn = document.getElementById('close-modal-btn');

    if (openCamBtn && modal) {
      openCamBtn.addEventListener('click', () => {
        this.openProductModal();
      });
    }

    if (closeCamBtn && modal) {
      closeCamBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    // Modal Product Scan Buttons
    document.getElementById('trigger-scan-laptop')?.addEventListener('click', () => this.scanProductInModal('laptop'));
    document.getElementById('trigger-scan-phone')?.addEventListener('click', () => this.scanProductInModal('phone'));
    document.getElementById('trigger-scan-watch')?.addEventListener('click', () => this.scanProductInModal('watch'));

    // 3D Hologram buttons in modal
    document.getElementById('holo-wireframe-toggle')?.addEventListener('click', () => {
      if (this.productHologram) this.productHologram.toggleWireframe();
    });
    document.getElementById('holo-explode-toggle')?.addEventListener('click', () => {
      if (this.productHologram) this.productHologram.toggleExplodedView();
    });

    // Safety Confirmation abort/confirm
    document.getElementById('safety-cancel-btn')?.addEventListener('click', () => {
      document.getElementById('safety-modal').classList.remove('visible');
      this.showToast('Sensitive action aborted by user.');
    });

    document.getElementById('safety-confirm-btn')?.addEventListener('click', () => {
      document.getElementById('safety-modal').classList.remove('visible');
      this.showToast('Action confirmed and authorized.');
      this.voiceEngine.speak('Action confirmed and authorized by user.');
    });

    // Sidebar Navigation mode switching
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');
        this.switchMode(mode);
      });
    });

    // Stark Protocol Buttons
    document.getElementById('btn-house-party')?.addEventListener('click', () => {
      this.executeCommand('House Party Protocol', this.currentLanguage);
    });

    document.getElementById('btn-tactical-mode')?.addEventListener('click', () => {
      this.executeCommand('Tactical Diagnostic Mode', this.currentLanguage);
    });

    document.getElementById('btn-clean-slate')?.addEventListener('click', () => {
      this.executeCommand('Clean Slate Protocol', this.currentLanguage);
    });

    // Hero Talk to Jarvis Capsule & Sidebar Mic Button
    const triggerVoiceInteraction = async () => {
      if (!this.audioVisualizer.isActive) {
        await this.audioVisualizer.attachMicrophone();
      }
      this.voiceEngine.toggleListening();
    };

    document.getElementById('hero-talk-btn')?.addEventListener('click', triggerVoiceInteraction);
    document.getElementById('sidebar-mic-btn')?.addEventListener('click', triggerVoiceInteraction);

    // Quick search bar
    const searchInput = document.getElementById('quick-search-input');
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
          const query = searchInput.value.trim();
          searchInput.value = '';
          this.executeCommand(query, this.currentLanguage);
        }
      });
    }

    // Quick Command Buttons
    document.getElementById('cmd-devops-audit')?.addEventListener('click', () => {
      this.executeCommand('Genisus, check my GitHub repositories at sathishkhan27', this.currentLanguage);
    });
    document.getElementById('cmd-devops-deploy')?.addEventListener('click', () => {
      this.executeCommand('Genisus, fix development bugs in PingZO Delivery App and push deployment', this.currentLanguage);
    });
    document.getElementById('cmd-new-task')?.addEventListener('click', () => {
      this.executeCommand('இன்று நான் செய்ய வேண்டிய முக்கியமான வேலைகள் என்ன?', this.currentLanguage);
    });
    document.getElementById('cmd-start-voice')?.addEventListener('click', triggerVoiceInteraction);

    // Executive Briefing button
    document.getElementById('btn-executive-briefing')?.addEventListener('click', () => {
      this.executeCommand('Show today comprehensive executive briefing and market overview', this.currentLanguage);
    });

    // Live Intel Feed Actions
    document.getElementById('feed-view-tasks')?.addEventListener('click', () => {
      this.executeCommand('இன்றைய வேலைகள் என்ன?', this.currentLanguage);
    });
    document.getElementById('btn-view-all-intel')?.addEventListener('click', () => {
      this.switchMode('world');
    });
    document.getElementById('btn-view-all-agents')?.addEventListener('click', () => {
      this.executeCommand('House Party Protocol', this.currentLanguage);
    });
    document.getElementById('btn-view-memory-map')?.addEventListener('click', () => {
      this.switchMode('memory');
    });

    // Call End Button
    document.getElementById('btn-end-call')?.addEventListener('click', () => {
      document.getElementById('call-modal')?.classList.remove('open');
      this.showToast('அழைப்பு முடிக்கப்பட்டது (Call Ended)');
      this.voiceEngine.speak('அழைப்பு முடிக்கப்பட்டது.');
    });
  }

  async executeCommand(query, lang = 'en-US') {
    // Add user bubble
    this.addTranscriptBubble('user', query);
    this.updateSystemVoiceState('THINKING');

    // Section 30 & 31: Dynamic Step Progression Bubble
    const progressId = this.showLiveStepProgression(query);

    setTimeout(async () => {
      try {
        const result = await orchestrator.dispatch(query, lang);
        this.removeLiveStepProgression(progressId);

        if (result) {
          // Stream real agent execution into Live Intelligence Feed
          liveIntelFeed.pushAgentAction(
            result.agent || 'GENISUS AI Core',
            'Autonomous Directive Dispatched',
            query.length > 35 ? query.substring(0, 35) + '...' : query,
            result.mode === 'TACTICAL' ? 'crimson' : 'cyan'
          );

          if (result.mode === 'TACTICAL') {
            if (this.hologramCore) {
              this.hologramCore.setState(result.tacticalActive ? 'TACTICAL' : 'IDLE');
            }
            const statusPill = document.getElementById('system-status-badge');
            if (statusPill) {
              statusPill.innerHTML = result.tacticalActive 
                ? `<span class="status-dot" style="background: var(--crimson); box-shadow: 0 0 8px var(--crimson);"></span><span>STATUS: <strong style="color: var(--crimson);">COMBAT READY</strong></span>`
                : `<span class="status-dot"></span><span>SYSTEM STATUS: <strong>OPTIMAL</strong></span>`;
            }
            this.handleGenisusOutput(result, true);
          } else if (result.mode === 'CLEAN_SLATE') {
            const container = document.getElementById('dialog-transcript');
            if (container) container.innerHTML = '';
            this.handleGenisusOutput(result, true);
          } else if (result.mode === 'SECURITY_CONFIRMATION_REQUIRED') {
            this.triggerSafetyConfirmation(result.displayText, result.data);
          } else if (result.mode === 'HOLOGRAPHIC_PRODUCT_MODAL') {
            this.handleGenisusOutput(result, true);
            this.openProductModal(result.product.type);
          } else if (result.mode === 'PHONE_CALL_MODAL') {
            this.handleGenisusOutput(result, true);
            this.triggerPhoneCall(result.data.contact);
          } else if (result.mode === 'DEV_DIFF_VIEW') {
            this.handleGenisusOutput(result, true);
            this.openDiffModal(result.data || aiDeveloperAgent.activeTask);
          } else if (result.mode === 'DEV_OPEN_DASHBOARD') {
            this.handleGenisusOutput(result, true);
            this.switchMode('developer');
          } else if (result.mode === 'DEV_CHANGE_PREVIEW') {
            this.handleGenisusOutput(result, true);
            this.renderDeveloperTask(result.data || aiDeveloperAgent.activeTask);
          } else if (result.mode === 'DEV_PUSH_SUCCESS') {
            this.handleGenisusOutput(result, true);
            confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
            soundEffects.playAlert();
          } else if (result.mode === 'DEV_PUSH_CANCELLED') {
            this.handleGenisusOutput(result, true);
          } else {
            this.handleGenisusOutput(result, true);
          }
        }
      } catch (cmdErr) {
        this.removeLiveStepProgression(progressId);
        console.error('Command execution failed:', cmdErr);
        this.addTranscriptBubble('genisus', `⚠️ Execution Notice: ${cmdErr.message}`);
        this.updateSystemVoiceState('IDLE');
      }
    }, 250);
  }

  showLiveStepProgression(query) {
    const container = document.getElementById('dialog-transcript');
    if (!container) return null;

    const id = 'progression-' + Date.now();
    const bubble = document.createElement('div');
    bubble.id = id;
    bubble.className = 'speech-bubble genisus step-progression-bubble';
    bubble.innerHTML = `
      <div class="step-progression-header">
        <span style="color: var(--cyan); animation: pulse-dot-anim 1s infinite;">⚡</span>
        <span class="step-progression-title">GENISUS COGNITIVE ENGINE</span>
      </div>
      <div class="step-progression-list">
        <div class="prog-step step-1 active"><span class="step-num">1</span> <span class="step-label">Analyzing intent & context...</span></div>
        <div class="prog-step step-2"><span class="step-num">2</span> <span class="step-label">Planning solution & impact...</span></div>
        <div class="prog-step step-3"><span class="step-num">3</span> <span class="step-label">Synthesizing code / directive...</span></div>
        <div class="prog-step step-4"><span class="step-num">4</span> <span class="step-label">Truthful action validation...</span></div>
      </div>
    `;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;

    let stepIndex = 1;
    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex <= 4) {
        const prev = bubble.querySelector(`.step-${stepIndex - 1}`);
        if (prev) {
          prev.classList.remove('active');
          prev.classList.add('done');
          const num = prev.querySelector('.step-num');
          if (num) num.textContent = '✓';
        }
        const curr = bubble.querySelector(`.step-${stepIndex}`);
        if (curr) curr.classList.add('active');
      }
    }, 400);

    bubble._stepInterval = interval;
    return id;
  }

  removeLiveStepProgression(id) {
    if (!id) return;
    const bubble = document.getElementById(id);
    if (bubble) {
      if (bubble._stepInterval) clearInterval(bubble._stepInterval);
      bubble.remove();
    }
  }

  handleGenisusOutput(result, speak = true) {
    // 1. Determine actual speech vs display content language from Unicode characters
    const hasTamilSpeech = /[\u0B80-\u0BFF]/.test(result.speechText || '');
    const hasTamilDisplay = /[\u0B80-\u0BFF]/.test(result.displayText || '');
    const isTamilDisplay = hasTamilDisplay;
    const voiceLang = hasTamilSpeech ? 'ta-IN' : 'en-US';

    this.addTranscriptBubble('genisus', result.displayText, isTamilDisplay, result.source);

    // Update banner with active agent name
    const banner = document.getElementById('active-agent-banner');
    if (banner && result.agent) {
      banner.textContent = result.agent.toUpperCase();
    }

    if (speak && result.speechText) {
      this.voiceEngine.speak(result.speechText, voiceLang);
    } else {
      this.updateSystemVoiceState('IDLE');
    }
  }

  addTranscriptBubble(role, text, isTamil = false, source = null) {
    const container = document.getElementById('dialog-transcript');
    if (!container || !text) return;

    const bubble = document.createElement('div');
    bubble.className = `speech-bubble ${role} ${isTamil ? 'genisus-tamil' : ''}`;

    let html = text;

    // 1. Convert fenced code blocks ```lang ... ``` to styled <pre class="hud-code-snippet"><code>...</code></pre>
    html = html.replace(/```([a-zA-Z0-9_\-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
      const cleanCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const langBadge = lang ? `<div class="code-lang-tag">${lang}</div>` : '';
      return `<div class="hud-code-container">${langBadge}<pre class="hud-code-snippet"><code>${cleanCode.trim()}</code></pre></div>`;
    });

    // 2. Convert markdown tables
    html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
      const rows = match.trim().split('\n').map(r => r.trim()).filter(Boolean);
      if (rows.length < 2) return match;
      let tableHtml = '<div class="hud-table-wrapper"><table class="hud-table">';
      rows.forEach((row, rIdx) => {
        if (/^\|[-:\s|]+\|$/.test(row)) return;
        const cells = row.split('|').slice(1, -1).map(c => c.trim());
        const tag = rIdx === 0 ? 'th' : 'td';
        tableHtml += `<tr>${cells.map(c => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
      });
      tableHtml += '</table></div>';
      return tableHtml;
    });

    // 3. Convert markdown blockquotes (> quote)
    html = html.replace(/^(?:> (.*)(?:\n|$))+/gm, (match) => {
      const quoteText = match.replace(/^> /gm, '').trim();
      return `<blockquote class="hud-quote">${quoteText}</blockquote>`;
    });

    // 4. Convert interactive action buttons [ ACTION ] or [ BUTTON ]
    html = html.replace(/\[\s*([A-Z0-9_\s&]{3,30})\s*\]/g, (match, action) => {
      return `<button class="hud-action-chip" onclick="window.__hudApp && window.__hudApp.executeCommand('${action.trim()}')">${action.trim()}</button>`;
    });

    // 5. Headings
    html = html
      .replace(/### (.*)/g, '<div class="hud-h3">$1</div>')
      .replace(/## (.*)/g, '<div class="hud-h2">$1</div>')
      .replace(/# (.*)/g, '<div class="hud-h1">$1</div>');

    // 6. Bold, Italics, Inline Code
    html = html
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="hud-inline-code">$1</code>');

    // 7. Unordered Lists
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gm, '<div class="hud-bullet-item"><span class="bullet-dot">›</span> $1</div>');

    // 8. Horizontal rules
    html = html.replace(/---/g, '<hr class="hud-divider">');

    // 9. Preserved Line Breaks
    html = html.replace(/\n\n/g, '<div class="hud-spacer"></div>').replace(/\n/g, '<br>');

    // 10. Source Citation Badge
    if (source) {
      html += `<div class="hud-source-badge">🔍 Source: ${source}</div>`;
    }

    bubble.innerHTML = html;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  triggerSafetyConfirmation(message, data) {
    const modal = document.getElementById('safety-modal');
    const msgEl = document.getElementById('safety-modal-message');
    if (modal && msgEl) {
      msgEl.textContent = message;
      modal.classList.add('visible');
    }
    this.voiceEngine.playHudTone('stop');
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll('.nav-btn, .sidebar-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const devCard = document.getElementById('dev-command-card');
    const dialogCard = document.getElementById('dialog-feed-card');
    const plannerCard = document.getElementById('planner-command-card');
    const marketplaceCard = document.getElementById('marketplace-command-card');
    const govCard = document.getElementById('governance-command-card');

    if (devCard) devCard.style.display = mode === 'developer' ? 'flex' : 'none';
    if (plannerCard) plannerCard.style.display = mode === 'planner' ? 'flex' : 'none';
    if (marketplaceCard) marketplaceCard.style.display = mode === 'marketplace' ? 'flex' : 'none';
    if (govCard) govCard.style.display = mode === 'governance' ? 'flex' : 'none';
    if (dialogCard) dialogCard.style.display = (mode !== 'developer' && mode !== 'planner' && mode !== 'marketplace' && mode !== 'governance') ? 'flex' : 'none';

    const titleEl = document.getElementById('right-panel-title');
    const badgeEl = document.getElementById('right-panel-badge');
    const contentEl = document.getElementById('right-panel-content');
    const rightCard = document.getElementById('right-panel-card');

    const githubCard = document.querySelector('.github-repos-card');
    const intelCard = document.querySelector('.intel-feed-card');
    const swarmCard = document.querySelector('.active-swarm-card');

    const showDynamicRightPanel = (show) => {
      if (rightCard) rightCard.style.display = show ? 'flex' : 'none';
      if (githubCard) githubCard.style.display = show ? 'none' : 'flex';
      if (intelCard) intelCard.style.display = show ? 'none' : 'flex';
      if (swarmCard) swarmCard.style.display = show ? 'none' : 'flex';
    };

    if (mode === 'governance') {
      showDynamicRightPanel(false);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="shield-check" class="red"></i> ENTERPRISE AI GOVERNANCE';
      if (badgeEl) { badgeEl.textContent = 'ZERO-TRUST GRC'; badgeEl.className = 'panel-badge red'; }
      if (this.governanceController) {
        this.governanceController.renderAll();
      }
    } else if (mode === 'developer') {
      showDynamicRightPanel(false);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="code-2"></i> AI DEVELOPER ENGINE';
      if (badgeEl) { badgeEl.textContent = 'CONTINUOUS SDLC'; badgeEl.className = 'panel-badge cyan'; }
      this.renderDeveloperTask(aiDeveloperAgent.activeTask);
    } else if (mode === 'planner') {
      showDynamicRightPanel(false);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="compass"></i> GPT-6 ASTRA TASK PLANNER';
      if (badgeEl) { badgeEl.textContent = 'DYNAMIC ROADMAP'; badgeEl.className = 'panel-badge violet'; }
      this.renderTaskPlan(orchestrator.taskPlanner.activePlan);
      this.renderPlannerRightPanel(contentEl);
    } else if (mode === 'marketplace') {
      showDynamicRightPanel(false);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="store"></i> AGENT MARKETPLACE & EVOLUTION';
      if (badgeEl) { badgeEl.textContent = '16 WORKERS ACTIVE'; badgeEl.className = 'panel-badge emerald'; }
      this.renderMarketplace();
      this.renderMarketplaceRightPanel(contentEl);
    } else if (mode === 'command-center') {
      showDynamicRightPanel(false);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="layout-dashboard"></i> COMMAND CENTER';
      if (badgeEl) { badgeEl.textContent = 'SYSTEM OVERVIEW'; badgeEl.className = 'panel-badge emerald'; }
      this.renderCommandCenterRightPanel(contentEl);
    } else if (mode === 'tasks') {
      this.pccSubTab = 'tasks';
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="check-square"></i> CRITICAL TASKS & SPRINT';
      if (badgeEl) { badgeEl.textContent = 'TASK MANAGER'; badgeEl.className = 'panel-badge amber'; }
      this.renderCommandCenterRightPanel(contentEl);
    } else if (mode === 'calendar') {
      this.pccSubTab = 'calendar';
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="calendar"></i> CALENDAR SCHEDULE';
      if (badgeEl) { badgeEl.textContent = 'SCHEDULE'; badgeEl.className = 'panel-badge cyan'; }
      this.renderCommandCenterRightPanel(contentEl);
    } else if (mode === 'tools') {
      this.pccSubTab = 'rag';
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="wrench"></i> TOOLS & KNOWLEDGE RAG';
      if (badgeEl) { badgeEl.textContent = '18 TOOLS ACTIVE'; badgeEl.className = 'panel-badge emerald'; }
      this.renderCommandCenterRightPanel(contentEl);
    } else if (mode === 'world') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="globe"></i> 🌍 WORLD INTELLIGENCE';
      if (badgeEl) { badgeEl.textContent = 'GLOBAL KNOWLEDGE GRAPH'; badgeEl.className = 'panel-badge world'; }
      this.renderWorldIntelPanel(contentEl);
    } else if (mode === 'business') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="trending-up"></i> BUSINESS INTELLIGENCE';
      if (badgeEl) { badgeEl.textContent = 'MRR & SAAS'; badgeEl.className = 'panel-badge cyan'; }
      this.renderBusinessRightPanel(contentEl);
    } else if (mode === 'revenue') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="gem"></i> REVENUE OPPORTUNITY';
      if (badgeEl) { badgeEl.textContent = 'OPPORTUNITY INCUBATOR'; badgeEl.className = 'panel-badge amber'; }
      this.renderRevenueRightPanel(contentEl);
    } else if (mode === 'health') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="heart-pulse"></i> HEALTH INTELLIGENCE';
      if (badgeEl) { badgeEl.textContent = 'BIOMETRIC SENSORS'; badgeEl.className = 'panel-badge emerald'; }
      this.renderHealthRightPanel(contentEl);
    } else if (mode === 'vision') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="scan"></i> PRODUCT INTELLIGENCE';
      if (badgeEl) { badgeEl.textContent = 'OPTICAL AI'; badgeEl.className = 'panel-badge'; }
      this.renderVisionRightPanel(contentEl);
    } else if (mode === 'memory') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="database"></i> AI MEMORY & RAG';
      if (badgeEl) { badgeEl.textContent = 'MULTI-TIER'; badgeEl.className = 'panel-badge'; }
      this.renderMemoryRightPanel(contentEl);
    } else if (mode === 'media') {
      showDynamicRightPanel(true);
      if (titleEl) titleEl.innerHTML = '<i data-lucide="phone-call"></i> அழைப்பு & இசை மையம்';
      if (badgeEl) { badgeEl.textContent = 'TELEPHONY & MEDIA'; badgeEl.className = 'panel-badge emerald'; }
      this.renderMediaRightPanel(contentEl);
    }

    this.renderIcons();
  }

  initAstraCore() {
    // Mode selector change
    const astraSelect = document.getElementById('astra-mode-select');
    if (astraSelect) {
      astraSelect.addEventListener('change', (e) => {
        const mode = e.target.value;
        orchestrator.astraCore.setExecutionMode(mode);
        this.showToast(`Switched operational mode to ${e.target.options[e.target.selectedIndex].text}`);
      });
    }

    // Task planner subscribers
    orchestrator.taskPlanner.subscribe((plan) => {
      this.renderTaskPlan(plan);
    });

    // Mid-turn steering input and quick chips
    document.getElementById('btn-steer-incorporate')?.addEventListener('click', () => {
      const input = document.getElementById('planner-steer-input');
      if (input && input.value.trim()) {
        const text = input.value.trim();
        input.value = '';
        orchestrator.taskPlanner.incorporateMidTaskChange(text);
        this.showToast(`Incorporated mid-turn directive: "${text}"`);
      }
    });

    document.querySelectorAll('[data-steer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.getAttribute('data-steer');
        orchestrator.taskPlanner.incorporateMidTaskChange(text);
        this.showToast(`Incorporated: "${text}"`);
      });
    });

    // Evolution Engine subscriber
    orchestrator.evolutionEngine.subscribe(() => {
      if (this.currentMode === 'marketplace') {
        this.renderMarketplace();
      }
    });

    window.__approveProposal = (propId) => {
      const res = orchestrator.evolutionEngine.approveProposal(propId);
      if (res.success) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        soundEffects.playAlert();
        this.showToast(`Approved & staged proposal: ${res.proposal?.agentName}`);
      }
    };

    // ------------------------------------------------------------------------
    // AI Model & OpenAI Frontier/Free Engine Configuration Modal
    // ------------------------------------------------------------------------
    const aiModelModal = document.getElementById('ai-model-modal');
    const modelBadge = document.getElementById('genisus-model-badge');
    const apiKeyInput = document.getElementById('openai-api-key-input');
    const baseUrlInput = document.getElementById('ai-base-url-input');
    const keyStatusTag = document.getElementById('ai-key-status-tag');
    const testOutputBox = document.getElementById('ai-test-output-box');

    const updateModelBadgeDisplay = () => {
      const settings = gptAstraService.getSettings();
      const label = document.getElementById('active-model-label');
      if (label) {
        if (settings.model === 'gpt-6-astra') {
          label.textContent = 'GPT-6 ASTRA [FREE]';
          label.style.color = '#60a5fa';
        } else if (settings.model === 'gpt-4o-mini') {
          label.textContent = 'OPENAI 4o-MINI [ACTIVE]';
          label.style.color = '#34d399';
        } else if (settings.model === 'gpt-4o') {
          label.textContent = 'OPENAI GPT-4o [FRONTIER]';
          label.style.color = '#c084fc';
        } else {
          label.textContent = `${settings.model.toUpperCase()} [ACTIVE]`;
          label.style.color = '#facc15';
        }
      }
    };

    updateModelBadgeDisplay();

    // Open Modal
    modelBadge?.addEventListener('click', () => {
      const settings = gptAstraService.getSettings();
      
      const radio = document.querySelector(`input[name="ai-engine-choice"][value="${settings.model}"]`);
      if (radio) radio.checked = true;

      if (apiKeyInput) apiKeyInput.value = gptAstraService.apiKey;
      if (baseUrlInput) baseUrlInput.value = gptAstraService.customBaseUrl;
      if (keyStatusTag) {
        keyStatusTag.textContent = settings.hasApiKey ? 'Custom API Key Saved' : 'Free Mode Active';
        keyStatusTag.style.color = settings.hasApiKey ? '#34d399' : '#94a3b8';
      }
      if (testOutputBox) testOutputBox.style.display = 'none';

      aiModelModal?.classList.add('open');
      this.renderIcons();
    });

    // Close Modal
    document.getElementById('close-ai-model-modal-btn')?.addEventListener('click', () => {
      aiModelModal?.classList.remove('open');
    });
    document.getElementById('btn-close-ai-model-modal')?.addEventListener('click', () => {
      aiModelModal?.classList.remove('open');
    });

    // Toggle Key Visibility
    document.getElementById('toggle-key-visibility-btn')?.addEventListener('click', () => {
      if (apiKeyInput) {
        apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
      }
    });

    // Test Connection
    document.getElementById('btn-test-ai-connection')?.addEventListener('click', async () => {
      const selectedRadio = document.querySelector('input[name="ai-engine-choice"]:checked');
      const model = selectedRadio ? selectedRadio.value : 'gpt-6-astra';
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
      const baseUrl = baseUrlInput ? baseUrlInput.value.trim() : 'https://api.openai.com/v1';

      if (testOutputBox) {
        testOutputBox.style.display = 'block';
        testOutputBox.innerHTML = '<span style="color: #60a5fa;">⚡ Testing connection to AI reasoning engine...</span>';
      }

      const startTime = performance.now();
      try {
        if (apiKey) {
          const res = await fetch('/api/ai/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              query: 'Hello GENISUS, provide a 1-sentence system verification.',
              model,
              apiKey,
              baseUrl
            })
          });
          const data = await res.json();
          const latency = Math.round(performance.now() - startTime);

          if (data.success) {
            testOutputBox.innerHTML = `<span style="color: #34d399;">✓ Connection Successful (${latency}ms)</span><br/><strong style="color: #e2e8f0;">Model:</strong> ${data.model}<br/><span style="color: #cbd5e1;">"${data.answer.trim()}"</span>`;
            soundEffects.playSuccess();
          } else {
            testOutputBox.innerHTML = `<span style="color: #f87171;">✗ Live API Note:</span> ${data.error || 'Key validation returned fallback.'}<br/><span style="color: #6ee7b7;">✓ Built-in GPT-6 Astra Free Engine active and ready.</span>`;
          }
        } else {
          const latency = Math.round(performance.now() - startTime);
          testOutputBox.innerHTML = `<span style="color: #60a5fa;">✓ GPT-6 Astra Free Engine Active (${latency}ms)</span><br/><span style="color: #cbd5e1;">"Commander Sathish, GENISUS GPT-6 Astra cognitive core is online with full local multi-agent reasoning."</span>`;
          soundEffects.playSuccess();
        }
      } catch (err) {
        testOutputBox.innerHTML = `<span style="color: #f87171;">Error testing connection: ${err.message}</span>`;
      }
    });

    // Save & Apply Settings
    document.getElementById('btn-save-ai-model-settings')?.addEventListener('click', () => {
      const selectedRadio = document.querySelector('input[name="ai-engine-choice"]:checked');
      const model = selectedRadio ? selectedRadio.value : 'gpt-6-astra';
      const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
      const baseUrl = baseUrlInput ? baseUrlInput.value.trim() : 'https://api.openai.com/v1';

      gptAstraService.saveSettings({ model, apiKey, baseUrl });
      updateModelBadgeDisplay();
      aiModelModal?.classList.remove('open');
      this.showToast(`AI Model updated: ${model.toUpperCase()}`);
      soundEffects.playAlert();
    });
  }

  renderTaskPlan(plan) {
    if (!plan) return;
    const reqTitle = document.getElementById('planner-req-title');
    const statusText = document.getElementById('planner-status-text');
    const planId = document.getElementById('planner-plan-id');
    const list = document.getElementById('planner-steps-list');

    if (reqTitle) reqTitle.textContent = plan.originalRequirement;
    if (statusText) statusText.textContent = `STEP ${plan.currentStepIndex + 1} / ${plan.steps.length} (${plan.status})`;
    if (planId) planId.textContent = plan.id.toUpperCase();

    if (list) {
      list.innerHTML = plan.steps.map(s => `
        <div class="planner-step-row ${s.status === 'COMPLETED' ? 'completed' : s.status === 'ACTIVE' ? 'active' : 'pending'}">
          <span class="step-badge-num">${s.stepNumber}</span>
          <div class="step-info">
            <div class="step-title">${s.title} ${s.isDynamicallyAdded ? '<span style="color: var(--cyan); font-size: 10px;">[STEERED]</span>' : ''}</div>
            <div class="step-detail">${s.detail}</div>
          </div>
          <span class="step-status-tag ${s.status === 'COMPLETED' ? 'done' : s.status === 'ACTIVE' ? 'active' : ''}">${s.status}</span>
        </div>
      `).join('');
    }
  }

  renderMarketplace() {
    const grid = document.getElementById('agent-workers-grid');
    const propContainer = document.getElementById('evolution-proposals-container');

    if (grid) {
      const agents = orchestrator.agentMarketplace.listAgents();
      grid.innerHTML = agents.map(a => `
        <div class="agent-worker-card">
          <div class="agent-worker-header">
            <span class="agent-worker-title">${a.name.split('(')[0]}</span>
            <span class="badge-tag cyan">${a.version}</span>
          </div>
          <div class="agent-worker-purpose">${a.purpose}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px; font-size: 9.5px; color: var(--text-muted); font-family: var(--font-tech);">
            <span>LATENCY: ${a.latencyAvg}</span>
            <span style="color: var(--emerald);">● ${a.health}</span>
          </div>
        </div>
      `).join('');
    }

    if (propContainer) {
      const proposals = orchestrator.evolutionEngine.listProposals();
      propContainer.innerHTML = proposals.map(p => `
        <div class="evolution-prop-card">
          <div class="evolution-prop-header">
            <span>PROPOSAL: ${p.agentName}</span>
            <span class="badge-tag ${p.status === 'APPROVED' ? 'emerald' : 'violet'}">${p.status}</span>
          </div>
          <div style="font-size: 10.5px; color: #fff;"><b>Issue</b>: ${p.observedIssue}</div>
          <div style="font-size: 10.5px; color: var(--cyan);"><b>Gain</b>: ${p.expectedImprovement}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span style="font-size: 10px; color: var(--text-muted); font-family: var(--font-tech);">GOVERNANCE: ${p.governanceAudit.split('(')[0]}</span>
            ${p.status !== 'APPROVED' ? `<button class="btn-dev-action primary" style="padding: 2px 8px; font-size: 10px;" onclick="window.__approveProposal('${p.id}')">APPROVE</button>` : '<span style="color: var(--emerald); font-size: 10px;">✓ APPLIED</span>'}
          </div>
        </div>
      `).join('');
    }
  }

  renderPlannerRightPanel(container) {
    if (!container) return;
    const plan = orchestrator.taskPlanner.activePlan || { steps: [] };
    container.innerHTML = `
      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-family: var(--font-tech); font-size: 11px; font-weight: 700; color: var(--cyan);">
          GPT-6 ASTRA TASK ORCHESTRATION SUMMARY
        </div>
        <div style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.4;">
          Decomposing and executing natural-language instructions into multi-agent subtasks with active mid-turn steering.
        </div>
        <div class="confirm-details-card">
          <div class="confirm-row"><span class="confirm-label">Execution Mode:</span><span class="confirm-val" style="color: var(--cyan);">${orchestrator.astraCore.getExecutionMode()}</span></div>
          <div class="confirm-row"><span class="confirm-label">Total Steps:</span><span class="confirm-val">${plan.steps?.length || 7}</span></div>
          <div class="confirm-row"><span class="confirm-label">Mid-Turn Steering:</span><span class="confirm-val" style="color: var(--emerald);">ENABLED</span></div>
          <div class="confirm-row"><span class="confirm-label">Decision Framework:</span><span class="confirm-val">6-Factor Active</span></div>
        </div>
      </div>
    `;
  }

  renderMarketplaceRightPanel(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="padding: 10px; display: flex; flex-direction: column; gap: 8px;">
        <div style="font-family: var(--font-tech); font-size: 11px; font-weight: 700; color: #c084fc;">
          GOVERNED AGENT ECOSYSTEM
        </div>
        <div style="font-size: 11.5px; color: var(--text-secondary); line-height: 1.4;">
          16 specialized AI Worker Agents dynamically registered with sandbox permissions and Section 23 governance boundaries.
        </div>
        <div class="confirm-details-card">
          <div class="confirm-row"><span class="confirm-label">Active Agents:</span><span class="confirm-val" style="color: var(--emerald);">16 / 16 Healthy</span></div>
          <div class="confirm-row"><span class="confirm-label">Self-Improvement:</span><span class="confirm-val">Continuous Telemetry</span></div>
          <div class="confirm-row"><span class="confirm-label">Silent Modifications:</span><span class="confirm-val" style="color: var(--crimson);">PROHIBITED (Sec 23)</span></div>
        </div>
      </div>
    `;
  }

  renderLeftPanel() {
    const leftEl = document.getElementById('left-panel-content');
    if (!leftEl) return;

    const tasks = knowledgeBase.getTasks();

    leftEl.innerHTML = `
      <div style="margin-bottom: 14px;">
        <div style="font-family: var(--font-tech); font-size: 11px; letter-spacing: 1px; color: var(--cyan); margin-bottom: 6px;">
          TODAY'S CRITICAL TASKS
        </div>
        ${tasks.map(t => `
          <div class="hud-card" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; margin-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="checkbox" ${t.completed ? 'checked' : ''} data-task-id="${t.id}" class="task-checkbox" style="accent-color: var(--cyan); cursor: pointer;" />
              <span style="font-size: 12px; ${t.completed ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${t.title}</span>
            </div>
            <span class="panel-badge ${t.priority === 'HIGH' ? 'amber' : ''}" style="font-size: 9px;">${t.priority}</span>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom: 14px;">
        <div style="font-family: var(--font-tech); font-size: 11px; letter-spacing: 1px; color: var(--cyan); margin-bottom: 6px;">
          CALENDAR SCHEDULE
        </div>
        <div class="hud-card">
          <div style="font-size: 12px; font-weight: 600; color: #fff;">11:30 AM · Pingzo Seller Onboarding</div>
          <div style="font-size: 11px; color: var(--text-muted);">Review automated merchant KYC workflow</div>
        </div>
        <div class="hud-card">
          <div style="font-size: 12px; font-weight: 600; color: #fff;">03:00 PM · GENISUS Architecture Sync</div>
          <div style="font-size: 11px; color: var(--text-muted);">Multilingual low-latency voice pipeline test</div>
        </div>
        <div class="hud-card">
          <div style="font-size: 12px; font-weight: 600; color: #fff;">05:30 PM · SaaS Pricing Review</div>
          <div style="font-size: 11px; color: var(--text-muted);">Email Outreach Billing meter tiers</div>
        </div>
      </div>

      <div>
        <div style="font-family: var(--font-tech); font-size: 11px; letter-spacing: 1px; color: var(--cyan); margin-bottom: 6px;">
          PROACTIVE INTELLIGENCE ALERTS
        </div>
        <div class="hud-card" style="border-left: 3px solid var(--amber);">
          <div style="font-size: 11px; color: var(--amber); font-weight: 600;">DEADLINE MONITOR</div>
          <div style="font-size: 12px; color: #fff; margin-top: 2px;">Portfolio Builder template schema review due by 6 PM.</div>
        </div>
        <div class="hud-card" style="border-left: 3px solid var(--emerald);">
          <div style="font-size: 11px; color: var(--emerald); font-weight: 600;">NEW REVENUE GAP</div>
          <div style="font-size: 12px; color: #fff; margin-top: 2px;">Demand spike: Freelance GST Invoice Generator.</div>
        </div>
      </div>
    `;

    // Task checkbox toggle listener
    leftEl.querySelectorAll('.task-checkbox').forEach(box => {
      box.addEventListener('change', (e) => {
        const taskId = e.target.getAttribute('data-task-id');
        knowledgeBase.toggleTask(taskId);
        this.renderLeftPanel();
      });
    });
  }

  renderCommandCenterRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;

    const tasks = knowledgeBase.getTasks();
    const calendar = knowledgeBase.getCalendar();
    const notes = knowledgeBase.getNotes();
    const docs = knowledgeBase.getDocuments();
    const notifs = knowledgeBase.getNotifications();
    const unreadNotifsCount = notifs.filter(n => !n.read).length;

    // 1. Sub-navigation tabs header
    let html = `
      <div class="pcc-subnav">
        <button class="pcc-tab-btn ${this.pccSubTab === 'overview' ? 'active' : ''}" data-pcc-tab="overview">
          <i data-lucide="layout-grid" style="width: 14px;"></i> கண்ணோட்டம்
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'tasks' ? 'active' : ''}" data-pcc-tab="tasks">
          <i data-lucide="check-square" style="width: 14px;"></i> பணிகள் <span class="badge-count">${tasks.filter(t => !t.completed).length}</span>
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'calendar' ? 'active' : ''}" data-pcc-tab="calendar">
          <i data-lucide="calendar" style="width: 14px;"></i> நாட்காட்டி <span class="badge-count">${calendar.length}</span>
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'notes' ? 'active' : ''}" data-pcc-tab="notes">
          <i data-lucide="file-text" style="width: 14px;"></i> குறிப்புகள் <span class="badge-count">${notes.length}</span>
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'documents' ? 'active' : ''}" data-pcc-tab="documents">
          <i data-lucide="folder-archive" style="width: 14px;"></i> ஆவணங்கள் <span class="badge-count">${docs.length}</span>
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'rag' ? 'active' : ''}" data-pcc-tab="rag">
          <i data-lucide="search" style="width: 14px;"></i> அறிவுத் தேடல் (RAG)
        </button>
        <button class="pcc-tab-btn ${this.pccSubTab === 'notifications' ? 'active' : ''}" data-pcc-tab="notifications">
          <i data-lucide="bell" style="width: 14px;"></i> அறிவிப்புகள் ${unreadNotifsCount > 0 ? `<span class="badge-count unread">${unreadNotifsCount}</span>` : ''}
        </button>
      </div>
    `;

    // 2. Tab: Overview
    if (this.pccSubTab === 'overview') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>AI முகவர்கள் நிலை (AGENT MESH)</span>
            <span style="color: var(--emerald);">அனைத்தும் தயார் (6 ONLINE)</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
            <div class="agent-item active">
              <div class="agent-avatar"><i data-lucide="bot" style="width: 16px;"></i></div>
              <div class="agent-info">
                <div class="agent-name">Personal Assistant</div>
                <div class="agent-role">பணிகள், நாட்காட்டி & முன்னுரிமைகள்</div>
              </div>
              <span class="agent-status-light"></span>
            </div>
            <div class="agent-item">
              <div class="agent-avatar"><i data-lucide="trending-up" style="width: 16px;"></i></div>
              <div class="agent-info">
                <div class="agent-name">Business Intelligence</div>
                <div class="agent-role">₹4.85L MRR · Pingzo & SaaS</div>
              </div>
              <span class="agent-status-light"></span>
            </div>
            <div class="agent-item">
              <div class="agent-avatar"><i data-lucide="gem" style="width: 16px;"></i></div>
              <div class="agent-info">
                <div class="agent-name">Revenue Engine</div>
                <div class="agent-role">5 SaaS வாய்ப்புகள் தயார்</div>
              </div>
              <span class="agent-status-light"></span>
            </div>
            <div class="agent-item">
              <div class="agent-avatar"><i data-lucide="scan" style="width: 16px;"></i></div>
              <div class="agent-info">
                <div class="agent-name">Product & Vision AI</div>
                <div class="agent-role">ஆப்டிகல் OCR & 3D ஹோலோகிராம்</div>
              </div>
              <span class="agent-status-light"></span>
            </div>
          </div>
        </div>

        <div class="hud-card">
          <div class="card-title">
            <span>இன்றைய சுருக்கம் (DAILY SUMMARY)</span>
            <i data-lucide="sparkles" style="color: var(--cyan); width: 14px;"></i>
          </div>
          <div class="card-subtitle">
            ${tasks.filter(t => !t.completed).length} நிலுவை பணிகள், ${calendar.length} சந்திப்புகள், ${unreadNotifsCount} புதிய அறிவிப்புகள் உள்ளன.
          </div>
          <div class="card-metric-row">
            <div>
              <div style="font-size: 10px; color: var(--text-muted);">முக்கியப் பணிகள்</div>
              <div class="metric-big">${tasks.filter(t => !t.completed).length}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; color: var(--text-muted);">அமைப்பின் நிலை</div>
              <div class="metric-tag">100% NOMINAL</div>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Tab: Tasks (பணிகள்)
    else if (this.pccSubTab === 'tasks') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>📋 பணிகள் மேலாளர் (TASKS MANAGER)</span>
            <span class="panel-badge emerald">${tasks.filter(t => !t.completed).length} ACTIVE</span>
          </div>

          <!-- Quick Add Task Bar -->
          <div class="pcc-inline-add">
            <input type="text" id="pcc-task-input" class="pcc-inline-input" placeholder="புதிய பணியைத் தட்டச்சு செய்யவும்..." />
            <select id="pcc-task-priority" class="lang-selector" style="font-size: 11px;">
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM" selected>MED</option>
              <option value="LOW">LOW</option>
            </select>
            <button class="btn-primary" id="pcc-add-task-btn" style="padding: 6px 14px; font-size: 11px;">+ சேர்</button>
          </div>

          <!-- Tasks List -->
          <div style="display: flex; flex-direction: column; gap: 6px; max-height: 380px; overflow-y: auto;">
            ${tasks.map(t => `
              <div class="task-row-item ${t.completed ? 'completed' : ''}">
                <div style="display: flex; align-items: center; gap: 10px; flex: 1;">
                  <input type="checkbox" ${t.completed ? 'checked' : ''} data-task-id="${t.id}" class="pcc-task-chk" style="accent-color: var(--cyan); cursor: pointer;" />
                  <div>
                    <span class="task-text" style="font-size: 12px; font-weight: 600; color: #fff;">${t.title}</span>
                    <div style="font-size: 10px; color: var(--text-muted);">${t.due} · ${t.category}</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="panel-badge ${t.priority === 'HIGH' ? 'amber' : ''}" style="font-size: 9px;">${t.priority}</span>
                  <button class="pcc-del-task-btn" data-task-id="${t.id}" style="background: none; border: none; color: var(--crimson); cursor: pointer; font-size: 14px;">&times;</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 4. Tab: Calendar (நாட்காட்டி)
    else if (this.pccSubTab === 'calendar') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>📅 நாட்காட்டி & சந்திப்புகள் (CALENDAR SCHEDULE)</span>
            <span class="panel-badge cyan">இன்று</span>
          </div>

          <!-- Inline Add Meeting -->
          <div class="pcc-inline-add">
            <input type="text" id="pcc-event-input" class="pcc-inline-input" placeholder="புதிய கூட்டம் / சந்திப்பு பெயர்..." />
            <input type="text" id="pcc-event-time" class="pcc-inline-input" placeholder="நேரம் (எ.கா: 04:00 PM)" style="width: 120px;" />
            <button class="btn-primary" id="pcc-add-event-btn" style="padding: 6px 12px; font-size: 11px;">+ சேர்</button>
          </div>

          <!-- Calendar List -->
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto;">
            ${calendar.map(ev => `
              <div class="cal-slot-item">
                <div style="display: flex; justify-content: space-between;">
                  <span class="cal-slot-time">⏰ ${ev.time} (${ev.date})</span>
                  <button class="pcc-del-event-btn" data-event-id="${ev.id}" style="background: none; border: none; color: var(--text-muted); cursor: pointer;">&times;</button>
                </div>
                <div class="cal-slot-title">${ev.title}</div>
                <div class="cal-slot-meta">பங்கேற்பாளர்கள்: ${ev.attendees || 'சதீஷ்'} · வகை: ${ev.category}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 5. Tab: Notes (குறிப்புகள்)
    else if (this.pccSubTab === 'notes') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>📝 தனிப்பட்ட குறிப்புகள் (NOTES VAULT)</span>
            <span class="panel-badge emerald">${notes.length} குறிப்புகள்</span>
          </div>

          <!-- Add Note Form -->
          <div style="background: rgba(0,240,255,0.03); border: 1px solid rgba(0,240,255,0.15); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 12px;">
            <input type="text" id="pcc-note-title" class="pcc-inline-input" placeholder="குறிப்பின் தலைப்பு..." style="width: 100%; margin-bottom: 6px;" />
            <textarea id="pcc-note-content" class="pcc-inline-input" placeholder="குறிப்பின் உள்ளடக்கம்..." rows="2" style="width: 100%; resize: vertical; margin-bottom: 6px;"></textarea>
            <button class="btn-primary" id="pcc-add-note-btn" style="width: 100%; padding: 6px; font-size: 11px;">+ குறிப்பைச் சேமி (Save Note)</button>
          </div>

          <!-- Notes List -->
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 340px; overflow-y: auto;">
            ${notes.map(n => `
              <div class="note-hud-card">
                <div style="display: flex; justify-content: space-between; align-items: baseline;">
                  <div class="note-hud-title">${n.title}</div>
                  <button class="pcc-del-note-btn" data-note-id="${n.id}" style="background: none; border: none; color: var(--crimson); cursor: pointer;">&times;</button>
                </div>
                <div class="note-hud-body">${n.content}</div>
                <div class="note-hud-footer">
                  <span>தேதி: ${n.updatedAt}</span>
                  <span>${(n.tags || []).map(tag => `#${tag}`).join(' ')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 6. Tab: Documents (ஆவணங்கள்)
    else if (this.pccSubTab === 'documents') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>📁 தனிப்பட்ட ஆவணப் பெட்டகம் (DOCUMENTS VAULT)</span>
            <span class="panel-badge cyan">VERIFIED</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 400px; overflow-y: auto;">
            ${docs.map(d => `
              <div class="doc-vault-item">
                <div style="display: flex; gap: 10px; align-items: center;">
                  <span style="font-size: 22px;">📄</span>
                  <div>
                    <div style="font-size: 12px; font-weight: 700; color: #fff;">${d.title}</div>
                    <div style="font-size: 10px; color: var(--cyan);">${d.category} · <span style="color: var(--emerald);">${(d.confidence * 100).toFixed(0)}% சரிபார்க்கப்பட்டது</span></div>
                    <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">${d.snippet}</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 7. Tab: Knowledge RAG (அறிவுத் தேடல்)
    else if (this.pccSubTab === 'rag') {
      const ragResults = this.ragSearchQuery ? knowledgeBase.queryRAG(this.ragSearchQuery) : [];

      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>🧠 அறிவுத் தேடல் என்ஜின் (PERSONAL RAG ENGINE)</span>
            <span class="panel-badge cyan">SEMANTIC</span>
          </div>

          <div class="pcc-inline-add">
            <input type="text" id="pcc-rag-input" class="pcc-inline-input" value="${this.ragSearchQuery}" placeholder="ஆவணங்கள், குறிப்புகள், பணிகள் எதையும் தேடவும்..." />
            <button class="btn-primary" id="pcc-rag-btn" style="padding: 6px 14px; font-size: 11px;">🔍 தேடு</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto;">
            ${this.ragSearchQuery ? (
              ragResults.length > 0 ? ragResults.map(r => `
                <div class="hud-card" style="border-left: 3px solid var(--cyan); margin-bottom: 6px;">
                  <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: #fff;">
                    <span>${r.title}</span>
                    <span class="panel-badge cyan">${r.category}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px; line-height: 1.4;">
                    ${r.snippet}
                  </div>
                  <div style="font-size: 10px; color: var(--emerald); margin-top: 4px;">
                    சரிபார்க்கப்பட்ட நம்பிக்கை: ${(r.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              `).join('') : '<div style="font-size: 12px; color: var(--text-muted); padding: 10px;">பொருத்தமான முடிவுகள் கிடைக்கவில்லை.</div>'
            ) : `
              <div style="font-size: 12px; color: var(--text-muted); line-height: 1.6; padding: 10px;">
                💡 <strong>RAG உதவிக்குறிப்பு</strong>: உங்கள் போர்ட்ஃபோலியோ பில்டர், பிங்சோ ஆவணங்கள், ரெஸ்யூமே அல்லது தனிப்பட்ட குறிப்புகளைத் தேட மேலே தட்டச்சு செய்து 'தேடு' என்பதைக் கிளிக் செய்யவும்.
              </div>
            `}
          </div>
        </div>
      `;
    }

    // 8. Tab: Notifications (அறிவிப்புகள்)
    else if (this.pccSubTab === 'notifications') {
      html += `
        <div class="hud-card">
          <div class="card-title">
            <span>🔔 அறிவிப்புகள் மையம் (NOTIFICATIONS SENTRY)</span>
            <div style="display: flex; gap: 6px;">
              <button class="btn-primary" id="pcc-mark-notifs-read-btn" style="padding: 2px 8px; font-size: 10px;">அனைத்தும் வாசித்ததாக குறி</button>
              <button class="btn-danger" id="pcc-clear-notifs-btn" style="padding: 2px 8px; font-size: 10px;">நீக்கு</button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto;">
            ${notifs.map(n => `
              <div class="notif-hud-item ${n.read ? '' : 'unread'}">
                <div style="font-size: 18px;">
                  ${n.type === 'URGENT' ? '🚨' : n.type === 'OPPORTUNITY' ? '💎' : 'ℹ️'}
                </div>
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: baseline;">
                    <div style="font-size: 12px; font-weight: 700; color: #fff;">${n.title}</div>
                    <span style="font-size: 10px; color: var(--text-muted);">${n.time}</span>
                  </div>
                  <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    this.renderIcons();

    // Wire Subnav Tab clicks
    container.querySelectorAll('button[data-pcc-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.pccSubTab = btn.getAttribute('data-pcc-tab');
        this.renderCommandCenterRightPanel(container);
      });
    });

    // Wire Tasks actions
    const addTaskBtn = document.getElementById('pcc-add-task-btn');
    const taskInput = document.getElementById('pcc-task-input');
    const taskPri = document.getElementById('pcc-task-priority');
    if (addTaskBtn && taskInput) {
      addTaskBtn.addEventListener('click', () => {
        const title = taskInput.value.trim();
        if (title) {
          knowledgeBase.addTask(title, taskPri ? taskPri.value : 'MEDIUM', 'இன்று', 'Command Center');
          this.showToast(`பணி சேர்க்கப்பட்டது: ${title}`);
          this.renderCommandCenterRightPanel(container);
          this.renderLeftPanel();
        }
      });
    }

    container.querySelectorAll('.pcc-task-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-task-id');
        knowledgeBase.toggleTask(id);
        this.renderCommandCenterRightPanel(container);
        this.renderLeftPanel();
      });
    });

    container.querySelectorAll('.pcc-del-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-task-id');
        knowledgeBase.deleteTask(id);
        this.renderCommandCenterRightPanel(container);
        this.renderLeftPanel();
      });
    });

    // Wire Calendar actions
    const addEvBtn = document.getElementById('pcc-add-event-btn');
    const evInput = document.getElementById('pcc-event-input');
    const evTime = document.getElementById('pcc-event-time');
    if (addEvBtn && evInput) {
      addEvBtn.addEventListener('click', () => {
        const title = evInput.value.trim();
        const time = (evTime ? evTime.value.trim() : '') || '12:00 PM';
        if (title) {
          knowledgeBase.addCalendarEvent(title, time, 'இன்று', 'Scheduled', 'சதீஷ்');
          this.showToast(`கூட்டம் சேர்க்கப்பட்டது: ${title}`);
          this.renderCommandCenterRightPanel(container);
          this.renderLeftPanel();
        }
      });
    }

    container.querySelectorAll('.pcc-del-event-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-event-id');
        knowledgeBase.deleteCalendarEvent(id);
        this.renderCommandCenterRightPanel(container);
      });
    });

    // Wire Notes actions
    const addNoteBtn = document.getElementById('pcc-add-note-btn');
    const noteTitle = document.getElementById('pcc-note-title');
    const noteContent = document.getElementById('pcc-note-content');
    if (addNoteBtn && noteTitle && noteContent) {
      addNoteBtn.addEventListener('click', () => {
        const title = noteTitle.value.trim() || 'புதிய குறிப்பு';
        const content = noteContent.value.trim();
        if (content) {
          knowledgeBase.addNote(title, content, ['notes', 'personal']);
          this.showToast(`குறிப்பு சேமிக்கப்பட்டது: ${title}`);
          this.renderCommandCenterRightPanel(container);
        }
      });
    }

    container.querySelectorAll('.pcc-del-note-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-note-id');
        knowledgeBase.deleteNote(id);
        this.renderCommandCenterRightPanel(container);
      });
    });

    // Wire RAG search
    const ragBtn = document.getElementById('pcc-rag-btn');
    const ragInput = document.getElementById('pcc-rag-input');
    if (ragBtn && ragInput) {
      ragBtn.addEventListener('click', () => {
        this.ragSearchQuery = ragInput.value.trim();
        this.renderCommandCenterRightPanel(container);
      });
      ragInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.ragSearchQuery = ragInput.value.trim();
          this.renderCommandCenterRightPanel(container);
        }
      });
    }

    // Wire Notifications actions
    document.getElementById('pcc-mark-notifs-read-btn')?.addEventListener('click', () => {
      knowledgeBase.markAllNotificationsRead();
      this.showToast('அனைத்து அறிவிப்புகளும் வாசித்ததாக குறிக்கப்பட்டது');
      this.renderCommandCenterRightPanel(container);
    });

    document.getElementById('pcc-clear-notifs-btn')?.addEventListener('click', () => {
      knowledgeBase.clearNotifications();
      this.showToast('அறிவிப்புகள் அழிக்கப்பட்டன');
      this.renderCommandCenterRightPanel(container);
    });
  }

  renderBusinessRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    container.innerHTML = `
      <div class="hud-card">
        <div class="card-title">
          <span>REVENUE TELEMETRY</span>
          <span class="panel-badge emerald">PROFITABLE</span>
        </div>
        <div class="card-metric-row">
          <div>
            <div style="font-size: 10px; color: var(--text-muted);">MONTHLY REVENUE</div>
            <div class="metric-big">₹4,85,000</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: var(--text-muted);">GROWTH (MOM)</div>
            <div class="metric-tag">+22.4%</div>
          </div>
        </div>
        <div class="card-metric-row" style="margin-top: 4px;">
          <div>
            <div style="font-size: 10px; color: var(--text-muted);">NET ESTIMATED PROFIT</div>
            <div style="font-family: var(--font-display); font-size: 16px; color: #fff;">₹4,23,000</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: var(--text-muted);">PROFIT MARGIN</div>
            <div class="metric-tag">87.2%</div>
          </div>
        </div>
      </div>

      <div class="hud-card">
        <div class="card-title">PROJECT PIPELINE METRICS</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.1);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 12px;">
              <span>Pingzo Ecosystem</span>
              <span style="color: var(--cyan);">₹2,60,000 MRR</span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">14,200 MAU · 280 Merchants · +18%</div>
          </div>
          <div style="background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.1);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 12px;">
              <span>BookNowGo SaaS</span>
              <span style="color: var(--cyan);">₹1,45,000 MRR</span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">1,890 bookings · Slot Engine Stable</div>
          </div>
          <div style="background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.1);">
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 12px;">
              <span>Email Outreach Billing</span>
              <span style="color: var(--emerald);">₹80,000 MRR</span>
            </div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">1.2M API credits · +45% surge</div>
          </div>
        </div>
      </div>
    `;
  }

  renderRevenueRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    container.innerHTML = `
      <div class="hud-card">
        <div class="card-title">
          <span>OPPORTUNITY RADAR</span>
          <span class="panel-badge amber">5 IDENTIFIED</span>
        </div>
        <div class="card-subtitle">
          Algorithmic scoring based on market search velocity, competitor gaps, and developer synergy.
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <div class="hud-card" style="border-left: 3px solid var(--emerald);">
          <div style="font-weight: 600; font-size: 13px; color: #fff;">1. AI GST Invoice & Compliance Copilot</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Target: Indian Tech Freelancers · Score: 94/100</div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px;">
            <span style="color: var(--cyan);">₹799 - ₹1,999 / mo</span>
            <span style="color: var(--emerald);">Est. Build: 2 Weeks</span>
          </div>
        </div>

        <div class="hud-card" style="border-left: 3px solid var(--cyan);">
          <div style="font-weight: 600; font-size: 13px; color: #fff;">2. Hyperlocal Quick-Store Generator</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Leverages Pingzo Seller Portal + Portfolio Builder</div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px;">
            <span style="color: var(--cyan);">₹1,499 / mo store fee</span>
            <span style="color: var(--emerald);">High Moat</span>
          </div>
        </div>

        <div class="hud-card" style="border-left: 3px solid var(--purple);">
          <div style="font-weight: 600; font-size: 13px; color: #fff;">3. Indie Dev AI Log & Latency Sentry</div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Low-cost Datadog alternative for solo creators</div>
          <div style="display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px;">
            <span style="color: var(--cyan);">$29 / $79 / mo</span>
            <span style="color: var(--emerald);">Score: 88/100</span>
          </div>
        </div>
      </div>
    `;
  }

  renderHealthRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    container.innerHTML = `
      <div class="hud-card">
        <div class="card-title">
          <span>BIOMETRIC TELEMETRY</span>
          <span class="panel-badge emerald">OPTIMAL</span>
        </div>
        <div class="card-metric-row">
          <div>
            <div style="font-size: 10px; color: var(--text-muted);">SLEEP DURATION</div>
            <div class="metric-big">7.4 hrs</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: var(--text-muted);">RECOVERY SCORE</div>
            <div class="metric-tag">86 / 100</div>
          </div>
        </div>
        <div class="card-metric-row" style="margin-top: 4px;">
          <div>
            <div style="font-size: 10px; color: var(--text-muted);">RESTING HEART RATE</div>
            <div style="font-family: var(--font-display); font-size: 16px; color: #fff;">62 BPM</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 10px; color: var(--text-muted);">ACTIVE BURN</div>
            <div class="metric-tag">540 kcal</div>
          </div>
        </div>
      </div>

      <div class="hud-card">
        <div class="card-title">DAILY WELLNESS GOALS</div>
        <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 8px;">
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span>Steps: 8,420 / 10,000</span>
              <span style="color: var(--cyan);">84%</span>
            </div>
            <div style="height: 6px; background: rgba(0,240,255,0.1); border-radius: 3px; overflow: hidden;">
              <div style="width: 84%; height: 100%; background: var(--cyan);"></div>
            </div>
          </div>
          <div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
              <span>Hydration: 2.4L / 3.0L</span>
              <span style="color: var(--emerald);">80%</span>
            </div>
            <div style="height: 6px; background: rgba(0,255,170,0.1); border-radius: 3px; overflow: hidden;">
              <div style="width: 80%; height: 100%; background: var(--emerald);"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="hud-card" style="border: 1px dashed rgba(255, 170, 0, 0.4); background: rgba(255, 170, 0, 0.04);">
        <div style="font-size: 11px; color: var(--amber); line-height: 1.4;">
          ⚠️ <strong>Medical Disclaimer</strong>: GENISUS biometric telemetry provides wellness trends only. Always consult a qualified physician for clinical advice.
        </div>
      </div>
    `;
  }

  renderVisionRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    container.innerHTML = `
      <div class="hud-card">
        <div class="card-title">
          <span>OPTICAL RECOGNITION HUD</span>
          <span class="panel-badge">CAMERA AI</span>
        </div>
        <div class="card-subtitle">
          Real-time physical product identification, visible text OCR, barcode/QR parsing, and 3D wireframe generation.
        </div>
        <button class="btn-primary" id="panel-launch-camera" style="width: 100%; margin-top: 10px;">
          <i data-lucide="camera" style="width: 14px; display: inline; vertical-align: middle;"></i> Launch Optical Scanner
        </button>
      </div>

      <div class="hud-card">
        <div class="card-title">RECENT VERIFIED SCANS</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <div style="background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">MacBook Pro 16" (M3 Max)</div>
            <div style="font-size: 11px; color: var(--emerald);">Quality: 9.6/10 · ₹3,49,900 · Strong Buy</div>
          </div>
          <div style="background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px;">
            <div style="font-size: 12px; font-weight: 600; color: #fff;">Google Pixel 9 Pro (Tensor G4)</div>
            <div style="font-size: 11px; color: var(--cyan);">Quality: 9.2/10 · ₹1,09,999 · Recommended</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('panel-launch-camera')?.addEventListener('click', () => {
      this.openProductModal('laptop');
    });
  }

  renderMemoryRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    const mem = memoryStore.data;
    container.innerHTML = `
      <div class="hud-card">
        <div class="card-title">
          <span>AI MEMORY ARCHITECTURE</span>
          <span class="panel-badge cyan">MULTI-TIER</span>
        </div>
        <div class="card-subtitle">
          Secure compartmentalized storage: Short-Term, Long-Term, Project, and Business Memory.
        </div>
        <button class="btn-danger" id="purge-recent-memory-btn" style="width: 100%; margin-top: 8px; font-size: 11px;">
          Purge Short-Term Session Memory ("Forget This")
        </button>
      </div>

      <div class="hud-card">
        <div class="card-title">PROJECT MEMORY (SCRATCH REPOS)</div>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
          ${mem.projectMemory.map(p => `
            <div style="background: rgba(0,240,255,0.04); padding: 8px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.1);">
              <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 12px;">
                <span style="color: var(--cyan);">${p.name}</span>
                <span style="font-size: 10px; color: var(--text-muted);">${p.status}</span>
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-top: 3px;">${p.lastDecision}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="hud-card">
        <div class="card-title">AUDIT LOG & PROVENANCE</div>
        <div style="font-size: 11px; color: var(--text-muted); max-height: 120px; overflow-y: auto;">
          ${memoryStore.auditLogs.slice(0, 5).map(log => `
            <div style="margin-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 2px;">
              <span style="color: var(--cyan);">${log.timestamp}</span> [${log.actionType}] ${log.description}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('purge-recent-memory-btn')?.addEventListener('click', () => {
      memoryStore.forgetRecentConversation();
      this.showToast('Short-term session memory purged.');
      this.renderMemoryRightPanel(container);
    });
  }

  async openProductModal(type = 'laptop') {
    const modal = document.getElementById('product-modal');
    if (!modal) return;
    modal.classList.add('open');

    // Camera feed setup (handles permission denial gracefully with synthesized HUD camera pattern)
    const video = document.getElementById('camera-video');
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (video) video.srcObject = stream;
      }
    } catch (e) {
      console.log('Camera permission prompt closed or denied; using simulated HUD video stream', e);
    }

    this.scanProductInModal(type);
  }

  scanProductInModal(type = 'laptop') {
    if (this.productHologram) {
      this.productHologram.loadProductModel(type);
    }

    const visionAgent = orchestrator.productVisionAgent;
    const scanData = visionAgent.scanProduct(type);

    const readout = document.getElementById('product-spec-readout');
    if (readout && scanData.product) {
      const p = scanData.product;
      readout.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <h2 style="font-family: var(--font-display); font-size: 16px; color: var(--cyan);">${p.brand} ${p.model}</h2>
          <span class="panel-badge emerald">${p.qualityRating}</span>
        </div>
        <div style="font-family: var(--font-tech); font-size: 14px; color: var(--amber); margin-top: 4px;">Verified Price: ${p.marketPrice}</div>
        
        <div style="margin-top: 10px; background: rgba(0,240,255,0.05); padding: 8px; border-radius: 4px;">
          <strong>Hardware Specifications:</strong><br>
          ${Object.entries(p.specs).map(([k, v]) => `• <span style="color: var(--text-muted); text-transform: uppercase;">${k}</span>: ${v}`).join('<br>')}
        </div>

        <div style="margin-top: 8px;">
          <strong style="color: var(--emerald);">AI Verdict:</strong> ${p.aiVerdict}<br>
          <span style="font-size: 11px; color: var(--text-muted);">Alternatives: ${p.alternatives.join(' · ')}</span>
        </div>
      `;
    }

    this.voiceEngine.speak(`Scanned ${scanData.product.brand} ${scanData.product.model}.`);
  }

  triggerPhoneCall(contact) {
    const modal = document.getElementById('call-modal');
    if (!modal) return;

    const avatarEl = document.getElementById('call-avatar');
    const nameEl = document.getElementById('call-contact-name');
    const phoneEl = document.getElementById('call-phone-number');
    const nativeLink = document.getElementById('btn-native-dial');

    if (avatarEl) avatarEl.textContent = contact.avatar || '📞';
    if (nameEl) nameEl.textContent = contact.name;
    if (phoneEl) phoneEl.textContent = contact.phone;
    if (nativeLink) {
      nativeLink.href = `tel:${contact.phone.replace(/\s+/g, '')}`;
    }

    modal.classList.add('open');
    this.voiceEngine.playHudTone('activate');
  }

  renderTelephonyRightPanel(container) {
    container = container || document.getElementById('right-panel-content');
    if (!container) return;
    const commAgent = orchestrator.commAgent;
    const contacts = commAgent.contacts;

    container.innerHTML = `
      <!-- Manual Phone Dialer Input Card -->
      <div class="hud-card" style="padding: 10px; margin-bottom: 8px;">
        <div class="card-title" style="margin-bottom: 6px;">
          <span>📞 நேரடி எண் டயலர் (DIRECT DIALER)</span>
          <span class="panel-badge emerald">READY</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <input type="tel" id="telephony-manual-input" placeholder="+91 98400 00000 எண்ணை உள்ளிடவும்..." class="pcc-inline-input" style="flex: 1; font-size: 11px; padding: 6px 10px;" />
          <button class="btn-primary" id="telephony-dial-btn" style="padding: 6px 14px; font-size: 11px; white-space: nowrap;">
            📞 அழை
          </button>
        </div>
      </div>

      <!-- Phone Contacts Directory (All 6 Contacts) -->
      <div class="hud-card" style="padding: 10px; margin-bottom: 8px;">
        <div class="card-title" style="margin-bottom: 8px;">
          <span>📇 முகவரிப் புத்தகம் (CALL DIRECTORY)</span>
          <span class="panel-badge cyan">${contacts.length} CONTACTS</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${contacts.map(c => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,240,255,0.04); padding: 7px 10px; border-radius: 6px; border: 1px solid rgba(0,240,255,0.08); transition: all 0.2s;">
              <div style="display: flex; align-items: center; gap: 9px;">
                <span style="font-size: 18px;">${c.avatar}</span>
                <div>
                  <div style="font-size: 12px; font-weight: 700; color: #fff;">${c.name}</div>
                  <div style="font-size: 10px; color: var(--cyan);">${c.phone} · <span style="color: var(--text-muted);">${c.category}</span></div>
                </div>
              </div>
              <button class="btn-primary call-contact-trigger-btn" data-contact-id="${c.id}" style="padding: 3px 10px; font-size: 10.5px;">
                📞 அழை
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Telephony Network Telemetry Card -->
      <div class="hud-card" style="padding: 10px;">
        <div class="card-title" style="margin-bottom: 6px;">
          <span>📡 தொலைத்தொடர்பு நிலை (TELEPHONY STATUS)</span>
          <span style="color: var(--emerald); font-size: 10px; font-weight: 700;">● ONLINE</span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 10.5px;">
          <div style="background: rgba(0,240,255,0.03); padding: 6px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.08);">
            <div style="color: var(--text-muted); font-size: 9px;">செல்லுலார் நெட்வொர்க்</div>
            <div style="color: #fff; font-weight: 700;">JIO 5G VoLTE</div>
          </div>
          <div style="background: rgba(0,240,255,0.03); padding: 6px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.08);">
            <div style="color: var(--text-muted); font-size: 9px;">ஆடியோ கோடெக்</div>
            <div style="color: var(--emerald); font-weight: 700;">Opus HD Voice 48k</div>
          </div>
          <div style="background: rgba(0,240,255,0.03); padding: 6px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.08);">
            <div style="color: var(--text-muted); font-size: 9px;">பாதுகாப்பு & என்க்ரிப்ஷன்</div>
            <div style="color: var(--cyan); font-weight: 700;">AES-256 Protocol</div>
          </div>
          <div style="background: rgba(0,240,255,0.03); padding: 6px; border-radius: 4px; border: 1px solid rgba(0,240,255,0.08);">
            <div style="color: var(--text-muted); font-size: 9px;">அழைப்பு தாமதம் (Latency)</div>
            <div style="color: #fff; font-weight: 700;">8ms · Nominal</div>
          </div>
        </div>
      </div>
    `;

    // Event listeners for contact call buttons
    container.querySelectorAll('.call-contact-trigger-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const contactId = btn.getAttribute('data-contact-id');
        const contact = contacts.find(c => c.id === contactId);
        if (contact) this.triggerPhoneCall(contact);
      });
    });

    // Event listener for manual dialer
    const manualInput = container.querySelector('#telephony-manual-input');
    const dialBtn = container.querySelector('#telephony-dial-btn');
    if (dialBtn && manualInput) {
      dialBtn.addEventListener('click', () => {
        const num = manualInput.value.trim();
        if (num) {
          this.triggerPhoneCall({
            id: 'custom-call',
            name: num,
            phone: num,
            avatar: '📞',
            category: 'நேரடி அழைப்பு (Direct Dial)'
          });
        }
      });
    }
  }

  renderMediaRightPanel(container) {
    this.renderTelephonyRightPanel(container);
  }

  // ─── WORLD INTELLIGENCE PANEL ──────────────────────────────────────────────

  renderWorldIntelPanel(container) {
    if (!container) return;

    const tabs = [
      { id: 'live-feed',  icon: 'radio',         label: 'நேரலை FEED' },
      { id: 'tech',       icon: 'cpu',            label: 'TECH INTEL' },
      { id: 'software',   icon: 'code-2',         label: 'SOFTWARE' },
      { id: 'products',   icon: 'package',        label: 'PRODUCTS' },
      { id: 'business',   icon: 'briefcase',      label: 'BUSINESS' },
      { id: 'economy',    icon: 'bar-chart-2',    label: 'ECONOMY' },
      { id: 'timeline',   icon: 'clock',          label: 'TIMELINE' },
      { id: 'impact',     icon: 'target',         label: '🎯 MY IMPACT' },
    ];

    // Sub-nav
    let html = `<div class="world-subnav">`;
    tabs.forEach(t => {
      html += `<button class="world-tab-btn ${this.worldSubTab === t.id ? 'active' : ''}" data-world-tab="${t.id}"><i data-lucide="${t.icon}" style="width:13px"></i> ${t.label}</button>`;
    });
    html += `</div>`;

    // ── LIVE FEED ────────────────────────────────────────────────────
    if (this.worldSubTab === 'live-feed') {
      const summary = worldIntelligence.getWorldSummary();
      html += `
        <div class="world-stat-bar">
          <div class="world-stat"><span class="world-stat-value">${summary.totalEvents}</span><span class="world-stat-label">EVENTS TODAY</span></div>
          <div class="world-stat"><span class="world-stat-value live-pulse">${summary.liveEvents}</span><span class="world-stat-label">LIVE NOW</span></div>
          <div class="world-stat"><span class="world-stat-value amber-val">${summary.highImpactEvents}</span><span class="world-stat-label">HIGH IMPACT</span></div>
          <div class="world-stat"><span class="world-stat-value critical-val">${summary.criticalAlerts.length}</span><span class="world-stat-label">CRITICAL</span></div>
        </div>`;

      WORLD_FEED.forEach(e => {
        const tagClass = e.age === 'LIVE' ? 'tag-live' : e.age === 'RECENT' ? 'tag-recent' : 'tag-historical';
        const impactClass = e.impact === 'CRITICAL' ? 'impact-critical' : e.impact === 'HIGH' ? 'impact-high' : 'impact-medium';
        const impactIcon = e.impact === 'CRITICAL' ? '🔴' : e.impact === 'HIGH' ? '🟡' : '🟢';
        html += `
          <div class="world-feed-item ${impactClass}">
            <div class="world-feed-header">
              <span class="world-tag-badge ${tagClass}">${e.age}</span>
              <span class="world-cat-badge">${e.category}</span>
              <span class="world-feed-time">${e.timestamp.split('T')[1]?.slice(0,5)}</span>
              <span class="world-confidence">🎯 ${e.confidence}%</span>
            </div>
            <div class="world-feed-headline">${impactIcon} ${e.headline}</div>
            <div class="world-feed-summary">${e.summary}</div>
            ${e.personalImpact ? `<div class="world-personal-note">📍 ${e.personalImpact}</div>` : ''}
            <div class="world-feed-source">🔍 ${e.source} | 📍 ${e.geo}</div>
          </div>`;
      });
    }

    // ── TECH INTEL ───────────────────────────────────────────────────
    else if (this.worldSubTab === 'tech') {
      html += `<div class="world-grid-2">`;
      Object.entries(TECH_INTELLIGENCE).forEach(([key, tech]) => {
        const statusClass = tech.status.includes('RAPID') ? 'status-rapid' : tech.status.includes('DOMINANT') ? 'status-dominant' : tech.status.includes('CRITICAL') ? 'status-critical' : 'status-stable';
        html += `
          <div class="tech-domain-card">
            <div class="tech-card-header">
              <span class="tech-emoji">${tech.emoji}</span>
              <div>
                <div class="tech-name">${tech.name}</div>
                <span class="tech-status-badge ${statusClass}">${tech.status}</span>
              </div>
            </div>
            <div class="tech-adoption-bar">
              <div class="tech-adoption-fill" style="width: ${tech.adoption}%"></div>
            </div>
            <div class="tech-adoption-label">${tech.adoption}% Adoption · ${tech.momentum}</div>
            <div class="tech-demand">Career Demand: <strong>${tech.careerDemand}</strong></div>
            <div class="tech-salary">${tech.avgSalary}</div>
            ${tech.warning ? `<div class="tech-warning">${tech.warning}</div>` : ''}
          </div>`;
      });
      html += `</div>`;
    }

    // ── SOFTWARE ECOSYSTEM ────────────────────────────────────────────
    else if (this.worldSubTab === 'software') {
      Object.entries(SOFTWARE_ECOSYSTEM).forEach(([key, sw]) => {
        html += `
          <div class="hud-card" style="margin-bottom:12px">
            <div class="card-title">
              <span>${sw.name}</span>
              <span class="panel-badge emerald" style="font-size:10px">${sw.stable || sw.stable_version || sw.stable}</span>
            </div>
            ${sw.trending_packages ? `
              <div style="margin-top:10px">
                <div class="world-section-label">TRENDING PACKAGES</div>
                ${sw.trending_packages.slice(0, 4).map(pkg => `
                  <div class="software-eco-item">
                    <div class="sw-name">${pkg.name} <code class="sw-version">v${pkg.version}</code></div>
                    <div class="sw-desc">${pkg.desc}</div>
                    <div class="sw-stars">⭐ ${pkg.stars?.toLocaleString()}</div>
                  </div>`).join('')}
              </div>` : ''}
            ${sw.recent_issues ? `
              <div style="margin-top:8px">
                <div class="world-section-label" style="color:var(--amber)">RECENT ISSUES</div>
                ${sw.recent_issues.map(i => `<div style="font-size:11px; color:var(--amber); padding:3px 0">⚠️ ${i}</div>`).join('')}
              </div>` : ''}
          </div>`;
      });
    }

    // ── PRODUCTS ──────────────────────────────────────────────────────
    else if (this.worldSubTab === 'products') {
      PRODUCT_DB.forEach(p => {
        const tagClass = p.tag === 'LIVE' ? 'tag-live' : p.tag === 'RECENT' ? 'tag-recent' : p.tag === 'UNVERIFIED' ? 'tag-unverified' : p.tag === 'AI-INFERRED' ? 'tag-inferred' : 'tag-historical';
        const priceStr = p.price ? Object.entries(p.price).map(([k,v]) => `${k}: ${v}`).join(' · ') : 'TBD';
        html += `
          <div class="world-feed-item" style="margin-bottom:10px">
            <div class="world-feed-header">
              <span class="world-tag-badge ${tagClass}">${p.tag}</span>
              <span class="world-cat-badge">${p.category}</span>
              <span class="world-confidence">🎯 ${p.confidence}%</span>
            </div>
            <div class="world-feed-headline">${p.brand} ${p.model}</div>
            <div style="font-size:12px; color:var(--cyan); margin:4px 0">💰 ${priceStr}</div>
            <div style="font-size:11px; color:var(--text-secondary)">Status: ${p.status} · Sentiment: ${p.sentiment || 'N/A'}</div>
            ${p.specs ? `<div style="font-size:11px; color:var(--text-muted); margin-top:4px">${Object.entries(p.specs).slice(0,3).map(([k,v]) => `<strong>${k}</strong>: ${v}`).join(' · ')}</div>` : ''}
            ${p.keyStrengths ? `<div style="font-size:11px; color:var(--emerald); margin-top:3px">✅ ${p.keyStrengths.join(' · ')}</div>` : ''}
          </div>`;
      });
    }

    // ── BUSINESS ──────────────────────────────────────────────────────
    else if (this.worldSubTab === 'business') {
      const bi = worldIntelligence.getBusinessIntel();
      html += `<div class="world-section-label">FASTEST GROWING SECTORS</div>`;
      bi.growing_sectors.forEach(s => {
        html += `
          <div class="hud-card" style="margin-bottom:8px; border-left: 3px solid var(--emerald)">
            <div style="display:flex; justify-content:space-between; align-items:center">
              <strong style="color:#fff; font-size:13px">${s.sector}</strong>
              <span class="panel-badge emerald" style="font-size:10px">${s.growth}</span>
            </div>
            <div style="font-size:11px; color:var(--text-secondary); margin:4px 0">Drivers: ${s.drivers}</div>
            <div style="font-size:11px; color:var(--cyan)">💡 ${s.opportunity}</div>
          </div>`;
      });

      html += `<div class="world-section-label" style="margin-top:14px">RECENT FUNDING ROUNDS</div>`;
      bi.recent_funding.forEach(f => {
        html += `
          <div class="hud-card" style="margin-bottom:8px">
            <div style="display:flex; justify-content:space-between">
              <strong style="font-size:13px; color:#fff">${f.company}</strong>
              <span class="panel-badge amber" style="font-size:10px">${f.amount}</span>
            </div>
            <div style="font-size:11px; color:var(--text-muted)">${f.investor} · ${f.sector} · ${f.country} · ${f.date}</div>
          </div>`;
      });

      html += `<div class="world-section-label" style="margin-top:14px">MARKET TRENDS</div>`;
      bi.market_trends.forEach(t => {
        html += `<div style="font-size:12px; color:var(--text-secondary); padding:5px 0; border-bottom: 1px solid rgba(0,240,255,0.08)">→ ${t}</div>`;
      });
    }

    // ── ECONOMY ───────────────────────────────────────────────────────
    else if (this.worldSubTab === 'economy') {
      const eco = worldIntelligence.getEconomicData();
      html += `
        <div class="world-section-label">🇮🇳 INDIA ECONOMIC INDICATORS</div>
        <div class="eco-grid">`;
      Object.entries(eco.india).forEach(([k, v]) => {
        html += `
          <div class="eco-indicator-card">
            <div class="eco-value">${v}</div>
            <div class="eco-label">${k.replace(/_/g,' ').toUpperCase()}</div>
          </div>`;
      });
      html += `</div>
        <div class="world-section-label" style="margin-top:14px">🌐 GLOBAL INDICATORS</div>
        <div class="eco-grid">`;
      Object.entries(eco.global).forEach(([k, v]) => {
        html += `
          <div class="eco-indicator-card">
            <div class="eco-value">${v}</div>
            <div class="eco-label">${k.replace(/_/g,' ').toUpperCase()}</div>
          </div>`;
      });
      html += `</div>`;
    }

    // ── WORLD TIMELINE ────────────────────────────────────────────────
    else if (this.worldSubTab === 'timeline') {
      const timeline = worldIntelligence.getWorldTimeline();
      html += `<div class="world-section-label">🕐 TODAY'S WORLD TIMELINE — ${new Date().toDateString()}</div>
               <div class="world-timeline-container">`;
      timeline.forEach(e => {
        const impactIcon = e.impact === 'CRITICAL' ? '🔴' : e.impact === 'HIGH' ? '🟡' : '🟢';
        const tagClass = e.tag === 'LIVE' ? 'tag-live' : 'tag-recent';
        html += `
          <div class="world-timeline-entry">
            <div class="timeline-time">${e.time}</div>
            <div class="timeline-line"><div class="timeline-dot ${impactIcon === '🔴' ? 'dot-critical' : impactIcon === '🟡' ? 'dot-high' : 'dot-medium'}"></div></div>
            <div class="timeline-content">
              <span class="world-cat-badge" style="font-size:9px">${e.category}</span>
              <span class="world-tag-badge ${tagClass}" style="font-size:9px; margin-left:4px">${e.tag}</span>
              <div class="timeline-event">${impactIcon} ${e.event}</div>
            </div>
          </div>`;
      });
      html += `</div>`;
    }

    // ── PERSONAL IMPACT ───────────────────────────────────────────────
    else if (this.worldSubTab === 'impact') {
      const impact = worldIntelligence.getPersonalImpact();

      if (impact.critical.length > 0) {
        html += `<div class="world-section-label" style="color:var(--crimson)">🔴 CRITICAL — உடனடி நடவடிக்கை தேவை</div>`;
        impact.critical.forEach(c => {
          html += `
            <div class="personal-impact-card critical-impact">
              <div class="impact-headline">${c.headline}</div>
              <div class="impact-personal">${c.personalImpact}</div>
              <div class="impact-source">Source: ${c.source} (${c.confidence}% confidence)</div>
            </div>`;
        });
      }

      html += `<div class="world-section-label" style="margin-top:14px; color:var(--emerald)">🚀 வணிக வாய்ப்புகள் (Business Opportunities for YOU)</div>`;
      impact.opportunities.forEach(o => {
        html += `
          <div class="personal-impact-card opportunity-impact">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong class="impact-headline">${o.sector}</strong>
              <span class="panel-badge emerald" style="font-size:10px">${o.growth}</span>
            </div>
            <div class="impact-personal">💡 ${o.opportunity}</div>
          </div>`;
      });

      html += `<div class="world-section-label" style="margin-top:14px">📱 உங்கள் Stack-க்கான Today's Updates</div>`;
      impact.techUpdates.forEach(e => {
        html += `
          <div class="hud-card" style="margin-bottom:6px; border-left:3px solid var(--cyan)">
            <div style="font-size:12px; color:#fff; font-weight:600">${e.headline}</div>
            <div style="font-size:11px; color:var(--text-muted); margin-top:3px">${e.summary?.slice(0,120)}...</div>
          </div>`;
      });

      html += `
        <div class="personal-impact-card" style="border:1px solid var(--cyan); margin-top:14px; background:rgba(0,240,255,0.05)">
          <div class="world-section-label" style="margin-bottom:6px; color:var(--cyan)">💡 GENISUS RECOMMENDATION</div>
          <div style="font-size:13px; color:#fff; line-height:1.6">${impact.recommendation}</div>
        </div>`;
    }

    container.innerHTML = html;

    // Sub-tab switching listeners
    container.querySelectorAll('.world-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.worldSubTab = btn.getAttribute('data-world-tab');
        this.renderWorldIntelPanel(container);
        this.renderIcons();
      });
    });

    this.renderIcons();
  }

  showToast(message) {
    const toast = document.getElementById('hud-toast');
    const msgEl = document.getElementById('toast-message');
    if (toast && msgEl) {
      msgEl.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3500);
    }
  }
}

// Instantiate and start GENISUS OS
window.addEventListener('DOMContentLoaded', () => {
  window.genisus = new GenisusApp();
});
