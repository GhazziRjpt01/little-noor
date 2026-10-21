import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import mosque from '../assets/illustrations/mosque.webp'
import ActivityArt from '../components/ActivityArt.jsx'
import AzkarCard from '../components/azkar/AzkarCard.jsx'
import { useAzkarProgress } from '../hooks/useAzkarProgress.js'
import { useI18n } from '../i18n/useI18n.js'
import { getAzkarCategories } from '../services/contentService.js'

export default function AzkarPage() {
  const { t } = useI18n()
  const categories = getAzkarCategories()
  const [params, setParams] = useSearchParams()
  const requested = params.get('set')
  const active = categories.find((category) => category.id === requested) ?? categories[0]
  const itemIds = categories.flatMap((category) => category.items.map((item) => item.id))
  const progress = useAzkarProgress(itemIds)
  const percent = progress.total === 0 ? 0 : Math.round((progress.done / progress.total) * 100)

  function selectCategory(id) {
    setParams({ set: id })
  }

  function onTabKeyDown(event) {
    const ids = categories.map((category) => category.id)
    const current = ids.indexOf(active.id)
    const moves = {
      ArrowRight: (current + 1) % ids.length,
      ArrowLeft: (current - 1 + ids.length) % ids.length,
      Home: 0,
      End: ids.length - 1,
    }
    if (!(event.key in moves)) {
      return
    }
    event.preventDefault()
    const nextId = ids[moves[event.key]]
    selectCategory(nextId)
    document.getElementById(`azkar-tab-${nextId}`)?.focus()
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('azkar.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('azkar.intro')}</p>
        </div>
        <ActivityArt src={mosque} alt="A colorful mosque with mint domes and a gold crescent" />
      </header>

      <section aria-labelledby="azkar-summary" className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft">
        <h2 id="azkar-summary" className="text-2xl font-semibold">{t('azkar.summary')}</h2>
        <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('azkar.localOnly')}</p>
        <p className="mt-4 font-display text-3xl font-semibold" role="status">
          {progress.done} / {progress.total}
        </p>
        <div
          className="mt-3 h-4 overflow-hidden rounded-full bg-noor-sky-soft"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
          aria-label={t('azkar.summary')}
        >
          <div className="h-full rounded-full bg-noor-mint-deep" style={{ width: `${percent}%` }} />
        </div>
      </section>

      <div
        role="tablist"
        aria-label={t('azkar.lists')}
        className="flex gap-2 overflow-x-auto pb-1"
        onKeyDown={onTabKeyDown}
      >
        {categories.map((category) => {
          const selected = category.id === active.id
          return (
            <button
              key={category.id}
              id={`azkar-tab-${category.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`azkar-panel-${category.id}`}
              tabIndex={selected ? 0 : -1}
              className={`inline-flex min-h-12 shrink-0 items-center rounded-full px-5 text-base font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink ${selected ? 'bg-noor-sky text-noor-ink shadow-soft' : 'bg-white text-noor-muted'}`}
              onClick={() => selectCategory(category.id)}
            >
              {category.title}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id={`azkar-panel-${active.id}`}
        aria-labelledby={`azkar-tab-${active.id}`}
        className="flex flex-col gap-5"
      >
        {active.items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.25 }}
          >
            <AzkarCard
              item={item}
              count={progress.getCount(item.id)}
              complete={progress.isComplete(item.id)}
              onCount={progress.setCount}
              onToggle={progress.toggleComplete}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
