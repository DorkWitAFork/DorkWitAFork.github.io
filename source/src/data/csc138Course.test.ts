import { describe, expect, it } from 'vitest'
import { csc138ChapterList, csc138Chapters } from './csc138Course'

describe('CSC 138 chapter registry', () => {
  it('registers four complete chapters', () => {
    expect(csc138ChapterList.map(chapter => chapter.id)).toEqual(['chapter1', 'chapter2', 'chapter3', 'chapter4'])
    expect(csc138Chapters.chapter1.lessons).toHaveLength(7)
    expect(csc138Chapters.chapter2.lessons).toHaveLength(15)
    expect(csc138Chapters.chapter2.quizQuestions).toHaveLength(26)
    expect(csc138Chapters.chapter2.activityIds).toHaveLength(10)
    expect(csc138Chapters.chapter2.lessons.map(lesson => lesson.id)).toEqual(expect.arrayContaining(['ch2-p2p-distribution', 'ch2-bittorrent-swarm', 'ch2-udp-sockets', 'ch2-tcp-sockets']))
    expect(csc138Chapters.chapter3.lessons).toHaveLength(21)
    expect(csc138Chapters.chapter3.quizQuestions).toHaveLength(36)
    expect(csc138Chapters.chapter3.activityIds).toHaveLength(12)
    expect(csc138Chapters.chapter3.lessons.map(lesson => lesson.id)).toEqual(expect.arrayContaining(['ch3-demultiplexing', 'ch3-checksum', 'ch3-rdt3', 'ch3-stop-wait']))
    expect(csc138Chapters.chapter4.lessons).toHaveLength(13)
    expect(csc138Chapters.chapter4.quizQuestions).toHaveLength(30)
    expect(csc138Chapters.chapter4.activityIds).toHaveLength(8)
    expect(csc138Chapters.chapter4.lessons.map(lesson => lesson.number)).toEqual(Array.from({ length: 13 }, (_, index) => String(index + 1).padStart(2, '0')))
    expect(csc138Chapters.chapter4.lessons.slice(0, 7).every(lesson => lesson.source.includes('Chapter4-Data Plane-Overview-Router.pdf slides'))).toBe(true)
    expect(csc138Chapters.chapter4.lessons.slice(7).every(lesson => lesson.source.includes('Chapter4-Data Plane-IP.pdf slides'))).toBe(true)
  })

  it('uses unique IDs across chapters and valid quiz answers', () => {
    const lessonIds = csc138ChapterList.flatMap(chapter => chapter.lessons.map(lesson => lesson.id))
    const questionIds = csc138ChapterList.flatMap(chapter => chapter.quizQuestions.map(question => question.id))
    const activityIds = csc138ChapterList.flatMap(chapter => chapter.activityIds)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    expect(new Set(questionIds).size).toBe(questionIds.length)
    expect(new Set(activityIds).size).toBe(activityIds.length)
    for (const chapter of csc138ChapterList) {
      for (const question of chapter.quizQuestions) {
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.answer).toBeLessThan(question.choices.length)
      }
    }
  })

  it('preserves shipped Chapter 1 progress IDs', () => {
    expect(csc138Chapters.chapter1.lessons.map(lesson => lesson.id)).toContain('internet-overview')
    expect(csc138Chapters.chapter1.activityIds).toEqual(['delay', 'queue', 'protocol'])
  })
})
