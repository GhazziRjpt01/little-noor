import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { after, before, describe, it } from 'node:test'
import { createApp } from '../src/app.js'
import { assertProductionOrigin, readConfig } from '../src/config.js'
import { createLogger } from '../src/logger.js'
import { createLessonCatalog, loadLessonCatalog } from '../src/lessons/catalog.js'
import { createOpenAI } from '../src/openai.js'
import { AI_AUDIO_LABEL, RECORDED_AUDIO_LABEL } from '../src/routes/ai.js'
import { TEACHER_GREETINGS } from '../src/teacherPrompt.js'
import {
  CHILD_ID,
  ORIGIN,
  PARENT_A,
  PARENT_B,
  TOKEN_A,
  TOKEN_B,
  fakeSupabase,
  listen,
  send,
} from './helpers.js'

const progressBody = {
  lessonsCompleted: 1,
  lessonsTotal: 4,
  kalimasLearned: 1,
  azkarCompleted: 0,
  quizCorrect: 0,
  quizTotal: 0,
  streak: 1,
  stars: 1,
}

function testConfig(env = {}) {
  return readConfig({
    FRONTEND_ORIGIN: ORIGIN,
    ...env,
  })
}

describe('health and safety', () => {
  it('reports env presence without calling Supabase or leaking a key', async () => {
    const lines = []
    const secret = 'super-secret-anon-key'
    const app = createApp({
      config: testConfig({
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_ANON_KEY: secret,
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-must-not-appear',
      }),
      logger: createLogger((line) => lines.push(line)),
    })
    const server = await listen(app)

    try {
      const health = await send(server.url, '/api/health')
      const root = await send(server.url, '/health')
      assert.equal(health.status, 200)
      assert.deepEqual(health.json.supabase, { env: 'present', checked: false })
      assert.deepEqual(health.json.openai, { env: 'missing', checked: false })
      assert.equal(root.json.supabase.env, 'present')
      assert.equal(health.text.includes(secret), false)
      assert.equal(health.text.includes('service-role-must-not-appear'), false)
      assert.equal(lines.join('\n').includes(secret), false)
      assert.equal(readConfig({
        SUPABASE_SERVICE_ROLE_KEY: 'service-role-must-not-appear',
      }).supabaseConfigured, false)
    } finally {
      await server.close()
    }
  })

  it('uses one explicit frontend origin', async () => {
    const server = await listen(createApp({ config: testConfig() }))
    try {
      const allowed = await send(server.url, '/api/health')
      const rejected = await send(server.url, '/api/health', { origin: 'https://evil.example' })
      assert.equal(allowed.headers.get('access-control-allow-origin'), ORIGIN)
      assert.notEqual(rejected.headers.get('access-control-allow-origin'), 'https://evil.example')
    } finally {
      await server.close()
    }
  })

  it('requires FRONTEND_ORIGIN in production', () => {
    assert.throws(() => assertProductionOrigin({ NODE_ENV: 'production' }), /FRONTEND_ORIGIN/)
    assert.doesNotThrow(() => assertProductionOrigin({
      NODE_ENV: 'production',
      FRONTEND_ORIGIN: 'https://little-noor.example',
    }))
  })

  it('does not embed a model key or service-role key', () => {
    const source = ['src/config.js', 'src/supabase.js', 'src/server.js', 'src/app.js', 'src/openai.js', 'src/routes/ai.js']
      .map((file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'))
      .join('\n')
    assert.equal(source.toLowerCase().includes('service_role'), false)
    assert.equal(source.includes('sk-'), false)
    const configured = readConfig({ OPENAI_API_KEY: 'test-model-key' })
    assert.equal(configured.openaiConfigured, true)
    assert.equal(configured.openaiKey, 'test-model-key')
  })
})

describe('AI teacher', () => {
  let server
  let lines

  before(async () => {
    lines = []
    server = await listen(createApp({
      config: testConfig(),
      logger: createLogger((line) => lines.push(line)),
      createClient() {
        throw new Error('the stub must not call Supabase')
      },
    }))
  })

  after(async () => {
    await server.close()
  })

  it('returns 503 when no model key is set and never logs the question', async () => {
    const response = await send(server.url, '/api/ai/chat', {
      method: 'POST',
      body: { message: 'secret-child-question', language: 'en' },
    })
    const alias = await send(server.url, '/api/ai-teacher', {
      method: 'POST',
      body: { message: 'secret-child-question', language: 'en' },
    })

    assert.equal(response.status, 503)
    assert.deepEqual(response.json, {
      error: { code: 'openai_not_configured', message: 'AI Teacher is not connected yet.' },
    })
    assert.equal(alias.status, 503)
    assert.equal(response.text.includes('secret-child-question'), false)
    assert.equal(lines.join('\n').includes('secret-child-question'), false)
  })

  it('rejects an invalid question without echoing it', async () => {
    const huge = 'Z'.repeat(401)
    const response = await send(server.url, '/api/ai/chat', {
      method: 'POST',
      body: { message: huge, language: 'en' },
    })
    assert.equal(response.status, 400)
    assert.equal(response.json.error.code, 'validation_error')
    assert.equal(response.text.includes(huge), false)
  })

  it('limits repeated chat posts', async () => {
    const limited = await listen(createApp({
      config: testConfig(),
      logger: createLogger(),
      rateLimits: { ai: 1 },
    }))
    try {
      const first = await send(limited.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'Hello', language: 'en' },
      })
      const second = await send(limited.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'Hello again', language: 'en' },
      })
      assert.equal(first.status, 503)
      assert.equal(second.status, 429)
      assert.equal(second.json.error.code, 'rate_limited')
    } finally {
      await limited.close()
    }
  })

  it('moderates the question before answering and keeps it out of the logs', async () => {
    const lines = []
    const { openai, lessonCatalog, calls } = teacherDouble()
    const server = await listen(createApp({
      config: testConfig({ OPENAI_API_KEY: 'test-model-key' }),
      logger: createLogger((line) => lines.push(line)),
      openai,
      lessonCatalog,
    }))

    try {
      const health = await send(server.url, '/api/health')
      const answer = await send(server.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'How can I be kind?', language: 'en' },
      })
      const blocked = await send(server.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'blocked-question', language: 'en' },
      })

      assert.deepEqual(health.json.openai, { env: 'present', checked: false })
      assert.equal(health.text.includes('test-model-key'), false)
      assert.equal(answer.status, 200)
      assert.equal(answer.json.reply, 'A short answer for children.')
      assert.equal(answer.json.voice.audioBase64, Buffer.from('fake-mp3').toString('base64'))
      assert.equal(answer.json.voice.label, AI_AUDIO_LABEL)
      assert.deepEqual(calls.map((call) => call[0]), ['moderate', 'complete', 'speak', 'moderate'])
      assert.equal(calls[2][1], 'A short answer for children.')
      assert.equal(calls[2][2].voice, 'coral')
      assert.match(calls[2][2].instructions, /small child/)
      const system = calls[1][1][0].content
      assert.match(system, /children ages 3 to 10/)
      assert.match(system, /Never invent Quranic verses, duas, or hadith/)
      assert.match(system, /Please ask your parents or teacher\./)
      assert.match(system, /kind-lesson en: Be kind today\./)
      assert.equal(system.includes('TO_BE_PROVIDED'), false)
      assert.equal(system.includes('Should stay unread'), false)
      assert.deepEqual(calls[1][1][1], { role: 'user', content: 'How can I be kind?' })
      assert.equal(blocked.status, 422)
      assert.equal(blocked.json.error.code, 'moderation_blocked')
      assert.equal(blocked.text.includes('blocked-question'), false)
      assert.equal(lines.join('\n').includes('How can I be kind?'), false)
      assert.equal(lines.join('\n').includes('blocked-question'), false)
      assert.equal(lines.join('\n').includes('test-model-key'), false)
    } finally {
      await server.close()
    }
  })

  it('speaks the fixed greeting and still shows the reply if the voice fails', async () => {
    const spoken = teacherDouble()
    const server = await listen(createApp({
      config: testConfig(),
      openai: spoken.openai,
      lessonCatalog: spoken.lessonCatalog,
    }))
    const quiet = teacherDouble()
    quiet.openai.speak = async () => {
      throw new Error('voice down')
    }
    const quietServer = await listen(createApp({
      config: testConfig(),
      openai: quiet.openai,
      lessonCatalog: quiet.lessonCatalog,
    }))

    try {
      const greeting = await send(server.url, '/api/ai/greeting', {
        method: 'POST',
        body: { language: 'en', text: 'invented verse' },
      })
      const answer = await send(quietServer.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'How can I be kind?', language: 'en' },
      })

      assert.equal(greeting.status, 200)
      assert.equal(spoken.calls.filter((call) => call[0] === 'speak')[0][1], TEACHER_GREETINGS.en)
      assert.equal(greeting.text.includes('invented verse'), false)
      assert.equal(answer.status, 200)
      assert.equal(answer.json.reply, 'A short answer for children.')
      assert.equal(answer.json.voice, null)
    } finally {
      await server.close()
      await quietServer.close()
    }
  })

  it('does not pass a failed model response back to the child', async () => {
    const client = createOpenAI({
      apiKey: 'test-model-key',
      timeoutMs: 1000,
      fetchImpl: async () => ({
        ok: false,
        arrayBuffer: async () => Buffer.from('secret-child-question test-model-key'),
      }),
    })
    await assert.rejects(
      () => client.moderate('secret-child-question', 'omni-moderation-latest'),
      (error) => {
        assert.equal(error.code, 'openai_unavailable')
        assert.equal(String(error.message).includes('secret-child-question'), false)
        assert.equal(String(error.message).includes('test-model-key'), false)
        return true
      },
    )

    const timed = createOpenAI({
      apiKey: 'test-model-key',
      timeoutMs: 1000,
      fetchImpl() {
        const error = new Error('timed out')
        error.name = 'TimeoutError'
        return Promise.reject(error)
      },
    })
    const server = await listen(createApp({
      config: testConfig(),
      openai: timed,
      lessonCatalog: createLessonCatalog([]),
    }))
    try {
      const response = await send(server.url, '/api/ai/chat', {
        method: 'POST',
        body: { message: 'How can I be kind?', language: 'en' },
      })
      assert.equal(response.status, 504)
      assert.equal(response.json.error.code, 'openai_timeout')
      assert.equal(response.text.includes('How can I be kind?'), false)
    } finally {
      await server.close()
    }
  })

  it('reads aloud only approved lesson text and prefers recorded audio', async () => {
    const shipped = loadLessonCatalog()
    assert.equal(shipped.has('kalima-1'), true)
    assert.equal(shipped.has('morning-1'), true)
    assert.equal(shipped.speechFor('kalima-1', 'arabic'), null)
    assert.equal(shipped.quotations().length, 0)

    const { openai, lessonCatalog, calls } = teacherDouble()
    const server = await listen(createApp({
      config: testConfig(),
      openai,
      lessonCatalog,
    }))

    try {
      const recorded = await send(server.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'recorded-lesson', field: 'en', text: 'invented verse' },
      })
      const spoken = await send(server.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'kind-lesson', field: 'en', text: 'invented verse' },
      })
      const hidden = await send(server.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'hidden-lesson', field: 'en', text: 'invented verse' },
      })
      const placeholder = await send(server.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'kind-lesson', field: 'arabic' },
      })

      assert.equal(recorded.status, 200)
      assert.deepEqual(recorded.json, {
        lessonId: 'recorded-lesson',
        source: 'recorded',
        label: RECORDED_AUDIO_LABEL,
        audioUrl: 'https://cdn.example/qari.mp3',
      })
      assert.equal(spoken.status, 200)
      assert.equal(spoken.json.source, 'ai')
      assert.equal(spoken.json.label, AI_AUDIO_LABEL)
      assert.equal(spoken.json.contentType, 'audio/mpeg')
      assert.equal(spoken.json.audioBase64, Buffer.from('fake-mp3').toString('base64'))
      assert.equal(spoken.text.includes('invented verse'), false)
      assert.equal(spoken.text.includes('Be kind today.'), false)
      assert.deepEqual(calls.filter((call) => call[0] === 'speak').map((call) => call[1]), ['Be kind today.'])
      assert.equal(hidden.status, 404)
      assert.equal(hidden.json.error.code, 'lesson_not_approved')
      assert.equal(placeholder.status, 404)
      assert.equal(hidden.text.includes('invented verse'), false)
    } finally {
      await server.close()
    }
  })

  it('limits repeated speech requests', async () => {
    const limited = await listen(createApp({
      config: testConfig(),
      openai: null,
      lessonCatalog: createLessonCatalog([]),
      rateLimits: { aiTts: 1 },
    }))
    try {
      const first = await send(limited.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'kalima-1', field: 'en' },
      })
      const second = await send(limited.url, '/api/ai/tts', {
        method: 'POST',
        body: { lessonId: 'kalima-1', field: 'en' },
      })
      assert.equal(first.status, 404)
      assert.equal(second.status, 429)
    } finally {
      await limited.close()
    }
  })
})

