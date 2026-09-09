import type { Progress } from '../types'

export const STORAGE_KEY = 'csc138-progress-v1'

export const emptyProgress: Progress = {
  version: 1,
  completedLessons: [],
  completedActivities: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  lastVisited: 'dashboard',
}

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): Progress {
  try {
    const value = storage.getItem(STORAGE_KEY)
    if (!value) return emptyProgress
    const parsed = JSON.parse(value) as Partial<Progress>
    if (parsed.version !== 1) return emptyProgress
    return {
      ...emptyProgress,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities : [],
    }
  } catch {
    return emptyProgress
  }
}

export function saveProgress(progress: Progress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function calculateDelayMs(bits: number, rateMbps: number) {
  if (!Number.isFinite(bits) || !Number.isFinite(rateMbps) || bits <= 0 || rateMbps <= 0) return 0
  return (bits / (rateMbps * 1_000_000)) * 1_000
}
