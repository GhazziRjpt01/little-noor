export default function TypingIndicator({ label }) {
  return (
    <p role="status" aria-label={label} className="flex items-center gap-3">
      <span aria-hidden="true" className="inline-flex items-center gap-1 rounded-full bg-noor-mint-soft px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="h-2.5 w-2.5 rounded-full bg-noor-sky-deep motion-safe:animate-bounce"
            style={{ animationDelay: `${dot * 120}ms` }}
          />
        ))}
      </span>
    </p>
  )
}
