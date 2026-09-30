/**
 * Northwind's Notion wiki: six top-level spaces, a hundred pages, an owner on
 * every one, and a revision for every version a page has ever had.
 *
 * The pages the product is demonstrated on are written out in full — Refunds
 * policy, which a Slack conversation has overtaken, and Expense limits, which
 * two conversations contradict. The rest carry a real title, a real owner and
 * a short body, so the page counts the admin screens show are counts of pages
 * that exist rather than numbers on a slide.
 *
 * Invented, all of it.
 */

const EVERYONE = /** @type {const} */ ({ kind: 'workspace' });

/** @type {import('../types.js').WikiSpace[]} */
export const wikiSpaces = [
  { id: 'sp_handbook', name: 'Company handbook', blurb: 'How the company works, for everyone' },
  { id: 'sp_finance', name: 'Finance', blurb: 'Refunds, expenses, invoicing, chargebacks' },
  { id: 'sp_support', name: 'Support', blurb: 'Playbooks and status wording' },
  { id: 'sp_people', name: 'People ops', blurb: 'Leave, onboarding, equipment' },
  { id: 'sp_engineering', name: 'Engineering handbook', blurb: 'How engineering builds and ships' },
  { id: 'sp_board', name: 'Board and compensation', blurb: 'Restricted in Notion' },
];

export const WIKI_NAME = 'Northwind wiki';

/** @type {import('../types.js').WikiPage[]} */
export const wikiPages = [];
/** @type {import('../types.js').WikiRevision[]} */
export const wikiRevisions = [];

let pageSeq = 0;
let revSeq = 0;

/**
 * @param {object} spec
 * @param {string} spec.id
 * @param {string} spec.spaceId
 * @param {string} spec.title
 * @param {string} spec.ownerId
 * @param {import('../types.js').Audience} [spec.audience]
 * @param {{at: string, byId: string, summary: string, acceptedById?: string|null,
 *          sources?: import('../types.js').WikiRevision['sources'],
 *          sections: import('../types.js').WikiSection[]}[]} spec.history
 *   Oldest first. The last entry is the page as it reads now.
 */
function page({ id, spaceId, title, ownerId, audience = EVERYONE, history }) {
  if (history.length === 0) throw new Error(`${id}: a page needs at least the revision that created it`);
  const revisionIds = [];
  for (const entry of history) {
    revSeq += 1;
    const revId = `rev_${String(revSeq).padStart(4, '0')}`;
    wikiRevisions.push({
      id: revId,
      pageId: id,
      at: entry.at,
      byId: entry.byId,
      acceptedById: entry.acceptedById ?? null,
      summary: entry.summary,
      sections: entry.sections,
      sources: entry.sources ?? [],
    });
    revisionIds.push(revId);
  }
  const latest = history[history.length - 1];
  pageSeq += 1;
  wikiPages.push({
    id,
    spaceId,
    title,
    ownerId,
    audience,
    sections: latest.sections,
    lastEditedAt: latest.at,
    lastEditedById: latest.byId,
    revisionIds,
  });
}

/* ---------------------------- Finance ---------------------------- */

const refundsWhatCounts = {
  id: 'sec_refunds_what',
  heading: 'What counts as a refund',
  body: 'A full or partial return of money already charged. Credits and discounts on a future invoice are handled in Chargebacks, not here.',
};

page({
  id: 'pg_refunds_policy',
  spaceId: 'sp_finance',
  title: 'Refunds policy',
  ownerId: 'per_marco',
  history: [
    {
      at: '2026-02-04T09:30:00Z',
      byId: 'per_marco',
      summary: 'page created',
      sections: [
        {
          id: 'sec_refunds_approval',
          heading: 'Approval time',
          body: 'Refund requests are approved within five working days. Every request needs two approvers.',
        },
      ],
    },
    {
      at: '2026-03-12T15:10:00Z',
      byId: 'per_marco',
      summary: 'added the chargeback note',
      sections: [
        {
          id: 'sec_refunds_approval',
          heading: 'Approval time',
          body: 'Refund requests are approved within five working days. Every request needs two approvers.',
        },
        refundsWhatCounts,
      ],
    },
  ],
});

