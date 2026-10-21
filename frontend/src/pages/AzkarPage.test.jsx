import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import { AZKAR_PROGRESS_KEY } from '../hooks/useAzkarProgress.js'
import { getAzkarCategories } from '../services/contentService.js'
import AzkarPage from './AzkarPage.jsx'

function renderAzkar() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <AzkarPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

function card(title) {
  return screen.getByRole('article', { name: title })
}

describe('Daily Azkar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the three lists from azkar.json and only the selected cards', async () => {
    const user = userEvent.setup()
    const categories = getAzkarCategories()
    renderAzkar()

    expect(categories.map((category) => category.title)).toEqual([
      'Morning',
      'Evening',
      'Waking up',
      'Sleeping',
      'Eating',
      'Drinking',
      'Entering home',
      'Leaving home',
      'After prayer',
    ])
    const morningTitle = categories[0].items[0].title
    const eveningTitle = categories[1].items[0].title
    const afterTitle = categories.find((category) => category.id === 'after-prayer').items[0].title
    expect(screen.getByRole('tab', { name: 'Morning' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('heading', { name: morningTitle })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: eveningTitle })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Evening' }))
    expect(screen.getByRole('heading', { name: eveningTitle })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: morningTitle })).not.toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'After prayer' }))
    expect(screen.getByRole('heading', { name: afterTitle })).toBeInTheDocument()
  })

  it('renders each stored field, the demo badge, and no invented audio', () => {
    const morning = getAzkarCategories()[0]
    renderAzkar()

    expect(screen.getAllByText('Demo content - not yet verified')).toHaveLength(morning.items.length)

    for (const item of morning.items) {
      const region = card(item.title)
      expect(within(region).getByRole('region', { name: 'Arabic' }).textContent.replace(/\s+/g, '')).toContain(
        item.arabic.replace(/\s+/g, ''),
      )
      expect(within(region).getByRole('region', { name: 'Transliteration' })).toHaveTextContent(item.transliteration)
      expect(within(region).getByRole('region', { name: 'English' })).toHaveTextContent(item.translations.en)
      expect(within(region).getByRole('region', { name: 'Urdu' })).toHaveTextContent(item.translations.ur)
      expect(within(region).getByRole('region', { name: 'Source' })).toHaveTextContent(item.source)
      expect(within(region).getByText('Audio coming soon')).toBeInTheDocument()
    }
  })

  it('counts repeats, marks a zikr finished, and stores today on this device only', async () => {
    const user = userEvent.setup()
    renderAzkar()

    const first = getAzkarCategories()[0].items[0]
    const total = getAzkarCategories().reduce((sum, category) => sum + category.items.length, 0)
    expect(screen.getByText('Saved on this device for today. Not saved to a database.')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(`0 / ${total}`)
    expect(screen.getByRole('button', { name: `Remove one: ${first.title}` })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: `Add one: ${first.title}` }))
    await user.click(screen.getByRole('button', { name: `Add one: ${first.title}` }))
    expect(screen.getByLabelText(`Count: ${first.title}`)).toHaveTextContent('2')

    await user.click(screen.getByRole('button', { name: `Remove one: ${first.title}` }))
    expect(screen.getByLabelText(`Count: ${first.title}`)).toHaveTextContent('1')

    await user.click(screen.getByRole('button', { name: `Mark finished: ${first.title}` }))
    expect(screen.getByRole('button', { name: `Finished: ${first.title}` })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).toHaveTextContent(`1 / ${total}`)

    const stored = JSON.parse(localStorage.getItem(AZKAR_PROGRESS_KEY))
    expect(stored.counts['morning-1']).toBe(1)
    expect(stored.completed['morning-1']).toBe(true)
    expect(stored.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(JSON.stringify(stored)).not.toMatch(/database/i)
  })
})
