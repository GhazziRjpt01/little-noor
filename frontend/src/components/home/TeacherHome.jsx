import teacher from '../../assets/illustrations/teacher-girl.webp'
import Button from '../Button.jsx'
import Card from '../Card.jsx'

export default function TeacherHome() {
  return (
    <Card accent="sky" className="flex h-full flex-col sm:p-8">
      <div className="flex items-start gap-4">
        <img
          src={teacher}
          alt="Little Noor Teacher holding a book"
          className="h-36 w-28 shrink-0 object-contain sm:h-44 sm:w-36"
        />
        <div>
          <p className="text-sm font-extrabold text-noor-muted">Ask together</p>
          <h2 className="mt-1 text-3xl font-semibold">AI Teacher</h2>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-noor-muted">
            A friendly teacher for little questions. A grown-up stays nearby.
          </p>
        </div>
      </div>
      <p className="mt-4 text-base font-extrabold text-noor-ink">
        If you are unsure, ask your parents or teacher.
      </p>
      <div className="mt-6">
        <Button to="/ai-teacher" variant="primary" className="min-h-14">
          Meet the teacher
        </Button>
      </div>
    </Card>
  )
}
