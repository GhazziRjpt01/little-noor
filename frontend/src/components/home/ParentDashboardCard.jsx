import { LayoutDashboard } from 'lucide-react'
import Button from '../Button.jsx'
import Card from '../Card.jsx'

export default function ParentDashboardCard() {
  return (
    <Card accent="mint" tone="mint-soft" className="flex h-full flex-col sm:p-8">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-noor-ink shadow-soft">
        <LayoutDashboard size={28} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-3xl font-semibold">Parent Dashboard</h2>
      <p className="mt-3 flex-1 text-lg font-semibold leading-relaxed text-noor-muted">
        A quiet corner for parents to follow lessons, practice, and quizzes.
      </p>
      <div className="mt-6">
        <Button to="/parent" variant="mint">
          Open dashboard
        </Button>
      </div>
    </Card>
  )
}
