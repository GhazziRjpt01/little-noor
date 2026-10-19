import PlaceholderPage from '../components/PlaceholderPage.jsx'
import { findPage } from '../navigation.js'

export default function QuizPage() {
  return <PlaceholderPage {...findPage('/quiz')} />
}
