import { useEffect, useMemo, useState } from 'react'
import {
  LanguageContext,
  defaultLanguageId,
  languages,
} from '../hooks/languageStore.js'

const STORAGE_KEY = 'little-noor-language'

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (languages.some((language) => language.id === stored)) {
      return stored
    }
  } catch {
    // Storage can be unavailable in private browsing.
  }

  return defaultLanguageId
}

export default function LanguageProvider({ children }) {
  const [languageId, setLanguageId] = useState(readStoredLanguage)
  const language =
    languages.find((item) => item.id === languageId) ?? languages[0]

  useEffect(() => {
    // Page copy is still English, so the layout stays left to right.
    document.documentElement.lang = language.id
    document.documentElement.dir = 'ltr'

    try {
      window.localStorage.setItem(STORAGE_KEY, language.id)
    } catch {
      // Ignore storage failures and keep the choice for this visit.
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      languages,
      setLanguageId,
    }),
    [language],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}
