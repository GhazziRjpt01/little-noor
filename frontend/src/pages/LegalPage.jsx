import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/useI18n.js'
import { legalCopy } from '../i18n/legalCopy.js'

const links = [
  { kind: 'privacy', path: '/privacy' },
  { kind: 'terms', path: '/terms' },
  { kind: 'consent', path: '/parental-consent' },
]

export default function LegalPage({ kind }) {
  const { languageId } = useI18n()
  const copy = legalCopy[languageId] ?? legalCopy.en
  const page = copy[kind]

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:py-12">
      <p className="rounded-3xl border-2 border-dashed border-noor-ink/30 bg-noor-peach px-5 py-4 text-base font-extrabold leading-relaxed text-noor-ink">
        {copy.draft}
      </p>
      <header>
        <h1 className="text-4xl font-semibold sm:text-5xl">{page.title}</h1>
        <p className="mt-4 text-lg font-semibold leading-relaxed text-noor-ink">{copy.supervision}</p>
      </header>
      {page.sections.map((section) => (
        <section key={section.title} className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft sm:p-6">
          <h2 className="text-2xl font-semibold">{section.title}</h2>
          <p className="mt-3 text-base font-semibold leading-relaxed text-noor-ink">{section.body}</p>
        </section>
      ))}
      <nav aria-label={page.title} className="flex flex-wrap gap-3">
        {links.filter((item) => item.kind !== kind).map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="inline-flex min-h-12 items-center rounded-full bg-noor-sky-soft px-4 text-base font-extrabold text-noor-ink shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noor-sky-deep"
          >
            {copy[item.kind].title}
          </Link>
        ))}
      </nav>
    </article>
  )
}