page({
  id: 'pg_expense_limits',
  spaceId: 'sp_finance',
  title: 'Expense limits',
  ownerId: 'per_marco',
  history: [
    {
      at: '2024-06-03T10:00:00Z',
      byId: 'per_marco',
      summary: 'page created',
      sections: [
        { id: 'sec_exp_meals', heading: 'Meals', body: 'Up to $50 per person per meal, client dinners included.' },
        { id: 'sec_exp_claim', heading: 'How to claim', body: 'Fill in the Expense request form and send it to finance within thirty days.' },
      ],
    },
    {
      at: '2025-08-12T11:24:00Z',
      byId: 'per_marco',
      summary: 'added the receipts line',
      sections: [
        { id: 'sec_exp_meals', heading: 'Meals', body: 'Up to $50 per person per meal, client dinners included.' },
        { id: 'sec_exp_claim', heading: 'How to claim', body: 'Fill in the Expense request form and send it to finance within thirty days.' },
        { id: 'sec_exp_receipts', heading: 'Receipts', body: 'A receipt is required over $25. A card statement line is not a receipt.' },
      ],
    },
  ],
});

page({
  id: 'pg_chargebacks',
  spaceId: 'sp_finance',
  title: 'Chargebacks',
  ownerId: 'per_marco',
  history: [
    {
      at: '2025-04-18T13:00:00Z',
      byId: 'per_marco',
      summary: 'page created',
      sections: [
        { id: 'sec_cb_what', heading: 'When a chargeback arrives', body: 'The bank tells us before the customer does. Reply with the refund proof if one was already issued; never dispute a charge we have refunded.' },
        { id: 'sec_cb_window', heading: 'Deadlines', body: 'Evidence goes back within ten calendar days. A missed deadline loses the case automatically.' },
      ],
    },
  ],
});

/* ---------------------------- Support ---------------------------- */

page({
  id: 'pg_support_playbook',
  spaceId: 'sp_support',
  title: 'Support playbook',
  ownerId: 'per_ama',
  history: [
    {
      at: '2025-01-22T09:00:00Z',
      byId: 'per_ama',
      summary: 'page created',
      sections: [
        { id: 'sec_play_tone', heading: 'How we write', body: 'Plain words, no blame, and never a promise we cannot keep. Say what we know and when we will know more.' },
        { id: 'sec_play_down', heading: 'When we are down', body: 'Say the service is degraded, say what still works, and give a time you will come back — then come back at that time even if there is nothing new.' },
        { id: 'sec_play_escalate', heading: 'Escalating', body: 'Anything a customer has chased twice goes to the support lead the same day.' },
      ],
    },
  ],
});

page({
  id: 'pg_status_wording',
  spaceId: 'sp_support',
  title: 'Status page wording',
  ownerId: 'per_ama',
  history: [
    {
      at: '2025-06-09T14:30:00Z',
      byId: 'per_ama',
      summary: 'page created',
      sections: [
        { id: 'sec_status_states', heading: 'The three states', body: 'Operational, degraded, down. Nothing in between, and no wording that invents a fourth.' },
        { id: 'sec_status_who', heading: 'Who flips it', body: 'Engineering flips the page. Support writes the sentence that goes on it.' },
      ],
    },
  ],
});

page({
  id: 'pg_ios_known_issues',
  spaceId: 'sp_support',
  title: 'iOS known issues',
  ownerId: 'per_ama',
  history: [
    {
      at: '2026-05-14T11:00:00Z',
      byId: 'per_ama',
      summary: 'page created',
      sections: [
        { id: 'sec_ios_open', heading: 'Open issues', body: 'Login loop on cold start, iOS 18.2 and above. Engineering is aware.' },
        { id: 'sec_ios_say', heading: 'What to tell customers', body: 'Ask for the app version first. Anything below 4.18 gets an update before anything else.' },
      ],
    },
  ],
});

/* --------------------------- People ops --------------------------- */

page({
  id: 'pg_leave_policy',
  spaceId: 'sp_people',
  title: 'Leave policy',
  ownerId: 'per_tomas',
  history: [
    {
      at: '2024-09-02T08:45:00Z',
      byId: 'per_tomas',
      summary: 'page created',
      sections: [
        { id: 'sec_leave_days', heading: 'How many days', body: 'Twenty-five days a year plus public holidays, from your first day.' },
        { id: 'sec_leave_book', heading: 'Booking it', body: 'Put it in the calendar. More than five consecutive days needs your manager to agree first.' },
      ],
    },
  ],
});

