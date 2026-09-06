import { useEffect, useState } from 'react'
import { quizQuestions } from '../data/course'
import { calculateDelayMs } from '../lib/progress'
import { Icon } from './Icons'

type Props = {
  completedActivities: string[]
  completeActivity: (id: string) => void
  recordQuiz: (score: number) => void
}

const protocolSteps = ['TCP connection request', 'TCP connection response', 'HTTP GET request', 'File response']

function DelayCalculator({ complete }: { complete: () => void }) {
  const [bits, setBits] = useState(10_000)
  const [rate, setRate] = useState(100)
  const delay = calculateDelayMs(bits, rate)
  return <section className="lab-panel" aria-labelledby="delay-title">
    <div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="delay-title">Transmission delay</h2><p>Change packet length L and link rate R. The units are converted before applying L/R.</p></div></div>
    <div className="calculator-grid">
      <label>Packet length, L <span>{bits.toLocaleString()} bits</span><input type="range" min="1000" max="100000" step="1000" value={bits} onChange={e => setBits(Number(e.target.value))}/></label>
      <label>Link rate, R <span>{rate} Mbps</span><input type="range" min="1" max="1000" value={rate} onChange={e => setRate(Number(e.target.value))}/></label>
      <div className="formula-card"><span>L / R</span><strong>{delay < 0.01 ? delay.toFixed(4) : delay.toFixed(3)} ms</strong><small>{bits.toLocaleString()} bits / {(rate * 1_000_000).toLocaleString()} bits/s</small></div>
    </div>
    <button className="button button-small" onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
  </section>
}

function QueueSimulator({ complete }: { complete: () => void }) {
  const [arrival, setArrival] = useState(3)
  const [service, setService] = useState(2)
  const [capacity, setCapacity] = useState(10)
  const [queued, setQueued] = useState(0)
  const [dropped, setDropped] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      setQueued(current => {
        const afterService = Math.max(0, current - service)
        const offered = afterService + arrival
        if (offered > capacity) setDropped(value => value + offered - capacity)
        return Math.min(capacity, offered)
      })
    }, 650)
    return () => window.clearInterval(timer)
  }, [arrival, capacity, running, service])

  const reset = () => { setRunning(false); setQueued(0); setDropped(0) }
  return <section className="lab-panel" aria-labelledby="queue-title">
    <div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="queue-title">Router queue</h2><p>Packets arrive in bursts, wait in a finite buffer, and leave at the output link’s service rate.</p></div></div>
    <div className="queue-layout">
      <div className="queue-controls">
        <label>Arrivals per tick <input type="number" min="0" max="8" value={arrival} onChange={e => setArrival(Number(e.target.value))}/></label>
        <label>Departures per tick <input type="number" min="1" max="8" value={service} onChange={e => setService(Number(e.target.value))}/></label>
        <label>Buffer capacity <input type="number" min="3" max="16" value={capacity} onChange={e => { setCapacity(Number(e.target.value)); reset() }}/></label>
      </div>
      <div className="queue-stage">
        <div className="flow-label">ARRIVAL <span>{arrival}/tick</span></div><div className="flow-arrow">→</div>
        <div className="router-box"><span>ROUTER BUFFER</span><div className="packet-slots">{Array.from({ length: capacity }, (_, index) => <i key={index} className={index < queued ? 'filled' : ''}/>)}</div><b>{queued} / {capacity}</b></div>
        <div className="flow-arrow">→</div><div className="flow-label">OUTPUT <span>{service}/tick</span></div>
      </div>
      <div className="queue-stats"><span>Queued <strong>{queued}</strong></span><span>Lost <strong className={dropped ? 'danger' : ''}>{dropped}</strong></span><span>State <strong>{arrival > service ? 'Building' : 'Stable'}</strong></span></div>
    </div>
    <div className="button-row"><button className="button button-small" onClick={() => setRunning(value => !value)}>{running ? 'Pause' : 'Run simulation'}</button><button className="button button-ghost button-small" onClick={reset}>Reset</button><button className="button button-ghost button-small" onClick={complete}><Icon name="check" size={17}/> Complete</button></div>
  </section>
}

