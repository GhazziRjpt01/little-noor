import teacher from '../../assets/illustrations/teacher-girl.webp'

const frames = {
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
}

export default function TeacherAvatar({ label, size = 'md' }) {
  return (
    <img
      src={teacher}
      alt={label}
      className={`shrink-0 rounded-full bg-noor-cream object-cover object-top ring-4 ring-noor-sun shadow-soft ${frames[size] ?? frames.md}`}
    />
  )
}
