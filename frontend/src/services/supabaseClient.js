import { createClient } from '@supabase/supabase-js'

let client

export function getSupabase() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (typeof url !== 'string' || typeof anonKey !== 'string' || !url.trim() || !anonKey.trim()) {
    return null
  }
  if (!client) {
    client = createClient(url.trim(), anonKey.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}
