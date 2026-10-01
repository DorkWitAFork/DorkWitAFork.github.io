import { useState } from 'react'
import { calculateOnesComplementChecksum, calculateStopAndWaitUtilization } from '../lib/transport'
import { Icon } from './Icons'

type Props = {
  completeActivity: (id: string) => void
}

function CompletionButton({ ready, complete }: { ready: boolean; complete: () => void }) {
  return <button className="button button-small" disabled={!ready} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
}

const demultiplexingItems = [
  ['Fields normally used to choose a UDP receiving socket', 'Destination port'],
  ['Fields used to identify a connection-oriented TCP socket', 'Source IP, source port, destination IP, destination port'],
  ['Two UDP datagrams from different senders with the same destination IP and port', 'Delivered to the same UDP socket'],
  ['Two TCP segments for clients with different source endpoints but the same server port', 'Delivered to different connected sockets'],
] as const

const demultiplexingChoices = [
  'Destination port',
  'Source IP, source port, destination IP, destination port',
  'Delivered to the same UDP socket',
  'Delivered to different connected sockets',
]

function DemultiplexingLab({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const attempted = Object.keys(answers).length === demultiplexingItems.length
  const correct = demultiplexingItems.every(([, answer], index) => answers[index] === answer)

  return <section className="lab-panel" aria-labelledby="demultiplexing-title">
    <div className="lab-heading"><span className="lab-number">LAB 01</span><div><h2 id="demultiplexing-title">Demultiplex transport traffic</h2><p>Distinguish UDP destination-port delivery from connection-oriented 4-tuple delivery.</p></div></div>
    <div className="architecture-matcher">{demultiplexingItems.map(([item, answer], index) => <label key={item}><span>{item}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose the result</option>{demultiplexingChoices.map(choice => <option key={choice}>{choice}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. UDP commonly groups datagrams by destination socket, while a connected TCP socket is identified by all four endpoint fields.' : 'Recheck which protocol keeps per-connection state. A shared server port can identify many distinct TCP connections.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const udpChecksumWords = [0xc000, 0x0201, 0xc633, 0x6402, 0x0011, 0x000c, 0x1388, 0x0035, 0x000c, 0x0000, 0x4142, 0x4344]
const udpChecksum = calculateOnesComplementChecksum(udpChecksumWords)

function parseHexWord(value: string) {
  const normalized = value.trim().toLowerCase().replace(/^0x/, '')
  return /^[0-9a-f]{1,4}$/.test(normalized) ? Number.parseInt(normalized, 16) : Number.NaN
}

function UdpChecksumLab({ complete }: { complete: () => void }) {
  const [lengthAnswer, setLengthAnswer] = useState('')
  const [checksumAnswer, setChecksumAnswer] = useState('')
  const attempted = lengthAnswer !== '' && checksumAnswer !== ''
  const lengthCorrect = Number(lengthAnswer) === 12
  const checksumCorrect = parseHexWord(checksumAnswer) === udpChecksum
  const correct = lengthCorrect && checksumCorrect

  return <section className="lab-panel" aria-labelledby="udp-checksum-title">
    <div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="udp-checksum-title">Build a UDP length and checksum</h2><p>A 4-byte payload follows the 8-byte UDP header. Compute its UDP length, then checksum the supplied pseudoheader, UDP header, and payload words.</p></div></div>
    <div className="p2p-calculator">
      <div className="p2p-inputs">
        <label>UDP length <span>decimal bytes</span><input type="number" min="8" value={lengthAnswer} onChange={event => setLengthAnswer(event.target.value)}/></label>
        <label>One's-complement checksum <span>hex word</span><input type="text" inputMode="text" placeholder="0x0000" value={checksumAnswer} onChange={event => setChecksumAnswer(event.target.value)}/></label>
      </div>
      <p className="lab-note">16-bit words: c000 0201 c633 6402 0011 000c | 1388 0035 000c 0000 | 4142 4344. Add with end-around carry, then complement all bits.</p>
    </div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. The UDP length is 12 bytes and the checksum is 0x7b5b.' : `${lengthCorrect ? 'The 12-byte UDP length is correct.' : 'UDP length includes both the 8-byte header and payload.'} ${checksumCorrect ? 'The checksum is correct.' : 'For the checksum, wrap each carry into the low 16 bits before complementing.'}`}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const rdtItems = [
  ['rdt1.0: the underlying channel is perfectly reliable', 'No receiver feedback or retransmission'],
  ['rdt2.0: data packets may have bit errors', 'Checksum plus ACK and NAK'],
  ['rdt2.1: an ACK or NAK may itself be corrupted', 'Sequence number and retransmission'],
  ['rdt2.2: provide the same protection without NAK', 'ACK the last correctly received packet'],
  ['rdt3.0: packets or acknowledgments may be lost', 'Countdown timer and timeout retransmission'],
] as const

const rdtChoices = rdtItems.map(([, answer]) => answer)

function RdtMechanismsLab({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const attempted = Object.keys(answers).length === rdtItems.length
  const correct = rdtItems.every(([, answer], index) => answers[index] === answer)

  return <section className="lab-panel" aria-labelledby="rdt-mechanisms-title">
    <div className="lab-heading"><span className="lab-number">LAB 03</span><div><h2 id="rdt-mechanisms-title">Match RDT problems to mechanisms</h2><p>Follow reliable data transfer from a reliable channel through corruption and loss.</p></div></div>
    <div className="architecture-matcher">{rdtItems.map(([item, answer], index) => <label key={item}><span>{item}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose the mechanism</option>{rdtChoices.map(choice => <option key={choice}>{choice}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Mechanisms matched. Each version adds only what the newly less-reliable channel requires.' : 'Trace the progression: detect corruption, recover ambiguous feedback with sequence numbers, then detect loss with time.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const ackLossSteps = [
  'Sender transmits packet 0 and starts its timer',
  'Receiver accepts packet 0, delivers its data, and sends ACK 0',
  'ACK 0 is lost in the channel',
  'Sender timer expires and packet 0 is retransmitted',
  'Receiver recognizes duplicate packet 0, suppresses delivery, and resends ACK 0',
  'Sender receives ACK 0, stops the timer, and advances to sequence 1',
]

function RdtTraceLab({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const remaining = ackLossSteps.filter(step => !sequence.includes(step))
  const attempted = sequence.length === ackLossSteps.length
  const correct = attempted && sequence.every((step, index) => step === ackLossSteps[index])

  return <section className="lab-panel" aria-labelledby="rdt-trace-title">
    <div className="lab-heading"><span className="lab-number">LAB 04</span><div><h2 id="rdt-trace-title">Trace rdt3.0 through ACK loss</h2><p>Sequence the timeout and duplicate-suppression behavior that preserves exactly-once delivery.</p></div></div>
    <div className="mode-sequence chapter2-sequence csc-sequence"><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the sender's first action below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))} aria-label={`Rewind from step ${index + 1}: ${step}`}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Trace complete. The timeout causes a duplicate packet, but the receiver delivers its data only once and repeats ACK 0.' : 'Not quite. The receiver delivers packet 0 before its ACK is lost; after timeout, it recognizes the retransmission as a duplicate.'}</p>}
    <button className="text-button" onClick={() => setSequence([])}>Clear sequence</button>
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

function StopAndWaitLab({ complete }: { complete: () => void }) {
  const [packetLength, setPacketLength] = useState('12000')
  const [rateMbps, setRateMbps] = useState('12')
  const [rttMs, setRttMs] = useState('39')
  const [utilizationAnswer, setUtilizationAnswer] = useState('')
  const [pipelineAnswer, setPipelineAnswer] = useState('')

  let utilization: number | null = null
  try {
    if (packetLength === '' || rateMbps === '' || rttMs === '') throw new RangeError('All inputs are required')
    utilization = calculateStopAndWaitUtilization(Number(packetLength), Number(rateMbps) * 1_000_000, Number(rttMs) / 1_000)
  } catch {
    utilization = null
  }
  const utilizationCorrect = utilization !== null && Number.isFinite(Number(utilizationAnswer)) && Math.abs(Number(utilizationAnswer) - utilization * 100) <= 0.01
  const pipelineCorrect = pipelineAnswer === 'Keep multiple unacknowledged packets in flight'
  const attempted = utilizationAnswer !== '' && pipelineAnswer !== ''
  const correct = utilizationCorrect && pipelineCorrect
  const updateInput = (setter: (value: string) => void, value: string) => {
    setter(value)
    setUtilizationAnswer('')
  }

  return <section className="lab-panel" aria-labelledby="stop-wait-title">
    <div className="lab-heading"><span className="lab-number">LAB 05</span><div><h2 id="stop-wait-title">Calculate stop-and-wait utilization</h2><p>Use transmission time L/R and RTT to find the fraction of each send-and-wait cycle spent transmitting.</p></div></div>
    <div className="p2p-calculator">
      <div className="p2p-inputs">
        <label>Packet length L <span>bits</span><input type="number" min="1" value={packetLength} onChange={event => updateInput(setPacketLength, event.target.value)}/></label>
        <label>Transmission rate R <span>Mbps</span><input type="number" min="0.000001" step="any" value={rateMbps} onChange={event => updateInput(setRateMbps, event.target.value)}/></label>
        <label>Round-trip time <span>milliseconds</span><input type="number" min="0" step="any" value={rttMs} onChange={event => updateInput(setRttMs, event.target.value)}/></label>
        <label>Sender utilization <span>percent, within 0.01</span><input type="number" min="0" max="100" step="any" value={utilizationAnswer} onChange={event => setUtilizationAnswer(event.target.value)}/></label>
      </div>
      <p className="lab-note">Use U = (L/R) / (RTT + L/R). Ignore ACK transmission time and processing delay for this model.</p>
    </div>
    <label className="bottleneck-check">How does pipelining improve utilization?<select value={pipelineAnswer} onChange={event => setPipelineAnswer(event.target.value)}><option value="">Choose the key idea</option><option>Shorten every packet's propagation delay</option><option>Keep multiple unacknowledged packets in flight</option><option>Remove sequence numbers and acknowledgments</option></select></label>
    {utilization === null && <p role="status" className="feedback incorrect">Use a positive finite packet length and rate, plus a non-negative finite RTT.</p>}
    {utilization !== null && attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. L/R is ${(Number(packetLength) / (Number(rateMbps) * 1_000_000) * 1_000).toFixed(3)} ms, so utilization is ${(utilization * 100).toFixed(3)}%. Pipelining fills otherwise idle waiting time.` : `${utilizationCorrect ? 'The utilization calculation is correct.' : 'Divide transmission time by RTT plus transmission time, then convert the ratio to percent.'} ${pipelineCorrect ? 'The pipelining concept is correct.' : 'Pipelining overlaps waiting with additional unacknowledged packets; it does not change propagation delay.'}`}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

export function Csc138Chapter3Practice({ completeActivity }: Props) {
  return <div className="labs-stack">
    <DemultiplexingLab complete={() => completeActivity('ch3-demultiplexing')}/>
    <UdpChecksumLab complete={() => completeActivity('ch3-udp-checksum')}/>
    <RdtMechanismsLab complete={() => completeActivity('ch3-rdt-mechanisms')}/>
    <RdtTraceLab complete={() => completeActivity('ch3-rdt-trace')}/>
    <StopAndWaitLab complete={() => completeActivity('ch3-stop-wait')}/>
  </div>
}
