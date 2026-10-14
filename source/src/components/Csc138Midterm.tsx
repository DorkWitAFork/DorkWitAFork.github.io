import { useState, type ReactNode } from 'react'
import { midtermQuestions, midtermReviewSections } from '../data/csc138Midterm'
import { MathText } from './MathText'

function Formula({ id }: { id: string }) {
  const formulas: Record<string, ReactNode> = {
    'nodal-delay': <><i>d</i><sub>nodal</sub> = <i>d</i><sub>proc</sub> + <i>d</i><sub>queue</sub> + <i>L</i>/<i>R</i> + <i>d</i>/<i>v</i></>,
    'store-forward': <>D = Σ(<i>L</i>/<i>R</i><sub>i</sub> + <i>d</i><sub>i</sub>/<i>v</i><sub>i</sub>)</>,
    bottleneck: <>Throughput = min(<i>R</i><sub>1</sub>, <i>R</i><sub>2</sub>, …, <i>R</i><sub>H</sub>)</>,
    'traffic-intensity': <>ρ = <i>La</i>/<i>R</i></>,
    'dns-total': <>D<sub>DNS</sub> = Σ required sequential DNS RTTs</>,
    'http-nonpersistent': <>D<sub>HTTP</sub> = D<sub>DNS</sub> + 2(<i>m</i> + 1)<i>r</i></>,
    'http-persistent': <>D<sub>HTTP</sub> = D<sub>DNS</sub> + 3<i>r</i> &nbsp;(<i>m</i> ≥ 1)</>,
    'distribution-cs': <>D<sub>CS</sub> ≥ max(<i>NF</i>/<i>u</i><sub>s</sub>, <i>F</i>/<i>d</i><sub>min</sub>)</>,
    'distribution-p2p': <>D<sub>P2P</sub> ≥ max(<i>F</i>/<i>u</i><sub>s</sub>, <i>F</i>/<i>d</i><sub>min</sub>, <i>NF</i>/(<i>u</i><sub>s</sub> + Σ<i>u</i><sub>i</sub>))</>,
    'stop-wait': <><i>U</i> = (<i>L</i>/<i>R</i>) / (<i>RTT</i> + <i>L</i>/<i>R</i>)</>,
    'pipeline-utilization': <><i>U</i> ≈ min(1, <i>W</i>(<i>L</i>/<i>R</i>) / (<i>RTT</i> + <i>L</i>/<i>R</i>))</>,
    'sequence-space': <><i>M</i> = 2<sup><i>k</i></sup></>,
    'gbn-window': <>GBN: <i>W</i> ≤ <i>M</i> − 1</>,
    'sr-window': <>SR: <i>W</i> ≤ <i>M</i>/2</>,
    'segment-range': <>Seq through Seq + payload − 1</>,
    'tcp-ack': <>ACK = first byte not yet received in order</>,
    'receive-window': <>rwnd = buffer size − unread buffered bytes</>,
    'window-allowance': <>additional allowance = advertised rwnd − outstanding bytes</>,
    'retransmission-timeout': <>Timeout = EstimatedRTT + 4 DevRTT</>,
    'workflow-draw': <>1. Draw the path or timeline</>,
    'workflow-units': <>2. Convert units before substituting</>,
    'workflow-assumptions': <>3. List assumptions</>,
    'workflow-combine': <>4. Sum stages or choose the bottleneck</>,
    'workflow-label': <>5. Label the final answer</>,
  }
  return <code className="midterm-formula">{formulas[id] ?? id}</code>
}

function ReviewVisual({ sectionIndex }: { sectionIndex: number }) {
  if (sectionIndex === 0) return <div className="midterm-visual timing-visual" aria-label="Packet timing diagram"><span>packet</span><div><b>transmit</b><i /><b>propagate</b><i /><b>arrive</b></div><small>L / R</small><small>d / v</small></div>
  if (sectionIndex === 1) return <div className="midterm-visual application-visual" aria-label="Application request timeline"><span>DNS</span><span>TCP</span><span>base HTML</span><span>objects</span><div className="visual-line" /></div>
  if (sectionIndex === 2) return <div className="midterm-visual reliability-visual" aria-label="Go-Back-N and Selective Repeat comparison"><div><b>GBN</b><span>0 ✓</span><span>1 lost</span><span>2 discard</span><span>3 discard</span></div><div><b>SR</b><span>0 ✓</span><span>1 lost</span><span>2 buffer</span><span>3 buffer</span></div></div>
  if (sectionIndex === 3) return <div className="midterm-visual tcp-visual" aria-label="TCP byte sequence diagram"><span>Seq 1000</span><b>bytes 1000–1499</b><span>ACK 1500</span><div className="visual-arrow" /></div>
  return <div className="midterm-visual workflow-visual" aria-label="Exam workflow"><span>draw</span><b>→</b><span>convert</span><b>→</b><span>model</span><b>→</b><span>solve</span><b>→</b><span>check</span></div>
}

function QuestionVisual({ questionId }: { questionId: string }) {
  if (questionId === 'mid-q3') return <div className="question-visual path-question-visual" aria-label="Three-link store-and-forward path"><span className="question-endpoint">SOURCE</span><i>6 Mbps<br/>200 km</i><b>R1</b><i>3 Mbps<br/>600 km</i><b>R2</b><i>4 Mbps<br/>400 km</i><span className="question-endpoint">DEST.</span></div>
  if (questionId === 'mid-q4') return <div className="question-visual pipeline-question-visual" aria-label="Packets moving through a three-link pipeline"><div><span>Link 1</span><i/><i/><i/></div><div><span>Link 2</span><i/><i/><i/></div><div><span>Link H</span><i/><i/><i/></div><small>Packet 1 fills the path; later packets advance one link time at a time.</small></div>
  if (questionId === 'mid-q7') return <div className="question-visual routing-question-visual" aria-label="Routing computes a path and forwarding selects a local output"><div><b>ROUTING</b><span>computes end-to-end path</span><strong>HOST → R1 → R2 → DEST.</strong></div><div><b>FORWARDING</b><span>uses the next-hop table</span><strong>packet → local output port</strong></div></div>
  return null
}

