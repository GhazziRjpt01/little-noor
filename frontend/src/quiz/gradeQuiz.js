export function questionPrompt(question, languageId) {
  if (languageId === 'ur') {
    return question.translations?.ur ?? question.translations?.en ?? ''
  }
  return question.translations?.en ?? ''
}

export function gradeChoice(question, optionId) {
  if (!question?.correctOptionId) {
    return 'unmarked'
  }
  return optionId === question.correctOptionId ? 'right' : 'wrong'
}

export function countCorrect(questions, answers) {
  return questions.filter((question) => gradeChoice(question, answers[question.id]) === 'right').length
}

export function starCount(correct, total) {
  if (!total) {
    return 0
  }
  return Math.round((correct / total) * 5)
}
