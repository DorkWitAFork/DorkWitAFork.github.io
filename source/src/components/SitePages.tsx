import { Icon } from './Icons'
import { portfolioProjects, type PortfolioProject } from '../data/portfolio'

function SiteHeader() {
  return <header className="site-header">
    <a className="site-wordmark" href="#/"><span>SLB</span><div><strong>SPENCER LE BLEU</strong><small>COMPUTER SCIENCE + SOFTWARE</small></div></a>
    <a className="site-home-link" href="#/">Home</a>
  </header>
}

function PortfolioHeader() {
  return <header className="wc-header">
    <a className="wc-name" href="#/"><strong>Spencer Le Bleu</strong><span>CS student / software developer</span></a>
    <nav aria-label="Portfolio navigation">
      <a href="#/">Home</a>
      <a href="#/hiring">Projects</a>
      <a href="#/student">Student desk</a>
      <a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </nav>
  </header>
}

function AudienceGlyph({ type }: { type: 'student' | 'teacher' | 'hiring' }) {
  if (type === 'student') return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 38 50 18l38 20-38 20-38-20Z"/><path d="M27 48v22c13 12 33 12 46 0V48M87 40v27"/></svg>
  if (type === 'teacher') return <svg viewBox="0 0 100 100" aria-hidden="true"><rect x="15" y="20" width="70" height="55"/><path d="M28 35h44M28 47h27M28 59h36M40 85h20M50 75v10"/></svg>
  return <svg viewBox="0 0 100 100" aria-hidden="true"><rect x="15" y="28" width="70" height="54"/><path d="M38 28v-8h24v8M15 48h70M42 47v7h16v-7"/></svg>
}

function ProjectArtifact({ id }: Pick<PortfolioProject, 'id'>) {
  if (id === 'poker-app') return <div className="wc-artifact wc-poker" aria-hidden="true">
    <span className="wc-playing-card wc-card-one"><b>A</b><i>♠</i></span>
    <span className="wc-playing-card wc-card-two"><b>K</b><i>♦</i></span>
    <div className="wc-chip-stack"><i/><i/><i/><i/></div>
    <small>SESSION 014 / 6 PLAYERS</small>
    <strong>+$240</strong>
  </div>

  if (id === 'asteroids') return <div className="wc-artifact wc-asteroids" aria-hidden="true">
    <span className="wc-ship">△</span>
    <i className="wc-rock rock-one"/><i className="wc-rock rock-two"/><i className="wc-rock rock-three"/>
    <b className="wc-shot shot-one"/><b className="wc-shot shot-two"/>
    <small>FIELD 02 / VELOCITY ACTIVE</small>
  </div>

  return <div className="wc-artifact wc-course-bundle" aria-hidden="true">
    <div><span>CSC 138</span><b>NETWORK LAB</b><small>PACKETS / PROTOCOLS / QUEUES</small></div>
    <i>+</i>
    <div><span>CSC 139</span><b>OS LAB</b><small>KERNEL / PROCESSES / STORAGE</small></div>
    <strong>ONE STUDENT DESK</strong>
  </div>
}

function ProjectRecords() {
  return <section className="wc-work" id="work" aria-labelledby="work-heading">
        <header className="wc-section-heading">
          <span>SELECTED FILES / 03</span>
          <h2 id="work-heading">Three projects on my desk.</h2>
          <p>Each file records what the project does, what it is made from, and the decisions that shaped it.</p>
        </header>

        <div className="wc-project-list">
          {portfolioProjects.map((project) => <article className={`wc-project wc-project-${project.id}`} key={project.id}>
            <header className="wc-project-heading">
              <span className="wc-file-number">{project.fileNumber}</span>
              <div><small>{project.kind}</small><h3>{project.title}</h3></div>
            </header>
            <ProjectArtifact id={project.id}/>
            <div className="wc-project-copy">
              <p className="wc-project-summary">{project.summary}</p>
              <ul>{project.notes.map((note) => <li key={note}>{note}</li>)}</ul>
            </div>
            <footer className="wc-project-footer">
              <div aria-label="Technologies used">{project.tools.map((tool) => <span key={tool}>{tool}</span>)}</div>
              <nav aria-label={`${project.title} links`}>
                {project.liveUrl && <a href={project.liveUrl}>{project.liveLabel} <span aria-hidden="true">→</span></a>}
                <a href={project.sourceUrl} target="_blank" rel="noreferrer">Read the source <span aria-hidden="true">↗</span></a>
              </nav>
            </footer>
          </article>)}
        </div>
      </section>
}

function ContextSection() {
  return <section className="wc-notes" id="notes" aria-labelledby="notes-heading">
        <aside><span>DESK NOTE / 01</span><i aria-hidden="true">*</i></aside>
        <div>
          <h2 id="notes-heading">A little context.</h2>
          <p>I am studying computer science in Sacramento and building alongside the coursework. I like projects that expose their machinery: algorithms that can explain their steps, diagrams that make an invisible boundary visible, and interfaces that help someone do more than look.</p>
          <p>I update this site as the work changes. Nothing here is meant to look frozen or more finished than it really is.</p>
        </div>
        <div className="wc-contact">
          <span>THE OPEN CHANNEL</span>
          <a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">github.com/DorkWitAFork <span aria-hidden="true">↗</span></a>
          <small>Code, revision history, and current experiments.</small>
        </div>
      </section>
}

