// GENISUS Development Memory System
// Stores project-specific architecture decisions, tech stacks, coding conventions,
// resolved bug histories, and technical debt.

class DevMemory {
  constructor() {
    this.storageKey = 'genisus_dev_memory';
    this.projects = {
      'genisus-os': {
        name: 'GENISUS AI Operating System',
        repo: 'genisus-os',
        language: 'JavaScript / HTML5 / CSS3',
        framework: 'Vanilla Modern ES6+ / Three.js / Web Speech API / Vite',
        architecture: 'Modular Agentic Orchestration with 3D Holographic Rendering and Zero-Overflow Fit-Screen HUD',
        stateManagement: 'Event-driven pub/sub with Reactive Memory Store',
        apiConventions: 'Async/await with fallback mock resilience, Neon DB PostgreSQL, REST APIs',
        codingStandards: [
          'Strict 100vh fit-screen view with zero page-level window scrolling',
          'Rich sci-fi cyber HUD styling with neon accents and high contrast',
          'Bi-directional Tamil & English voice synthesis and recognition',
          'Zero silent commits or pushes - human-in-the-loop confirmation gate required'
        ],
        recentDecisions: [
          { date: '2026-09-12', decision: 'Upgraded 3D Arc Reactor Hologram to 3,400 particle density with camera z=5.0' },
          { date: '2026-09-12', decision: 'Enlarged dialogue transcript to 15.5px and live speech capsule for high-resolution displays' },
          { date: '2026-09-12', decision: 'Replaced test data with real-time GitHub REST API and Neon cloud database feeds' }
        ],
        resolvedBugs: [
          { issue: 'Dialogue transcript clipping on 100vh viewport', fix: 'Flexible flex-grow min-height: 0 with internal scrollbar' },
          { issue: 'Tamil voice accent pronunciation tuning', fix: 'Phonetic transliteration fallback and rate 0.95 adjustment' }
        ],
        techDebt: [
          'Introduce offline WebWorker for heavy 3D matrix math',
          'Add Service Worker caching for instant offline boots'
        ]
      },
      'PingZO-Delivery-App': {
        name: 'PingZO Delivery Mobile Application',
        repo: 'PingZO-Delivery-App',
        language: 'Flutter / Dart',
        framework: 'Flutter SDK 3.22+, Dart 3.4+',
        architecture: 'Clean Architecture with BLoC Pattern (Presentation, Domain, Data)',
        stateManagement: 'flutter_bloc with Freezed sealed state unions',
        apiConventions: 'Dio REST client with JWT refresh interceptors and WebSocket stream subscription',
        codingStandards: [
          'Effective Dart: style guide compliance and pedantic analysis rules',
          'Explicit memory disposal in StateNotifier and StreamSubscription',
          'DistinctUntilChanged debouncing on GPS location streaming'
        ],
        recentDecisions: [
          { date: '2026-09-08', decision: 'Migrated driver live geolocation tracking from polling to WebSocket keep-alive' },
          { date: '2026-09-10', decision: 'Enforced exponential backoff reconnection on cellular handoffs' }
        ],
        resolvedBugs: [
          { issue: 'WebSocket reconnection leak on 4G to Wi-Fi roaming', fix: 'Exponential backoff connection guard + KeepAlive ping (30s)' },
          { issue: 'Null safety assertion in unassigned batch order handler', fix: 'Null-check fallback with defensive Option pattern' }
        ],
        techDebt: [
          'Upgrade to Google Maps Flutter v3 renderer',
          'Migrate battery-sensitive GPS tracking to WorkManager background service'
        ]
      },
      'PingZo-Customer-Mobile-App': {
        name: 'PingZO Customer E-Commerce App',
        repo: 'PingZo-Customer-Mobile-App',
        language: 'Flutter / Dart',
        framework: 'Flutter SDK 3.22+, Material 3',
        architecture: 'Feature-first layered architecture',
        stateManagement: 'Riverpod / flutter_bloc for cart and checkout',
        apiConventions: 'GraphQL + REST hybrid with offline-first Hive caching',
        codingStandards: [
          'Strict image cache eviction with memCacheHeight constraint (300px)',
          'Double-tap debounce on checkout and cart mutations',
          'Razorpay / Stripe payment gateway callback safety'
        ],
        recentDecisions: [
          { date: '2026-09-05', decision: 'Enabled local disk caching with memory bounding for fast category scrolling' },
          { date: '2026-09-09', decision: 'Added instant OCR barcode scanner for physical store price comparison' }
        ],
        resolvedBugs: [
          { issue: 'Image memory cache exhaustion during fast catalog scrolling', fix: 'Eviction policy with memCacheHeight constraint (300px)' },
          { issue: 'Double tap debounce absent in rapid quantity increment', fix: 'Async mutex lock on cart sync mutation' }
        ],
        techDebt: [
          'Optimize initial app bundle size via deferred component loading',
          'Add automated end-to-end integration tests with Patrol'
        ]
      },
      'gstechnology': {
        name: 'GS Technology Corporate Platform',
        repo: 'gstechnology',
        language: 'TypeScript / React',
        framework: 'React 18 / Next.js / Tailwind CSS',
        architecture: 'Server-side rendered Jamstack with Edge API routes',
        stateManagement: 'Zustand + React Query (TanStack)',
        apiConventions: 'REST OpenAPI 3.0 specs with strict Zod validation',
        codingStandards: [
          'Accessibility (WCAG AA) compliant color contrasts and ARIA landmarks',
          'Next/image optimization with WebP/AVIF auto-conversions',
          'Zero unhandled promise rejections in analytics beacon dispatches'
        ],
        recentDecisions: [
          { date: '2026-08-20', decision: 'Integrated Tailwind v3 JIT compiler' },
          { date: '2026-09-01', decision: 'Deployed automated Web Vitals performance monitoring' }
        ],
        resolvedBugs: [
          { issue: 'Performance observer resource timing unhandled rejection', fix: 'Try-catch isolation around web vital beacon dispatch' }
        ],
        techDebt: [
          'Migrate remaining legacy components to Server Components',
          'Setup Playwright cross-browser visual regression testing'
        ]
      },
      'shreeja_ulagam_mobile_app': {
        name: 'Shreeja Ulagam Community & Retail App',
        repo: 'shreeja_ulagam_mobile_app',
        language: 'Flutter / Dart',
        framework: 'Flutter SDK / Firebase',
        architecture: 'MVC with Provider state management',
        stateManagement: 'ChangeNotifierProvider',
        apiConventions: 'Cloud Firestore & Firebase Cloud Functions',
        codingStandards: [
          'Android 14 high-priority notification channel declaration',
          'Multi-lingual Tamil font bundling and asset pre-caching'
        ],
        recentDecisions: [
          { date: '2026-08-15', decision: 'Implemented FCM push notifications with custom sound alerts' }
        ],
        resolvedBugs: [
          { issue: 'FCM push notification channel ID mismatch on Android 14', fix: 'Declared high-priority notification channel in MainActivity' }
        ],
        techDebt: [
          'Refactor state management from Provider to Riverpod for better testing'
        ]
      }
    };

    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.projects = { ...this.projects, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load dev memory from localStorage', e);
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
    } catch (e) {
      console.warn('Could not save dev memory to localStorage', e);
    }
  }

