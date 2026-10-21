import activities from '../data/activities.json'
import azkar from '../data/azkar.json'
import kalimas from '../data/kalimas.json'
import lessons from '../data/lessons.json'
import quizQuestions from '../data/quizQuestions.json'
import stories from '../data/stories.json'

export function getKalimas() {
  return kalimas.items
}

export function getKalimaById(id) {
  return kalimas.items.find((item) => item.id === id) ?? null
}

export function getAzkarCategories() {
  return azkar.categories
}

export function getAzkarItems(categoryId) {
  const category = azkar.categories.find((item) => item.id === categoryId)
  return category ? category.items : []
}

export function getQuizCategories() {
  return quizQuestions.categories
}

export function getStories() {
  return stories.items
}

export function getLessons() {
  return lessons.items
}

export function getActivities() {
  return activities.items
}

export function getReviewLibrary() {
  const azkarItems = azkar.categories.flatMap((category) =>
    category.items.map((item) => ({ ...item, kind: 'azkar', category: category.id })),
  )
  return [
    ...kalimas.items.map((item) => ({ ...item, kind: 'kalima', category: 'kalimas' })),
    ...azkarItems,
    ...quizQuestions.items.map((item) => ({ ...item, kind: 'quiz' })),
    ...stories.items.map((item) => ({ ...item, kind: 'story' })),
    ...lessons.items.map((item) => ({ ...item, kind: 'lesson' })),
    ...activities.items.map((item) => ({ ...item, kind: 'activity' })),
  ]
}

export function getQuizQuestions(categoryId) {
  if (!categoryId) {
    return quizQuestions.items
  }
  return quizQuestions.items.filter((item) => item.category === categoryId)
}

export function findAzkarArabicByLabel(label) {
  const needle = String(label ?? '').toLowerCase().replace(/\s+/g, '')
  if (!needle) {
    return null
  }

  for (const category of azkar.categories) {
    for (const item of category.items) {
      const candidates = [item.title, item.transliteration, item.translations?.en]
      const matched = candidates.some(
        (value) => String(value ?? '').toLowerCase().replace(/\s+/g, '') === needle,
      )
      if (matched) {
        return { arabic: item.arabic, verified: item.verified === true }
      }
    }
  }

  return null
}
