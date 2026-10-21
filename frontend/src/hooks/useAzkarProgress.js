import { useEffect, useState } from 'react'

export const AZKAR_PROGRESS_KEY = 'little-noor-azkar-progress'

function todayKey() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

function emptyProgress() {
  return { date: todayKey(), counts: {}, completed: {} }
}

function readProgress() {
  try {
    const stored = window.localStorage.getItem(AZKAR_PROGRESS_KEY)
    if (!stored) {
      return emptyProgress()
    }
    const parsed = JSON.parse(stored)
    if (parsed?.date !== todayKey() || typeof parsed.counts !== 'object' || typeof parsed.completed !== 'object') {
      return emptyProgress()
    }
    return {
      date: parsed.date,
      counts: parsed.counts,
      completed: parsed.completed,
    }
  } catch {
    return emptyProgress()
  }
}

export function readAzkarCompletedToday() {
  const progress = readProgress()
  return Object.values(progress.completed).filter(Boolean).length
}

export function useAzkarProgress(itemIds) {
  const [progress, setProgress] = useState(readProgress)

  useEffect(() => {
    try {
      window.localStorage.setItem(AZKAR_PROGRESS_KEY, JSON.stringify(progress))
    } catch {
      // This tally stays in memory if storage is blocked.
    }
    window.dispatchEvent(new Event('little-noor-progress'))
  }, [progress])

  function setCount(id, count) {
    const next = Math.max(0, count)
    setProgress((current) => ({
      ...current,
      counts: { ...current.counts, [id]: next },
    }))
  }

  function toggleComplete(id) {
    setProgress((current) => ({
      ...current,
      completed: { ...current.completed, [id]: !current.completed[id] },
    }))
  }

  const done = itemIds.filter((id) => progress.completed[id]).length

  return {
    getCount: (id) => progress.counts[id] ?? 0,
    isComplete: (id) => Boolean(progress.completed[id]),
    setCount,
    toggleComplete,
    done,
    total: itemIds.length,
  }
}