  getProject(projectId) {
    return this.projects[projectId] || this.projects['genisus-os'];
  }

  getAllProjects() {
    return Object.keys(this.projects).map(key => ({
      id: key,
      ...this.projects[key]
    }));
  }

  recordDecision(projectId, decisionText) {
    const proj = this.getProject(projectId);
    if (proj) {
      const entry = {
        date: new Date().toISOString().split('T')[0],
        decision: decisionText
      };
      proj.recentDecisions.unshift(entry);
      if (proj.recentDecisions.length > 10) proj.recentDecisions.pop();
      this.saveToStorage();
    }
  }

  recordResolvedBug(projectId, issue, fix) {
    const proj = this.getProject(projectId);
    if (proj) {
      proj.resolvedBugs.unshift({ issue, fix, date: new Date().toISOString().split('T')[0] });
      if (proj.resolvedBugs.length > 10) proj.resolvedBugs.pop();
      this.saveToStorage();
    }
  }

  getArchitectureSummary(projectId) {
    const p = this.getProject(projectId);
    return `### 🏛️ ${p.name} Architecture Memory
* **Language & Runtime**: ${p.language}
* **Framework**: ${p.framework}
* **Core Architecture**: ${p.architecture}
* **State Management**: ${p.stateManagement}
* **API Standards**: ${p.apiConventions}
* **Coding Standards**:
${p.codingStandards.map(s => `  * ${s}`).join('\n')}
* **Key Resolved Bugs & Learned Fixes**:
${p.resolvedBugs.map(b => `  * *${b.issue}* ➔ **Fix**: \`${b.fix}\``).join('\n')}
* **Known Technical Debt**:
${p.techDebt.map(t => `  * ⚠️ ${t}`).join('\n')}`;
  }
}

export const devMemory = new DevMemory();
