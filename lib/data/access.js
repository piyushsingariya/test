/**
 * Who may see what.
 *
 * Every read in the app goes through here. Vendi answers a person only from
 * what that person could open themselves, so there is one rule, in one place,
 * and no screen is allowed to decide it for itself.
 *
 * A person who is not in the workspace at all sees nothing. An unknown id is
 * not "everyone" — it is nobody.
 */
import { store } from './store.js';

/**
 * @param {string} personId
 * @param {import('./types.js').Audience} audience
 */
export function audienceAllows(personId, audience) {
  const person = store().peopleById.get(personId);
  if (!person) return false;
  if (!audience) return false;
  switch (audience.kind) {
    case 'workspace':
      return true;
    case 'people':
      return (audience.personIds ?? []).includes(personId);
    case 'members':
      // 'members' is only meaningful against a channel's member list; the
      // channel and message helpers below pass that in. On its own it denies.
      return false;
    default:
      return false;
  }
}

/** @param {string} personId @param {string} channelId */
export function canSeeChannel(personId, channelId) {
  const channel = store().channelsById.get(channelId);
  if (!channel) return false;
  if (!store().peopleById.has(personId)) return false;
  if (channel.audience.kind === 'members') return channel.memberIds.includes(personId);
  return audienceAllows(personId, channel.audience);
}

/** @param {string} personId @param {string} messageId */
export function canSeeMessage(personId, messageId) {
  const message = store().messagesById.get(messageId);
  if (!message) return false;
  return canSeeChannel(personId, message.channelId);
}

/** @param {string} personId @param {string} pageId */
export function canSeePage(personId, pageId) {
  const page = store().wikiPagesById.get(pageId);
  if (!page) return false;
  return audienceAllows(personId, page.audience);
}

/** Why a person cannot see something, in words an admin screen can show.
 * @param {string} personId @param {string} channelId
 * @returns {string|null} null when they can see it.
 */
export function whyChannelHidden(personId, channelId) {
  if (canSeeChannel(personId, channelId)) return null;
  const channel = store().channelsById.get(channelId);
  if (!channel) return 'No such channel.';
  if (!store().peopleById.has(personId)) return 'Not a member of this workspace.';
  if (channel.kind === 'dm') return 'A direct message between other people.';
  return 'A private channel they are not in.';
}

/** @param {string} personId @param {string} pageId */
export function whyPageHidden(personId, pageId) {
  if (canSeePage(personId, pageId)) return null;
  const page = store().wikiPagesById.get(pageId);
  if (!page) return 'No such page.';
  if (!store().peopleById.has(personId)) return 'Not a member of this workspace.';
  return page.audience.reason ?? 'Restricted in Notion.';
}
