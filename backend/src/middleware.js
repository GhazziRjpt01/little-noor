import { AppError, notConfigured, sendError } from './errors.js'

export function asyncRoute(handler) {
  return function wrapped(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

export function requestLogger(logger) {
  return function logRequest(req, res, next) {
    res.on('finish', () => {
      logger.info({
        event: 'request',
        method: req.method,
        path: requestPath(req),
        status: res.statusCode,
      })
    })
    next()
  }
}

function requestPath(req) {
  const raw = req.originalUrl || req.url || req.path || ''
  return raw.split('?')[0].slice(0, 180)
}

export function requireJson(req, res, next) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const type = (req.get('content-type') || '').toLowerCase()
    if (!type.startsWith('application/json')) {
      sendError(res, 415, 'unsupported_media', 'Send a JSON request body.')
      return
    }
  }
  next()
}

export function requireParent(createClient) {
  return asyncRoute(async function authenticate(req, _res, next) {
    if (!createClient) throw notConfigured()

    const match = /^Bearer\s+(\S+)$/.exec(req.get('authorization') || '')
    if (!match) throw new AppError(401, 'unauthorized', 'Sign in is required.')

    const accessToken = match[1]
    if (accessToken.length < 20 || accessToken.length > 4096) {
      throw new AppError(401, 'unauthorized', 'Sign in is required.')
    }

    const supabase = createClient({ accessToken })
    const { data, error } = await supabase.auth.getUser(accessToken)
    if (error || !data?.user?.id) throw new AppError(401, 'unauthorized', 'Sign in is required.')

    req.supabase = supabase
    req.parentId = data.user.id
    next()
  })
}
