import { Button, Eyebrow, Lede, Note, Page, Row, ScreenFoot, Section, Tag } from '../ui'

// A screen a later step builds. It is honest about that: it shows what will be
// here, claims nothing, and leaves a way back to the home page.
export function ScreenSoon({ screen, title, children }) {
  return (
    <Page>
      <Section>
        <Eyebrow>Not built yet</Eyebrow>
        <h1 className="title">{title}</h1>
        <Lede>{children}</Lede>
        <Row className="mt-lg">
          <Tag kind="fake">Not built yet — nothing here works</Tag>
        </Row>
        <Row className="mt-md">
          <Button kind="primary" href="/">
            Back to the home page
          </Button>
          <Button href="/visitor/anatomy">Anatomy of a reply</Button>
        </Row>
        <Note className="mt-md">This screen is {screen}. Nothing on it is connected to Slack or Notion.</Note>
      </Section>
      <ScreenFoot note="Not built yet." />
    </Page>
  )
}
