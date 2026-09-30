import test from 'node:test';
import assert from 'node:assert/strict';

import {
  listWikiPages, getWikiPage, listPageRevisions, getPageChange,
  getCurrentRevision, getPreviousRevision, diffSections,
} from '../lib/data/index.js';

const DANA = 'per_dana';

test('every page keeps at least the revision that created it', () => {
  for (const page of listWikiPages(DANA)) {
    const revisions = listPageRevisions(DANA, page.id);
    assert.ok(revisions.length >= 1, `${page.id} has a history`);
    assert.equal(revisions[0].summary, 'page created');
  }
});

test('revisions run oldest to newest and the last one is the page as it reads now', () => {
  for (const page of listWikiPages(DANA)) {
    const revisions = listPageRevisions(DANA, page.id);
    for (let i = 1; i < revisions.length; i += 1) {
      assert.ok(revisions[i - 1].at <= revisions[i].at, `${page.id} history is in order`);
    }
    const latest = revisions[revisions.length - 1];
    assert.equal(getCurrentRevision(DANA, page.id).id, latest.id);
    assert.deepEqual(page.sections, latest.sections);
    assert.equal(page.lastEditedAt, latest.at);
    assert.equal(page.lastEditedById, latest.byId);
  }
});

test('a change can be read against what it replaced', () => {
  const page = getWikiPage(DANA, 'pg_refunds_policy');
  const revisions = listPageRevisions(DANA, page.id);
  assert.equal(revisions.length, 2);

  const change = getPageChange(DANA, page.id, revisions[1].id);
  assert.equal(change.previous.id, revisions[0].id);

  const added = change.sections.filter((s) => s.status === 'added');
  const unchanged = change.sections.filter((s) => s.status === 'unchanged');
  assert.equal(added.length, 1);
  assert.equal(added[0].heading, 'What counts as a refund');
  assert.equal(added[0].before, null);
  assert.equal(unchanged.length, 1);
  assert.match(unchanged[0].after, /five working days/);
});

test('the first revision of a page reads as every section added', () => {
  const revisions = listPageRevisions(DANA, 'pg_chargebacks');
  const change = getPageChange(DANA, 'pg_chargebacks', revisions[0].id);
  assert.equal(change.previous, null);
  assert.ok(change.sections.length > 0);
  for (const section of change.sections) {
    assert.equal(section.status, 'added');
    assert.equal(section.before, null);
  }
  assert.equal(getPreviousRevision(DANA, 'pg_chargebacks', revisions[0].id), null);
});

test('a rewritten section shows both the words before and the words after', () => {
  const before = [{ id: 's1', heading: 'Approval time', body: 'five working days' }];
  const after = [{ id: 's1', heading: 'Approval time', body: 'two business days' }];
  const [section] = diffSections(before, after);
  assert.equal(section.status, 'changed');
  assert.equal(section.before, 'five working days');
  assert.equal(section.after, 'two business days');
});

test('a removed section is kept as removed, not dropped', () => {
  const [section] = diffSections([{ id: 's9', heading: 'Old rule', body: 'gone' }], []);
  assert.equal(section.status, 'removed');
  assert.equal(section.after, null);
});

test('asking for a revision that does not exist reads as nothing', () => {
  assert.equal(getPageChange(DANA, 'pg_refunds_policy', 'rev_nope'), null);
  assert.deepEqual(listPageRevisions(DANA, 'pg_nope'), []);
  assert.equal(getCurrentRevision(DANA, 'pg_nope'), null);
});
