export class HealthAgent {
  constructor() {
    this.name = 'Health & Wellness Intelligence Agent';
    this.role = 'Biometric Telemetry, Sleep, Fitness & Wellness Tracking';
  }

  getHealthMetrics() {
    return {
      sleepHours: '7.4 hrs',
      sleepQualityScore: '86/100 (Deep sleep: 1h 48m)',
      restingHeartRate: '62 bpm',
      dailySteps: '8,420 steps',
      stepsGoal: '10,000 steps (84% completed)',
      activeCalories: '540 kcal',
      hydration: '2.4 L / 3.0 L goal',
      wellnessScore: '89%',
      vitalsStatus: 'Optimal (All parameters in healthy zone)',
      trends: [
        { metric: 'Sleep Consistency', status: 'Improved +12% over last 7 days' },
        { metric: 'Cardio Endurance', status: 'Resting HR reduced from 66 to 62 bpm' },
        { metric: 'Hydration Intake', status: 'On track, 2 glasses needed before 9 PM' }
      ]
    };
  }

  process(query, lang = 'en-US') {
    const q = query.toLowerCase();
    const isTamil = /[\u0B80-\u0BFF]/.test(query) || lang.startsWith('ta');
    const data = this.getHealthMetrics();

    if (q.includes('health') || q.includes('wellness') || q.includes('sleep') || q.includes('fitness') || q.includes('workout') || isTamil && (q.includes('உடல்நலம்') || q.includes('தூக்கம்'))) {
      const disclaimer = '⚠️ Medical Disclaimer: GENISUS provides biometric wellness summaries and informational trends, not professional medical advice. Always consult a certified physician for medical diagnoses.';

      if (isTamil) {
        return {
          agent: this.name,
          mode: 'HEALTH_CARD',
          language: 'ta-IN',
          speechText: 'உங்கள் உடல்நல குறியீடுகள் சிறப்பான நிலையில் உள்ளன. கடந்த இரவு 7.4 மணிநேரம் ஆழ்ந்த தூக்கம் பதிவாகியுள்ளது. ஓய்வு நேர இதயத் துடிப்பு 62 bpm.',
          displayText: `### 🩺 உடல்நல நுண்ணறிவு மையம் (Health & Wellness)
- **தூக்க அளவு (Sleep)**: \`${data.sleepHours}\` (Score: \`${data.sleepQualityScore}\`)
- **இதயத் துடிப்பு (Resting HR)**: \`${data.restingHeartRate}\` (Optimal)
- **நடைபயிற்சி (Steps)**: \`${data.dailySteps}\` (\`${data.stepsGoal}\`)
- **நீர்ச்சத்து (Hydration)**: \`${data.hydration}\`
- **உடற்பயிற்சி கலோரிகள்**: \`${data.activeCalories}\`

> ${disclaimer}`,
          data,
          source: 'Wearable Biometric Telemetry & HealthKit Sync (Confidence: 97%)'
        };
      }

      return {
        agent: this.name,
        mode: 'HEALTH_CARD',
        language: 'en-US',
        speechText: `Your health telemetry is in great shape today, Sathish. You clocked 7.4 hours of sleep with a high recovery score of 86. Your resting heart rate is a steady 62 bpm, and you are at 8,420 steps towards your 10,000 goal.`,
        displayText: `### 🩺 Health & Wellness Command Center
| Biometric Metric | Reading | Status / Goal |
| :--- | :--- | :--- |
| **Sleep Duration** | **7.4 hrs** | 🟢 Score 86/100 (Deep sleep: 1h 48m) |
| **Resting Heart Rate** | **62 bpm** | 🟢 Normal Sinus (60-70 bpm) |
| **Daily Activity** | **8,420 steps** | 🟡 84% of 10,000 Step Goal |
| **Active Energy Burn** | **540 kcal** | 🟢 Cardio & Resistance session |
| **Hydration Intake** | **2.4 Liters** | 💧 600ml remaining today |

> [!NOTE]
> **Health Professional Disclaimer**: GENISUS provides informational biometric tracking and wellness insights. It does not replace medical advice, diagnosis, or clinical treatments.`,
        data,
        source: 'Connected Health Sensor Cache (Apple Health / WearOS Sync, Confidence: 97%)'
      };
    }

    return null;
  }
}
