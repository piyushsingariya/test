// visitor/design — the design language every later screen is built from,
// rendered live from the same stylesheet the app uses.
import { SlackButton } from '../slack'
import { Button, Eyebrow, Grid, Lede, Note, Page, Row, ScreenFoot, Section, SourceChip, Tag } from '../ui'

function Swatch({ token, use, chip }) {
  return (
    <div className="swatch">
      <div className={`swatch-chip swatch-chip-${chip}`} />
      <div className="swatch-body">
        <span className="token">{token}</span>
        <span className="swatch-use">{use}</span>
      </div>
    </div>
  )
}

function SwatchGrid({ swatches }) {
  return (
    <div className="swatch-grid mt-sm">
      {swatches.map((swatch) => (
        <Swatch key={swatch.token} {...swatch} />
      ))}
    </div>
  )
}

const PAPER = [
  { token: '--color-bg', use: 'Behind everything', chip: 'bg' },
  { token: '--color-surface', use: 'Cards, panels, pages', chip: 'surface' },
  { token: '--color-surface-sunken', use: 'A section set back', chip: 'sunken' },
  { token: '--color-line', use: 'Every border', chip: 'line' },
  { token: '--color-ink', use: 'Headings and body', chip: 'ink' },
  { token: '--color-ink-soft', use: 'Supporting text', chip: 'ink-soft' },
  { token: '--color-ink-faint', use: 'Timestamps, notes', chip: 'ink-faint' },
  { token: '--color-accent-soft', use: 'Source chips, selection', chip: 'accent-soft' },
]

const MEANING = [
  { token: '--color-accent', use: 'Vendi itself, and the one action', chip: 'accent' },
  { token: '--color-good', use: 'Accepted, connected, added text', chip: 'good' },
  { token: '--color-warm', use: 'Out of date, removed text', chip: 'warm' },
  { token: '--color-warn', use: 'Sample data, needs a look', chip: 'warn' },
  { token: '--color-fake', use: 'Not built yet', chip: 'fake' },
]

const SLACK = [
  { token: '--color-slack-rail', use: 'Slack’s sidebar', chip: 'slack-rail' },
  { token: '--color-slack-rail-active', use: 'The open channel', chip: 'slack-active' },
  { token: '--color-slack-line', use: 'Slack’s dividers', chip: 'slack-line' },
]

const NOTION = [
  { token: '--color-notion-rail', use: 'Notion’s sidebar', chip: 'notion-rail' },
  { token: '--color-notion-line', use: 'Notion’s dividers', chip: 'notion-line' },
  { token: '--color-notion-mark', use: 'Words Vendi changed', chip: 'notion-mark' },
]

const TYPE = [
  {
    sample: <span className="display">Vendi knows</span>,
    token: '--font-size-3xl',
    weight: 'bold',
    use: 'One headline per landing screen. Nothing else.',
  },
  {
    sample: <span className="title">Section heading</span>,
    token: '--font-size-xl',
    weight: 'bold',
    use: 'The heading of a section.',
  },
  {
    sample: <span className="subtitle">A standfirst under the headline</span>,
    token: '--font-size-lg',
    weight: 'normal',
    use: 'The line that explains the headline.',
  },
  {
    sample: 'Body copy sits at the base size.',
    token: '--font-size-md',
    weight: 'normal',
    use: 'Everything read at length, and every Slack message.',
  },
  {
    sample: <span className="card-body">Supporting copy inside a card.</span>,
    token: '--font-size-sm',
    weight: 'normal',
    use: 'Cards, table cells, buttons, index.',
  },
  {
    sample: <span className="fake-note">Timestamps, sources, notes</span>,
    token: '--font-size-xs',
    weight: 'normal',
    use: 'Metadata, tags, and anything admitting a screen is not built yet.',
  },
  {
    sample: <span className="eyebrow">An eyebrow</span>,
    token: '--font-size-xs',
    weight: 'medium, tracked',
    use: 'The label above a headline.',
  },
]

