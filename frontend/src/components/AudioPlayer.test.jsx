import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useEffect } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LanguageProvider from './LanguageProvider.jsx'
import { useLanguage } from '../hooks/useLanguage.js'
import AudioPlayer from './AudioPlayer.jsx'

const SAMPLE_URL = 'https://example.com/recitation.mp3'

function LanguageSwitch({ id }) {
  const { setLanguageId } = useLanguage()

  useEffect(() => {
    setLanguageId(id)
  }, [id, setLanguageId])

  return null
}

function renderPlayer(props = {}, languageId = 'en') {
  return render(
    <LanguageProvider>
      {languageId === 'en' ? null : <LanguageSwitch id={languageId} />}
      <AudioPlayer {...props} />
    </LanguageProvider>,
  )
}

function readyAudio(container, { duration = 90, currentTime = 0 } = {}) {
  const audio = container.querySelector('audio')
  let time = currentTime

  Object.defineProperty(audio, 'duration', {
    configurable: true,
    get: () => duration,
  })
  Object.defineProperty(audio, 'currentTime', {
    configurable: true,
    get: () => time,
    set: (value) => {
      time = Number(value)
    },
  })

  fireEvent.loadedMetadata(audio)
  fireEvent.canPlay(audio)

  return {
    audio,
    get time() {
      return time
    },
  }
}

describe('AudioPlayer', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve())
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
    vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {})
  })

  it('shows Audio coming soon and disables controls when audioUrl is null', () => {
    const { container } = renderPlayer({ audioUrl: null })

    expect(screen.getByText('Audio coming soon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
    expect(screen.getByRole('slider', { name: 'Audio progress' })).toBeDisabled()
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument()
    expect(container.querySelector('audio')).toBeNull()
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled()
    expect(screen.queryByText('AI-generated voice. It may not follow Tajweed perfectly.')).not.toBeInTheDocument()
  })

  it('keeps controls disabled for an empty audio url', () => {
    renderPlayer({ audioUrl: '   ' })

    expect(screen.getByText('Audio coming soon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
  })

  it('disables controls while a real file is still loading', () => {
    renderPlayer({ audioUrl: SAMPLE_URL })

    expect(screen.getByRole('status')).toHaveTextContent('Loading audio')
    expect(screen.queryByText('Audio coming soon')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
    expect(screen.getByRole('slider', { name: 'Audio progress' })).toBeDisabled()
  })

  it('keeps a supplied file disabled when the disabled prop is set', () => {
    renderPlayer({ audioUrl: SAMPLE_URL, disabled: true })

    expect(screen.queryByText('Audio coming soon')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
    expect(screen.getByRole('slider', { name: 'Audio progress' })).toBeDisabled()
  })

  it('shows an error and does not keep playing when the file fails', () => {
    const { container } = renderPlayer({ audioUrl: SAMPLE_URL })
    fireEvent.error(container.querySelector('audio'))

    expect(screen.getByRole('alert')).toHaveTextContent('This audio could not be played.')
    expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Replay' })).toBeDisabled()
    expect(screen.getByRole('slider', { name: 'Audio progress' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled()
  })

  it('plays, pauses, replays, and seeks after the file is ready', async () => {
    const user = userEvent.setup()
    const { container } = renderPlayer({ audioUrl: SAMPLE_URL })
    const media = readyAudio(container, { duration: 90 })

    expect(screen.getByText('0:00 / 1:30')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Play' }))
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Pause' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Play' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Pause' }))
    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled()

    media.audio.currentTime = 12
    fireEvent.timeUpdate(media.audio)
    expect(screen.getByText('0:12 / 1:30')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Replay' }))
    expect(media.time).toBe(0)
    expect(screen.getByText('0:00 / 1:30')).toBeInTheDocument()

    fireEvent.change(screen.getByRole('slider', { name: 'Audio progress' }), {
      target: { value: '15' },
    })
    expect(media.time).toBe(15)
    expect(screen.getByText('0:15 / 1:30')).toBeInTheDocument()
  })

  it('starts playback and replay from the keyboard', async () => {
    const user = userEvent.setup()
    const { container } = renderPlayer({ audioUrl: SAMPLE_URL })
    const media = readyAudio(container)

    await user.tab()
    expect(screen.getByRole('button', { name: 'Play' })).toHaveFocus()
    await user.keyboard('{Enter}')
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()

    media.audio.currentTime = 8
    screen.getByRole('button', { name: 'Replay' }).focus()
    await user.keyboard(' ')
    expect(media.time).toBe(0)
  })

  it('labels an AI voice and does not claim a recording exists without a file', () => {
    const { rerender } = renderPlayer({ audioUrl: null, source: 'ai' })

    expect(
      screen.getByText('AI-generated voice. It may not follow Tajweed perfectly.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Audio coming soon')).toBeInTheDocument()

    rerender(
      <LanguageProvider>
        <AudioPlayer audioUrl={null} source="recorded" />
      </LanguageProvider>,
    )

    expect(screen.queryByText('Recorded recitation')).not.toBeInTheDocument()
    expect(
      screen.queryByText('AI-generated voice. It may not follow Tajweed perfectly.'),
    ).not.toBeInTheDocument()

    rerender(
      <LanguageProvider>
        <AudioPlayer audioUrl={SAMPLE_URL} source="recorded" />
      </LanguageProvider>,
    )

    expect(screen.getByText('Recorded recitation')).toBeInTheDocument()
  })

  it('translates the unavailable state', async () => {
    renderPlayer({ audioUrl: null }, 'ur')

    expect(await screen.findByText('آواز جلد آئے گی')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'چلائیں' })).toBeDisabled()
  })

  it('translates the AI warning', async () => {
    renderPlayer({ audioUrl: null, source: 'ai' }, 'ar')

    expect(
      await screen.findByText('صوت مولّد بالذكاء الاصطناعي. قد لا يلتزم بالتجويد التزامًا تامًا.'),
    ).toBeInTheDocument()
  })
})
