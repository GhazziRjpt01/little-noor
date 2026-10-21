import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AI_GREETING_ENDPOINT, AI_TEACHER_ENDPOINT, askAiTeacher, speakGreeting } from './aiTeacherService.js'

describe('aiTeacherService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('posts the question and language to the backend and returns only a real reply', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ reply: 'Server reply' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(askAiTeacher({ message: 'Hello', language: 'en' })).resolves.toEqual({
      reply: 'Server reply',
      voice: null,
    })

    const [, options] = fetchMock.mock.calls[0]
    expect(fetchMock).toHaveBeenCalledWith(AI_TEACHER_ENDPOINT, expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(options.body)).toEqual({ message: 'Hello', language: 'en' })
    expect(options.headers.Authorization).toBeUndefined()
  })

  it('keeps a generated reply voice only when it has the AI label', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reply: 'Server reply',
          voice: {
            source: 'ai',
            label: 'AI-generated voice. It may not follow Tajweed perfectly.',
            contentType: 'audio/mpeg',
            audioBase64: 'aGVsbG8=',
          },
        }),
      }),
    )

    await expect(askAiTeacher({ message: 'Hello', language: 'ur' })).resolves.toMatchObject({
      reply: 'Server reply',
      voice: {
        audioUrl: 'data:audio/mpeg;base64,aGVsbG8=',
        label: 'AI-generated voice. It may not follow Tajweed perfectly.',
      },
    })
  })

  it('asks for the greeting in the selected language only', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        voice: {
          source: 'ai',
          label: 'AI-generated voice. It may not follow Tajweed perfectly.',
          contentType: 'audio/mpeg',
          audioBase64: 'aGVsbG8=',
        },
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await speakGreeting('ar')

    expect(fetchMock).toHaveBeenCalledWith(AI_GREETING_ENDPOINT, expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ language: 'ar' })
  })

  it('shows moderation and timeout as their own errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ error: { code: 'moderation_blocked' } }),
      }),
    )

    await expect(askAiTeacher({ message: 'Hello', language: 'en' })).rejects.toThrow('moderation')
  })

  it('does not invent a reply when the backend is missing', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ reply: 'A made up answer' }),
      }),
    )

    await expect(askAiTeacher({ message: 'Hello', language: 'en' })).rejects.toThrow('not-connected')
  })

  it('keeps model keys out of the frontend service', () => {
    const source = [
      readFileSync(path.resolve('src/services/aiTeacherService.js'), 'utf8'),
      readFileSync(path.resolve('src/services/lessonAudioService.js'), 'utf8'),
    ].join('\n')
    expect(source.toLowerCase()).not.toContain('openai')
    expect(source.toLowerCase()).not.toContain('api_key')
    expect(source.toLowerCase()).not.toContain('apikey')
    expect(source).not.toMatch(/sk-/)
  })
})
