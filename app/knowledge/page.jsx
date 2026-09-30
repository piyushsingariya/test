import { Eyebrow, Lede, Note, Page, Row, ScreenFoot, Section, Tag } from '../../components/ui'
import {
  workspace, companySummary, listChannelsForAdmin, listWikiSpaces, getPerson,
  listPageRevisions, getPageChange, coverage, listThreads, SUPPORT_WEEK,
  whyPageHidden, listWikiPages, getWikiPage,
} from '../../lib/data/index.js'

// What the company's knowledge layer holds, read straight out of lib/data.
// Every other screen reads the company through the same module; this one exists
// so a person can see that it is loaded, that access is enforced in the store
// rather than on a screen, and that a page keeps what it used to say.

export const metadata = {
  title: 'The company Vendi works from — Vendi',
  description: 'The people, channels and wiki pages Vendi answers from, and who is allowed to see each one.',
}

const READER = 'per_dana'
const PRIYA = 'per_priya'
const day = (iso) => iso.slice(0, 10)

function Tally({ items }) {
  return (
    <ul className="tally mt-md">
      {items.map(([num, key]) => (
        <li className="tally-item" key={key}>
          <span className="tally-num">{num}</span>
          <span className="tally-key">{key}</span>
        </li>
      ))}
    </ul>
  )
}

export default function KnowledgePage() {
  const summary = companySummary()
  const priya = getPerson(PRIYA)
  const channels = listChannelsForAdmin(PRIYA)
  const spaces = listWikiSpaces(PRIYA)
  const week = coverage(PRIYA, 'ch_support', {
    from: `${SUPPORT_WEEK.start}T00:00:00Z`,
    to: `${SUPPORT_WEEK.end}T23:59:59Z`,
  })
  const longest = listThreads(PRIYA, 'ch_support').reduce((a, b) => (b.replyCount > a.replyCount ? b : a))

  const refunds = getWikiPage(READER, 'pg_refunds_policy')
  const revisions = listPageRevisions(READER, 'pg_refunds_policy')
  const change = getPageChange(READER, 'pg_refunds_policy', revisions[revisions.length - 1].id)
  const restricted = listWikiPages('per_ruth', { spaceId: 'sp_board' })[0]

  return (
    <Page>
      <Section>
        <Row spread>
          <div>
            <Eyebrow>The knowledge layer</Eyebrow>
            <h1 className="title">The company Vendi works from</h1>
          </div>
          <Tag kind="sample">Sample workspace &mdash; made up for this product</Tag>
        </Row>
        <Lede>
          {workspace.name}&rsquo;s people, its Slack channels and its {workspace.wikiName} are loaded, and
          every one of them records who is allowed to see it. Everything Vendi does next reads the company
          through this one layer, so an answer can never draw on something the person asking could not
          open themselves.
        </Lede>
        <Tally
          items={[
            [summary.people, 'people'],
            [summary.channels, 'channels'],
            [summary.directMessages, 'direct messages'],
            [summary.threads, 'threads'],
            [summary.messages, 'messages'],
            [summary.wikiPages, 'wiki pages, each with an owner'],
            [summary.wikiRevisions, 'page revisions kept'],
          ]}
        />
        <Note className="mt-md">
          Every person, message and wiki page here is invented. Nothing is connected to a real Slack
          workspace or a real Notion wiki.
        </Note>
      </Section>

      <Section sunken>
        <h2 className="title">A channel worth summarising</h2>
        <Lede>
          #support carries {week.messages} messages across {week.threads} threads between {day(`${SUPPORT_WEEK.start}`)}{' '}
          and {day(`${SUPPORT_WEEK.end}`)}, and its longest thread runs to {longest.replyCount} replies from{' '}
          {longest.participantIds.length} people. A week of it is more than anyone reads on the way back from leave,
          which is the whole reason Vendi is asked to summarise it.
        </Lede>
      </Section>

      <Section>
        <h2 className="title">Who may see what</h2>
        <Lede>
          Read as {priya.name}, {priya.title.toLowerCase()}. She is in no private channel, so the store refuses
          her those rows rather than a screen filtering them out afterwards. Asking for one by id returns
          nothing, not an empty list.
        </Lede>

        <table className="spec-table mt-md">
          <caption className="visually-hidden">Slack, as {priya.name} can read it</caption>
          <thead>
            <tr>
              <th scope="col">Channel</th>
              <th scope="col">Kind</th>
              <th scope="col">She can open it</th>
            </tr>
          </thead>
          <tbody>
            {channels.map(({ channel, visible, hiddenBecause }) => (
              <tr key={channel.id}>
                <td>{channel.kind === 'dm' ? `Direct message · ${channel.name}` : channel.name}</td>
                <td>{channel.kind === 'dm' ? 'direct message' : channel.kind}</td>
                <td>
                  {visible ? (
                    <Tag kind="good">Yes</Tag>
                  ) : (
                    <>
                      <Tag kind="warm">No</Tag> {hiddenBecause}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="spec-table mt-lg">
          <caption className="visually-hidden">{workspace.wikiName}, as {priya.name} can read it</caption>
          <thead>
            <tr>
              <th scope="col">Wiki space</th>
              <th scope="col">Pages</th>
              <th scope="col">She can open</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map(({ space, pageCount, visiblePageCount }) => (
              <tr key={space.id}>
                <td>{space.name}</td>
                <td>{pageCount}</td>
                <td>
                  {visiblePageCount}
                  {visiblePageCount === 0 ? ` — ${whyPageHidden(PRIYA, restricted.id)}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section>
        <h2 className="title">A page against what it replaced</h2>
        <Lede>
          {refunds.title}, owned by {getPerson(refunds.ownerId).name}, has {revisions.length} versions, and every
          version keeps the whole page as it read at the time. This is the most recent one against the one
          before it &mdash; the same comparison a page owner will be shown when Vendi asks them to accept an edit.
        </Lede>

        <div className="diff">
          {change.sections.map((section) => (
            <div
              className={`diff-line ${section.status === 'unchanged' ? '' : 'diff-add'}`}
              key={section.sectionId}
            >
              <span className="diff-sign" aria-hidden="true">
                {section.status === 'added' ? '+' : section.status === 'removed' ? '−' : '='}
              </span>
              <span className="diff-text">
                <strong>{section.heading}</strong> &mdash; {section.after ?? section.before}
              </span>
            </div>
          ))}
        </div>

        <table className="log-table mt-lg">
          <caption className="visually-hidden">Page history for {refunds.title}, oldest first</caption>
          <thead>
            <tr>
              <th scope="col">When</th>
              <th scope="col">By</th>
              <th scope="col">What changed</th>
            </tr>
          </thead>
          <tbody>
            {revisions.map((revision) => (
              <tr key={revision.id}>
                <td className="log-when">{day(revision.at)}</td>
                <td className="log-who">{getPerson(revision.byId).name}</td>
                <td className="log-what">{revision.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <ScreenFoot
        note="The knowledge layer &middot; sample company"
        links={[{ href: '/visitor/anatomy', label: 'Anatomy of a reply →' }]}
      />
    </Page>
  )
}
