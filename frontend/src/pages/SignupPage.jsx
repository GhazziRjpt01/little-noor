import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import Button from '../components/Button.jsx'
import Loading from '../components/Loading.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { AuthScreen, Field } from './LoginPage.jsx'

export default function SignupPage() {
  const { t } = useI18n()
  const { status, session, client, signUp } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)

  if (status === 'loading') return <Loading label={t('auth.working')} />
  if (session?.access_token) return <Navigate to="/parent" replace />

  async function onSubmit(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    setPending(true)
    try {
      const result = await signUp({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        consent,
      })
      if (result.error) {
        const key = result.error === 'unconfigured'
          ? 'auth.unavailable'
          : result.error === 'consent'
            ? 'auth.consentRequired'
            : 'auth.rejected'
        setError(t(key))
        return
      }
      if (!result.session) setNotice(t('auth.confirm'))
    } catch {
      setError(t('auth.rejected'))
    } finally {
      setPending(false)
    }
  }

  return (
    <AuthScreen title={t('auth.signupTitle')} intro={t('auth.parentOnly')}>
      {client ? (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Field label={t('auth.displayName')} id="parent-name" type="text" autoComplete="name" value={displayName} onChange={setDisplayName} />
          <Field label={t('auth.email')} id="signup-email" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <Field label={t('auth.password')} id="signup-password" type="password" autoComplete="new-password" value={password} onChange={setPassword} />
          <div className="flex items-start gap-3 rounded-3xl bg-noor-peach px-4 py-3">
            <input
              id="parent-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="mt-1 h-6 w-6 shrink-0 accent-noor-mint-deep"
            />
            <div className="text-base font-extrabold leading-relaxed text-noor-ink">
              <label htmlFor="parent-consent">{t('auth.consentLabel')}</label>
              {' '}
              <Link to="/parental-consent" className="underline">{t('legal.consent')}</Link>
              {' · '}
              <Link to="/privacy" className="underline">{t('legal.privacy')}</Link>
            </div>
          </div>
          {error ? <p role="alert" className="font-extrabold text-noor-ink">{error}</p> : null}
          {notice ? <p role="status" className="font-extrabold text-noor-ink">{notice}</p> : null}
          <Button type="submit" variant="sun" className="min-h-14" disabled={pending || !consent || displayName.trim().length < 1 || !email.trim() || password.length < 8}>
            {pending ? t('auth.working') : t('auth.signup')}
          </Button>
        </form>
      ) : (
        <p role="status" className="font-extrabold">{t('auth.unavailable')}</p>
      )}
      <p className="font-extrabold text-noor-muted">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="text-noor-ink underline">
          {t('auth.login')}
        </Link>
      </p>
    </AuthScreen>
  )
}
