import { Pause, Play, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import { useI18n } from '../i18n/useI18n.js'

function hasAudio(audioUrl) {
  return typeof audioUrl === 'string' && audioUrl.trim() !== ''
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00'
  }

  const total = Math.floor(seconds)
  const minutes = Math.floor(total / 60)
  const rest = total % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export default function AudioPlayer({
  audioUrl = null,
  source = 'recorded',
  disabled = false,
}) {
  const { t } = useI18n()
  const audioRef = useRef(null)
  const available = hasAudio(audioUrl)
  const audioSource = source === 'ai' ? 'ai' : 'recorded'
  const [trackedUrl, setTrackedUrl] = useState(audioUrl)
  const [status, setStatus] = useState(available ? 'loading' : 'unavailable')
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  if (trackedUrl !== audioUrl) {
    setTrackedUrl(audioUrl)
    setStatus(available ? 'loading' : 'unavailable')
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }

  const playbackState = available ? status : 'unavailable'
  const ready = playbackState === 'ready'
  const playDisabled = !available || disabled || playbackState === 'loading' || (ready && playing)
  const pauseDisabled = !ready || disabled || !playing
  const replayDisabled = !ready || disabled
  const canSeek = ready && !disabled && duration > 0

  function readTiming(audio) {
    setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0)
    setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
  }

  function markReady(event) {
    readTiming(event.currentTarget)
    setStatus((current) => (current === 'error' ? current : 'ready'))
  }

  function markError() {
    setPlaying(false)
    setStatus('error')
  }

  async function handlePlay() {
    const audio = audioRef.current
    if (!audio || playDisabled) {
      return
    }

    try {
      if (playbackState === 'error') {
        setStatus('loading')
        audio.load()
      }
      await audio.play()
      setPlaying(true)
      setStatus('ready')
    } catch {
      setPlaying(false)
      setStatus('error')
    }
  }

  function handlePause() {
    const audio = audioRef.current
    if (!audio || pauseDisabled) {
      return
    }
    audio.pause()
    setPlaying(false)
  }

  async function handleReplay() {
    const audio = audioRef.current
    if (!audio || replayDisabled) {
      return
    }

    audio.currentTime = 0
    setCurrentTime(0)

    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
      setStatus('error')
    }
  }

  function handleSeek(event) {
    const audio = audioRef.current
    const next = Number(event.target.value)
    if (!audio || !canSeek || !Number.isFinite(next)) {
      return
    }
    audio.currentTime = next
    setCurrentTime(next)
  }

  const elapsed = formatTime(currentTime)
  const total = formatTime(duration)

  return (
    <section
      aria-label={t('audio.player')}
      data-state={playbackState}
      className="w-full rounded-3xl border border-white bg-noor-card p-4 shadow-soft sm:p-5"
    >
      {audioSource === 'ai' ? (
        <p className="rounded-2xl bg-noor-peach px-4 py-3 text-sm font-extrabold leading-relaxed text-noor-ink">
          {t('audio.aiWarning')}
        </p>
      ) : null}
      {audioSource === 'recorded' && available ? (
        <p className="rounded-2xl bg-noor-mint-soft px-4 py-3 text-sm font-extrabold leading-relaxed text-noor-ink">
          {t('audio.recorded')}
        </p>
      ) : null}

      {playbackState === 'unavailable' ? (
        <p className="mt-3 text-base font-extrabold text-noor-muted">{t('audio.comingSoon')}</p>
      ) : null}
      {playbackState === 'loading' ? (
        <p role="status" className="mt-3 text-base font-extrabold text-noor-muted">
          {t('audio.loading')}
        </p>
      ) : null}
      {playbackState === 'error' ? (
        <p role="alert" className="mt-3 text-base font-extrabold text-noor-ink">
          {t('audio.error')}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <PlayerButton
          label={t('audio.play')}
          disabled={playDisabled}
          onClick={handlePlay}
          className="bg-noor-sky-deep"
        >
          <Play aria-hidden="true" size={22} />
        </PlayerButton>
        <PlayerButton
          label={t('audio.pause')}
          disabled={pauseDisabled}
          onClick={handlePause}
          className="bg-noor-mint-deep"
        >
          <Pause aria-hidden="true" size={22} />
        </PlayerButton>
        <PlayerButton
          label={t('audio.replay')}
          disabled={replayDisabled}
          onClick={handleReplay}
          className="bg-noor-sun-deep"
        >
          <RotateCcw aria-hidden="true" size={22} />
        </PlayerButton>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={duration > 0 ? duration : 0}
          step={0.1}
          value={duration > 0 ? Math.min(currentTime, duration) : 0}
          disabled={!canSeek}
          aria-label={t('audio.progress')}
          aria-valuemin={0}
          aria-valuemax={duration > 0 ? Math.round(duration) : 0}
          aria-valuenow={Math.round(currentTime)}
          aria-valuetext={`${elapsed} / ${total}`}
          onChange={handleSeek}
          className="h-12 w-full cursor-pointer accent-noor-sky-deep disabled:cursor-not-allowed disabled:opacity-60"
        />
        <p className="text-sm font-extrabold tabular-nums text-noor-muted">
          {elapsed} / {total}
        </p>
      </div>

      {available ? (
        <audio
          ref={audioRef}
          className="hidden"
          src={audioUrl}
          preload="metadata"
          onLoadedMetadata={markReady}
          onCanPlay={markReady}
          onTimeUpdate={(event) => readTiming(event.currentTarget)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onError={markError}
        />
      ) : null}
    </section>
  )
}

function PlayerButton({ label, disabled, onClick, className, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-14 min-w-14 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
      <span>{label}</span>
    </button>
  )
}
