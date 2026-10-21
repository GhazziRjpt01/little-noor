import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LanguageProvider from './LanguageProvider.jsx'
import LessonAudio from './LessonAudio.jsx'

function renderAudio(props) {
  return render(
    <LanguageProvider>
      <LessonAudio {...props} />
    </LanguageProvider>,
  )
}

describe('LessonAudio', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('leaves unverified lessons on the coming-soon player', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderAudio({ lessonId: 'kalima-1', audioUrl: null, verified: false })

    expect(screen.getByText('Audio coming soon')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Play lesson audio' })).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('plays a stored recording without asking for a generated voice', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderAudio({ lessonId: 'kalima-1', audioUrl: 'https://cdn.example/qari.mp3', verified: true })

    expect(screen.getByText('Recorded recitation')).toBeInTheDocument()
    expect(screen.queryByText('AI-generated voice. It may not follow Tajweed perfectly.')).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('shows preparing, then the AI warning, for an approved lesson without a recording', async () => {
    const user = userEvent.setup()
    let resolveFetch
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    renderAudio({ lessonId: 'kind-lesson', audioUrl: null, verified: true, field: 'en' })

    await user.click(screen.getByRole('button', { name: 'Play lesson audio' }))
    expect(screen.getByRole('status')).toHaveTextContent('Preparing audio')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/ai/tts',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ lessonId: 'kind-lesson', field: 'en' }),
      }),
    )

    resolveFetch({
      ok: true,
      json: async () => ({
        source: 'ai',
        label: 'AI-generated voice. It may not follow Tajweed perfectly.',
        contentType: 'audio/mpeg',
        audioBase64: 'aGVsbG8=',
      }),
    })

    await waitFor(() => {
      expect(screen.getByText('AI-generated voice. It may not follow Tajweed perfectly.')).toBeInTheDocument()
    })
  })

  it('shows an error when the lesson is not approved', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: { code: 'lesson_not_approved' } }),
      }),
    )
    renderAudio({ lessonId: 'kalima-1', audioUrl: null, verified: true })

    await user.click(screen.getByRole('button', { name: 'Play lesson audio' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('No approved audio is available for this lesson yet.')
    })
    expect(screen.queryByText('AI-generated voice. It may not follow Tajweed perfectly.')).not.toBeInTheDocument()
  })
})