const SPACE = [
  { step: '3xs', size: '2px', use: 'Between a label and its icon.' },
  { step: '2xs', size: '4px', use: 'Between source chips.' },
  { step: 'xs', size: '8px', use: 'Inside a Slack message row.' },
  { step: 'sm', size: '12px', use: 'Button padding, row padding.' },
  { step: 'md', size: '16px', use: 'Card padding, grid gaps.' },
  { step: 'lg', size: '24px', use: 'Between a heading and what follows.' },
  { step: 'xl', size: '32px', use: 'Between blocks in a section.' },
  { step: '2xl', size: '48px', use: 'Section padding.' },
  { step: '3xl', size: '72px', use: 'The tallest opening section.' },
]

const RADIUS = [
  { step: 'xs', use: 'chips, Slack buttons' },
  { step: 'sm', use: 'buttons, inputs' },
  { step: 'md', use: 'cards, panels' },
  { step: 'lg', use: 'a whole page' },
  { step: 'pill', use: 'tags, markers' },
]

const SHADOW = [
  { step: 'sm', use: 'a resting panel' },
  { step: 'md', use: 'something lifted under the cursor' },
  { step: 'lg', use: 'a dialog over the screen' },
]

export function VisitorDesign() {
  return (
    <Page>
      <Section>
        <Eyebrow>Reference</Eyebrow>
        <h1 className="title">Vendi’s design language</h1>
        <Lede>
          Warm paper, deep ink, one indigo accent. Vendi is a coworker, not a chatbot: the screens read like
          a well-set document, and the only saturated colour on a screen is the thing you are meant to act
          on. Slack’s own colours are kept in a separate set, so Vendi’s surfaces and Slack’s never blur
          into each other.
        </Lede>
      </Section>

      <Section sunken>
        <h2 className="title">Colour</h2>
        <Lede>Every colour on every screen is one of these. No screen uses a colour that is not named here.</Lede>

        <h3 className="card-title mt-lg">Paper and ink</h3>
        <SwatchGrid swatches={PAPER} />

        <h3 className="card-title mt-lg">Accent and meaning</h3>
        <SwatchGrid swatches={MEANING} />

        <h3 className="card-title mt-lg">Slack’s colours, kept separate</h3>
        <p className="card-body">Used only inside a Slack window, never on one of Vendi’s own surfaces.</p>
        <SwatchGrid swatches={SLACK} />

        <h3 className="card-title mt-lg">Notion’s colours, kept separate</h3>
        <p className="card-body">Used only inside a wiki page, never on one of Vendi’s own surfaces.</p>
        <SwatchGrid swatches={NOTION} />
      </Section>

      <Section>
        <h2 className="title">Type</h2>
        <Lede>
          One family on Vendi’s own screens, and Slack’s own face inside a Slack window, so a message never
          looks like part of Vendi’s interface.
        </Lede>
        <table className="spec-table mt-lg">
          <thead>
            <tr>
              <th scope="col">Style</th>
              <th scope="col">Token</th>
              <th scope="col">Used for</th>
            </tr>
          </thead>
          <tbody>
            {TYPE.map((row) => (
              <tr key={row.token + row.weight}>
                <td>{row.sample}</td>
                <td>
                  <span className="token">{row.token}</span> / {row.weight}
                </td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Note className="mt-md">
          Faces: <span className="token">--font-sans</span> Inter on Vendi’s screens,{' '}
          <span className="token">--font-slack</span> Lato inside a Slack window,{' '}
          <span className="token">--font-mono</span> for token names. Each falls back to the system face;
          Vendi loads no font from the web.
        </Note>
      </Section>

      <Section sunken>
        <h2 className="title">Spacing</h2>
        <Lede>Nine steps. Every gap, pad and margin in the app is one of them.</Lede>
        <table className="spec-table mt-lg">
          <thead>
            <tr>
              <th scope="col">Step</th>
              <th scope="col">Size</th>
              <th scope="col">Where it is used</th>
            </tr>
          </thead>
          <tbody>
            {SPACE.map((row) => (
              <tr key={row.step}>
                <td>
                  <span className={`space-bar space-bar-${row.step}`} />
                </td>
                <td>
                  <span className="token">{`--space-${row.step}`}</span> {row.size}
                </td>
                <td>{row.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section>
        <h2 className="title">Buttons</h2>
        <Lede>
          One primary action per screen at most. Everything else is quiet. The states below are drawn
          standing still — hover and focus are real on the live buttons too.
        </Lede>
        <table className="spec-table mt-lg">
          <thead>
            <tr>
              <th scope="col">Kind</th>
              <th scope="col">Default</th>
              <th scope="col">Hover</th>
              <th scope="col">Focus</th>
              <th scope="col">Disabled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Primary — the one thing to do</td>
              <td>
                <Button kind="primary">Connect Notion</Button>
              </td>
              <td>
                <Button kind="primary" className="is-hover">
                  Connect Notion
                </Button>
              </td>
              <td>
                <Button kind="primary" className="is-focus">
                  Connect Notion
                </Button>
              </td>
              <td>
                <Button kind="primary" disabled>
                  Connect Notion
                </Button>
              </td>
            </tr>
            <tr>
              <td>Secondary — a real alternative</td>
              <td>
                <Button>Decline</Button>
              </td>
              <td>
                <Button className="is-hover">Decline</Button>
              </td>
              <td>
                <Button className="is-focus">Decline</Button>
              </td>
              <td>
                <Button disabled>Decline</Button>
              </td>
            </tr>
            <tr>
              <td>Quiet — a way out</td>
              <td>
                <Button kind="quiet">Not now</Button>
              </td>
              <td>
                <Button kind="quiet" className="is-hover">
                  Not now
                </Button>
              </td>
              <td>
                <Button kind="quiet" className="is-focus">
                  Not now
                </Button>
              </td>
              <td>
                <Button kind="quiet" disabled>
                  Not now
                </Button>
              </td>
            </tr>
            <tr>
              <td>Inside Slack — Slack’s own shape</td>
              <td>
                <SlackButton go>Accept</SlackButton>
              </td>
              <td>
                <SlackButton>Shorter</SlackButton>
              </td>
              <td>
                <SlackButton>Show sources</SlackButton>
              </td>
              <td>
                <span className="fake-note">Slack draws its own disabled state.</span>
              </td>
            </tr>
          </tbody>
        </table>
        <Note className="mt-md">
          Large is <span className="token">.btn-lg</span>, for the home page only. The buttons in this table
          are specimens: they do nothing.
        </Note>
      </Section>

      <Section sunken>
        <h2 className="title">Corners, shadow and labels</h2>
        <Grid columns={2} className="mt-lg">
          <div className="card">
            <h3 className="card-title">Radius</h3>
            <table className="spec-table mt-sm">
              <tbody>
                {RADIUS.map((row) => (
                  <tr key={row.step}>
                    <td>
                      <span className={`radius-box radius-box-${row.step}`} />
                    </td>
                    <td>
                      <span className="token">{`--radius-${row.step}`}</span> {row.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h3 className="card-title">Shadow</h3>
            <p className="card-body">Barely there. Depth comes from the borders, not the shadows.</p>
            <table className="spec-table mt-sm">
              <tbody>
                {SHADOW.map((row) => (
                  <tr key={row.step}>
                    <td>
                      <span className={`shadow-box shadow-box-${row.step}`} />
                    </td>
                    <td>
                      <span className="token">{`--shadow-${row.step}`}</span> {row.use}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Grid>

        <h3 className="card-title mt-lg">Labels</h3>
        <Row className="mt-sm">
          <Tag>Neutral</Tag>
          <Tag kind="good">Connected</Tag>
          <Tag kind="warm">Out of date</Tag>
          <Tag kind="sample">Sample data</Tag>
          <Tag kind="fake">Not built yet</Tag>
          <SourceChip>Notion · a source Vendi read</SourceChip>
        </Row>
        <Note className="mt-md">
          The purple label goes on every control a later step still has to build, so nothing on a screen
          pretends to work.
        </Note>
      </Section>

      <ScreenFoot
        note="Reference · not part of a story"
        links={[{ href: '/visitor/anatomy', label: 'Anatomy of a reply →' }]}
      />
    </Page>
  )
}
