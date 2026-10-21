import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { readConfig } from './config.js'
import { errorHandler, sendError } from './errors.js'
import { createLogger } from './logger.js'
import { requestLogger, requireJson } from './middleware.js'
import { loadLessonCatalog } from './lessons/catalog.js'
import { createOpenAI } from './openai.js'
import { aiRouter, createAiHandlers } from './routes/ai.js'
import { authRouter } from './routes/auth.js'
import { healthHandler } from './routes/health.js'
import { lessonsRouter } from './routes/lessons.js'
import { progressRouter } from './routes/progress.js'

export function createApp(options = {}) {
  const config = options.config ?? readConfig(process.env)
  const logger = options.logger ?? createLogger()
  const createClient = options.createClient ?? null
  const limits = { ...config.rateLimits, ...options.rateLimits }
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }))
  app.use(cors({
    origin: config.frontendOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    maxAge: 600,
  }))
  app.use(requestLogger(logger))
  app.use(requireJson)
  app.use(express.json({ limit: config.jsonLimit, strict: true }))
  app.use(limiter(limits.windowMs, limits.global, (req) => req.path === '/health' || req.path === '/api/health'))

  const openai = options.openai === undefined
    ? createOpenAI({ apiKey: config.openaiKey, timeoutMs: config.openaiTimeoutMs })
    : options.openai
  const catalog = options.lessonCatalog ?? loadLessonCatalog()
  const ai = createAiHandlers({ openai, catalog, config })
  const aiLimit = limiter(limits.windowMs, limits.ai)
  const ttsLimit = limiter(limits.windowMs, limits.aiTts ?? 8)

  const health = healthHandler(config)
  app.get('/health', health)
  app.get('/api/health', health)
  app.use('/api/lessons', lessonsRouter(createClient))
  app.use('/api/ai', aiLimit, aiRouter({ ...ai, ttsLimit }))
  app.post('/api/ai-teacher', aiLimit, ai.chat)
  app.use('/api/auth', limiter(limits.windowMs, limits.auth), authRouter(createClient))
  app.use('/api/children', progressRouter(createClient))

  app.use((req, res) => {
    sendError(res, 404, 'not_found', 'That route does not exist.')
  })
  app.use(errorHandler(logger))

  return app
}

function limiter(windowMs, limit, skip) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    validate: false,
    ...(skip ? { skip } : {}),
    handler(_req, res) {
      sendError(res, 429, 'rate_limited', 'Too many requests. Try again later.')
    },
  })
}
