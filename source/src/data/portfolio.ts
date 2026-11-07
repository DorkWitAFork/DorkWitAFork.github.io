export type PortfolioProject = {
  id: 'poker-app' | 'keys2fitness' | 'course-labs' | 'rs-mercher'
  fileNumber: string
  title: string
  kind: string
  summary: string
  notes: string[]
  tools: string[]
  sourceUrl: string
  privateSource?: boolean
  focus: string
  liveUrl?: string
  liveLabel?: string
}

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'poker-app',
    fileNumber: '01',
    title: 'PokerApp',
    focus: 'Relational data modeling and desktop application structure',
    kind: 'Desktop application / In progress',
    summary: 'A Java desktop application for recording poker games, players, buy-ins, cash-outs, and table history.',
    notes: [
      'I’m using Java Swing for the desktop interface and SQLite for the session records. Game setup, player lookup, reports, and statistics have their own screens.',
      'The service operations are still being completed. Models, database access, services, and interface code are kept separate so that work does not all end up in screen handlers.',
    ],
    tools: ['Java', 'Swing', 'SQLite', 'Maven'],
    sourceUrl: 'https://github.com/DorkWitAFork/PokerApp',
  },
  {
    id: 'keys2fitness',
    fileNumber: '02',
    title: 'Keys2Fitness',
    focus: 'Leading development across the coach and client experience',
    kind: 'Lead developer / Senior project / In progress',
    summary: 'A fitness coaching app connecting coaches and clients around workouts, progress, and communication.',
    notes: [
      'I lead development for TEAM404’s senior project. The app has separate coach and client routes, with workout, exercise, progress, and messaging screens.',
      'We’re building with React Native, Expo Router, and Firebase. This is active team work, and the app is still in development.',
    ],
    tools: ['TypeScript', 'React Native', 'Expo', 'Firebase'],
    sourceUrl: 'https://github.com/marynolan6/Keys2Fitness',
  },
  {
    id: 'rs-mercher',
    privateSource: true,
    fileNumber: '03',
    title: 'rs-mercher',
    focus: 'Learning from real market trends in Old School RuneScape',
    kind: 'Machine learning + market analysis / In progress',
    summary: 'A machine learning project I’m building in Python to learn how real market trends move on the Old School RuneScape Grand Exchange, and use those observations to inform trading decisions.',
    notes: [
      'The learning loop records market observations, proposed decisions, and their outcomes so I can evaluate what the system gets right and where its predictions fall short.',
      'The aim is to learn from changing prices and trading conditions, not just spot a price gap. Taxes, buy limits, liquidity, partial fills, and stale observations all affect whether a trade makes sense.',
      'It is still in progress. Recorded evidence supports evaluation, paper decisions, and replay; dry-run is the default while I develop and test the learning and trading workflows.',
    ],
    tools: ['Python', 'Machine learning', 'SQLite', 'Market data', 'Evaluation + replay'],
    sourceUrl: 'https://github.com/DorkWitAFork/rs-mercher',
  },
  {
    id: 'course-labs',
    fileNumber: '04',
    title: 'Course Labs',
    focus: 'Turning networking and operating-systems material into usable study tools',
    kind: 'Bundled study tools / CSC 138 + CSC 139',
    summary: 'The networking and operating-systems guides I’m building alongside my coursework. They are available to use here on the site.',
    notes: [
      'For CSC 138, I turn protocol descriptions into packet diagrams, calculations, and interactive exercises. CSC 139 covers the OS side: user space, kernel behavior, and system calls.',
      'Both guides keep lesson and quiz progress in local storage. There is no account setup; you can open a guide and start studying.',
    ],
    tools: ['TypeScript', 'React', 'SVG', 'Local storage'],
    sourceUrl: 'https://github.com/DorkWitAFork/DorkWitAFork.github.io',
    liveUrl: '#/student',
    liveLabel: 'Choose a Course Lab',
  },
]
