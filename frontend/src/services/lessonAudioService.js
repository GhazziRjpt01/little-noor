// Asks the API for one approved lesson recording. The frontend never holds a model key.
export const LESSON_TTS_ENDPOINT = '/api/ai/tts'
const AI_AUDIO_LABEL = 'AI-generated voice. It may not follow Tajweed perfectly.'

export async function requestLessonAudio({ lessonId, field }) {
  let response
  try {
    response = await fetch(LESSON_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lessonId, field }),
    })
  } catch {
    throw new Error('error')
  }

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const code = data?.error?.code
    if (code === 'lesson_not_approved') throw new Error('not-approved')
    if (response.status === 504 || (typeof code === 'string' && code.endsWith('_timeout'))) throw new Error('timeout')
    if (response.status === 503 || (typeof code === 'string' && code.endsWith('_not_configured'))) {
      throw new Error('not-connected')
    }
    throw new Error('error')
  }

  if (data?.source === 'recorded' && typeof data.audioUrl === 'string' && data.audioUrl.startsWith('https://')) {
    return { source: 'recorded', audioUrl: data.audioUrl, label: data.label }
  }

  if (
    data?.source === 'ai'
    && data.label === AI_AUDIO_LABEL
    && data.contentType === 'audio/mpeg'
    && typeof data.audioBase64 === 'string'
    && data.audioBase64.trim() !== ''
  ) {
    return {
      source: 'ai',
      audioUrl: `data:audio/mpeg;base64,${data.audioBase64}`,
      label: data.label,
    }
  }

  throw new Error('error')
}
