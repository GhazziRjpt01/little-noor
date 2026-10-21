import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import LegalPage from './LegalPage.jsx'

function renderPage(kind) {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <LegalPage kind={kind} />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('legal drafts', () => {
  it('marks the privacy page as a draft and explains the child data', () => {
    renderPage('privacy')

    expect(screen.getByRole('heading', { name: 'Privacy policy' })).toBeInTheDocument()
    expect(screen.getByText(/A legal professional must review this page/)).toBeInTheDocument()
    expect(screen.getByText(/does not say that Little Noor meets any privacy law/)).toBeInTheDocument()
    expect(screen.getByText(/children ages 3 to 10/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'How a parent can delete it' })).toBeInTheDocument()
    expect(screen.getByText(/name and an age only/)).toBeInTheDocument()
  })

  it('keeps terms and consent as drafts for a grown-up', () => {
    const { unmount } = renderPage('terms')
    expect(screen.getByRole('heading', { name: 'Terms' })).toBeInTheDocument()
    expect(screen.getByText(/not a finished agreement/)).toBeInTheDocument()
    unmount()

    renderPage('consent')
    expect(screen.getByRole('heading', { name: 'Parental consent' })).toBeInTheDocument()
    expect(screen.getByText(/parent or guardian/)).toBeInTheDocument()
  })
})
