// A drawing of Slack. Slack's colours and face are kept in their own tokens, so
// a message never looks like part of Vendi's own interface.
import Link from 'next/link'

function classes(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function SlackSurface({ className, children }) {
  return <div className={classes('slack', className)}>{children}</div>
}

// One message row: who posted it, when, and what they said. `app` draws Slack's
// APP badge, which Vendi always carries.
export function SlackMessage({ author, initials, time, app = false, vendi = false, children, marker }) {
  return (
    <div className="slack-message">
      <span className={classes('slack-avatar', vendi && 'slack-avatar-vendi')} aria-hidden="true">
        {initials}
      </span>
      <div>
        <p className="slack-author">
          {marker}
          {author}
          {app ? <span className="slack-app-badge">APP</span> : null}
          <span className="slack-time">{time}</span>
        </p>
        {children}
      </div>
    </div>
  )
}

export function SlackText({ children }) {
  return <p className="slack-text">{children}</p>
}

export function SlackMeta({ children }) {
  return <p className="slack-meta">{children}</p>
}

// Something Vendi noticed on the way. With a title it is a card; without one it
// is a quieter block under the answer.
export function SlackNotice({ title, tone, children }) {
  if (!title) {
    return <div className="slack-block">{children}</div>
  }
  return (
    <div className={classes('slack-card', tone && `slack-card-${tone}`)}>
      <p className="slack-card-title">{title}</p>
      {children}
    </div>
  )
}

export function SlackActions({ children }) {
  return <div className="slack-actions">{children}</div>
}

// `go` is the one action that changes something outside Slack — and it only
// ever proposes.
export function SlackButton({ go = false, href, disabled, children, ...rest }) {
  const style = classes('slack-btn', go && 'slack-btn-go')
  if (href && !disabled) {
    return (
      <Link className={style} href={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={style} type="button" disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
