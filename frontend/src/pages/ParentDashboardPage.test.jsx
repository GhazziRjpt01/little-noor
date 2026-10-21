import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AuthProvider from '../auth/AuthProvider.jsx'
import LanguageProvider from '../components/LanguageProvider.jsx'
import { PARENT_SETTINGS_KEY } from '../services/dashboardService.js'
import ParentDashboardPage from './ParentDashboardPage.jsx'

const childId = '11111111-1111-4111-8111-111111111111'
const session = {
  access_token: 'parent-access-token-ok',
  user: { id: 'parent-1' },
}

const progress = {
  lessonsCompleted: 2,
  lessonsTotal: 4,
  kalimasLearned: 1,
  azkarCompleted: 0,
  quizCorrect: 1,
  quizTotal: 2,
  streak: 3,
  stars: 4,
}

function authClient() {
  return {
    auth: {
      async getSession() {
        return { data: { session } }
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe() {} } } }
      },
      async signOut() {
        return { error: null }
      },
    },
  }
}

function renderDashboard() {
  return render(
    <LanguageProvider>
      <AuthProvider client={authClient()}>
        <MemoryRouter>
          <ParentDashboardPage />
        </MemoryRouter>
      </AuthProvider>
    </LanguageProvider>,
  )
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('Parent Dashboard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the signed-in child from the account and not demo numbers', async () => {
    vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => {
      expect(options.headers.Authorization).toBe('Bearer parent-access-token-ok')
      if (String(url).endsWith('/progress')) {
        return json({ childId, saved: true, progress })
      }
      return json({
        children: [{ id: childId, name: 'Noor', age: 6 }],
      })
    }))
    renderDashboard()

    expect(await screen.findByRole('heading', { name: 'Noor' })).toBeInTheDocument()
    expect(screen.queryByText('DEMO data')).not.toBeInTheDocument()
    expect(screen.queryByText('Sample numbers for one child. Not loaded from Supabase.')).not.toBeInTheDocument()
    expect(screen.getByText('Numbers come from this parent account.')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Lessons completed' })).toHaveAttribute('aria-valuenow', '2')
    expect(screen.getByText('3 days')).toBeInTheDocument()
    expect(screen.queryByText('another-child')).not.toBeInTheDocument()
  })

  it('shows an empty account and adds a child with name and age only', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async (_url, options = {}) => {
      if (options.method === 'POST') {
        return json({ child: { id: childId, name: 'Noor', age: 6, email: 'skip@example.com' } }, 201)
      }
      return json({ children: [] })
    }))
    renderDashboard()

    expect(await screen.findByText('No child is on this account yet.')).toBeInTheDocument()
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Child name'), 'Noor')
    await user.click(screen.getByRole('button', { name: 'Add child' }))

    await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/children', expect.objectContaining({ method: 'POST' })))
    const post = fetch.mock.calls.find((call) => call[1]?.method === 'POST')
    expect(JSON.parse(post[1].body)).toEqual({ name: 'Noor', age: 6 })
    expect(await screen.findByRole('heading', { name: 'Noor' })).toBeInTheDocument()
  })

  it('shows an error and tries again', async () => {
    const user = userEvent.setup()
    let calls = 0
    vi.stubGlobal('fetch', vi.fn(async () => {
      calls += 1
      if (calls === 1) return json({ error: { message: 'down' } }, 500)
      return json({ children: [] })
    }))
    renderDashboard()

    expect(await screen.findByRole('alert')).toHaveTextContent('The account could not be loaded.')
    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(await screen.findByText('No child is on this account yet.')).toBeInTheDocument()
  })

  it('hides recent activity from the privacy control and keeps settings on this device', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async (url) => {
      if (String(url).endsWith('/progress')) return json({ childId, saved: true, progress })
      return json({ children: [{ id: childId, name: 'Noor', age: 6 }] })
    }))
    renderDashboard()

    await screen.findByRole('heading', { name: 'Noor' })
    await user.click(screen.getByRole('switch', { name: 'Show recent activity' }))
    expect(screen.getByText('Recent activity is hidden.')).toBeInTheDocument()
    expect(screen.getByText('Saved on this device. Not saved to Supabase.')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(PARENT_SETTINGS_KEY)).showActivity).toBe(false)
  })

  it('asks before deleting the selected child on the account', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('fetch', vi.fn(async (url, options = {}) => {
      if (options.method === 'DELETE') return json({ deleted: true, childId })
      if (String(url).endsWith('/progress')) return json({ childId, saved: true, progress })
      return json({ children: [{ id: childId, name: 'Noor', age: 6 }] })
    }))
    renderDashboard()

    await screen.findByRole('heading', { name: 'Noor' })
    await user.click(screen.getByRole('button', { name: 'Delete child data' }))
    expect(fetch.mock.calls.some((call) => call[1]?.method === 'DELETE')).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Yes, delete this child\'s data' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`/api/children/${childId}`, expect.objectContaining({ method: 'DELETE' }))
    })
    expect(await screen.findByText('That child\'s account data was deleted.')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Noor' })).not.toBeInTheDocument()
  })
})
