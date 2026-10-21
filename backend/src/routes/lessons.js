import { Router } from 'express'
import { AppError, notConfigured, supabaseFailure } from '../errors.js'
import { asyncRoute } from '../middleware.js'
import { parseLessonId } from '../validate.js'

export function lessonsRouter(createClient) {
  const router = Router()

  router.get('/', asyncRoute(async (_req, res) => {
    const supabase = clientOrThrow(createClient)
    const { data, error } = await supabase
      .from('lessons')
      .select('id, title, reviewed_by, verified')
      .eq('verified', true)

    if (error) throw supabaseFailure(error)

    res.json({
      lessons: (data ?? [])
        .filter((lesson) => lesson.verified === true)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          reviewedBy: lesson.reviewed_by ?? null,
        })),
    })
  }))

  router.get('/:id/audio', asyncRoute(async (req, res) => {
    const id = parseLessonId(req.params.id)
    const supabase = clientOrThrow(createClient)
    const { data, error } = await supabase
      .from('lessons')
      .select('id, audio_url, verified')
      .eq('id', id)
      .eq('verified', true)
      .maybeSingle()

    if (error) throw supabaseFailure(error)
    if (!data || data.verified !== true || !isHttps(data.audio_url)) {
      throw new AppError(404, 'audio_unavailable', 'No verified audio is stored for this lesson.')
    }

    res.json({ id: data.id, audioUrl: data.audio_url })
  }))

  return router
}

function clientOrThrow(createClient) {
  if (!createClient) throw notConfigured()
  return createClient()
}

function isHttps(value) {
  return typeof value === 'string' && value.startsWith('https://')
}
