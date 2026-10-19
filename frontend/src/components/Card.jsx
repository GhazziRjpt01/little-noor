const accents = {
  sky: 'bg-noor-sky',
  mint: 'bg-noor-mint',
  sun: 'bg-noor-sun',
  peach: 'bg-noor-peach',
}

const tones = {
  white: 'bg-noor-card',
  sky: 'bg-noor-sky',
  mint: 'bg-noor-mint',
  sun: 'bg-noor-sun',
  peach: 'bg-noor-peach',
  'mint-soft': 'bg-noor-mint-soft',
}

export default function Card({
  children,
  className = '',
  accent = 'sky',
  tone = 'white',
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-white p-6 shadow-soft ${tones[tone] ?? tones.white} ${className}`}
    >
      {accent ? (
        <span
          className={`absolute inset-x-0 top-0 h-2 ${accents[accent] ?? accents.sky}`}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </article>
  )
}
