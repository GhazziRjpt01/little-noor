import { useEffect, useState } from 'react'
import { Check, Star } from 'lucide-react'
import chest from '../../assets/illustrations/treasure-chest.webp'
import { readAzkarCompletedToday } from '../../hooks/useAzkarProgress.js'
import { readTasbeehTotal } from '../../hooks/useTasbeeh.js'
import { useRewards } from '../../hooks/useRewards.js'
import Card from '../Card.jsx'

const STAR_SLOTS = 5

function readPractice() {
  return {
    azkar: readAzkarCompletedToday() > 0,
    tasbeeh: readTasbeehTotal() > 0,
  }
}

export default function LearningGoal() {
  const rewards = useRewards()
  const [practice, setPractice] = useState(readPractice)

  useEffect(() => {
    const sync = () => setPractice(readPractice())
    window.addEventListener('little-noor-progress', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('little-noor-progress', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const goals = [
    { label: 'Say one Azkar', done: practice.azkar },
    { label: 'Tap the tasbeeh', done: practice.tasbeeh },
    { label: 'Earn a star', done: rewards.stars > 0 },
  ]
  const stepsDone = goals.filter((goal) => goal.done).length
  const filledStars = Math.min(rewards.stars, STAR_SLOTS)

  return (
    <Card accent="sun" className="flex h-full flex-col sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-extrabold text-noor-muted">For today</p>
          <h2 className="mt-1 text-3xl font-semibold">Today’s Learning Goal</h2>
        </div>
        <img
          src={chest}
          alt="An open treasure chest filled with stars"
          className="h-24 w-24 shrink-0 object-contain"
        />
      </div>
      <p className="mt-3 text-lg font-semibold leading-relaxed text-noor-muted">
        Say one Azkar, tap the tasbeeh, and earn a star.
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm font-extrabold">
          <span>Progress</span>
          <span>
            {stepsDone} of {goals.length}
          </span>
        </div>
        <div
          className="h-4 w-full overflow-hidden rounded-full bg-noor-sky-soft"
          role="progressbar"
          aria-valuenow={stepsDone}
          aria-valuemin={0}
          aria-valuemax={goals.length}
          aria-label="Today’s learning progress"
        >
          <div
            className="h-full rounded-full bg-noor-sun-deep"
            style={{ width: `${Math.round((stepsDone / goals.length) * 100)}%` }}
          />
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {goals.map((goal) => (
          <li key={goal.label} className="flex items-center gap-3 text-base font-extrabold">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${goal.done ? 'bg-noor-mint-deep' : 'bg-noor-sky-soft text-transparent'}`}
              aria-hidden="true"
            >
              <Check size={18} />
            </span>
            <span>
              {goal.label}
              <span className="sr-only">{goal.done ? ', done' : ', not yet'}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex gap-1" aria-label={`${rewards.stars} stars on this device`}>
          {Array.from({ length: STAR_SLOTS }, (_, index) => (
            <Star
              key={index}
              size={28}
              aria-hidden="true"
              className={
                index < filledStars
                  ? 'fill-noor-sun-deep text-noor-sun-deep'
                  : 'fill-transparent text-noor-sky-deep'
              }
            />
          ))}
        </div>
        <p className="text-sm font-extrabold text-noor-muted">
          {rewards.stars} stars on this device
        </p>
      </div>
    </Card>
  )
}
