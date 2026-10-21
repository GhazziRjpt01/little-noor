export default function ActivityArt({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-28 w-28 shrink-0 rounded-3xl bg-noor-cream object-contain p-1 shadow-soft sm:h-32 sm:w-32"
    />
  )
}