function teacherDouble() {
  const calls = []
  const openai = {
    async moderate(input) {
      calls.push(['moderate', input])
      return { flagged: input === 'blocked-question' }
    },
    async complete(messages) {
      calls.push(['complete', messages])
      return 'A short answer for children.'
    },
    async speak(input, options) {
      calls.push(['speak', input, options ?? null])
      return Buffer.from('fake-mp3')
    },
  }
  const lessonCatalog = createLessonCatalog([
    {
      id: 'kind-lesson',
      verified: true,
      audioUrl: null,
      arabic: 'TO_BE_PROVIDED',
      transliteration: 'TO_BE_PROVIDED',
      translations: { en: 'Be kind today.', ur: 'TO_BE_PROVIDED' },
    },
    {
      id: 'recorded-lesson',
      verified: true,
      audioUrl: 'https://cdn.example/qari.mp3',
      arabic: 'TO_BE_PROVIDED',
      transliteration: 'TO_BE_PROVIDED',
      translations: { en: 'Be kind today.', ur: 'TO_BE_PROVIDED' },
    },
    {
      id: 'hidden-lesson',
      verified: false,
      audioUrl: null,
      arabic: 'TO_BE_PROVIDED',
      transliteration: 'TO_BE_PROVIDED',
      translations: { en: 'Should stay unread.', ur: 'TO_BE_PROVIDED' },
    },
  ])
  return { openai, lessonCatalog, calls }
}

