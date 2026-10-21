import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { useAuth } from './useAuth.js'

export default function RequireAuth() {
  const { status, session } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <Loading />
  if (!session?.access_token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
