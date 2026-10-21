import { AZKAR_PROGRESS_KEY } from '../hooks/useAzkarProgress.js'
import { readRewards } from '../hooks/useRewards.js'
import { getAzkarCategories, getKalimas } from './contentService.js'

export const PARENT_SETTINGS_KEY = 'little-noor-parent-settings'
export const SELECTED_CHILD_KEY = 'little-noor-selected-child'

const defaultSettings = {
  showActivity: true,
  practiceReminders: false,
  showStars: true,
}

export const emptyProgress = {
  lessonsCompleted: 0,
  lessonsTotal: 0,
  kalimasLearned: 0,
  azkarCompleted: 0,
  quizCorrect: 0,
  quizTotal: 0,
  streak: 0,
  stars: 0,
}

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

export function emptyWeek() {
  return weekDays.map((id) => ({ id, value: 0 }))
}

export function getParentSettings() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(PARENT_SETTINGS_KEY) || '')
    return {
      showActivity: parsed?.showActivity !== false,
      practiceReminders: parsed?.practiceReminders === true,
      showStars: parsed?.showStars !== false,
    }
  } catch {
    return { ...defaultSettings }
  }
}

export function saveParentSettings(next) {
  const settings = {
    ...getParentSettings(),
    ...next,
  }
  try {
    window.localStorage.setItem(PARENT_SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    return settings
  }
  return settings
}

export function readSelectedChild(parentId) {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(SELECTED_CHILD_KEY) || '')
    if (parsed?.parentId === parentId && typeof parsed.childId === 'string') return parsed.childId
  } catch {
    return null
  }
  return null
}

export function saveSelectedChild(parentId, childId) {
  const value = { parentId, childId }
  window.localStorage.setItem(SELECTED_CHILD_KEY, JSON.stringify(value))
  return value
}

export function clearSelectedChild() {
  window.localStorage.removeItem(SELECTED_CHILD_KEY)
}

export function childProfile(child) {
  return {
    id: child.id,
    name: child.name,
    age: child.age,
  }
}

export function toDashboard(child, payload) {
  const progress = { ...emptyProgress, ...payload?.progress }
  return {
    demo: false,
    saved: Boolean(payload?.saved),
    child: childProfile(child),
    lessons: { completed: progress.lessonsCompleted, total: progress.lessonsTotal },
    kalimas: { learned: progress.kalimasLearned, total: getKalimas().length },
    azkar: {
      completed: progress.azkarCompleted,
      total: getAzkarCategories().reduce((sum, category) => sum + category.items.length, 0),
    },
    quiz: { correct: progress.quizCorrect, total: progress.quizTotal },
    streak: progress.streak,
    stars: progress.stars,
    week: emptyWeek(),
    activity: [],
  }
}

async function accountRequest(path, { token, method = 'GET', body } = {}) {
  let response
  try {
    response = await fetch(path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    const error = new Error('The account could not be loaded.')
    error.code = 'network'
    throw error
  }

  const text = await response.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }

  if (!response.ok) {
    const error = new Error(json?.error?.message || 'The account could not be loaded.')
    error.code = json?.error?.code || 'request_failed'
    throw error
  }
  return json
}

export function listChildren(token) {
  return accountRequest('/api/children', { token }).then((json) => (json.children ?? []).map(childProfile))
}

export function deleteChild(token, childId) {
  return accountRequest(`/api/children/${childId}`, { token, method: 'DELETE' })
}

export function addChild(token, { name, age }) {
  return accountRequest('/api/children', {
    token,
    method: 'POST',
    body: { name, age },
  }).then((json) => childProfile(json.child))
}

export function getChildProgress(token, childId) {
  return accountRequest(`/api/children/${childId}/progress`, { token })
}

export function saveChildProgress(token, childId, progress) {
  return accountRequest(`/api/children/${childId}/progress`, {
    token,
    method: 'PUT',
    body: {
      lessonsCompleted: progress.lessonsCompleted,
      lessonsTotal: progress.lessonsTotal,
      kalimasLearned: progress.kalimasLearned,
      azkarCompleted: progress.azkarCompleted,
      quizCorrect: progress.quizCorrect,
      quizTotal: progress.quizTotal,
      streak: progress.streak,
      stars: progress.stars,
    },
  })
}

export function localProgressSnapshot() {
  let azkarCompleted = 0
  try {
    const parsed = JSON.parse(window.localStorage.getItem(AZKAR_PROGRESS_KEY) || '')
    azkarCompleted = Object.values(parsed?.completed ?? {}).filter(Boolean).length
  } catch {
    azkarCompleted = 0
  }
  return {
    stars: readRewards().stars,
    azkarCompleted,
  }
}

export async function syncAccountProgress(token, childId) {
  if (!token || !childId) return { saved: false, mode: 'guest' }

  const current = await getChildProgress(token, childId)
  const server = { ...emptyProgress, ...current.progress }
  const local = localProgressSnapshot()
  const next = {
    ...server,
    stars: Math.max(server.stars, local.stars),
    azkarCompleted: Math.max(server.azkarCompleted, local.azkarCompleted),
  }
  const changed = next.stars !== server.stars || next.azkarCompleted !== server.azkarCompleted
  if (!changed) return { saved: Boolean(current.saved), mode: 'account', progress: server }

  const saved = await saveChildProgress(token, childId, next)
  window.dispatchEvent(new Event('little-noor-account-progress'))
  return { saved: true, mode: 'account', progress: saved.progress }
}

let syncQueue = Promise.resolve()

export function queueAccountSync(token, childId) {
  syncQueue = syncQueue
    .then(() => syncAccountProgress(token, childId))
    .catch(() => ({ saved: false, mode: 'account' }))
  return syncQueue
}
