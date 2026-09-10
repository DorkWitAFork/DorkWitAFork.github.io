import { useEffect, useState } from 'react'
import { csc138ChapterList, csc138Chapters, type Csc138Chapter } from '../data/csc138Course'
import { semesterWeeks } from '../data/course'
import { emptyProgress, loadProgress, saveProgress } from '../lib/progress'
import type { SiteRoute } from '../lib/router'
import type { Csc138ChapterId, Csc138Progress, Csc138View } from '../types'
import { Icon } from './Icons'
import { NetworkDiagram } from './NetworkDiagram'
import { Practice } from './Practice'

type Csc138Route = Extract<SiteRoute, { section: 'course'; course: 'csc138' }>
type Navigate = (view: Csc138View, chapter?: Csc138ChapterId) => void

const views: Array<{ id: Csc138View; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'roadmap', label: 'Semester plan', icon: 'roadmap' },
  { id: 'chapter1', label: 'Chapter 1', icon: 'book' },
  { id: 'chapter2', label: 'Chapter 2', icon: 'book' },
  { id: 'practice', label: 'Practice', icon: 'practice' },
  { id: 'reference', label: 'Reference', icon: 'reference' },
]

function ProgressRing({ value, size = 108 }: { value: number; size?: number }) {
  const radius = 42
  const circumference = Math.PI * 2 * radius
  return <div className="progress-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100"><circle className="ring-track" cx="50" cy="50" r={radius}/><circle className="ring-value" cx="50" cy="50" r={radius} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}/></svg>
    <strong>{Math.round(value)}<small>%</small></strong>
  </div>
}

function chapterCompletedCount(progress: Csc138Progress, chapter: Csc138Chapter) {
  return chapter.lessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length
}

function Dashboard({ progress, navigate }: { progress: Csc138Progress; navigate: Navigate }) {
  const lessonQueue = csc138ChapterList.flatMap(chapter => chapter.lessons.map(lesson => ({ chapter, lesson })))
  const next = lessonQueue.find(item => !progress.completedLessons.includes(item.lesson.id)) ?? lessonQueue[0]
  const completedCount = lessonQueue.filter(item => progress.completedLessons.includes(item.lesson.id)).length
  const percent = (completedCount / lessonQueue.length) * 100
  const chapterCount = chapterCompletedCount(progress, next.chapter)

  return <div className="page dashboard-page">
    <section className="hero">
      <div className="hero-copy"><span className="kicker light">CSC 138 / Fall 2026</span><h1>See the system.<br/><em>Follow the packet.</em></h1><p>A self-study field guide to computer networks, built around Dr. Bang Tran's top-down course sequence.</p><div className="hero-actions"><button className="button button-gold" onClick={() => navigate(next.chapter.id)}>Continue Chapter {next.chapter.number} <Icon name="arrow"/></button><button className="button button-outline" onClick={() => navigate('roadmap')}>View semester plan</button></div></div>
      <div className="hero-visual"><div className="signal-tag tag-one">HTTP</div><div className="signal-tag tag-two">PACKET 0111</div><NetworkDiagram/></div>
    </section>
    <section className="status-strip">
      <div><span>Course</span><strong>CSC 138-02</strong></div><div><span>Meets</span><strong>Tue / Thu · 12:00</strong></div><div><span>Up next</span><strong>0{next.chapter.number} · {next.chapter.title}</strong></div><div><span>Instruction ends</span><strong>Dec 11</strong></div>
    </section>
    <section className="dashboard-grid">
      <article className="continue-card"><div className="section-label"><span>UP NEXT</span><small>{next.lesson.minutes} MIN</small></div><span className="lesson-index">CH {next.chapter.number} · LESSON {next.lesson.number}</span><h2>{next.lesson.title}</h2><p>{next.lesson.summary}</p><button className="circle-button" aria-label={`Open ${next.lesson.title}`} onClick={() => navigate(next.chapter.id)}><Icon name="arrow" size={27}/></button></article>
      <article className="progress-card"><div><span className="section-label-text">COURSE PROGRESS</span><h2>Build the foundation.</h2><p>{completedCount} of {lessonQueue.length} available lessons complete</p></div><ProgressRing value={percent}/><div className="progress-line"><i style={{ width: `${percent}%` }}/></div></article>
      <article className="field-note"><span className="section-label-text">FIELD NOTE 02</span><blockquote>“HTTP is stateless. Cookies, caches, and transport connections add the continuity and speed users expect.”</blockquote><small>APPLICATION LAYER · CHAPTER 2</small></article>
    </section>
    <section className="module-preview"><div className="module-heading"><div><span className="kicker">Current module</span><h2>{next.chapter.title}</h2></div><p>{next.chapter.summary}</p></div><div className="lesson-rail">{next.chapter.lessons.slice(0, 4).map(lesson => <button key={lesson.id} onClick={() => navigate(next.chapter.id)} className={progress.completedLessons.includes(lesson.id) ? 'complete' : ''}><span>{lesson.number}</span><strong>{lesson.title}</strong><small>{lesson.minutes} min</small>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={16}/>}</button>)}</div><p className="module-progress-note">{chapterCount} of {next.chapter.lessons.length} lessons complete in this module</p></section>
  </div>
}

