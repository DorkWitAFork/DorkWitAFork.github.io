import { useState } from 'react'
import { midtermQuestions, midtermReviewSections } from '../data/csc138Midterm'

function ReviewSection({ section }: { section: (typeof midtermReviewSections)[number] }) {
  return <article className="midterm-review-card">
    <div className="midterm-review-heading"><span>{section.eyebrow}</span><h2>{section.title}</h2><p>{section.summary}</p></div>
    <div className="midterm-review-columns"><div><h3>Formulas and models</h3><ul className="formula-list">{section.formulas.map(formula => <li key={formula}><code>{formula}</code></li>)}</ul></div><div><h3>What to remember</h3><ul>{section.checks.map(check => <li key={check}>{check}</li>)}</ul></div></div>
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
      <legend><span>{String(index + 1).padStart(2, '0')}</span><small>{question.category}</small>{question.prompt}</legend>
      <div className="answer-list">{question.choices.map((choice, choiceIndex) => { const state = submitted ? choiceIndex === question.answer ? 'right' : answers[question.id] === choiceIndex ? 'wrong' : '' : ''; return <label className={state} key={choice}><input type="radio" name={question.id} checked={answers[question.id] === choiceIndex} onChange={() => setAnswers(current => ({ ...current, [question.id]: choiceIndex }))}/><span>{String.fromCharCode(65 + choiceIndex)}</span>{choice}</label> })}</div>
      {submitted && <p className="answer-explanation">{question.explanation}</p>}
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
