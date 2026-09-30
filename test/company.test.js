import test from 'node:test';
import assert from 'node:assert/strict';

import {
  workspace, listPeople, getPerson, listChannels, listMessages, getThread,
  listThreads, coverage, listWikiPages, listWikiSpaces, companySummary,
  pagesOwnedBy, SUPPORT_WEEK,
} from '../lib/data/index.js';

const DANA = 'per_dana';
const PRIYA = 'per_priya';

test('a realistic company is loaded', () => {
  assert.equal(workspace.name, 'Northwind');
  const summary = companySummary();
  assert.ok(summary.people >= 10, 'enough people to have conversations');
  assert.ok(summary.channels >= 5, 'more than one channel');
  assert.ok(summary.messages > 400, 'a busy workspace');
  assert.ok(summary.wikiPages >= 100, 'a wiki worth searching');
});

test('every person has a name and at least one role, apps aside', () => {
  for (const person of listPeople()) {
    assert.ok(person.name, `${person.id} has a name`);
    assert.ok(person.initials, `${person.id} has initials`);
    if (!person.isApp) assert.ok(person.roles.length > 0, `${person.id} has a role`);
  }
  assert.ok(listPeople().some((p) => p.roles.includes('admin')), 'somebody is an admin');
  assert.ok(listPeople().some((p) => p.roles.includes('page_owner')), 'somebody owns pages');
});

test('#support is busy: the week has 63 threads and 412 messages', () => {
  const from = `${SUPPORT_WEEK.start}T00:00:00Z`;
  const to = `${SUPPORT_WEEK.end}T23:59:59Z`;
  const week = coverage(PRIYA, 'ch_support', { from, to });
  assert.equal(week.threads, SUPPORT_WEEK.threads);
  assert.equal(week.messages, SUPPORT_WEEK.messages);
  assert.ok(week.people >= 5, 'more than a couple of people talking');
});

test('#support has a long thread with many people in it', () => {
  const threads = listThreads(PRIYA, 'ch_support');
  const longest = threads.reduce((a, b) => (b.replyCount > a.replyCount ? b : a));
  assert.ok(longest.replyCount >= 30, `longest thread has ${longest.replyCount} replies`);
  assert.ok(longest.participantIds.length >= 8, 'nine-ish people in it');
  assert.equal(longest.firstAt <= longest.lastAt, true);
});

test('a thread reads as its opening message plus its replies', () => {
  const [thread] = listThreads(PRIYA, 'ch_support');
  const rebuilt = listMessages(PRIYA, { threadRootId: thread.root.id });
  assert.equal(rebuilt.length, thread.replyCount + 1);
  assert.equal(rebuilt[0].id, thread.root.id);
  for (const reply of thread.replies) assert.equal(reply.threadRootId, thread.root.id);
});

test('every wiki page has an owner who is a person in the workspace', () => {
  const pages = listWikiPages(DANA);
  assert.ok(pages.length >= 100);
  for (const page of pages) {
    assert.ok(page.ownerId, `${page.id} has an owner`);
    assert.ok(getPerson(page.ownerId), `${page.id}'s owner is a real person`);
    assert.ok(page.sections.length > 0, `${page.id} has something written on it`);
  }
});

test('the wiki spaces are the ones the admin screens connect', () => {
  const counts = Object.fromEntries(
    listWikiSpaces(DANA).map(({ space, pageCount }) => [space.name, pageCount]),
  );
  assert.deepEqual(counts, {
    'Company handbook': 28,
    Finance: 12,
    Support: 9,
    'People ops': 14,
    'Engineering handbook': 31,
    'Board and compensation': 6,
  });
});

test('page owners own pages', () => {
  const marco = pagesOwnedBy('per_marco');
  assert.ok(marco.some((p) => p.title === 'Refunds policy'));
  assert.ok(marco.some((p) => p.title === 'Expense limits'));
});

test('reads survive ids that do not exist', () => {
  assert.equal(getPerson('per_nobody'), null);
  assert.deepEqual(listMessages(PRIYA, { channelId: 'ch_nothing' }), []);
  assert.equal(getThread(PRIYA, 'msg_nothing'), null);
  assert.deepEqual(listThreads(PRIYA, 'ch_nothing'), []);
  assert.deepEqual(listChannels('per_nobody'), []);
});
