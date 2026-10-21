import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { REWARDS_KEY } from '../hooks/useRewards.js'
import HomePage from './HomePage.jsx'

function renderHome() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  )
}

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear()
    window.IntersectionObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  it('shows the learning world and working links', () => {
    renderHome()

    expect(screen.getByRole('heading', { name: 'Learn, Listen & Grow with Noor' })).toBeInTheDocument()
    expect(
      screen.getByText('Discover the beauty of Islam through fun lessons, stories and games.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start Learning' })).toHaveAttribute('href', '/kalimas')
    expect(screen.getByRole('link', { name: /Six Kalimas/ })).toHaveAttribute('href', '/kalimas')
    expect(screen.getByRole('link', { name: /Daily Azkar/ })).toHaveAttribute('href', '/azkar')
    expect(screen.getByRole('link', { name: /Tasbeeh Counter/ })).toHaveAttribute('href', '/tasbeeh')
    expect(screen.getByRole('link', { name: /Islamic Quiz/ })).toHaveAttribute('href', '/quiz')
    expect(screen.getByRole('heading', { name: 'Today’s Learning Goal' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Teacher' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Meet the teacher' })).toHaveAttribute('href', '/ai-teacher')
    expect(screen.getByRole('heading', { name: 'Parent Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Open dashboard' })).toHaveAttribute('href', '/parent')
    expect(screen.getByText('0 stars on this device')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'A child in a pink hijab holding an open storybook' })).toBeInTheDocument()
  })

  it('fills today’s goal from practice saved on this device', () => {
    localStorage.setItem(REWARDS_KEY, JSON.stringify({ stars: 2, activities: { quiz: 2, 'memory-match': 0 } }))
    renderHome()

    expect(screen.getByText('2 stars on this device')).toBeInTheDocument()
    expect(screen.getByText('1 of 3')).toBeInTheDocument()
  })
})
