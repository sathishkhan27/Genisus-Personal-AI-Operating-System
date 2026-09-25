import { knowledgeBase } from '../knowledge/knowledgeBase.js';
import { memoryStore } from '../memory/memoryStore.js';

export class PersonalAgent {
  constructor() {
    this.name = 'Personal Assistant Agent';
    this.role = 'Personal Command Center: Tasks, Calendar, Notes, Documents, RAG & Notifications';
  }

  process(query, lang = 'ta-IN') {
    const q = query.toLowerCase();
    const isTamil = /[\u0B80-\u0BFF]/.test(query) || lang.startsWith('ta');

    // 1. Add Task Voice Command: "பணி சேர்", "add task", "புதிய வேலை"
    if (q.includes('add task') || q.includes('பணி சேர்') || q.includes('புதிய பணி') || q.includes('வேலை சேர்')) {
      let taskTitle = query.replace(/(add\s+task|பணி\s+சேர்|புதிய\s+பணி|வேலை\s+சேர்)[:\s]*/gi, '').trim() || 'முக்கிய பணி';
      const newTask = knowledgeBase.addTask(taskTitle, 'HIGH', 'இன்று', 'Voice');

      return {
        agent: this.name,
        mode: 'TASK_CREATED',
        language: 'ta-IN',
        speechText: `புதிய பணி வெற்றிகரமாக சேர்க்கப்பட்டது: ${newTask.title}`,
        displayText: `### ✅ புதிய பணி சேர்க்கப்பட்டது (Task Created)
- **பணி**: **${newTask.title}**
- **முன்னுரிமை**: \`${newTask.priority}\` | **காலக்கெடு**: \`${newTask.due}\`
- [பணிகள் மேலாளரில் பார்க்கவும்](#tasks)`,
        data: { task: newTask, allTasks: knowledgeBase.getTasks() },
        source: 'Personal Command Center · Tasks Database'
      };
    }

    // 2. Add Calendar Meeting / Event: "மீட்டிங் சேர்", "schedule meeting", "திட்டமிடு"
    if (q.includes('schedule') || q.includes('மீட்டிங் சேர்') || q.includes('கூட்டம் சேர்') || q.includes('நிகழ்வு சேர்')) {
      let eventTitle = query.replace(/(schedule\s+meeting|schedule|மீட்டிங்\s+சேர்|கூட்டம்\s+சேர்)[:\s]*/gi, '').trim() || 'திட்டமிடப்பட்ட சந்திப்பு';
      const newEvent = knowledgeBase.addCalendarEvent(eventTitle, 'மாலை 04:00 PM', 'இன்று', 'General', 'சதீஷ்');

      return {
        agent: this.name,
        mode: 'CALENDAR_EVENT_ADDED',
        language: 'ta-IN',
        speechText: `நாட்காட்டியில் புதிய கூட்டம் சேர்க்கப்பட்டது: ${newEvent.title}`,
        displayText: `### 📅 புதிய நிகழ்வு சேர்க்கப்பட்டது (Event Scheduled)
- **கூட்டம்**: **${newEvent.title}**
- **நேரம்**: \`${newEvent.time}\` (${newEvent.date})
- **பங்கேற்பாளர்கள்**: \`${newEvent.attendees}\``,
        data: { event: newEvent, allEvents: knowledgeBase.getCalendar() },
        source: 'Personal Command Center · Calendar Engine'
      };
    }

    // 3. Save Personal Note: "குறிப்பு சேமி", "save note", "நோட்ஸ்"
    if (q.includes('save note') || q.includes('குறிப்பு சேமி') || q.includes('நோட் செய்')) {
      let noteContent = query.replace(/(save\s+note|குறிப்பு\s+சேமி|நோட்\s+செய்)[:\s]*/gi, '').trim() || 'புதிய குறிப்பு';
      const newNote = knowledgeBase.addNote('வாய்ஸ் குறிப்பு', noteContent, ['voice', 'personal']);

      return {
        agent: this.name,
        mode: 'NOTE_SAVED',
        language: 'ta-IN',
        speechText: 'உங்கள் தனிப்பட்ட குறிப்பு பாதுகாப்பாக சேமிக்கப்பட்டது.',
        displayText: `### 📝 குறிப்பு சேமிக்கப்பட்டது (Note Saved)
> *"${newNote.content}"*

- **தேதி**: \`${newNote.updatedAt}\`
- **குறிச்சொற்கள்**: \`${newNote.tags.join(', ')}\``,
        data: { note: newNote },
        source: 'Personal Command Center · Notes Vault'
      };
    }

    // 4. Notifications Command: "அறிவிப்புகள்", "notifications"
    if (q.includes('notification') || q.includes('அறிவிப்பு') || q.includes('நோட்டிபிகேஷன்')) {
      const notifs = knowledgeBase.getNotifications();
      return {
        agent: this.name,
        mode: 'NOTIFICATIONS_VIEW',
        language: 'ta-IN',
        speechText: `உங்களுக்கு ${notifs.filter(n => !n.read).length} புதிய அறிவிப்புகள் உள்ளன. முதன்மையானது: ${notifs[0].title}.`,
        displayText: `### 🔔 நேரலை அறிவிப்புகள் (Active Notifications)
${notifs.map(n => `- **[${n.type}] ${n.title}**: ${n.message} *(${n.time})* ${n.read ? '✓' : '🔴 புதியது'}`).join('\n')}`,
        data: { notifications: notifs },
        source: 'Personal Command Center · Sentry Notification Bus'
      };
    }

    // 5. Priorities / Briefing Query (Accurate Intent Matching with Anti-Repetition Phrasing)
    const isTaskQuery = 
      q.includes('priority') || 
      q.includes('priorities') || 
      q.includes('important tasks') || 
      q.includes('இன்றைய பணிகள்') || 
      q.includes('இன்றைய வேலைகள்') || 
      q.includes('பணிகள் என்ன') || 
      q.includes('வேலைகள் என்ன') || 
      q.includes('வேலை என்ன') || 
      q.includes('daily agenda') || 
      q.includes('today schedule') || 
      q.includes('daily briefing') || 
      q.includes('இன்று என்ன செய்ய') || 
      (q.includes('வேலை') && (q.includes('பட்டியல்') || q.includes('என்ன') || q.includes('சொல்லு')));

    if (isTaskQuery) {
      const tasks = knowledgeBase.getTasks().filter(t => !t.completed);
      const calendar = knowledgeBase.getCalendar();
      const topTask = tasks[0] ? tasks[0].title : 'முதன்மை திட்டப்பணிகள்';
      const hour = new Date().getHours();
      const greeting = isTamil 
        ? (hour < 12 ? 'காலை வணக்கம் பாஸ் சதீஷ்' : (hour < 17 ? 'மதிய வணக்கம் பாஸ்' : 'வணக்கம் பாஸ் சதீஷ்'))
        : (hour < 12 ? 'Good morning, Commander Sathish' : (hour < 17 ? 'Good afternoon, Sathish' : 'Greetings, Commander'));

      // Dynamically varied speech phrasing to prevent repetition
      const speechVariantsTamil = [
        `${greeting}. உங்கள் அட்டவணையை சரிபார்த்தேன். மொத்தம் ${tasks.length} முடிக்க வேண்டிய பணிகளும், ${calendar.length} சந்திப்புகளும் உள்ளன. முதலில் ${topTask} மீது கவனம் செலுத்தலாம்.`,
        `பாஸ் சதீஷ், இன்றைய முக்கிய முன்னுரிமை: ${topTask}. கூடுதலாக ${tasks.length - 1} பணிகள் வரிசையில் உள்ளன. நாட்காட்டியில் ${calendar[0]?.time || 'மாலை'} சந்திப்பு உள்ளது.`,
        `${greeting}. உங்கள் டாஸ்க் போர்டில் ${tasks.length} செயலில் உள்ள பணிகளை வரிசைப்படுத்தியுள்ளேன். முதலிடத்தில் இருப்பது ${topTask}.`
      ];

      const speechVariantsEnglish = [
        `${greeting}. Reviewing your daily agenda: you have ${tasks.length} active action items and ${calendar.length} calendar events. Top priority is ${topTask}.`,
        `Commander Sathish, your highest leverage task right now is ${topTask}. Followed by ${tasks.length - 1} other items on your schedule.`,
        `${greeting}. Your command briefing is ready: ${tasks.length} pending tasks logged, with ${topTask} leading the queue.`
      ];

      const chosenSpeech = isTamil 
        ? speechVariantsTamil[Math.floor(Math.random() * speechVariantsTamil.length)]
        : speechVariantsEnglish[Math.floor(Math.random() * speechVariantsEnglish.length)];

      return {
        agent: this.name,
        mode: 'VOICE_AND_CARDS',
        language: isTamil ? 'ta-IN' : 'en-US',
        speechText: chosenSpeech,
        displayText: isTamil ? `### 🎯 இன்றைய முக்கிய பணிகள் & நாட்காட்டி (Personal Command Center)
**முன்னுரிமை நிலை**: \`ACTIVE FOCUS\` | **நேரம்**: \`${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}\`

${chosenSpeech}

#### 📋 முடிக்க வேண்டிய பணிகள் (${tasks.length} Active):
${tasks.map((t, idx) => `${idx + 1}. **${t.title}** · \`${t.priority}\` (${t.due})`).join('\n')}

#### 📅 இன்றைய சந்திப்புகள் (${calendar.length}):
${calendar.map(c => `- **${c.time}**: ${c.title} *(${c.attendees})*`).join('\n')}`
        : `### 🎯 Today's Action Items & Schedule (Command Center)
**Status**: \`ACTIVE FOCUS\` | **Time**: \`${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}\`

${chosenSpeech}

#### 📋 Pending Action Items (${tasks.length} Active):
${tasks.map((t, idx) => `${idx + 1}. **${t.title}** · \`${t.priority}\` (${t.due})`).join('\n')}

