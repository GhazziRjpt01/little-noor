const LOCAL_ORIGIN = 'http://localhost:5173'
const VOICES = new Set([
  'alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse',
])

export function readConfig(env) {
  const supabaseUrl = env.SUPABASE_URL?.trim() || ''
  const supabaseAnonKey = env.SUPABASE_ANON_KEY?.trim() || ''
  const openaiKey = env.OPENAI_API_KEY?.trim() || ''

  return {
    port: Number(env.PORT) || 5000,
    nodeEnv: env.NODE_ENV || 'development',
    frontendOrigin: env.FRONTEND_ORIGIN?.trim() || LOCAL_ORIGIN,
    supabaseUrl,
    supabaseAnonKey,
    supabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    openaiKey,
    openaiConfigured: Boolean(openaiKey),
    openaiChatModel: pickModel(env.OPENAI_CHAT_MODEL, 'gpt-4o-mini'),
    openaiModerationModel: pickModel(env.OPENAI_MODERATION_MODEL, 'omni-moderation-latest'),
    openaiTtsModel: pickModel(env.OPENAI_TTS_MODEL, 'gpt-4o-mini-tts'),
    openaiTtsVoice: pickVoice(env.OPENAI_TTS_VOICE),
    openaiTeacherVoice: pickVoice(env.OPENAI_TEACHER_VOICE, 'coral'),
    openaiTimeoutMs: pickTimeout(env.OPENAI_TIMEOUT_MS),
    jsonLimit: '16kb',
    rateLimits: {
      windowMs: 15 * 60 * 1000,
      global: 100,
      auth: 10,
      ai: 20,
      aiTts: 8,
    },
  }
}

function pickModel(value, fallback) {
  const model = typeof value === 'string' ? value.trim() : ''
  return /^[a-z0-9._-]{1,64}$/i.test(model) ? model : fallback
}

function pickVoice(value, fallback = 'nova') {
  const voice = typeof value === 'string' ? value.trim().toLowerCase() : ''
  return VOICES.has(voice) ? voice : fallback
}

function pickTimeout(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 12000
  return Math.min(30000, Math.max(1000, Math.round(number)))
}

export function assertProductionOrigin(env) {
  if (env.NODE_ENV === 'production' && !env.FRONTEND_ORIGIN?.trim()) {
    throw new Error('FRONTEND_ORIGIN is required in production.')
  }
}
