// The shared pieces every Vendi screen is built from. Classes come from
// app/globals.css, which is the locked design language: no screen adds a
// colour, face or spacing step of its own.
import Link from 'next/link'

function classes(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Page({ children }) {
  return <div className="page">{children}</div>
}

export function Section({ sunken = false, children }) {
  return <section className={classes('section', sunken && 'section-sunken')}>{children}</section>
}

export function Eyebrow({ children }) {
  return <p className="eyebrow">{children}</p>
}

export function Lede({ children }) {
  return <p className="lede">{children}</p>
}

export function Note({ className, children }) {
  return <p className={classes('fake-note', className)}>{children}</p>
}

export function Card({ title, children }) {
  return (
    <article className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-body">{children}</p>
    </article>
  )
}

export function Grid({ columns = 3, className, children }) {
  return <div className={classes(columns === 2 ? 'grid-2' : 'grid-3', className)}>{children}</div>
}

export function Row({ spread = false, className, children }) {
  return <div className={classes('btn-row', spread && 'btn-row-spread', className)}>{children}</div>
}

// One button style set: primary (the single action on a screen), secondary and
// quiet. Hover, focus-visible and disabled all live in the stylesheet.
export function Button({ kind = 'secondary', size, href, type = 'button', disabled, className, children, ...rest }) {
  const style = classes(
    'btn',
    kind === 'primary' && 'btn-primary',
    kind === 'quiet' && 'btn-quiet',
    size === 'lg' && 'btn-lg',
    className,
  )
  if (href && !disabled) {
    return (
      <Link className={style} href={href} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button className={style} type={type} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}

export function Tag({ kind, children }) {
  return <span className={classes('tag', kind && `tag-${kind}`)}>{children}</span>
}

// What Vendi read, one chip per source. A chip links to the thing itself when
// there is somewhere to send the reader.
export function SourceChip({ href, children }) {
  if (href) {
    return (
      <Link className="source-chip" href={href}>
        {children}
      </Link>
    )
  }
  return <span className="source-chip">{children}</span>
}

export function SourceList({ sources }) {
  if (!sources || sources.length === 0) return null
  return (
    <ul className="source-list mt-xs">
      {sources.map((source) => (
        <li key={source.label}>
          <SourceChip href={source.href}>{source.label}</SourceChip>
        </li>
      ))}
    </ul>
  )
}

export function StoryCard({ step, title, href, go = "Open it", children }) {
  return (
    <Link className="story-card" href={href}>
      <p className="story-step">{step}</p>
      <h3 className="card-title">{title}</h3>
      <p className="card-body">{children}</p>
      <span className="story-go">{go} &rarr;</span>
    </Link>
  )
}

// Every screen ends with a way back to the home page.
export function ScreenFoot({ note, links = [], showHome = true }) {
  return (
    <div className="walk-foot">
      <span className="walk-foot-note">{note}</span>
      <span className="walk-foot-links">
        {showHome ? (
          <Link className="walk-link walk-link-home" href="/">
            &larr; Back to the home page
          </Link>
        ) : null}
        {links.map((link) => (
          <Link className="walk-link" key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </span>
    </div>
  )
}
