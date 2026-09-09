export type View = 'dashboard' | 'roadmap' | 'chapter1' | 'practice' | 'reference'

export type Lesson = {
  id: string
  number: string
  title: string
  eyebrow: string
  minutes: number
  summary: string
  objectives: string[]
  sections: Array<{
    title: string
    body: string
    points?: string[]
  }>
  keyTerms: string[]
  source: string
}

export type QuizQuestion = {
  id: string
  prompt: string
  choices: string[]
  answer: number
  explanation: string
}

export type Progress = {
  version: 1
  completedLessons: string[]
  completedActivities: string[]
  quizAttempts: number
  bestQuizScore: number
  lastVisited: string
}
