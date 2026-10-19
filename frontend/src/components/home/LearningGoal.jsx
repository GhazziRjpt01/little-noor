import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Card from '../Card.jsx'

const stepsDone = 2
const stepsTotal = 4
const starsEarned = 2
const starsTotal = 5
const progress = Math.round((stepsDone / stepsTotal) * 100)

export default function LearningGoal() {
  return (
    <Card accent="sun" className="flex h-full flex-col sm:p-8">
      <p className="text-sm font-extrabold text-noor-muted">For today</p>
      <h2 className="mt-1 text-3xl font-semibold">Today’s Learning Goal</h2>
      <p className="mt-3 text-lg font-semibold leading-relaxed text-noor-muted">
        Learn one Kalima and practice a short tasbeeh.
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-extrabold">
          <span>Progress</span>
          <span>
            {stepsDone} of {stepsTotal}
          </span>
        </div>
        <div
          className="h-4 w-full overflow-hidden rounded-full bg-noor-sky-soft"
          role="progressbar"
          aria-valuenow={stepsDone}
          aria-valuemin={0}
          aria-valuemax={stepsTotal}
          aria-label="Today’s learning progress"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-noor-sun-deep"
            style={{ width: `${progress}%` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1" aria-label={`${starsEarned} of ${starsTotal} stars earned`}>
          {Array.from({ length: starsTotal }, (_, index) => {
            const earned = index < starsEarned

            return (
              <Star
                key={index}
                size={28}
                aria-hidden="true"
                className={
                  earned
                    ? 'fill-noor-sun-deep text-noor-sun-deep'
                    : 'fill-transparent text-noor-sky-deep'
                }
              />
            )
          })}
        </div>
        <p className="text-sm font-extrabold text-noor-muted">
          {starsEarned} stars earned
        </p>
      </div>
    </Card>
  )
}
