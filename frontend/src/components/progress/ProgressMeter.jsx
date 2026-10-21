const fills = {
  sky: 'bg-noor-sky-deep',
  mint: 'bg-noor-mint-deep',
  sun: 'bg-noor-sun-deep',
  peach: 'bg-noor-peach',
}

export default function ProgressMeter({ label, value, max, tone = 'mint' }) {
  const safeMax = max > 0 ? max : 0
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  const percent = safeMax === 0 ? 0 : Math.round((safeValue / safeMax) * 100)

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm font-extrabold">
        <span>{label}</span>
        <span>
          {safeValue} / {safeMax}
        </span>
      </div>
      <div
        className="mt-2 h-4 overflow-hidden rounded-full bg-noor-sky-soft"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={safeValue}
      >
        <div className={`h-full rounded-full ${fills[tone] ?? fills.mint}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
