import { useState } from 'react'
import { useI18n } from '../i18n/useI18n.js'
import { requestLessonAudio } from '../services/lessonAudioService.js'
import AudioPlayer from './AudioPlayer.jsx'

function hasStoredAudio(audioUrl) {
  return typeof audioUrl === 'string' && audioUrl.trim() !== ''
}

export default function LessonAudio({ lessonId, audioUrl = null, verified = false, field = 'arabic' }) {
  const { t } = useI18n()
  const [phase, setPhase] = useState('idle')
  const [audio, setAudio] = useState(null)
  const [errorCode, setErrorCode] = useState('')

  if (hasStoredAudio(audioUrl)) {
    return <AudioPlayer audioUrl={audioUrl} source="recorded" />
  }

  if (verified !== true) {
    return <AudioPlayer audioUrl={null} source="recorded" />
  }

  if (phase === 'ready' && audio) {
    return <AudioPlayer audioUrl={audio.audioUrl} source={audio.source === 'ai' ? 'ai' : 'recorded'} />
  }

  async function prepare() {
    if (phase === 'loading') return
    setPhase('loading')
    setErrorCode('')
    try {
      const result = await requestLessonAudio({ lessonId, field })
      setAudio(result)
      setPhase('ready')
    } catch (error) {
      setErrorCode(error?.message === 'not-approved' ? 'not-approved' : 'error')
      setPhase('error')
    }
  }

  return (
    <section
      aria-label={t('audio.player')}
      aria-busy={phase === 'loading'}
      className="w-full rounded-3xl border border-white bg-noor-card p-4 shadow-soft sm:p-5"
    >
      {phase === 'loading' ? (
        <p role="status" className="text-base font-extrabold text-noor-muted">{t('audio.requesting')}</p>
      ) : null}
      {phase === 'error' ? (
        <p role="alert" className="text-base font-extrabold text-noor-ink">
          {errorCode === 'not-approved' ? t('audio.notApproved') : t('audio.requestError')}
        </p>
      ) : null}
      <button
        type="button"
        disabled={phase === 'loading'}
        onClick={prepare}
        className="mt-3 inline-flex min-h-14 items-center justify-center rounded-full bg-noor-sky-deep px-5 text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t('audio.request')}
      </button>
    </section>
  )
}
