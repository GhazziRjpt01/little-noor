import { NavLink } from 'react-router-dom'
import mosque from '../assets/illustrations/mosque.webp'
import logo from '../assets/logo.svg'
import { useI18n } from '../i18n/useI18n.js'
import { navItems } from '../navigation.js'

const legalLinks = [
  { path: '/privacy', label: 'legal.privacy' },
  { path: '/terms', label: 'legal.terms' },
  { path: '/parental-consent', label: 'legal.consent' },
  { path: '/review', label: 'Content review' },
]

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="mt-auto border-t border-noor-sky-soft bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-12" />
            <p className="font-display text-2xl font-semibold">Little Noor</p>
          </div>
          <p className="mt-3 max-w-md text-base font-semibold leading-relaxed text-noor-muted">
            Fun, gentle lessons that help children learn, listen, and grow.
          </p>
          <img
            src={mosque}
            alt=""
            className="mt-4 h-24 w-auto object-contain"
          />
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className="rounded-2xl px-3 py-2 text-sm font-extrabold text-noor-muted hover:bg-noor-sky-soft hover:text-noor-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-6">
        <nav aria-label={t('legal.privacy')} className="flex flex-wrap gap-x-4 gap-y-2">
          {legalLinks.map((item) => (
            <NavLink key={item.path} to={item.path} className="text-sm font-extrabold text-noor-ink underline">
              {t(item.label)}
            </NavLink>
          ))}
        </nav>
        <p className="text-sm font-extrabold leading-relaxed text-noor-muted">{t('legal.supervision')}</p>
        <p className="text-center text-sm font-bold text-noor-muted">
          Made with care for little learners.
        </p>
      </div>
    </footer>
  )
}
