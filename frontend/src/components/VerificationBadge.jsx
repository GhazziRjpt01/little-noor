export default function VerificationBadge({ verified = false }) {
  if (verified === true) {
    return null
  }

  return (
    <p className="inline-flex items-center rounded-full border border-noor-sun-deep bg-noor-sun px-3 py-1 text-sm font-extrabold text-noor-ink">
      Demo content - not yet verified
    </p>
  )
}
