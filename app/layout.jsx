import './globals.css'
import { SiteHeader } from '../components/site-header'
import { SiteFooter } from '../components/site-footer'

export const metadata = {
  title: 'Vendi — an AI coworker in Slack',
  description:
    'Vendi sits in your Slack with your company’s own context: it answers questions with its sources, summarises threads and channels, and proposes the Notion edits your wiki is missing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="site">
          <SiteHeader />
          <main className="site-main">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
