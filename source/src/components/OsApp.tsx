import { useEffect, useState } from 'react'
import { osGlossary, osLessons, osSemesterWeeks } from '../data/osCourse'
import { emptyOsProgress, loadOsProgress, saveOsProgress } from '../lib/osProgress'
import type { Progress, View } from '../types'
import { Icon } from './Icons'
import { OsDiagram } from './OsDiagram'
import { OsPractice } from './OsPractice'

const views: Array<{ id: View; label: string; icon: string }> = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'roadmap', label: 'Semester plan', icon: 'roadmap' },
  { id: 'chapter1', label: 'Chapter 1', icon: 'book' },
  { id: 'practice', label: 'Practice', icon: 'practice' },
  { id: 'reference', label: 'Reference', icon: 'reference' },
]

function useOsNavigation() {
  const validViews = views.map(view => view.id)
  const fromHash = (): View => {
    const hash = window.location.hash.replace('#/', '').split('/')[2] as View
    return validViews.includes(hash) ? hash : 'dashboard'
  }
  const [view, setView] = useState<View>(fromHash)
  useEffect(() => { const update = () => setView(fromHash()); window.addEventListener('hashchange', update); return () => window.removeEventListener('hashchange', update) }, [])
  const navigate = (next: View) => { window.location.hash = `/student/csc139/${next}`; setView(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return [view, navigate] as const
}

function ProgressRing({ value }: { value: number }) {
  const circumference = Math.PI * 2 * 42
  return <div className="progress-ring" style={{ width: 108, height: 108 }}><svg viewBox="0 0 100 100"><circle className="ring-track" cx="50" cy="50" r="42"/><circle className="ring-value" cx="50" cy="50" r="42" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)}/></svg><strong>{Math.round(value)}<small>%</small></strong></div>
}

function OsDashboard({ progress, navigate }: { progress: Progress; navigate: (view: View) => void }) {
  const percent = progress.completedLessons.length / osLessons.length * 100
  const nextLesson = osLessons.find(lesson => !progress.completedLessons.includes(lesson.id)) ?? osLessons[0]
  return <div className="page dashboard-page os-page">
    <section className="hero os-hero"><div className="hero-copy"><span className="kicker light">CSC 139 / FALL 2026</span><h1>Share the machine.<br/><em>Trust the kernel.</em></h1><p>An interactive field guide to operating systems, built around Prof. Tarek Sakakini's course sequence and Chapter 1 lectures.</p><div className="hero-actions"><button className="button button-gold" onClick={() => navigate('chapter1')}>Continue Chapter 1 <Icon name="arrow"/></button><button className="button button-outline" onClick={() => navigate('roadmap')}>View semester plan</button></div></div><div className="hero-visual os-visual"><div className="signal-tag tag-one">MODE BIT 0</div><div className="signal-tag tag-two">INTERRUPT 0x20</div><OsDiagram/></div></section>
    <section className="status-strip"><div><span>Course</span><strong>CSC 139</strong></div><div><span>Meets</span><strong>Tue / Thu · 1:30 PM</strong></div><div><span>Current module</span><strong>01 · Introduction</strong></div><div><span>Instruction ends</span><strong>Dec 11</strong></div></section>
    <section className="dashboard-grid"><article className="continue-card"><div className="section-label"><span>UP NEXT</span><small>{nextLesson.minutes} MIN</small></div><span className="lesson-index">LESSON {nextLesson.number}</span><h2>{nextLesson.title}</h2><p>{nextLesson.summary}</p><button className="circle-button" aria-label={`Open ${nextLesson.title}`} onClick={() => navigate('chapter1')}><Icon name="arrow" size={27}/></button></article><article className="progress-card"><div><span className="section-label-text">CHAPTER PROGRESS</span><h2>Own the control model.</h2><p>{progress.completedLessons.length} of {osLessons.length} lessons complete</p></div><ProgressRing value={percent}/><div className="progress-line"><i style={{ width: `${percent}%` }}/></div></article><article className="field-note"><span className="section-label-text">KERNEL NOTE 01</span><blockquote>“One machine, shared safely.”</blockquote><small>THE THREAD THROUGH CHAPTER 1</small></article></section>
    <section className="module-preview"><div className="module-heading"><div><span className="kicker">Current module</span><h2>Operating-System Foundations</h2></div><p>Five focused lessons connect hardware events, privilege, resource management, and virtual execution environments.</p></div><div className="lesson-rail os-lesson-rail">{osLessons.map(lesson => <button key={lesson.id} onClick={() => navigate('chapter1')} className={progress.completedLessons.includes(lesson.id) ? 'complete' : ''}><span>{lesson.number}</span><strong>{lesson.title}</strong><small>{lesson.minutes} min</small>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={16}/>}</button>)}</div></section>
  </div>
}

