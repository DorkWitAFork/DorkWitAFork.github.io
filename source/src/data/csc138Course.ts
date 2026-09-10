import type { Csc138ChapterId, Lesson, QuizQuestion } from '../types'
import { glossary, lessons, quizQuestions } from './course'
import { chapter2ActivityIds, chapter2Glossary, chapter2Lessons, chapter2QuizQuestions } from './courseChapter2'

export type Csc138Chapter = {
  id: Csc138ChapterId
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

export const csc138Chapters: Record<Csc138ChapterId, Csc138Chapter> = {
  chapter1: {
    id: 'chapter1',
    number: '1',
    moduleLabel: 'Module 01 · Introduction',
    title: 'Introduction to Networks',
    tagline: 'The Internet, piece by piece.',
    summary: 'Build a working mental model before later chapters zoom into each protocol layer.',
    lessons,
    quizQuestions,
    glossary,
    activityIds: ['delay', 'queue', 'protocol'],
  },
  chapter2: {
    id: 'chapter2',
    number: '2',
    moduleLabel: 'Module 02 · Application Layer',
    title: 'Application Principles and HTTP',
    tagline: 'Follow the request.',
    summary: 'Trace application messages from processes and sockets through HTTP, cookies, caches, and modern Web transport.',
    lessons: chapter2Lessons,
    quizQuestions: chapter2QuizQuestions,
    glossary: chapter2Glossary,
    activityIds: chapter2ActivityIds,
  },
}

export const csc138ChapterList = [csc138Chapters.chapter1, csc138Chapters.chapter2]
