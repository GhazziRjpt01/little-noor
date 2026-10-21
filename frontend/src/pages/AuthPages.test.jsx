import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthProvider from '../auth/AuthProvider.jsx'
import RequireAuth from '../auth/RequireAuth.jsx'
import LanguageProvider from '../components/LanguageProvider.jsx'
import LoginPage from './LoginPage.jsx'
import LogoutPage from './LogoutPage.jsx'
import SignupPage from './SignupPage.jsx'

const session = {
  access_token: 'parent-access-token-ok',
  user: { id: 'parent-1' },
}

function authClient(overrides = {}) {
  return {
    auth: {
      async getSession() {
        return { data: { session: null } }
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async signInWithPassword() {
        return { data: { session }, error: null }
      },
      async signUp() {
        return { data: { user: { id: 'parent-1' }, session: null }, error: null }
      },
      async signOut() {
        return { error: null }
      },
      ...overrides,
    },
  }
}

function renderAt(path, element, client) {
  return render(
    <LanguageProvider>
      <AuthProvider client={client}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/parent" element={<p>Dashboard gate</p>} />
            <Route element={<RequireAuth />}>
              <Route path="/private" element={element} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

describe('parent auth pages', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows that sign-in is not configured when the public key is missing', () => {
    renderAt('/login', null, null)
    expect(screen.getByRole('heading', { name: 'Parent log in' })).toBeInTheDocument()
    expect(screen.getByText('Parent sign-in is not configured on this site yet.')).toBeInTheDocument()
  })

  it('logs a parent in and opens the dashboard', async () => {
    const user = userEvent.setup()
    const signInWithPassword = vi.fn(async () => ({ data: { session }, error: null }))
    renderAt('/login', null, authClient({ signInWithPassword }))

    await user.type(await screen.findByLabelText('Email'), 'parent@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-secret-password')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByText('Dashboard gate')).toBeInTheDocument()
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'parent@example.com',
      password: 'long-secret-password',
    })
    expect(screen.queryByText('long-secret-password')).not.toBeInTheDocument()
  })

  it('tells the parent to confirm email when signup returns no session', async () => {
    const user = userEvent.setup()
    const signUp = vi.fn(async () => ({ data: { user: { id: 'parent-1' }, session: null }, error: null }))
    renderAt('/signup', null, authClient({ signUp }))

    await user.type(await screen.findByLabelText('Your name'), 'Parent A')
    await user.type(screen.getByLabelText('Email'), 'parent@example.com')
    await user.type(screen.getByLabelText('Password'), 'long-secret-password')
    const submit = screen.getByRole('button', { name: 'Create account' })
    expect(submit).toBeDisabled()
    await user.click(screen.getByRole('checkbox', { name: /I am the parent or guardian/ }))
    await user.click(submit)

    expect(await screen.findByText('Check email to confirm this parent account. No session was returned.')).toBeInTheDocument()
    expect(signUp).toHaveBeenCalledWith({
      email: 'parent@example.com',
      password: 'long-secret-password',
      options: { data: { display_name: 'Parent A', parental_consent: true } },
    })
  })

  it('signs out from the logout page', async () => {
    const signOut = vi.fn(async () => ({ error: null }))
    renderAt('/logout', null, authClient({
      signOut,
      async getSession() {
        return { data: { session } }
      },
    }))

    expect(await screen.findByText('You are signed out.')).toBeInTheDocument()
    await waitFor(() => expect(signOut).toHaveBeenCalled())
  })

  it('sends a guest away from the parent dashboard', () => {
    render(
      <LanguageProvider>
        <AuthProvider client={null}>
          <MemoryRouter initialEntries={['/private']}>
            <Routes>
              <Route path="/login" element={<p>Login gate</p>} />
              <Route element={<RequireAuth />}>
                <Route path="/private" element={<p>Secret dashboard</p>} />
              </Route>
            </Routes>
          </MemoryRouter>
        </AuthProvider>
      </LanguageProvider>,
    )

    expect(screen.getByText('Login gate')).toBeInTheDocument()
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument()
  })
})
