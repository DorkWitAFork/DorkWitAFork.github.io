import { describe, expect, it } from 'vitest'
import { csc139ChapterList, csc139Chapters } from './csc139Course'

describe('CSC 139 chapter registry', () => {
  it('registers two complete chapters in order', () => {
    expect(csc139ChapterList.map(chapter => chapter.id)).toEqual(['chapter1', 'chapter2'])
    expect(csc139Chapters.chapter1.lessons).toHaveLength(5)
    expect(csc139Chapters.chapter2.lessons).toHaveLength(10)
    expect(csc139Chapters.chapter2.quizQuestions).toHaveLength(12)
    expect(csc139Chapters.chapter2.activityIds).toHaveLength(5)
    expect(csc139Chapters.chapter2.glossary.length).toBeGreaterThanOrEqual(35)
    for (const [term, definition] of csc139Chapters.chapter2.glossary) {
      expect(term.length).toBeGreaterThan(1)
      expect(definition.length).toBeGreaterThan(20)
    }
  })

  it('uses unique IDs across chapters and valid quiz answers', () => {
    const lessonIds = csc139ChapterList.flatMap(chapter => chapter.lessons.map(lesson => lesson.id))
    const questionIds = csc139ChapterList.flatMap(chapter => chapter.quizQuestions.map(question => question.id))
    const activityIds = csc139ChapterList.flatMap(chapter => chapter.activityIds)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    expect(new Set(questionIds).size).toBe(questionIds.length)
    expect(new Set(activityIds).size).toBe(activityIds.length)
    for (const chapter of csc139ChapterList) {
      for (const question of chapter.quizQuestions) {
        expect(question.answer).toBeGreaterThanOrEqual(0)
        expect(question.answer).toBeLessThan(question.choices.length)
      }
    }
  })

  it('preserves shipped Chapter 1 progress IDs exactly', () => {
    expect(csc139Chapters.chapter1.lessons.map(lesson => lesson.id)).toEqual([
      'os-role',
      'hardware-underneath',
      'os-control',
      'os-management',
      'execution-environments',
    ])
    expect(csc139Chapters.chapter1.activityIds).toEqual(['events', 'storage', 'system-call'])
  })
})
