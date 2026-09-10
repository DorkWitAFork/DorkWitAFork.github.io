import { useEffect, useState } from 'react'
import { Icon } from './Icons'

type Props = {
  completeActivity: (id: string) => void
}

const transportScenarios = [
  { id: 'web', label: 'Web document', answer: 'Reliable / TCP' },
  { id: 'call', label: 'Real-time voice call', answer: 'Loss-tolerant / UDP' },
  { id: 'mail', label: 'E-mail message', answer: 'Reliable / TCP' },
] as const

const transportChoices = ['Reliable / TCP', 'Loss-tolerant / UDP', 'Minimum delay / TCP']
const httpSteps = ['Open TCP connection', 'Send HTTP GET request', 'Receive HTTP response', 'Close non-persistent connection', 'Parse the returned object']

function TransportMatcher({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const finished = transportScenarios.every(item => answers[item.id] === item.answer)
  useEffect(() => { if (finished) complete() }, [complete, finished])

  return <section className="lab-panel" aria-labelledby="transport-match-title">
    <div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="transport-match-title">Transport requirement match</h2><p>Choose the service profile that best fits each application in the deck.</p></div></div>
    <div className="transport-match-grid">{transportScenarios.map(item => <fieldset key={item.id}><legend>{item.label}</legend>{transportChoices.map(choice => {
      const selected = answers[item.id] === choice
      const state = selected ? choice === item.answer ? 'right' : 'wrong' : ''
      return <label className={state} key={choice}><input type="radio" name={item.id} checked={selected} onChange={() => setAnswers(current => ({ ...current, [item.id]: choice }))}/><span>{choice}</span></label>
    })}</fieldset>)}</div>
    {finished && <p className="feedback correct"><strong>Requirements matched.</strong> Reliable applications favor TCP; real-time media can trade some loss for timeliness.</p>}
  </section>
}

function HttpExchange({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const [rtt, setRtt] = useState(80)
  const [transmission, setTransmission] = useState(20)
  const available = httpSteps.filter(step => !sequence.includes(step))
  const correct = sequence.length === httpSteps.length && sequence.every((step, index) => step === httpSteps[index])
  const wrong = sequence.length === httpSteps.length && !correct
  useEffect(() => { if (correct) complete() }, [complete, correct])

  return <section className="lab-panel" aria-labelledby="http-exchange-title">
    <div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="http-exchange-title">Non-persistent HTTP exchange</h2><p>Order one object exchange, then inspect the two-RTT response-time cost.</p></div></div>
    <div className="sequence-stage"><div className="peer">CLIENT</div><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first event below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(sequence.slice(0, index))}><b>{index + 1}</b>{step}<span>{index < 2 ? index % 2 === 0 ? '→' : '←' : ''}</span></button>)}</div><div className="peer">SERVER</div></div>
    <div className="choice-row">{available.map(step => <button key={step} className="chip" onClick={() => setSequence([...sequence, step])}>{step}</button>)}</div>
    {correct && <p className="feedback correct"><strong>Exchange complete.</strong> A new connection is established before the request, then closed after one object.</p>}
    {wrong && <p className="feedback incorrect"><strong>Sequence needs revision.</strong> Click a placed event to rewind.</p>}
    <button className="text-button" onClick={() => setSequence([])}>Clear sequence</button>
    <div className="http-time-calculator"><label>RTT <span>{rtt} ms</span><input type="range" min="10" max="300" step="10" value={rtt} onChange={event => setRtt(Number(event.target.value))}/></label><label>Object transmission <span>{transmission} ms</span><input type="range" min="0" max="200" step="5" value={transmission} onChange={event => setTransmission(Number(event.target.value))}/></label><div><span>2RTT + transmission</span><strong>{2 * rtt + transmission} ms</strong></div></div>
  </section>
}

function CacheCalculator({ complete }: { complete: () => void }) {
  const [hitRate, setHitRate] = useState(40)
  const missRate = 1 - hitRate / 100
  const accessTraffic = missRate * 1.5
  const utilization = accessTraffic / 1.54
  const averageDelay = missRate * 2.01 + (hitRate / 100) * 0.01

  return <section className="lab-panel" aria-labelledby="cache-calculator-title">
    <div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="cache-calculator-title">Web cache impact</h2><p>Apply the deck's 1.50 Mbps offered load and 1.54 Mbps access link at different cache hit rates.</p></div></div>
    <div className="cache-calculator"><label>Cache hit rate <span>{hitRate}%</span><input type="range" min="0" max="90" step="5" value={hitRate} onChange={event => setHitRate(Number(event.target.value))}/></label><div className="cache-results"><span>Traffic crossing access link<strong>{accessTraffic.toFixed(2)} Mbps</strong></span><span>Access-link utilization<strong>{utilization.toFixed(2)}</strong></span><span>Weighted average delay<strong>{averageDelay.toFixed(2)} sec</strong></span></div></div>
    <p className={`feedback ${utilization < 0.8 ? 'correct' : 'incorrect'}`}><strong>{utilization < 0.8 ? 'Queue pressure reduced.' : 'Access link remains near saturation.'}</strong> Only cache misses cross the constrained access link.</p>
    <button className="button button-small" onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
  </section>
}

export function Csc138Chapter2Practice({ completeActivity }: Props) {
  return <div className="labs-stack"><TransportMatcher complete={() => completeActivity('ch2-transport-match')}/><HttpExchange complete={() => completeActivity('ch2-http-exchange')}/><CacheCalculator complete={() => completeActivity('ch2-cache-calculator')}/></div>
}
