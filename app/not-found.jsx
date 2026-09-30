import { Button, Eyebrow, Lede, Note, Page, Row, ScreenFoot, Section, Tag } from '../components/ui'

// Every screen of Vendi is built one step at a time. Until a step builds its
// screen, its route lands here and says so rather than pretending to work.
export const metadata = { title: 'Not built yet — Vendi' }

export default function NotFound() {
  return (
    <Page>
      <Section>
        <Eyebrow>Not built yet</Eyebrow>
        <h1 className="title">This screen is not built yet.</h1>
        <Lede>
          Vendi is being built one screen at a time. Nothing was lost and nothing went wrong — the screen
          you asked for has not been built yet, or there is nothing at this address.
        </Lede>
        <Row className="mt-lg">
          <Tag kind="fake">Coming in a later step</Tag>
        </Row>
        <Row className="mt-md">
          <Button kind="primary" href="/">
            Back to the home page
          </Button>
          <Button href="/visitor/anatomy">Anatomy of a reply</Button>
          <Button href="/visitor/design">Design language</Button>
        </Row>
        <Note className="mt-md">
          The home page says what Vendi does, what it will not do, and which screens exist so far.
        </Note>
      </Section>
      <ScreenFoot note="Nothing here yet." />
    </Page>
  )
}
