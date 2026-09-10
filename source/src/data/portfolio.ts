export type PortfolioProject = {
  id: 'linear-algebra' | 'network-lab' | 'os-lab'
  fileNumber: string
  title: string
  kind: string
  summary: string
  notes: string[]
  tools: string[]
  sourceUrl: string
  liveUrl?: string
  liveLabel?: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'linear-algebra',
    fileNumber: '01',
    title: 'Linear Algebra Helper',
    kind: 'Desktop application / 2026',
    summary: 'I wanted a matrix calculator that could show the work instead of returning only an answer.',
    notes: [
      'Rewritten in C++17 and Qt 6 from an earlier Python application.',
      'Handles symbolic expressions, row-operation reports, system solving, factorizations, and eigenspaces with SymEngine.',
      'Includes a restricted expression parser and regression tests for the core algorithms.',
    ],
    tools: ['C++17', 'Qt 6', 'SymEngine', 'CMake'],
    sourceUrl: 'https://github.com/DorkWitAFork/Linear-Algebra-Helper',
  },
  {
    id: 'network-lab',
    fileNumber: '02',
    title: 'Network Lab',
    kind: 'Interactive study tool / CSC 138',
    summary: 'My CSC 138 notes kept growing, so I reorganized them into a study tool I would actually use.',
    notes: [
      'Turns networking notes into a focused browser-based study sequence.',
      'Includes queue, delay, and protocol-order exercises alongside chapter quizzes.',
      'Keeps lesson and quiz progress in the browser without requiring an account.',
    ],
    tools: ['TypeScript', 'React', 'SVG', 'Vitest'],
    sourceUrl: 'https://github.com/DorkWitAFork/DorkWitAFork.github.io',
    liveUrl: '#/student/csc138/dashboard',
    liveLabel: 'Open Network Lab',
  },
  {
    id: 'os-lab',
    fileNumber: '03',
    title: 'Operating Systems Lab',
    kind: 'Interactive study tool / CSC 139',
    summary: 'I built a second course tool to trace what happens between a user program, the kernel, and the hardware.',
    notes: [
      'Organizes operating-system principles into lessons, a roadmap, practice, and reference material.',
      'Uses original diagrams to make privilege boundaries and system-call paths visible.',
      'Shares the learning architecture of Network Lab while keeping its own visual system and course data.',
    ],
    tools: ['TypeScript', 'React', 'SVG', 'Local storage'],
    sourceUrl: 'https://github.com/DorkWitAFork/DorkWitAFork.github.io',
    liveUrl: '#/student/csc139/dashboard',
    liveLabel: 'Open OS Lab',
  },
]
