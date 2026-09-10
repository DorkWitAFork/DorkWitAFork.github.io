import { useState } from 'react'
import type { Csc139Chapter } from '../data/csc139Course'
import type { Csc139ChapterId } from '../types'
import { Icon } from './Icons'
import { OsChapter2Practice } from './OsChapter2Practice'

type Props = {
  chapter: Csc139Chapter
  completedActivities: string[]
  completeActivity: (id: string) => void
  recordQuiz: (score: number) => void
  selectChapter: (chapter: Csc139ChapterId) => void
}

const storageLevels = ['Registers', 'Cache', 'Main memory', 'Solid-state disk', 'Magnetic disk']
const callSteps = ['User program requests a service', 'Hardware enters kernel mode', 'Kernel validates the request', 'Kernel performs the operation', 'Control returns in user mode']

function EventClassifier({ complete }: { complete: () => void }) {
  const events = [['Disk read finishes', 'Interrupt'], ['Program divides by zero', 'Trap'], ['Program requests open()', 'Trap'], ['Timer counter reaches zero', 'Interrupt']]
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const finished = events.every(([, answer], index) => answers[index] === answer)
  return <section className="lab-panel" aria-labelledby="events-title"><div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="events-title">Who raised the event?</h2><p>Classify asynchronous hardware signals as interrupts and events caused by the current instruction as traps.</p></div></div><div className="classifier-grid">{events.map(([event, answer], index) => <div className="classifier-row" key={event}><strong>{event}</strong><div>{['Interrupt', 'Trap'].map(choice => <button key={choice} className={answers[index] === choice ? answer === choice ? 'selected correct-choice' : 'selected' : ''} onClick={() => setAnswers(current => ({ ...current, [index]: choice }))}>{choice}</button>)}</div></div>)}</div>{Object.keys(answers).length === events.length && !finished && <p className="feedback incorrect">Check the source of each event: hardware is asynchronous; the running instruction is synchronous.</p>}{finished && <p className="feedback correct">Correct. A system call deliberately uses the trap path into the kernel.</p>}<button className="button button-small" disabled={!finished} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button></section>
}

