/**
 * Northwind's Slack messages.
 *
 * The threads the product is demonstrated on are written out by hand: the
 * payments outage, the refund approval rule, the iOS login loops, the leave
 * question nothing answers. The rest of #support is generated from a pool of
 * ordinary support traffic so the channel is as busy as a real one — 63 threads
 * and 412 messages across 23–30 September, which is what a week's summary has
 * to chew through.
 *
 * All of it is invented. Nothing here came from a real workspace.
 */
import { channels } from './channels.js';

/** The day the seeded company is "today". Fixed, so the data does not drift. */
export const TODAY = '2026-09-30';

const audienceOf = Object.fromEntries(channels.map((c) => [c.id, c.audience]));

let seq = 0;
/** @type {import('../types.js').Message[]} */
const messages = [];

/**
 * @param {string} channelId
 * @param {string} authorId
 * @param {string} at ISO 8601
 * @param {string} text
 * @param {string|null} threadRootId
 */
function add(channelId, authorId, at, text, threadRootId = null) {
  seq += 1;
  const id = `msg_${String(seq).padStart(4, '0')}`;
  messages.push({
    id,
    channelId,
    authorId,
    at,
    text,
    threadRootId,
    audience: audienceOf[channelId],
  });
  return id;
}

/**
 * A top-level message and its replies. Replies are `[minutesAfterRoot, authorId, text]`.
 * @param {string} channelId
 * @param {[string, string, string]} root `[at, authorId, text]`
 * @param {[number, string, string][]} replies
 */
function thread(channelId, [at, authorId, text], replies = []) {
  const rootId = add(channelId, authorId, at, text, null);
  const rootMs = Date.parse(at);
  for (const [minutes, replyAuthor, replyText] of replies) {
    const replyAt = new Date(rootMs + minutes * 60_000).toISOString().replace('.000', '');
    add(channelId, replyAuthor, replyAt, replyText, rootId);
  }
  return rootId;
}

/* ------------------------------------------------------------------ *
 * #finance-ops — where the refund approval rule was settled
 * ------------------------------------------------------------------ */

export const FINANCE_RULE_THREAD = thread('ch_finance_ops',
  ['2026-09-04T11:02:00Z', 'per_marco',
   'Proposal: cut refund approval from five working days to two business days. Under $500 goes through automatically, everything above it needs one approver instead of two.'],
  [
    [6, 'per_hana', 'Two approvers was never worth it below a few hundred dollars. The queue is the whole problem.'],
    [14, 'per_ruth', 'Agreed on the two days. What is the exposure on auto-approving under $500?'],
    [21, 'per_marco', 'Last quarter that band was 71% of refunds by count and 9% by value. Worst case is small and we can claw back.'],
    [33, 'per_ruth', 'Then do it. Two business days, $500 auto-approve, single approver above it.'],
    [38, 'per_marco', 'Settled. I will get it into the tooling this month and tell #support when it is live.'],
    [44, 'per_dana', 'Please update the Refunds policy page too — support quotes it verbatim.'],
    [47, 'per_marco', 'On my list.'],
  ]);

export const FINANCE_ROLLOUT_THREAD = thread('ch_finance_ops',
  ['2026-09-24T09:15:00Z', 'per_marco',
   'The new refund approval rule is live in the tooling as of this morning. Two business days, under $500 auto-approved, one approver above that. Tell customers two days, not five.'],
  [
    [8, 'per_hana', 'Confirmed, I pushed three through the auto path this morning and they cleared.'],
    [19, 'per_ade', 'Copying this into #support so the team stops quoting five.'],
    [26, 'per_marco', 'Thanks. The Notion page still says five days, I have not got to it.'],
  ]);

export const FINANCE_DINNERS_THREAD = thread('ch_finance_ops',
  ['2026-09-08T14:40:00Z', 'per_hana',
   'Client dinners keep coming in over the $50 per person cap and we keep approving them anyway. Can we just raise it?'],
  [
    [11, 'per_marco', 'What is the actual spend looking like?'],
    [17, 'per_hana', 'Median is $61 for a client dinner. $50 was set in 2023.'],
    [25, 'per_marco', '$65 per person for client dinners then. Internal team meals stay at $50.'],
    [29, 'per_ruth', 'Fine by me.'],
    [31, 'per_marco', 'Done. I will change Expense limits.'],
  ]);

