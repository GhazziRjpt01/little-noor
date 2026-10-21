import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import Loading from '../components/Loading.jsx'
import { useI18n } from '../i18n/useI18n.js'

export default function LoginPage() {
  const { t } = useI18n()
  const { status, session, client, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const destination = safePath(location.state?.from)

  if (status === 'loading') return <Loading label={t('auth.working')} />
  if (session?.access_token) return <Navigate to={destination} replace />

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setPending(true)
    try {
      const result = await signIn(email.trim(), password)
      if (result.error) {
        setError(t(result.error === 'unconfigured' ? 'auth.unavailable' : 'auth.rejected'))
        return
      }
      navigate(destination, { replace: true })
    } catch {
      setError(t('auth.rejected'))
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthScreen title={t('auth.loginTitle')} intro={t('auth.parentOnly')}>
      {client ? (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Field label={t('auth.email')} id="parent-email" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <Field label={t('auth.password')} id="parent-password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
          {error ? <p role="alert" className="font-extrabold text-noor-ink">{error}</p> : null}
          <Button type="submit" variant="sun" className="min-h-14" disabled={pending || !email.trim() || password.length < 8}>
            {pending ? t('auth.working') : t('auth.login')}
          </Button>
        </form>
      ) : (
        <p role="status" className="font-extrabold">{t('auth.unavailable')}</p>
      )}
      <p className="font-extrabold text-noor-muted">
        {t('auth.needAccount')}{' '}
        <Link to="/signup" className="text-noor-ink underline">
          {t('auth.signup')}
        </Link>
      </p>
    </AuthScreen>
  )
}

export function AuthScreen({ title, intro, children }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8 sm:py-12">
      <header>
        <h1 className="text-4xl font-semibold">{title}</h1>
        {intro ? <p className="mt-3 text-lg font-semibold text-noor-muted">{intro}</p> : null}
      </header>
      <Card accent="sky" className="flex flex-col gap-4">
        {children}
      </Card>
    </div>
  )
}

export function Field({ label, id, type, value, onChange, autoComplete }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-extrabold text-noor-muted" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        required
        onChange={(event) => onChange(event.target.value)}
        className="min-h-14 w-full rounded-full border border-noor-sky bg-white px-5 text-base font-semibold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep"
      />
    </label>
  )
}

function safePath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/parent'
  return value
}
