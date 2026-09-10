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
  it('keeps the original storage key', () => {
    expect(STORAGE_KEY).toBe('csc138-progress-v1')
  })

  it('returns empty progress for missing or malformed data', () => {
    expect(loadProgress(memoryStorage())).toEqual(emptyProgress)
    expect(loadProgress(memoryStorage('{broken'))).toEqual(emptyProgress)
  })

  it('round-trips valid progress', () => {
    const storage = memoryStorage()
    const progress = {
      ...emptyProgress,
      completedLessons: ['protocols', 'ch2-http-connections'],
      completedActivities: ['delay', 'ch2-cache-calculator'],
      chapterQuizzes: {
        chapter1: { attempts: 1, bestScore: 8, total: 10 },
        chapter2: { attempts: 2, bestScore: 9, total: 10 },
      },
    }
    saveProgress(progress, storage)
    expect(loadProgress(storage)).toEqual(progress)
  })

  it('migrates legacy quiz fields into Chapter 1', () => {
    const oldProgress = JSON.stringify({
      version: 1,
      completedLessons: ['protocols'],
      completedActivities: ['delay'],
      quizAttempts: 3,
      bestQuizScore: 8,
      lastVisited: 'practice',
    })
    const loaded = loadProgress(memoryStorage(oldProgress))
    expect(loaded.chapterQuizzes.chapter1).toEqual({ attempts: 3, bestScore: 8, total: 10 })
    expect(loaded.chapterQuizzes.chapter2).toEqual({ attempts: 0, bestScore: 0, total: 10 })
    expect(loaded.completedLessons).toEqual(['protocols'])
  })

  it('sanitizes invalid IDs and nested quiz values', () => {
    const stored = JSON.stringify({
      version: 1,
      completedLessons: ['protocols', 12, null],
      completedActivities: ['delay', false],
      quizAttempts: 1,
      bestQuizScore: 4,
      chapterQuizzes: {
        chapter1: { attempts: -1, bestScore: 'high', total: 10 },
        chapter2: { attempts: 2, bestScore: 7, total: 10 },
      },
    })
    const loaded = loadProgress(memoryStorage(stored))
    expect(loaded.completedLessons).toEqual(['protocols'])
    expect(loaded.completedActivities).toEqual(['delay'])
    expect(loaded.chapterQuizzes.chapter1).toEqual({ attempts: 1, bestScore: 4, total: 10 })
    expect(loaded.chapterQuizzes.chapter2).toEqual({ attempts: 2, bestScore: 7, total: 10 })
  })

  it('ignores data from an unknown schema version', () => {
    expect(loadProgress(memoryStorage(JSON.stringify({ version: 2, completedLessons: ['old'] })))).toEqual(emptyProgress)
  })
})