thread('ch_finance_ops',
  ['2026-09-29T10:05:00Z', 'per_hana',
   'Two customers were double charged in Monday\'s outage. I reversed both by hand, Ade has the account numbers.'],
  [
    [12, 'per_marco', 'Both confirmed reversed on my side. Nothing else in that window looks duplicated.'],
  ]);

/* ------------------------------------------------------------------ *
 * #people-ops — including the question nothing in the company answers
 * ------------------------------------------------------------------ */

export const LEAVE_CARRYOVER_2023_THREAD = thread('ch_people_ops',
  ['2023-11-14T16:12:00Z', 'per_lin',
   'Silly question — is there a cap on how much leave you can carry into the next year?'],
  [
    [9, 'per_tomas', 'There is a cap in most places, five days usually. Let me check what we actually do.'],
    [22, 'per_lin', 'No rush. Separately, does the equipment budget reset in January or in April?'],
    [26, 'per_tomas', 'April, same as the fiscal year. I will get you laptop quotes.'],
    [40, 'per_lin', 'Perfect, thanks.'],
  ]);

export const EXPENSE_FORM_RETIRED_THREAD = thread('ch_people_ops',
  ['2026-08-01T09:30:00Z', 'per_tomas',
   'The old Expense request form is retired as of today. Everything goes through the finance tool now — if a wiki page still links the form, it is wrong.'],
  [
    [15, 'per_dana', 'Good. Can someone sweep the pages that link it?'],
    [21, 'per_tomas', 'I will do People ops. Finance pages are not mine.'],
  ]);

export const LEAVE_QUESTION_THREAD = thread('ch_people_ops',
  ['2026-09-30T11:20:00Z', 'per_priya',
   'How much unused leave can I carry into next year?'],
  []);

thread('ch_people_ops',
  ['2026-09-22T13:05:00Z', 'per_sam', 'Is the new starter laptop order still two weeks out?'],
  [
    [18, 'per_tomas', 'Ten working days from the signed offer. Order it the day the offer lands.'],
  ]);

thread('ch_people_ops',
  ['2026-09-26T08:50:00Z', 'per_lin', 'Booking leave for December — do I need manager approval over five days?'],
  [
    [12, 'per_tomas', 'Over five consecutive days, yes. Under that it is just the calendar.'],
    [30, 'per_lin', 'Got it.'],
  ]);

/* ------------------------------------------------------------------ *
 * #general
 * ------------------------------------------------------------------ */

thread('ch_general',
  ['2026-09-28T15:30:00Z', 'per_dana',
   'Vendi is going into a few channels this week. It answers from what we have already written down and it only ever answers you from what you could open yourself.'],
  [
    [6, 'per_sam', 'Which channels does it read?'],
    [14, 'per_dana', '#support, #finance-ops, #people-ops and #general. Not #random, and not anything private.'],
  ]);

thread('ch_general',
  ['2026-09-21T09:00:00Z', 'per_ruth', 'Q3 review is on the 8th. Team leads, your slides go in the shared deck by the 6th.'],
  [[45, 'per_dana', 'Deck is up, links in the calendar invite.']]);

thread('ch_general',
  ['2026-09-25T12:10:00Z', 'per_nina', 'Payments maintenance window on Saturday 03:00–05:00 UTC. Refunds will queue, nothing will be lost.'],
  [[20, 'per_ade', 'Noted, I will put a line in the support macro.']]);

/* ------------------------------------------------------------------ *
 * #random — real channel, deliberately not company knowledge
 * ------------------------------------------------------------------ */

thread('ch_random', ['2026-09-29T11:45:00Z', 'per_sam', 'Anyone doing the noodle place at 1?'],
  [[4, 'per_lin', 'In.'], [9, 'per_priya', 'In, but I have to be back by 1:45.']]);

thread('ch_random', ['2026-09-24T16:20:00Z', 'per_lin', 'The office plant has a name now. It is Gerald.'],
  [[3, 'per_ade', 'Gerald looks unwell.']]);

/* ------------------------------------------------------------------ *
 * #product-private — Priya is not in this channel and must never see it
 * ------------------------------------------------------------------ */

thread('ch_product_private',
  ['2026-09-23T10:00:00Z', 'per_owen',
   'Holding the self-serve refund button until Q1. Not announcing it internally yet.'],
  [
    [17, 'per_nina', 'Agreed, the payments work lands first.'],
    [25, 'per_ruth', 'Keep it in here until we have a date.'],
  ]);

