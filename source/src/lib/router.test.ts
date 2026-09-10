import { describe, expect, it } from 'vitest'
import { normalizeRoute, routeFromHash } from './router'

describe('site routing', () => {
  it('routes the portfolio and student desk from the site root', () => {
    expect(routeFromHash('#/')).toEqual({ section: 'home' })
    expect(routeFromHash('#/student')).toEqual({ section: 'student' })
    expect(routeFromHash('#/teacher')).toEqual({ section: 'teacher' })
    expect(routeFromHash('#/hiring')).toEqual({ section: 'hiring' })
  })

  it('maps old audience names to their replacement sections', () => {
    expect(normalizeRoute('#/professor')).toBe('#/teacher')
    expect(normalizeRoute('#/recruiter')).toBe('#/hiring')
  })

  it('parses course and view segments', () => {
    expect(routeFromHash('#/student/csc139/practice')).toEqual({ section: 'course', course: 'csc139', view: 'practice' })
    expect(routeFromHash('#/student/csc138/chapter1')).toEqual({ section: 'course', course: 'csc138', view: 'chapter1' })
    expect(routeFromHash('#/student/csc138/chapter2')).toEqual({ section: 'course', course: 'csc138', view: 'chapter2' })
    expect(routeFromHash('#/student/csc138/practice/chapter2')).toEqual({ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' })
    expect(routeFromHash('#/student/csc138/reference/chapter2')).toEqual({ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter2' })
    expect(routeFromHash('#/student/csc139/chapter2')).toEqual({ section: 'course', course: 'csc139', view: 'chapter2' })
    expect(routeFromHash('#/student/csc139/practice/chapter2')).toEqual({ section: 'course', course: 'csc139', view: 'practice', chapter: 'chapter2' })
    expect(routeFromHash('#/student/csc139/reference/chapter2')).toEqual({ section: 'course', course: 'csc139', view: 'reference', chapter: 'chapter2' })
  })

  it('defaults unknown course views to the dashboard', () => {
    expect(routeFromHash('#/student/csc139/not-a-view')).toEqual({ section: 'course', course: 'csc139', view: 'dashboard' })
    expect(routeFromHash('#/student/csc139/practice/not-a-chapter')).toEqual({ section: 'course', course: 'csc139', view: 'practice' })
    expect(routeFromHash('#/student/csc138/practice/not-a-chapter')).toEqual({ section: 'course', course: 'csc138', view: 'practice' })
  })

  it('migrates legacy CSC 138 hashes', () => {
    expect(normalizeRoute('#/dashboard')).toBe('#/student/csc138/dashboard')
    expect(normalizeRoute('#/reference')).toBe('#/student/csc138/reference')
    expect(normalizeRoute('#/chapter2')).toBe('#/student/csc138/chapter2')
  })
})
