/**
 * The company's knowledge, as every other step reads it.
 *
 * Every read takes the person doing the reading. There is no way to ask this
 * module for "all messages" — access is not a filter a caller may forget, it is
 * the argument. Unknown ids read as nobody and as nothing, never as everyone.
 *
 * Nothing here writes. Steps that add state (what Vendi has read, its answers,
 * the activity log) own their own store and call this one for the company.
 */
import { store, workspace, VENDI_ID, SUPPORT_WEEK } from './store.js';
import {
  canSeeChannel, canSeeMessage, canSeePage, whyChannelHidden, whyPageHidden,
} from './access.js';
import { revisionsOf, currentRevision, previousRevision, diffSections, changesIn } from './wiki.js';

export {
  workspace, VENDI_ID, SUPPORT_WEEK,
  canSeeChannel, canSeeMessage, canSeePage, whyChannelHidden, whyPageHidden,
  diffSections,
};

/* ------------------------------ People ------------------------------ */

/** Everyone in the workspace, Vendi included. */
export function listPeople({ includeApps = true } = {}) {
  return store().people.filter((p) => includeApps || !p.isApp);
}

/** @param {string} personId @returns {import('./types.js').Person|null} */
export function getPerson(personId) {
  return store().peopleById.get(personId) ?? null;
}

/** @param {string} personId */
export function isAdmin(personId) {
  return Boolean(getPerson(personId)?.roles.includes('admin'));
}

/** The pages a person owns, and so is asked to accept edits to. */
export function pagesOwnedBy(personId) {
  return store().wikiPages.filter((p) => p.ownerId === personId);
}

/* ----------------------------- Channels ----------------------------- */

/**
 * The channels this person can open. Kinds: 'public', 'private', 'dm'.
 * @param {string} asPersonId
 */
export function listChannels(asPersonId, { kinds } = {}) {
  return store().channels.filter(
    (c) => (!kinds || kinds.includes(c.kind)) && canSeeChannel(asPersonId, c.id),
  );
}

/** Every channel in the workspace with whether this person can open it —
 *  what the admin screens need, and the only read that returns hidden ones. */
export function listChannelsForAdmin(asPersonId) {
  return store().channels.map((c) => ({
    channel: c,
    visible: canSeeChannel(asPersonId, c.id),
    hiddenBecause: whyChannelHidden(asPersonId, c.id),
  }));
}

/** @param {string} asPersonId @param {string} channelId */
export function getChannel(asPersonId, channelId) {
  return canSeeChannel(asPersonId, channelId) ? store().channelsById.get(channelId) : null;
}

/* ----------------------------- Messages ----------------------------- */

const within = (m, from, to) => (!from || m.at >= from) && (!to || m.at <= to);

/**
 * Messages this person can read, oldest first.
 * @param {string} asPersonId
 * @param {{channelId?: string, from?: string, to?: string, threadRootId?: string}} [opts]
 *   `from` and `to` are ISO 8601 and inclusive.
 */
export function listMessages(asPersonId, { channelId, from, to, threadRootId } = {}) {
  let rows;
  if (threadRootId) rows = store().messagesByThread.get(threadRootId) ?? [];
  else if (channelId) rows = store().messagesByChannel.get(channelId) ?? [];
  else rows = store().messages;
  return rows.filter((m) => within(m, from, to) && canSeeMessage(asPersonId, m.id));
}

/** @param {string} asPersonId @param {string} messageId */
export function getMessage(asPersonId, messageId) {
  return canSeeMessage(asPersonId, messageId) ? store().messagesById.get(messageId) : null;
}

/**
 * One thread: its opening message, its replies, and what a summary has to say
 * it covered. Null when the person cannot open the channel it is in.
 * @param {string} asPersonId @param {string} rootId
 */
