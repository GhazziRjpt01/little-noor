import { useState } from 'react'
import { BookOpen, Heart, Moon, Sparkles } from 'lucide-react'
import trophy from '../assets/illustrations/quiz-trophy.webp'
import ActivityArt from '../components/ActivityArt.jsx'
import QuizRound from '../components/quiz/QuizRound.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { awardStars } from '../hooks/useRewards.js'
import { getQuizCategories, getQuizQuestions } from '../services/contentService.js'

const categoryIcons = {
  kalimas: BookOpen,
  manners: Heart,
  prayer: Moon,
  'basic-knowledge': Sparkles,
}

export default function QuizPage() {
  const { t } = useI18n()
  const categories = getQuizCategories()
  const [categoryId, setCategoryId] = useState(null)
  const questions = categoryId ? getQuizQuestions(categoryId) : []

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('quiz.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('quiz.intro')}</p>
          <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('quiz.localOnly')}</p>
        </div>
        <ActivityArt src={trophy} alt="A yellow star trophy" />
      </header>

      {categoryId ? (
        <QuizRound
          questions={questions}
          onExit={() => setCategoryId(null)}
          onComplete={() => awardStars('quiz')}
        />
      ) : (
        <section aria-label={t('quiz.categories')} className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id] ?? Sparkles
            return (
              <button
                key={category.id}
                type="button"
                className="flex min-h-28 items-center gap-4 rounded-3xl border border-white bg-noor-card px-5 py-4 text-left text-2xl font-semibold shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink"
                onClick={() => setCategoryId(category.id)}
              >
                <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-noor-sun text-noor-ink">
                  <Icon aria-hidden="true" size={32} />
                </span>
                {category.title}
              </button>
            )
          })}
        </section>
      )}
    </div>
  )
}
