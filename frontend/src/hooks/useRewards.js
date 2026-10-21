import { useEffect, useState } from 'react'

export const REWARDS_KEY = 'little-noor-rewards'
export const REWARD_AMOUNTS = {
  'memory-match': 3,
  quiz: 1,
}

const emptyRewards = {
  stars: 0,
  activities: {
    'memory-match': 0,
    quiz: 0,
  },
}

function wholeNumber(value) {
  return Number.isInteger(value) && value > 0 ? value : 0
}

export function readRewards() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(REWARDS_KEY) || '')
    return {
      stars: wholeNumber(parsed?.stars),
      activities: {
        'memory-match': wholeNumber(parsed?.activities?.['memory-match']),
        quiz: wholeNumber(parsed?.activities?.quiz),
      },
    }
  } catch {
    return emptyRewards
  }
}

export function awardStars(activityId, amount = REWARD_AMOUNTS[activityId] ?? 0) {
  const current = readRewards()
  const next = {
    stars: current.stars + amount,
    activities: {
      ...current.activities,
      [activityId]: (current.activities[activityId] ?? 0) + 1,
    },
  }
  try {
    window.localStorage.setItem(REWARDS_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('little-noor-rewards'))
  } catch {
    return current
  }
  return next
}

export function useRewards() {
  const [rewards, setRewards] = useState(readRewards)

  useEffect(() => {
    const sync = () => setRewards(readRewards())
    window.addEventListener('little-noor-rewards', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('little-noor-rewards', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return rewards
}
