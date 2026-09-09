import { Icon } from './Icons'

function SiteHeader() {
  return <header className="site-header">
    <a className="site-wordmark" href="#/"><span>SLB</span><div><strong>SPENCER LE BLEU</strong><small>COMPUTER SCIENCE + SOFTWARE</small></div></a>
    <a className="site-home-link" href="#/">Home</a>
  </header>
}

function AudienceGlyph({ type }: { type: 'student' | 'professor' | 'recruiter' }) {
  if (type === 'student') return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 38 50 18l38 20-38 20-38-20Z"/><path d="M27 48v22c13 12 33 12 46 0V48M87 40v27"/></svg>
  if (type === 'professor') return <svg viewBox="0 0 100 100" aria-hidden="true"><rect x="15" y="20" width="70" height="55" rx="3"/><path d="M28 35h44M28 47h27M28 59h36M40 85h20M50 75v10"/></svg>
  return <svg viewBox="0 0 100 100" aria-hidden="true"><rect x="15" y="28" width="70" height="54" rx="5"/><path d="M38 28v-8h24v8M15 48h70M42 47v7h16v-7"/></svg>
}

export function PortfolioHome() {
  return <div className="portfolio-shell">
    <SiteHeader />
    <main className="welcome-page">
      <section className="welcome-intro">
        <span className="folio-index">PORTFOLIO / 2026</span>
        <div className="welcome-title"><p>Hello, I am</p><h1>Spencer<br/><em>Le Bleu.</em></h1></div>
        <p className="welcome-descriptor">Computer Science Student<br/>and Software Developer</p>
      </section>
      <section className="audience-section" aria-labelledby="audience-heading">
        <div className="audience-prompt"><span>CHOOSE YOUR PATH</span><h2 id="audience-heading">Hello! Are you a:</h2></div>
        <div className="audience-grid">
          <a href="#/student" className="audience-card audience-student"><span className="card-number">01</span><div className="audience-glyph"><AudienceGlyph type="student"/></div><div><h3>Student</h3><p>Open study guides, interactive lessons, and practice labs for my computer science courses.</p></div><span className="card-action">Explore courses <Icon name="arrow" size={18}/></span></a>
          <a href="#/professor" className="audience-card"><span className="card-number">02</span><div className="audience-glyph"><AudienceGlyph type="professor"/></div><div><h3>Professor</h3><p>Review coursework, assignment projects, and future academic work.</p></div><span className="card-action">View academic work <Icon name="arrow" size={18}/></span></a>
          <a href="#/recruiter" className="audience-card"><span className="card-number">03</span><div className="audience-glyph"><AudienceGlyph type="recruiter"/></div><div><h3>Hiring Professional</h3><p>Discover selected software projects, technical skills, and my resume.</p></div><span className="card-action">View portfolio <Icon name="arrow" size={18}/></span></a>
        </div>
      </section>
    </main>
    <footer className="portfolio-footer"><span>SACRAMENTO, CA</span><strong>BUILDING SYSTEMS WITH PURPOSE.</strong><span>FALL 2026</span></footer>
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

export function AudiencePage({ audience }: { audience: 'professor' | 'recruiter' }) {
  const professor = audience === 'professor'
  return <div className="portfolio-shell teaser-shell">
    <SiteHeader />
    <main className="teaser-page">
      <span className="folio-index">{professor ? 'ACADEMIC WORK' : 'PROFESSIONAL PORTFOLIO'} / IN PROGRESS</span>
      <div className="teaser-mark">{professor ? '02' : '03'}</div>
      <h1>{professor ? <>Projects worth<br/><em>reviewing.</em></> : <>Work built to<br/><em>be useful.</em></>}</h1>
      <p>{professor ? 'Homework implementations, technical write-ups, and course projects will be collected here as they are completed.' : 'Selected software projects, case studies, and resume materials are being prepared for this space.'}</p>
      <div className="teaser-status"><span/><strong>Portfolio section in development</strong></div>
      <a className="button button-gold" href="#/">Return home <Icon name="arrow"/></a>
    </main>
  </div>
}
