import { useState } from 'react'
import { Icon } from './Icons'

function CompletionButton({ ready, complete }: { ready: boolean; complete: () => void }) {
  return <button className="button button-small" disabled={!ready} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
}

function ServiceMap({ complete }: { complete: () => void }) {
  const cases = [
    ['Load and terminate a program', 'User-facing'],
    ['Allocate CPU time among processes', 'System efficiency'],
    ['Read data from a device', 'User-facing'],
    ['Record resource usage', 'System efficiency'],
    ['Exchange data between processes', 'User-facing'],
    ['Enforce access to a file', 'System efficiency'],
  ]
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const finished = cases.every(([, answer], index) => answers[index] === answer)
  return <section className="lab-panel" aria-labelledby="service-map-title">
    <div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="service-map-title">Map the service boundary</h2><p>Separate services that directly help programs from services that coordinate and protect the shared system.</p></div></div>
    <div className="classifier-grid">{cases.map(([scenario, answer], index) => <div className="classifier-row" key={scenario}><strong>{scenario}</strong><div>{['User-facing', 'System efficiency'].map(choice => <button key={choice} className={answers[index] === choice ? answer === choice ? 'selected correct-choice' : 'selected' : ''} onClick={() => setAnswers(current => ({ ...current, [index]: choice }))}>{choice}</button>)}</div></div>)}</div>
    {Object.keys(answers).length === cases.length && <p className={`feedback ${finished ? 'correct' : 'incorrect'}`}>{finished ? 'Correct. Both groups ultimately rely on controlled kernel mechanisms.' : 'Recheck whether the service primarily enables a program or manages shared operation.'}</p>}
    <CompletionButton ready={finished} complete={complete}/>
  </section>
}

const callSteps = ['Application calls an API function', 'The run-time environment reaches the system-call interface', 'The interface selects a numbered kernel service', 'The kernel validates parameters and performs the operation', 'Status and results return to the application']
const bootSteps = ['Firmware runs its boot manager', 'The boot loader locates and loads the kernel', 'The kernel initializes processors and devices', 'The root file system is mounted', 'The initial process starts system services']
const moduleSteps = ['Compile source into a .ko module', 'Insert the module with insmod', 'Inspect its load message with dmesg', 'Read the module-created /proc entry', 'Remove the module with rmmod']

function SequenceLab({ number, title, description, steps, complete }: { number: string; title: string; description: string; steps: string[]; complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const remaining = steps.filter(step => !sequence.includes(step))
  const correct = sequence.length === steps.length && sequence.every((step, index) => step === steps[index])
  return <section className="lab-panel" aria-labelledby={`sequence-${number}`}>
    <div className="lab-heading"><span className="lab-number">LAB {number}</span><div><h2 id={`sequence-${number}`}>{title}</h2><p>{description}</p></div></div>
    <div className="mode-sequence chapter2-sequence"><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first step below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {sequence.length === steps.length && <p className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Sequence complete. Each boundary has a distinct responsibility.' : 'The steps are all present, but their dependencies require a different order.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

function StructureTradeoffs({ complete }: { complete: () => void }) {
  const cases = [
    ['Fast in-kernel calls; one large failure domain', 'Monolithic'],
    ['Services isolated in user space; message-passing overhead', 'Microkernel'],
    ['Each level depends only on lower levels', 'Layered'],
    ['Features inserted into a running kernel', 'Modular'],
    ['Combines structures to balance performance and isolation', 'Hybrid'],
  ]
  const choices = ['Monolithic', 'Layered', 'Microkernel', 'Modular', 'Hybrid']
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const finished = cases.every(([, answer], index) => answers[index] === answer)
  return <section className="lab-panel" aria-labelledby="structure-title">
    <div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="structure-title">Choose the kernel structure</h2><p>Match each design consequence to the structure that produces it most directly.</p></div></div>
    <div className="architecture-matcher">{cases.map(([scenario, answer], index) => <label key={scenario}><span>{scenario}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose a structure</option>{choices.map(choice => <option key={choice}>{choice}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    <CompletionButton ready={finished} complete={complete}/>
  </section>
}

export function OsChapter2Practice({ completeActivity }: { completeActivity: (id: string) => void }) {
  return <>
    <ServiceMap complete={() => completeActivity('os-ch2-service-map')}/>
    <SequenceLab number="02" title="Trace a system call" description="Order the abstractions between an application-level API call and protected kernel work." steps={callSteps} complete={() => completeActivity('os-ch2-call-path')}/>
    <StructureTradeoffs complete={() => completeActivity('os-ch2-structure-tradeoffs')}/>
    <SequenceLab number="04" title="Boot to a usable system" description="Restore the dependencies from firmware execution through the first long-running services." steps={bootSteps} complete={() => completeActivity('os-ch2-boot-sequence')}/>
    <SequenceLab number="05" title="Manage a kernel module safely" description="Practice the module lifecycle conceptually. Real kernel work belongs in an isolated virtual machine." steps={moduleSteps} complete={() => completeActivity('os-ch2-kernel-module')}/>
  </>
}
