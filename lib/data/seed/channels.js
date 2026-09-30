/**
 * Northwind's Slack: public channels everyone in the workspace can open, one
 * private channel only its members can, and the direct messages.
 *
 * `audience` is what the access rules read. A public channel is open to the
 * whole workspace, exactly as Slack has it; a private channel and a DM are open
 * to their members and nobody else — not even to the workspace admin.
 */
import { VENDI_ID } from './people.js';

const EVERYONE = /** @type {const} */ ({ kind: 'workspace' });
const MEMBERS_ONLY = /** @type {const} */ ({ kind: 'members' });

/** @type {import('../types.js').Channel[]} */
export const channels = [
  {
    id: 'ch_support',
    name: '#support',
    kind: 'public',
    purpose: 'Where refund and policy questions land',
    memberIds: [
      'per_priya', 'per_ade', 'per_lin', 'per_ama', 'per_sam',
      'per_dana', 'per_marco', 'per_hana', 'per_nina', 'per_owen', VENDI_ID,
    ],
    memberCount: 31,
    vendiIsMember: true,
    audience: EVERYONE,
  },
  {
    id: 'ch_finance_ops',
    name: '#finance-ops',
    kind: 'public',
    purpose: 'Where the approval rules get settled',
    memberIds: ['per_marco', 'per_hana', 'per_dana', 'per_ruth', 'per_ade', VENDI_ID],
    memberCount: 12,
    vendiIsMember: true,
    audience: EVERYONE,
  },
  {
    id: 'ch_people_ops',
    name: '#people-ops',
    kind: 'public',
    purpose: 'Leave, onboarding, equipment',
    memberIds: ['per_tomas', 'per_dana', 'per_priya', 'per_ruth', 'per_lin', VENDI_ID],
    memberCount: 9,
    vendiIsMember: true,
    audience: EVERYONE,
  },
  {
    id: 'ch_general',
    name: '#general',
    kind: 'public',
    purpose: 'Announcements everyone can see',
    memberIds: [
      'per_dana', 'per_priya', 'per_marco', 'per_ade', 'per_lin', 'per_ama',
      'per_tomas', 'per_nina', 'per_sam', 'per_hana', 'per_ruth', 'per_owen', VENDI_ID,
    ],
    memberCount: 64,
    vendiIsMember: true,
    audience: EVERYONE,
  },
  {
    id: 'ch_random',
    name: '#random',
    kind: 'public',
    purpose: 'Lunch plans. Nothing gets decided here.',
    memberIds: ['per_priya', 'per_lin', 'per_sam', 'per_ade', 'per_dana', VENDI_ID],
    memberCount: 58,
    vendiIsMember: true,
    audience: EVERYONE,
  },
  {
    id: 'ch_product_private',
    name: '#product-private',
    kind: 'private',
    purpose: 'Unreleased roadmap. A member has to invite Vendi from inside it.',
    memberIds: ['per_owen', 'per_nina', 'per_ruth'],
    memberCount: 3,
    vendiIsMember: false,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_priya_vendi',
    name: 'Vendi',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_priya', VENDI_ID],
    memberCount: 2,
    vendiIsMember: true,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_marco_vendi',
    name: 'Vendi',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_marco', VENDI_ID],
    memberCount: 2,
    vendiIsMember: true,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_dana_vendi',
    name: 'Vendi',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_dana', VENDI_ID],
    memberCount: 2,
    vendiIsMember: true,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_tomas_vendi',
    name: 'Vendi',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_tomas', VENDI_ID],
    memberCount: 2,
    vendiIsMember: true,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_ama_vendi',
    name: 'Vendi',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_ama', VENDI_ID],
    memberCount: 2,
    vendiIsMember: true,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_priya_ade',
    name: 'Ade Salami',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_priya', 'per_ade'],
    memberCount: 2,
    vendiIsMember: false,
    audience: MEMBERS_ONLY,
  },
  {
    id: 'dm_priya_lin',
    name: 'Lin Chen',
    kind: 'dm',
    purpose: 'Direct message',
    memberIds: ['per_priya', 'per_lin'],
    memberCount: 2,
    vendiIsMember: false,
    audience: MEMBERS_ONLY,
  },
];
