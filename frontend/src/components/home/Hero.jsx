import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import mascot from '../../assets/illustrations/mascot-child.webp'
import mosque from '../../assets/illustrations/mosque.webp'
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
  { className: 'left-[6%] top-8', delay: 0 },
  { className: 'left-[24%] top-16 hidden sm:block', delay: 0.6 },
  { className: 'right-[6%] top-12', delay: 1.1 },
  { className: 'right-[18%] bottom-24 hidden md:block', delay: 0.3 },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-noor-sky via-noor-sky-soft to-noor-cream">
      <motion.div
        className="pointer-events-none absolute -left-6 top-6 w-32 opacity-90 sm:w-40"
        animate={{ x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full" />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 bottom-10 hidden w-36 opacity-80 md:block"
        animate={{ x: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud className="w-full" />
      </motion.div>
      {stars.map((star) => (
        <motion.span
          key={star.className}
          className={`pointer-events-none absolute text-noor-sun-deep ${star.className}`}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, delay: star.delay, ease: 'easeInOut' }}
        >
          <Star size={18} className="fill-noor-sun-deep" aria-hidden="true" />
        </motion.span>
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.12] sm:text-5xl lg:text-6xl">
            Learn, Listen & Grow with Noor
          </h1>
          <p className="mt-4 max-w-xl text-lg font-semibold leading-relaxed text-noor-muted sm:text-xl">
            Discover the beauty of Islam through fun lessons, stories and games.
          </p>
          <div className="mt-8">
            <Button
              to="/kalimas"
              variant="sun"
              size="lg"
              className="min-h-14 w-full px-8 py-4 text-lg sm:w-auto"
            >
              Start Learning
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative mx-auto h-80 w-full max-w-xl sm:h-[28rem]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <img
            src={mosque}
            alt="A colorful mosque with mint domes and a gold crescent"
            className="absolute right-0 bottom-4 h-3/5 w-[82%] object-contain object-right sm:h-2/3"
          />
          <img
            src={mascot}
            alt="A child in a pink hijab holding an open storybook"
            className="absolute bottom-0 left-0 z-10 h-[92%] w-auto max-w-[78%] object-contain object-left drop-shadow"
          />
        </motion.div>
      </div>
    </section>
  )
}
