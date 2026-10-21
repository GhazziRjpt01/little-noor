export class AppError extends Error {
  constructor(status, code, message, details) {
    super(message)
    this.name = 'AppError'
    this.status = status
    this.code = code
    this.details = details
  }
}

export function sendError(res, status, code, message, details) {
  const error = { code, message }
  if (details) error.details = details
  res.status(status).json({ error })
}

export function supabaseFailure(error) {
  const supabaseCode = typeof error?.code === 'string' ? error.code : ''
  if (supabaseCode === '42P01' || supabaseCode === 'PGRST205') {
    return new AppError(503, 'schema_missing', 'That table is not in this Supabase project yet.', {
      supabaseCode,
    })
  }
  if (supabaseCode === '23503') {
    return new AppError(
      409,
      'profile_missing',
      'This parent has no profile row yet. Apply the SQL migration, then sign in again.',
      { supabaseCode },
    )
  }
  if (supabaseCode === '42501' || supabaseCode === 'PGRST301') {
    return new AppError(403, 'access_denied', 'This account cannot use that data.', { supabaseCode })
  }
  return new AppError(
    502,
    'supabase_error',
    'Supabase could not complete that request.',
    supabaseCode ? { supabaseCode } : undefined,
  )
}

export function authFailure(error, secret) {
  const raw = typeof error?.message === 'string' ? error.message : ''
  if (secret && raw.includes(secret)) {
    return new AppError(400, 'auth_rejected', 'Supabase did not accept that account.')
  }
  const lowered = raw.toLowerCase()
  if (lowered.includes('invalid login') || lowered.includes('invalid credentials')) {
    return new AppError(401, 'auth_rejected', 'Email or password was not accepted.')
  }
  if (lowered.includes('already registered') || lowered.includes('already been registered')) {
    return new AppError(409, 'account_exists', 'An account with that email already exists.')
  }
  return new AppError(400, 'auth_rejected', 'Supabase did not accept that account.')
}

export function notConfigured() {
  return new AppError(503, 'supabase_not_configured', 'Supabase is not configured on this server.')
}

function safePath(req) {
  const raw = req.originalUrl || req.url || req.path || ''
  return raw.split('?')[0].slice(0, 180)
}

export function errorHandler(logger) {
  return function onError(err, req, res, next) {
    if (res.headersSent) {
      next(err)
      return
    }

    const path = safePath(req)

    if (err?.type === 'entity.too.large') {
      logger.error({ event: 'request_error', method: req.method, path, status: 413, code: 'payload_too_large' })
      sendError(res, 413, 'payload_too_large', 'The request is too large.')
      return
    }

    if (err?.type === 'entity.parse.failed') {
      logger.error({ event: 'request_error', method: req.method, path, status: 400, code: 'invalid_json' })
      sendError(res, 400, 'invalid_json', 'The request body must be JSON.')
      return
    }

    if (err instanceof AppError) {
      logger.error({
        event: 'request_error',
        method: req.method,
        path,
        status: err.status,
        code: err.code,
      })
      sendError(res, err.status, err.code, err.message, err.details)
      return
    }

    logger.error({ event: 'request_error', method: req.method, path, status: 500, code: 'server_error' })
    sendError(res, 500, 'server_error', 'The server could not finish that request.')
  }
}
