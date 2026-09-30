import { ScreenSoon } from '../../../components/screens/soon'

export const metadata = { title: 'Ask Vendi in a channel — Vendi' }

export default function EmployeeAskPage() {
  return (
    <ScreenSoon screen="employee/ask" title="Ask Vendi in a channel">
      An employee will mention Vendi in a channel here and read the answer with the sources under it. The
      shape that answer takes is already settled — see the anatomy of a Vendi reply.
    </ScreenSoon>
  )
}
