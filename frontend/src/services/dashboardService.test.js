import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { REWARDS_KEY } from '../hooks/useRewards.js'
import { addChild, emptyProgress, syncAccountProgress } from './dashboardService.js'

const childId = '11111111-1111-4111-8111-111111111111'

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('account progress', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('leaves guest progress on this device', async () => {
    const result = await syncAccountProgress('', '')
    expect(result).toEqual({ saved: false, mode: 'guest' })
    expect(fetch).not.toHaveBeenCalled()
  })

  it('saves only progress numbers for the signed-in child', async () => {
    localStorage.setItem(REWARDS_KEY, JSON.stringify({
      stars: 5,
      activities: { 'memory-match': 1, quiz: 0 },
    }))
    fetch.mockImplementation(async (_url, options = {}) => {
      if (options.method === 'PUT') {
        return json({ saved: true, progress: JSON.parse(options.body) })
      }
      return json({
        saved: true,
        progress: { ...emptyProgress, stars: 1, lessonsCompleted: 2, lessonsTotal: 4 },
      })
    })

    const result = await syncAccountProgress('parent-access-token', childId)
    const put = fetch.mock.calls.find((call) => call[1]?.method === 'PUT')
    const body = JSON.parse(put[1].body)

    expect(result.mode).toBe('account')
    expect(put[0]).toBe(`/api/children/${childId}/progress`)
    expect(put[1].headers.Authorization).toBe('Bearer parent-access-token')
    expect(body).toEqual({
      lessonsCompleted: 2,
      lessonsTotal: 4,
      kalimasLearned: 0,
      azkarCompleted: 0,
      quizCorrect: 0,
      quizTotal: 0,
      streak: 0,
      stars: 5,
    })
  })

  it('adds a child with name and age only', async () => {
    fetch.mockResolvedValue(json({
      child: { id: childId, name: 'Noor', age: 6, parent_id: 'other-parent' },
    }, 201))

    const child = await addChild('parent-access-token', { name: 'Noor', age: 6 })
    const body = JSON.parse(fetch.mock.calls[0][1].body)

    expect(body).toEqual({ name: 'Noor', age: 6 })
    expect(child).toEqual({ id: childId, name: 'Noor', age: 6 })
  })

  it('does not reference a service-role key', () => {
    const source = [
      'src/services/supabaseClient.js',
      'src/services/dashboardService.js',
      'src/auth/AuthProvider.jsx',
    ].map((file) => readFileSync(file, 'utf8')).join('\n')

    expect(source.toLowerCase()).not.toContain('service_role')
    expect(source).not.toContain('SERVICE_ROLE')
    expect(source).not.toMatch(/sk-/)
  })
})
