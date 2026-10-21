import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LESSON_TTS_ENDPOINT, requestLessonAudio } from './lessonAudioService.js'

describe('lessonAudioService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('asks for one lesson field and plays a recorded file when the API has one', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        source: 'recorded',
        label: 'Recorded recitation',
        audioUrl: 'https://cdn.example/qari.mp3',
      }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await expect(requestLessonAudio({ lessonId: 'kalima-1', field: 'arabic' })).resolves.toEqual({
      source: 'recorded',
      audioUrl: 'https://cdn.example/qari.mp3',
      label: 'Recorded recitation',
    })

    const [, options] = fetchMock.mock.calls[0]
    expect(fetchMock).toHaveBeenCalledWith(LESSON_TTS_ENDPOINT, expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(options.body)).toEqual({ lessonId: 'kalima-1', field: 'arabic' })
  })

  it('keeps the AI label on generated audio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          source: 'ai',
          label: 'AI-generated voice. It may not follow Tajweed perfectly.',
          contentType: 'audio/mpeg',
          audioBase64: 'aGVsbG8=',
        }),
      }),
    )

    await expect(requestLessonAudio({ lessonId: 'kalima-1', field: 'en' })).resolves.toMatchObject({
      source: 'ai',
      label: 'AI-generated voice. It may not follow Tajweed perfectly.',
      audioUrl: 'data:audio/mpeg;base64,aGVsbG8=',
    })
  })

  it('rejects generated audio that is missing the AI label', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          source: 'ai',
          label: 'Natural voice',
          contentType: 'audio/mpeg',
          audioBase64: 'aGVsbG8=',
        }),
      }),
    )

    await expect(requestLessonAudio({ lessonId: 'kalima-1', field: 'en' })).rejects.toThrow('error')
  })

  it('does not turn an unapproved lesson into audio', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: { code: 'lesson_not_approved' } }),
      }),
    )

    await expect(requestLessonAudio({ lessonId: 'kalima-1', field: 'arabic' })).rejects.toThrow('not-approved')
  })

  it('keeps model keys out of the audio service', () => {
    const source = readFileSync(path.resolve('src/services/lessonAudioService.js'), 'utf8')
    expect(source).not.toMatch(/sk-/)
    expect(source.toLowerCase()).not.toContain('api_key')
  })
})
