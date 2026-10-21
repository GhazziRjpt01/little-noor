import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  status: 'ready',
  session: null,
  client: null,
  signIn: async () => ({ error: 'unconfigured' }),
  signUp: async () => ({ error: 'unconfigured' }),
  signOut: async () => {},
})

export function useAuth() {
  return useContext(AuthContext)
}
