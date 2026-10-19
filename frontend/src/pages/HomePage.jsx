import FeatureCards from '../components/home/FeatureCards.jsx'
import Hero from '../components/home/Hero.jsx'
import LearningGoal from '../components/home/LearningGoal.jsx'
import ParentDashboardCard from '../components/home/ParentDashboardCard.jsx'

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      <div className="relative z-10 mx-auto -mt-6 flex max-w-6xl flex-col gap-12 px-4 pb-16 sm:pb-20">
        <FeatureCards />
        <section className="grid items-stretch gap-5 lg:grid-cols-2">
          <LearningGoal />
          <ParentDashboardCard />
        </section>
      </div>
    </div>
  )
}
