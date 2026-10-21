import LibraryPage from './LibraryPage.jsx'
import { getActivities } from '../services/contentService.js'

export default function ActivitiesPage() {
  return (
    <LibraryPage
      title="Activities"
      intro="Simple things to do with a grown-up. The star numbers are suggestions. The Games page does not add them by itself."
      items={getActivities()}
    />
  )
}
