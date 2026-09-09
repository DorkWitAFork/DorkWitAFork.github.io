import type { Progress } from '../types'

export const OS_STORAGE_KEY = 'csc139-progress-v1'

export const emptyOsProgress: Progress = {
  version: 1,
  completedLessons: [],
  completedActivities: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  lastVisited: 'dashboard',
}

export function loadOsProgress(storage: Pick<Storage, 'getItem'> = localStorage): Progress {
  try {
    const value = storage.getItem(OS_STORAGE_KEY)
    if (!value) return emptyOsProgress
    const parsed = JSON.parse(value) as Partial<Progress>
    if (parsed.version !== 1) return emptyOsProgress
    return {
      ...emptyOsProgress,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities : [],
    }
  } catch {
    return emptyOsProgress
  }
}

export function saveOsProgress(progress: Progress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(OS_STORAGE_KEY, JSON.stringify(progress))
}
