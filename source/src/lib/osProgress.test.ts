import { describe, expect, it } from 'vitest'
import { emptyOsProgress, loadOsProgress, OS_STORAGE_KEY, saveOsProgress } from './osProgress'

function memoryStorage(initial?: string) {
  const values = new Map<string, string>()
  if (initial) values.set(OS_STORAGE_KEY, initial)
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('CSC 139 progress storage', () => {
  it('uses an independent course key', () => {
    expect(OS_STORAGE_KEY).toBe('csc139-progress-v1')
  })

  it('returns empty progress for invalid data', () => {
    expect(loadOsProgress(memoryStorage())).toEqual(emptyOsProgress)
    expect(loadOsProgress(memoryStorage('{invalid'))).toEqual(emptyOsProgress)
  })

  it('round-trips valid progress', () => {
    const storage = memoryStorage()
    const progress = { ...emptyOsProgress, completedLessons: ['os-role'], completedActivities: ['events'], bestQuizScore: 9 }
    saveOsProgress(progress, storage)
    expect(loadOsProgress(storage)).toEqual(progress)
  })

  it('migrates legacy quiz progress into Chapter 1', () => {
    const legacy = JSON.stringify({ version: 1, completedLessons: ['os-role'], completedActivities: [], quizAttempts: 2, bestQuizScore: 8, lastVisited: 'chapter1' })
    const progress = loadOsProgress(memoryStorage(legacy))
    expect(progress.chapterQuizzes.chapter1).toEqual({ attempts: 2, bestScore: 8, total: 10 })
    expect(progress.chapterQuizzes.chapter2).toEqual({ attempts: 0, bestScore: 0, total: 12 })
  })

  it('sanitizes malformed arrays and chapter quiz values', () => {
    const malformed = JSON.stringify({ version: 1, completedLessons: ['os-role', 12], completedActivities: [null, 'events'], quizAttempts: -1, bestQuizScore: 0, chapterQuizzes: { chapter2: { attempts: 'many', bestScore: 7, total: 12 } } })
    const progress = loadOsProgress(memoryStorage(malformed))
    expect(progress.completedLessons).toEqual(['os-role'])
    expect(progress.completedActivities).toEqual(['events'])
    expect(progress.chapterQuizzes.chapter2).toEqual({ attempts: 0, bestScore: 7, total: 12 })
  })
})