function ReviewSection({ section }: { section: (typeof midtermReviewSections)[number] }) {
  const sectionIndex = midtermReviewSections.indexOf(section)
  return <article className="midterm-review-card">
    <div className="midterm-review-heading"><span>{section.eyebrow}</span><h2>{section.title}</h2><p>{section.summary}</p></div>
    <ReviewVisual sectionIndex={sectionIndex} />
    <div className="midterm-review-columns"><div><h3>Formulas and models</h3><ul className="formula-list">{section.formulas.map(formula => <li key={formula}><Formula id={formula} /></li>)}</ul></div><div><h3>What to understand</h3><ul>{section.details.map(detail => <li key={detail}>{detail}</li>)}</ul></div></div>
    <div className="midterm-review-lower"><div><h3>Worked approach</h3><p>{section.workedExample}</p></div><div><h3>Common traps</h3><ul>{section.pitfalls.map(pitfall => <li key={pitfall}>{pitfall}</li>)}</ul></div></div>
    <div className="midterm-review-checks"><h3>Quick checks</h3><ul>{section.checks.map(check => <li key={check}>{check}</li>)}</ul></div>
  </article>
}

function PracticeMidterm() {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const score = midtermQuestions.filter(question => answers[question.id] === question.answer).length
  const categories = [...new Set(midtermQuestions.map(question => question.category))]
  return <section className="midterm-practice" aria-labelledby="midterm-practice-title">
    <header className="midterm-practice-header"><span className="kicker">FULL PRACTICE EXAM</span><h2 id="midterm-practice-title">Show your calculations and reasoning.</h2><p>{midtermQuestions.length} questions cover the supplied midterm study guide: math problems, protocol traces, application concepts, security, and short coding questions. Work on paper first, then submit to check your answers.</p></header>
    <div className="midterm-category-strip" aria-label="Practice exam categories">{categories.map(category => <span key={category}>{category}</span>)}</div>
    {midtermQuestions.map((question, index) => <fieldset className="question-card" key={question.id} disabled={submitted}>
       <legend><span>{String(index + 1).padStart(2, '0')}</span><small>{question.category}</small><MathText>{question.prompt}</MathText></legend>
       <QuestionVisual questionId={question.id}/>
       <div className="answer-list">{question.choices.map((choice, choiceIndex) => { const state = submitted ? choiceIndex === question.answer ? 'right' : answers[question.id] === choiceIndex ? 'wrong' : '' : ''; return <label className={state} key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choiceIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))}/><span className="answer-letter">{String.fromCharCode(65 + choiceIndex)}</span><MathText>{choice}</MathText></label> })}</div>
       {submitted && <p className="answer-explanation"><MathText>{question.explanation}</MathText></p>}
    </fieldset>)}
    {!submitted ? <button className="button" disabled={Object.keys(answers).length !== midtermQuestions.length} onClick={() => setSubmitted(true)}>Submit practice midterm</button> : <div className="quiz-result"><div><span>Your score</span><strong>{score}<small>/{midtermQuestions.length}</small></strong></div><p>{score >= Math.ceil(midtermQuestions.length * 0.8) ? 'Strong work. Review the explanations for any missed calculations.' : 'Use the explanations to identify which problem type needs another paper-and-pencil pass.'}</p><button className="button button-ghost" onClick={() => { setAnswers({}); setSubmitted(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Try again</button></div>}
  </section>
}

export function Csc138Midterm() {
  const [tab, setTab] = useState<'review' | 'practice'>('review')
  return <div className="page midterm-page">
    <header className="page-heading"><div><span className="kicker">CSC 138 / MIDTERM</span><h1>Practice the whole path.</h1></div><p>A focused review of the supplied midterm study guide, followed by a full-length practice set with extra calculation, reasoning, and coding questions.</p></header>
    <div className="midterm-source-note"><strong>Source coverage</strong><span>Chapters 1-3 through TCP flow control and connection management. Congestion-control sections 3.6-3.7 are excluded by the guide.</span></div>
    <div className="tab-bar midterm-tabs" role="tablist"><button role="tab" aria-selected={tab === 'review'} onClick={() => setTab('review')}>Study guide review</button><button role="tab" aria-selected={tab === 'practice'} onClick={() => setTab('practice')}>Practice midterm</button></div>
    {tab === 'review' ? <><section className="midterm-overview"><span className="section-label-text">FIVE CORE PROBLEM TYPES</span><div className="midterm-problem-rail"><span>01 <b>Packet timing</b></span><span>02 <b>DNS + HTTP</b></span><span>03 <b>Distribution</b></span><span>04 <b>GBN / SR</b></span><span>05 <b>TCP bytes</b></span></div></section><div className="midterm-review-stack">{midtermReviewSections.map(section => <ReviewSection key={section.title} section={section}/>)}</div><section className="sources midterm-sources"><div><span className="section-label-text">STUDY MATERIALS</span><h2>Built from your midterm guides.</h2></div><ul><li><strong>CSC138_Midterm_Study_Guide.pdf</strong><span>Five-page exhaustive guide covering fundamentals, applications, transport, TCP, formulas, and checked practice.</span></li><li><strong>CSC138_Midterm_Review.pdf</strong><span>Seventeen-page review deck with packet timing, HTTP, distribution, GBN/SR, and TCP exercises.</span></li></ul></section></> : <PracticeMidterm />}
  </div>
}
