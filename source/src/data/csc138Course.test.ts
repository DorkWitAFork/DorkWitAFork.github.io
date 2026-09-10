import { describe, expect, it } from 'vitest'
import { csc138ChapterList, csc138Chapters } from './csc138Course'

describe('CSC 138 chapter registry', () => {
  it('registers two complete chapters', () => {
    expect(csc138ChapterList.map(chapter => chapter.id)).toEqual(['chapter1', 'chapter2'])
    expect(csc138Chapters.chapter1.lessons).toHaveLength(7)
    expect(csc138Chapters.chapter2.lessons).toHaveLength(7)
    expect(csc138Chapters.chapter2.quizQuestions).toHaveLength(10)
    expect(csc138Chapters.chapter2.activityIds).toHaveLength(3)
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
