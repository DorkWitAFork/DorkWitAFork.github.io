import { describe, expect, it } from 'vitest'
import { normalizeRoute, routeFromHash } from './router'

describe('site routing', () => {
  it('routes each audience from the site root', () => {
    expect(routeFromHash('#/')).toEqual({ section: 'home' })
    expect(routeFromHash('#/student')).toEqual({ section: 'student' })
    expect(routeFromHash('#/professor')).toEqual({ section: 'professor' })
    expect(routeFromHash('#/recruiter')).toEqual({ section: 'recruiter' })
  })

  it('parses course and view segments', () => {
    expect(routeFromHash('#/student/csc139/practice')).toEqual({ section: 'course', course: 'csc139', view: 'practice' })
    expect(routeFromHash('#/student/csc138/chapter1')).toEqual({ section: 'course', course: 'csc138', view: 'chapter1' })
  })

  it('defaults unknown course views to the dashboard', () => {
    expect(routeFromHash('#/student/csc139/not-a-view')).toEqual({ section: 'course', course: 'csc139', view: 'dashboard' })
  })

  it('migrates legacy CSC 138 hashes', () => {
    expect(normalizeRoute('#/dashboard')).toBe('#/student/csc138/dashboard')
    expect(normalizeRoute('#/reference')).toBe('#/student/csc138/reference')
  })
})
