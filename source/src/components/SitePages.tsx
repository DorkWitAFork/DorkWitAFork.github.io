import { Icon } from './Icons'
import { portfolioProjects, type PortfolioProject } from '../data/portfolio'

function SiteHeader() {
  return <header className="site-header">
    <a className="site-wordmark" href="#/"><span>SLB</span><div><strong>SPENCER LE BLEU</strong><small>COMPUTER SCIENCE + SOFTWARE</small></div></a>
    <a className="site-home-link" href="#/">Home</a>
  </header>
}

function ProjectArtifact({ id }: Pick<PortfolioProject, 'id'>) {
  if (id === 'linear-algebra') return <div className="wc-artifact wc-matrix" aria-hidden="true">
    <div className="wc-matrix-input"><span>A =</span><b>2&nbsp; x<br/>1&nbsp; 3</b></div>
    <div className="wc-operation">R2 - 1/2 R1</div>
    <div className="wc-matrix-output"><span>RREF(A)</span><b>1&nbsp; 0<br/>0&nbsp; 1</b></div>
    <i>EXACT ARITHMETIC</i>
  </div>

  if (id === 'network-lab') return <div className="wc-artifact wc-network" aria-hidden="true">
    <span className="wc-node node-a">CLIENT</span><span className="wc-node node-b">R1</span><span className="wc-node node-c">R2</span><span className="wc-node node-d">SERVER</span>
    <i className="wc-wire wire-a"/><i className="wc-wire wire-b"/><i className="wc-wire wire-c"/>
    <b className="wc-packet">0101</b><small>PACKET PATH / 04 HOPS</small>
  </div>

  return <div className="wc-artifact wc-kernel" aria-hidden="true">
    <div><span>USER SPACE</span><small>APP_01&nbsp;&nbsp; APP_02</small></div>
    <b><span>KERNEL</span><small>SYSCALL 04 &gt; SCHEDULER</small></b>
    <div><span>HARDWARE</span><small>CPU&nbsp;&nbsp; MEMORY&nbsp;&nbsp; I/O</small></div>
    <i>SYSTEM BOUNDARY</i>
  </div>
}

export function PortfolioHome() {
  return <div className="working-copy">
    <a className="wc-skip" href="#work">Skip to selected work</a>
    <header className="wc-header">
      <a className="wc-name" href="#top"><strong>Spencer Le Bleu</strong><span>CS student / software developer</span></a>
      <nav aria-label="Portfolio navigation">
        <a href="#work">Work</a>
        <a href="#notes">About</a>
        <a href="#/student">Student desk</a>
        <a href="https://github.com/DorkWitAFork" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
    </header>

    <main id="top">
      <section className="wc-hero" aria-labelledby="wc-title">
        <aside className="wc-margin-note">
          <span>WORKING COPY</span>
          <b>09 / 2026</b>
          <small>Sacramento, CA<br/>File SLB-01</small>
        </aside>
        <div className="wc-hero-copy">
          <p className="wc-pencil">Notes from the current desk.</p>
          <h1 id="wc-title">When I want to understand something, I usually <em>build a tool for it.</em></h1>
          <div className="wc-intro">
            <p>I am a computer science student working across C++, TypeScript, React, and the parts in between. Most projects here began with something I wanted to understand well enough to rebuild.</p>
            <a href="#work">Open the files <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="wc-registration" aria-hidden="true"><i/><i/><span>NOT FOR FILING</span></div>
      </section>

      <section className="wc-work" id="work" aria-labelledby="work-heading">
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

      <section className="wc-desk" aria-labelledby="desk-heading">
        <div className="wc-desk-index"><span>DRAWER B</span><b>STUDY<br/>MATERIAL</b><small>2 active course tools</small></div>
        <div>
          <span className="wc-pencil">The student desk</span>
          <h2 id="desk-heading">The tools are open.</h2>
          <p>The networking and operating-systems projects are also usable study spaces. Lessons, exercises, reference sheets, and progress tracking all run in the browser.</p>
          <a className="wc-heavy-link" href="#/student">Browse the course tools <span aria-hidden="true">→</span></a>
        </div>
      </section>

      <section className="wc-notes" id="notes" aria-labelledby="notes-heading">
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
    </main>

    <footer className="wc-footer"><span>Spencer Le Bleu / Sacramento, CA</span><a href="#top">Back to first page ↑</a><span>Portfolio set in system type</span></footer>
  </div>
}

export function StudentLibrary() {
  return <div className="portfolio-shell library-shell">
    <SiteHeader />
    <main className="library-page">
      <header className="library-heading"><div><span className="folio-index">STUDENT DESK / FALL 2026</span><h1>Choose a<br/><em>field guide.</em></h1></div><p>Course notes transformed into focused lessons, interactive practice, and quick reference material. Progress stays in your browser.</p></header>
      <section className="course-grid" aria-label="Available courses">
        <a className="course-card network-course" href="#/student/csc138/dashboard"><div className="course-card-top"><span>CSC 138</span><i>AVAILABLE</i></div><div className="course-art network-art"><span/><span/><span/><span/></div><div className="course-card-copy"><small>COMPUTER NETWORK FUNDAMENTALS</small><h2>Follow the<br/>packet.</h2><p>Dr. Bang Tran · Chapter 1</p></div><span className="course-launch">Open Network Lab <Icon name="arrow"/></span></a>
        <a className="course-card os-course" href="#/student/csc139/dashboard"><div className="course-card-top"><span>CSC 139</span><i>NEW</i></div><div className="course-art os-art"><span>USER</span><b>KERNEL</b><span>HARDWARE</span></div><div className="course-card-copy"><small>OPERATING SYSTEM PRINCIPLES</small><h2>Trust the<br/>kernel.</h2><p>Prof. Tarek Sakakini · Chapter 1</p></div><span className="course-launch">Open OS Lab <Icon name="arrow"/></span></a>
      </section>
    </main>
  </div>
}
