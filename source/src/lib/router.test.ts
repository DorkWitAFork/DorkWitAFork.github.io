import { describe, expect, it } from 'vitest'
import { normalizeRoute, routeFromHash } from './router'

describe('site routing', () => {
  it('routes the portfolio and student desk from the site root', () => {
    expect(routeFromHash('#/')).toEqual({ section: 'home' })
    expect(routeFromHash('#/student')).toEqual({ section: 'student' })
  })

  it('retires the old audience pages into selected work', () => {
    expect(normalizeRoute('#/professor')).toBe('#work')
    expect(normalizeRoute('#/recruiter')).toBe('#work')
    expect(routeFromHash('#/professor')).toEqual({ section: 'home' })
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
