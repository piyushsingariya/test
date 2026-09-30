import test from 'node:test';
import assert from 'node:assert/strict';

import {
  canSeeChannel, canSeeMessage, canSeePage, whyChannelHidden, whyPageHidden,
  listChannels, listMessages, listWikiPages, listThreads, getChannel,
  getWikiPage, getMessage, listChannelsForAdmin, listPageRevisions,
} from '../lib/data/index.js';

const DANA = 'per_dana';     // workspace admin, not in #product-private
const PRIYA = 'per_priya';   // support, not in #product-private
const OWEN = 'per_owen';     // in #product-private
const RUTH = 'per_ruth';     // executive, can open Board and compensation
const OUTSIDER = 'per_nobody';

test('a public channel is open to everyone in the workspace', () => {
  assert.equal(canSeeChannel(PRIYA, 'ch_general'), true);
  assert.equal(canSeeChannel(PRIYA, 'ch_finance_ops'), true);
});

test('a private channel is closed to a person who is not in it, admin included', () => {
  assert.equal(canSeeChannel(OWEN, 'ch_product_private'), true);
  assert.equal(canSeeChannel(PRIYA, 'ch_product_private'), false);
  assert.equal(canSeeChannel(DANA, 'ch_product_private'), false);
  assert.match(whyChannelHidden(PRIYA, 'ch_product_private'), /private channel/i);
});

test('nothing from a private channel leaks through any list', () => {
  const names = listChannels(PRIYA).map((c) => c.id);
  assert.ok(!names.includes('ch_product_private'));
  assert.equal(getChannel(PRIYA, 'ch_product_private'), null);
  assert.deepEqual(listThreads(PRIYA, 'ch_product_private'), []);

  const privateMessages = listMessages(OWEN, { channelId: 'ch_product_private' });
  assert.ok(privateMessages.length > 0, 'the channel does have messages');
  for (const message of privateMessages) {
    assert.equal(canSeeMessage(PRIYA, message.id), false);
    assert.equal(getMessage(PRIYA, message.id), null);
  }
  const everythingPriyaCanRead = listMessages(PRIYA);
  assert.equal(
    everythingPriyaCanRead.some((m) => m.channelId === 'ch_product_private'),
    false,
  );
});

test('a direct message between two other people is closed to everyone else', () => {
  assert.equal(canSeeChannel(PRIYA, 'dm_priya_ade'), true);
  assert.equal(canSeeChannel(DANA, 'dm_priya_ade'), false);
  assert.equal(canSeeChannel(DANA, 'dm_marco_vendi'), false);
  assert.match(whyChannelHidden(DANA, 'dm_priya_ade'), /direct message/i);
});

test('a restricted wiki page is closed, and says why', () => {
  const board = listWikiPages(RUTH, { spaceId: 'sp_board' });
  assert.equal(board.length, 6);
  assert.equal(listWikiPages(PRIYA, { spaceId: 'sp_board' }).length, 0);
  const [page] = board;
  assert.equal(canSeePage(RUTH, page.id), true);
  assert.equal(canSeePage(PRIYA, page.id), false);
  assert.equal(getWikiPage(PRIYA, page.id), null);
  assert.match(whyPageHidden(PRIYA, page.id), /restricted/i);
  assert.deepEqual(listPageRevisions(PRIYA, page.id), []);
});

test('a person who is not in the workspace sees nothing at all', () => {
  assert.deepEqual(listChannels(OUTSIDER), []);
  assert.deepEqual(listMessages(OUTSIDER), []);
  assert.deepEqual(listWikiPages(OUTSIDER), []);
  assert.equal(canSeeChannel(OUTSIDER, 'ch_general'), false);
  assert.equal(canSeePage(OUTSIDER, 'pg_refunds_policy'), false);
});

test('the admin list shows hidden channels as hidden rather than hiding them', () => {
  const rows = listChannelsForAdmin(DANA);
  const priv = rows.find((r) => r.channel.id === 'ch_product_private');
  assert.equal(priv.visible, false);
  assert.ok(priv.hiddenBecause);
  const support = rows.find((r) => r.channel.id === 'ch_support');
  assert.equal(support.visible, true);
  assert.equal(support.hiddenBecause, null);
});

test('every message carries the audience of the channel it is in', () => {
  for (const message of listMessages(OWEN, { channelId: 'ch_product_private' })) {
    assert.equal(message.audience.kind, 'members');
  }
  for (const message of listMessages(PRIYA, { channelId: 'ch_general' }).slice(0, 5)) {
    assert.equal(message.audience.kind, 'workspace');
  }
});
