import { describe, expect, it } from 'vitest'
import { calculateDelayMs, emptyProgress, loadProgress, saveProgress, STORAGE_KEY } from './progress'

function memoryStorage(initial?: string) {
  const values = new Map<string, string>()
  if (initial) values.set(STORAGE_KEY, initial)
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('calculateDelayMs', () => {
  it('converts bits and megabits per second to milliseconds', () => {
    expect(calculateDelayMs(10_000, 100)).toBeCloseTo(0.1)
    expect(calculateDelayMs(12_000, 6)).toBeCloseTo(2)
  })

  it('rejects non-positive inputs', () => {
    expect(calculateDelayMs(0, 100)).toBe(0)
    expect(calculateDelayMs(1000, -1)).toBe(0)
  })
})

describe('progress storage', () => {
  it('returns empty progress for missing or malformed data', () => {
    expect(loadProgress(memoryStorage())).toEqual(emptyProgress)
    expect(loadProgress(memoryStorage('{broken'))).toEqual(emptyProgress)
  })

  it('round-trips valid progress', () => {
    const storage = memoryStorage()
    const progress = { ...emptyProgress, completedLessons: ['protocols'], bestQuizScore: 8 }
    saveProgress(progress, storage)
    expect(loadProgress(storage)).toEqual(progress)
  })

  it('ignores data from an unknown schema version', () => {
    expect(loadProgress(memoryStorage(JSON.stringify({ version: 2, completedLessons: ['old'] })))).toEqual(emptyProgress)
  })
})
