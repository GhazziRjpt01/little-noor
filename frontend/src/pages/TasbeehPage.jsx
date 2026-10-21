import beads from '../assets/illustrations/prayer-beads.webp'
import ActivityArt from '../components/ActivityArt.jsx'
import Button from '../components/Button.jsx'
import TasbeehDial from '../components/tasbeeh/TasbeehDial.jsx'
import VerificationBadge from '../components/VerificationBadge.jsx'
import { TASBEEH_GOALS, TASBEEH_PHRASES, useTasbeeh } from '../hooks/useTasbeeh.js'
import { useI18n } from '../i18n/useI18n.js'
import { findAzkarArabicByLabel } from '../services/contentService.js'

const PLACEHOLDER_ARABIC = 'TO_BE_PROVIDED'

export default function TasbeehPage() {
  const { t } = useI18n()
  const tasbeeh = useTasbeeh()
  const phrase = TASBEEH_PHRASES.find((item) => item.id === tasbeeh.phraseId) ?? TASBEEH_PHRASES[0]
  const storedArabic = findAzkarArabicByLabel(phrase.label)
  const arabic = storedArabic?.arabic || PLACEHOLDER_ARABIC
  const percent = Math.min(Math.round((tasbeeh.count / tasbeeh.goal) * 100), 100)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('tasbeeh.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('tasbeeh.intro')}</p>
          <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('tasbeeh.localOnly')}</p>
        </div>
        <ActivityArt src={beads} alt="A loop of mint and cream prayer beads" />
      </header>

      <ChoiceGroup
        label={t('tasbeeh.phrase')}
        options={TASBEEH_PHRASES.map((item) => ({ id: item.id, label: item.label }))}
        selected={tasbeeh.phraseId}
        onSelect={tasbeeh.setPhrase}
      />

      <section aria-label={t('tasbeeh.arabic')} className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-noor-muted">{t('tasbeeh.arabic')}</h2>
          <VerificationBadge verified={storedArabic?.verified === true} />
        </div>
        <p lang="ar" dir="rtl" className="mt-3 text-center font-arabic text-4xl leading-[2.4]">
          {arabic}
        </p>
        <p className="mt-2 text-center text-lg font-extrabold">{phrase.label}</p>
      </section>

      <TasbeehDial count={tasbeeh.count} goal={tasbeeh.goal} onIncrement={tasbeeh.increment} />
      <p className="text-center text-sm font-extrabold text-noor-muted">{t('tasbeeh.keys')}</p>

      <div
        role="progressbar"
        aria-label={t('tasbeeh.progress')}
        aria-valuemin={0}
        aria-valuemax={tasbeeh.goal}
        aria-valuenow={Math.min(tasbeeh.count, tasbeeh.goal)}
        aria-valuetext={`${tasbeeh.count} / ${tasbeeh.goal}`}
        className="h-4 overflow-hidden rounded-full bg-noor-sky-soft"
      >
        <div className="h-full rounded-full bg-noor-mint-deep" style={{ width: `${percent}%` }} />
      </div>
      <p className="text-center font-display text-3xl font-semibold">
        {tasbeeh.count} / {tasbeeh.goal}
      </p>

      <ChoiceGroup
        label={t('tasbeeh.goal')}
        options={TASBEEH_GOALS.map((goal) => ({ id: String(goal), label: String(goal) }))}
        selected={String(tasbeeh.goal)}
        onSelect={(id) => tasbeeh.setGoal(Number(id))}
      />

      <div className="flex justify-center">
        <Button variant="ghost" className="min-h-14 min-w-36 text-lg" onClick={tasbeeh.reset}>
          {t('tasbeeh.reset')}
        </Button>
      </div>
    </div>
  )
}

function ChoiceGroup({ label, options, selected, onSelect }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap justify-center gap-2">
      {options.map((option) => {
        const checked = option.id === selected
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={checked}
            className={`inline-flex min-h-14 items-center justify-center rounded-full px-5 text-base font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink ${checked ? 'bg-noor-sky text-noor-ink shadow-soft' : 'bg-white text-noor-muted'}`}
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
