import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { activities, azkarCategories, lessons, quizzes, stories } from './library-data.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '../..')
const dataDir = join(root, 'frontend/src/data')
const seedDir = join(root, 'backend/supabase/seed')

const kalimas = JSON.parse(readFileSync(join(dataDir, 'kalimas.json'), 'utf8'))

writeFileSync(join(dataDir, 'azkar.json'), JSON.stringify({ categories: azkarCategories }, null, 2) + '\n')
writeFileSync(join(dataDir, 'quizQuestions.json'), JSON.stringify(quizzes, null, 2) + '\n')
writeFileSync(join(dataDir, 'stories.json'), JSON.stringify({ items: stories }, null, 2) + '\n')
writeFileSync(join(dataDir, 'lessons.json'), JSON.stringify({ items: lessons }, null, 2) + '\n')
writeFileSync(join(dataDir, 'activities.json'), JSON.stringify({ items: activities }, null, 2) + '\n')

const rows = [
  ...kalimas.items.map((item) => row('kalima', item.category ?? 'kalimas', item)),
  ...azkarCategories.flatMap((category) => category.items.map((item) => row('azkar', category.id, item))),
  ...quizzes.items.map((item) => row('quiz', item.category, item, {
    options: item.options,
    explanation: item.explanation,
    explanationUr: item.explanationUr,
  })),
  ...stories.map((item) => row('story', item.category, item)),
  ...lessons.map((item) => row('lesson', item.category, item)),
  ...activities.map((item) => row('activity', item.category, item)),
]

mkdirSync(seedDir, { recursive: true })
writeFileSync(join(seedDir, 'learning_content.sql'), sqlFor(rows))

const counts = rows.reduce((sum, item) => {
  sum[item.kind] = (sum[item.kind] ?? 0) + 1
  return sum
}, {})
console.log(JSON.stringify({ total: rows.length, counts, verified: rows.filter((item) => item.verified).length }))

function row(kind, category, item, extra = {}) {
  return {
    id: item.id,
    kind,
    category: category ?? null,
    title: item.title,
    arabic: item.arabic ?? null,
    transliteration: item.transliteration ?? null,
    translation_en: item.translations?.en ?? item.bodyEn ?? null,
    translation_ur: item.translations?.ur ?? item.bodyUr ?? null,
    body_en: item.bodyEn ?? item.instructions ?? item.explanation ?? null,
    body_ur: item.bodyUr ?? item.explanationUr ?? null,
    source: item.source ?? null,
    review_status: item.reviewStatus,
    verified: item.verified === true,
    age_min: item.ageMin ?? null,
    age_max: item.ageMax ?? null,
    difficulty: item.difficulty ?? null,
    repeat_count: item.repeatCount ?? null,
    reward_points: item.rewardPoints ?? null,
    payload: {
      ...extra,
      lessonLearned: item.lessonLearned ?? null,
    },
  }
}

function sqlFor(items) {
  const columns = [
    'id', 'kind', 'category', 'title', 'arabic', 'transliteration', 'translation_en', 'translation_ur',
    'body_en', 'body_ur', 'source', 'review_status', 'verified', 'age_min', 'age_max', 'difficulty',
    'repeat_count', 'reward_points', 'payload',
  ]
  const statements = items.map((item) => {
    const values = columns.map((column) => sqlValue(column, item[column])).join(', ')
    const updates = columns
      .filter((column) => column !== 'id')
      .map((column) => `${column} = excluded.${column}`)
      .join(', ')
    return `insert into public.learning_content (${columns.join(', ')})\nvalues (${values})\non conflict (id) do update set ${updates}\nwhere public.learning_content.verified = false\n  and public.learning_content.review_status in ('draft', 'needs_review');`
  })
  return [
    '-- Generated draft content. Running this again does not change a row already marked verified.',
    '-- It does not touch profiles, children, or learning_progress.',
    'begin;',
    ...statements,
    'commit;',
    '',
  ].join('\n\n')
}

function sqlValue(column, value) {
  if (value == null) return 'null'
  if (column === 'verified') return value ? 'true' : 'false'
  if (column === 'payload') return `'${JSON.stringify(value).replaceAll("'", "''")}'::jsonb`
  if (typeof value === 'number') return String(value)
  return `'${String(value).replaceAll("'", "''")}'`
}