describe('lessons', () => {
  it('returns only verified lessons and no audio until an https url is stored', async () => {
    const { createClient, calls } = fakeSupabase({
      query(recorded) {
        if (recorded.ops.some((op) => op[0] === 'maybeSingle')) {
          const id = recorded.ops.find((op) => op[0] === 'eq' && op[1] === 'id')?.[2]
          if (id === 'with-audio') {
            return { data: { id, audio_url: 'https://cdn.example/clip.mp3', verified: true }, error: null }
          }
          if (id === 'plain-http') {
            return { data: { id, audio_url: 'http://cdn.example/clip.mp3', verified: true }, error: null }
          }
          return { data: { id, audio_url: null, verified: true }, error: null }
        }
        return {
          data: [
            { id: 'visible-lesson', title: 'Visible lesson', reviewed_by: null, verified: true },
            { id: 'hidden-lesson', title: 'Hidden lesson', reviewed_by: null, verified: false },
          ],
          error: null,
        }
      },
    })
    const server = await listen(createApp({ config: testConfig(), createClient }))

    try {
      const list = await send(server.url, '/api/lessons')
      const missing = await send(server.url, '/api/lessons/sample-lesson/audio')
      const insecure = await send(server.url, '/api/lessons/plain-http/audio')
      const ready = await send(server.url, '/api/lessons/with-audio/audio')

      assert.deepEqual(list.json, {
        lessons: [{ id: 'visible-lesson', title: 'Visible lesson', reviewedBy: null }],
      })
      assert.equal(calls.some((call) => call.ops?.some((op) => op[0] === 'eq' && op[1] === 'verified' && op[2] === true)), true)
      assert.equal(missing.status, 404)
      assert.equal(missing.json.error.code, 'audio_unavailable')
      assert.equal(insecure.status, 404)
      assert.deepEqual(ready.json, { id: 'with-audio', audioUrl: 'https://cdn.example/clip.mp3' })
    } finally {
      await server.close()
    }
  })

  it('says the table is missing instead of inventing lessons', async () => {
    const { createClient } = fakeSupabase({
      query() {
        return { data: null, error: { code: 'PGRST205', message: 'Could not find the table public.lessons in the schema cache' } }
      },
    })
    const server = await listen(createApp({ config: testConfig(), createClient }))
    try {
      const response = await send(server.url, '/api/lessons')
      assert.equal(response.status, 503)
      assert.equal(response.json.error.code, 'schema_missing')
      assert.equal(response.text.includes('schema cache'), false)
    } finally {
      await server.close()
    }
  })

  it('reports that Supabase is not configured', async () => {
    const server = await listen(createApp({ config: testConfig() }))
    try {
      const response = await send(server.url, '/api/lessons')
      assert.equal(response.status, 503)
      assert.equal(response.json.error.code, 'supabase_not_configured')
      assert.deepEqual(response.json.error.details, undefined)
    } finally {
      await server.close()
    }
  })
})

