export class CommunicationAgent {
  constructor() {
    this.name = 'Communication & Telephony Agent';
    this.role = 'Phone Directory, Cellular Calls & Contacts Management';

    // Contact Directory
    this.contacts = [
      { id: 'c-1', name: 'அம்மா (Amma)', category: 'குடும்பம் (Family)', phone: '+91 98401 23456', avatar: '👵' },
      { id: 'c-2', name: 'அப்பா (Appa)', category: 'குடும்பம் (Family)', phone: '+91 98402 34567', avatar: '👴' },
      { id: 'c-3', name: 'மனைவி (Wife)', category: 'குடும்பம் (Family)', phone: '+91 98403 45678', avatar: '👩' },
      { id: 'c-4', name: 'ரமேஷ் (Pingzo Tech Lead)', category: 'வணிகம் (Business)', phone: '+91 98404 56789', avatar: '👨‍💻' },
      { id: 'c-5', name: 'சுரேஷ் (BookNowGo Manager)', category: 'வணிகம் (Business)', phone: '+91 98405 67890', avatar: '🏨' },
      { id: 'c-6', name: 'டெலிவரி டீம் (Pingzo Fleet)', category: 'செயல்பாடு (Operations)', phone: '+91 98406 78901', avatar: '🛵' }
    ];
  }

  process(query, lang = 'ta-IN') {
    const q = query.toLowerCase();

    // Phone Call Intent Detection
    if (q.includes('call') || q.includes('கால்') || q.includes('அழைப்பு') || q.includes('போன்') || q.includes('dial') || q.includes('பேசு')) {
      // Find matching contact
      let matchedContact = null;
      for (const c of this.contacts) {
        const cName = c.name.toLowerCase();
        if (q.includes('அம்மா') || q.includes('amma') || q.includes('mom')) {
          matchedContact = this.contacts[0]; break;
        } else if (q.includes('அப்பா') || q.includes('appa') || q.includes('dad')) {
          matchedContact = this.contacts[1]; break;
        } else if (q.includes('மனைவி') || q.includes('wife')) {
          matchedContact = this.contacts[2]; break;
        } else if (q.includes('ரமேஷ்') || q.includes('ramesh')) {
          matchedContact = this.contacts[3]; break;
        } else if (q.includes('சுரேஷ்') || q.includes('suresh')) {
          matchedContact = this.contacts[4]; break;
        } else if (q.includes('டெலிவரி') || q.includes('delivery')) {
          matchedContact = this.contacts[5]; break;
        } else if (cName.split(' ')[0] && q.includes(cName.split(' ')[0])) {
          matchedContact = c; break;
        }
      }

      if (!matchedContact) {
        matchedContact = this.contacts[0]; // default to Amma if unspecified
      }

      return {
        agent: this.name,
        mode: 'PHONE_CALL_MODAL',
        language: 'ta-IN',
        speechText: `${matchedContact.name} அவர்களுக்கு ${matchedContact.phone} எண்ணிற்கு அழைப்பு விடுக்கப்படுகிறது.`,
        displayText: `### 📞 தொலைபேசி அழைப்பு (Initiating Call)
- **தொடர்பு பெயர்**: **${matchedContact.name}** (${matchedContact.category})
- **மொபைல் எண்**: \`${matchedContact.phone}\`
- **அழைப்பு நிலை**: 🟢 **இணைக்கப்படுகிறது (Calling...)**
- [நேரடி அழைப்பு விடுக்க இங்கே கிளிக் செய்யவும் (tel:${matchedContact.phone.replace(/\s+/g, '')})](tel:${matchedContact.phone.replace(/\s+/g, '')})`,
        data: { contact: matchedContact, allContacts: this.contacts },
        source: 'GENISUS Call Directory & Telephony Dispatcher'
      };
    }

    return null;
  }
}
