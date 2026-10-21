import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Flame, Lock, Star } from 'lucide-react'
import { useAuth } from '../auth/useAuth.js'
import Card from '../components/Card.jsx'
import Loading from '../components/Loading.jsx'
import ProgressMeter from '../components/progress/ProgressMeter.jsx'
import WeeklyChart from '../components/progress/WeeklyChart.jsx'
import Button from '../components/Button.jsx'
import { useI18n } from '../i18n/useI18n.js'
import {
  addChild,
  clearSelectedChild,
  deleteChild,
  getChildProgress,
  getParentSettings,
  listChildren,
  queueAccountSync,
  readSelectedChild,
  saveParentSettings,
  saveSelectedChild,
  toDashboard,
} from '../services/dashboardService.js'

const ages = [3, 4, 5, 6, 7, 8, 9, 10]

export default function ParentDashboardPage() {
  const { t } = useI18n()
  const { session } = useAuth()
  const token = session?.access_token
  const parentId = session?.user?.id
  const [settings, setSettings] = useState(getParentSettings)
  const [children, setChildren] = useState([])
  const [childId, setChildId] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState(6)
  const [adding, setAdding] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!token || !parentId) return undefined
    let active = true

    async function loadChildren() {
      setStatus('loading')
      setError('')
      try {
        const list = await listChildren(token)
        if (!active) return
        setChildren(list)
        const stored = readSelectedChild(parentId)
        const nextId = list.some((child) => child.id === stored) ? stored : list[0]?.id ?? null
        setChildId(nextId)
        if (nextId) saveSelectedChild(parentId, nextId)
        setStatus('ready')
      } catch {
        if (!active) return
        setError(t('parent.loadError'))
        setStatus('error')
      }
    }

    loadChildren()
    return () => {
      active = false
    }
  }, [token, parentId, t, attempt])

  useEffect(() => {
    if (!token || !childId) return undefined
    let active = true

    async function loadProgress() {
      try {
        await queueAccountSync(token, childId)
        const payload = await getChildProgress(token, childId)
        if (!active) return
        const child = children.find((item) => item.id === childId)
        if (!child) return
        setDashboard(toDashboard(child, payload))
        setError('')
      } catch {
        if (!active) return
        setError(t('parent.loadError'))
      }
    }

    loadProgress()
    const refresh = () => loadProgress()
    window.addEventListener('little-noor-account-progress', refresh)
    return () => {
      active = false
      window.removeEventListener('little-noor-account-progress', refresh)
    }
  }, [token, childId, children, t])

  function updateSetting(key) {
    setSettings(saveParentSettings({ [key]: !settings[key] }))
  }

  function chooseChild(id) {
    setChildId(id)
    setConfirmDelete(false)
    saveSelectedChild(parentId, id)
  }

  async function onAddChild(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || trimmed.length > 40 || !ages.includes(age)) return
    setAdding(true)
    setError('')
    try {
      const child = await addChild(token, { name: trimmed, age })
      setChildren((current) => [...current, child])
      setChildId(child.id)
      saveSelectedChild(parentId, child.id)
      setName('')
    } catch {
      setError(t('parent.loadError'))
    } finally {
      setAdding(false)
    }
  }

  async function onDeleteChild() {
    if (!childId) return
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setDeleting(true)
    setError('')
    try {
      await deleteChild(token, childId)
      const remaining = children.filter((child) => child.id !== childId)
      setChildren(remaining)
      const nextId = remaining[0]?.id ?? null
      setChildId(nextId)
      setDashboard(null)
      setConfirmDelete(false)
      if (nextId) saveSelectedChild(parentId, nextId)
      else clearSelectedChild()
      setNotice(t('parent.deleted'))
    } catch {
      setError(t('parent.deleteError'))
    } finally {
      setDeleting(false)
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-lg font-extrabold">{t('parent.private')}</p>
      </div>
    )
  }

  if (status === 'loading') return <Loading label={t('auth.working')} />

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{t('parent.title')}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{t('parent.intro')}</p>
          <p className="mt-2 max-w-2xl text-sm font-extrabold text-noor-muted">{t('parent.accountNote')}</p>
        </div>
        <Link to="/logout" className="font-extrabold text-noor-ink underline">
          {t('auth.logout')}
        </Link>
      </header>

      {notice ? <p role="status" className="rounded-3xl bg-noor-mint-soft px-4 py-3 font-extrabold">{notice}</p> : null}
      {error ? (
        <p role="alert" className="rounded-3xl bg-noor-peach px-4 py-3 font-extrabold">
          {error}{' '}
          <button type="button" className="underline" onClick={() => setAttempt((current) => current + 1)}>
            {t('parent.retry')}
          </button>
        </p>
      ) : null}

      <Card accent="sky">
        <h2 className="text-2xl font-semibold">{t('parent.children')}</h2>
        {children.length === 0 ? (
          <p className="mt-3 font-semibold text-noor-muted">{t('parent.emptyChildren')}</p>
        ) : (
          <div role="radiogroup" aria-label={t('parent.selectChild')} className="mt-4 flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                role="radio"
                aria-checked={child.id === childId}
                className={`min-h-14 rounded-full px-4 text-left font-extrabold shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep ${child.id === childId ? 'bg-noor-mint' : 'bg-noor-sky-soft'}`}
                onClick={() => chooseChild(child.id)}
              >
                {child.name}
                <span className="ml-2 text-noor-muted">
                  {t('parent.age')} {child.age}
                </span>
              </button>
            ))}
          </div>
        )}
        <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={onAddChild}>
          <label className="flex min-w-0 flex-1 flex-col gap-2 text-sm font-extrabold text-noor-muted" htmlFor="child-name">
            {t('parent.childName')}
            <input
              id="child-name"
              value={name}
              maxLength={40}
              autoComplete="off"
              onChange={(event) => setName(event.target.value)}
              className="min-h-14 rounded-full border border-noor-sky bg-white px-5 text-base font-semibold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-extrabold text-noor-muted" htmlFor="child-age">
            {t('parent.age')}
            <select
              id="child-age"
              value={age}
              onChange={(event) => setAge(Number(event.target.value))}
              className="min-h-14 rounded-full border border-noor-sky bg-white px-4 font-extrabold text-noor-ink shadow-soft"
            >
              {ages.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="mint" className="min-h-14" disabled={adding || name.trim() === ''}>
            {t('parent.addChild')}
          </Button>
        </form>
      </Card>

      {dashboard?.child.id === childId ? <ProgressSummary dashboard={dashboard} settings={settings} t={t} /> : null}

      <section className="rounded-3xl border-2 border-dashed border-noor-ink/30 bg-noor-peach p-5 shadow-soft sm:p-6">
        <div className="flex items-center gap-3">
          <Lock aria-hidden="true" />
          <h2 className="text-2xl font-semibold">{t('parent.settings')}</h2>
        </div>
        <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('parent.settingsNote')}</p>
        <div className="mt-4 flex flex-col gap-3">
          <SettingSwitch label={t('parent.showActivity')} checked={settings.showActivity} onToggle={() => updateSetting('showActivity')} />
          <SettingSwitch label={t('parent.reminders')} checked={settings.practiceReminders} onToggle={() => updateSetting('practiceReminders')} />
          <SettingSwitch label={t('parent.showStars')} checked={settings.showStars} onToggle={() => updateSetting('showStars')} />
        </div>
        {childId ? (
          <div className="mt-6 border-t border-noor-ink/15 pt-4">
            <h3 className="text-xl font-semibold">{t('parent.deleteChild')}</h3>
            <p className="mt-2 font-semibold leading-relaxed text-noor-ink">{t('parent.deleteHint')}</p>
            <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('legal.supervision')}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="sun" className="min-h-14" disabled={deleting} onClick={onDeleteChild}>
                {confirmDelete ? t('parent.deleteConfirm') : t('parent.deleteChild')}
              </Button>
              {confirmDelete ? (
                <Button type="button" variant="ghost" className="min-h-14" disabled={deleting} onClick={() => setConfirmDelete(false)}>
                  {t('parent.deleteCancel')}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

function ProgressSummary({ dashboard, settings, t }) {
  return (
    <>
      <Card accent="mint">
        <h2 className="text-3xl font-semibold">{dashboard.child.name}</h2>
        <p className="mt-1 font-extrabold text-noor-muted">
          {t('parent.age')} {dashboard.child.age}
        </p>
        {dashboard.saved ? null : <p className="mt-3 font-extrabold">{t('parent.notSaved')}</p>}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card accent="sky">
          <ProgressMeter label={t('parent.lessons')} value={dashboard.lessons.completed} max={dashboard.lessons.total} tone="sky" />
        </Card>
        <Card accent="mint">
          <ProgressMeter label={t('parent.kalimas')} value={dashboard.kalimas.learned} max={dashboard.kalimas.total} tone="mint" />
        </Card>
        <Card accent="sun">
          <ProgressMeter label={t('parent.azkar')} value={dashboard.azkar.completed} max={dashboard.azkar.total} tone="sun" />
        </Card>
        <Card accent="peach">
          <ProgressMeter label={t('parent.quiz')} value={dashboard.quiz.correct} max={dashboard.quiz.total} tone="peach" />
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card accent="sun" tone="sun">
          <div className="flex items-center gap-3">
            <Flame aria-hidden="true" />
            <h2 className="text-2xl font-semibold">{t('parent.streak')}</h2>
          </div>
          <p className="mt-3 font-display text-4xl font-semibold">
            {dashboard.streak} {t('parent.days')}
          </p>
        </Card>
        <Card accent="mint">
          <div className="flex items-center gap-3">
            <Star aria-hidden="true" className="fill-noor-sun-deep text-noor-ink" />
            <h2 className="text-2xl font-semibold">{t('parent.stars')}</h2>
          </div>
          <p className="mt-3 font-display text-4xl font-semibold">
            {settings.showStars ? dashboard.stars : '—'}
          </p>
        </Card>
      </div>

      <Card accent="sky">
        <h2 className="text-2xl font-semibold">{t('parent.week')}</h2>
        <p className="mt-2 text-sm font-extrabold text-noor-muted">{t('parent.weekEmpty')}</p>
        <div className="mt-5">
          <WeeklyChart days={dashboard.week} label={t('parent.week')} dayLabel={(id) => t(`parent.${id}`)} />
        </div>
      </Card>

      <Card accent="mint">
        <h2 className="text-2xl font-semibold">{t('parent.activity')}</h2>
        {settings.showActivity ? (
          dashboard.activity.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {dashboard.activity.map((item) => (
                <li key={item.id} className="rounded-2xl bg-noor-sky-soft px-4 py-3 font-extrabold">{item.title}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 font-semibold text-noor-muted">{t('parent.activityEmpty')}</p>
          )
        ) : (
          <p className="mt-4 font-semibold text-noor-muted">{t('parent.activityHidden')}</p>
        )}
      </Card>
    </>
  )
}

function SettingSwitch({ label, checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="flex min-h-14 items-center justify-between gap-4 rounded-2xl bg-white px-4 text-left text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-ink"
      onClick={onToggle}
    >
      <span>{label}</span>
      <span className={`inline-flex h-8 w-14 items-center rounded-full p-1 ${checked ? 'bg-noor-mint-deep' : 'bg-noor-sky'}`}>
        <span className={`h-6 w-6 rounded-full bg-white ${checked ? 'ml-auto' : ''}`} />
      </span>
    </button>
  )
}