function ProtocolSequencer({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const available = protocolSteps.filter(step => !sequence.includes(step))
  const correct = sequence.length === protocolSteps.length && sequence.every((step, index) => step === protocolSteps[index])
  const wrong = sequence.length === protocolSteps.length && !correct
  useEffect(() => { if (correct) complete() }, [complete, correct])
  return <section className="lab-panel" aria-labelledby="protocol-title">
    <div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="protocol-title">Protocol sequencer</h2><p>Build a valid simplified web exchange by selecting messages in order.</p></div></div>
    <div className="sequence-stage"><div className="peer">CLIENT</div><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first message below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(sequence.slice(0, index))}><b>{index + 1}</b>{step}<span>{index % 2 === 0 ? '→' : '←'}</span></button>)}</div><div className="peer">SERVER</div></div>
    <div className="choice-row">{available.map(step => <button key={step} className="chip" onClick={() => setSequence([...sequence, step])}>{step}</button>)}</div>
    {correct && <p className="feedback correct"><strong>Exchange complete.</strong> The connection is established before the application request is sent.</p>}
    {wrong && <p className="feedback incorrect"><strong>Not quite.</strong> Click a placed message to rewind, then establish the connection before requesting the file.</p>}
    <button className="text-button" onClick={() => setSequence([])}>Clear sequence</button>
  </section>
}

function ChapterQuiz({ recordQuiz }: { recordQuiz: (score: number) => void }) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = quizQuestions.filter(question => answers[question.id] === question.answer).length
  const submit = () => { setSubmitted(true); recordQuiz(score) }
  const retry = () => { setAnswers({}); setSubmitted(false) }
  return <section className="quiz-panel" aria-labelledby="quiz-title">
    <div className="quiz-intro"><span>CHAPTER CHECK</span><h2 id="quiz-title">Test the big picture</h2><p>Ten questions covering the concepts in slides 3-45. Each answer includes an explanation after submission.</p></div>
    {quizQuestions.map((question, questionIndex) => <fieldset className="question-card" key={question.id} disabled={submitted}>
      <legend><span>{String(questionIndex + 1).padStart(2, '0')}</span>{question.prompt}</legend>
      <div className="answer-list">{question.choices.map((choice, choiceIndex) => {
        const state = submitted ? choiceIndex === question.answer ? 'right' : answers[question.id] === choiceIndex ? 'wrong' : '' : ''
        return <label className={state} key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choiceIndex} onChange={() => setAnswers({ ...answers, [question.id]: choiceIndex })}/><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</label>
      })}</div>
      {submitted && <p className="answer-explanation">{question.explanation}</p>}
    </fieldset>)}
    {!submitted ? <button className="button" disabled={Object.keys(answers).length !== quizQuestions.length} onClick={submit}>Submit answers</button> : <div className="quiz-result"><div><span>Your score</span><strong>{score}<small>/10</small></strong></div><p>{score >= 8 ? 'Strong work. You have the Chapter 1 foundation.' : 'Review the explanations and revisit the lessons that need reinforcement.'}</p><button className="button button-ghost" onClick={retry}>Try again</button></div>}
  </section>
}

export function Practice({ completedActivities, completeActivity, recordQuiz }: Props) {
  const [tab, setTab] = useState<'labs' | 'quiz'>('labs')
  return <div className="page practice-page">
    <header className="page-heading"><div><span className="kicker">Practice center</span><h1>Learn by moving packets.</h1><p>Change the inputs, watch the system react, and use feedback to correct your mental model.</p></div><div className="practice-score"><b>{completedActivities.length}/3</b><span>labs complete</span></div></header>
    <div className="tab-bar" role="tablist"><button role="tab" aria-selected={tab === 'labs'} onClick={() => setTab('labs')}>Interactive labs</button><button role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>Chapter quiz</button></div>
    {tab === 'labs' ? <div className="labs-stack"><DelayCalculator complete={() => completeActivity('delay')}/><QueueSimulator complete={() => completeActivity('queue')}/><ProtocolSequencer complete={() => completeActivity('protocol')}/></div> : <ChapterQuiz recordQuiz={recordQuiz}/>} 
  </div>
}
