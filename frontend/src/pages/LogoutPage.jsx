import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth.js'
import Loading from '../components/Loading.jsx'
import { useI18n } from '../i18n/useI18n.js'
import { AuthScreen } from './LoginPage.jsx'

export default function LogoutPage() {
  const { t } = useI18n()
  const { signOut } = useAuth()
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    signOut().finally(() => {
      if (active) setDone(true)
    })
    return () => {
      active = false
    }
  }, [signOut])

  if (!done) return <Loading label={t('auth.working')} />

  return (
    <AuthScreen title={t('auth.logoutTitle')}>
      <p role="status" className="text-lg font-extrabold">{t('auth.signedOut')}</p>
      <Link to="/" className="font-extrabold text-noor-ink underline">
        {t('auth.home')}
      </Link>
    </AuthScreen>
  )
}
