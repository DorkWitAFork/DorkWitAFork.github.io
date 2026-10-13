import { describe, expect, it } from 'vitest'
import { midtermQuestions, midtermReviewSections } from './csc138Midterm'

describe('CSC 138 midterm materials', () => {
  it('covers the guide with a substantial mixed practice set', () => {
    expect(midtermReviewSections).toHaveLength(5)
    expect(midtermQuestions).toHaveLength(40)
    expect(new Set(midtermQuestions.map(question => question.category)).size).toBeGreaterThanOrEqual(10)
  })

  it('has valid answer indexes and unique question IDs', () => {
    expect(new Set(midtermQuestions.map(question => question.id)).size).toBe(midtermQuestions.length)
    for (const question of midtermQuestions) {
      expect(question.answer).toBeGreaterThanOrEqual(0)
      expect(question.answer).toBeLessThan(question.choices.length)
    }
  })
})
