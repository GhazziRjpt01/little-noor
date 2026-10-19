import PlaceholderPage from '../components/PlaceholderPage.jsx'
import { findPage } from '../navigation.js'

export default function GamesPage() {
  return <PlaceholderPage {...findPage('/games')} />
}
