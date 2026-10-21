import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PLACEHOLDER = 'TO_BE_PROVIDED'
const FIELDS = ['arabic', 'transliteration', 'en', 'ur']

export function isApprovedText(value) {
  if (typeof value !== 'string') return false
  const text = value.trim()
  return text.length > 0 && text.length <= 500 && !text.includes(PLACEHOLDER)
}

export function createLessonCatalog(items) {
  const list = Array.isArray(items) ? items.filter((item) => item && typeof item.id === 'string') : []

  return {
    has(lessonId) {
      return list.some((item) => item.id === lessonId)
    },

    quotations() {
      const lines = []
      for (const item of list) {
        if (item.verified !== true) continue
        for (const field of FIELDS) {
          const text = readField(item, field)
          if (!isApprovedText(text)) continue
          lines.push({ id: item.id, field, text: text.trim() })
        }
      }
      return lines
    },

    speechFor(lessonId, field) {
      const item = list.find((entry) => entry.id === lessonId)
      if (!item || item.verified !== true || !FIELDS.includes(field)) return null
      const text = readField(item, field)
      if (!isApprovedText(text)) return null
      const audioUrl = typeof item.audioUrl === 'string' && item.audioUrl.startsWith('https://')
        ? item.audioUrl
        : null
      return { lessonId: item.id, field, text: text.trim(), audioUrl }
    },
  }
}

export function loadLessonCatalog() {
  const root = join(dirname(fileURLToPath(import.meta.url)), '../../../frontend/src/data')
  const items = []
  pushItems(items, readJson(join(root, 'kalimas.json'))?.items)
  const azkar = readJson(join(root, 'azkar.json'))
  for (const category of azkar?.categories ?? []) {
    pushItems(items, category?.items)
  }
  return createLessonCatalog(items)
}

function pushItems(target, items) {
  if (Array.isArray(items)) target.push(...items)
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

function readField(item, field) {
  if (field === 'en' || field === 'ur') return item.translations?.[field]
  return item[field]
}
