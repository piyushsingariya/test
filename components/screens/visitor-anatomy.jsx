// visitor/anatomy — the shape of every reply Vendi posts in Slack, with each
// part named. The reply itself is the VendiReply component later steps fill.
import { SAMPLE_ANATOMY, SAMPLE_NO_ANSWER } from '../../lib/sample'
import { SlackMessage, SlackSurface, SlackText } from '../slack'
import { VendiReply } from '../vendi-reply'
import { Card, Eyebrow, Grid, Lede, Page, Row, ScreenFoot, Section, Tag } from '../ui'

const PARTS = [
  {
    n: 1,
    title: 'It is an app, and says so',
    body: 'Vendi posts under its own name with Slack’s APP badge. It is never mistaken for a colleague.',
  },
  {
    n: 2,
    title: 'The answer, first and short',
    body: 'The answer comes before the reasoning, in plain words, and never sounds more certain than its sources allow.',
  },
  {
    n: 3,
    title: 'Every source it read',
    body: 'One chip per Notion page or Slack message, each one a link to the thing itself. The count is what Vendi actually used, not what it searched.',
  },
  {
    n: 4,
    title: 'What it noticed on the way',
    body: 'When the wiki disagrees with what Slack settled, Vendi says so here — and says plainly that it will not edit the page itself.',
  },
  {
    n: 5,
    title: 'What you can do next',
    body: 'Two to four actions, never more. The one that changes something outside Slack is the green one, and it only ever proposes.',
  },
  {
    n: 6,
    title: 'Who can see it, and what it could see',
    body: 'The last line says whether the reply is private, and confirms Vendi answered only from content the asker already has access to.',
  },
]

export function VisitorAnatomy() {
  return (
    <Page>
      <Section>
        <Eyebrow>Reference</Eyebrow>
        <h1 className="title">The anatomy of a Vendi reply</h1>
        <Lede>
          Vendi has one shape in Slack, and every screen in the app uses it: what it found, where it found
          it, and what you can do about it. Nothing below is a real message.
        </Lede>
        <Row className="mt-md">
          <Tag kind="sample">Sample conversation — not a real message</Tag>
        </Row>
      </Section>

      <Section sunken>
        <div className="anno-layout">
          <SlackSurface>
            <SlackMessage
              author={SAMPLE_ANATOMY.asker.author}
              initials={SAMPLE_ANATOMY.asker.initials}
              time={SAMPLE_ANATOMY.asker.time}
            >
              <SlackText>{SAMPLE_ANATOMY.question}</SlackText>
            </SlackMessage>
            <VendiReply {...SAMPLE_ANATOMY.reply} annotated />
          </SlackSurface>

          <ol className="anno-list">
            {PARTS.map((part) => (
              <li className="anno-item" key={part.n}>
                <span className="anno-marker">{part.n}</span>
                <div>
                  <p className="anno-title">{part.title}</p>
                  <p className="anno-body">{part.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <h2 className="title">The same shape when Vendi does not know</h2>
        <Lede>
          No source, no answer. It says what it looked at and who is likely to know, and offers nothing
          else.
        </Lede>

        <SlackSurface className="mt-lg">
          <SlackMessage
            author={SAMPLE_NO_ANSWER.asker.author}
            initials={SAMPLE_NO_ANSWER.asker.initials}
            time={SAMPLE_NO_ANSWER.asker.time}
          >
            <SlackText>{SAMPLE_NO_ANSWER.question}</SlackText>
          </SlackMessage>
          <VendiReply {...SAMPLE_NO_ANSWER.reply} />
        </SlackSurface>

        <Grid columns={2} className="mt-lg">
          <Card title="What Vendi never puts in a reply">
            A confidence score, an apology, a source it did not read, or an answer drawn from a channel or
            page the person asking cannot open themselves.
          </Card>
          <Card title="Every button here is an illustration">
            This is a drawing of a Slack message, not Slack. The buttons on this screen do nothing at all.
          </Card>
        </Grid>
      </Section>

      <ScreenFoot
        note="Reference · not part of a story"
        links={[{ href: '/visitor/design', label: 'Design language →' }]}
      />
    </Page>
  )
}
