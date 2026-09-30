import styles from './page.module.css';
import {
  workspace, companySummary, listChannelsForAdmin, listWikiSpaces, getPerson,
  listPageRevisions, getPageChange, coverage, listThreads, SUPPORT_WEEK,
  whyPageHidden, listWikiPages, getWikiPage,
} from '../lib/data/index.js';

const READER = 'per_dana';   // the workspace admin
const PRIYA = 'per_priya';   // a support specialist, in no private channel

const dateOnly = (iso) => iso.slice(0, 10);

function Stat({ value, label }) {
  return (
    <li className={styles.stat}>
      <span className={`${styles.statValue} ${styles.num}`}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </li>
  );
}

export default function CompanyKnowledge() {
  const summary = companySummary();
  const channels = listChannelsForAdmin(PRIYA);
  const spaces = listWikiSpaces(PRIYA);
  const week = coverage(PRIYA, 'ch_support', {
    from: `${SUPPORT_WEEK.start}T00:00:00Z`,
    to: `${SUPPORT_WEEK.end}T23:59:59Z`,
  });
  const longest = listThreads(PRIYA, 'ch_support')
    .reduce((a, b) => (b.replyCount > a.replyCount ? b : a));

  const revisions = listPageRevisions(READER, 'pg_refunds_policy');
  const latest = revisions[revisions.length - 1];
  const change = getPageChange(READER, 'pg_refunds_policy', latest.id);

  const refunds = getWikiPage(READER, 'pg_refunds_policy');
  const restricted = listWikiPages('per_ruth', { spaceId: 'sp_board' })[0];

  return (
    <main className={styles.page}>
      <header className={styles.brand}>
        <span className={styles.mark} aria-hidden="true">V</span>
        <span className={styles.name}>Vendi</span>
      </header>

      <section>
        <p className={styles.eyebrow}>Step 1 of the build</p>
        <h1 className={styles.title}>The company Vendi works from</h1>
        <p className={styles.lede}>
          {workspace.name}&rsquo;s people, Slack channels and {workspace.wikiName} are loaded, and every
          one of them records who is allowed to see it. Everything Vendi is built to do next reads
          the company through this one layer, so an answer can never draw on something the person
          asking could not open themselves.
        </p>
      </section>

      <p className={styles.notice}>
        <strong>{workspace.name} is a sample company, invented for this product.</strong>
        <span>
          Every person, message and wiki page below is made up. Nothing is connected to a real Slack
          workspace or a real Notion wiki. This page is what step 1 has built; Vendi&rsquo;s home page
          and the rest of the app come in the steps after it.
        </span>
      </p>

      <section className={styles.card}>
        <h2>What is loaded</h2>
        <ul className={styles.stats}>
          <Stat value={summary.people} label="people" />
          <Stat value={summary.channels} label="channels" />
          <Stat value={summary.directMessages} label="direct messages" />
          <Stat value={summary.threads} label="threads" />
          <Stat value={summary.messages} label="messages" />
          <Stat value={summary.wikiPages} label="wiki pages, each with an owner" />
          <Stat value={summary.wikiRevisions} label="page revisions kept" />
        </ul>
        <p className={styles.statLabel}>
          {longest.replyCount} replies from {longest.participantIds.length} people in the longest
          thread in #support, and {week.messages} messages across {week.threads} threads in the week
          of {dateOnly(`${SUPPORT_WEEK.start}`)} to {dateOnly(`${SUPPORT_WEEK.end}`)} — a channel with
          enough in it to be worth summarising.
        </p>
      </section>

      <section className={styles.card}>
        <h2>Who may see what</h2>
        <p className={styles.lede}>
          Read as {getPerson(PRIYA).name}, {getPerson(PRIYA).title.toLowerCase()}. She is in no
          private channel, so the store refuses her those rows rather than filtering them on a screen.
        </p>
        <table className={styles.table}>
          <caption>Slack, as {getPerson(PRIYA).name} can read it</caption>
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
                <td>{channel.kind === 'dm' ? `DM · ${channel.name}` : channel.name}</td>
                <td>{channel.kind}</td>
                <td>
                  {visible
                    ? <span className={`${styles.pill} ${styles.pillOpen}`}>Yes</span>
                    : <><span className={`${styles.pill} ${styles.pillClosed}`}>No</span> {hiddenBecause}</>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className={styles.table}>
          <caption>{workspace.wikiName}, as {getPerson(PRIYA).name} can read it</caption>
          <thead>
            <tr>
              <th scope="col">Space</th>
              <th scope="col">Pages</th>
              <th scope="col">She can open</th>
            </tr>
          </thead>
          <tbody>
            {spaces.map(({ space, pageCount, visiblePageCount }) => (
              <tr key={space.id}>
                <td>{space.name}</td>
                <td className={styles.num}>{pageCount}</td>
                <td className={styles.num}>
                  {visiblePageCount}
                  {visiblePageCount === 0 && restricted
                    ? ` — ${whyPageHidden(PRIYA, restricted.id)}`
                    : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.statLabel}>
          The two rows she is refused are the point: #product-private, which she is not a member of,
          and the {spaces.find((s) => s.space.id === 'sp_board').space.name} pages, which Notion
          restricts. Asking for either by id returns nothing rather than an empty list.
        </p>
      </section>

      <section className={styles.card}>
        <h2>A page against what it replaced</h2>
        <p className={styles.lede}>
          {refunds.title}, owned by {getPerson(refunds.ownerId).name}, has {revisions.length} versions. This is the most recent one read against the one before it —
          the same comparison a proposed edit will be shown with when a page owner is asked to accept it.
        </p>
        <div className={styles.diff}>
          {change.sections.map((section) => (
            <div
              key={section.sectionId}
              className={`${styles.diffRow} ${section.status === 'unchanged' ? styles.diffKept : styles.diffAdded}`}
            >
              <span className={styles.sign} aria-hidden="true">
                {section.status === 'added' ? '+' : section.status === 'removed' ? '−' : '='}
              </span>
              <span>
                <strong>{section.heading}</strong> — {section.after ?? section.before}
              </span>
            </div>
          ))}
        </div>
        <table className={styles.table}>
          <caption>Page history, oldest first</caption>
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
                <td className={styles.num}>{dateOnly(revision.at)}</td>
                <td>{getPerson(revision.byId).name}</td>
                <td>{revision.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
