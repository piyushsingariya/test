/**
 * The shapes the company's knowledge is kept in.
 *
 * Every record that a person can be shut out of carries an `audience`, so the
 * access rules in `lib/data/access.js` are the only place that decides who may
 * see what. Nothing else in the app should compare member lists by hand.
 *
 * @typedef {'workspace' | 'members' | 'people'} AudienceKind
 *   workspace — everyone with an account in the workspace can open it.
 *   members   — only the channel's own members (private channels, DMs).
 *   people    — only the people listed by id (restricted wiki pages).
 *
 * @typedef {object} Audience
 * @property {AudienceKind} kind
 * @property {string[]} [personIds]  Who may see it, when kind is 'people'.
 * @property {string} [reason]       Why it is restricted, for the admin screens.
 *
 * @typedef {'admin' | 'employee' | 'page_owner'} Role
 *
 * @typedef {object} Person
 * @property {string} id
 * @property {string} name
 * @property {string} initials
 * @property {string} title
 * @property {string} team
 * @property {Role[]} roles
 * @property {boolean} [isApp]  True for Vendi itself.
 *
 * @typedef {'public' | 'private' | 'dm'} ChannelKind
 *
 * @typedef {object} Channel
 * @property {string} id
 * @property {string} name            '#support', or 'Vendi' for a DM.
 * @property {ChannelKind} kind
 * @property {string} purpose
 * @property {string[]} memberIds
 * @property {number} memberCount     What Slack shows; memberIds is the seeded sample of it.
 * @property {boolean} vendiIsMember  Whether Vendi was invited to it.
 * @property {Audience} audience
 *
 * @typedef {object} Message
 * @property {string} id
 * @property {string} channelId
 * @property {string} authorId
 * @property {string} at              ISO 8601.
 * @property {string} text
 * @property {string|null} threadRootId  null for a top-level message, else the root's id.
 * @property {Audience} audience      Copied from its channel when seeded, so a message
 *                                    can be checked without loading the channel.
 *
 * @typedef {object} WikiSpace
 * @property {string} id
 * @property {string} name            'Finance'
 * @property {string} blurb
 *
 * @typedef {object} WikiSection
 * @property {string} id
 * @property {string} heading
 * @property {string} body
 *
 * @typedef {object} WikiRevision
 * @property {string} id
 * @property {string} pageId
 * @property {string} at              ISO 8601.
 * @property {string} byId            Who wrote this version.
 * @property {string|null} acceptedById  The page owner who accepted it, when Vendi wrote it.
 * @property {string} summary         'page created', '"Approval time" rewritten'.
 * @property {WikiSection[]} sections The whole page as it read after this revision.
 * @property {{kind: 'channel'|'message'|'page', id: string, label: string}[]} sources
 *                                    The conversation a Vendi-made change came from.
 *
 * @typedef {object} WikiPage
 * @property {string} id
 * @property {string} spaceId
 * @property {string} title
 * @property {string} ownerId
 * @property {Audience} audience
 * @property {WikiSection[]} sections    The page as it reads now.
 * @property {string} lastEditedAt
 * @property {string} lastEditedById
 * @property {string[]} revisionIds      Oldest first; the last one made `sections`.
 */

export {};
