import { ScreenSoon } from '../../../components/screens/soon'

export const metadata = { title: 'A proposed wiki edit — Vendi' }

export default function OwnerProposalPage() {
  return (
    <ScreenSoon screen="owner/proposal" title="A wiki edit Vendi proposes">
      A page’s owner will read the edit Vendi drafted from a Slack conversation here, and accept or decline
      it. Vendi never changes a page on its own.
    </ScreenSoon>
  )
}
