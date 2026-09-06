import { useEffect, useState } from 'react'
import { glossary, lessons, semesterWeeks } from './data/course'
import { emptyProgress, loadProgress, saveProgress } from './lib/progress'
import type { Progress, View } from './types'
import { Icon } from './components/Icons'
import { NetworkDiagram } from './components/NetworkDiagram'
import { Practice } from './components/Practice'

const views: Array<{ id: View; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'roadmap', label: 'Semester plan', icon: 'roadmap' },
  { id: 'chapter1', label: 'Chapter 1', icon: 'book' },
  { id: 'practice', label: 'Practice', icon: 'practice' },
  { id: 'reference', label: 'Reference', icon: 'reference' },
]

function useNavigation() {
  const validViews = views.map(view => view.id)
  const fromHash = (): View => {
    const hash = window.location.hash.replace('#/', '').split('/')[0] as View
    return validViews.includes(hash) ? hash : 'dashboard'
  }
  const [view, setView] = useState<View>(fromHash)
  useEffect(() => {
    const update = () => setView(fromHash())
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  const navigate = (next: View) => { window.location.hash = `/${next}`; setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return [view, navigate] as const
}

function ProgressRing({ value, size = 108 }: { value: number; size?: number }) {
  const radius = 42
  const circumference = Math.PI * 2 * radius
  return <div className="progress-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100"><circle className="ring-track" cx="50" cy="50" r={radius}/><circle className="ring-value" cx="50" cy="50" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}/></svg>
    <strong>{Math.round(value)}<small>%</small></strong>
  </div>
}

function Dashboard({ progress, navigate }: { progress: Progress; navigate: (view: View) => void }) {
  const percent = (progress.completedLessons.length / lessons.length) * 100
  const nextLesson = lessons.find(lesson => !progress.completedLessons.includes(lesson.id)) ?? lessons[0]
  return <div className="page dashboard-page">
    <section className="hero">
      <div className="hero-copy"><span className="kicker light">CSC 138 / Fall 2026</span><h1>See the system.<br/><em>Follow the packet.</em></h1><p>A self-study field guide to computer networks, built around Dr. Bang Tran’s top-down course sequence.</p><div className="hero-actions"><button className="button button-gold" onClick={() => navigate('chapter1')}>Continue Chapter 1 <Icon name="arrow"/></button><button className="button button-outline" onClick={() => navigate('roadmap')}>View semester plan</button></div></div>
      <div className="hero-visual"><div className="signal-tag tag-one">HTTP</div><div className="signal-tag tag-two">PACKET 0111</div><NetworkDiagram/></div>
    </section>
    <section className="status-strip">
      <div><span>Course</span><strong>CSC 138-02</strong></div><div><span>Meets</span><strong>Tue / Thu · 12:00</strong></div><div><span>Current module</span><strong>01 · Introduction</strong></div><div><span>Instruction ends</span><strong>Dec 11</strong></div>
    </section>
    <section className="dashboard-grid">
      <article className="continue-card">
        <div className="section-label"><span>UP NEXT</span><small>{nextLesson.minutes} MIN</small></div><span className="lesson-index">LESSON {nextLesson.number}</span><h2>{nextLesson.title}</h2><p>{nextLesson.summary}</p><button className="circle-button" aria-label={`Open ${nextLesson.title}`} onClick={() => navigate('chapter1')}><Icon name="arrow" size={27}/></button>
      </article>
      <article className="progress-card"><div><span className="section-label-text">CHAPTER PROGRESS</span><h2>Build the foundation.</h2><p>{progress.completedLessons.length} of {lessons.length} lessons complete</p></div><ProgressRing value={percent}/><div className="progress-line"><i style={{ width: `${percent}%` }}/></div></article>
      <article className="field-note"><span className="section-label-text">FIELD NOTE 01</span><blockquote>“The Internet is not one network. It is an agreement among many networks to move packets.”</blockquote><small>CORE IDEA · SLIDES 4-7</small></article>
    </section>
    <section className="module-preview"><div className="module-heading"><div><span className="kicker">Current module</span><h2>Introduction to Networks</h2></div><p>Seven focused lessons take you from the Internet’s edge, through its core, and into the economics that connect it all.</p></div><div className="lesson-rail">{lessons.slice(0, 4).map(lesson => <button key={lesson.id} onClick={() => navigate('chapter1')} className={progress.completedLessons.includes(lesson.id) ? 'complete' : ''}><span>{lesson.number}</span><strong>{lesson.title}</strong><small>{lesson.minutes} min</small>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={16}/>}</button>)}</div></section>
  </div>
}

function Roadmap({ navigate }: { navigate: (view: View) => void }) {
  return <div className="page roadmap-page">
    <header className="page-heading"><div><span className="kicker">15-week field map</span><h1>From applications<br/>down to the wire.</h1></div><p>The course follows a top-down path through the protocol stack. Timing after Chapter 1 remains provisional until the syllabus and later lecture decks are available.</p></header>
    <div className="roadmap-notice"><strong>Source status</strong><span>Chapter 1 is aligned to the uploaded lecture deck. Modules 2-8 are planning placeholders based on the course homepage.</span></div>
    <section className="timeline">{semesterWeeks.map(([week, title, chapter, status, detail], index) => <article key={week} className={status === 'Available' ? 'available' : ''}>
      <div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div><div className="week"><small>WEEK</small><strong>{week}</strong></div><div className="timeline-copy"><div><span>{chapter}</span><i>{status}</i></div><h2>{title}</h2><p>{detail}</p>{status === 'Available' && <button className="text-link" onClick={() => navigate('chapter1')}>Open module <Icon name="arrow" size={16}/></button>}</div>
    </article>)}</section>
    <section className="assessment-band"><div><span>30%</span><strong>Midterm</strong></div><div><span>35%</span><strong>Final</strong></div><div><span>15%</span><strong>Labs</strong></div><div><span>15%</span><strong>Socket programming</strong></div><div><span>5%</span><strong>Quizzes</strong></div></section>
  </div>
}

function Chapter({ progress, completeLesson, navigate }: { progress: Progress; completeLesson: (id: string) => void; navigate: (view: View) => void }) {
  const [selectedId, setSelectedId] = useState(() => lessons.find(lesson => !progress.completedLessons.includes(lesson.id))?.id ?? lessons[0].id)
  const selected = lessons.find(lesson => lesson.id === selectedId)!
  const isComplete = progress.completedLessons.includes(selected.id)
  return <div className="page chapter-page">
    <header className="chapter-header"><div><span className="kicker light">Module 01 · Introduction</span><h1>The Internet,<br/>piece by piece.</h1><p>Build a working mental model before later chapters zoom into each protocol layer.</p></div><NetworkDiagram compact/></header>
    <div className="chapter-layout">
      <aside className="lesson-sidebar"><div className="sidebar-title"><span>CHAPTER 1</span><b>{progress.completedLessons.length}/{lessons.length}</b></div>{lessons.map(lesson => <button key={lesson.id} className={`${selected.id === lesson.id ? 'active' : ''} ${progress.completedLessons.includes(lesson.id) ? 'complete' : ''}`} onClick={() => { setSelectedId(lesson.id); window.scrollTo({ top: 300, behavior: 'smooth' }) }}><span>{lesson.number}</span><div><strong>{lesson.title}</strong><small><Icon name="clock" size={13}/>{lesson.minutes} min</small></div>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={18}/>}</button>)}</aside>
      <main className="lesson-content">
        <header className="lesson-header"><span>{selected.eyebrow}</span><h2>{selected.title}</h2><p>{selected.summary}</p><div className="source-pill">SOURCE · {selected.source.toUpperCase()}</div></header>
        <section className="objectives"><span>AFTER THIS LESSON, YOU CAN</span><ul>{selected.objectives.map(objective => <li key={objective}><Icon name="check" size={17}/>{objective}</li>)}</ul></section>
        {selected.sections.map((section, index) => <section className="reading-section" key={section.title}><div className="reading-number">{String(index + 1).padStart(2, '0')}</div><div><h3>{section.title}</h3><p>{section.body}</p>{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}</div></section>)}
        <section className="terms-block"><span>KEY TERMS</span><div>{selected.keyTerms.map(term => <i key={term}>{term}</i>)}</div></section>
        <footer className="lesson-footer"><button className={`button ${isComplete ? 'button-complete' : ''}`} onClick={() => completeLesson(selected.id)}><Icon name="check"/>{isComplete ? 'Lesson complete' : 'Mark lesson complete'}</button><button className="button button-ghost" onClick={() => navigate('practice')}>Open practice lab <Icon name="arrow"/></button></footer>
      </main>
    </div>
  </div>
}

