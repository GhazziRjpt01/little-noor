import { createClient } from '@supabase/supabase-js'

export function createSupabaseFactory(config) {
  if (!config.supabaseConfigured) return null

  return function createRequestClient({ accessToken } = {}) {
    return createClient(config.supabaseUrl, config.supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: accessToken
        ? { headers: { Authorization: `Bearer ${accessToken}` } }
        : {},
    })
  }
}
