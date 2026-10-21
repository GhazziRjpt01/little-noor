import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import MainLayout from '../layouts/MainLayout.jsx'
import { getKalimas } from '../services/contentService.js'
import KalimaLessonPage from './KalimaLessonPage.jsx'
import KalimasPage from './KalimasPage.jsx'

function renderKalimas(path) {
  return render(
    <LanguageProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/kalimas" element={<KalimasPage />} />
            <Route path="/kalimas/:kalimaId" element={<KalimaLessonPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('Six Kalimas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lists six numbered cards from kalimas.json', () => {
    renderKalimas('/kalimas')
    const kalimas = getKalimas()

    expect(kalimas).toHaveLength(6)
    expect(screen.getByRole('combobox', { name: 'Choose language' })).toBeInTheDocument()

    for (const [index, item] of kalimas.entries()) {
      const card = screen.getByRole('link', { name: new RegExp(item.title) })
      expect(card).toHaveAttribute('href', `/kalimas/${item.id}`)
      expect(card).toHaveTextContent(String(index + 1))
    }

    expect(screen.getAllByText('Demo content - not yet verified')).toHaveLength(6)
  })

  it('opens a lesson and moves to the next and previous kalima', async () => {
    const user = userEvent.setup()
    const [first, second] = getKalimas()
    renderKalimas('/kalimas')

    await user.click(screen.getByRole('link', { name: new RegExp(first.title) }))

    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument()
    expect(fieldText('Arabic')).toBe(first.arabic)
    expect(fieldText('Transliteration')).toBe(first.transliteration)
    expect(fieldText('English')).toBe(first.translations.en)
    expect(fieldText('Urdu')).toBe(first.translations.ur)
    expect(fieldText('Source')).toBe(first.source)
    expect(screen.getByText('Demo content - not yet verified')).toBeInTheDocument()
    expect(screen.getByText('Audio coming soon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    const arabic = screen.getByRole('region', { name: 'Arabic' }).querySelector('p')
    expect(arabic).toHaveAttribute('dir', 'rtl')
    expect(arabic).toHaveAttribute('lang', 'ar')
    expect(arabic).toHaveClass('font-arabic')

    fireEvent.click(screen.getByRole('link', { name: `Next: ${second.title}` }))
    expect(screen.getByRole('heading', { level: 1, name: second.title })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: `Previous: ${first.title}` }))
    expect(screen.getByRole('heading', { level: 1, name: first.title })).toBeInTheDocument()
  })

  it('disables next on the last kalima and returns to the list', async () => {
    const user = userEvent.setup()
    const kalimas = getKalimas()
    const last = kalimas[kalimas.length - 1]
    renderKalimas(`/kalimas/${last.id}`)

    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('link', { name: `Previous: ${kalimas[kalimas.length - 2].title}` })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'All Kalimas' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Six Kalimas' })).toBeInTheDocument()
  })

  it('explains an unknown kalima id', () => {
    renderKalimas('/kalimas/missing')

    expect(screen.getByRole('heading', { name: 'That kalima is not in the list.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'All Kalimas' })).toHaveAttribute('href', '/kalimas')
  })
})

function fieldText(name) {
  return screen.getByRole('region', { name }).querySelector('p').textContent
}
