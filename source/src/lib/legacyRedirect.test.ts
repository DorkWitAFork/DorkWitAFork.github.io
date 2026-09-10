// @vitest-environment node
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'
import { describe, expect, it } from 'vitest'
import { routeFromHash } from './router'

const html = readFileSync(new URL('../../../csc138/index.html', import.meta.url), 'utf8')
const script = html.match(/<script>([\s\S]*?)<\/script>/)![1]

describe('published CSC 138 redirect', () => {
  const views = ['dashboard', 'roadmap', 'chapter1', 'chapter2', 'practice', 'reference']
  for (const view of views) {
    it.each([`#/${view}`, `#${view}`, `#/${view}/detail`, `#/student/csc138/${view}`])('preserves %s', hash => {
      let destination = ''
      runInNewContext(script, { window: { location: { hash, search: '?from=bookmark', replace: (url: string) => { destination = url } } } })
      expect(destination).toBe(`/?from=bookmark#/student/csc138/${view}`)
      expect(routeFromHash(new URL(destination, 'https://example.com').hash)).toEqual({ section: 'course', course: 'csc138', view })
    })
  }

  it.each(['practice', 'reference'])('preserves Chapter 2 context for %s', view => {
    let destination = ''
    const hash = `#/student/csc138/${view}/chapter2`
    runInNewContext(script, { window: { location: { hash, search: '', replace: (url: string) => { destination = url } } } })
    expect(destination).toBe(`/#/student/csc138/${view}/chapter2`)
    expect(routeFromHash(new URL(destination, 'https://example.com').hash)).toEqual({ section: 'course', course: 'csc138', view, chapter: 'chapter2' })
  })

  it.each(['', '#/', '#/unknown'])('defaults %s to dashboard', hash => {
    let destination = ''
    runInNewContext(script, { window: { location: { hash, search: '', replace: (url: string) => { destination = url } } } })
    expect(destination).toBe('/#/student/csc138/dashboard')
  })
})
