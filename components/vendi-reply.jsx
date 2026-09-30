// The one shape every Vendi reply has in Slack, from the locked screen
// visitor/anatomy: who posted it, the answer, every source it read, what it
// noticed on the way, what you can do next, and who can see it.
//
// Later steps fill this with real answers and real sources. It renders nothing
// it was not given: no sources means no source list, no actions means no button
// row. `annotated` draws the numbered markers the anatomy screen points with.
import { SlackActions, SlackButton, SlackMessage, SlackMeta, SlackNotice, SlackText } from './slack'
import { SourceList } from './ui'

function Marker({ on, n }) {
  if (!on) return null
  return (
    <>
      <span className="anno-marker">{n}</span>{' '}
    </>
  )
}

function Part({ on, children }) {
  if (!on) return <>{children}</>
  return <div className="anno-part">{children}</div>
}

export function VendiReply({
  time,
  answer,
  sources = [],
  sourcesLabel,
  notice,
  noticeFirst = false,
  actions = [],
  access,
  lookedAt,
  annotated = false,
}) {
  const noticeBlock = notice ? (
    <Part on={annotated}>
      <SlackNotice
        tone={notice.tone}
        title={
          notice.title ? (
            <>
              <Marker on={annotated} n={4} />
              {notice.title}
            </>
          ) : null
        }
      >
        <SlackText>{notice.body}</SlackText>
      </SlackNotice>
    </Part>
  ) : null

  const sourceBlock =
    sources.length > 0 ? (
      <Part on={annotated}>
        {sourcesLabel ? (
          <p className="slack-meta">
            <Marker on={annotated} n={3} />
            {sourcesLabel}
          </p>
        ) : null}
        <SourceList sources={sources} />
      </Part>
    ) : null

  return (
    <SlackMessage
      author="Vendi"
      initials="V"
      time={time}
      app
      vendi
      marker={<Marker on={annotated} n={1} />}
    >
      <Part on={annotated}>
        <SlackText>
          <Marker on={annotated} n={2} />
          {answer}
        </SlackText>
      </Part>

      {noticeFirst ? noticeBlock : null}
      {sourceBlock}
      {noticeFirst ? null : noticeBlock}

      {lookedAt ? <SlackMeta>{lookedAt}</SlackMeta> : null}

      {actions.length > 0 ? (
        <Part on={annotated}>
          <SlackActions>
            <Marker on={annotated} n={5} />
            {actions.map((action) => (
              <SlackButton key={action.label} go={action.go} href={action.href}>
                {action.label}
              </SlackButton>
            ))}
          </SlackActions>
        </Part>
      ) : null}

      {access ? (
        <p className="slack-meta">
          <Marker on={annotated} n={6} />
          {access}
        </p>
      ) : null}
    </SlackMessage>
  )
}