/* ------------------------------------------------------------------ *
 * #support — the older history the answers cite
 * ------------------------------------------------------------------ */

export const SUPPORT_12_SEP_THREAD = thread('ch_support',
  ['2026-09-12T14:22:00Z', 'per_priya',
   'Customer chasing a refund from last Tuesday. The page says five working days, is that still what we tell people?'],
  [
    [8, 'per_ade', 'Five is what the page says. Finance changed something in the background but it is not live yet.'],
    [16, 'per_priya', 'So I keep saying five until someone says otherwise?'],
    [19, 'per_ade', 'For now, yes.'],
  ]);

thread('ch_support',
  ['2026-08-19T10:11:00Z', 'per_sam', 'Where is the wording we are meant to use when the status page is behind?'],
  [[14, 'per_ama', 'Support playbook, "when we are down" section.']]);

/* ------------------------------------------------------------------ *
 * #support — the week 23–30 September, hand-written part
 * ------------------------------------------------------------------ */

/** Nine people in a 34-reply thread: Monday's payments outage. */
const outageReplies = /** @type {[number, string, string][]} */ ([
  [3, 'per_lin', 'Confirming from my side — three refunds stuck at "pending" since 08:50.'],
  [6, 'per_sam', 'Customer on chat asking why theirs says approved but no money. Do I tell them it is paid?'],
  [9, 'per_ade', 'Do not tell them anything yet. Give me ten minutes.'],
  [12, 'per_nina', 'Payments provider is timing out on the refund endpoint. Not our side. They are on it.'],
  [15, 'per_priya', 'How many are queued?'],
  [18, 'per_nina', 'Six right now. They retry automatically, nothing is dropped.'],
  [24, 'per_hana', 'I can see them in the finance tool. All six are in the retry queue, none failed outright.'],
  [29, 'per_ama', 'Macro for the queue: "your refund is approved and on its way, banks can take a little longer today". Do not promise an hour.'],
  [34, 'per_sam', 'Using that.'],
  [41, 'per_lin', 'Status page still says all systems operational. That is going to bite us.'],
  [44, 'per_dana', 'Who owns the status page wording?'],
  [47, 'per_ama', 'Support playbook has the wording, the page itself is engineering.'],
  [52, 'per_nina', 'I will flip it to degraded now.'],
  [58, 'per_nina', 'Status page is on "degraded — refunds delayed".'],
  [66, 'per_priya', 'Two customers say they were charged twice. Not refunds — actual duplicate charges.'],
  [71, 'per_hana', 'Send me the account numbers, I will look.'],
  [74, 'per_priya', 'Sent to Ade, he has both.'],
  [83, 'per_hana', 'Both confirmed duplicates. Reversing by hand, they will see it today.'],
  [95, 'per_nina', 'Provider says the timeout is cleared. Retries are draining.'],
  [108, 'per_nina', 'Four of six have gone through.'],
  [126, 'per_nina', 'All six through. Queue is empty.'],
  [131, 'per_ade', 'So nothing was lost. Everything queued has now paid out.'],
  [138, 'per_sam', 'What do I say to the ones who were told "approved" hours ago?'],
  [142, 'per_ade', 'The truth: it was approved on time, the payment display lagged, the money moved.'],
  [150, 'per_ama', 'And if they ask how long a refund takes now, it is two business days. Not five.'],
  [153, 'per_priya', 'Two? The Notion page says five.'],
  [157, 'per_ama', 'Finance changed it. The page is out of date.'],
  [161, 'per_marco', 'Confirming: two business days, under $500 auto-approved, one approver above that. Live since the 24th.'],
  [166, 'per_priya', 'Right. Someone needs to fix that page, we have been telling people five all week.'],
  [170, 'per_marco', 'I own it. I will get to it.'],
  [188, 'per_dana', 'Escalation rule while we are here: past two business days it goes to #finance-ops, not to Marco directly.'],
  [193, 'per_ade', 'Agreed. Two days, then #finance-ops.'],
  [240, 'per_nina', 'Provider post-mortem is Thursday. I will summarise it here.'],
  [268, 'per_ade', 'Closing this out. Nothing lost, two double charges reversed, two business days is the line we hold.'],
]);

