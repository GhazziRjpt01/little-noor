import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import AiTeacherPage from './AiTeacherPage.jsx'

function renderTeacher() {
  return render(
    <LanguageProvider>
      <AiTeacherPage />
    </LanguageProvider>,
  )
}

describe('AI Teacher', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the greeting, suggestions, language choice, and parent guidance', () => {
    renderTeacher()

    expect(
      screen.getByText("Assalamu Alaikum! I'm your Little Noor Teacher. Ask me anything about Islam!"),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Teacher' })).toBeInTheDocument()
    expect(screen.getAllByRole('img', { name: 'Little Noor Teacher' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'What is a Kalima?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'How can I be kind today?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'What should I practice?' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Chat language' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parent guidance' })).toBeInTheDocument()
    expect(screen.getByText('If you are unsure, ask your parents or teacher.')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Your question' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled()
  })

  it('shows that the teacher is not connected instead of a made-up answer', async () => {
    const user = userEvent.setup()
    let resolveFetch
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve
          }),
      ),
    )
    renderTeacher()

    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Hello teacher')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    expect(screen.getByText('Hello teacher')).toBeInTheDocument()
    expect(screen.getByRole('status', { name: 'Little Noor Teacher is typing' })).toBeInTheDocument()

    resolveFetch({
      ok: false,
      status: 404,
      json: async () => ({ reply: 'A made up answer' }),
    })

    await waitFor(() => {
      expect(screen.getByText('AI Teacher is not connected yet.')).toBeInTheDocument()
    })
    expect(screen.queryByText('A made up answer')).not.toBeInTheDocument()
    expect(screen.queryByRole('status', { name: 'Little Noor Teacher is typing' })).not.toBeInTheDocument()
  })

  it('speaks the teacher reply with the child voice', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          reply: 'Share your toys.',
          voice: {
            source: 'ai',
            label: 'AI-generated voice. It may not follow Tajweed perfectly.',
            contentType: 'audio/mpeg',
            audioBase64: 'aGVsbG8=',
          },
        }),
      }),
    )
    renderTeacher()

    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Hello teacher')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(screen.getByText('Share your toys.')).toBeInTheDocument()
    })
    expect(screen.getByText('AI-generated voice. It may not follow Tajweed perfectly.')).toBeInTheDocument()
    expect(document.querySelector('audio')?.getAttribute('src')).toBe('data:audio/mpeg;base64,aGVsbG8=')
  })

  it('loads the greeting voice from the server', async () => {
    const user = userEvent.setup()
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
    renderTeacher()

    await user.click(screen.getByRole('button', { name: 'Listen' }))

    await waitFor(() => {
      expect(document.querySelector('audio')?.getAttribute('src')).toBe('data:audio/mpeg;base64,aGVsbG8=')
    })
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ language: 'en' })
  })

  it('shows a moderation failure while the question stays on screen', async () => {
    const user = userEvent.setup()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({ error: { code: 'moderation_blocked', message: 'hidden detail' } }),
      }),
    )
    renderTeacher()

    await user.type(screen.getByRole('textbox', { name: 'Your question' }), 'Hello teacher')
    await user.click(screen.getByRole('button', { name: 'Send' }))

    await waitFor(() => {
      expect(
        screen.getByText('That question cannot be answered here. Please ask your parents or teacher.'),
      ).toBeInTheDocument()
    })
    expect(screen.getByText('Hello teacher')).toBeInTheDocument()
    expect(screen.queryByText('hidden detail')).not.toBeInTheDocument()
    expect(screen.queryByText('AI Teacher is not connected yet.')).not.toBeInTheDocument()
  })

  it('sends a suggested question through the same service', async () => {
    const user = userEvent.setup()
    renderTeacher()

    await user.click(screen.getByRole('button', { name: 'What is a Kalima?' }))

    await waitFor(() => {
      expect(screen.getByText('AI Teacher is not connected yet.')).toBeInTheDocument()
    })
    expect(fetch).toHaveBeenCalledWith(
      '/api/ai/chat',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ message: 'What is a Kalima?', language: 'en' }),
      }),
    )
  })
})
