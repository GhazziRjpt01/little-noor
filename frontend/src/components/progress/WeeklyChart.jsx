import { motion, useReducedMotion } from 'framer-motion'

export default function WeeklyChart({ days, label, dayLabel }) {
  const reduceMotion = useReducedMotion()
  const peak = Math.max(...days.map((day) => day.value), 1)

  return (
    <ol aria-label={label} className="grid grid-cols-7 items-end gap-2">
      {days.map((day, index) => {
        const height = Math.round((day.value / peak) * 100)
        return (
          <li key={day.id} className="flex flex-col items-center gap-2">
            <span className="text-xs font-extrabold text-noor-muted">{day.value}</span>
            <div className="flex h-28 w-full items-end rounded-2xl bg-noor-sky-soft sm:h-36">
              <motion.div
                className="w-full origin-bottom rounded-2xl bg-noor-sky-deep"
                style={{ height: `${height}%` }}
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              />
            </div>
            <span className="text-xs font-extrabold">{dayLabel(day.id)}</span>
          </li>
        )
      })}
    </ol>
  )
}
