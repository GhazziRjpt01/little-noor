import { AppError } from './errors.js'

const UNAVAILABLE = 'The teacher could not answer just now.'
const TIMEOUT = 'The teacher took too long. Please try again.'

export function createOpenAI({ apiKey, timeoutMs, fetchImpl = fetch } = {}) {
  const key = typeof apiKey === 'string' ? apiKey.trim() : ''
  if (!key) return null

  const timeout = normalizeTimeout(timeoutMs)

  async function post(path, body, binary = false, timeoutMs = timeout) {
    let response
    try {
      response = await fetchImpl(`https://api.openai.com${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Accept: binary ? 'audio/mpeg' : 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      })
    } catch (error) {
      if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
        throw new AppError(504, 'openai_timeout', TIMEOUT)
      }
      throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
    }

    if (!response.ok) {
      await response.arrayBuffer().catch(() => {})
      throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
    }

    if (binary) {
      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length < 1 || buffer.length > 2_000_000) {
        throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
      }
      return buffer
    }

    try {
      return await response.json()
    } catch {
      throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
    }
  }

  return {
    async moderate(input, model) {
      const data = await post('/v1/moderations', { model, input })
      const flagged = data?.results?.[0]?.flagged
      if (typeof flagged !== 'boolean') {
        throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
      }
      return { flagged }
    },

    async complete(messages, model) {
      const data = await post('/v1/chat/completions', {
        model,
        temperature: 0.2,
        max_tokens: 300,
        messages,
      })
      const reply = data?.choices?.[0]?.message?.content
      if (typeof reply !== 'string' || reply.trim() === '') {
        throw new AppError(502, 'openai_unavailable', UNAVAILABLE)
      }
      return reply.trim()
    },

    async speak(input, { model, voice, instructions, timeoutMs } = {}) {
      const body = {
        model,
        voice,
        input,
        response_format: 'mp3',
      }
      if (model === 'gpt-4o-mini-tts' && typeof instructions === 'string' && instructions.trim()) {
        body.instructions = instructions.trim().slice(0, 500)
      }
      const speechTimeout = Number.isFinite(timeoutMs) ? timeoutMs : timeout
      return post('/v1/audio/speech', body, true, speechTimeout)
    },
  }
}

function normalizeTimeout(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 12000
  return Math.min(30000, Math.max(1000, Math.round(number)))
}
