import { BookOpen, CircleDot, CircleHelp, MoonStar } from 'lucide-react'

export const lessons = [
  {
    title: 'Six Kalimas',
    text: 'The six Kalimas, one gentle step at a time.',
    to: '/kalimas',
    tone: 'bg-noor-sky',
    icon: BookOpen,
  },
  {
    title: 'Daily Azkar',
    text: 'Short morning and evening remembrances.',
    to: '/azkar',
    tone: 'bg-noor-mint',
    icon: MoonStar,
  },
  {
    title: 'Tasbeeh Counter',
    text: 'Count dhikr with a calm, simple tap.',
    to: '/tasbeeh',
    tone: 'bg-noor-sun',
    icon: CircleDot,
  },
  {
    title: 'Islamic Quiz',
    text: 'Little questions that help a lesson stick.',
    to: '/quiz',
    tone: 'bg-noor-peach',
    icon: CircleHelp,
  },
]
