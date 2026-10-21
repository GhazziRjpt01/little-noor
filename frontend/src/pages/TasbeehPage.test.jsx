import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import { TASBEEH_STORAGE_KEY } from '../hooks/useTasbeeh.js'
import TasbeehPage from './TasbeehPage.jsx'

function renderTasbeeh() {
  return render(
    <LanguageProvider>
      <TasbeehPage />
    </LanguageProvider>,
  )
}

describe('Tasbeeh Counter', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('counts with a click, Space, and Enter, then resets on this device', async () => {
    const user = userEvent.setup()
    renderTasbeeh()

    expect(screen.getByText('Saved on this device. Not saved to Supabase.')).toBeInTheDocument()
    expect(screen.getByText('0 / 33')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Arabic' })).toHaveTextContent('TO_BE_PROVIDED')
    expect(screen.getByText('Demo content - not yet verified')).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/[\u0600-\u06FF]/)

    const tap = screen.getByRole('button', { name: 'Add one' })
    await user.click(tap)
    expect(screen.getByLabelText('Count')).toHaveTextContent('1')

    tap.focus()
    await user.keyboard('{Enter}')
    await user.keyboard(' ')
    expect(screen.getByLabelText('Count')).toHaveTextContent('3')
    expect(JSON.parse(localStorage.getItem(TASBEEH_STORAGE_KEY)).counts.subhanallah).toBe(3)

    await user.click(screen.getByRole('button', { name: 'Reset' }))
    expect(screen.getByLabelText('Count')).toHaveTextContent('0')
    expect(JSON.parse(localStorage.getItem(TASBEEH_STORAGE_KEY)).counts.subhanallah).toBe(0)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('changes the goal and celebrates when the count reaches it', async () => {
    const user = userEvent.setup()
    localStorage.setItem(
      TASBEEH_STORAGE_KEY,
      JSON.stringify({
        phraseId: 'subhanallah',
        goal: 33,
        counts: { subhanallah: 32, alhamdulillah: 0, 'allahu-akbar': 0 },
      }),
    )
    renderTasbeeh()

    await user.click(screen.getByRole('radio', { name: '99' }))
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '32 / 99')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '33' }))
    await user.click(screen.getByRole('button', { name: 'Add one' }))
    expect(screen.getByRole('status')).toHaveTextContent('Goal complete')
    expect(screen.getByText('33 / 33')).toBeInTheDocument()
  })

  it('keeps a separate count for each phrase', async () => {
    const user = userEvent.setup()
    renderTasbeeh()

    await user.click(screen.getByRole('button', { name: 'Add one' }))
    await user.click(screen.getByRole('radio', { name: 'Alhamdulillah' }))
    expect(screen.getByLabelText('Count')).toHaveTextContent('0')
    expect(screen.getByRole('region', { name: 'Arabic' })).toHaveTextContent('TO_BE_PROVIDED')

    await user.click(screen.getByRole('radio', { name: 'SubhanAllah' }))
    expect(screen.getByLabelText('Count')).toHaveTextContent('1')
  })
})
