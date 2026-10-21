import { useEffect } from 'react'
import { queueAccountSync, readSelectedChild } from '../services/dashboardService.js'
import { useAuth } from './useAuth.js'

export default function ProgressSync() {
  const { session } = useAuth()
  const token = session?.access_token
  const parentId = session?.user?.id

  useEffect(() => {
    if (!token || !parentId) return undefined

    const sync = () => {
      const childId = readSelectedChild(parentId)
      if (!childId) return
      queueAccountSync(token, childId)
    }

    sync()
    window.addEventListener('little-noor-rewards', sync)
    window.addEventListener('little-noor-progress', sync)
    return () => {
      window.removeEventListener('little-noor-rewards', sync)
      window.removeEventListener('little-noor-progress', sync)
    }
  }, [token, parentId])

  return null
}