function Reference({ reset }: { reset: () => void }) {
  return <div className="page reference-page">
    <header className="page-heading"><div><span className="kicker">Quick reference</span><h1>Terms, formulas,<br/>and source notes.</h1></div><p>Use this compact reference while solving exercises. Definitions follow the terminology used in the uploaded Chapter 1 deck.</p></header>
    <section className="reference-grid"><article><span className="section-label-text">ESSENTIAL FORMULA</span><div className="big-formula"><i>d<sub>trans</sub></i><b>=</b><span>L<em>R</em></span></div><p><strong>L</strong> is packet length in bits. <strong>R</strong> is link rate in bits per second. The result is measured in seconds.</p></article><article><span className="section-label-text">UNIT LADDER</span><div className="unit-list"><span><b>1 Kbit</b>1,000 bits</span><span><b>1 Mbit</b>1,000,000 bits</span><span><b>1 Gbit</b>1,000,000,000 bits</span><span><b>1 ms</b>0.001 seconds</span></div></article></section>
    <section className="glossary"><div className="section-title"><span>CHAPTER 1</span><h2>Core vocabulary</h2></div><div className="glossary-list">{glossary.map(([term, definition], index) => <article key={term}><span>{String(index + 1).padStart(2, '0')}</span><strong>{term}</strong><p>{definition}</p></article>)}</div></section>
    <section className="sources"><div><span className="section-label-text">COURSE SOURCES</span><h2>Built from your materials.</h2></div><ul><li><strong>Chapter1-Introduction.pdf</strong><span>Primary source for detailed lesson scope, terminology, formulas, and sequence.</span></li><li><strong>CSC138 Computer Network Fundamentals - SECTION 02.pdf</strong><span>Course details, outcomes, grading weights, dates, and semester-level topic list.</span></li><li><strong>Computer Networking: A Top-Down Approach</strong><span>Kurose and Ross, 8th edition. Supporting context only; lesson text is original.</span></li></ul></section>
    <button className="reset-button" onClick={reset}><Icon name="reset"/> Reset all browser progress</button>
  </div>
}

