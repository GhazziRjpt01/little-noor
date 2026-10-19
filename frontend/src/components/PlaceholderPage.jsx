import Button from './Button.jsx'
import Card from './Card.jsx'

const iconStyles = {
  sky: 'bg-noor-sky',
  mint: 'bg-noor-mint',
  sun: 'bg-noor-sun',
}

export default function PlaceholderPage({
  label,
  summary,
  icon: Icon,
  accent = 'sky',
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <Card accent={accent} className="text-center">
        {Icon ? (
          <div
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-noor-ink ${iconStyles[accent] ?? iconStyles.sky}`}
          >
            <Icon aria-hidden="true" size={30} />
          </div>
        ) : null}
        <h1 className="mt-5 text-4xl font-semibold">{label}</h1>
        <p className="mx-auto mt-3 max-w-md text-lg font-semibold leading-relaxed text-noor-muted">
          {summary}
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm font-bold text-noor-muted">
          This page is a placeholder. The lesson itself is not built yet.
        </p>
        <div className="mt-6 flex justify-center">
          <Button to="/" variant="ghost">
            Back home
          </Button>
        </div>
      </Card>
    </div>
  )
}
