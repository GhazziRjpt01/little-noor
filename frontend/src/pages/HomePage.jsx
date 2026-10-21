import FeatureCards from '../components/home/FeatureCards.jsx'
import Hero from '../components/home/Hero.jsx'
import LearningGoal from '../components/home/LearningGoal.jsx'
import ParentDashboardCard from '../components/home/ParentDashboardCard.jsx'
import TeacherHome from '../components/home/TeacherHome.jsx'

export default function HomePage() {
  return (
    <div>
      <Hero />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14 px-4 py-12 sm:py-16">
        <FeatureCards />
        <section className="grid items-stretch gap-5 lg:grid-cols-2">
          <LearningGoal />
          <TeacherHome />
        </section>
        <ParentDashboardCard />
      </div>
    </div>
  )
}