export default function App() {
  const [view, navigate] = useNavigation()
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { saveProgress(progress) }, [progress])
  useEffect(() => { setProgress(current => ({ ...current, lastVisited: view })); setMobileOpen(false) }, [view])

  const completeLesson = (id: string) => setProgress(current => ({ ...current, completedLessons: current.completedLessons.includes(id) ? current.completedLessons : [...current.completedLessons, id] }))
  const completeActivity = (id: string) => setProgress(current => ({ ...current, completedActivities: current.completedActivities.includes(id) ? current.completedActivities : [...current.completedActivities, id] }))
  const recordQuiz = (score: number) => setProgress(current => ({ ...current, quizAttempts: current.quizAttempts + 1, bestQuizScore: Math.max(current.bestQuizScore, score) }))
  const reset = () => { if (window.confirm('Reset completed lessons, labs, and quiz scores?')) setProgress(emptyProgress) }

  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => navigate('dashboard')}><span className="brand-mark"><i/><i/><i/></span><span><b>NETWORK</b><small>CSC 138 FIELD LAB</small></span></button><nav className={mobileOpen ? 'open' : ''} aria-label="Primary navigation">{views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav><div className="topbar-meta"><span>FALL</span><b>2026</b></div><button className="menu-button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}><i/><i/><i/></button></header>
    <main>{view === 'dashboard' && <Dashboard progress={progress} navigate={navigate}/>} {view === 'roadmap' && <Roadmap navigate={navigate}/>} {view === 'chapter1' && <Chapter progress={progress} completeLesson={completeLesson} navigate={navigate}/>} {view === 'practice' && <Practice completedActivities={progress.completedActivities} completeActivity={completeActivity} recordQuiz={recordQuiz}/>} {view === 'reference' && <Reference reset={reset}/>}</main>
    <footer className="site-footer"><div><span className="brand-mark small"><i/><i/><i/></span><strong>CSC 138 NETWORK LAB</strong></div><span>Independent study companion · Sacramento State · Fall 2026</span><small>Progress stays in this browser.</small></footer>
  </div>
}
