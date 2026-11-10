import type { Csc138ChapterId, Lesson, QuizQuestion } from '../types'
import { glossary, lessons, quizQuestions } from './course'
import { chapter2ActivityIds, chapter2Glossary, chapter2Lessons, chapter2QuizQuestions } from './courseChapter2'
import { chapter3ActivityIds, chapter3Glossary, chapter3Lessons, chapter3QuizQuestions } from './courseChapter3'
import { chapter4ActivityIds, chapter4Glossary, chapter4Lessons, chapter4QuizQuestions } from './courseChapter4'
import { chapter5ActivityIds, chapter5Glossary, chapter5Lessons, chapter5QuizQuestions } from './courseChapter5'

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
  chapter4: {
    id: 'chapter4', number: '4', moduleLabel: 'Module 04 · Network Layer: Data Plane', title: 'Network Layer: Data Plane',
    tagline: 'Give every packet a next hop.',
    summary: 'Trace router internals and IP forwarding; allocate subnets, translate NAT endpoints, tunnel IPv6, program flow rules, and connect middleboxes to Internet architecture.',
    lessons: chapter4Lessons, quizQuestions: chapter4QuizQuestions, glossary: chapter4Glossary, activityIds: chapter4ActivityIds,
  },
  chapter5: {
    id: 'chapter5', number: '5', moduleLabel: 'Module 05 · Network Layer: Control Plane', title: 'Network Layer: Control Plane',
    tagline: 'Compute the path behind the next hop.',
    summary: 'Model weighted networks, work Dijkstra tables and Bellman-Ford updates, exchange distance vectors, and diagnose routing loops using the first two lecture decks.',
    lessons: chapter5Lessons, quizQuestions: chapter5QuizQuestions, glossary: chapter5Glossary, activityIds: chapter5ActivityIds,
  },
}

export const csc138ChapterList = [csc138Chapters.chapter1, csc138Chapters.chapter2, csc138Chapters.chapter3, csc138Chapters.chapter4, csc138Chapters.chapter5]
