import { useEffect, useMemo, useState } from 'react'
import { clearSelectedChild } from '../services/dashboardService.js'
import { AuthContext } from './useAuth.js'

export default function AuthProvider({ client = null, children }) {
  const [session, setSession] = useState(null)
  const [status, setStatus] = useState(client ? 'loading' : 'ready')

  useEffect(() => {
    if (!client) return undefined
    let active = true

    client.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data?.session ?? null)
      setStatus('ready')
    }).catch(() => {
      if (!active) return
      setSession(null)
      setStatus('ready')
    })

    const { data } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
      setStatus('ready')
    })

    return () => {
      active = false
      data?.subscription?.unsubscribe()
    }
  }, [client])

  const value = useMemo(() => ({
    status,
    session,
    client,
    async signIn(email, password) {
      if (!client) return { error: 'unconfigured' }
      const { data, error } = await client.auth.signInWithPassword({ email, password })
      if (error || !data?.session) return { error: 'rejected' }
      return { session: data.session }
    },
    async signUp({ email, password, displayName, consent }) {
      if (!client) return { error: 'unconfigured' }
      if (consent !== true) return { error: 'consent' }
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName, parental_consent: true } },
      })
      if (error || !data?.user) return { error: 'rejected' }
      return { session: data.session ?? null }
    },
    async signOut() {
      clearSelectedChild()
      if (!client) return
      await client.auth.signOut()
    },
  }), [client, session, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
