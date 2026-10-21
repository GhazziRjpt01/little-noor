import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from '../../i18n/useI18n.js'
import VerificationBadge from '../VerificationBadge.jsx'

const tones = ['bg-noor-sky', 'bg-noor-mint', 'bg-noor-sun', 'bg-noor-peach']

export default function KalimaCard({ item, number, index }) {
  const { t } = useI18n()

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Link
        to={`/kalimas/${item.id}`}
        className="flex h-full flex-col rounded-3xl border border-white bg-noor-card p-5 shadow-soft transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink focus-visible:ring-offset-2"
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-semibold text-noor-ink ${tones[index % tones.length]}`}
        >
          {number}
        </span>
        <h2 className="mt-4 text-2xl font-semibold">{item.title}</h2>
        <div className="mt-3">
          <VerificationBadge verified={item.verified} />
        </div>
        <span className="mt-5 text-sm font-extrabold text-noor-ink">{t('kalimas.open')}</span>
      </Link>
    </motion.li>
  )
}
