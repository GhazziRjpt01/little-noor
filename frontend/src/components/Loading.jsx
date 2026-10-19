import { motion } from 'framer-motion'
import { MoonStar } from 'lucide-react'

export default function Loading({ label = 'Getting things ready…' }) {
  return (
    <div
      role="status"
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-noor-muted"
    >
      <motion.div
        className="flex h-16 w-16 items-center justify-center rounded-full bg-noor-sun text-noor-ink shadow-soft"
        animate={{ rotate: [0, 8, -8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MoonStar aria-hidden="true" />
      </motion.div>
      <p className="font-extrabold">{label}</p>
    </div>
  )
}
