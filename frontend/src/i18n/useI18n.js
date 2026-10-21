import { useCallback } from 'react'
import { useLanguage } from '../hooks/useLanguage.js'
import { messages } from './messages.js'

export function useI18n() {
  const { language } = useLanguage()
  const dictionary = messages[language.id] ?? messages.en
  const t = useCallback((key) => {
    const value = key.split('.').reduce((node, part) => node?.[part], dictionary)
    return typeof value === 'string' ? value : key
  }, [dictionary])

  return { t, languageId: language.id }
}
