import { motion } from 'framer-motion'
import lessonArt from '../../assets/illustrations/kalimas-book.webp'
import { useI18n } from '../../i18n/useI18n.js'
import LessonAudio from '../LessonAudio.jsx'
import Button from '../Button.jsx'
import VerificationBadge from '../VerificationBadge.jsx'

export default function KalimaLesson({ kalima, previous, next }) {
  const { t } = useI18n()

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12"
    >
      <div className="flex flex-wrap items-center gap-3">
        <Button to="/kalimas" variant="ghost" size="sm">
          {t('kalimas.back')}
        </Button>
        <VerificationBadge verified={kalima.verified} />
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{kalima.title}</h1>
        </div>
        <img
          src={lessonArt}
          alt={t('kalimas.illustration')}
          className="aspect-[4/3] w-full rounded-3xl bg-noor-cream object-contain p-4 shadow-soft"
        />
      </div>

      <LessonAudio lessonId={kalima.id} audioUrl={kalima.audioUrl} verified={kalima.verified} field="arabic" />

      <LessonBlock id="kalima-arabic" label={t('kalimas.arabic')}>
        <p lang="ar" dir="rtl" className="font-arabic text-4xl leading-[2.4] sm:text-5xl">
          {kalima.arabic}
        </p>
      </LessonBlock>

      <LessonBlock id="kalima-transliteration" label={t('kalimas.transliteration')}>
        <p className="text-xl font-semibold leading-relaxed">{kalima.transliteration}</p>
      </LessonBlock>

      <div className="grid gap-6 lg:grid-cols-2">
        <LessonBlock id="kalima-english" label={t('kalimas.english')}>
          <p lang="en" className="text-lg font-semibold leading-relaxed">
            {kalima.translations.en}
          </p>
        </LessonBlock>
        <LessonBlock id="kalima-urdu" label={t('kalimas.urdu')}>
          <p lang="ur" dir="rtl" className="font-arabic text-2xl leading-loose">
            {kalima.translations.ur}
          </p>
        </LessonBlock>
      </div>

      <LessonBlock id="kalima-source" label={t('kalimas.source')}>
        <p className="text-lg font-semibold leading-relaxed">{kalima.source}</p>
      </LessonBlock>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {previous ? (
          <Button to={`/kalimas/${previous.id}`} variant="ghost">
            {t('kalimas.previous')}: {previous.title}
          </Button>
        ) : (
          <Button variant="ghost" disabled>
            {t('kalimas.previous')}
          </Button>
        )}
        {next ? (
          <Button to={`/kalimas/${next.id}`} variant="mint">
            {t('kalimas.next')}: {next.title}
          </Button>
        ) : (
          <Button variant="mint" disabled>
            {t('kalimas.next')}
          </Button>
        )}
      </div>
    </motion.article>
  )
}

function LessonBlock({ id, label, children }) {
  return (
    <section aria-labelledby={id} className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft sm:p-6">
      <h2 id={id} className="text-sm font-extrabold tracking-wide text-noor-muted">
        {label}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}
