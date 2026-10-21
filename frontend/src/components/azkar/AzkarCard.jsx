import { Check } from 'lucide-react'
import { useI18n } from '../../i18n/useI18n.js'
import LessonAudio from '../LessonAudio.jsx'
import VerificationBadge from '../VerificationBadge.jsx'

export default function AzkarCard({ item, count, complete, onCount, onToggle }) {
  const { t } = useI18n()
  const titleId = `azkar-title-${item.id}`

  return (
    <article
      aria-labelledby={titleId}
      className={`rounded-3xl border bg-noor-card p-5 shadow-soft sm:p-6 ${complete ? 'border-noor-mint-deep' : 'border-white'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={titleId} className="text-2xl font-semibold">{item.title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {complete ? (
            <p className="inline-flex items-center gap-1 rounded-full bg-noor-mint px-3 py-1 text-sm font-extrabold text-noor-ink">
              <Check aria-hidden="true" size={16} />
              {t('azkar.finished')}
            </p>
          ) : null}
          <VerificationBadge verified={item.verified} />
        </div>
      </div>

      <Field label={t('azkar.arabic')}>
        <p lang="ar" dir="rtl" className="whitespace-pre-line font-arabic text-4xl leading-[2.4]">
          {item.arabic}
        </p>
      </Field>
      <Field label={t('azkar.transliteration')}>
        <p className="text-lg font-semibold leading-relaxed">{item.transliteration}</p>
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label={t('azkar.english')}>
          <p lang="en" className="font-semibold leading-relaxed">{item.translations.en}</p>
        </Field>
        <Field label={t('azkar.urdu')}>
          <p lang="ur" dir="rtl" className="font-arabic text-xl leading-loose">
            {item.translations.ur}
          </p>
        </Field>
      </div>
      <Field label={t('azkar.source')}>
        <p className="font-semibold leading-relaxed">{item.source}</p>
      </Field>
      {item.repeatCount ? (
        <p className="mt-3 text-sm font-extrabold text-noor-muted">
          Repeat {item.repeatCount} {item.repeatCount === 1 ? 'time' : 'times'}
        </p>
      ) : null}
      {item.reviewStatus ? (
        <p className="mt-2 text-sm font-extrabold text-noor-muted">Review status: {item.reviewStatus}</p>
      ) : null}

      <div className="mt-5">
        <LessonAudio lessonId={item.id} audioUrl={item.audioUrl} verified={item.verified} field="arabic" />
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-noor-sky text-2xl font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`${t('azkar.decrease')}: ${item.title}`}
            disabled={count === 0}
            onClick={() => onCount(item.id, count - 1)}
          >
            −
          </button>
          <p
            aria-live="polite"
            aria-label={`${t('azkar.count')}: ${item.title}`}
            className="min-w-16 text-center font-display text-4xl font-semibold"
          >
            {count}
          </p>
          <button
            type="button"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-noor-sun text-2xl font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink"
            aria-label={`${t('azkar.increase')}: ${item.title}`}
            onClick={() => onCount(item.id, count + 1)}
          >
            +
          </button>
        </div>
        <button
          type="button"
          aria-pressed={complete}
          aria-label={`${complete ? t('azkar.finished') : t('azkar.markDone')}: ${item.title}`}
          className={`inline-flex min-h-14 items-center justify-center rounded-full px-5 text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink ${complete ? 'bg-noor-mint-deep' : 'bg-noor-card'}`}
          onClick={() => onToggle(item.id)}
        >
          {complete ? t('azkar.finished') : t('azkar.markDone')}
        </button>
      </div>
    </article>
  )
}

function Field({ label, children }) {
  return (
    <section aria-label={label} className="mt-4">
      <h3 className="text-sm font-extrabold text-noor-muted">{label}</h3>
      <div className="mt-2">{children}</div>
    </section>
  )
}
