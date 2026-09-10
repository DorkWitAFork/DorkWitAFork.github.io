export type PortfolioProject = {
  id: 'poker-app' | 'asteroids' | 'course-labs'
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
    id: 'poker-app',
    fileNumber: '01',
    title: 'PokerApp',
    kind: 'Desktop application / In progress',
    summary: 'A Java desktop application for recording poker games, players, buy-ins, cash-outs, and table history.',
    notes: [
      'Uses Swing screens for game setup, player lookup, reports, statistics, and leaderboards.',
      'Stores players, games, and participants in a relational SQLite schema.',
      'Separates models, database access, services, and interface code while the service operations are being completed.',
    ],
    tools: ['Java', 'Swing', 'SQLite', 'Maven'],
    sourceUrl: 'https://github.com/DorkWitAFork/PokerApp',
  },
  {
    id: 'asteroids',
    fileNumber: '02',
    title: 'Asteroids',
    kind: 'Game project / Python',
    summary: 'My version of the arcade game, built to practice object-oriented game loops, vectors, and collision behavior.',
    notes: [
      'Runs a 60 FPS loop with delta-time movement and separate drawable, update, asteroid, and shot groups.',
      'Handles player rotation, thrust, firing cooldowns, collisions, and asteroid splitting.',
      'Spawns randomized asteroid sizes and trajectories from all four screen edges.',
    ],
    tools: ['Python', 'Pygame', 'Vector math', 'OOP'],
    sourceUrl: 'https://github.com/DorkWitAFork/Asteroids',
  },
  {
    id: 'course-labs',
    fileNumber: '03',
    title: 'Course Labs',
    kind: 'Bundled study tools / CSC 138 + CSC 139',
    summary: 'Two browser-based course companions collected behind one student desk.',
    notes: [
      'Network Lab covers lessons, packet diagrams, queue exercises, quizzes, and networking reference material.',
      'Operating Systems Lab traces user space, kernel behavior, system calls, scheduling, and storage concepts.',
      'Both tools save lesson and quiz progress locally in the browser without requiring an account.',
    ],
    tools: ['TypeScript', 'React', 'SVG', 'Local storage'],
    sourceUrl: 'https://github.com/DorkWitAFork/DorkWitAFork.github.io',
    liveUrl: '#/student',
    liveLabel: 'Choose a Course Lab',
  },
]