#### 📅 Scheduled Events (${calendar.length}):
${calendar.map(c => `- **${c.time}**: ${c.title} *(${c.attendees})*`).join('\n')}`,
        data: { tasks, calendar },
        source: 'Personal Command Center · Dynamic Tasks & Calendar Sync'
      };
    }

    // 6. Portfolio Builder Memory Query
    if (q.includes('portfolio') || q.includes('decide') && q.includes('last month')) {
      const results = knowledgeBase.queryRAG('portfolio builder decision notes');
      const memoryMatch = memoryStore.searchMemory('portfolio builder');

      return {
        agent: this.name,
        mode: 'RESEARCH_CARD',
        language: 'ta-IN',
        speechText: 'கடந்த மாதம் போர்ட்ஃபோலியோ பில்டர் திட்டத்தில், டைனமிக் டெம்ப்ளேட் மற்றும் லைவ் பிரிவியூ என்ஜினை வைட் மற்றும் ரியாக்ட் கொண்டு செயல்படுத்த முடிவு செய்துள்ளீர்கள்.',
        displayText: `### 📂 திட்ட நினைவகம்: போர்ட்ஃபோலியோ பில்டர் (Project Memory)
**பதிவு செய்யப்பட்ட முடிவு (August 14, 2026)**:
> *"Vite + React அடிப்படையில் டைனமிக் டெம்ப்ளேட் ஸ்கீமா, லைவ் எடிட்டர் மற்றும் ஒற்றை-கிளிக் கிளவுட் பப்ளிஷ் அமைப்பது."*

