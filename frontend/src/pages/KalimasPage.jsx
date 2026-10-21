import book from '../assets/illustrations/kalimas-book.webp'
import ActivityArt from '../components/ActivityArt.jsx'
import { getKalimas } from '../services/contentService.js'
import KalimaCard from '../components/kalimas/KalimaCard.jsx'
import { useI18n } from '../i18n/useI18n.js'

export default function KalimasPage() {
  const { t } = useI18n()
  const kalimas = getKalimas()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('kalimas.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('kalimas.intro')}</p>
        </div>
        <ActivityArt src={book} alt="An open storybook with a little mosque" />
      </header>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kalimas.map((item, index) => (
          <KalimaCard key={item.id} item={item} number={index + 1} index={index} />
        ))}
      </ul>
    </div>
  )
}
