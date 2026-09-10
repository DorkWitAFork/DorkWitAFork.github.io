import type { ChapterQuizProgress, Csc138Progress } from '../types'

export const STORAGE_KEY = 'csc138-progress-v1'

const emptyQuiz: ChapterQuizProgress = { attempts: 0, bestScore: 0, total: 10 }

export const emptyProgress: Csc138Progress = {
  version: 1,
  completedLessons: [],
  completedActivities: [],
  quizAttempts: 0,
  bestQuizScore: 0,
  lastVisited: 'dashboard',
  chapterQuizzes: {
    chapter1: { ...emptyQuiz },
    chapter2: { ...emptyQuiz },
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

export function loadProgress(storage: Pick<Storage, 'getItem'> = localStorage): Csc138Progress {
  try {
    const value = storage.getItem(STORAGE_KEY)
    if (!value) return emptyProgress
    const parsed = JSON.parse(value) as Partial<Csc138Progress>
    if (parsed.version !== 1) return emptyProgress
    const legacyChapter1 = {
      attempts: validNumber(parsed.quizAttempts, 0),
      bestScore: validNumber(parsed.bestQuizScore, 0),
      total: 10,
    }
    return {
      ...emptyProgress,
      ...parsed,
      quizAttempts: legacyChapter1.attempts,
      bestQuizScore: legacyChapter1.bestScore,
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons.filter(id => typeof id === 'string') : [],
      completedActivities: Array.isArray(parsed.completedActivities) ? parsed.completedActivities.filter(id => typeof id === 'string') : [],
      chapterQuizzes: {
        chapter1: loadQuiz(parsed.chapterQuizzes?.chapter1, legacyChapter1),
        chapter2: loadQuiz(parsed.chapterQuizzes?.chapter2, { ...emptyQuiz }),
      },
    }
  } catch {
    return emptyProgress
  }
}

export function saveProgress(progress: Csc138Progress, storage: Pick<Storage, 'setItem'> = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function calculateDelayMs(bits: number, rateMbps: number) {
  if (!Number.isFinite(bits) || !Number.isFinite(rateMbps) || bits <= 0 || rateMbps <= 0) return 0
  return (bits / (rateMbps * 1_000_000)) * 1_000
}
