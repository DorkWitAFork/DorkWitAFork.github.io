import type { Csc139ChapterId, Lesson, QuizQuestion } from '../types'
import { osActivityIds, osGlossary, osLessons, osQuizQuestions } from './osCourse'
import { osChapter2ActivityIds, osChapter2Glossary, osChapter2Lessons, osChapter2QuizQuestions } from './osCourseChapter2'

export type Csc139Chapter = {
  id: Csc139ChapterId
  number: string
  moduleLabel: string
  title: string
  tagline: string
  summary: string
  lessons: Lesson[]
  quizQuestions: QuizQuestion[]
  glossary: Array<[string, string]>
  activityIds: readonly string[]
}

export const csc139Chapters: Record<Csc139ChapterId, Csc139Chapter> = {
  chapter1: {
    id: 'chapter1',
    number: '1',
    moduleLabel: 'Module 01 · Introduction',
    title: 'Operating-System Foundations',
    tagline: 'One machine, shared safely.',
    summary: 'Connect hardware events, privilege, resource management, and virtual execution environments into one control model.',
    lessons: osLessons,
    quizQuestions: osQuizQuestions,
    glossary: osGlossary,
    activityIds: osActivityIds,
  },
  chapter2: {
    id: 'chapter2',
    number: '2',
    moduleLabel: 'Module 02 · Structures',
    title: 'Operating-System Structures',
    tagline: 'Follow the service boundary.',
    summary: 'Trace services from user interfaces and system calls through kernel organization, boot, debugging, and Linux modules.',
    lessons: osChapter2Lessons,
    quizQuestions: osChapter2QuizQuestions,
    glossary: osChapter2Glossary,
    activityIds: osChapter2ActivityIds,
  },
}

export const csc139ChapterList = [csc139Chapters.chapter1, csc139Chapters.chapter2]
