import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.svg'
import { navItems } from '../navigation.js'

export default function Footer() {
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
      <p className="px-4 pb-6 text-center text-sm font-bold text-noor-muted">
        Made with care for little learners.
      </p>
    </footer>
  )
}
