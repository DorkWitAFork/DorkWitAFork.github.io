import { lazy, type ComponentType } from 'react'

function CourseLoadError() {
  return <section><p role="alert">Could not load this course page.</p><button onClick={() => window.location.reload()}>Reload the page</button> <a href="#/student">Return to the student desk</a></section>
}

// An open tab can refer to a chunk from a previous Pages deployment.
export function lazyCourseView<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  return lazy(() => load().catch(() => ({ default: CourseLoadError })))
}
