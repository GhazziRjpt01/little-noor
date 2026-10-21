import LibraryPage from './LibraryPage.jsx'
import { getStories } from '../services/contentService.js'

export default function StoriesPage() {
  return (
    <LibraryPage
      title="Stories"
      intro="Short drafts for a parent to read with a child. They are not verified retellings."
      items={getStories()}
    />
  )
}
