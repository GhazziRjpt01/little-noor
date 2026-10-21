import { motion, useReducedMotion } from 'framer-motion'
import { useI18n } from '../../i18n/useI18n.js'

const BEADS = 33
const RING_RADIUS = 36
const RING_LENGTH = 2 * Math.PI * RING_RADIUS

export default function TasbeehDial({ count, goal, onIncrement }) {
  const { t } = useI18n()
  const reduceMotion = useReducedMotion()
  const complete = count >= goal
  const progress = Math.min(count / goal, 1)
  const filledBeads = Math.round(progress * BEADS)

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative aspect-square">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r={RING_RADIUS} fill="none" stroke="#b9e4f7" strokeWidth="2.5" />
          <circle
            cx="50"
            cy="50"
            r={RING_RADIUS}
            fill="none"
            stroke="#8ed9b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${progress * RING_LENGTH} ${RING_LENGTH}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <div aria-hidden="true" className="absolute inset-0">
          {Array.from({ length: BEADS }, (_, index) => {
            const angle = (index / BEADS) * Math.PI * 2 - Math.PI / 2
            return (
              <span
                key={index}
                className={`absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-4 sm:w-4 ${index < filledBeads ? 'bg-noor-sun-deep' : 'border border-noor-sky bg-white'}`}
                style={{
                  left: `${50 + Math.cos(angle) * 44}%`,
                  top: `${50 + Math.sin(angle) * 44}%`,
                }}
              />
            )
          })}
        </div>
        <div className="absolute inset-[24%] flex items-center justify-center">
          <button
            type="button"
            aria-label={t('tasbeeh.tap')}
            aria-keyshortcuts="Enter Space"
            className={`flex h-full w-full min-h-28 min-w-28 cursor-pointer touch-manipulation select-none items-center justify-center rounded-full bg-noor-sun text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink ${complete ? 'ring-4 ring-noor-mint-deep' : ''}`}
            onClick={onIncrement}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' && event.key !== ' ') {
                return
              }
              event.preventDefault()
              onIncrement()
            }}
          >
            <span aria-live="polite" aria-label={t('tasbeeh.count')} className="font-display text-6xl font-semibold sm:text-7xl">
              {count}
            </span>
          </button>
        </div>
      </div>
      {complete ? (
        <motion.p
          role="status"
          className="mt-4 text-center text-xl font-extrabold text-noor-ink"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          {reduceMotion ? null : (
            <motion.span
              aria-hidden="true"
              className="mr-2 inline-block text-noor-sun-deep"
              initial={{ rotate: -12, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
            >
              ★
            </motion.span>
          )}
          {t('tasbeeh.complete')}
        </motion.p>
      ) : null}
    </div>
  )
}