export function getThread(asPersonId, rootId) {
  const all = store().messagesByThread.get(rootId);
  if (!all || all.length === 0) return null;
  const root = store().messagesById.get(rootId);
  if (!root || !canSeeMessage(asPersonId, rootId)) return null;
  const replies = all.filter((m) => m.id !== rootId);
  return {
    root,
    replies,
    channelId: root.channelId,
    replyCount: replies.length,
    participantIds: [...new Set(all.map((m) => m.authorId))],
    firstAt: all[0].at,
    lastAt: all[all.length - 1].at,
  };
}

/**
 * Every thread in a channel over a stretch of time, newest first — what a
 * channel summary is built from.
 * @param {string} asPersonId @param {string} channelId
 * @param {{from?: string, to?: string}} [range]
 */
export function listThreads(asPersonId, channelId, { from, to } = {}) {
  if (!canSeeChannel(asPersonId, channelId)) return [];
  const rows = (store().messagesByChannel.get(channelId) ?? []).filter((m) => within(m, from, to));
  const roots = [...new Set(rows.map((m) => m.threadRootId ?? m.id))];
  return roots
    .map((id) => getThread(asPersonId, id))
    .filter(Boolean)
    .sort((a, b) => b.root.at.localeCompare(a.root.at));
}

/** Messages and threads in a channel over a stretch of time, for "what I covered". */
export function coverage(asPersonId, channelId, { from, to } = {}) {
  const threads = listThreads(asPersonId, channelId, { from, to });
  const seen = listMessages(asPersonId, { channelId, from, to });
  return {
    channelId,
    from: from ?? null,
    to: to ?? null,
    threads: threads.length,
    messages: seen.length,
    people: new Set(seen.map((m) => m.authorId)).size,
  };
}

/* ------------------------------- Wiki ------------------------------- */

/** The wiki's top-level spaces, with how many pages this person can open in each. */
export function listWikiSpaces(asPersonId) {
  return store().wikiSpaces.map((space) => {
    const pages = store().pagesBySpace.get(space.id) ?? [];
    return {
      space,
      pageCount: pages.length,
      visiblePageCount: pages.filter((p) => canSeePage(asPersonId, p.id)).length,
    };
  });
}

/** @param {string} asPersonId @param {{spaceId?: string}} [opts] */
export function listWikiPages(asPersonId, { spaceId } = {}) {
  return store().wikiPages.filter(
    (p) => (!spaceId || p.spaceId === spaceId) && canSeePage(asPersonId, p.id),
  );
}

/** @param {string} asPersonId @param {string} pageId */
export function getWikiPage(asPersonId, pageId) {
  return canSeePage(asPersonId, pageId) ? store().wikiPagesById.get(pageId) : null;
}

/** A page's earlier versions, oldest first. Empty when they cannot open it. */
export function listPageRevisions(asPersonId, pageId) {
  return canSeePage(asPersonId, pageId) ? revisionsOf(pageId) : [];
}

/** What one revision changed, against the version before it. */
export function getPageChange(asPersonId, pageId, revisionId) {
  return canSeePage(asPersonId, pageId) ? changesIn(pageId, revisionId) : null;
}

/** The version a page reads as now. */
export function getCurrentRevision(asPersonId, pageId) {
  return canSeePage(asPersonId, pageId) ? currentRevision(pageId) : null;
}

/** The version before a given one, or null when it is the first. */
export function getPreviousRevision(asPersonId, pageId, revisionId) {
  return canSeePage(asPersonId, pageId) ? previousRevision(pageId, revisionId) : null;
}

/* ------------------------- The whole company ------------------------- */

/** Counts for a screen that wants to say what is loaded. */
export function companySummary() {
  const s = store();
  return {
    workspace: workspace.name,
    people: s.people.filter((p) => !p.isApp).length,
    channels: s.channels.filter((c) => c.kind !== 'dm').length,
    directMessages: s.channels.filter((c) => c.kind === 'dm').length,
    messages: s.messages.length,
    threads: new Set(s.messages.map((m) => m.threadRootId ?? m.id)).size,
    wikiSpaces: s.wikiSpaces.length,
    wikiPages: s.wikiPages.length,
    wikiRevisions: s.wikiRevisions.length,
  };
}
