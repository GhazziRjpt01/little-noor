import { AppError } from './errors.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const LESSON_ID = /^[a-z0-9-]{1,80}$/
const CONTROL = /[\u0000-\u001F\u007F]/

const PROGRESS_FIELDS = [
  ['lessonsCompleted', 'lessons_completed'],
  ['lessonsTotal', 'lessons_total'],
  ['kalimasLearned', 'kalimas_learned'],
  ['azkarCompleted', 'azkar_completed'],
  ['quizCorrect', 'quiz_correct'],
  ['quizTotal', 'quiz_total'],
  ['streak', 'streak'],
  ['stars', 'stars'],
]

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function invalid(details) {
  throw new AppError(400, 'validation_error', 'The request is not valid.', details)
}

export function parseSignup(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const email = typeof source.email === 'string' ? source.email.trim().toLowerCase() : ''
  const password = typeof source.password === 'string' ? source.password : ''
  const displayName = typeof source.displayName === 'string' ? source.displayName.trim() : ''

  if (!EMAIL.test(email) || email.length > 254) details.push({ field: 'email', message: 'Enter a valid email address.' })
  if (password.length < 8 || password.length > 72) {
    details.push({ field: 'password', message: 'Password must be 8 to 72 characters.' })
  }
  if (displayName.length < 1 || displayName.length > 80 || CONTROL.test(displayName)) {
    details.push({ field: 'displayName', message: 'Display name must be 1 to 80 characters.' })
  }
  if (source.consent !== true) {
    details.push({ field: 'consent', message: 'A parent must agree to the draft consent before creating an account.' })
  }
  if (details.length) invalid(details)
  return { email, password, displayName, consent: true }
}

export function parseLogin(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const email = typeof source.email === 'string' ? source.email.trim().toLowerCase() : ''
  const password = typeof source.password === 'string' ? source.password : ''

  if (!EMAIL.test(email) || email.length > 254) details.push({ field: 'email', message: 'Enter a valid email address.' })
  if (password.length < 8 || password.length > 72) {
    details.push({ field: 'password', message: 'Password must be 8 to 72 characters.' })
  }
  if (details.length) invalid(details)
  return { email, password }
}

export function parseChat(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const message = typeof source.message === 'string' ? source.message.trim() : ''
  const language = source.language

  if (message.length < 1 || message.length > 400 || CONTROL.test(message)) {
    details.push({ field: 'message', message: 'Message must be 1 to 400 characters.' })
  }
  if (!['en', 'ur', 'ar'].includes(language)) {
    details.push({ field: 'language', message: 'Language must be en, ur, or ar.' })
  }
  if (details.length) invalid(details)
  return { message, language }
}

export function parseGreeting(body) {
  const source = isObject(body) ? body : {}
  if (!['en', 'ur', 'ar'].includes(source.language)) {
    invalid([{ field: 'language', message: 'Language must be en, ur, or ar.' }])
  }
  return { language: source.language }
}

const SPEECH_FIELDS = ['arabic', 'transliteration', 'en', 'ur']

export function parseTts(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const lessonId = typeof source.lessonId === 'string' ? source.lessonId.trim() : ''

  if (!LESSON_ID.test(lessonId)) {
    details.push({ field: 'lessonId', message: 'Lesson id must be a short lowercase slug.' })
  }
  if (!SPEECH_FIELDS.includes(source.field)) {
    details.push({ field: 'field', message: 'Field must be arabic, transliteration, en, or ur.' })
  }
  if (details.length) invalid(details)
  return { lessonId, field: source.field }
}

export function parseChild(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const name = typeof source.name === 'string' ? source.name.trim() : ''

  if (name.length < 1 || name.length > 40 || CONTROL.test(name)) {
    details.push({ field: 'name', message: 'Name must be 1 to 40 characters.' })
  }
  if (!Number.isInteger(source.age) || source.age < 3 || source.age > 10) {
    details.push({ field: 'age', message: 'Age must be a whole number from 3 to 10.' })
  }
  if (details.length) invalid(details)
  return { name, age: source.age }
}

export function parseChildId(value) {
  if (typeof value !== 'string' || !UUID.test(value)) {
    invalid([{ field: 'childId', message: 'Child id must be a UUID.' }])
  }
  return value
}

export function parseLessonId(value) {
  if (typeof value !== 'string' || !LESSON_ID.test(value)) {
    invalid([{ field: 'id', message: 'Lesson id must be a short lowercase slug.' }])
  }
  return value
}

export function parseProgress(body) {
  const source = isObject(body) ? body : {}
  const details = []
  const row = {}

  for (const [camel, snake] of PROGRESS_FIELDS) {
    const value = source[camel]
    if (!Number.isInteger(value) || value < 0 || value > 10000) {
      details.push({ field: camel, message: `${camel} must be a whole number from 0 to 10000.` })
    } else {
      row[snake] = value
    }
  }

  if (details.length) invalid(details)
  return row
}

export function toProgress(row) {
  return {
    lessonsCompleted: row?.lessons_completed ?? 0,
    lessonsTotal: row?.lessons_total ?? 0,
    kalimasLearned: row?.kalimas_learned ?? 0,
    azkarCompleted: row?.azkar_completed ?? 0,
    quizCorrect: row?.quiz_correct ?? 0,
    quizTotal: row?.quiz_total ?? 0,
    streak: row?.streak ?? 0,
    stars: row?.stars ?? 0,
  }
}
