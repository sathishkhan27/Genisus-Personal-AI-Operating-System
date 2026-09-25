import { soundEffects } from '../audio/soundEffects.js';

export class VoiceEngine {
  constructor(options = {}) {
    this.currentLanguage = options.defaultLanguage || 'ta-IN';
    this.isListening = false;
    this.isSpeaking = false;
    this.isContinuousMode = true; // Auto-listen after speech for continuous conversation
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.onResultCallback = options.onResult || (() => {});
    this.onInterimCallback = options.onInterim || (() => {});
    this.onStateChangeCallback = options.onStateChange || (() => {});
    this.onAudioPulseCallback = options.onAudioPulse || (() => {});
    this.restartTimeout = null;
    this.isVoiceBusy = false;

    this.initSpeechRecognition();
    this.initVoices();
  }

  initVoices() {
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
    };
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
    // Chrome and Safari load voices asynchronously
    setTimeout(() => { this.voices = this.synth.getVoices(); }, 800);
    setTimeout(() => { this.voices = this.synth.getVoices(); }, 2000);
  }

  // Pick the most natural, human-sounding voice available on the host OS
  _pickVoice(targetLang, isActualTamilText = false) {
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (isActualTamilText) {
      // 1. Google Tamil or Native Tamil (Valluvar on macOS)
      const tamilVoice = voices.find(v => 
        v.lang.toLowerCase().startsWith('ta') || 
        v.name.toLowerCase().includes('tamil') ||
        v.name.toLowerCase().includes('valluvar')
      );
      if (tamilVoice) return tamilVoice;

      // 2. Indian English voice as natural fallback for Tamil/Tanglish
      const inVoice = voices.find(v => 
        v.lang.toLowerCase().includes('en-in') || 
        v.name.toLowerCase().includes('rishi') || 
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('india')
      );
      if (inVoice) return inVoice;
    }

    // English: High quality natural macOS Siri / Enhanced voices or Google Voices
    // Prioritize natural, premium sounding voices on Mac
    const preferredEnglishVoices = [
      'siri', 'samantha (enhanced)', 'daniel (enhanced)', 'ava (enhanced)',
      'oliver', 'daniel', 'samantha', 'karen', 'tessa', 'moira',
      'google us english', 'google uk english male', 'google uk english female', 'alex'
    ];

    for (const name of preferredEnglishVoices) {
      const match = voices.find(v => v.name.toLowerCase().includes(name));
      if (match) return match;
    }

    // Exact lang match
    const lang = (targetLang || 'en-US').toLowerCase().replace('_', '-');
    let v = voices.find(v => v.lang.toLowerCase().replace('_', '-') === lang);
    if (!v) v = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (!v) v = voices[0];
    return v;
  }

  // Smart Phonetic Wake Word and Query Normalizer (preserves user intent while supporting Tanglish)
  normalizeCommandText(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    // 1. Strip any phonetic variation of GENISUS / JARVIS anywhere at beginning or end
    const wakeWordPattern = /\b(hey\s+|hi\s+|ok\s+|ஹேய்\s+)?(genisus|genesis|jenisis|jenesis|genises|janice|dennis|jarvis|ஜெனீசிஸ்|ஜனிசஸ்|ஜெனசிஸ்|ஜார்விஸ்)\b[,:\s]*/gi;
    text = text.replace(wakeWordPattern, ' ').trim();

    // If only wake word was said, respond with ready greeting
    if (!text || text.length < 2) {
      return 'Genisus status check';
    }

    return text;
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not natively supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.recognition.lang = this.currentLanguage;

    this.recognition.onstart = () => {
      this.isListening = true;
      soundEffects.playMicListeningBeep();
      this.onStateChangeCallback('LISTENING');
    };

    this.recognition.onresult = (event) => {
      if (this.isSpeaking) return;

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          finalTranscript += item[0].transcript;
        } else {
          interimTranscript += item[0].transcript;
        }
      }

      if (interimTranscript) {
        this.onInterimCallback(interimTranscript.trim());
      }

      if (finalTranscript) {
        soundEffects.playAcknowledge();
        const raw = finalTranscript.trim();
        const cleaned = this.normalizeCommandText(raw);
        const detectedLang = this.detectLanguage(cleaned || raw);

        this.onResultCallback({
          transcript: cleaned || raw,
          rawTranscript: raw,
          isFinal: true,
          detectedLanguage: detectedLang
        });
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'not-allowed') {
        this.isListening = false;
        this.isContinuousMode = false;
        this.onStateChangeCallback('IDLE');
      }
    };

    this.recognition.onend = () => {
      if (this.isListening || this.isContinuousMode) {
        if (!this.isSpeaking) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            try {
              if (this.recognition && !this.isSpeaking) {
                this.recognition.start();
                this.isListening = true;
                this.onStateChangeCallback('LISTENING');
              }
            } catch (e) {}
          }, 300);
        }
      } else {
        this.isListening = false;
        this.onStateChangeCallback('IDLE');
      }
    };
  }

  detectLanguage(text) {
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta-IN';
    if (/[\u0900-\u097F]/.test(text)) return 'hi-IN';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn-IN';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml-IN';
    return this.currentLanguage || 'en-US';
  }

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      const wasListening = this.isListening;
      try { this.recognition.abort(); } catch (e) {}
      this.recognition.lang = langCode;
      if (wasListening) {
        setTimeout(() => this.startListening(), 200);
      }
    }
  }

  startListening() {
    if (!this.recognition) return;
    this.isListening = true;
    try {
      this.recognition.start();
    } catch (e) {}
    this.onStateChangeCallback('LISTENING');
  }

  stopListening() {
    this.isListening = false;
    this.isContinuousMode = false;
    clearTimeout(this.restartTimeout);
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    this.onStateChangeCallback('IDLE');
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.isContinuousMode = true;
      this.startListening();
    }
  }

  setContinuousMode(enabled) {
    this.isContinuousMode = enabled;
    if (enabled && !this.isListening) {
      this.startListening();
    } else if (!enabled && this.isListening) {
      this.stopListening();
    }
  }

  /**
   * Cleans text for vocal speech delivery:
   * - Strips code blocks, markdown tables, URLs, diff blocks, and formatting characters
   * - Expands technical acronyms for clear spoken phonetics (API -> A P I, JWT -> J W T)
   * - Limits vocal delivery to a concise, conversational summary so it doesn't drone on
   */
  sanitizeForSpeech(rawText) {
    if (!rawText) return '';
    let t = rawText;

    // 1. Remove Markdown code blocks entirely and replace with natural conversational notice
    t = t.replace(/```[\s\S]*?```/g, ' Code details are displayed on your screen. ');

    // 2. Remove inline code or simplify long paths
    t = t.replace(/`([^`]+)`/g, (match, p1) => {
      if (p1.length > 25 || p1.includes('/') || p1.includes('.')) {
        const file = p1.split('/').pop();
        return file.length > 20 ? 'file' : file;
      }
      return p1;
    });

    // 3. Remove Markdown tables
    t = t.replace(/\|[^\n]+\|/g, ' ');

    // 4. Remove Markdown links [text](url) -> keep text
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // 5. Remove raw URLs
    t = t.replace(/https?:\/\/\S+/g, ' ');

    // 6. Remove diff markers (+, - at start of lines)
    t = t.replace(/^[\+\-]\s+/gm, ' ');

    // 7. Clean up acronyms so the speech engine pronounces them clearly
    t = t.replace(/\bAPI\b/g, 'A P I')
         .replace(/\bJWT\b/g, 'J W T')
         .replace(/\bUI\b/g, 'U I')
         .replace(/\bIDE\b/g, 'I D E')
         .replace(/\bHUD\b/g, 'H U D')
         .replace(/\bPR\b/g, 'Pull Request')
         .replace(/\bCLI\b/g, 'C L I')
         .replace(/\bCSS\b/g, 'C S S')
         .replace(/\bHTML\b/g, 'H T M L')
         .replace(/\bSQL\b/g, 'sequel')
         .replace(/\bDB\b/g, 'database')
         .replace(/\bOAuth\b/g, 'O Auth')
         .replace(/\brepo\b/gi, 'repository');

    // 8. Remove markdown headers, blockquotes, bullet points, horizontal rules, and symbols
    t = t.replace(/^[#>\*\-\+]\s+/gm, ' ');
    t = t.replace(/[#*~_\[\]()<>{}|\\^=]/g, ' ');
    t = t.replace(/---/g, ' ');

    // 9. Clean up whitespace
    t = t.replace(/\s+/g, ' ').trim();

    // 10. Natural conversational brevity:
    // If the text is a multi-paragraph technical dump, speak the top 2 concise sentences (up to 240 chars)
    const sentences = t.match(/[^.!?]+[.!?]+/g);
    if (sentences && sentences.length > 2) {
      const brief = sentences.slice(0, 2).join(' ').trim();
      if (brief.length > 40) {
        return brief;
      }
    }

    if (t.length > 260) {
      const sub = t.substring(0, 260);
      const lastPeriod = Math.max(sub.lastIndexOf('.'), sub.lastIndexOf('!'), sub.lastIndexOf('?'));
      if (lastPeriod > 70) {
        return sub.substring(0, lastPeriod + 1).trim();
      }
      return sub.trim() + '...';
    }

    return t;
  }

  // Tuned Speech Synthesis with natural cadence, high clarity, and zero audio masking
  speak(text, lang = null) {
    if (!text) return;
    this.interrupt();

    try { if (this.recognition) this.recognition.abort(); } catch (e) {}

    // CRITICAL: Determine true vocal language from actual text characters
    const hasTamilCharacters = /[\u0B80-\u0BFF]/.test(text);
    const targetLang = hasTamilCharacters ? 'ta-IN' : (lang && !lang.startsWith('ta') ? lang : 'en-US');
    const isTamil = hasTamilCharacters;

    // Sanitize speech text (strip code, tables, symbols, and acronyms)
    const cleanSpeech = this.sanitizeForSpeech(text);
    if (!cleanSpeech) return;

    // Chunk by sentence boundaries for natural human cadence
    const sentences = cleanSpeech.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanSpeech];

    const voice = this._pickVoice(targetLang, isTamil);

    let currentIdx = 0;
    this.isSpeaking = true;
    // NOTE: Removed soundEffects.playArcReactorHum() because the 65Hz sub-bass oscillator
    // drowned out the assistant's voice and made the speech sound muffled!
    this.onStateChangeCallback('SPEAKING');
    this.simulateSpeechAudioPulse();

    const speakNextSentence = () => {
      if (currentIdx >= sentences.length || !this.isSpeaking) {
        this.isSpeaking = false;
        this.onAudioPulseCallback(0);
        if (this.isContinuousMode) {
          setTimeout(() => {
            if (!this.isSpeaking && this.isContinuousMode) {
              try {
                this.recognition.start();
                this.isListening = true;
                this.onStateChangeCallback('LISTENING');
              } catch (e) {
                this.isListening = true;
                this.onStateChangeCallback('LISTENING');
              }
            }
          }, 350);
        } else {
          this.onStateChangeCallback('IDLE');
        }
        return;
      }

      const sentenceText = sentences[currentIdx].trim();
      currentIdx++;

      if (!sentenceText) {
        speakNextSentence();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = targetLang;
      // High-clarity vocal speed & natural human pitch
      utterance.rate = isTamil ? 1.0 : 1.02;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }

      utterance.onend = () => {
        setTimeout(speakNextSentence, 50);
      };

      utterance.onerror = (e) => {
        console.warn('Speech utterance notice:', e);
        speakNextSentence();
      };

      this.synth.speak(utterance);
    };

    if (this.synth.getVoices().length === 0) {
      setTimeout(speakNextSentence, 500);
    } else {
      speakNextSentence();
    }
  }

  simulateSpeechAudioPulse() {
    if (!this.isSpeaking) return;
    const pulse = Math.random() * 0.7 + 0.3;
    this.onAudioPulseCallback(pulse);
    setTimeout(() => {
      if (this.isSpeaking) {
        this.simulateSpeechAudioPulse();
      } else {
        this.onAudioPulseCallback(0);
      }
    }, 120);
  }

  interrupt() {
    if (this.isSpeaking) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.onAudioPulseCallback(0);
      if (this.isContinuousMode) {
        setTimeout(() => this.startListening(), 200);
      } else {
        this.onStateChangeCallback('IDLE');
      }
    }
  }
}