function Roadmap({ navigate }: { navigate: Navigate }) {
  return <div className="page roadmap-page">
    <header className="page-heading"><div><span className="kicker">15-week field map</span><h1>From applications<br/>down to the wire.</h1></div><p>The course follows a top-down path through the protocol stack. Chapters 1 and 2 follow the uploaded lecture decks; later timing remains provisional.</p></header>
    <div className="roadmap-notice"><strong>Source status</strong><span>Chapters 1 and 2 are aligned to uploaded lecture decks. Modules 3-8 remain planning placeholders.</span></div>
    <section className="timeline">{semesterWeeks.map(([week, title, chapter, status, detail], index) => {
      const route = chapter === 'Chapter 1' ? 'chapter1' : chapter === 'Chapter 2' ? 'chapter2' : undefined
      return <article key={week} className={status === 'Available' ? 'available' : ''}><div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div><div className="week"><small>WEEK</small><strong>{week}</strong></div><div className="timeline-copy"><div><span>{chapter}</span><i>{status}</i></div><h2>{title}</h2><p>{detail}</p>{route && <button className="text-link" onClick={() => navigate(route)}>Open module <Icon name="arrow" size={16}/></button>}</div></article>
    })}</section>
    <section className="assessment-band"><div><span>30%</span><strong>Midterm</strong></div><div><span>35%</span><strong>Final</strong></div><div><span>15%</span><strong>Labs</strong></div><div><span>15%</span><strong>Socket programming</strong></div><div><span>5%</span><strong>Quizzes</strong></div></section>
  </div>
}

function Chapter({ chapter, progress, completeLesson, navigate }: { chapter: Csc138Chapter; progress: Csc138Progress; completeLesson: (id: string) => void; navigate: Navigate }) {
  const [selectedId, setSelectedId] = useState(() => chapter.lessons.find(lesson => !progress.completedLessons.includes(lesson.id))?.id ?? chapter.lessons[0].id)
  const selected = chapter.lessons.find(lesson => lesson.id === selectedId) ?? chapter.lessons[0]
  const isComplete = progress.completedLessons.includes(selected.id)
  const completedCount = chapterCompletedCount(progress, chapter)

  return <div className="page chapter-page">
    <header className="chapter-header"><div><span className="kicker light">{chapter.moduleLabel}</span><h1>{chapter.tagline}</h1><p>{chapter.summary}</p></div><NetworkDiagram compact/></header>
    <div className="chapter-layout">
      <aside className="lesson-sidebar"><div className="sidebar-title"><span>CHAPTER {chapter.number}</span><b>{completedCount}/{chapter.lessons.length}</b></div>{chapter.lessons.map(lesson => <button key={lesson.id} className={`${selected.id === lesson.id ? 'active' : ''} ${progress.completedLessons.includes(lesson.id) ? 'complete' : ''}`} onClick={() => { setSelectedId(lesson.id); window.scrollTo({ top: 300, behavior: 'smooth' }) }}><span>{lesson.number}</span><div><strong>{lesson.title}</strong><small><Icon name="clock" size={13}/>{lesson.minutes} min</small></div>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={18}/>}</button>)}</aside>
      <main className="lesson-content">
        <header className="lesson-header"><span>{selected.eyebrow}</span><h2>{selected.title}</h2><p>{selected.summary}</p><div className="source-pill">SOURCE · {selected.source.toUpperCase()}</div></header>
        <section className="objectives"><span>AFTER THIS LESSON, YOU CAN</span><ul>{selected.objectives.map(objective => <li key={objective}><Icon name="check" size={17}/>{objective}</li>)}</ul></section>
        {selected.sections.map((section, index) => <section className="reading-section" key={section.title}><div className="reading-number">{String(index + 1).padStart(2, '0')}</div><div><h3>{section.title}</h3><p>{section.body}</p>{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}</div></section>)}
        <section className="terms-block"><span>KEY TERMS</span><div>{selected.keyTerms.map(term => <i key={term}>{term}</i>)}</div></section>
        <footer className="lesson-footer"><button className={`button ${isComplete ? 'button-complete' : ''}`} onClick={() => completeLesson(selected.id)}><Icon name="check"/>{isComplete ? 'Lesson complete' : 'Mark lesson complete'}</button><button className="button button-ghost" onClick={() => navigate('practice', chapter.id)}>Open practice lab <Icon name="arrow"/></button></footer>
      </main>
    </div>
  </div>
}

