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
})
