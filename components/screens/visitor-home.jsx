// visitor/home — the home page, built from the locked prototype screen.
import { SAMPLE_ASK } from '../../lib/sample'
import { SlackMessage, SlackSurface, SlackText } from '../slack'
import { VendiReply } from '../vendi-reply'
import { Button, Card, Eyebrow, Grid, Lede, Note, Page, Row, ScreenFoot, Section, StoryCard, Tag } from '../ui'

export function VisitorHome() {
  return (
    <Page>
      <Section>
        <Eyebrow>An AI coworker in Slack</Eyebrow>
        <h1 className="display">Vendi already knows how your company works.</h1>
        <p className="subtitle">
          Vendi sits in your Slack with the context your team has built up — threads, channels, and your
          Notion wiki. Ask it a question and it answers with the sources it used. Ask it to summarise a
          thread and it does. And when Slack settles something the wiki still gets wrong, Vendi writes the
          edit and sends it to the page’s owner.
        </p>
        <Row className="mt-lg">
          <Button kind="primary" size="lg" href="/admin/install">
            Add Vendi to Slack
          </Button>
          <Tag kind="fake">Not built yet — nothing installs</Tag>
        </Row>
        <Note className="mt-xs">
          Nothing installs yet. Adding Vendi to a Slack workspace is built in a later step; this button
          opens the screen an admin will see.
        </Note>
      </Section>

      <Section sunken>
        <h2 className="title">What Vendi does</h2>
        <Lede>Three things in the first version. Nothing else.</Lede>
        <Grid columns={3} className="mt-lg">
          <Card title="Answers, with its sources">
            Ask in a channel or a DM. Vendi answers from your Slack history and your Notion wiki, and shows
            every page and message it read. If it cannot find the answer, it says so instead of guessing.
          </Card>
          <Card title="Summarises a thread or a channel">
            Mention Vendi in a long thread and it writes up what was said, what was decided, and what is
            still open — in the thread, where everyone can see it.
          </Card>
          <Card title="Keeps Notion honest">
            When a Slack thread settles something the wiki contradicts, Vendi drafts the page edit and sends
            it to that page’s owner. The owner accepts or declines it.
          </Card>
        </Grid>
      </Section>

      <Section>
        <Row spread>
          <h2 className="title">How Vendi sounds</h2>
          <Tag kind="sample">Sample conversation — not a real message</Tag>
        </Row>
        <Lede>Short, plain, and never more certain than its sources.</Lede>

        <SlackSurface className="mt-lg">
          <SlackMessage
            author={SAMPLE_ASK.asker.author}
            initials={SAMPLE_ASK.asker.initials}
            time={SAMPLE_ASK.asker.time}
          >
            <SlackText>{SAMPLE_ASK.question}</SlackText>
          </SlackMessage>
          <VendiReply {...SAMPLE_ASK.reply} noticeFirst />
        </SlackSurface>

        <Grid columns={2} className="mt-lg">
          <Card title="It shows its work">
            Every answer carries the messages and pages it came from, so you can check it in one click.
          </Card>
          <Card title="It says when it doesn’t know">
            No source, no answer. Vendi tells you what it looked at and who is likely to know instead.
          </Card>
        </Grid>
      </Section>

      <Section sunken>
        <h2 className="title">What Vendi does not do</h2>
        <Lede>
          Worth saying plainly, because a coworker with your company’s context should have limits.
        </Lede>
        <Grid columns={3} className="mt-lg">
          <Card title="It never edits the wiki on its own">
            Every Notion change is a proposal. The page’s owner accepts or declines it, and nothing changes
            until they do.
          </Card>
          <Card title="Slack only, Notion only">
            The first version lives in Slack and reads Notion. No other chat tool, no other wiki.
          </Card>
          <Card title="It doesn’t act in your other tools">
            Vendi will not file a ticket, send an email or change a record anywhere else. It answers, it
            summarises, it proposes.
          </Card>
        </Grid>
      </Section>

      <Section>
        <h2 className="title">Walk through Vendi</h2>
        <Lede>
          Three people, three stories. The screens are being built one step at a time, and any screen that
          is not built yet says so when you open it.
        </Lede>

        <Grid columns={3} className="mt-lg">
          <StoryCard step="Story 1" title="An employee asks Vendi something" href="/employee/ask" go="Walk it">
            Priya mentions Vendi in a channel, gets an answer with its sources, and asks it to summarise the
            thread she is standing in.
          </StoryCard>
          <StoryCard step="Story 2" title="A page owner decides on an edit" href="/owner/proposal" go="Walk it">
            Marco owns the Refunds policy page. Vendi sends him a correction it drafted from Slack, and he
            accepts or declines it.
          </StoryCard>
          <StoryCard step="Story 3" title="An admin connects and audits" href="/admin/install" go="Walk it">
            Dana installs Vendi, connects Slack and Notion, sees what it has read and when, and checks what
            it has answered and proposed.
          </StoryCard>
        </Grid>

        <Grid columns={2} className="mt-lg">
          <StoryCard step="Reference" title="Anatomy of a Vendi reply" href="/visitor/anatomy">
            Every part of what Vendi posts in Slack, named: the answer, the sources under it, and what a
            person can do next.
          </StoryCard>
          <StoryCard step="Reference" title="Design language" href="/visitor/design">
            The type, colour, spacing and buttons every screen in Vendi is built from.
          </StoryCard>
        </Grid>

        <Note className="mt-md">
          Names, messages, pages and dates on this page are sample data. Nothing here is a real customer,
          and no numbers are claimed.
        </Note>
      </Section>

      <ScreenFoot
        showHome={false}
        note="You are on the home page."
        links={[{ href: '/employee/ask', label: 'Start story 1 →' }]}
      />
    </Page>
  )
}
