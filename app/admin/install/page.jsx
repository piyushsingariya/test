import { ScreenSoon } from '../../../components/screens/soon'

export const metadata = { title: 'Add Vendi to Slack — Vendi' }

export default function AdminInstallPage() {
  return (
    <ScreenSoon screen="admin/install" title="Add Vendi to your Slack workspace">
      An admin will add Vendi to Slack here, invite it to channels, and connect the company’s Notion wiki.
      That screen is built in a later step, so nothing installs today.
    </ScreenSoon>
  )
}
