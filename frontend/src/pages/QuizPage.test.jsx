import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import LanguageProvider from '../components/LanguageProvider.jsx'
import QuizRound from '../components/quiz/QuizRound.jsx'
import { gradeChoice, starCount } from '../quiz/gradeQuiz.js'
import { getQuizCategories, getQuizQuestions } from '../services/contentService.js'
import QuizPage from './QuizPage.jsx'

function renderQuiz() {
  return render(
    <LanguageProvider>
      <QuizPage />
    </LanguageProvider>,
  )
}

const pictureQuestion = {
  id: 'shapes',
  title: 'Shapes',
  arabic: 'TO_BE_PROVIDED',
  translations: { en: 'Tap a picture', ur: 'Tap a picture' },
  verified: false,
  correctOptionId: 'b',
  options: [
    { id: 'a', text: 'Sun choice', icon: 'sun', imageUrl: null },
    { id: 'b', text: 'Heart choice', icon: 'heart', imageUrl: '/heart.png' },
    { id: 'c', text: 'Star choice', icon: 'star', imageUrl: null },
    { id: 'd', text: 'Cloud choice', icon: 'cloud', imageUrl: null },
  ],
}

describe('Islamic Quiz', () => {
  it('keeps every stored question as an unverified placeholder', () => {
    const categories = getQuizCategories()
    const questions = getQuizQuestions()

    expect(categories.map((category) => category.title)).toEqual([
      'Kalimas',
      'Manners',
      'Prayer',
      'Basic knowledge',
      'Prophets',
      'Quran',
      'History',
    ])
    expect(questions).toHaveLength(100)

    for (const question of questions) {
      expect(question.verified).toBe(false)
      expect(question.reviewStatus).toBe('needs_review')
      expect(['a', 'b', 'c', 'd']).toContain(question.correctOptionId)
      expect(question.translations.en.length).toBeGreaterThan(0)
      expect(question.options).toHaveLength(4)
      expect(question.options.map((option) => option.icon)).toEqual(['sun', 'heart', 'star', 'cloud'])
    }
  })

  it('marks a draft question and keeps the unverified badge', async () => {
    const user = userEvent.setup()
    renderQuiz()

    expect(screen.getByText('This quiz stays on this page. It is not saved to a server.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Kalimas' }))

    const kalimas = getQuizQuestions('kalimas')
    const correct = kalimas[0].options.find((option) => option.id === kalimas[0].correctOptionId)
    expect(screen.getByRole('heading', { level: 2, name: kalimas[0].title })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: kalimas[1].title })).not.toBeInTheDocument()
    expect(screen.getByText('Demo content - not yet verified')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', `1 / ${kalimas.length}`)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: correct.text }))
    expect(screen.getByRole('status')).toHaveTextContent('Yes. That matches the marked answer.')
    expect(screen.getByText(kalimas[0].explanation)).toBeInTheDocument()
    expect(screen.getByText('Score 1')).toBeInTheDocument()
  })

  it('marks a picture answer and shows stars from the score', async () => {
    const user = userEvent.setup()
    const { rerender } = render(
      <LanguageProvider>
        <QuizRound questions={[pictureQuestion]} onExit={() => {}} />
      </LanguageProvider>,
    )

    expect(screen.getByRole('button', { name: 'Heart choice' }).querySelector('img')).toHaveAttribute('src', '/heart.png')
    await user.click(screen.getByRole('button', { name: 'Sun choice' }))
    expect(screen.getByRole('status')).toHaveTextContent('That is okay. The marked answer is highlighted.')
    expect(screen.getByRole('button', { name: 'Heart choice' })).toHaveAttribute('data-result', 'right')
    expect(screen.getByRole('button', { name: 'Sun choice' })).toHaveAttribute('data-result', 'wrong')

    rerender(
      <LanguageProvider>
        <QuizRound questions={[{ ...pictureQuestion, id: 'shapes-2' }]} onExit={() => {}} />
      </LanguageProvider>,
    )
    await user.click(screen.getByRole('button', { name: 'Heart choice' }))
    expect(screen.getByRole('status')).toHaveTextContent('Yes. That matches the marked answer.')
    await user.click(screen.getByRole('button', { name: 'See results' }))
    expect(screen.getByText('Score 1 / 1')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Stars: 5 / 5' })).toBeInTheDocument()
    expect(gradeChoice(pictureQuestion, 'b')).toBe('right')
    expect(starCount(1, 1)).toBe(5)
  })
})
