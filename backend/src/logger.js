const SENSITIVE_KEYS = new Set([
  'message',
  'password',
  'authorization',
  'content',
  'reply',
  'chat',
  'prompt',
  'body',
  'email',
  'token',
  'accesstoken',
  'refreshtoken',
  'displayname',
  'name',
  'text',
  'input',
  'question',
  'transcript',
  'speech',
  'audio',
  'audiobase64',
  'openaikey',
  'apikey',
])

export function createLogger(write = (line) => console.log(line)) {
  function emit(level, fields) {
    const safe = { level }
    for (const [key, value] of Object.entries(fields ?? {})) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) continue
      if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') continue
      if (typeof value === 'string' && value.length > 180) continue
      safe[key] = value
    }
    write(JSON.stringify(safe))
  }

  return {
    info(fields) {
      emit('info', fields)
    },
    error(fields) {
      emit('error', fields)
    },
  }
}