describe('parent progress', () => {
  let server
  let lines
  let calls

  before(async () => {
    lines = []
    const fake = fakeSupabase({
      query(recorded) {
        if (recorded.table === 'children' && recorded.ops.some((op) => op[0] === 'insert')) {
          const row = recorded.ops.find((op) => op[0] === 'insert')[1]
          return { data: { id: CHILD_ID, name: row.name, age: row.age }, error: null }
        }
        if (recorded.table === 'children' && recorded.ops.some((op) => op[0] === 'maybeSingle')) {
          const id = recorded.ops.find((op) => op[0] === 'eq' && op[1] === 'id')?.[2]
          if (recorded.accessToken === TOKEN_A && id === CHILD_ID) return { data: { id: CHILD_ID }, error: null }
          return { data: null, error: null }
        }
        if (recorded.table === 'children') {
          return {
            data: recorded.accessToken === TOKEN_A ? [{ id: CHILD_ID, name: 'ChildNameZZ', age: 6 }] : [],
            error: null,
          }
        }
        if (recorded.table === 'learning_progress' && recorded.ops.some((op) => op[0] === 'upsert')) {
          return { data: recorded.ops.find((op) => op[0] === 'upsert')[1], error: null }
        }
        return { data: null, error: null }
      },
    })
    calls = fake.calls
    server = await listen(createApp({
      config: testConfig(),
      logger: createLogger((line) => lines.push(line)),
      createClient: fake.createClient,
    }))
  })

  after(async () => {
    await server.close()
  })

  it('requires a parent token', async () => {
    const response = await send(server.url, '/api/children')
    assert.equal(response.status, 401)
    assert.equal(response.json.error.code, 'unauthorized')
  })

  it('stores a child on the signed-in parent and hides that child from another parent', async () => {
    const created = await send(server.url, '/api/children', {
      method: 'POST',
      token: TOKEN_A,
      body: { name: 'ChildNameZZ', age: 6, parentId: PARENT_B },
    })
    const ownList = await send(server.url, '/api/children', { token: TOKEN_A })
    const otherList = await send(server.url, '/api/children', { token: TOKEN_B })
    const otherProgress = await send(server.url, `/api/children/${CHILD_ID}/progress`, { token: TOKEN_B })
    const ownProgress = await send(server.url, `/api/children/${CHILD_ID}/progress`, { token: TOKEN_A })
    const saved = await send(server.url, `/api/children/${CHILD_ID}/progress`, {
      method: 'PUT',
      token: TOKEN_A,
      body: progressBody,
    })

    const insert = calls.find((call) => call.ops?.some((op) => op[0] === 'insert'))
    const row = insert.ops.find((op) => op[0] === 'insert')[1]
    assert.equal(created.status, 201)
    assert.equal(row.parent_id, PARENT_A)
    assert.equal(row.parentId, undefined)
    assert.equal(ownList.json.children.some((child) => child.id === CHILD_ID), true)
    assert.equal(otherList.json.children.some((child) => child.id === CHILD_ID), false)
    assert.equal(otherProgress.status, 404)
    assert.equal(ownProgress.json.saved, false)
    assert.equal(saved.status, 200)
    assert.equal(saved.json.saved, true)
    assert.equal(saved.json.progress.lessonsCompleted, 1)
    assert.equal(calls.some((call) => call.table === 'learning_progress' && call.accessToken === TOKEN_B), false)
    assert.equal(lines.join('\n').includes('ChildNameZZ'), false)
  })

  it('rejects a child outside ages 3 to 10', async () => {
    const response = await send(server.url, '/api/children', {
      method: 'POST',
      token: TOKEN_A,
      body: { name: 'Noor', age: 2 },
    })
    assert.equal(response.status, 400)
    assert.equal(response.json.error.code, 'validation_error')
  })

  it('deletes child data only for the signed-in parent', async () => {
    const before = calls.length
    const removed = await send(server.url, `/api/children/${CHILD_ID}`, {
      method: 'DELETE',
      token: TOKEN_A,
    })
    const other = await send(server.url, `/api/children/${CHILD_ID}`, {
      method: 'DELETE',
      token: TOKEN_B,
    })
    const deletions = calls.slice(before).filter((call) => call.ops?.some((op) => op[0] === 'delete'))

    assert.equal(removed.status, 200)
    assert.deepEqual(removed.json, { deleted: true, childId: CHILD_ID })
    assert.equal(deletions.length, 1)
    assert.equal(deletions[0].accessToken, TOKEN_A)
    assert.equal(deletions[0].ops.some((op) => op[0] === 'eq' && op[1] === 'id' && op[2] === CHILD_ID), true)
    assert.equal(other.status, 404)
    assert.equal(other.json.error.message, 'That child is not on this parent account.')
  })
})