export function PortfolioHome() {
  return <div className="working-copy wc-home">
    <a className="wc-skip" href="#audience">Skip to audience choices</a>
    <PortfolioHeader />
    <main id="top">
      <section className="wc-home-hero" aria-labelledby="wc-title">
        <div className="wc-home-index"><span>HELLO / 2026</span><small>Sacramento, CA<br/>File SLB-01</small></div>
        <div className="wc-home-title">
          <p>Hello, I am</p>
          <h1 id="wc-title">Spencer <em>LeBleu.</em></h1>
        </div>
        <div className="wc-home-intro">
          <strong>Computer science student<br/>and software developer</strong>
          <p>I work mainly in C++, Python, and Java. Most of my projects begin with something I want to understand well enough to rebuild for myself.</p>
        </div>
      </section>

      <section className="wc-audience" id="audience" aria-labelledby="audience-heading">
        <header><h2 id="audience-heading">Hello! Are you a:</h2><span>CHOOSE A SECTION</span></header>
        <div className="wc-audience-grid">
          <a className="wc-audience-card wc-audience-student" href="#/student">
            <span>01</span><AudienceGlyph type="student"/><div><h3>Student</h3><p>Open course guides, lessons, practice labs, and reference sheets.</p></div><b>Visit the student desk →</b>
          </a>
          <a className="wc-audience-card" href="#/teacher">
            <span>02</span><AudienceGlyph type="teacher"/><div><h3>Teacher</h3><p>Review the course tools, academic work, and how the material is organized.</p></div><b>View academic work →</b>
          </a>
          <a className="wc-audience-card" href="#/hiring">
            <span>03</span><AudienceGlyph type="hiring"/><div><h3>Hiring Professional</h3><p>Read project notes, technical decisions, and source code.</p></div><b>View selected projects →</b>
          </a>
        </div>
      </section>

      <ContextSection />
    </main>
    <footer className="wc-footer"><span>Spencer Le Bleu / Sacramento, CA</span><a href="#top">Back to first page ↑</a><span>Portfolio set in system type</span></footer>
  </div>
}

export function HiringPortfolio() {
  return <div className="working-copy wc-subpage">
    <a className="wc-skip" href="#work">Skip to selected projects</a>
    <PortfolioHeader />
    <main id="top">
      <header className="wc-page-intro">
        <span>FOR HIRING PROFESSIONALS / FILE H</span>
        <div><p>Selected work</p><h1>Projects, with the machinery showing.</h1></div>
        <p>Three current projects, documented with the problem I was solving, the tools I used, and links to inspect the result.</p>
      </header>
      <ProjectRecords />
    </main>
    <footer className="wc-footer"><span>Spencer Le Bleu / Selected work</span><a href="#/">Return home ↑</a><span>Source linked per project</span></footer>
  </div>
}

export function TeacherPage() {
  return <div className="working-copy wc-subpage">
    <PortfolioHeader />
    <main id="top">
      <header className="wc-page-intro wc-teacher-intro">
        <span>FOR TEACHERS / FILE T</span>
        <div><p>Academic work</p><h1>Course material, rebuilt to study from.</h1></div>
        <p>I turn notes and assigned material into navigable lessons, diagrams, practice exercises, and references. The current tools can be opened and reviewed directly.</p>
      </header>
      <section className="wc-academic-list" aria-label="Current course tools">
        <a href="#/student/csc138/dashboard"><span>CSC 138</span><div><small>Computer Network Fundamentals</small><h2>Network Lab</h2></div><b>Open tool →</b></a>
        <a href="#/student/csc139/dashboard"><span>CSC 139</span><div><small>Operating System Principles</small><h2>Operating Systems Lab</h2></div><b>Open tool →</b></a>
      </section>
      <section className="wc-teacher-note">
        <span>METHOD / 01</span>
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
        <a className="course-card network-course" href="#/student/csc138/dashboard"><div className="course-card-top"><span>CSC 138</span><i>UPDATED</i></div><div className="course-art network-art"><span/><span/><span/><span/></div><div className="course-card-copy"><small>COMPUTER NETWORK FUNDAMENTALS</small><h2>Follow the<br/>packet.</h2><p>Dr. Bang Tran · Chapters 1-2</p></div><span className="course-launch">Open Network Lab <Icon name="arrow"/></span></a>
        <a className="course-card os-course" href="#/student/csc139/dashboard"><div className="course-card-top"><span>CSC 139</span><i>NEW</i></div><div className="course-art os-art"><span>USER</span><b>KERNEL</b><span>HARDWARE</span></div><div className="course-card-copy"><small>OPERATING SYSTEM PRINCIPLES</small><h2>Trust the<br/>kernel.</h2><p>Prof. Tarek Sakakini · Chapter 1</p></div><span className="course-launch">Open OS Lab <Icon name="arrow"/></span></a>
      </section>
    </main>
  </div>
}
