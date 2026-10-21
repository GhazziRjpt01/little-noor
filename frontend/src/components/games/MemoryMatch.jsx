import { motion, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { buildDeck, shuffleDeck } from '../../games/memoryDeck.js'
import { awardStars, REWARD_AMOUNTS } from '../../hooks/useRewards.js'
import { useI18n } from '../../i18n/useI18n.js'
import Button from '../Button.jsx'

export default function MemoryMatch({ kalimas, onBack, shuffle = shuffleDeck, mismatchDelay = 700 }) {
  const { t } = useI18n()
  const reduceMotion = useReducedMotion()
  const [deck, setDeck] = useState(() => shuffle(buildDeck(kalimas)))
  const [up, setUp] = useState([])
  const [matched, setMatched] = useState(() => new Set())
  const [moves, setMoves] = useState(0)
  const [lock, setLock] = useState(false)
  const [won, setWon] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function restart() {
    window.clearTimeout(timer.current)
    setDeck(shuffle(buildDeck(kalimas)))
    setUp([])
    setMatched(new Set())
    setMoves(0)
    setLock(false)
    setWon(false)
  }

  function flip(key) {
    if (lock || won) {
      return
    }
    const card = deck.find((item) => item.key === key)
    if (!card || matched.has(card.pairId) || up.includes(key)) {
      return
    }
    const nextUp = [...up, key]
    if (nextUp.length === 1) {
      setUp(nextUp)
      return
    }

    setMoves((count) => count + 1)
    const first = deck.find((item) => item.key === nextUp[0])
    if (first?.pairId === card.pairId) {
      const nextMatched = new Set(matched)
      nextMatched.add(card.pairId)
      setMatched(nextMatched)
      setUp([])
      if (nextMatched.size === kalimas.length) {
        setWon(true)
        awardStars('memory-match', REWARD_AMOUNTS['memory-match'])
      }
      return
    }

    setUp(nextUp)
    setLock(true)
    timer.current = window.setTimeout(() => {
      setUp([])
      setLock(false)
    }, mismatchDelay)
  }

  if (won) {
    return (
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-white bg-noor-card p-6 text-center shadow-soft sm:p-8"
      >
        <h2 className="text-3xl font-semibold">{t('games.success')}</h2>
        <p className="mt-3 text-lg font-extrabold">
          {t('games.moves')} {moves}
        </p>
        <p className="mt-2 text-lg font-extrabold">
          {t('games.earned')}: {REWARD_AMOUNTS['memory-match']}
        </p>
        <p className="mt-3 font-semibold text-noor-muted">{t('games.educational')}</p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="sun" className="min-h-14 min-w-36 text-lg" onClick={restart}>
            {t('games.playAgain')}
          </Button>
          <Button variant="ghost" className="min-h-14" onClick={onBack}>
            {t('games.back')}
          </Button>
        </div>
      </motion.section>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-2xl font-semibold">
          {t('games.moves')} {moves}
        </p>
        <Button variant="ghost" className="min-h-14" onClick={restart}>
          {t('games.restart')}
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {deck.map((card) => {
          const shown = matched.has(card.pairId) || up.includes(card.key)
          return (
            <button
              key={card.key}
              type="button"
              aria-pressed={shown}
              aria-label={shown ? card.title : t('games.hidden')}
              disabled={shown || lock}
              className={`flex min-h-28 items-center justify-center rounded-3xl px-3 text-center shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink disabled:cursor-default ${shown ? 'bg-noor-card text-noor-ink' : 'bg-noor-sky text-noor-ink'}`}
              onClick={() => flip(card.key)}
            >
              <motion.span
                key={shown ? 'front' : 'back'}
                initial={reduceMotion ? false : { rotateY: 80, opacity: 0.4 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.25 }}
                className="font-display text-xl font-semibold"
              >
                {shown ? card.title : <Star aria-hidden="true" size={36} />}
              </motion.span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
