import { createContext } from 'react'

export const LanguageContext = createContext(null)

export const languages = [
  { id: 'en', label: 'English', nativeLabel: 'English', dir: 'ltr' },
  { id: 'ur', label: 'Urdu', nativeLabel: 'اردو', dir: 'rtl' },
  { id: 'ar', label: 'Arabic', nativeLabel: 'العربية', dir: 'rtl' },
]

export const defaultLanguageId = 'en'
