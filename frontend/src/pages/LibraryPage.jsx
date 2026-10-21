import ActivityArt from '../components/ActivityArt.jsx'
import VerificationBadge from '../components/VerificationBadge.jsx'
import book from '../assets/illustrations/kalimas-book.webp'

export default function LibraryPage({ title, intro, items, artAlt = 'An open storybook with a little mosque' }) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-lg font-semibold text-noor-muted">{intro}</p>
        </div>
        <ActivityArt src={book} alt={artAlt} />
      </header>
      <ul className="grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-3xl border border-white bg-noor-card p-5 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{item.title}</h2>
              <VerificationBadge verified={item.verified} />
            </div>
            <p className="mt-2 text-sm font-extrabold text-noor-muted">
              Review status: {item.reviewStatus}
              {item.ageMin ? ` · Ages ${item.ageMin}–${item.ageMax}` : ''}
              {item.rewardPoints ? ` · ${item.rewardPoints} learning stars` : ''}
            </p>
            <p className="mt-3 font-semibold leading-relaxed">{item.translations?.en || item.bodyEn || item.instructions}</p>
            {item.lessonLearned ? (
              <p className="mt-3 font-extrabold text-noor-ink">Lesson: {item.lessonLearned}</p>
            ) : null}
            {item.arabic ? (
              <p lang="ar" dir="rtl" className="mt-4 font-arabic text-2xl leading-loose">{item.arabic}</p>
            ) : null}
            <p className="mt-4 text-sm font-semibold leading-relaxed text-noor-muted">{item.source}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
