import { Icon } from './Icons'
import { portfolioProjects, type PortfolioProject } from '../data/portfolio'
import './hiring.css'
import type { MouseEvent } from 'react'

function scrollToHiringSection(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault()
  const target = document.getElementById(event.currentTarget.hash.slice(1))
  target?.scrollIntoView({ behavior: 'auto', block: 'start' })
  target?.focus({ preventScroll: true })
}

function SiteHeader() {
  return <PortfolioHeader />
}

function PortfolioHeader() {
  return <header className="notebook-header">
    <a className="notebook-name" href="#/">Spencer Le Bleu</a>
    <nav aria-label="Portfolio navigation">
      <a href="#/">Home</a>
      <a href="#/hiring">Projects</a>
      <a href="#/student">Student desk</a>
      <a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">GitHub</a>
    </nav>
  </header>
}

function ProjectImplementation({ id }: Pick<PortfolioProject, 'id'>) {
  const notes = {
    'keys2fitness': { title: 'Two sides of the same app', rows: [['Coach', 'Clients, workouts, progress, conversations'], ['Client', 'Assigned workouts, exercises, progress, messages']], caption: 'Separate coach and client routes in a shared React Native app.' },
    'rs-mercher': { title: 'Learning from the Grand Exchange', rows: [['Observe', 'Real market prices and changing trading conditions'], ['Learn', 'Record decisions and outcomes; evaluate prediction errors'], ['Evaluate', 'Paper decisions and replay against recorded evidence']], caption: 'A machine learning project in development, with market observation and evaluation kept separate from trade execution.' },
    'poker-app': { title: 'What a session needs to remember', rows: [['Players', 'Player records and lookup'], ['Games', 'Session setup and table history'], ['Participants', 'Buy-ins and cash-outs for each player']], caption: 'Players, games, and participants are stored in SQLite.' },
    'course-labs': { title: 'Two subjects, one place to study', rows: [['CSC 138', 'Networks, packet diagrams, protocol exercises'], ['CSC 139', 'Operating systems, kernel concepts, practice']], caption: 'Lesson and quiz progress is saved in the browser.' },
  }[id]
  return <aside className="hiring-implementation" aria-label={`${notes.title}: implementation notes`}><h3>{notes.title}</h3><dl>{notes.rows.map(([label, detail]) => <div key={label}><dt>{label}</dt><dd>{detail}</dd></div>)}</dl><p>{notes.caption}</p></aside>
}

function ProjectRecords() {
  const order: PortfolioProject['id'][] = ['keys2fitness', 'rs-mercher', 'poker-app', 'course-labs']
  return <section className="hiring-projects" id="work" aria-label="Selected projects" tabIndex={-1}>{order.map(id => {
    const project = portfolioProjects.find(item => item.id === id)!
    return <article className="hiring-project" id={`project-${id}`} key={id} aria-labelledby={`title-${id}`} tabIndex={-1}>
      <header><p className="hiring-project-kind">{project.kind}</p><h2 id={`title-${id}`}>{project.title}</h2><p className="hiring-focus">{project.focus}</p><p className="hiring-tools">{project.tools.join(' · ')}</p></header>
      <div className="hiring-project-body"><div className="hiring-project-notes"><p className="hiring-summary">{project.summary}</p><ul>{project.notes.map(note => <li key={note}>{note}</li>)}</ul><nav aria-label={`${project.title} links`}>{project.privateSource ? <span className="hiring-source-private">Source code is private.</span> : <a href={project.sourceUrl} target="_blank" rel="noreferrer">Read the source<span className="hiring-repo">{new URL(project.sourceUrl).pathname.slice(1)}</span></a>}{project.liveUrl && <a href={project.liveUrl}>{project.liveLabel}</a>}</nav></div><ProjectImplementation id={id}/></div>
    </article>
  })}</section>
}

function ContextSection() {
  return <section className="wc-notes" id="notes" aria-labelledby="notes-heading">
        <div>
          <h2 id="notes-heading">A little about me.</h2>
          <p>I am studying Computer Science in Sacramento. I first developed my knowledge by working mainly in C++, Python, and Java, but I am expanding to learn new languages I find interesting or fun! I find it so rewarding to use my projects to put what I'm learning into practice.</p>
          <p>The course guides here are part of that work. I update them as new lecture material arrives.</p>
        </div>
        <div className="wc-contact">
          <span>Elsewhere</span>
          <a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">github.com/DorkWitAFork <span aria-hidden="true">↗</span></a>
          <small>My repositories and work in progress.</small>
        </div>
      </section>
}

