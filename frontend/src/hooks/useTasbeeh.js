import { useEffect, useState } from 'react'

export const TASBEEH_STORAGE_KEY = 'little-noor-tasbeeh'

export const TASBEEH_PHRASES = [
  { id: 'subhanallah', label: 'SubhanAllah' },
  { id: 'alhamdulillah', label: 'Alhamdulillah' },
  { id: 'allahu-akbar', label: 'Allahu Akbar' },
]

export const TASBEEH_GOALS = [33, 99, 100]

function emptyCounts() {
  return Object.fromEntries(TASBEEH_PHRASES.map((phrase) => [phrase.id, 0]))
}

function defaultState() {
  return {
    phraseId: TASBEEH_PHRASES[0].id,
    goal: TASBEEH_GOALS[0],
    counts: emptyCounts(),
  }
}

function readState() {
  try {
    const stored = window.localStorage.getItem(TASBEEH_STORAGE_KEY)
    if (!stored) {
      return defaultState()
    }
    const parsed = JSON.parse(stored)
    const phraseId = TASBEEH_PHRASES.some((phrase) => phrase.id === parsed?.phraseId)
      ? parsed.phraseId
      : TASBEEH_PHRASES[0].id
    const goal = TASBEEH_GOALS.includes(parsed?.goal) ? parsed.goal : TASBEEH_GOALS[0]
    const counts = emptyCounts()
    for (const phrase of TASBEEH_PHRASES) {
      const value = parsed?.counts?.[phrase.id]
      counts[phrase.id] = Number.isInteger(value) && value > 0 ? value : 0
    }
    return { phraseId, goal, counts }
  } catch {
    return defaultState()
  }
}

export function readTasbeehTotal() {
  const state = readState()
  return Object.values(state.counts).reduce((sum, value) => sum + value, 0)
}

export function useTasbeeh() {
  const [state, setState] = useState(readState)

  useEffect(() => {
    try {
      window.localStorage.setItem(TASBEEH_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // The count stays in memory if storage is blocked.
    }
  }, [state])

  const count = state.counts[state.phraseId] ?? 0

  function increment() {
    setState((current) => ({
      ...current,
      counts: {
        ...current.counts,
        [current.phraseId]: (current.counts[current.phraseId] ?? 0) + 1,
      },
    }))
  }

  function reset() {
    setState((current) => ({
      ...current,
      counts: { ...current.counts, [current.phraseId]: 0 },
    }))
  }

  function setPhrase(phraseId) {
    setState((current) => ({ ...current, phraseId }))
  }

  function setGoal(goal) {
    setState((current) => ({ ...current, goal }))
  }

  return {
    phraseId: state.phraseId,
    goal: state.goal,
    count,
    complete: count >= state.goal,
    increment,
    reset,
    setPhrase,
    setGoal,
  }
}
