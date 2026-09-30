// Sample conversations, written for the home page and the reply reference.
// They are illustrations of Vendi's shape, not real messages, real customers or
// real Notion pages, and every screen that shows them says so.
export const SAMPLE_ASK = {
  asker: { author: 'Priya Raman', initials: 'PR', time: '10:42' },
  question:
    '@Vendi how long do refund requests take to approve now? I keep telling customers five days and I’m not sure that’s still right.',
  reply: {
    time: '10:42',
    answer:
      'Two business days, not five. Finance shortened it on 4 September when the new approval rule went live — anything under $500 is auto-approved and the rest goes to one approver instead of two.',
    notice: {
      body: 'Heads up: the Notion page still says five days. Want me to send the correction to its owner?',
    },
    sources: [
      { label: 'Notion · Refunds policy' },
      { label: '#finance-ops · 4 Sep' },
      { label: '#support · 12 Sep' },
    ],
  },
}

export const SAMPLE_ANATOMY = {
  asker: { author: 'Priya Raman', initials: 'PR', time: '10:42' },
  question: '@Vendi how long do refund requests take to approve now?',
  reply: {
    time: '10:42',
    answer:
      'Two business days, not five. Finance shortened it on 4 September: anything under $500 is auto-approved, and the rest goes to one approver instead of two.',
    sourcesLabel: 'Read 3 sources',
    sources: [
      { label: 'Notion · Refunds policy' },
      { label: '#finance-ops · 4 Sep' },
      { label: '#support · 12 Sep' },
    ],
    notice: {
      title: 'The Notion page still says five days',
      body: 'I can draft the correction and send it to the page’s owner. I will not change the page myself.',
    },
    actions: [
      { label: 'Send the correction to Marco', go: true },
      { label: 'Summarise this thread' },
      { label: 'Shorter' },
      { label: 'Where did this come from?' },
    ],
    access:
      'Vendi answered from what Priya can already see. Only Priya sees this message until she shares it.',
  },
}

export const SAMPLE_NO_ANSWER = {
  asker: { author: 'Tomas Oduya', initials: 'TO', time: '14:08' },
  question: '@Vendi what’s our parental leave policy in Portugal?',
  reply: {
    time: '14:08',
    answer:
      'I don’t know. Nothing I can read covers parental leave outside the UK and Germany, and I’d rather say that than guess.',
    lookedAt: 'Looked at: Notion · People handbook, and #people-ops since January. Nothing on Portugal.',
    actions: [{ label: 'Ask in #people-ops' }, { label: 'Tell me when a page covers this' }],
  },
}