export function PortfolioHome() {
  return <div className="working-copy wc-home">
    <a className="wc-skip" href="#audience" onClick={scrollToHiringSection}>Skip to audience choices</a>
    <PortfolioHeader />
    <main id="top">
      <section className="wc-home-hero" aria-labelledby="wc-title">
        <div className="wc-home-index"><span>Computer science student</span><small>Sacramento, CA</small></div>
        <div className="wc-home-title">
          <h1 id="wc-title">Hi! I'm Spencer <em>Le Bleu</em></h1>
        </div>
        <div className="wc-home-intro">
          <strong>Computer science student<br/>and software developer</strong>
          <p>I work mainly in C++, Python, and Java. Most of my projects begin with something I want to understand well enough to rebuild for myself.</p>
        </div>
      </section>

      <section className="wc-audience" id="audience" aria-labelledby="audience-heading" tabIndex={-1}>
        <header><h2 id="audience-heading">Hello! Are you a:</h2><span>CHOOSE A SECTION</span></header>
        <div className="wc-audience-grid">
          <a className="wc-audience-card wc-audience-student" href="#/student">
            <div><h3>Student</h3><p>Open course guides, lessons, practice labs, and reference sheets.</p></div><b>Visit the student desk →</b>
          </a>
          <a className="wc-audience-card" href="#/teacher">
            <div><h3>Teacher</h3><p>Review the course tools, academic work, and how the material is organized.</p></div><b>View academic work →</b>
          </a>
          <a className="wc-audience-card" href="#/hiring">
            <div><h3>Hiring Professional</h3><p>Read project notes, technical decisions, and source code.</p></div><b>View selected projects →</b>
          </a>
        </div>
      </section>

      <ContextSection />
    </main>
    <footer className="wc-footer"><span>Spencer Le Bleu · Sacramento, CA</span><a href="#top" onClick={scrollToHiringSection}>Back to top</a></footer>
  </div>
}

export function HiringPortfolio() {
  return <div className="hiring-page">
    <a className="hiring-skip" href="#work" onClick={scrollToHiringSection}>Skip to projects</a>
    <PortfolioHeader />
    <main id="top" tabIndex={-1}><header className="hiring-intro"><p className="hiring-byline">Computer science student · Sacramento, CA</p><h1>Some of my<br/>recent projects.</h1><p className="hiring-intro-copy">I’m the lead developer on Keys2Fitness, and I work on a poker tracker, a machine learning project studying the OSRS market, and the course guides on this site.</p><nav className="hiring-index" aria-label="Jump to a project"><a href="#project-keys2fitness" onClick={scrollToHiringSection}>Keys2Fitness <small>Team project</small></a><a href="#project-rs-mercher" onClick={scrollToHiringSection}>rs-mercher <small>Machine learning</small></a><a href="#project-poker-app" onClick={scrollToHiringSection}>PokerApp <small>Desktop app</small></a><a href="#project-course-labs" onClick={scrollToHiringSection}>Course Labs <small>Study tools</small></a></nav></header><ProjectRecords/></main>
    <footer className="hiring-footer"><span>Spencer Le Bleu</span><a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">More code on GitHub</a><a href="#top" onClick={scrollToHiringSection}>Back to top</a></footer>
  </div>
}

export function TeacherPage() {
  return <div className="working-copy wc-subpage">
    <PortfolioHeader />
    <main id="top">
      <header className="wc-page-intro wc-teacher-intro">
        <span>For teachers</span>
        <div><p>Academic work</p><h1>Course material, rebuilt to study from.</h1></div>
        <p>I turn notes and assigned material into navigable lessons, diagrams, practice exercises, and references. The current tools can be opened and reviewed directly.</p>
      </header>
      <section className="wc-academic-list" aria-label="Current course tools">
        <a href="#/student/csc138/dashboard"><span>CSC 138</span><div><small>Computer Network Fundamentals</small><h2>Network Lab</h2></div><b>Open tool →</b></a>
        <a href="#/student/csc139/dashboard"><span>CSC 139</span><div><small>Operating System Principles</small><h2>Operating Systems Lab</h2></div><b>Open tool →</b></a>
      </section>
      <section className="wc-teacher-note">
        <span>How the guides are built</span>
        <h2>The notes remain traceable.</h2>
        <p>Each course tool separates its source material, lesson data, interface components, and browser-local progress. The repository includes tests for routing, diagrams, and progress behavior.</p>
        <a className="wc-heavy-link" href="https://github.com/DorkWitAFork/DorkWitAFork.github.io" target="_blank" rel="noreferrer">Review the repository ↗</a>
      </section>
    </main>
    <footer className="wc-footer"><span>Spencer Le Bleu / Academic work</span><a href="#/">Return home ↑</a><span>Two active course tools</span></footer>
  </div>
}

export function StudentLibrary() {
  return <div className="portfolio-shell library-shell">
    <SiteHeader />
    <main className="library-page">
      <header className="library-heading"><div><span className="folio-index">STUDENT DESK / FALL 2026</span><h1>Choose a<br/><em>field guide.</em></h1></div><p>Course notes transformed into focused lessons, interactive practice, and quick reference material. Progress stays in your browser.</p></header>
      <section className="course-grid" aria-label="Available courses">
        <a className="course-card network-course" href="#/student/csc138/dashboard"><div className="course-card-top"><span>CSC 138</span><i>UPDATED</i></div><div className="course-card-copy"><small>COMPUTER NETWORK FUNDAMENTALS</small><h2>Follow the<br/>packet.</h2><p>Dr. Bang Tran · Chapters 1-4</p></div><span className="course-launch">Open Network Lab <Icon name="arrow"/></span></a>
        <a className="course-card os-course" href="#/student/csc139/dashboard"><div className="course-card-top"><span>CSC 139</span><i>UPDATED</i></div><div className="course-card-copy"><small>OPERATING SYSTEM PRINCIPLES</small><h2>Trust the<br/>kernel.</h2><p>Prof. Tarek Sakakini · Chapters 1-2</p></div><span className="course-launch">Open OS Lab <Icon name="arrow"/></span></a>
      </section>
    </main>
  </div>
}
