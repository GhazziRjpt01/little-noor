import { Router } from 'express'
import { AppError } from '../errors.js'
import { asyncRoute } from '../middleware.js'
import { buildSystemPrompt, TEACHER_GREETINGS, TEACHER_VOICE_INSTRUCTIONS } from '../teacherPrompt.js'
import { parseChat, parseGreeting, parseTts } from '../validate.js'

export const AI_AUDIO_LABEL = 'AI-generated voice. It may not follow Tajweed perfectly.'
export const RECORDED_AUDIO_LABEL = 'Recorded recitation'
const BLOCKED = 'That question cannot be answered here. Please ask your parents or teacher.'

export function aiRouter({ chat, greeting, tts, ttsLimit }) {
  const router = Router()
  router.post('/chat', chat)
  router.post('/greeting', greeting)
  router.post('/tts', ttsLimit, tts)
  return router
}

function voicePayload(audio) {
  return {
    source: 'ai',
    label: AI_AUDIO_LABEL,
    contentType: 'audio/mpeg',
    audioBase64: audio.toString('base64'),
  }
}

function speechTimeout(config) {
  return Math.max(config.openaiTimeoutMs, 25000)
}

async function speakForChild(openai, config, text) {
  return openai.speak(text, {
    model: config.openaiTtsModel,
    voice: config.openaiTeacherVoice,
    instructions: TEACHER_VOICE_INSTRUCTIONS,
    timeoutMs: speechTimeout(config),
  })
}

export function createAiHandlers({ openai, catalog, config }) {
  const chat = asyncRoute(async function handleChat(req, res) {
    const { message, language } = parseChat(req.body)
    if (!openai) {
      throw new AppError(503, 'openai_not_configured', 'AI Teacher is not connected yet.')
    }

    const moderation = await openai.moderate(message, config.openaiModerationModel)
    if (moderation.flagged) {
      throw new AppError(422, 'moderation_blocked', BLOCKED)
    }

    const reply = await openai.complete([
      { role: 'system', content: buildSystemPrompt(language, catalog.quotations()) },
      { role: 'user', content: message },
    ], config.openaiChatModel)

    let voice = null
    try {
      voice = voicePayload(await speakForChild(openai, config, reply))
    } catch {
      voice = null
    }

    res.json({ reply, voice })
  })

  const greeting = asyncRoute(async function handleGreeting(req, res) {
    const { language } = parseGreeting(req.body)
    if (!openai) {
      throw new AppError(503, 'openai_not_configured', 'AI Teacher is not connected yet.')
    }

    const audio = await speakForChild(openai, config, TEACHER_GREETINGS[language])
    res.json({ voice: voicePayload(audio) })
  })

  const tts = asyncRoute(async function handleTts(req, res) {
    const { lessonId, field } = parseTts(req.body)
    const speech = catalog.speechFor(lessonId, field)
    if (!speech) {
      throw new AppError(404, 'lesson_not_approved', 'That lesson has no approved text to read aloud.')
    }

    if (speech.audioUrl) {
      res.json({
        lessonId: speech.lessonId,
        source: 'recorded',
        label: RECORDED_AUDIO_LABEL,
        audioUrl: speech.audioUrl,
      })
      return
    }

    if (!openai) {
      throw new AppError(503, 'openai_not_configured', 'AI Teacher is not connected yet.')
    }

    const audio = await openai.speak(speech.text, {
      model: config.openaiTtsModel,
      voice: config.openaiTtsVoice,
      timeoutMs: speechTimeout(config),
    })

    res.json({
      lessonId: speech.lessonId,
      source: 'ai',
      label: AI_AUDIO_LABEL,
      contentType: 'audio/mpeg',
      audioBase64: audio.toString('base64'),
    })
  })

  return { chat, greeting, tts }
}
