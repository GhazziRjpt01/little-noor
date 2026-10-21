import { Router } from 'express'
import { AppError, supabaseFailure } from '../errors.js'
import { asyncRoute, requireParent } from '../middleware.js'
import { parseChild, parseChildId, parseProgress, toProgress } from '../validate.js'

const PROGRESS_COLUMNS = 'child_id, lessons_completed, lessons_total, kalimas_learned, azkar_completed, quiz_correct, quiz_total, streak, stars'

export function progressRouter(createClient) {
  const router = Router()
  router.use(requireParent(createClient))

  router.get('/', asyncRoute(async (req, res) => {
    const { data, error } = await req.supabase
      .from('children')
      .select('id, name, age')
      .eq('parent_id', req.parentId)

    if (error) throw supabaseFailure(error)
    res.json({ children: data ?? [] })
  }))

  router.delete('/:childId', asyncRoute(async (req, res) => {
    const childId = parseChildId(req.params.childId)
    await assertOwnChild(req, childId)
    const { error } = await req.supabase
      .from('children')
      .delete()
      .eq('id', childId)

    if (error) throw supabaseFailure(error)
    res.json({ deleted: true, childId })
  }))

  router.post('/', asyncRoute(async (req, res) => {
    const input = parseChild(req.body)
    const { data, error } = await req.supabase
      .from('children')
      .insert({
        parent_id: req.parentId,
        name: input.name,
        age: input.age,
      })
      .select('id, name, age')
      .single()

    if (error) throw supabaseFailure(error)
    res.status(201).json({ child: data })
  }))

  router.get('/:childId/progress', asyncRoute(async (req, res) => {
    const childId = parseChildId(req.params.childId)
    await assertOwnChild(req, childId)
    const { data, error } = await req.supabase
      .from('learning_progress')
      .select(PROGRESS_COLUMNS)
      .eq('child_id', childId)
      .maybeSingle()

    if (error) throw supabaseFailure(error)
    res.json({
      childId,
      saved: Boolean(data),
      progress: toProgress(data),
    })
  }))

  router.put('/:childId/progress', asyncRoute(async (req, res) => {
    const childId = parseChildId(req.params.childId)
    const fields = parseProgress(req.body)
    await assertOwnChild(req, childId)

    const { data, error } = await req.supabase
      .from('learning_progress')
      .upsert(
        {
          child_id: childId,
          ...fields,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'child_id' },
      )
      .select(PROGRESS_COLUMNS)
      .single()

    if (error) throw supabaseFailure(error)
    res.json({
      childId,
      saved: true,
      progress: toProgress(data),
    })
  }))

  return router
}

async function assertOwnChild(req, childId) {
  const { data, error } = await req.supabase
    .from('children')
    .select('id')
    .eq('id', childId)
    .maybeSingle()

  if (error) throw supabaseFailure(error)
  if (!data) throw new AppError(404, 'not_found', 'That child is not on this parent account.')
}
