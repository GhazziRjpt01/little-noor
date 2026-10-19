import { Languages } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage.js'

export default function LanguageSelector() {
  const { language, languages, setLanguageId } = useLanguage()

  return (
    <label className="inline-flex items-center gap-1.5 rounded-full bg-noor-sun-soft px-2.5 py-1.5 text-sm font-extrabold text-noor-ink shadow-soft sm:gap-2 sm:px-3 sm:py-2">
      <Languages className="hidden sm:block" size={16} aria-hidden="true" />
      <span className="sr-only">Choose language</span>
      <select
        value={language.id}
        aria-label="Choose language"
        onChange={(event) => setLanguageId(event.target.value)}
        className="cursor-pointer bg-transparent font-extrabold text-noor-ink focus:outline-none"
      >
        {languages.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  )
}
