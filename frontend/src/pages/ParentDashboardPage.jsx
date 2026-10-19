import PlaceholderPage from '../components/PlaceholderPage.jsx'
import { findPage } from '../navigation.js'

export default function ParentDashboardPage() {
  return <PlaceholderPage {...findPage('/parent')} />
}
