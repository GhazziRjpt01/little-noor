// Posts one question to the Little Noor API. The frontend never holds a model key.
export const AI_TEACHER_ENDPOINT = '/api/ai/chat'
export const AI_GREETING_ENDPOINT = '/api/ai/greeting'
const AI_AUDIO_LABEL = 'AI-generated voice. It may not follow Tajweed perfectly.'

function teacherError(code, status) {
  if (code === 'moderation_blocked') return 'moderation'
  if (status === 504 || (typeof code === 'string' && code.endsWith('_timeout'))) return 'timeout'
  if (status === 503 || (typeof code === 'string' && code.endsWith('_not_configured'))) return 'not-connected'
  return 'not-connected'
}

export async function askAiTeacher({ message, language }) {
  let response
  try {
    response = await fetch(AI_TEACHER_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        language,
      }),
    })
  } catch {
    throw new Error('not-connected')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(teacherError(data?.error?.code, response.status))
  }

  if (typeof data?.reply !== 'string' || data.reply.trim() === '') {
    throw new Error('failed')
  }

  return { reply: data.reply, voice: readVoice(data.voice) }
}

export async function speakGreeting(language) {
  let response
  try {
    response = await fetch(AI_GREETING_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ language }),
    })
  } catch {
    throw new Error('not-connected')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) throw new Error(teacherError(data?.error?.code, response.status))
  const voice = readVoice(data?.voice)
  if (!voice) throw new Error('failed')
  return voice
}

function readVoice(voice) {
  if (
    voice?.source !== 'ai'
    || voice.label !== AI_AUDIO_LABEL
    || voice.contentType !== 'audio/mpeg'
    || typeof voice.audioBase64 !== 'string'
    || voice.audioBase64.trim() === ''
  ) {
    return null
  }

  return {
    audioUrl: `data:audio/mpeg;base64,${voice.audioBase64}`,
    label: voice.label,
  }
}
