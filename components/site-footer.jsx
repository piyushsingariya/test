import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="site-foot-inner">
        <span>
          Vendi answers from what your company has already written, and only from what the person asking
          can already see.
        </span>
        <span className="site-foot-links">
          <Link className="walk-link walk-link-home" href="/">
            Home
          </Link>
          <Link className="walk-link" href="/visitor/anatomy">
            Anatomy of a reply
          </Link>
          <Link className="walk-link" href="/visitor/design">
            Design language
          </Link>
        </span>
      </div>
    </footer>
  )
}
