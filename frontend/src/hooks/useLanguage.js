import { useContext } from 'react'
import { LanguageContext } from './languageStore.js'

export function useLanguage() {
  const value = useContext(LanguageContext)

  if (!value) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }

  return value
}
