import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { lessons } from './lessons.js'

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function FeatureCards() {
  return (
    <section aria-labelledby="lessons-heading">
      <h2 id="lessons-heading" className="text-3xl font-semibold sm:text-4xl">
        Choose a lesson
      </h2>
      <motion.div
        className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={list}
      >
        {lessons.map((lesson) => (
          <motion.div key={lesson.to} variants={item} className="h-full">
            <Link
              to={lesson.to}
              className={`group flex h-full min-h-64 flex-col rounded-[2rem] p-4 shadow-soft transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2 active:translate-y-0 ${lesson.tone}`}
            >
              <img
                src={lesson.image}
                alt={lesson.alt}
                className="h-40 w-full rounded-3xl bg-noor-cream object-contain p-2"
              />
              <h3 className="mt-4 text-2xl font-semibold">{lesson.title}</h3>
              <p className="mt-2 flex-1 text-base font-semibold leading-relaxed text-noor-ink/80">
                {lesson.text}
              </p>
              <span className="mt-4 text-sm font-extrabold text-noor-ink">Open lesson</span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
