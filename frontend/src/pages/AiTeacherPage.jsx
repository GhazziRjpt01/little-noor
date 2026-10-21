import { Send, ShieldCheck, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import TypingIndicator from '../components/ai-teacher/TypingIndicator.jsx'
import TeacherAvatar from '../components/ai-teacher/TeacherAvatar.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import LanguageSelector from '../components/LanguageSelector.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { askAiTeacher, speakGreeting } from '../services/aiTeacherService.js'

const suggestions = ['q1', 'q2', 'q3']

export default function AiTeacherPage() {
  const { t, languageId } = useI18n()
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const nextId = useRef(0)
  const logRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const node = logRef.current
    if (!node) return
    node.scrollTop = node.scrollHeight
  }, [messages, sending])

  async function sendMessage(text) {
    const message = text.trim()
    if (!message || sending) return

    nextId.current += 1
    const id = `message-${nextId.current}`
    setMessages((current) => [...current, { id, role: 'user', text: message }])
    setDraft('')
    setSending(true)

    try {
      const result = await askAiTeacher({ message, language: languageId })
      setMessages((current) => [
        ...current,
        { id: `${id}-reply`, role: 'teacher', text: result.reply, voice: result.voice },
      ])
    } catch (error) {
      const code = ['moderation', 'timeout', 'failed', 'not-connected'].includes(error?.message)
        ? error.message
        : 'not-connected'
      setMessages((current) => [...current, { id: `${id}-status`, role: 'status', code }])
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <TeacherAvatar label={t('aiTeacher.avatar')} size="lg" />
          <div>
            <h1 className="text-4xl font-semibold sm:text-5xl">{t('aiTeacher.title')}</h1>
            <p className="mt-2 text-lg font-semibold text-noor-muted">{t('aiTeacher.intro')}</p>
          </div>
        </div>
        <LanguageSelector label={t('aiTeacher.language')} />
      </header>

      <aside
        aria-labelledby="parent-guidance"
        className="rounded-3xl border-2 border-dashed border-noor-ink/30 bg-noor-peach p-5 shadow-soft"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" />
          <h2 id="parent-guidance" className="text-2xl font-semibold">
            {t('aiTeacher.guidanceTitle')}
          </h2>
        </div>
        <p className="mt-3 font-semibold text-noor-ink">{t('aiTeacher.guidance')}</p>
        <p id="ai-teacher-unsure" className="mt-3 text-lg font-extrabold text-noor-ink">
          {t('aiTeacher.unsure')}
        </p>
      </aside>

      <Card accent="sky" className="flex flex-col gap-5">
        <div
          ref={logRef}
          role="log"
          aria-label={t('aiTeacher.chat')}
          aria-busy={sending}
          className="flex max-h-96 flex-col gap-4 overflow-y-auto"
        >
          <TeacherBubble label={t('aiTeacher.teacher')} text={t('aiTeacher.greeting')} greeting />
          {messages.map((item) => {
            if (item.role === 'user') {
              return <ChildBubble key={item.id} label={t('aiTeacher.you')} text={item.text} />
            }
            if (item.role === 'teacher') {
              return (
                <TeacherBubble
                  key={item.id}
                  label={t('aiTeacher.teacher')}
                  text={item.text}
                  voice={item.voice}
                  autoPlay
                />
              )
            }
            return (
              <p
                key={item.id}
                role="status"
                className="rounded-3xl border-2 border-dashed border-noor-ink/30 bg-noor-peach px-4 py-3 font-extrabold text-noor-ink"
              >
                {t(`aiTeacher.${item.code === 'moderation' || item.code === 'timeout' || item.code === 'failed' ? item.code : 'notConnected'}`)}
              </p>
            )
          })}
          {sending ? <TypingIndicator label={t('aiTeacher.typing')} /> : null}
        </div>

        <div role="group" aria-labelledby="suggested-questions">
          <h2 id="suggested-questions" className="text-lg font-semibold">
            {t('aiTeacher.suggestions')}
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((key) => (
              <button
                key={key}
                type="button"
                disabled={sending}
                className="min-h-12 rounded-full bg-noor-sky-soft px-4 text-left text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => sendMessage(t(`aiTeacher.${key}`))}
              >
                {t(`aiTeacher.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            sendMessage(draft)
          }}
        >
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-extrabold text-noor-muted" htmlFor="ai-teacher-message">
            {t('aiTeacher.messageLabel')}
            <input
              ref={inputRef}
              id="ai-teacher-message"
              value={draft}
              maxLength={400}
              placeholder={t('aiTeacher.placeholder')}
              autoComplete="off"
              enterKeyHint="send"
              aria-describedby="ai-teacher-unsure"
              disabled={sending}
              onChange={(event) => setDraft(event.target.value)}
              className="min-h-14 w-full rounded-full border border-noor-sky bg-white px-5 text-base font-semibold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep"
            />
          </label>
          <Button
            type="submit"
            variant="sun"
            className="min-h-14 w-full sm:w-auto"
            disabled={sending || draft.trim() === ''}
          >
            <Send aria-hidden="true" size={18} />
            {t('aiTeacher.send')}
          </Button>
        </form>
      </Card>
    </div>
  )
}

function TeacherBubble({ label, text, voice = null, greeting = false, autoPlay = false }) {
  const { t } = useI18n()

  return (
    <div className="flex items-end gap-3">
      <TeacherAvatar label={label} />
      <div className="flex max-w-[85%] flex-col gap-2">
        <p
          aria-label={`${label}: ${text}`}
          className="rounded-3xl rounded-bl-md bg-noor-mint-soft px-4 py-3 text-base font-semibold text-noor-ink"
        >
          {text}
        </p>
        {greeting ? <GreetingVoice /> : null}
        {voice?.audioUrl ? <ReplyVoice audioUrl={voice.audioUrl} autoPlay={autoPlay} /> : null}
        {!greeting && autoPlay && !voice?.audioUrl ? (
          <p className="text-sm font-extrabold text-noor-muted">{t('aiTeacher.voiceMissing')}</p>
        ) : null}
      </div>
    </div>
  )
}

function GreetingVoice() {
  const { t, languageId } = useI18n()
  const audioRef = useRef(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [phase, setPhase] = useState('idle')
  const [loadedLanguage, setLoadedLanguage] = useState(languageId)

  if (loadedLanguage !== languageId) {
    setLoadedLanguage(languageId)
    setAudioUrl('')
    setPhase('idle')
  }

  async function listen() {
    if (phase === 'loading') return
    if (audioUrl && audioRef.current) {
      playAudio(audioRef.current)
      return
    }

    setPhase('loading')
    try {
      const voice = await speakGreeting(languageId)
      setAudioUrl(voice.audioUrl)
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }

  useEffect(() => {
    if (phase !== 'ready' || !audioRef.current) return
    playAudio(audioRef.current)
  }, [phase, audioUrl])

  return (
    <VoiceControls
      label={phase === 'loading' ? t('aiTeacher.speaking') : t('aiTeacher.listen')}
      busy={phase === 'loading'}
      error={phase === 'error'}
      audioUrl={audioUrl}
      audioRef={audioRef}
      onListen={listen}
    />
  )
}

function ReplyVoice({ audioUrl, autoPlay }) {
  const { t } = useI18n()
  const audioRef = useRef(null)

  useEffect(() => {
    if (!autoPlay || !audioRef.current) return
    playAudio(audioRef.current)
  }, [autoPlay, audioUrl])

  return (
    <VoiceControls
      label={t('aiTeacher.listen')}
      busy={false}
      error={false}
      audioUrl={audioUrl}
      audioRef={audioRef}
      onListen={() => playAudio(audioRef.current)}
    />
  )
}

function playAudio(audio) {
  if (!audio || typeof audio.play !== 'function') return
  try {
    const pending = audio.play()
    if (pending && typeof pending.catch === 'function') pending.catch(() => {})
  } catch {
    // A browser can refuse playback before a tap. The Listen button tries again.
  }
}

function VoiceControls({ label, busy, error, audioUrl, audioRef, onListen }) {
  const { t } = useI18n()

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={onListen}
        className="inline-flex min-h-12 items-center gap-2 rounded-full bg-noor-sun px-4 text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Volume2 aria-hidden="true" size={18} />
        {label}
      </button>
      {error ? <p role="alert" className="text-sm font-extrabold text-noor-ink">{t('aiTeacher.voiceMissing')}</p> : null}
      {audioUrl ? (
        <p className="text-sm font-extrabold leading-relaxed text-noor-ink">{t('audio.aiWarning')}</p>
      ) : null}
      {audioUrl ? <audio ref={audioRef} src={audioUrl} preload="auto" /> : null}
    </div>
  )
}

function ChildBubble({ label, text }) {
  return (
    <p
      aria-label={`${label}: ${text}`}
      className="ms-auto max-w-[85%] rounded-3xl rounded-br-md bg-noor-sun px-4 py-3 text-base font-semibold text-noor-ink"
    >
      {text}
    </p>
  )
}
