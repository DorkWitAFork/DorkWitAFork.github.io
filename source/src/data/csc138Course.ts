import type { Csc138ChapterId, Lesson, QuizQuestion } from '../types'
import { glossary, lessons, quizQuestions } from './course'
import { chapter2ActivityIds, chapter2Glossary, chapter2Lessons, chapter2QuizQuestions } from './courseChapter2'
import { chapter3ActivityIds, chapter3Glossary, chapter3Lessons, chapter3QuizQuestions } from './courseChapter3'

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
    title: 'Application Layer',
    tagline: 'Follow the request.',
    summary: 'Trace application messages through sockets, HTTP and Web state, email, FTP, DNS, peer-to-peer distribution, and UDP/TCP programs.',
    lessons: chapter2Lessons,
    quizQuestions: chapter2QuizQuestions,
    glossary: chapter2Glossary,
    activityIds: chapter2ActivityIds,
  },
  chapter3: {
    id: 'chapter3',
    number: '3',
    moduleLabel: 'Module 03 · Transport Layer',
    title: 'Transport Layer',
    tagline: 'Make delivery reliable.',
    summary: 'Connect processes with ports and UDP, detect corruption with checksums, and build reliable transfer through stop-and-wait and the motivation for pipelining.',
    lessons: chapter3Lessons,
    quizQuestions: chapter3QuizQuestions,
    glossary: chapter3Glossary,
    activityIds: chapter3ActivityIds,
  },
}

export const csc138ChapterList = [csc138Chapters.chapter1, csc138Chapters.chapter2, csc138Chapters.chapter3]
