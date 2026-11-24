import { Suspense, useEffect, useState } from 'react'
import { lazyCourseView } from './components/lazyCourseView'
import { HiringPortfolio, PortfolioHome, StudentLibrary, TeacherPage } from './components/SitePages'
import { normalizeRoute, routeFromHash } from './lib/router'

const NetworkCourse = lazyCourseView(() => import('./components/Csc138App'))
const OsCourse = lazyCourseView(() => import('./components/OsApp'))

export default function App() {
  const [route, setRoute] = useState(() => routeFromHash(window.location.hash))

  useEffect(() => {
    const normalized = normalizeRoute(window.location.hash)
    if (normalized !== window.location.hash) window.history.replaceState(null, '', normalized)
    const update = () => setRoute(routeFromHash(window.location.hash))
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  useEffect(() => {
    const title = route.section === 'course'
      ? `${route.course === 'csc139' ? 'CSC 139 OS Lab' : 'CSC 138 Network Lab'} | Spencer Le Bleu`
      : `${route.section === 'home' ? 'Spencer Le Bleu' : route.section === 'student' ? 'Student Desk | Spencer Le Bleu' : route.section === 'teacher' ? 'Academic Work | Spencer Le Bleu' : 'Selected Projects | Spencer Le Bleu'}`
    document.title = title
  }, [route])

  if (route.section === 'course') return <Suspense fallback={<p role="status">Loading course…</p>}>
    {route.course === 'csc138' ? <NetworkCourse route={route} /> : <OsCourse route={route} />}
  </Suspense>
  if (route.section === 'student') return <StudentLibrary />
  if (route.section === 'teacher') return <TeacherPage />
  if (route.section === 'hiring') return <HiringPortfolio />
  return <PortfolioHome />
}
