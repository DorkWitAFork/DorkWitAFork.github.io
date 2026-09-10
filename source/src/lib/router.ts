import type { Csc138ChapterId, Csc138View, Csc139ChapterId, Csc139View, View } from '../types'

export type SiteRoute =
  | { section: 'home' }
  | { section: 'student' }
  | { section: 'teacher' }
  | { section: 'hiring' }
  | { section: 'course'; course: 'csc138'; view: Csc138View; chapter?: Csc138ChapterId }
  | { section: 'course'; course: 'csc139'; view: Csc139View; chapter?: Csc139ChapterId }

const courseViews: View[] = ['dashboard', 'roadmap', 'chapter1', 'practice', 'reference']
const csc138Views: Csc138View[] = [...courseViews, 'chapter2']
const chapterIds: Csc138ChapterId[] = ['chapter1', 'chapter2']
const csc139Views: Csc139View[] = [...courseViews, 'chapter2']
const csc139ChapterIds: Csc139ChapterId[] = ['chapter1', 'chapter2']

export function normalizeRoute(hash: string) {
  const path = hash.replace(/^#\/?/, '')
  if (csc138Views.includes(path as Csc138View)) return `#/student/csc138/${path}`
  if (path === 'professor') return '#/teacher'
  if (path === 'recruiter') return '#/hiring'
  return hash || '#/'
}

export function routeFromHash(hash: string): SiteRoute {
  const normalized = normalizeRoute(hash).replace(/^#\/?/, '')
  const [section, course, requestedView, requestedChapter] = normalized.split('/')
  if (section === 'student' && course === 'csc138') {
    const view = csc138Views.includes(requestedView as Csc138View) ? requestedView as Csc138View : 'dashboard'
    const chapter = (view === 'practice' || view === 'reference') && chapterIds.includes(requestedChapter as Csc138ChapterId)
      ? requestedChapter as Csc138ChapterId
      : undefined
    return chapter ? { section: 'course', course, view, chapter } : { section: 'course', course, view }
  }
  if (section === 'student' && course === 'csc139') {
    const view = csc139Views.includes(requestedView as Csc139View) ? requestedView as Csc139View : 'dashboard'
    const chapter = (view === 'practice' || view === 'reference') && csc139ChapterIds.includes(requestedChapter as Csc139ChapterId)
      ? requestedChapter as Csc139ChapterId
      : undefined
    return chapter ? { section: 'course', course, view, chapter } : { section: 'course', course, view }
  }
  if (section === 'student' || section === 'teacher' || section === 'hiring') return { section }
  return { section: 'home' }
}
