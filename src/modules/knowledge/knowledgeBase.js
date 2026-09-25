export class KnowledgeBase {
  constructor() {
    this.storageKey = 'genisus_knowledge_base_v2';
    this.loadState();
  }

  getDefaultData() {
    return {
      tasks: [
        { id: 'task-1', title: 'Review Pingzo delivery routing algorithm', priority: 'HIGH', due: 'இன்று 4:00 PM', category: 'Pingzo', completed: false },
        { id: 'task-2', title: 'Approve Portfolio Builder template schema', priority: 'HIGH', due: 'இன்று 6:00 PM', category: 'Portfolio', completed: false },
        { id: 'task-3', title: 'Check health telemetry & evening workout', priority: 'MEDIUM', due: 'இன்று 7:30 PM', category: 'Health', completed: false },
        { id: 'task-4', title: 'Audit AWS/GCP cloud billing costs', priority: 'LOW', due: 'நாளை', category: 'Finance', completed: false },
        { id: 'task-5', title: 'Shreeja Ulagam Flutter git cache cleanup', priority: 'HIGH', due: 'இன்று', category: 'Mobile App', completed: false }
      ],
      calendar: [
        { id: 'cal-1', title: 'Pingzo Seller Onboarding Review', time: '11:30 AM', date: 'இன்று', category: 'Engineering', attendees: 'ரமேஷ், டீம்' },
        { id: 'cal-2', title: 'GENISUS Architecture & Tamil Voice Sync', time: '03:00 PM', date: 'இன்று', category: 'AI Systems', attendees: 'சதீஷ்' },
        { id: 'cal-3', title: 'SaaS Pricing & Investor Review', time: '05:30 PM', date: 'இன்று', category: 'Strategy', attendees: 'சுரேஷ், முதலீட்டாளர்கள்' },
        { id: 'cal-4', title: 'BookNowGo Checkout Gateway Testing', time: '10:00 AM', date: 'நாளை', category: 'Product', attendees: 'QA டீம்' }
      ],
      notes: [
        {
          id: 'note-1',
          title: 'போர்ட்ஃபோலியோ பில்டர் டெம்ப்ளேட் திட்டம்',
          content: 'ஆகஸ்ட் 14 முடிவு: Vite மற்றும் React அடிப்படையிலான லைவ் எடிட்டர். டைனமிக் JSON ஸ்கீமா கொண்டு பயனர் ஒரே கிளிக்கில் போர்ட்ஃபோலியோ தளத்தை பப்ளிஷ் செய்ய வழிவகை செய்யப்பட்டுள்ளது.',
          tags: ['portfolio', 'vite', 'react', 'architecture'],
          updatedAt: '2026-08-14'
        },
        {
          id: 'note-2',
          title: 'பிங்சோ ஹைப்பர்லோக்கல் சந்தை கட்டமைப்பு',
          content: 'மூன்று தனித்தனி பிரிவுகள்: பையர் ஆப் (`pingzo-app`), வியாபாரி போர்டல் (`pingzo-seller-portal`), டெலிவரி பார்ட்னர் ஆப் (`pingzo_delivery_app`). ஆர்டர்கள் WebSocket மற்றும் Redis geo-indexing வழியாக உடனுக்குடன் ஒதுக்கப்படும்.',
          tags: ['pingzo', 'hyperlocal', 'redis', 'sockets'],
          updatedAt: '2026-08-28'
        },
        {
          id: 'note-3',
          title: 'ஈமெயில் அவுட்ரீச் பில்லிங் API யோசனைகள்',
          content: 'டெவலப்பர்களுக்கான மீட்டர்டு பில்லிங் API. டெலிவரி ஸ்கோர் 95%-க்கு மேல் உள்ள மின்னஞ்சல்களுக்கு மட்டுமே கட்டணம் வசூலிக்கும் முறை.',
          tags: ['billing', 'saas', 'api'],
          updatedAt: '2026-09-07'
        }
      ],
      documents: [
        {
          id: 'doc-resume-01',
          title: 'Sathish_Lead_Architect_CV.pdf',
          category: 'சான்றிதழ்கள் & ரெஸ்யூமே',
          snippet: 'Principal Systems Architect: Multi-Agent AI Systems, Cloud Microservices, Vite, Three.js, React, Flutter, Python, Java Spring Boot.',
          verified: true,
          confidence: 0.99,
          tags: ['resume', 'experience', 'skills']
        },
        {
          id: 'doc-note-portfolio',
          title: 'Portfolio_Builder_Architecture_Notes.md',
          category: 'திட்ட ஆவணங்கள்',
          snippet: 'Meeting notes on August 14: Finalized decision on template rendering strategy with instant cloud deploy hooks.',
          verified: true,
          confidence: 0.99,
          tags: ['portfolio', 'builder', 'decision', 'architecture']
        },
        {
          id: 'doc-note-pingzo',
          title: 'Pingzo_Marketplace_Spec.md',
          category: 'திட்ட ஆவணங்கள்',
          snippet: 'Pingzo: Hyperlocal commerce solution with Buyer PWA, Merchant Dashboard, and Courier App.',
          verified: true,
          confidence: 0.97,
          tags: ['pingzo', 'ecommerce', 'seller', 'delivery']
        },
        {
          id: 'doc-fin-plan',
          title: 'Q3_2026_Revenue_Targets.xlsx',
          category: 'நிதித் திட்டமிடல்',
          snippet: 'Target: Scale monthly recurring revenue from ₹4.85L to ₹7.5L by Q4. Launching Email Outreach API as self-serve dev tool.',
          verified: true,
          confidence: 0.95,
          tags: ['revenue', 'finances', 'q3', 'targets']
        },
        {
          id: 'doc-writing-enhancer',
          title: 'AI_Writing_Assistant_Enhancer_Architecture.md',
          category: 'AI & NLP கருவிகள்',
          snippet: 'Integrated from ForestStudentView/ai-writing-assistant-enhancer: Real-time content generation, grammar polishing, vocabulary elevation, tone shifting (Jarvis, Executive, Academic, Tamil), and technical documentation generation.',
          verified: true,
          confidence: 0.99,
          tags: ['writing', 'assistant', 'nlp', 'grammar', 'enhancer', 'documentation']
        },
        {
          id: 'doc-jarvis-ecosystem',
          title: 'JARVIS_AI_OpenSource_Ecosystem_Matrix.md',
          category: 'ஆட்டோமேஷன் & AI ஏஜென்ட்கள்',
          snippet: 'Comprehensive index of github.com/topics/jarvis-ai: gia-guar/JARVIS-ChatGPT (Voice & Research Mode), kishanrajput23/Jarvis-Desktop (OS commands & telemetry), akshayaggarwal99/jarvis (macOS automation), CyberVerse (3D HUD), and pocketpaw (Agent command center).',
          verified: true,
          confidence: 0.99,
          tags: ['jarvis', 'voice', 'automation', 'desktop', 'agents', 'telemetry', 'research']
        }
      ],
      notifications: [
        { id: 'notif-1', title: 'திட்ட கெடு (Project Deadline)', message: 'போர்ட்ஃபோலியோ பில்டர் டெம்ப்ளேட் ஸ்கீமா மதிப்பாய்வு இன்று மாலை 6:00 மணிக்கு முடிவடைகிறது.', time: '10 நிமிடங்கள் முன்', read: false, type: 'URGENT' },
        { id: 'notif-2', title: 'புதிய வருவாய் வாய்ப்பு', message: 'ஃப்ரீலான்சர்களுக்கான AI ஜிஎஸ்டி இன்வாய்ஸ் கோபைலட் சந்தை தேவை 94/100 ஆக உயர்ந்துள்ளது.', time: '35 நிமிடங்கள் முன்', read: false, type: 'OPPORTUNITY' },
        { id: 'notif-3', title: 'உடல்நல நினைவூட்டல்', message: 'இன்றைய இலக்கில் இன்னும் 1,580 நடைகள் மீதமுள்ளது. மாலை நடைபயிற்சியை முடிக்கவும்.', time: '1 மணிநேரம் முன்', read: true, type: 'INFO' }
      ]
    };
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.data = JSON.parse(saved);
      } else {
        this.data = this.getDefaultData();
        this.saveState();
      }
    } catch (e) {
      this.data = this.getDefaultData();
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {}
  }

  // Tasks Management
  getTasks() { return this.data.tasks; }
  addTask(titleOrObj, priority = 'MEDIUM', due = 'இன்று', category = 'General') {
    const isObj = typeof titleOrObj === 'object' && titleOrObj !== null;
    const newTask = {
      id: isObj ? (titleOrObj.id || 'task-' + Date.now()) : ('task-' + Date.now()),
      title: isObj ? titleOrObj.title : titleOrObj,
      priority: isObj ? (titleOrObj.priority || priority) : priority,
      due: isObj ? (titleOrObj.due || due) : due,
      category: isObj ? (titleOrObj.category || category) : category,
      completed: isObj ? (titleOrObj.completed || false) : false
    };
    this.data.tasks.unshift(newTask);
    this.saveState();
    return newTask;
  }
  toggleTask(taskId) {
    const t = this.data.tasks.find(x => x.id === taskId);
    if (t) {
      t.completed = !t.completed;
      this.saveState();
      return t;
    }
    return null;
  }
  deleteTask(taskId) {
    this.data.tasks = this.data.tasks.filter(x => x.id !== taskId);
    this.saveState();
  }

  // Calendar Management
  getCalendar() { return this.data.calendar; }
  addCalendarEvent(title, time, date = 'இன்று', category = 'General', attendees = '') {
    const newEvent = {
      id: 'cal-' + Date.now(),
      title,
      time,
      date,
      category,
      attendees
    };
    this.data.calendar.push(newEvent);
    this.saveState();
    return newEvent;
  }
  deleteCalendarEvent(id) {
    this.data.calendar = this.data.calendar.filter(x => x.id !== id);
    this.saveState();
  }

  // Notes Management
  getNotes() { return this.data.notes; }
  addNote(title, content, tags = []) {
    const newNote = {
      id: 'note-' + Date.now(),
      title,
      content,
      tags,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    this.data.notes.unshift(newNote);
    this.saveState();
    return newNote;
  }
  deleteNote(id) {
    this.data.notes = this.data.notes.filter(x => x.id !== id);
    this.saveState();
  }

  // Documents
  getDocuments() { return this.data.documents; }

  // Notifications
  getNotifications() { return this.data.notifications; }
  markAllNotificationsRead() {
    this.data.notifications.forEach(n => n.read = true);
    this.saveState();
  }
  clearNotifications() {
    this.data.notifications = [];
    this.saveState();
  }

  // Unified Semantic RAG across Docs, Notes, Tasks & Calendar
  queryRAG(query) {
    const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
    const results = [];

    // Search Documents
    this.data.documents.forEach(doc => {
      let score = 0;
      const text = (doc.title + ' ' + doc.category + ' ' + doc.snippet + ' ' + (doc.tags || []).join(' ')).toLowerCase();
      tokens.forEach(tok => {
        if (text.includes(tok)) score += 2;
      });
      if (score > 0) {
        results.push({
          type: 'DOCUMENT',
          title: doc.title,
          category: doc.category,
          snippet: doc.snippet,
          confidence: doc.confidence || 0.95,
          score
        });
      }
    });

    // Search Notes
    this.data.notes.forEach(note => {
      let score = 0;
      const text = (note.title + ' ' + note.content + ' ' + (note.tags || []).join(' ')).toLowerCase();
      tokens.forEach(tok => {
        if (text.includes(tok)) score += 2.5;
      });
      if (score > 0) {
        results.push({
          type: 'PERSONAL_NOTE',
          title: note.title,
          category: 'தனிப்பட்ட குறிப்புகள்',
          snippet: note.content,
          confidence: 0.99,
          score
        });
      }
    });

    // Search Tasks
    this.data.tasks.forEach(task => {
      let score = 0;
      const text = (task.title + ' ' + task.category).toLowerCase();
      tokens.forEach(tok => {
        if (text.includes(tok)) score += 1.5;
      });
      if (score > 0) {
        results.push({
          type: 'TASK',
          title: task.title,
          category: `பணி (${task.priority})`,
          snippet: `காலக்கெடு: ${task.due} | நிலை: ${task.completed ? 'முடிந்தது' : 'நிலுவையில்'}`,
          confidence: 0.98,
          score
        });
      }
    });

      results.sort((a, b) => b.score - a.score);
      return results;
    }

  // Section 17 & 7: Knowledge Graph Relationship Engine
  // WORLD TREND ➔ TECHNOLOGY ➔ MARKET ➔ CUSTOMER NEED ➔ PRODUCT OPPORTUNITY ➔ REVENUE MODEL
  queryKnowledgeGraph(entityOrTrend) {
    const e = entityOrTrend.toLowerCase();
    const graphs = [
      {
        trend: 'Agentic AI & Autonomous Coding Systems',
        technology: 'GPT-6 Astra, Multi-Agent Swarms, Tool Calling, Vector RAG',
        market: 'Global Software Engineering & DevOps Automation ($42B)',
        customerNeed: 'Continuous real-time code maintenance, zero-downtime hotfixes, and guided GitHub deployments',
        productOpportunity: 'Autonomous Git & IDE Co-Pilot Operating System (GENISUS)',
        revenueModel: 'Tiered Enterprise SaaS ($49-$299/seat/mo) + Cloud Compute Margin'
      },
      {
        trend: 'Hyperlocal Rapid Grocery & FMCG Commerce',
        technology: 'Flutter Reactive BLoC, WebSockets, Redis Geo-indexing, Neon PostgreSQL',
        market: 'Tier-2 & Tier-3 City Instant Delivery ($18B in India)',
        customerNeed: 'Sub-15 minute neighborhood delivery without aggregator commission gouging',
        productOpportunity: 'PingZO Hyperlocal Merchant & Driver Swarm Network',
        revenueModel: '4% merchant transaction commission + priority slot ads'
      },
      {
        trend: 'Direct-to-Consumer Vernacular E-Commerce',
        technology: 'Flutter Mobile App, Razorpay API, Multilingual UI, Micro-fulfillment',
        market: 'Regional Handloom & Organic Lifestyle Brands',
        customerNeed: 'Culturally grounded shopping experience in native Tamil language with instant checkout',
        productOpportunity: 'Shreeja Ulagam Direct Consumer Mobile Ecosystem',
        revenueModel: 'Direct product retail margins (35-48% gross margin)'
      },
      {
        trend: 'AI-Powered Developer Invoicing & Compliance',
        technology: 'Node.js Express, Neon Postgres, Automated GST Ledgering, Stripe/Razorpay',
        market: 'Indian Tech Freelancers & Remote Software Contractors (3.2M developers)',
        customerNeed: 'Zero-friction compliance invoices with automated payment reminders and TDS tracking',
        productOpportunity: 'Freelance Invoicing & Tax Copilot SaaS',
        revenueModel: 'Freemium (₹499/mo Pro or ₹4,999/yr Lifetime)'
      }
    ];

    const matched = graphs.filter(g =>
      g.trend.toLowerCase().includes(e) ||
      g.technology.toLowerCase().includes(e) ||
      g.market.toLowerCase().includes(e) ||
      g.productOpportunity.toLowerCase().includes(e)
    );

    return matched.length > 0 ? matched : [graphs[0]];
  }

  // Section 17: Relational SQL structured data access
  queryStructuredSQL(table) {
    if (table === 'tasks') return this.data.tasks;
    if (table === 'calendar') return this.data.calendar;
    if (table === 'documents') return this.data.documents;
    return [];
  }
}

export const knowledgeBase = new KnowledgeBase();