export const OUTAGE_THREAD = thread('ch_support',
  ['2026-09-30T09:12:00Z', 'per_ade',
   'Payments outage this morning — refunds are queuing. Keeping everything in this thread.'],
  outageReplies);

export const STATUS_WORDING_MESSAGE = add('ch_support', 'per_lin', '2026-09-30T15:52:00Z',
  'Status page wording still needs a pass, I\'ll do it after standup.');

export const PRIYA_REFUND_QUESTION = thread('ch_support',
  ['2026-09-30T10:41:00Z', 'per_priya',
   'Customer is asking why their refund hasn\'t landed. I told them five working days but I think that changed?'],
  []);

export const IOS_LOGIN_THREAD = thread('ch_support',
  ['2026-09-24T11:30:00Z', 'per_sam',
   'Third customer today stuck in a login loop on iOS. App bounces them back to the sign-in screen.'],
  [
    [14, 'per_lin', 'Mine is on iOS 18.2 as well.'],
    [23, 'per_nina', 'Reproduced. It is the token refresh on cold start. Fix is in review.'],
    [180, 'per_nina', 'Fix shipped this afternoon. 4.18.2 in the App Store.'],
    [195, 'per_sam', 'Three customers reported it. I have not written back to any of them yet.'],
    [210, 'per_ama', 'Write back today, all three.'],
  ]);

/** Asked four times, answered four times, written down nowhere. */
const billingAddressAsks = /** @type {[string, string, string][]} */ ([
  ['2026-09-23T09:41:00Z', 'per_sam', 'How does a customer change the billing address on an existing subscription?'],
  ['2026-09-25T14:08:00Z', 'per_lin', 'Billing address edit — is that something we do for them or do they do it themselves?'],
  ['2026-09-28T10:22:00Z', 'per_priya', 'Customer wants their billing address changed. Where do I do that?'],
  ['2026-09-29T16:37:00Z', 'per_sam', 'Billing address again. Same question as last week, I have lost the answer.'],
]);
for (const [at, author, text] of billingAddressAsks) {
  thread('ch_support', [at, author, text], [
    [11, 'per_ade', 'Admin panel, customer record, billing tab. Edit it there and it takes effect on the next invoice. Do not raise a ticket for it.'],
    [16, author, 'Thanks.'],
  ]);
}

thread('ch_support',
  ['2026-09-25T13:15:00Z', 'per_priya',
   'Refund over $500 — is that still two approvers? I keep getting different answers.'],
  [
    [9, 'per_hana', 'One approver. It changed on the 24th.'],
    [13, 'per_priya', 'And the page still says five days and two approvers. Cool.'],
  ]);

thread('ch_support',
  ['2026-09-27T10:02:00Z', 'per_ama',
   'Reminder: past two business days on a refund, escalate in #finance-ops. Do not DM Marco.'],
  [[25, 'per_sam', 'Noted.']]);

/* ------------------------------------------------------------------ *
 * #support — the rest of the week, generated so the channel is realistic
 * ------------------------------------------------------------------ */

const WINDOW_START = '2026-09-23';
const WINDOW_END = '2026-09-30';
/** What the channel summary has to cover. The screens quote both numbers. */
export const SUPPORT_WEEK = {
  start: WINDOW_START,
  end: WINDOW_END,
  threads: 63,
  messages: 412,
};

const inWindow = (m) => m.channelId === 'ch_support' && m.at >= `${WINDOW_START}T00:00:00Z` && m.at <= `${WINDOW_END}T23:59:59Z`;
const writtenThreads = new Set(messages.filter(inWindow).map((m) => m.threadRootId ?? m.id));
const fillerThreadCount = SUPPORT_WEEK.threads - writtenThreads.size;
const fillerMessageCount = SUPPORT_WEEK.messages - messages.filter(inWindow).length;