function Reference({ chapter, selectChapter, reset }: { chapter: Csc138Chapter; selectChapter: (chapter: Csc138ChapterId) => void; reset: () => void }) {
  const isChapter2 = chapter.id === 'chapter2'
  return <div className="page reference-page">
    <header className="page-heading"><div><span className="kicker">Chapter {chapter.number} quick reference</span><h1>Terms, formulas,<br/>and source notes.</h1></div><p>Use this compact reference while solving exercises. Definitions follow the terminology in the uploaded Chapter {chapter.number} deck.</p></header>
    <div className="chapter-switch" aria-label="Reference chapter"><button className={!isChapter2 ? 'active' : ''} onClick={() => selectChapter('chapter1')}>Chapter 1</button><button className={isChapter2 ? 'active' : ''} onClick={() => selectChapter('chapter2')}>Chapter 2</button></div>
    {!isChapter2 ? <section className="reference-grid"><article><span className="section-label-text">ESSENTIAL FORMULA</span><div className="big-formula"><i>d<sub>trans</sub></i><b>=</b><span>L<em>R</em></span></div><p><strong>L</strong> is packet length in bits. <strong>R</strong> is link rate in bits per second. The result is measured in seconds.</p></article><article><span className="section-label-text">UNIT LADDER</span><div className="unit-list"><span><b>1 Kbit</b>1,000 bits</span><span><b>1 Mbit</b>1,000,000 bits</span><span><b>1 Gbit</b>1,000,000,000 bits</span><span><b>1 ms</b>0.001 seconds</span></div></article></section> : <section className="reference-grid"><article><span className="section-label-text">HTTP RESPONSE TIME</span><div className="reference-equation">2RTT + transmission time</div><p>For one object over non-persistent HTTP: one RTT establishes TCP, a second carries the request and initial response, then the object is transmitted.</p></article><article><span className="section-label-text">CACHE RELATIONSHIPS</span><div className="unit-list"><span><b>Miss traffic</b>(1 - hit rate) × offered rate</span><span><b>Utilization</b>miss traffic / access rate</span><span><b>Average delay</b>miss × origin + hit × cache</span><span><b>Fresh object</b>304 Not Modified</span></div></article></section>}
    {isChapter2 && <section className="protocol-reference"><article><span>HTTP METHODS</span><p><b>GET</b> retrieve · <b>POST</b> submit body · <b>HEAD</b> headers only · <b>PUT</b> replace resource</p></article><article><span>COMMON STATUS</span><p><b>200</b> success · <b>301</b> moved · <b>400</b> bad request · <b>404</b> missing · <b>505</b> unsupported version</p></article></section>}
    <section className="glossary"><div className="section-title"><span>CHAPTER {chapter.number}</span><h2>Core vocabulary</h2></div><div className="glossary-list">{chapter.glossary.map(([term, definition], index) => <article key={term}><span>{String(index + 1).padStart(2, '0')}</span><strong>{term}</strong><p>{definition}</p></article>)}</div></section>
    <section className="sources"><div><span className="section-label-text">COURSE SOURCES</span><h2>Built from your materials.</h2></div><ul><li><strong>{isChapter2 ? 'Chapter2-Application-Principles of network applications-Web.pdf' : 'Chapter1-Introduction.pdf'}</strong><span>Primary source for lesson scope, terminology, formulas, and sequence.</span></li><li><strong>CSC138 Computer Network Fundamentals - SECTION 02.pdf</strong><span>Course details, outcomes, grading weights, dates, and semester-level topic list.</span></li><li><strong>Computer Networking: A Top-Down Approach</strong><span>Kurose and Ross, 8th edition. Supporting context only; lesson text is original.</span></li></ul></section>
    <button className="reset-button" onClick={reset}><Icon name="reset"/> Reset all browser progress</button>
  </div>
}

