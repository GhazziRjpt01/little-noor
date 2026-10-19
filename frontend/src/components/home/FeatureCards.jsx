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
      <h2 id="lessons-heading" className="sr-only">
        Lessons
      </h2>
      <motion.div
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        variants={list}
      >
        {lessons.map((lesson) => {
          const Icon = lesson.icon

          return (
            <motion.div key={lesson.to} variants={item} className="h-full">
              <Link
                to={lesson.to}
                className={`group flex h-full flex-col rounded-3xl p-5 shadow-soft transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2 ${lesson.tone}`}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-noor-ink">
                  <Icon size={28} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-2xl font-semibold">{lesson.title}</h3>
                <p className="mt-2 flex-1 font-semibold leading-relaxed text-noor-ink/80">
                  {lesson.text}
                </p>
                <span className="mt-4 text-sm font-extrabold text-noor-ink">
                  Open lesson
                </span>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
