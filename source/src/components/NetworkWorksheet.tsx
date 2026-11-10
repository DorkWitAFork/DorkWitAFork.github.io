import { useState } from 'react'
import type { NetworkWorksheet as Worksheet } from '../data/networkWorksheets'
import { answerMatches } from '../lib/routingAlgorithms'
import { MathText } from './MathText'
import './networkPractice.css'

export type NetworkPracticeProps = { completedActivities: string[]; completeActivity: (id: string) => void }

export function NetworkWorkshopIndex({ items }: { items: Array<{ id: string; title: string }> }) {
  return <nav className="lab-panel network-workshop-index" aria-label="Activity index"><label>Jump to an activity<select defaultValue="" onChange={event => {
    const target = document.getElementById(event.target.value)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }) }
    event.target.value = ''
  }}><option value="" disabled>Choose a practice topic</option>{items.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><p className="lab-note">Work through a topic, check your answers, and mark it complete. Use hints or worked solutions whenever you need them.</p></nav>
}

export function NetworkWorksheet({ worksheet, completed = false, onComplete, onSolved }: { worksheet: Worksheet; completed?: boolean; onComplete?: () => void; onSolved?: (solved: boolean) => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const matches = worksheet.fields.map((field, index) => answerMatches(answers[index] ?? '', field.answers))
  const solved = checked && matches.every(Boolean)
  const check = () => { setChecked(true); onSolved?.(matches.every(Boolean)) }
  return <section id={worksheet.id} className="lab-panel network-worksheet" aria-labelledby={`${worksheet.id}-title`}>
    <div className="lab-heading"><span className="lab-number">WORKSHOP</span><div><h2 id={`${worksheet.id}-title`}>{worksheet.title}</h2><p><MathText>{worksheet.prompt}</MathText></p></div></div>
    <form onSubmit={event => { event.preventDefault(); check() }}>
      <div className="network-answer-grid">{worksheet.fields.map((field, index) => {
        const inputId = `${worksheet.id}-answer-${index}`
        return <div className="network-answer" key={field.label}>
          <label htmlFor={inputId}><MathText>{field.label}</MathText></label>
          <input id={inputId} type="text" autoComplete="off" spellCheck={false} value={answers[index] ?? ''} aria-invalid={checked && !matches[index] ? true : undefined} aria-describedby={checked || showHints ? `${inputId}-feedback` : undefined} onChange={event => { setAnswers({ ...answers, [index]: event.target.value }); setChecked(false); onSolved?.(false) }}/>
          {(checked || showHints) && <p id={`${inputId}-feedback`} className={`network-field-feedback ${checked && matches[index] ? 'correct' : ''}`}><MathText>{checked && matches[index] ? `Correct. ${field.explanation}` : `${checked ? 'Try again. ' : ''}${field.hint}`}</MathText></p>}
        </div>
      })}</div>
      <div className="button-row"><button className="button button-small" type="submit">Check answers</button><button className="button button-ghost button-small" type="button" onClick={() => setShowHints(!showHints)}>{showHints ? 'Hide hints' : 'Show hints'}</button><button className="button button-ghost button-small" type="button" onClick={() => { setAnswers({}); setChecked(false); setShowSolution(false); setShowHints(false); onSolved?.(false) }}>Reset answers</button></div>
    </form>
    <div aria-live="polite">{checked && <p className={`feedback ${solved ? 'correct' : 'incorrect'}`}>{solved ? 'All answers correct. Review the reasoning below each field.' : `${matches.filter(Boolean).length} of ${matches.length} correct. Use the field feedback to revise your work, then check again.`}</p>}</div>
    <button className="text-button" type="button" aria-expanded={showSolution} onClick={() => setShowSolution(!showSolution)}>{showSolution ? 'Hide worked solution' : 'Show worked solution'}</button>
    {showSolution && <div className="network-solution">{worksheet.fields.map(field => <p key={field.label}><strong>{field.label}: {field.answers[0]}</strong><br/><MathText>{field.explanation}</MathText></p>)}</div>}
    {onComplete && <div className="button-row"><button className={`button button-small ${completed ? 'button-complete' : ''}`} type="button" disabled={!solved && !completed} onClick={onComplete}>{completed ? 'Activity complete' : 'Mark activity complete'}</button></div>}
  </section>
}