function OsRoadmap({ navigate }: { navigate: (view: View) => void }) {
  return <div className="page roadmap-page os-page"><header className="page-heading"><div><span className="kicker">Semester control map</span><h1>From the kernel<br/>to the file system.</h1></div><p>The syllabus moves from processes and scheduling through synchronization, memory, storage, and file-system implementation.</p></header><div className="roadmap-notice"><strong>Source status</strong><span>Chapter 1 is aligned to the uploaded lecture deck. Later modules follow the tentative syllabus schedule.</span></div><section className="timeline">{osSemesterWeeks.map(([week, title, chapter, status, detail], index) => <article key={week} className={status === 'Available' ? 'available' : ''}><div className="timeline-marker"><span>{String(index + 1).padStart(2, '0')}</span></div><div className="week"><small>DATES</small><strong>{week}</strong></div><div className="timeline-copy"><div><span>{chapter}</span><i>{status}</i></div><h2>{title}</h2><p>{detail}</p>{status === 'Available' && <button className="text-link" onClick={() => navigate('chapter1')}>Open module <Icon name="arrow" size={16}/></button>}</div></article>)}</section><section className="assessment-band os-assessment"><div><span>20%</span><strong>Midterm I</strong></div><div><span>20%</span><strong>Midterm II</strong></div><div><span>30%</span><strong>Final</strong></div><div><span>10%</span><strong>Quizzes</strong></div><div><span>15%</span><strong>Coding</strong></div><div><span>5%</span><strong>Participation</strong></div></section></div>
}

function OsChapter({ progress, completeLesson, navigate }: { progress: Progress; completeLesson: (id: string) => void; navigate: (view: View) => void }) {
  const [selectedId, setSelectedId] = useState(() => osLessons.find(lesson => !progress.completedLessons.includes(lesson.id))?.id ?? osLessons[0].id)
  const selected = osLessons.find(lesson => lesson.id === selectedId)!
  const isComplete = progress.completedLessons.includes(selected.id)
  return <div className="page chapter-page os-page"><header className="chapter-header os-chapter-header"><div><span className="kicker light">MODULE 01 · INTRODUCTION</span><h1>One machine,<br/>shared safely.</h1><p>Every mechanism begins with shared hardware and programs that cannot be trusted with unrestricted control.</p></div><OsDiagram compact/></header><div className="chapter-layout"><aside className="lesson-sidebar"><div className="sidebar-title"><span>CHAPTER 1</span><b>{progress.completedLessons.length}/{osLessons.length}</b></div>{osLessons.map(lesson => <button key={lesson.id} className={`${selected.id === lesson.id ? 'active' : ''} ${progress.completedLessons.includes(lesson.id) ? 'complete' : ''}`} onClick={() => { setSelectedId(lesson.id); window.scrollTo({ top: 300, behavior: 'smooth' }) }}><span>{lesson.number}</span><div><strong>{lesson.title}</strong><small><Icon name="clock" size={13}/>{lesson.minutes} min</small></div>{progress.completedLessons.includes(lesson.id) && <Icon name="check" size={18}/>}</button>)}</aside><main className="lesson-content"><header className="lesson-header"><span>{selected.eyebrow}</span><h2>{selected.title}</h2><p>{selected.summary}</p><div className="source-pill">SOURCE · {selected.source.toUpperCase()}</div></header><section className="objectives"><span>AFTER THIS LESSON, YOU CAN</span><ul>{selected.objectives.map(objective => <li key={objective}><Icon name="check" size={17}/>{objective}</li>)}</ul></section>{selected.sections.map((section, index) => <section className="reading-section" key={section.title}><div className="reading-number">{String(index + 1).padStart(2, '0')}</div><div><h3>{section.title}</h3><p>{section.body}</p>{section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}</div></section>)}<section className="terms-block"><span>KEY TERMS</span><div>{selected.keyTerms.map(term => <i key={term}>{term}</i>)}</div></section><footer className="lesson-footer"><button className={`button ${isComplete ? 'button-complete' : ''}`} onClick={() => completeLesson(selected.id)}><Icon name="check"/>{isComplete ? 'Lesson complete' : 'Mark lesson complete'}</button><button className="button button-ghost" onClick={() => navigate('practice')}>Open practice lab <Icon name="arrow"/></button></footer></main></div></div>
}

