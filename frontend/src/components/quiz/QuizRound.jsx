import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { Star } from 'lucide-react'
import Button from '../Button.jsx'
import VerificationBadge from '../VerificationBadge.jsx'
import { useI18n } from '../../i18n/useI18n.js'
import { countCorrect, gradeChoice, questionPrompt, starCount } from '../../quiz/gradeQuiz.js'
import OptionGlyph from './OptionGlyph.jsx'

export default function QuizRound({ questions, onExit, onComplete }) {
  const { t, languageId } = useI18n()
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  if (questions.length === 0) {
    return (
      <div className="rounded-3xl border border-white bg-noor-card p-6 text-center shadow-soft">
        <p className="text-lg font-extrabold">{t('quiz.empty')}</p>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" className="min-h-14" onClick={onExit}>
            {t('quiz.chooseAnother')}
          </Button>
        </div>
      </div>
    )
  }

  const correct = countCorrect(questions, answers)

  function retry() {
    setIndex(0)
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    const stars = starCount(correct, questions.length)
    const markable = questions.some((question) => question.correctOptionId)
    return (
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white bg-noor-card p-6 text-center shadow-soft sm:p-8"
      >
        <h2 className="text-3xl font-semibold">{t('quiz.finished')}</h2>
        <p className="mt-3 text-lg font-extrabold">
          {t('quiz.score')} {correct} / {questions.length}
        </p>
        {markable ? null : <p className="mt-2 font-semibold text-noor-muted">{t('quiz.unmarked')}</p>}
        <div className="mt-5 flex justify-center gap-2" role="img" aria-label={`${t('quiz.stars')}: ${stars} / 5`}>
          {Array.from({ length: 5 }, (_, star) => (
            <Star
              key={star}
              aria-hidden="true"
              size={36}
              className={star < stars ? 'fill-noor-sun-deep text-noor-sun-deep' : 'text-noor-sky'}
            />
          ))}
        </div>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="sun" className="min-h-14 min-w-36 text-lg" onClick={retry}>
            {t('quiz.tryAgain')}
          </Button>
          <Button variant="ghost" className="min-h-14" onClick={onExit}>
            {t('quiz.chooseAnother')}
          </Button>
        </div>
      </motion.section>
    )
  }

  const question = questions[index]
  const selected = answers[question.id] ?? null
  const grade = selected ? gradeChoice(question, selected) : null
  const last = index === questions.length - 1
  const percent = Math.round(((index + 1) / questions.length) * 100)

  function choose(optionId) {
    if (selected) {
      return
    }
    setAnswers((current) => ({ ...current, [question.id]: optionId }))
  }

  function goNext() {
    if (!selected) {
      return
    }
    if (last) {
      setFinished(true)
      onComplete?.()
      return
    }
    setIndex((current) => current + 1)
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between gap-3 text-sm font-extrabold text-noor-muted">
          <p>
            {index + 1} / {questions.length}
          </p>
          <p>
            {t('quiz.score')} {correct}
          </p>
        </div>
        <div
          className="mt-2 h-4 overflow-hidden rounded-full bg-noor-sky-soft"
          role="progressbar"
          aria-label={t('quiz.progress')}
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={index + 1}
          aria-valuetext={`${index + 1} / ${questions.length}`}
        >
          <div className="h-full rounded-full bg-noor-mint-deep" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <motion.article
        key={question.id}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">{question.title}</h2>
          <VerificationBadge verified={question.verified} />
        </div>
        <section aria-label={t('quiz.prompt')} className="mt-4">
          <p className="text-xl font-extrabold leading-relaxed">{questionPrompt(question, languageId)}</p>
          <p lang="ar" dir="rtl" className="mt-3 font-arabic text-3xl leading-[2.2]">
            {question.arabic}
          </p>
        </section>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {question.options.map((option) => {
            const result = selected
              ? option.id === question.correctOptionId
                ? 'right'
                : option.id === selected && grade === 'wrong'
                  ? 'wrong'
                  : undefined
              : undefined
            const pressed = option.id === selected
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={pressed}
                data-result={result}
                disabled={Boolean(selected)}
                className={`flex min-h-28 flex-col items-center justify-center gap-2 rounded-3xl px-3 py-4 text-center text-base font-extrabold shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink disabled:cursor-default ${result === 'right' ? 'bg-noor-mint' : result === 'wrong' ? 'bg-noor-peach' : pressed ? 'bg-noor-sky' : 'bg-white'}`}
                onClick={() => choose(option.id)}
              >
                {option.imageUrl ? (
                  <img src={option.imageUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                ) : (
                  <OptionGlyph name={option.icon} />
                )}
                <span>{option.text}</span>
              </button>
            )
          })}
        </div>
        {grade ? (
          <p role="status" className="mt-4 text-center text-lg font-extrabold">
            {t(`quiz.${grade}`)}
          </p>
        ) : null}
        {grade && question.explanation ? (
          <p className="mt-2 text-center font-semibold leading-relaxed text-noor-muted">{question.explanation}</p>
        ) : null}
      </motion.article>

      <div className="flex justify-center">
        <Button variant="sun" className="min-h-14 min-w-40 text-lg" disabled={!selected} onClick={goNext}>
          {last ? t('quiz.results') : t('quiz.next')}
        </Button>
      </div>
    </div>
  )
}
