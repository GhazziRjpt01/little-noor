import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-noor-sky-deep text-noor-ink hover:bg-noor-sky',
  mint: 'bg-noor-mint-deep text-noor-ink hover:bg-noor-mint',
  sun: 'bg-noor-sun-deep text-noor-ink hover:bg-noor-sun',
  ghost: 'bg-noor-card text-noor-ink hover:bg-noor-sky-soft',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  to,
  type = 'button',
  ...props
}) {
  const classes = [
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-extrabold shadow-soft transition duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant] ?? variants.primary,
    sizes[size] ?? sizes.md,
    className,
  ].join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
