# Vendi

An AI coworker that lives in a company's Slack. It answers from the company's own
knowledge with a source under every answer, summarises threads and channels on
request, and proposes edits to the Notion wiki that the page's owner accepts or
declines. It never answers anyone from something they could not open themselves.

## Stack

**Next.js 16, App Router, plain JavaScript.** React 19. No TypeScript, no CSS
framework, no state library, no HTTP client — `fetch` is enough.

Chosen on step 1 and settled: Vendi needs real screens *and* a server that
decides who may see what. A browser-only stack would push access control into
the client, where it is not access control. Do not change the stack unless a
step's brief says to.

| | |
|---|---|
| Entry | `app/` (App Router). There is no root `index.html`. |
| Install | `npm install` |
| Run | `npm run dev` — reads `$PORT` and `$HOST`, falls back to 3000 / 0.0.0.0 |
| Build | `npm run build` |
| Test | `npm test` — `node --test`, files under `test/` |

`next.config.js` sets `agentRules: false`, because Next 16 otherwise overwrites
this file on every `next dev`.

## Layout

```
app/                 routes and screens (App Router)
  globals.css        the design tokens, and nothing else
  layout.js          <html>/<body>
  page.js            the home route
lib/data/            the company's knowledge — see below
test/                node:test, one file per concern
prototype/           the locked walkthrough Design built. Reference, not shipped code.
```

## The company's knowledge — `lib/data`

**Everything about the company is read through `lib/data/index.js`.** No route,
screen or later module imports `lib/data/seed/*` or `lib/data/store.js`
directly.

Every read takes the person doing the reading as its first argument:

```js
import { listThreads, getWikiPage, listPageRevisions } from '@/lib/data/index.js';

listThreads('per_priya', 'ch_support', { from, to });  // only what Priya can open
getWikiPage('per_priya', 'pg_board_pack');             // null — restricted in Notion
```

There is no call that returns "all messages". Access is the argument, not a
filter a caller can forget. An unknown person id reads as nobody, never as
everyone.

- **Who may see what** lives only in `lib/data/access.js`. A screen never
  compares member lists itself.
- Every channel, message and wiki page carries an `audience`:
  `workspace` (anyone with an account), `members` (a private channel or a DM),
  `people` (a restricted wiki page, by id).
- **Wiki history**: every page keeps a full snapshot of its sections at each
  revision, so any version can be read against the one before it —
  `getPageChange(personId, pageId, revisionId)`.
- **Nothing in `lib/data` writes.** A step that adds state — what Vendi has
  read, its answers, the activity log — owns its own store and calls this one
  for the company.

### Where the data lives

`DATABASE_URL` is unset in the preview, so the store is in memory behind
`lib/data/store.js` and is lost on restart. When a Postgres exists, only that
file changes. No SQLite, no JSON files on disk.

### Northwind is sample data

The loaded company — people, channels, 471 messages, 100 wiki pages — is
invented, and every screen that shows it says so. Never present it as a real
workspace, and never invent proof of anything: no user counts, no ratings, no
testimonials.

## Visual language

The tokens in `app/globals.css` are the whole palette, type scale, spacing
scale, radii and shadows. **Add no colour, font, size, space or radius of your
own** — if a screen seems to need one, it is using the wrong token.

- **Vendi's own surfaces**: warm paper `--color-bg`, deep ink `--color-ink`,
  one indigo accent `--color-accent`. `--font-sans`.
- **Slack**, drawn as someone else's window: the `--color-slack-*` tokens,
  `--font-slack`. Vendi's accent never bleeds into Slack chrome.
- **Notion**, the wiki: the `--color-notion-*` tokens, `--font-notion`.
- Type scale `--font-size-xs` … `--font-size-3xl`; weights 400 / 550 / 700.
- Spacing `--space-3xs` (2px) … `--space-3xl` (72px). Radii `--radius-xs` …
  `--radius-pill`.
- `--color-fake` / `--color-fake-soft` are reserved for labelling something as
  mocked or sample. Nothing else uses them.

`prototype/styles.css` is where these came from and shows every shared
component in every state. Read it before building a screen.

### Rules for a screen

- Semantic HTML. Buttons are `<button>`, navigation is `<nav>`, every input has
  a label, everything clickable works from the keyboard.
- Every control is styled, including `:hover`, `:focus-visible` and
  `:disabled`. No browser defaults.
- Anything rendered from data has a loading, an empty and a failed state. A
  panel that goes blank on failure reads as a broken app.
- **Label every mock on the screen, visibly.** What is not built yet reads as
  "coming soon" — never as a result.
- Locked screens are built at a route named by the screen
  (`admin/sources` → `/admin/sources`), with that screen's own words.

## Rules that do not bend

- The spec is binding. A requirement it does not have does not exist.
- Never invent a server API. A screen calls only endpoints that exist in this
  tree, spelled exactly as they are.
- A failed request is not an empty result. Loading, empty, failed and
  not-configured are four different states.
- Never write a secret into a file. Secrets are environment variables, named in
  `.env.example` with no value.
- Vendi never changes a wiki page without that page's owner accepting it.