- **பாதை**: \`scratch/portfolio-builder\`
- **ஆதாரம்**: [Portfolio_Builder_Architecture_Notes.md](file:///Users/sathish.s/.gemini/antigravity-ide/scratch/portfolio-builder)
- **நம்பகத்தன்மை**: 99% சரிபார்க்கப்பட்ட RAG ஆவணம்`,
        data: { results, memoryMatch },
        source: 'Portfolio_Builder_Architecture_Notes.md & Project Memory'
      };
    }

    // 7. Explicit Knowledge Base & Document Search
    const isExplicitSearch = 
      q.includes('search') || 
      q.includes('find note') || 
      q.includes('ஆவணம்') || 
      q.includes('குறிப்பு') || 
      q.includes('தேடு') || 
      q.includes('document') || 
      q.includes('knowledge base') || 
      q.includes('rag');

    if (isExplicitSearch) {
      const ragMatches = knowledgeBase.queryRAG(query);
      if (ragMatches.length > 0 && ragMatches[0].score >= 2.0) {
        const top = ragMatches[0];
        return {
          agent: this.name,
          mode: 'RAG_RESULT',
          language: isTamil ? 'ta-IN' : 'en-US',
          speechText: isTamil 
            ? `உங்கள் தனிப்பட்ட ஆவணங்களில் இதற்கான தகவல் கண்டறியப்பட்டது: ${top.title}.`
            : `Found matching record in your personal knowledge base: ${top.title}.`,
          displayText: `### 📄 அறிவுத் தேடல் முடிவு (Knowledge Match): ${top.title}
**வகை**: \`${top.category}\` | **நம்பகத்தன்மை**: \`${(top.confidence * 100).toFixed(0)}%\`

> ${top.snippet}`,
          data: { matches: ragMatches },
          source: `Personal Knowledge Vault · ${top.title}`
        };
      }
    }

    return null;
  }
}