const fillerTopics = [
  ['Customer on the annual plan wants to switch to monthly mid-term. Pro rata or not?', 'Pro rata the unused months as account credit. No cash back on a downgrade.'],
  ['Invoice PDF is showing the old company address. Known?', 'Known. Template fix is queued for next week, send them a corrected one by hand until then.'],
  ['Someone is asking for a VAT invoice for a receipt from March.', 'Finance can reissue. Post the invoice number in #finance-ops.'],
  ['Trial extension request, second one from the same account.', 'One extension is ours to give. A second one needs the account owner to ask in #finance-ops.'],
  ['Customer cannot upload a CSV bigger than 10MB. Is that a limit or a bug?', 'That is the limit. Tell them to split it, and add it to the known limits list.'],
  ['Password reset email not arriving for a gmail address.', 'Check the suppression list first. Nine times out of ten it is a hard bounce from a typo.'],
  ['Refund request from an account that churned four months ago.', 'Outside the window. Explain it kindly and offer nothing we cannot honour.'],
  ['Seat count is wrong on the invoice — they removed two people last month.', 'Seat changes bill at the next cycle. Not a mistake, but it reads like one, so explain it.'],
  ['SSO login is failing for one customer, works for everyone else on the same tenant.', 'Nearly always a stale certificate on their side. Ask for the metadata file.'],
  ['Is there a way to export the audit log as CSV?', 'Not in the product yet. Do not promise a date.'],
  ['Customer wants their data deleted. What is the process?', 'People ops has the request form, finance closes the billing side. Twenty-eight days.'],
  ['Double invoice on one account this morning.', 'Same retry problem as the refunds. Reverse one, tell them, and log the account number.'],
  ['Which plan includes the API?', 'Business and above. The pricing page is right, the old PDF is not.'],
  ['Customer says the mobile app logged them out again overnight.', 'If it is iOS, point at the 4.18.2 update. Android has no known issue.'],
  ['Request to change the account owner to someone who has left.', 'We need the new owner in writing from someone still at the company.'],
  ['Chargeback notice came in on a refunded order.', 'Chargebacks page covers it. Reply with the refund proof, do not dispute twice.'],
  ['Can we backdate a subscription start to the first of the month?', 'No. Credit the difference instead, it comes out the same for them.'],
  ['Customer asking whether we are SOC 2. Where do I point them?', 'Trust page. Do not attach the report yourself, sales handles that.'],
];

const fillerCast = ['per_priya', 'per_lin', 'per_sam', 'per_ade', 'per_ama', 'per_hana'];
const fillerAnswerers = ['per_ade', 'per_ama', 'per_hana', 'per_lin'];
const fillerExtras = [
  'Adding it to the playbook so we stop asking.',
  'Same thing came up last month, same answer.',
  'Done, customer is happy.',
  'Thanks, that is what I thought but I wanted to be sure.',
  'Logged it on the account.',
  'Worth writing down somewhere people will find it.',
  'Closing this one out.',
];

// Spread the filler evenly over the week, then hand out the leftover replies
// from the front, so the totals land exactly on 63 threads and 412 messages.
const perThread = Math.floor(fillerMessageCount / fillerThreadCount);
let leftover = fillerMessageCount - perThread * fillerThreadCount;

for (let i = 0; i < fillerThreadCount; i += 1) {
  const day = 23 + (i % 8);
  const hour = 8 + ((i * 3) % 10);
  const minute = (i * 17) % 60;
  const at = `2026-09-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00Z`;
  const [ask, answer] = fillerTopics[i % fillerTopics.length];
  const asker = fillerCast[i % fillerCast.length];
  const answerer = fillerAnswerers[i % fillerAnswerers.length];

  let size = perThread;
  if (leftover > 0) {
    size += 1;
    leftover -= 1;
  }

  /** @type {[number, string, string][]} */
  const replies = [];
  for (let r = 0; r < size - 1; r += 1) {
    if (r === 0) {
      replies.push([7 + (i % 9), answerer, answer]);
    } else {
      const speaker = r % 2 === 0 ? asker : fillerCast[(i + r) % fillerCast.length];
      replies.push([12 + r * 9 + (i % 5), speaker, fillerExtras[(i + r) % fillerExtras.length]]);
    }
  }
  thread('ch_support', [at, asker, ask], replies);
}

/* ------------------------------------------------------------------ *
 * Direct messages between people — Vendi is not in these
 * ------------------------------------------------------------------ */

thread('dm_priya_ade', ['2026-09-30T09:20:00Z', 'per_priya', 'Are we telling customers two days or five? I have three chats open.'],
  [[4, 'per_ade', 'Two. The page is wrong, ignore it.']]);

thread('dm_priya_lin', ['2026-09-29T17:05:00Z', 'per_lin', 'Did the status page wording ever get sorted?'],
  [[8, 'per_priya', 'No. It is on my list and it has been on my list all week.']]);

export { messages };
