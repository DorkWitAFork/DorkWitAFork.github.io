import type { ChapterQuizProgress, Csc139Progress } from '../types'

export const OS_STORAGE_KEY = 'csc139-progress-v1'

const emptyChapter1Quiz: ChapterQuizProgress = { attempts: 0, bestScore: 0, total: 10 }
const emptyChapter2Quiz: ChapterQuizProgress = { attempts: 0, bestScore: 0, total: 12 }

export const emptyOsProgress: Csc139Progress = {
  version: 1,
  completedLessons: [],
  completedActivities: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  lastVisited: 'dashboard',
  chapterQuizzes: {
    chapter1: { ...emptyChapter1Quiz },
    chapter2: { ...emptyChapter2Quiz },
  },
}

function validNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback
}

function loadQuiz(value: unknown, fallback: ChapterQuizProgress): ChapterQuizProgress {
  if (!value || typeof value !== 'object') return fallback
  const quiz = value as Partial<ChapterQuizProgress>
  return {
    attempts: validNumber(quiz.attempts, fallback.attempts),
    bestScore: validNumber(quiz.bestScore, fallback.bestScore),
    total: validNumber(quiz.total, fallback.total),
  }
}

export function loadOsProgress(storage: Pick<Storage, 'getItem'> = localStorage): Csc139Progress {
  try {
    const value = storage.getItem(OS_STORAGE_KEY)
    if (!value) return emptyOsProgress
    const parsed = JSON.parse(value) as Partial<Csc139Progress>
    if (parsed.version !== 1) return emptyOsProgress
    const legacyChapter1 = {
      attempts: validNumber(parsed.quizAttempts, 0),
      bestScore: validNumber(parsed.bestQuizScore, 0),
      total: 10,
    }
    return {
      ...emptyOsProgress,
      ...parsed,
      quizAttempts: legacyChapter1.attempts,
      bestQuizScore: legacyChapter1.bestScore,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons.filter(id => typeof id === 'string') : [],
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities.filter(id => typeof id === 'string') : [],
      chapterQuizzes: {
        chapter1: loadQuiz(parsed.chapterQuizzes?.chapter1, legacyChapter1),
        chapter2: loadQuiz(parsed.chapterQuizzes?.chapter2, { ...emptyChapter2Quiz }),
      },
    }
  } catch {
    return emptyOsProgress
  }
}

export function saveOsProgress(progress: Csc139Progress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(OS_STORAGE_KEY, JSON.stringify(progress))
}
