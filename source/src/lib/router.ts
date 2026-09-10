import type { View } from '../types'

export type SiteRoute =
  | { section: 'home' }
  | { section: 'student' }
  | { section: 'course'; course: 'csc138' | 'csc139'; view: View }

const courseViews: View[] = ['dashboard', 'roadmap', 'chapter1', 'practice', 'reference']

export function normalizeRoute(hash: string) {
  const path = hash.replace(/^#\/?/, '')
  if (courseViews.includes(path as View)) return `#/student/csc138/${path}`
  if (path === 'professor' || path === 'recruiter') return '#work'
  return hash || '#/'
}

export function routeFromHash(hash: string): SiteRoute {
  const normalized = normalizeRoute(hash).replace(/^#\/?/, '')
  const [section, course, requestedView] = normalized.split('/')
  if (section === 'student' && (course === 'csc138' || course === 'csc139')) {
    const view = courseViews.includes(requestedView as View) ? requestedView as View : 'dashboard'
    return { section: 'course', course, view }
  }
  if (section === 'student') return { section }
  return { section: 'home' }
}
