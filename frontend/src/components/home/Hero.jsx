import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import heroScene from '../../assets/hero-scene.jpg'
import Button from '../Button.jsx'

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 140 70" className={className} aria-hidden="true">
      <ellipse cx="46" cy="42" rx="32" ry="18" fill="white" />
      <ellipse cx="78" cy="36" rx="28" ry="20" fill="white" />
      <ellipse cx="104" cy="44" rx="22" ry="14" fill="white" />
    </svg>
  )
}

const stars = [
  { className: 'left-[8%] top-8', delay: 0 },
  { className: 'left-[28%] top-16 hidden sm:block', delay: 0.4 },
  { className: 'right-[8%] top-10', delay: 0.8 },
  { className: 'right-[22%] bottom-16 hidden md:block', delay: 0.2 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-noor-sky via-noor-sky-soft to-white">
      <motion.div
        className="pointer-events-none absolute -left-6 top-6 w-32 opacity-90 sm:w-40"
        animate={{ x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 bottom-8 hidden w-36 opacity-80 md:block"
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full" />
      </motion.div>
      {stars.map((star) => (
        <motion.span
          key={star.className}
          className={`pointer-events-none absolute text-noor-sun-deep ${star.className}`}
          animate={{ opacity: [0.45, 1, 0.45], scale: [0.9, 1.08, 0.9] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        >
          <Star size={18} className="fill-noor-sun-deep" aria-hidden="true" />
        </motion.span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-6xl">
            Learn, Listen & Grow with Noor
          </h1>
          <p className="mt-4 max-w-xl text-lg font-semibold leading-relaxed text-noor-muted sm:text-xl">
            Discover the beauty of Islam with fun, interactive lessons made for kids!
          </p>
          <div className="mt-8">
            <Button
              to="/kalimas"
              variant="sun"
              size="lg"
              className="w-full px-8 py-4 text-lg sm:w-auto"
            >
              Start Learning
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <motion.img
            src={heroScene}
            alt="A child reading a book beside a pastel mosque, with clouds and stars"
            className="aspect-[4/3] w-full rounded-[2rem] object-cover shadow-soft"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