export function Csc138App({ route }: { route: Csc138Route }) {
  const { view } = route
  const activeChapterId: Csc138ChapterId = view === 'chapter2' ? 'chapter2' : view === 'chapter1' ? 'chapter1' : route.chapter ?? 'chapter1'
  const activeChapter = csc138Chapters[activeChapterId]
  const [progress, setProgress] = useState<Csc138Progress>(() => loadProgress())
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate: Navigate = (next, chapter) => {
    const suffix = (next === 'practice' || next === 'reference') && chapter === 'chapter2' ? '/chapter2' : ''
    window.location.hash = `/student/csc138/${next}${suffix}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => { saveProgress(progress) }, [progress])
  useEffect(() => {
    const location = route.chapter ? `${view}/${route.chapter}` : view
    setProgress(current => ({ ...current, lastVisited: location }))
    setMobileOpen(false)
  }, [route.chapter, view])

  const completeLesson = (id: string) => setProgress(current => current.completedLessons.includes(id) ? current : { ...current, completedLessons: [...current.completedLessons, id] })
  const completeActivity = (id: string) => setProgress(current => current.completedActivities.includes(id) ? current : { ...current, completedActivities: [...current.completedActivities, id] })
  const recordQuiz = (score: number) => setProgress(current => {
    const quiz = current.chapterQuizzes[activeChapterId]
    const nextQuiz = { attempts: quiz.attempts + 1, bestScore: Math.max(quiz.bestScore, score), total: activeChapter.quizQuestions.length }
    return {
      ...current,
      quizAttempts: activeChapterId === 'chapter1' ? nextQuiz.attempts : current.quizAttempts,
      bestQuizScore: activeChapterId === 'chapter1' ? nextQuiz.bestScore : current.bestQuizScore,
      chapterQuizzes: { ...current.chapterQuizzes, [activeChapterId]: nextQuiz },
    }
  })
  const reset = () => { if (window.confirm('Reset completed lessons, labs, and quiz scores?')) setProgress(emptyProgress) }
  const selectPracticeChapter = (chapter: Csc138ChapterId) => navigate('practice', chapter)
  const selectReferenceChapter = (chapter: Csc138ChapterId) => navigate('reference', chapter)

  return <div className="app-shell">
    <header className="topbar"><button className="brand" onClick={() => navigate('dashboard')}><span className="brand-mark"><i/><i/><i/></span><span><b>NETWORK</b><small>CSC 138 FIELD LAB</small></span></button><nav className={mobileOpen ? 'open' : ''} aria-label="Primary navigation">{views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id, (item.id === 'practice' || item.id === 'reference') ? activeChapterId : undefined)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav><button className="course-back" onClick={() => { window.location.hash = '/student' }}>All courses</button><div className="topbar-meta"><span>FALL</span><b>2026</b></div><button className="menu-button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}><i/><i/><i/></button></header>
    <main>{view === 'dashboard' && <Dashboard progress={progress} navigate={navigate}/>} {view === 'roadmap' && <Roadmap navigate={navigate}/>} {(view === 'chapter1' || view === 'chapter2') && <Chapter key={activeChapter.id} chapter={activeChapter} progress={progress} completeLesson={completeLesson} navigate={navigate}/>} {view === 'practice' && <Practice key={activeChapter.id} chapter={activeChapter} completedActivities={progress.completedActivities} completeActivity={completeActivity} recordQuiz={recordQuiz} selectChapter={selectPracticeChapter}/>} {view === 'reference' && <Reference chapter={activeChapter} selectChapter={selectReferenceChapter} reset={reset}/>}</main>
    <footer className="site-footer"><div><span className="brand-mark small"><i/><i/><i/></span><strong>CSC 138 NETWORK LAB</strong></div><span>Independent study companion · Sacramento State · Fall 2026</span><small>Progress stays in this browser.</small></footer>
  </div>
}