describe('parent auth', () => {
  it('does not log or return a password, and does not claim a profile exists without a session', async () => {
    const lines = []
    const password = 'long-secret-password'
    const { createClient, calls } = fakeSupabase({
      signUp() {
        return { data: { user: { id: PARENT_A, email: 'parent-a@example.com' }, session: null }, error: null }
      },
    })
    const server = await listen(createApp({
      config: testConfig(),
      logger: createLogger((line) => lines.push(line)),
      createClient,
    }))

    try {
      const response = await send(server.url, '/api/auth/signup', {
        method: 'POST',
        body: { email: 'parent-a@example.com', password, displayName: 'Parent A', consent: true },
      })
      assert.equal(response.status, 201)
      assert.equal(response.json.session, null)
      assert.equal(response.json.profileSaved, false)
      assert.equal(response.text.includes(password), false)
      assert.equal(lines.join('\n').includes(password), false)
      assert.equal(calls.some((call) => call.table === 'profiles'), false)
    } finally {
      await server.close()
    }
  })

  it('refuses signup until the parent agrees to the draft consent', async () => {
    const { createClient, calls } = fakeSupabase({
      signUp() {
        throw new Error('signup must not run without consent')
      },
    })
    const server = await listen(createApp({ config: testConfig(), logger: createLogger(), createClient }))

    try {
      const response = await send(server.url, '/api/auth/signup', {
        method: 'POST',
        body: { email: 'parent-a@example.com', password: 'long-secret-password', displayName: 'Parent A', consent: false },
      })
      assert.equal(response.status, 400)
      assert.equal(response.json.error.code, 'validation_error')
      assert.equal(response.json.error.details.some((item) => item.field === 'consent'), true)
      assert.equal(response.text.includes('long-secret-password'), false)
      assert.equal(calls.some((call) => call.op === 'signUp'), false)
    } finally {
      await server.close()
    }
  })

  it('saves the profile with the signed-in parent id when a session comes back', async () => {
    const accessToken = 'signup-access-token-ok'
    const { createClient, calls } = fakeSupabase({
      signUp() {
        return {
          data: {
            user: { id: PARENT_A, email: 'parent-a@example.com' },
            session: { access_token: accessToken, refresh_token: 'signup-refresh-token' },
          },
          error: null,
        }
      },
      query() {
        return { error: null }
      },
    })
    const server = await listen(createApp({ config: testConfig(), logger: createLogger(), createClient }))

    try {
      const response = await send(server.url, '/api/auth/signup', {
        method: 'POST',
        body: { email: 'parent-a@example.com', password: 'long-secret-password', displayName: 'Parent A', consent: true },
      })
      const profile = calls.find((call) => call.table === 'profiles')
      const row = profile.ops.find((op) => op[0] === 'upsert')[1]
      assert.equal(response.status, 201)
      assert.equal(response.json.profileSaved, true)
      assert.equal(row.id, PARENT_A)
      assert.equal(row.display_name, 'Parent A')
      assert.equal(calls.find((call) => call.op === 'signUp').parentalConsent, true)
      assert.equal(profile.accessToken, accessToken)
      assert.equal(response.text.includes('long-secret-password'), false)
    } finally {
      await server.close()
    }
  })

  it('signs in without writing the tokens to the log', async () => {
    const lines = []
    const accessToken = 'access-token-secret-value'
    const refreshToken = 'refresh-token-secret-value'
    const { createClient } = fakeSupabase({
      signIn() {
        return {
          data: {
            user: { id: PARENT_A, email: 'parent-a@example.com' },
            session: { access_token: accessToken, refresh_token: refreshToken },
          },
          error: null,
        }
      },
    })
    const server = await listen(createApp({
      config: testConfig(),
      logger: createLogger((line) => lines.push(line)),
      createClient,
    }))

    try {
      const response = await send(server.url, '/api/auth/login', {
        method: 'POST',
        body: { email: 'parent-a@example.com', password: 'long-secret-password' },
      })
      assert.equal(response.status, 200)
      assert.equal(response.json.session.accessToken, accessToken)
      assert.equal(lines.join('\n').includes(accessToken), false)
      assert.equal(lines.join('\n').includes(refreshToken), false)
      assert.equal(lines.join('\n').includes('long-secret-password'), false)
    } finally {
      await server.close()
    }
  })

  it('rejects a payload that is too large', async () => {
    const server = await listen(createApp({ config: testConfig(), logger: createLogger() }))
    try {
      const marker = 'CHAT-SECRET-MARKER'
      const response = await send(server.url, '/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: marker.repeat(2000), language: 'en' }),
      })
      assert.equal(response.status, 413)
      assert.equal(response.json.error.code, 'payload_too_large')
      assert.equal(response.text.includes(marker), false)
    } finally {
      await server.close()
    }
  })
})
