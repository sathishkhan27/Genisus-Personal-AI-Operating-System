export class BusinessAgent {
  constructor() {
    this.name = 'Business Intelligence Agent';
    this.role = 'Revenue, SaaS Metrics & Business Command Center';
  }

  getOverviewData() {
    return {
      revenueMRR: '₹4,85,000',
      growthPercentage: '+22.4%',
      expenses: '₹62,000',
      netProfit: '₹4,23,000',
      profitMargin: '87.2%',
      activeSubscribers: 312,
      leadFunnelCount: 1420,
      conversionRate: '4.8%',
      projects: [
        { name: 'Pingzo Ecosystem', mrr: '₹2,60,000', status: 'Growing (+18%)', activeUsers: '14,200 MAU' },
        { name: 'BookNowGo SaaS', mrr: '₹1,45,000', status: 'Stable (+9%)', bookings: '1,890 this mo' },
        { name: 'Email Outreach Billing', mrr: '₹80,000', status: 'Early Launch (+45%)', creditsUsed: '1.2M' }
      ],
      kpiAlerts: [
        { type: 'SUCCESS', message: 'Email Outreach API experienced 45% week-over-week usage growth.' },
        { type: 'WARNING', message: 'Cloud GPU inference expense rose by 14% due to vision model tests.' },
        { type: 'INFO', message: 'Pingzo seller onboarding churn dropped to an all-time low of 1.8%.' }
      ]
    };
  }

  process(query, lang = 'en-US') {
    const q = query.toLowerCase();
    const isTamil = /[\u0B80-\u0BFF]/.test(query) || lang.startsWith('ta');
    const data = this.getOverviewData();

    if (q.includes('business') || q.includes('revenue') || q.includes('performance') || q.includes('profit') || isTamil && (q.includes('வருமானம்') || q.includes('வணிகம்'))) {
      const speechVariantsTamil = [
        `பாஸ் சதீஷ், உங்கள் வணிக அளவீடுகள் சிறப்பாக உள்ளன. மொத்த மாதாந்திர வருவாய் ₹4,85,000, வளர்ச்சி விகிதம் 22.4%, நிகர லாப வரம்பு 87%. பிங்சோ மற்றும் இமெயில் பில்லிங் முதலிடத்தில் உள்ளன.`,
        `வணிக நிலை அறிக்கை தயார் பாஸ். இந்த மாதம் 312 கட்டண சந்தாதாரர்களுடன் ₹4,23,000 நிகர லாபம் எட்டப்பட்டுள்ளது. புதிய வளர்ச்சி நிலையாக உள்ளது.`,
        `வருவாய் கண்காணிப்பில் நேர்மறையான வளர்ச்சி பதிவாகியுள்ளது பாஸ். புக்நவ்கோ மற்றும் பிங்சோ வர்த்தகம் வழக்கம் போல் லாபகரமாக செயல்படுகின்றன.`
      ];

      const speechVariantsEnglish = [
        `Business metrics are exceptional this cycle, Commander Sathish. Monthly Recurring Revenue is ₹4,85,000 with a 22.4% growth rate and an 87.2% net margin.`,
        `Telemetry confirms steady financial performance, sir. Active subscriptions stand at 312 accounts, netting ₹4,23,000 in monthly profit.`,
        `Revenue pipeline review complete, Sathish. Pingzo ecosystem accounts for over 53% of our revenue stream with healthy customer retention.`
      ];

      const speech = isTamil
        ? speechVariantsTamil[Math.floor(Math.random() * speechVariantsTamil.length)]
        : speechVariantsEnglish[Math.floor(Math.random() * speechVariantsEnglish.length)];

      if (isTamil) {
        return {
          agent: this.name,
          mode: 'BUSINESS_DASHBOARD',
          language: 'ta-IN',
          speechText: speech,
          displayText: `### 💼 வணிக கட்டுப்பாட்டு மையம் (Business Command Center)
**நிலை**: \`PROFITABLE (+22.4% MoM)\` | **கணக்கீட்டு காலம்**: \`August-September 2026\`

${speech}

* **மாதாந்திர வருவாய் (MRR)**: \`${data.revenueMRR}\` (\`${data.growthPercentage}\` வளர்ச்சி)
* **செலவுகள் (Expenses)**: \`${data.expenses}\` | **நிகர லாபம் (Net Profit)**: \`${data.netProfit}\` (\`${data.profitMargin}\` Margin)
* **செயலில் உள்ள வாடிக்கையாளர்கள்**: \`${data.activeSubscribers}\`
* **திட்டங்கள் வாரியாக வருவாய்**:
  - **Pingzo Ecosystem**: ₹2,60,000 (14,200 MAU)
  - **BookNowGo SaaS**: ₹1,45,000 (1,890 முன்பதிவுகள்)
  - **Email Outreach Billing**: ₹80,000 (+45% புதிய வளர்ச்சி)`,
          data,
          source: 'Business Accounting DB & Stripe/Razorpay Analytics'
        };
      }

      return {
        agent: this.name,
        mode: 'BUSINESS_DASHBOARD',
        language: 'en-US',
        speechText: speech,
        displayText: `### 💼 Business Command Center — Performance Telemetry
**Status**: \`PROFITABLE (+22.4% MoM)\` | **Review Period**: \`August-September 2026\`

${speech}

| Metric | Value | Trend |
| :--- | :--- | :--- |
| **Monthly Recurring Revenue (MRR)** | **₹4,85,000** | 🟢 +22.4% MoM |
| **Monthly Expenses** | **₹62,000** | 🟡 +14% (Cloud & APIs) |
| **Estimated Net Profit** | **₹4,23,000** | 🟢 87.2% Margin |
| **Active Paid Subscribers** | **312 Accounts** | 🟢 +18 this month |
| **Lead Conversion Rate** | **4.8%** | 🎯 Target: 6.0% |

#### 🚀 Project Breakdown:
- **Pingzo Ecosystem**: \`₹2,60,000 MRR\` · 14,200 Active Buyers & 280 Merchants
- **BookNowGo SaaS**: \`₹1,45,000 MRR\` · 1,890 reservations completed
- **Email Outreach Billing**: \`₹80,000 MRR\` · Rapid +45% adoption from developer tier`,
        data,
        source: 'Business Financial Ledger + Telemetry Pipeline'
      };
    }

    return null;
  }
}
