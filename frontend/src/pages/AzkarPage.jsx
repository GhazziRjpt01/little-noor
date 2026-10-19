import PlaceholderPage from '../components/PlaceholderPage.jsx'
import { findPage } from '../navigation.js'

export default function AzkarPage() {
  return <PlaceholderPage {...findPage('/azkar')} />
}
