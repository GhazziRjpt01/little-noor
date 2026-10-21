import { Circle, Cloud, Heart, Star, Sun } from 'lucide-react'

const icons = {
  sun: Sun,
  heart: Heart,
  star: Star,
  cloud: Cloud,
}

export default function OptionGlyph({ name }) {
  const Icon = icons[name] ?? Circle
  return <Icon aria-hidden="true" size={48} strokeWidth={2.25} />
}
