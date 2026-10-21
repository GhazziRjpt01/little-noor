import { Router } from 'express'
import { AppError, authFailure, notConfigured, supabaseFailure } from '../errors.js'
import { asyncRoute } from '../middleware.js'
import { parseLogin, parseSignup } from '../validate.js'

export function authRouter(createClient) {
  const router = Router()

  router.post('/signup', asyncRoute(async (req, res) => {
    const input = parseSignup(req.body)
    const supabase = clientOrThrow(createClient)
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          display_name: input.displayName,
          parental_consent: true,
        },
      },
    })

    if (error) throw authFailure(error, input.password)
    if (!data?.user?.id) throw new AppError(502, 'auth_rejected', 'Supabase did not return a parent account.')

    let profileSaved = false
    if (data.session?.access_token) {
      const userClient = createClient({ accessToken: data.session.access_token })
      const profile = await userClient.from('profiles').upsert(
        { id: data.user.id, display_name: input.displayName },
        { onConflict: 'id' },
      )
      if (profile.error) {
        const failure = supabaseFailure(profile.error)
        throw new AppError(failure.status, failure.code, 'The auth account was created, but the profile row was not saved.', failure.details)
      }
      profileSaved = true
    }

    res.status(201).json({
      user: { id: data.user.id, email: data.user.email ?? input.email },
      session: sessionPayload(data.session),
      profileSaved,
      message: data.session
        ? 'Parent account is signed in.'
        : 'Supabase did not return a session. Confirm the email if confirmation is enabled. A profile row is created only when the SQL trigger from the migration has been applied.',
    })
  }))

  router.post('/login', asyncRoute(async (req, res) => {
    const input = parseLogin(req.body)
    const supabase = clientOrThrow(createClient)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    })

    if (error || !data?.session?.access_token) throw authFailure(error, input.password)

    res.json({
      user: { id: data.user.id, email: data.user.email ?? input.email },
      session: sessionPayload(data.session),
    })
  }))

  return router
}

function clientOrThrow(createClient) {
  if (!createClient) throw notConfigured()
  return createClient()
}

function sessionPayload(session) {
  if (!session?.access_token) return null
  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token ?? null,
  }
}
