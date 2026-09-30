/**
 * The one place the company's knowledge lives.
 *
 * DATABASE_URL is not set in a preview or a sandbox, so the store is in memory
 * and is lost on restart. Every other step reads it through `lib/data`, never
 * by importing the seed files directly — when this moves to Postgres, only this
 * file changes.
 */
import { people, VENDI_ID } from './seed/people.js';
import { channels } from './seed/channels.js';
import { messages, TODAY, SUPPORT_WEEK } from './seed/messages.js';
import { wikiSpaces, wikiPages, wikiRevisions, WIKI_NAME } from './seed/wiki.js';

/** @type {{name: string, slackTeam: string, wikiName: string, today: string}} */
export const workspace = {
  name: 'Northwind',
  slackTeam: 'Northwind',
  wikiName: WIKI_NAME,
  today: TODAY,
};

export { VENDI_ID, SUPPORT_WEEK };

/**
 * Built once per process and frozen: nothing in the app may mutate the company
 * by reaching into an array it was handed.
 */
function build() {
  const byId = (rows) => new Map(rows.map((r) => [r.id, r]));

  const messagesByChannel = new Map();
  for (const m of messages) {
    if (!messagesByChannel.has(m.channelId)) messagesByChannel.set(m.channelId, []);
    messagesByChannel.get(m.channelId).push(m);
  }
  for (const list of messagesByChannel.values()) list.sort((a, b) => a.at.localeCompare(b.at));

  const messagesByThread = new Map();
  for (const m of messages) {
    const root = m.threadRootId ?? m.id;
    if (!messagesByThread.has(root)) messagesByThread.set(root, []);
    messagesByThread.get(root).push(m);
  }
  for (const list of messagesByThread.values()) list.sort((a, b) => a.at.localeCompare(b.at));

  const revisionsByPage = new Map();
  for (const r of wikiRevisions) {
    if (!revisionsByPage.has(r.pageId)) revisionsByPage.set(r.pageId, []);
    revisionsByPage.get(r.pageId).push(r);
  }
  for (const list of revisionsByPage.values()) list.sort((a, b) => a.at.localeCompare(b.at));

  const pagesBySpace = new Map();
  for (const p of wikiPages) {
    if (!pagesBySpace.has(p.spaceId)) pagesBySpace.set(p.spaceId, []);
    pagesBySpace.get(p.spaceId).push(p);
  }

  return Object.freeze({
    people: Object.freeze([...people]),
    peopleById: byId(people),
    channels: Object.freeze([...channels]),
    channelsById: byId(channels),
    messages: Object.freeze([...messages].sort((a, b) => a.at.localeCompare(b.at))),
    messagesById: byId(messages),
    messagesByChannel,
    messagesByThread,
    wikiSpaces: Object.freeze([...wikiSpaces]),
    wikiSpacesById: byId(wikiSpaces),
    wikiPages: Object.freeze([...wikiPages]),
    wikiPagesById: byId(wikiPages),
    pagesBySpace,
    wikiRevisions: Object.freeze([...wikiRevisions]),
    wikiRevisionsById: byId(wikiRevisions),
    revisionsByPage,
  });
}

// Next reloads modules in development; hang the store off globalThis so the
// company is built once and every route sees the same one.
const KEY = Symbol.for('vendi.companyStore');
if (!globalThis[KEY]) globalThis[KEY] = build();

/** @returns {ReturnType<typeof build>} */
export function store() {
  return globalThis[KEY];
}