function OsReference({ reset }: { reset: () => void }) {
  return <div className="page reference-page os-page"><header className="page-heading"><div><span className="kicker">Quick reference</span><h1>Modes, events,<br/>and core terms.</h1></div><p>Use this compact model to distinguish who has control, what caused the transition, and which resource is being managed.</p></header><section className="reference-grid os-reference-grid"><article><span className="section-label-text">PRIVILEGE MODEL</span><div className="mode-reference"><div><b>1</b><span>USER MODE</span><small>Applications run with restrictions</small></div><i>TRAP / INTERRUPT</i><div><b>0</b><span>KERNEL MODE</span><small>Privileged OS code executes</small></div></div></article><article><span className="section-label-text">EVENT TYPES</span><div className="unit-list"><span><b>Interrupt</b>Hardware · asynchronous</span><span><b>Trap</b>Software · synchronous</span><span><b>System call</b>Deliberate trap</span><span><b>Timer</b>Restores OS control</span></div></article></section><section className="glossary"><div className="section-title"><span>CHAPTER 1</span><h2>Core vocabulary</h2></div><div className="glossary-list">{osGlossary.map(([term, definition], index) => <article key={term}><span>{String(index + 1).padStart(2, '0')}</span><strong>{term}</strong><p>{definition}</p></article>)}</div></section><section className="sources"><div><span className="section-label-text">COURSE SOURCES</span><h2>Built from your materials.</h2></div><ul><li><strong>CSC139_Ch1_Introduction.pdf</strong><span>Primary source for lesson scope, terminology, check-ins, and sequence.</span></li><li><strong>Syllabus.pdf</strong><span>Course details, instructor, schedule, exams, and grading weights.</span></li><li><strong>Operating System Concepts, 10th edition</strong><span>Silberschatz, Galvin, and Gagne. Supporting context; study explanations are original.</span></li></ul></section><button className="reset-button" onClick={reset}><Icon name="reset"/> Reset CSC 139 browser progress</button></div>
}

export function OsApp() {
  const [view, navigate] = useOsNavigation()
  const [progress, setProgress] = useState<Progress>(() => loadOsProgress())
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { saveOsProgress(progress) }, [progress])
  useEffect(() => { setProgress(current => ({ ...current, lastVisited: view })); setMobileOpen(false) }, [view])
  const completeLesson = (id: string) => setProgress(current => ({ ...current, completedLessons: current.completedLessons.includes(id) ? current.completedLessons : [...current.completedLessons, id] }))
  const completeActivity = (id: string) => setProgress(current => ({ ...current, completedActivities: current.completedActivities.includes(id) ? current.completedActivities : [...current.completedActivities, id] }))
  const recordQuiz = (score: number) => setProgress(current => ({ ...current, quizAttempts: current.quizAttempts + 1, bestQuizScore: Math.max(current.bestQuizScore, score) }))
  const reset = () => { if (window.confirm('Reset completed lessons, labs, and quiz scores for CSC 139?')) setProgress(emptyOsProgress) }
  return <div className="app-shell os-shell"><header className="topbar"><button className="brand os-brand" onClick={() => navigate('dashboard')}><span className="kernel-mark"><i>1</i><i>0</i></span><span><b>KERNEL</b><small>CSC 139 OS LAB</small></span></button><nav className={mobileOpen ? 'open' : ''} aria-label="Primary navigation">{views.map(item => <button key={item.id} className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav><button className="course-back" onClick={() => { window.location.hash = '/student' }}>All courses</button><div className="topbar-meta"><span>FALL</span><b>2026</b></div><button className="menu-button" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}><i/><i/><i/></button></header><main>{view === 'dashboard' && <OsDashboard progress={progress} navigate={navigate}/>} {view === 'roadmap' && <OsRoadmap navigate={navigate}/>} {view === 'chapter1' && <OsChapter progress={progress} completeLesson={completeLesson} navigate={navigate}/>} {view === 'practice' && <OsPractice completedActivities={progress.completedActivities} completeActivity={completeActivity} recordQuiz={recordQuiz}/>} {view === 'reference' && <OsReference reset={reset}/>}</main><footer className="site-footer"><div><span className="kernel-mark small"><i>1</i><i>0</i></span><strong>CSC 139 OS LAB</strong></div><span>Independent study companion · Sacramento State · Fall 2026</span><small>Progress stays in this browser.</small></footer></div>
}
