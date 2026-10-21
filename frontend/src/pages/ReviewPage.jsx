import { useMemo, useState } from 'react'
import { getReviewLibrary } from '../services/contentService.js'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'needs_review', label: 'Needs review' },
  { id: 'verified', label: 'Verified' },
]

export default function ReviewPage() {
  const items = useMemo(() => getReviewLibrary(), [])
  const [status, setStatus] = useState('needs_review')
  const [kind, setKind] = useState('all')
  const kinds = ['all', ...new Set(items.map((item) => item.kind))]
  const visible = items.filter((item) => (
    (status === 'all' || item.reviewStatus === status)
    && (kind === 'all' || item.kind === kind)
  ))

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <p className="text-sm font-extrabold text-noor-muted">For a grown-up</p>
        <h1 className="mt-1 text-4xl font-semibold sm:text-5xl">Content review</h1>
        <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">
          These drafts stay unverified until you compare them with a mushaf or a hadith book.
          The public pages still show the badge “Demo content - not yet verified.”
        </p>
      </header>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Review status">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={status === filter.id}
            className={`min-h-12 rounded-full px-4 font-extrabold ${status === filter.id ? 'bg-noor-sun' : 'bg-white'} shadow-soft`}
            onClick={() => setStatus(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Content type">
        {kinds.map((itemKind) => (
          <button
            key={itemKind}
            type="button"
            aria-pressed={kind === itemKind}
            className={`min-h-12 rounded-full px-4 font-extrabold ${kind === itemKind ? 'bg-noor-mint' : 'bg-white'} shadow-soft`}
            onClick={() => setKind(itemKind)}
          >
            {itemKind}
          </button>
        ))}
      </div>
      <p className="font-extrabold" role="status">{visible.length} items</p>
      <ul className="grid gap-3">
        {visible.map((item) => (
          <li key={`${item.kind}-${item.id}`} className="rounded-3xl border border-white bg-noor-card p-4 shadow-soft">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm font-extrabold text-noor-muted">
              {item.kind} · {item.reviewStatus} · verified {item.verified ? 'yes' : 'no'}
            </p>
            <p className="mt-2 font-semibold leading-relaxed">{item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
