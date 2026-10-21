import book from '../../assets/illustrations/kalimas-book.webp'
import mosque from '../../assets/illustrations/mosque.webp'
import beads from '../../assets/illustrations/prayer-beads.webp'
import trophy from '../../assets/illustrations/quiz-trophy.webp'

export const lessons = [
  {
    title: 'Six Kalimas',
    text: 'The six Kalimas, one gentle step at a time.',
    to: '/kalimas',
    tone: 'bg-noor-sky',
    image: book,
    alt: 'An open storybook with a little mosque',
  },
  {
    title: 'Daily Azkar',
    text: 'Short morning and evening remembrances.',
    to: '/azkar',
    tone: 'bg-noor-mint',
    image: mosque,
    alt: 'A colorful mosque with mint domes and a gold crescent',
  },
  {
    title: 'Tasbeeh Counter',
    text: 'Count dhikr with a calm, simple tap.',
    to: '/tasbeeh',
    tone: 'bg-noor-sun',
    image: beads,
    alt: 'A loop of mint and cream prayer beads',
  },
  {
    title: 'Islamic Quiz',
    text: 'Little questions that help a lesson stick.',
    to: '/quiz',
    tone: 'bg-noor-peach',
    image: trophy,
    alt: 'A yellow star trophy',
  },
]
