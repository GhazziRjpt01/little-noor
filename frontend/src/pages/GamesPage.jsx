import { useState } from 'react'
import { Puzzle } from 'lucide-react'
import book from '../assets/illustrations/kalimas-book.webp'
import trophyArt from '../assets/illustrations/quiz-trophy.webp'
import chest from '../assets/illustrations/treasure-chest.webp'
import ActivityArt from '../components/ActivityArt.jsx'
import Card from '../components/Card.jsx'
import MemoryMatch from '../components/games/MemoryMatch.jsx'
import Button from '../components/Button.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { REWARD_AMOUNTS, useRewards } from '../hooks/useRewards.js'
import { getKalimas } from '../services/contentService.js'

export default function GamesPage() {
  const { t } = useI18n()
  const rewards = useRewards()
  const [playing, setPlaying] = useState(false)
  const kalimas = getKalimas()

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('games.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('games.intro')}</p>
          <p className="mt-2 max-w-2xl text-sm font-extrabold text-noor-muted">{t('games.educational')}</p>
        </div>
        <ActivityArt src={chest} alt="An open treasure chest filled with stars" />
      </header>

      {playing ? (
        <section aria-labelledby="memory-match-title" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="memory-match-title" className="text-3xl font-semibold">
              {t('games.memoryTitle')}
            </h2>
            <Button variant="ghost" className="min-h-14" onClick={() => setPlaying(false)}>
              {t('games.back')}
            </Button>
          </div>
          <MemoryMatch kalimas={kalimas} onBack={() => setPlaying(false)} />
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card accent="sky">
            <img src={book} alt="" className="h-28 w-full object-contain" />
            <h2 className="mt-3 text-2xl font-semibold">{t('games.memoryTitle')}</h2>
            <p className="mt-2 font-semibold text-noor-muted">{t('games.memorySummary')}</p>
            <p className="mt-2 text-sm font-extrabold text-noor-muted">+{REWARD_AMOUNTS['memory-match']}</p>
            <div className="mt-4">
              <Button variant="sun" className="min-h-14" onClick={() => setPlaying(true)}>
                {t('games.play')}
              </Button>
            </div>
          </Card>

          <Card accent="mint">
            <Puzzle aria-hidden="true" className="text-noor-ink" />
            <h2 className="mt-3 text-2xl font-semibold">{t('games.puzzleTitle')}</h2>
            <p className="mt-3 inline-flex rounded-full bg-noor-mint px-3 py-1 text-sm font-extrabold">
              {t('games.comingSoon')}
            </p>
            <div className="mt-4">
              <Button variant="ghost" className="min-h-14" disabled>
                {t('games.comingSoon')}
              </Button>
            </div>
          </Card>

          <Card accent="sun">
            <img src={trophyArt} alt="" className="h-28 w-full object-contain" />
            <h2 className="mt-3 text-2xl font-semibold">{t('games.quizTitle')}</h2>
            <p className="mt-2 font-semibold text-noor-muted">{t('games.quizSummary')}</p>
            <p className="mt-2 text-sm font-extrabold text-noor-muted">+{REWARD_AMOUNTS.quiz}</p>
            <div className="mt-4">
              <Button to="/quiz" variant="mint" className="min-h-14">
                {t('games.openQuiz')}
              </Button>
            </div>
          </Card>

          <Card accent="peach" tone="sun">
            <img src={chest} alt="" className="h-28 w-full object-contain" />
            <h2 className="mt-3 text-2xl font-semibold">{t('games.rewardsTitle')}</h2>
            <p className="mt-2 font-semibold text-noor-muted">{t('games.rewardsSummary')}</p>
            <p className="mt-4 font-display text-4xl font-semibold">
              {t('games.starsCount')} {rewards.stars}
            </p>
            <p className="mt-3 text-sm font-extrabold text-noor-muted">{t('games.educational')}</p>
          </Card>
        </div>
      )}
    </div>
  )
}
