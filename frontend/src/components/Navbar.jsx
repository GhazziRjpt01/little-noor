import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import avatar from '../assets/noor-avatar.jpg'
import logo from '../assets/logo.svg'
import { navItems } from '../navigation.js'
import LanguageSelector from './LanguageSelector.jsx'

function linkClass(isActive, mobile) {
  const layout = mobile
    ? 'flex items-center gap-3 rounded-2xl px-4 py-3 text-base'
    : 'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm'

  const state = isActive
    ? 'bg-noor-sky text-noor-ink shadow-soft'
    : 'text-noor-muted hover:bg-noor-sky-soft hover:text-noor-ink'

  return `${layout} font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep ${state}`
}

function NavItems({ mobile = false, onNavigate }) {
  return navItems.map((item) => {
    const Icon = item.icon

    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) => linkClass(isActive, mobile)}
        onClick={onNavigate}
      >
        <Icon size={mobile ? 20 : 16} aria-hidden="true" />
        {item.label}
      </NavLink>
    )
  })
}

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(location.pathname)

  if (menuPath !== location.pathname) {
    setMenuPath(location.pathname)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-noor-sky-soft bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep">
            <img src={logo} alt="" className="h-12 w-12" />
            <span>
              <span className="block font-display text-xl font-semibold leading-none">
                Little Noor
              </span>
              <span className="mt-1 hidden text-xs font-bold text-noor-muted sm:block">
                Learn with a smile
              </span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <img
              src={avatar}
              alt="Noor's avatar"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-noor-sun"
            />
            <button
              type="button"
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-noor-sky-soft text-noor-ink xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((current) => !current)}
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>

        <nav className="mt-3 hidden flex-wrap items-center justify-center gap-1 xl:flex" aria-label="Primary">
          <NavItems />
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="overflow-hidden xl:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 pb-4">
              <NavItems mobile onNavigate={() => setOpen(false)} />
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
