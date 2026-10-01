# Portfolio — Piyush Singariya

## Scene
One engineer's page, read at 11pm by a recruiter with twelve tabs open, or on a phone on a
train by someone who just closed his repo. It is a printed page held up to the light, not a
console and not a dashboard — so the site is light, on paper.

## Thesis
A tankōbon volume about one engineer: pulp paper, hard black ink rules, one spot of press red,
and the structure of a shonen databook — the page that says what this character actually did,
as against what his party did.

The seven things this audience knows by heart: the pulp interior paper of a manga volume; a
panel, ruled in hard black ink; a databook character page (name, affiliation, arc, feats); a
screentone dot field; a trace waterfall of nested spans in milliseconds; a columnar file
layout — row groups, column chunks, footer offsets; `git log --graph` lanes and short SHAs.
Built from the first three: the paper, the panel, and the databook page. The last four are the
notation that later screens will borrow when they show real work.

## Colour
**Restrained.** Pulp paper and press black carry the whole site. One press red is the only hue,
and it only marks what is live: what he is open to, the section you are on, the action, and the
line that says what he personally did.

Seed: the red of an obi, the paper band printed with one selling line and wrapped around a
Japanese book. It belongs here because the band's job and the site's job are the same.

- **Paper** `#dde0d7` — the page. Recycled pulp: cool, faintly green-grey.
- **Panel** `#eaede4` — the brighter stock a panel is printed on.
- **Ink** `#141612` — press black. Every word and every structural rule.
- **Press red** `#d8262c` — availability, current section, primary action. Nothing else.
- **Tone** `#cfd3c8` — screentone fill and sunken areas.
- **Pencil** `#51554a` — secondary text, captions, the credit block.

The neutrals are tinted *away* from the red seed, not toward it. Warming pulp paper toward red
lands it on `#f4f1ea`, the generated-design cream this direction exists to avoid; recycled
newsprint is cool and slightly green anyway, so the material and the escape agree.

## Type
- **Bowlby One SC** for display. An ultra-heavy small-caps gothic — which is what a manga logo
  and a sound effect are set in. Display only, never under 1.25rem, never on a label.
- **M PLUS 2** for everything else. M+ is the Japanese libre family; it reads cleanly from
  0.8rem to 1.25rem and comes from the same world as the paper. Weights 400 / 500 / 700.
- **M PLUS 1 Code** for short SHAs, repo paths and durations — real code, and nothing else.
- Scale 1.25 from 16px, fixed rem steps. Hierarchy by weight and colour first.

## Shape
Radius 0 everywhere: a printed page has no rounded corners. Elevation is a **2px ink rule**, never
a shadow — with one exception, the portrait on the landing screen, which has a flat offset ink
shadow and no border, the way a photo is tipped onto a page. Density regular: tight inside a
panel, `--space-10` between panels.

The work screens borrow one of the notations: a `git log --graph` lane down the left of the four
bodies of work, a 2px ink rule with a filled node at each one, so four parallel things read as four
and not as one career. Repo paths and short SHAs are set in M PLUS 1 Code.

Layout is one column of panels, not a grid of cards. Desktop: a masthead, the obi under it, a
68rem column, the credit block at the foot. Phone: the same column full-bleed, a five-tab bar at
the foot of the document, with the obi and a mail button at the head, so contact and availability
are both in reach without scrolling.

## Signature
**The obi.** The red paper band wrapped around a Japanese book, printed with the one line that
sells it. Here it is fixed under the masthead on every screen and carries what he is currently
open to, white on press red, an ink rule above it. It is the only saturated surface on the site;
everything else is black on paper.

## Refuse
- The terminal portfolio: near-black page, acid-green mono, `$ whoami`, a blinking caret.
- The cream résumé: `#f4f1ea`, a high-contrast serif, a terracotta accent.
- A three-up grid of project cards with soft grey shadows and tech-stack pills.
- A skills logo cloud, a years-of-experience number, "Hi, I'm Piyush 👋".
- Emoji as icons, 01 / 02 / 03 section numbers, tracked-out capital eyebrows, an arrow glued to
  every link.
- Any anime artwork he does not own. The reference is in the type and the panel, not in fan art.

## Reflex check
- Colour, first draft: *warm cream paper, deep ink, a terracotta accent.* That is the generated
  default word for word. Replaced with pulp grey-tan at a lower lightness and a press red taken
  from a specific printed object, the obi band — not from a mood.
- Type, first draft: *a high-contrast serif for display, a grotesk for body.* Every portfolio
  gets that answer. Replaced with Bowlby One SC, which only makes sense because manga logos are
  ultra-heavy gothics, and M PLUS 2, which comes from the same country as the paper.
- Shape, first draft: *cards, 12px radius, a soft shadow under each.* Replaced with 0 radius and
  2px ink rules. Panels, not cards; the one shadow left is flat and black, because that is what
  a print drop shadow is.
- Signature, first draft: *a big hero number with a small label.* Replaced with the obi, which
  does a job the spec requires — availability visible from every screen — instead of decorating.
