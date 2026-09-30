# Vendi — how this project is built

Vendi is an AI coworker that lives in a company's Slack: it answers questions from the
company's own Slack history and Notion wiki with its sources, summarises threads and
channels, and proposes Notion edits for a page's owner to accept or decline.

## Stack

**next** (Next.js 16, App Router, React 19, plain JavaScript — no TypeScript).
Chosen once, on steps 1 and 2, which were built beside each other and reached the
same answer: Vendi needs real screens *and* a server that decides who may see
what, and a browser-only stack would push access control into the client, where
it is not access control. Do not change it, add a second stack, or introduce a
component/CSS framework: the design language below is the whole system.

`package.json` is `"type": "module"`, so `next.config.js` is ESM. It also sets
`agentRules: false`, because Next 16 otherwise overwrites this file on every
`next dev`.

- Pages are `.jsx` under `app/`. Screens are components under `components/screens/`, so a
  route file stays three lines and a screen can be reused.
- Shared pieces live in `components/`: `ui.jsx` (page, section, card, button, tag, source
  chip, story card, screen foot), `slack.jsx` (the drawing of Slack), `vendi-reply.jsx`
  (the shape of every reply Vendi posts), `site-header.jsx`, `site-footer.jsx`.
- The company's knowledge lives in `lib/data/` — see below. `lib/sample.js` is
  hand-written illustration copy for the home page and the reply reference only;
  a screen that shows the company reads `lib/data`, not `lib/sample`.
- Anything shown on a screen that is not real must be labelled on the screen with
  `<Tag kind="sample">` or `<Tag kind="fake">`.
- `prototype/` is the locked walkthrough the screens are built from. It is reference, not
  app code: never import from it and never serve it.

## Commands

```
npm install        # install
npm run dev        # run: listens on $PORT (default 3000) and $HOST 0.0.0.0
npm run build      # build
npm start          # serve the build, same $PORT/$HOST
npm test           # node --test, files under test/
```

## Routes

A screen locked in the prototype is built at a route named by its screen:
`persona/screen` → `/persona/screen`. `visitor/home` is the home page and answers at both
`/` and `/visitor/home`.

Built so far: `/`, `/visitor/home`, `/visitor/design`, `/visitor/anatomy`, and
`/knowledge` — not a locked screen, but the company's knowledge layer rendered from
`lib/data` so a person can see what is loaded and that access is enforced in the store.
Placeholders a later step replaces: `/admin/install`, `/employee/ask`, `/owner/proposal`
(they render `ScreenSoon`). Everything else falls to `app/not-found.jsx`, which says the
screen is not built yet and links home. When you build a screen, delete its placeholder.

## The company's knowledge — `lib/data`

**Everything about the company is read through `lib/data/index.js`.** No route,
screen or later module imports `lib/data/seed/*` or `lib/data/store.js` directly.

Every read takes the person doing the reading as its first argument:

```js
import { listThreads, getWikiPage, listPageRevisions } from '../../lib/data/index.js'

listThreads('per_priya', 'ch_support', { from, to })  // only what Priya can open
getWikiPage('per_priya', 'pg_board_pack')             // null — restricted in Notion
```

There is no call that returns "all messages". Access is the argument, not a filter a
caller can forget, and an unknown person id reads as nobody, never as everyone.

- **Who may see what** lives only in `lib/data/access.js`. A screen never compares
  member lists itself.
- Every channel, message and wiki page carries an `audience`: `workspace` (anyone with
  an account), `members` (a private channel or a DM), `people` (a restricted wiki page,
  by id). `whyChannelHidden` / `whyPageHidden` give an admin screen the reason in words.
- **Wiki history**: every page keeps a full snapshot of its sections at each revision, so
  any version can be read against the one before it —
  `getPageChange(personId, pageId, revisionId)` returns each section as added, removed,
  changed or unchanged.
- **Nothing in `lib/data` writes.** A step that adds state — what Vendi has read, its
  answers, the activity log, an accepted edit — owns its own store and calls this one for
  the company.
- `DATABASE_URL` is unset in the preview, so the store is in memory behind
  `lib/data/store.js` and is lost on restart. When a Postgres exists, only that file
  changes. No SQLite, no JSON files on disk.

### Northwind is sample data

The loaded company — 12 people, 6 channels and 7 DMs, 471 messages across 82 threads,
100 wiki pages with an owner each — is invented, and its dates are anchored to a fixed
`workspace.today` of 2026-09-30 so they do not drift. Every screen that shows it says so.

## Visual language

All of it is in `app/globals.css`, ported from the locked screen `visitor/design`. Read
`/visitor/design` in the running app before you style anything.

- **Colour** — warm paper, deep ink, one indigo accent. `--color-bg #f7f5f2`,
  `--color-surface`, `--color-surface-sunken`, `--color-line`, `--color-line-strong`,
  `--color-ink`, `--color-ink-soft`, `--color-ink-faint`; `--color-accent #4a3ad6` with
  `--color-accent-soft` / `--color-accent-ink` / `--color-on-accent`; `--color-good`
  (accepted, added), `--color-warm` (out of date, removed), `--color-warn` (sample data),
  `--color-fake` (not built yet), each with a `-soft` pair.
- **Other people's surfaces** — Slack has its own set (`--color-slack-*`, face
  `--font-slack`) and Notion has its own (`--color-notion-*`, face `--font-notion`). Use
  them only inside a drawing of Slack or of a wiki page, never on one of Vendi's screens,
  and never use Vendi's accent as a Slack or Notion colour.
- **Type** — `--font-sans` (Inter, system fallback) on Vendi's screens. Sizes xs/sm/md/lg/
  xl/2xl/3xl, weights 400 / 550 / 700, leading 1.2 and 1.55. One `.display` per screen.
  No font is loaded from the web.
- **Space** — nine steps, `--space-3xs` 2px through `--space-3xl` 72px. Every gap, pad and
  margin is one of them.
- **Radius** — `--radius-xs` 4 (chips, Slack buttons), `-sm` 6 (buttons, inputs), `-md` 10
  (cards, panels), `-lg` 16 (a whole page), `-pill`.
- **Shadow** — `--shadow-sm/md/lg`, barely there; depth comes from borders.

Rules that hold everywhere:

- Never write a literal colour, font or pixel size in a rule. Use a token. If you need a
  value that does not exist, you are drawing something the design language does not have.
- One primary action per screen (`<Button kind="primary">`). Everything else is secondary
  or quiet. Hover, focus-visible and disabled are already styled — do not restyle them.
- Every control is a real control: `button` for actions, `Link` for navigation, a label on
  every input, keyboard reachable.
- Anything rendered from data needs a loading, an empty and a failed state.
- Every screen ends with a `ScreenFoot`, and the header brand links home from anywhere.
- Never invent proof or data presented as real: no user counts, ratings, logos or
  testimonials. Label every mock on the screen.
