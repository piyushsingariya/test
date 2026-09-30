'use client'

// The bar every screen carries. The brand is the way back to the home page from
// anywhere in the app.
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/visitor/anatomy', label: 'Anatomy of a reply' },
  { href: '/visitor/design', label: 'Design language' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const here = pathname === '/visitor/home' ? '/' : pathname

  return (
    <header className="site-head">
      <div className="site-head-inner">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            V
          </span>
          <span>
            <span className="brand-name">Vendi</span>
            <br />
            <span className="brand-sub">An AI coworker in Slack</span>
          </span>
        </Link>
        <nav className="site-nav" aria-label="Vendi">
          {NAV.map((item) => (
            <Link
              className="site-link"
              key={item.href}
              href={item.href}
              aria-current={here === item.href ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