function StorageSorter({ complete }: { complete: () => void }) {
  const [remaining, setRemaining] = useState(() => [...storageLevels].sort(() => .5 - Math.random()))
  const [ordered, setOrdered] = useState<string[]>([])
  const correct = ordered.length === storageLevels.length && ordered.every((level, index) => level === storageLevels[index])
  const reset = () => { setOrdered([]); setRemaining([...storageLevels].sort(() => .5 - Math.random())) }
  return <section className="lab-panel" aria-labelledby="storage-title"><div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="storage-title">Build the storage hierarchy</h2><p>Select levels from fastest to slowest. Faster storage is generally smaller, more expensive per byte, and closer to the CPU.</p></div></div><div className="storage-sorter"><div className="storage-target"><span>FASTEST</span>{ordered.map((level, index) => <button key={level} onClick={() => { setRemaining(current => [...current, ...ordered.slice(index)]); setOrdered(current => current.slice(0, index)) }}><b>{index + 1}</b>{level}</button>)}<span>SLOWEST</span></div><div className="storage-options">{remaining.map(level => <button className="chip" key={level} onClick={() => { setOrdered(current => [...current, level]); setRemaining(current => current.filter(item => item !== level)) }}>{level}</button>)}</div></div>{ordered.length === storageLevels.length && <p className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Hierarchy complete. Registers are fastest; magnetic disks trade speed for capacity and persistence.' : 'The order is not quite right. Rewind from a placed level or reset and try again.'}</p>}<div className="button-row"><button className="button button-small" disabled={!correct} onClick={complete}><Icon name="check" size={17}/> Complete</button><button className="button button-ghost button-small" onClick={reset}>Reset</button></div></section>
}

function SystemCallSequencer({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const remaining = callSteps.filter(step => !sequence.includes(step))
  const correct = sequence.length === callSteps.length && sequence.every((step, index) => step === callSteps[index])
  return <section className="lab-panel" aria-labelledby="call-title"><div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="call-title">Cross the privilege boundary</h2><p>Sequence a system call from an ordinary application request through validated kernel work and back.</p></div></div><div className="mode-sequence"><div className="mode-label user">USER MODE</div><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first transition below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div><div className="mode-label kernel">KERNEL MODE</div></div><div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>{sequence.length === callSteps.length && <p className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. Hardware changes privilege, and the kernel validates every request before acting.' : 'Begin with user code, enter kernel mode before validation, and return only after the operation.'}</p>}<button className="button button-small" disabled={!correct} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button></section>
}

function Chapter1Labs({ completeActivity }: { completeActivity: (id: string) => void }) {
  return <><EventClassifier complete={() => completeActivity('events')}/><StorageSorter complete={() => completeActivity('storage')}/><SystemCallSequencer complete={() => completeActivity('system-call')}/></>
}

function OsQuiz({ chapter, recordQuiz }: { chapter: Csc139Chapter; recordQuiz: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const total = chapter.quizQuestions.length
  const score = chapter.quizQuestions.filter(question => answers[question.id] === question.answer).length
  return <section className="quiz-panel" aria-labelledby="os-quiz-title"><div className="quiz-intro"><span>CHAPTER {chapter.number} CHECK</span><h2 id="os-quiz-title">Can you explain the system?</h2><p>{total} questions covering the concepts and trade-offs in {chapter.title}.</p></div>{chapter.quizQuestions.map((question, questionIndex) => <fieldset className="question-card" key={question.id} disabled={submitted}><legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{question.prompt}</legend><div className="answer-list">{question.choices.map((choice, choiceIndex) => { const state = submitted ? choiceIndex === question.answer ? 'right' : answers[question.id] === choiceIndex ? 'wrong' : '' : ''; return <label className={state} key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choiceIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))}/><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</label> })}</div>{submitted && <p className="answer-explanation">{question.explanation}</p>}</fieldset>)}{!submitted ? <button className="button" disabled={Object.keys(answers).length !== total} onClick={() => { setSubmitted(true); recordQuiz(score) }}>Submit answers</button> : <div className="quiz-result"><div><span>Your score</span><strong>{score}<small>/{total}</small></strong></div><p>{score >= Math.ceil(total * .8) ? `Strong work. You understand Chapter ${chapter.number}.` : 'Use the explanations to identify which lesson needs another pass.'}</p><button className="button button-ghost" onClick={() => { setAnswers({}); setSubmitted(false) }}>Try again</button></div>}</section>
}

export function OsPractice({ chapter, completedActivities, completeActivity, recordQuiz, selectChapter }: Props) {
  const [tab, setTab] = useState<'labs' | 'quiz'>('labs')
  const completedCount = chapter.activityIds.filter(id => completedActivities.includes(id)).length
  return <div className="page practice-page os-page"><header className="page-heading"><div><span className="kicker">Chapter {chapter.number} practice center</span><h1>Think like the kernel.</h1><p>Turn the chapter's service paths, control boundaries, and design trade-offs into decisions you can explain.</p></div><div className="practice-score"><b>{completedCount}/{chapter.activityIds.length}</b><span>labs complete</span></div></header><div className="chapter-switch" aria-label="Practice chapter"><button className={chapter.id === 'chapter1' ? 'active' : ''} onClick={() => selectChapter('chapter1')}>Chapter 1</button><button className={chapter.id === 'chapter2' ? 'active' : ''} onClick={() => selectChapter('chapter2')}>Chapter 2</button></div><div className="tab-bar" role="tablist"><button role="tab" aria-selected={tab === 'labs'} onClick={() => setTab('labs')}>Interactive labs</button><button role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>Chapter quiz</button></div>{tab === 'labs' ? <div className="labs-stack">{chapter.id === 'chapter1' ? <Chapter1Labs completeActivity={completeActivity}/> : <OsChapter2Practice completeActivity={completeActivity}/>}</div> : <OsQuiz chapter={chapter} recordQuiz={recordQuiz}/>}</div>
}
