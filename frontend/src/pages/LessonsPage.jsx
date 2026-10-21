import LibraryPage from './LibraryPage.jsx'
import { getLessons } from '../services/contentService.js'

export default function LessonsPage() {
  return (
    <LibraryPage
      title="Lessons"
      intro="Short lessons for ages 3 to 10. A parent confirms the family practice before treating any step as settled."
      items={getLessons()}
    />
  )
}
