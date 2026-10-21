import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import KalimaLesson from '../components/kalimas/KalimaLesson.jsx'
import Button from '../components/Button.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { getKalimaById, getKalimas } from '../services/contentService.js'

export default function KalimaLessonPage() {
  const { t } = useI18n()
  const { kalimaId } = useParams()
  const kalimas = getKalimas()
  const kalima = getKalimaById(kalimaId)
  const index = kalimas.findIndex((item) => item.id === kalimaId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [kalimaId])

  if (!kalima) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-semibold">{t('kalimas.missing')}</h1>
        <div className="mt-6 flex justify-center">
          <Button to="/kalimas">{t('kalimas.back')}</Button>
        </div>
      </div>
    )
  }

  return (
    <KalimaLesson
      kalima={kalima}
      previous={index > 0 ? kalimas[index - 1] : null}
      next={index < kalimas.length - 1 ? kalimas[index + 1] : null}
    />
  )
}