page({
  id: 'pg_travel_policy',
  spaceId: 'sp_people',
  title: 'Travel policy',
  ownerId: 'per_marco',
  history: [
    {
      at: '2025-02-11T10:15:00Z',
      byId: 'per_marco',
      summary: 'page created',
      sections: [
        { id: 'sec_travel_notice', heading: 'Notice', body: 'Book travel at least fourteen days ahead. Inside fourteen days it needs a reason in the request.' },
        { id: 'sec_travel_class', heading: 'What we book', body: 'Economy under six hours. Over six hours, premium economy.' },
      ],
    },
  ],
});

page({
  id: 'pg_people_handbook',
  spaceId: 'sp_handbook',
  title: 'People handbook',
  ownerId: 'per_tomas',
  history: [
    {
      at: '2024-08-19T09:00:00Z',
      byId: 'per_tomas',
      summary: 'page created',
      sections: [
        { id: 'sec_hb_intro', heading: 'What this is', body: 'The index for everything about working here: leave, equipment, pay dates, who to ask.' },
        { id: 'sec_hb_ask', heading: 'Who to ask', body: 'People ops for anything about you. Finance for anything about money leaving the company.' },
      ],
    },
  ],
});

/* ----------------- The rest, so the counts are real ---------------- */

/**
 * @param {string} spaceId
 * @param {string} ownerId
 * @param {string[]} titles
 * @param {import('../types.js').Audience} [audience]
 */
function fillerPages(spaceId, ownerId, titles, audience = EVERYONE) {
  titles.forEach((title, i) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const month = String((i % 12) + 1).padStart(2, '0');
    const day = String((i % 27) + 1).padStart(2, '0');
    page({
      id: `pg_${slug}`,
      spaceId,
      title,
      ownerId,
      audience,
      history: [
        {
          at: `2025-${month}-${day}T09:00:00Z`,
          byId: ownerId,
          summary: 'page created',
          sections: [
            { id: `sec_${slug}_what`, heading: 'What this covers', body: `${title} — how Northwind handles it, who decides, and where to ask when the page does not say.` },
          ],
        },
      ],
    });
  });
}

fillerPages('sp_handbook', 'per_dana', [
  'How we work', 'Meeting norms', 'Writing things down', 'Decision log', 'Company calendar',
  'Pay dates', 'Job levels', 'Performance reviews', 'Internal transfers', 'Referrals',
  'Working hours', 'Remote work', 'Office access', 'Security basics', 'Password manager',
  'Data protection', 'Acceptable use', 'Brand basics', 'Press and speaking', 'Customer references',
  'Tooling we pay for', 'Requesting software', 'Glossary', 'Org chart', 'New joiner week one',
  'Leaving Northwind', 'Whistleblowing',
]);

fillerPages('sp_finance', 'per_hana', [
  'Invoicing', 'Purchase orders', 'Supplier onboarding', 'Corporate cards', 'Currency and FX',
  'Tax and VAT', 'Month end close', 'Budget requests', 'Revenue recognition',
]);

fillerPages('sp_support', 'per_ade', [
  'Triage and priorities', 'Macros and snippets', 'Escalation paths',
  'Working the weekend rota', 'Handover notes', 'Known limits',
]);

fillerPages('sp_people', 'per_tomas', [
  'Onboarding', 'Equipment', 'Parental leave', 'Sick leave', 'Learning budget',
  'Expenses for people ops', 'Probation', 'Working abroad', 'Notice periods',
  'Interview process', 'Offer approvals', 'Employee data requests',
]);

fillerPages('sp_engineering', 'per_nina', [
  'How we ship', 'Code review', 'Branching', 'Testing', 'Incident response',
  'On call', 'Post-mortems', 'Runbooks', 'Observability', 'Alerting',
  'Service catalogue', 'API design', 'Database migrations', 'Feature flags', 'Secrets handling',
  'Dependency updates', 'Performance budgets', 'Accessibility', 'Mobile releases', 'App store review',
  'Payments architecture', 'Third party providers', 'Rate limits', 'Backups', 'Disaster recovery',
  'Environments', 'Local setup', 'Architecture decisions', 'Deprecations', 'Engineering onboarding',
  'Security review',
]);

fillerPages('sp_board', 'per_ruth', [
  'Board pack', 'Cap table', 'Compensation bands', 'Equity refreshes', 'Board minutes', 'Fundraising',
], {
  kind: 'people',
  personIds: ['per_ruth', 'per_dana'],
  reason: 'Restricted in Notion to the executive team',
});
