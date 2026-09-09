import { useState } from 'react'
import { osQuizQuestions } from '../data/osCourse'
import { Icon } from './Icons'

type Props = {
  completedActivities: string[]
  completeActivity: (id: string) => void
  recordQuiz: (score: number) => void
}

const storageLevels = ['Registers', 'Cache', 'Main memory', 'Solid-state disk', 'Magnetic disk']
const callSteps = ['User program requests a service', 'Hardware enters kernel mode', 'Kernel validates the request', 'Kernel performs the operation', 'Control returns in user mode']

function EventClassifier({ complete }: { complete: () => void }) {
  const events = [
    ['Disk read finishes', 'Interrupt'],
    ['Program divides by zero', 'Trap'],
    ['Program requests open()', 'Trap'],
    ['Timer counter reaches zero', 'Interrupt'],
  ]
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const finished = events.every(([, answer], index) => answers[index] === answer)
  return <section className="lab-panel" aria-labelledby="events-title">
    <div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="events-title">Who raised the event?</h2><p>Classify asynchronous hardware signals as interrupts and events caused by the current instruction as traps.</p></div></div>
    <div className="classifier-grid">{events.map(([event, answer], index) => <div className="classifier-row" key={event}><strong>{event}</strong><div>{['Interrupt', 'Trap'].map(choice => <button key={choice} className={answers[index] === choice ? answer === choice ? 'selected correct-choice' : 'selected' : ''} onClick={() => setAnswers(current => ({ ...current, [index]: choice }))}>{choice}</button>)}</div></div>)}</div>
    {Object.keys(answers).length === events.length && !finished && <p className="feedback incorrect">Check the source of each event: hardware is asynchronous; the running instruction is synchronous.</p>}
    {finished && <p className="feedback correct">Correct. A system call deliberately uses the trap path into the kernel.</p>}
    <button className="button button-small" disabled={!finished} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
  </section>
}

function StorageSorter({ complete }: { complete: () => void }) {
  const [remaining, setRemaining] = useState(() => [...storageLevels].sort(() => .5 - Math.random()))
  const [ordered, setOrdered] = useState<string[]>([])
  const correct = ordered.length === storageLevels.length && ordered.every((level, index) => level === storageLevels[index])
  const choose = (level: string) => { setOrdered(current => [...current, level]); setRemaining(current => current.filter(item => item !== level)) }
  const reset = () => { setOrdered([]); setRemaining([...storageLevels].sort(() => .5 - Math.random())) }
  return <section className="lab-panel" aria-labelledby="storage-title">
    <div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="storage-title">Build the storage hierarchy</h2><p>Select levels from fastest to slowest. Faster storage is generally smaller, more expensive per byte, and closer to the CPU.</p></div></div>
    <div className="storage-sorter"><div className="storage-target"><span>FASTEST</span>{ordered.map((level, index) => <button key={level} onClick={() => { setRemaining(current => [...current, ...ordered.slice(index)]); setOrdered(current => current.slice(0, index)) }}><b>{index + 1}</b>{level}</button>)}<span>SLOWEST</span></div><div className="storage-options">{remaining.map(level => <button className="chip" key={level} onClick={() => choose(level)}>{level}</button>)}</div></div>
    {ordered.length === storageLevels.length && <p className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Hierarchy complete. Registers are fastest; magnetic disks trade speed for capacity and persistence.' : 'The order is not quite right. Rewind from a placed level or reset and try again.'}</p>}
    <div className="button-row"><button className="button button-small" disabled={!correct} onClick={complete}><Icon name="check" size={17}/> Complete</button><button className="button button-ghost button-small" onClick={reset}>Reset</button></div>
  </section>
}

function SystemCallSequencer({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const remaining = callSteps.filter(step => !sequence.includes(step))
  const correct = sequence.length === callSteps.length && sequence.every((step, index) => step === callSteps[index])
  return <section className="lab-panel" aria-labelledby="call-title">
    <div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="call-title">Cross the privilege boundary</h2><p>Sequence a system call from an ordinary application request through validated kernel work and back.</p></div></div>
    <div className="mode-sequence"><div className="mode-label user">USER MODE</div><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first transition below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div><div className="mode-label kernel">KERNEL MODE</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {sequence.length === callSteps.length && <p className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. Hardware changes privilege, and the kernel validates every request before acting.' : 'Not quite. Begin with user code, enter kernel mode before validation, and return only after the operation.'}</p>}
    <button className="button button-small" disabled={!correct} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
  </section>
}

function OsQuiz({ recordQuiz }: { recordQuiz: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = osQuizQuestions.filter(question => answers[question.id] === question.answer).length
  return <section className="quiz-panel" aria-labelledby="os-quiz-title">
    <div className="quiz-intro"><span>CHAPTER CHECK</span><h2 id="os-quiz-title">Can you protect the machine?</h2><p>Ten questions covering operating-system roles, hardware, control, resources, and virtualization.</p></div>
    {osQuizQuestions.map((question, questionIndex) => <fieldset className="question-card" key={question.id} disabled={submitted}><legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{question.prompt}</legend><div className="answer-list">{question.choices.map((choice, choiceIndex) => { const state = submitted ? choiceIndex === question.answer ? 'right' : answers[question.id] === choiceIndex ? 'wrong' : '' : ''; return <label className={state} key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choiceIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))}/><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</label> })}</div>{submitted && <p className="answer-explanation">{question.explanation}</p>}</fieldset>)}
    {!submitted ? <button className="button" disabled={Object.keys(answers).length !== osQuizQuestions.length} onClick={() => { setSubmitted(true); recordQuiz(score) }}>Submit answers</button> : <div className="quiz-result"><div><span>Your score</span><strong>{score}<small>/10</small></strong></div><p>{score >= 8 ? 'Strong work. You understand the Chapter 1 control model.' : 'Use the explanations to identify which lesson needs another pass.'}</p><button className="button button-ghost" onClick={() => { setAnswers({}); setSubmitted(false) }}>Try again</button></div>}
  </section>
}

export function OsPractice({ completedActivities, completeActivity, recordQuiz }: Props) {
  const [tab, setTab] = useState<'labs' | 'quiz'>('labs')
  return <div className="page practice-page os-page"><header className="page-heading"><div><span className="kicker">Practice center</span><h1>Think like the kernel.</h1><p>Classify events, arrange the hierarchy, and trace control across the privilege boundary.</p></div><div className="practice-score"><b>{completedActivities.length}/3</b><span>labs complete</span></div></header><div className="tab-bar" role="tablist"><button role="tab" aria-selected={tab === 'labs'} onClick={() => setTab('labs')}>Interactive labs</button><button role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>Chapter quiz</button></div>{tab === 'labs' ? <div className="labs-stack"><EventClassifier complete={() => completeActivity('events')}/><StorageSorter complete={() => completeActivity('storage')}/><SystemCallSequencer complete={() => completeActivity('system-call')}/></div> : <OsQuiz recordQuiz={recordQuiz}/>}</div>
}
