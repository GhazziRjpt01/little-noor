import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import MemoryMatch from '../components/games/MemoryMatch.jsx'
import { buildDeck } from '../games/memoryDeck.js'
import { REWARDS_KEY, REWARD_AMOUNTS } from '../hooks/useRewards.js'
import { getKalimas } from '../services/contentService.js'
import GamesPage from './GamesPage.jsx'

function renderGames() {
  return render(
    <LanguageProvider>
      <MemoryRouter>
        <GamesPage />
      </MemoryRouter>
    </LanguageProvider>,
  )
}

describe('Games and Rewards', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the four activity cards and keeps the word puzzle closed', () => {
    renderGames()

    expect(screen.getByRole('heading', { name: 'Kalima Memory Match' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Word Puzzle' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quiz Challenge' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Star Rewards' })).toBeInTheDocument()
    expect(screen.getAllByText('Stars are for learning. They are not money, and they cannot be spent.').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Coming soon' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Open quiz' })).toHaveAttribute('href', '/quiz')
    expect(screen.getByText('Stars 0')).toBeInTheDocument()
  })

  it('matches kalima titles, counts moves, restarts, and saves learning stars', async () => {
    const user = userEvent.setup()
    const kalimas = getKalimas()
    render(
      <LanguageProvider>
        <MemoryMatch kalimas={kalimas} onBack={() => {}} shuffle={(deck) => deck} mismatchDelay={0} />
      </LanguageProvider>,
    )

    const titles = buildDeck(kalimas).map((card) => card.title)
    expect(titles.every((title) => kalimas.some((item) => item.title === title))).toBe(true)
    expect(document.body.textContent).not.toMatch(/[\u0600-\u06FF]/)

    await user.click(screen.getAllByRole('button', { name: 'Hidden card' })[0])
    await user.click(screen.getAllByRole('button', { name: 'Hidden card' })[1])
    expect(screen.getByText('Moves 1')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: 'Hidden card' })).toHaveLength(buildDeck(kalimas).length)
    })

    for (let pair = 0; pair < kalimas.length; pair += 1) {
      await user.click(screen.getAllByRole('button', { name: 'Hidden card' })[0])
      await user.click(screen.getAllByRole('button', { name: 'Hidden card' })[0])
    }

    expect(screen.getByRole('heading', { name: 'You matched every card.' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(REWARDS_KEY)).stars).toBe(REWARD_AMOUNTS['memory-match'])

    await user.click(screen.getByRole('button', { name: 'Play again' }))
    expect(screen.getByText('Moves 0')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Hidden card' })).toHaveLength(kalimas.length * 2)
  })
})
