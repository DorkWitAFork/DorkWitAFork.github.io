import { useState } from 'react'
import { advanceCongestionWindow, calculateEffectiveTcpWindow, calculateOnesComplementChecksum, calculatePipelinedUtilization, calculateRequiredPipelineWindow, calculateRoundTripTimeSeconds, calculateRttEstimate, calculateSelectiveRepeatWindow, calculateStopAndWaitThroughputBps, calculateStopAndWaitUtilization, calculateTcpAck, calculateTransmissionTimeSeconds, calculateUdpLength } from '../lib/transport'
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

const checksumCases = {
  lecture: { label: 'Lecture two-word example', words: [0xe666, 0xd555], answer: 0x4443 },
  segment: { label: 'UDP segment example', words: [0xc000, 0x0201, 0xc633, 0x6402, 0x0011, 0x000c, 0x1388, 0x0035, 0x000c, 0x0000, 0x4142, 0x4344], answer: 0x7b5b },
} as const

function parseHexWord(value: string) {
  const normalized = value.trim().toLowerCase().replace(/^0x/, '')
  return /^[0-9a-f]{1,4}$/.test(normalized) ? Number.parseInt(normalized, 16) : Number.NaN
}

function UdpChecksumLab({ complete }: { complete: () => void }) {
  const [checksumCase, setChecksumCase] = useState<keyof typeof checksumCases>('lecture')
  const [payloadAnswer, setPayloadAnswer] = useState('')
  const [lengthAnswer, setLengthAnswer] = useState('')
  const [checksumAnswer, setChecksumAnswer] = useState('')
  const selectedCase = checksumCases[checksumCase]
  const attempted = payloadAnswer !== '' && lengthAnswer !== '' && checksumAnswer !== ''
  const lengthCorrect = Number.isInteger(Number(payloadAnswer)) && Number(lengthAnswer) === calculateUdpLength(Number(payloadAnswer))
  const checksumCorrect = parseHexWord(checksumAnswer) === selectedCase.answer
  const correct = lengthCorrect && checksumCorrect

  return <section className="lab-panel" aria-labelledby="udp-checksum-title">
    <div className="lab-heading"><span className="lab-number">LAB 02</span><div><h2 id="udp-checksum-title">Solve UDP word problems</h2><p>Compute total segment length from payload size, then perform the selected one&apos;s-complement checksum example from the lecture material.</p></div></div>
    <div className="p2p-calculator">
      <div className="p2p-inputs">
        <label>Payload length <span>bytes</span><input type="number" min="0" value={payloadAnswer} onChange={event => setPayloadAnswer(event.target.value)}/></label><label>UDP length <span>decimal bytes</span><input type="number" min="8" value={lengthAnswer} onChange={event => setLengthAnswer(event.target.value)}/></label>
        <label>One's-complement checksum <span>hex word</span><input type="text" inputMode="text" placeholder="0x0000" value={checksumAnswer} onChange={event => setChecksumAnswer(event.target.value)}/></label>
      </div>
      <label className="bottleneck-check">Checksum case<select value={checksumCase} onChange={event => { setChecksumCase(event.target.value as keyof typeof checksumCases); setChecksumAnswer('') }}><option value="lecture">{checksumCases.lecture.label}</option><option value="segment">{checksumCases.segment.label}</option></select></label><p className="lab-note">UDP length = 8-byte header + payload. Words for this case: {selectedCase.words.map(word => word.toString(16).padStart(4, '0')).join(' ')}. Add with end-around carry, then complement all bits.</p>
    </div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. The UDP length is ${lengthAnswer} bytes and the checksum is 0x${selectedCase.answer.toString(16).padStart(4, '0')}.` : `${lengthCorrect ? 'The UDP length is correct.' : 'Add the 8-byte UDP header to the payload length.'} ${checksumCorrect ? 'The checksum is correct.' : 'Wrap every carry into the low 16 bits before complementing.'}`}</p>}
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

const traceScenarios = {
  ackLoss: {
    label: 'ACK loss and duplicate suppression',
    steps: [
  'Sender transmits packet 0 and starts its timer',
  'Receiver accepts packet 0, delivers its data, and sends ACK 0',
  'ACK 0 is lost in the channel',
  'Sender timer expires and packet 0 is retransmitted',
  'Receiver recognizes duplicate packet 0, suppresses delivery, and resends ACK 0',
  'Sender receives ACK 0, stops the timer, and advances to sequence 1',
    ],
  },
  corruption: {
    label: 'Corrupted data and NAK recovery',
    steps: [
      'Sender creates packet 0 with a checksum and transmits it',
      'Receiver detects corrupted packet 0 and sends NAK',
      'Sender retransmits the saved packet 0',
      'Receiver verifies packet 0, delivers its data, and sends ACK 0',
      'Sender receives ACK 0 and accepts the next application message',
    ],
  },
  delayedAck: {
    label: 'Premature timeout and delayed ACK',
    steps: [
      'Sender transmits packet 1 and starts its timer',
      'Receiver accepts packet 1, delivers its data, and sends ACK 1',
      'ACK 1 is delayed longer than the sender timer',
      'Sender times out and retransmits packet 1',
      'Receiver recognizes duplicate packet 1, suppresses delivery, and sends ACK 1 again',
      'Sender accepts the matching ACK and ignores any stale duplicate ACK later',
    ],
  },
} as const

function RdtTraceLab({ complete }: { complete: () => void }) {
  const [scenario, setScenario] = useState<keyof typeof traceScenarios>('ackLoss')
  const [sequence, setSequence] = useState<string[]>([])
  const steps = traceScenarios[scenario].steps
  const remaining = steps.filter(step => !sequence.includes(step))
  const attempted = sequence.length === steps.length
  const correct = attempted && sequence.every((step, index) => step === steps[index])
  const changeScenario = (next: keyof typeof traceScenarios) => { setScenario(next); setSequence([]) }

  return <section className="lab-panel" aria-labelledby="rdt-trace-title">
    <div className="lab-heading"><span className="lab-number">LAB 04</span><div><h2 id="rdt-trace-title">Trace RDT recovery scenarios</h2><p>Sequence the events in two exam-style traces: corruption recovery and ACK-loss duplicate suppression.</p></div></div>
    <label className="bottleneck-check">Scenario<select value={scenario} onChange={event => changeScenario(event.target.value as keyof typeof traceScenarios)}>{Object.entries(traceScenarios).map(([value, item]) => <option value={value} key={value}>{item.label}</option>)}</select></label>
    <div className="mode-sequence chapter2-sequence csc-sequence"><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the sender's first action below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))} aria-label={`Rewind from step ${index + 1}: ${step}`}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? scenario === 'ackLoss' ? 'Trace complete. The timeout causes a duplicate packet, but the receiver delivers its data only once and repeats ACK 0.' : scenario === 'corruption' ? 'Trace complete. The checksum rejects corrupted data before delivery, and NAK triggers retransmission.' : 'Trace complete. A premature timeout can create duplicate traffic, but sequence numbers prevent duplicate delivery and stale ACKs do not advance the wrong state.' : scenario === 'ackLoss' ? 'Not quite. The receiver delivers packet 0 before its ACK is lost; after timeout, it recognizes the retransmission as a duplicate.' : scenario === 'corruption' ? 'Not quite. The receiver must detect corruption and send NAK before the sender retransmits.' : 'Not quite. The delayed ACK arrives after timeout, so the receiver must suppress the duplicate and the sender must ignore stale feedback.'}</p>}
    <button className="text-button" onClick={() => setSequence([])}>Clear sequence</button>
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

function StopAndWaitLab({ complete }: { complete: () => void }) {
  const [packetLength, setPacketLength] = useState('8000')
  const [rateGbps, setRateGbps] = useState('1')
  const [oneWayDelayMs, setOneWayDelayMs] = useState('15')
  const [transmissionAnswer, setTransmissionAnswer] = useState('')
  const [rttAnswer, setRttAnswer] = useState('')
  const [utilizationAnswer, setUtilizationAnswer] = useState('')
  const [throughputAnswer, setThroughputAnswer] = useState('')
  const [pipelineAnswer, setPipelineAnswer] = useState('')

  let calculation: { transmissionUs: number; rttMs: number; utilization: number; throughputKbps: number } | null = null
  try {
    if (packetLength === '' || rateGbps === '' || oneWayDelayMs === '') throw new RangeError('All inputs are required')
    const transmissionRate = Number(rateGbps) * 1_000_000_000
    const transmissionSeconds = calculateTransmissionTimeSeconds(Number(packetLength), transmissionRate)
    const rttSeconds = calculateRoundTripTimeSeconds(Number(oneWayDelayMs) / 1_000)
    const utilization = calculateStopAndWaitUtilization(Number(packetLength), transmissionRate, rttSeconds)
    calculation = { transmissionUs: transmissionSeconds * 1_000_000, rttMs: rttSeconds * 1_000, utilization, throughputKbps: calculateStopAndWaitThroughputBps(transmissionRate, utilization) / 1_000 }
  } catch {
    calculation = null
  }
  const transmissionCorrect = calculation !== null && Number.isFinite(Number(transmissionAnswer)) && Math.abs(Number(transmissionAnswer) - calculation.transmissionUs) <= 0.01
  const rttCorrect = calculation !== null && Number.isFinite(Number(rttAnswer)) && Math.abs(Number(rttAnswer) - calculation.rttMs) <= 0.01
  const utilizationCorrect = calculation !== null && Number.isFinite(Number(utilizationAnswer)) && Math.abs(Number(utilizationAnswer) - calculation.utilization * 100) <= 0.001
  const throughputCorrect = calculation !== null && Number.isFinite(Number(throughputAnswer)) && Math.abs(Number(throughputAnswer) - calculation.throughputKbps) <= 1
  const pipelineCorrect = pipelineAnswer === 'Keep multiple unacknowledged packets in flight'
  const attempted = transmissionAnswer !== '' && rttAnswer !== '' && utilizationAnswer !== '' && throughputAnswer !== '' && pipelineAnswer !== ''
  const correct = transmissionCorrect && rttCorrect && utilizationCorrect && throughputCorrect && pipelineCorrect
  const updateInput = (setter: (value: string) => void, value: string) => {
    setter(value)
    setTransmissionAnswer('')
    setRttAnswer('')
    setUtilizationAnswer('')
    setThroughputAnswer('')
  }

  return <section className="lab-panel" aria-labelledby="stop-wait-title">
    <div className="lab-heading"><span className="lab-number">LAB 05</span><div><h2 id="stop-wait-title">Solve the lecture stop-and-wait problem</h2><p>Work from packet length, link rate, and one-way propagation delay through transmission time, RTT, utilization, and useful throughput.</p></div></div>
    <div className="p2p-calculator">
      <div className="p2p-inputs">
        <label>Packet length L <span>bits</span><input type="number" min="1" value={packetLength} onChange={event => updateInput(setPacketLength, event.target.value)}/></label>
        <label>Link rate R <span>Gbps</span><input type="number" min="0.000001" step="any" value={rateGbps} onChange={event => updateInput(setRateGbps, event.target.value)}/></label>
        <label>One-way propagation <span>milliseconds</span><input type="number" min="0" step="any" value={oneWayDelayMs} onChange={event => updateInput(setOneWayDelayMs, event.target.value)}/></label>
        <label>Transmission time L/R <span>microseconds</span><input type="number" min="0" step="any" value={transmissionAnswer} onChange={event => setTransmissionAnswer(event.target.value)}/></label>
        <label>Round-trip time <span>milliseconds</span><input type="number" min="0" step="any" value={rttAnswer} onChange={event => setRttAnswer(event.target.value)}/></label>
        <label>Sender utilization <span>percent, within 0.001</span><input type="number" min="0" max="100" step="any" value={utilizationAnswer} onChange={event => setUtilizationAnswer(event.target.value)}/></label>
        <label>Useful throughput <span>kilobits/s, within 1</span><input type="number" min="0" step="any" value={throughputAnswer} onChange={event => setThroughputAnswer(event.target.value)}/></label>
      </div>
      <p className="lab-note">Use RTT = 2 × one-way propagation, U = (L/R) / (RTT + L/R), and useful throughput = R × U. Ignore ACK transmission time and processing delay.</p>
    </div>
    <label className="bottleneck-check">How does pipelining improve utilization?<select value={pipelineAnswer} onChange={event => setPipelineAnswer(event.target.value)}><option value="">Choose the key idea</option><option>Shorten every packet's propagation delay</option><option>Keep multiple unacknowledged packets in flight</option><option>Remove sequence numbers and acknowledgments</option></select></label>
    {calculation === null && <p role="status" className="feedback incorrect">Use positive finite packet length and link rate, plus a non-negative finite one-way delay.</p>}
    {calculation !== null && attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. L/R is ${calculation.transmissionUs.toFixed(3)} microseconds, RTT is ${calculation.rttMs.toFixed(3)} ms, utilization is ${(calculation.utilization * 100).toFixed(3)}%, and useful throughput is ${calculation.throughputKbps.toFixed(1)} kbps.` : `${transmissionCorrect && rttCorrect ? 'The time conversions are correct.' : 'First calculate L/R in microseconds and double the one-way delay for RTT.'} ${utilizationCorrect && throughputCorrect ? 'The utilization and throughput are correct.' : 'Use the complete cycle RTT + L/R, then multiply the link rate by the utilization fraction.'} ${pipelineCorrect ? 'The pipelining concept is correct.' : 'Pipelining overlaps waiting with additional unacknowledged packets; it does not change propagation delay.'}`}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

function PipelineLab({ complete }: { complete: () => void }) {
  const [window, setWindow] = useState('4')
  const [answer, setAnswer] = useState('')
  const [required, setRequired] = useState('')
  const valid = Number(window) > 0 && Number.isInteger(Number(window))
  const utilization = valid ? calculatePipelinedUtilization(Number(window), 8_000, 1_000_000_000, 0.03) * 100 : 0
  const requiredWindow = calculateRequiredPipelineWindow(8_000, 1_000_000_000, 0.03)
  const correct = Math.abs(Number(answer) - utilization) < 0.001 && Number(required) === requiredWindow
  return <section className="lab-panel" aria-labelledby="pipeline-title"><div className="lab-heading"><span className="lab-number">LAB 06</span><div><h2 id="pipeline-title">Fill the pipeline</h2><p>Use 8,000-bit packets, a 1 Gbps link, and a 30 ms RTT. The model ignores ACK transmission and processing time.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>Window size <span>packets</span><input type="number" min="1" value={window} onChange={e => { setWindow(e.target.value); setAnswer(''); setRequired('') }}/></label><label>Utilization <span>percent, within 0.001</span><input type="number" step="any" value={answer} onChange={e => setAnswer(e.target.value)}/></label><label>Window for approximately full use <span>packets</span><input type="number" min="1" value={required} onChange={e => setRequired(e.target.value)}/></label></div><p className="lab-note">U = min(1, N × L/R ÷ (RTT + L/R)). Required window = ceil(RTT ÷ (L/R) + 1).</p></div>{answer && required && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. A window of ${window} gives ${utilization.toFixed(3)}% utilization, and ${requiredWindow} packets fill the modeled path.` : 'Use seconds consistently. Multiply the packet transmission time by the window before dividing by RTT plus one transmission time.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function PipelineRecoveryLab({ complete }: { complete: () => void }) {
  const [strategy, setStrategy] = useState('')
  const [loss, setLoss] = useState('')
  const correct = strategy === 'Selective Repeat' && loss === 'Retransmit only packet 2 and buffer later packets'
  return <section className="lab-panel" aria-labelledby="recovery-title"><div className="lab-heading"><span className="lab-number">LAB 07</span><div><h2 id="recovery-title">Choose a pipelined recovery</h2><p>Packet 2 is lost, while packets 3 and 4 arrive correctly. Compare the two classic strategies.</p></div></div><label className="bottleneck-check">Protocol<select value={strategy} onChange={e => setStrategy(e.target.value)}><option value="">Choose a protocol</option><option>Go-Back-N</option><option>Selective Repeat</option></select></label><label className="bottleneck-check">Most efficient recovery<select value={loss} onChange={e => setLoss(e.target.value)}><option value="">Choose the behavior</option><option>Retransmit packet 2 and every later packet</option><option>Retransmit only packet 2 and buffer later packets</option></select></label>{strategy && loss && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. Selective Repeat acknowledges and buffers packets 3 and 4, then retransmits only the missing packet.' : 'Selective Repeat can buffer out-of-order packets and retransmit only the missing packet; Go-Back-N retransmits a suffix.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function TcpAckLab({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState('7001')
  const [payload, setPayload] = useState('500')
  const [ack, setAck] = useState('')
  const [syn, setSyn] = useState(false)
  const expected = Number.isInteger(Number(sequence)) && Number.isInteger(Number(payload)) ? calculateTcpAck(Number(sequence), Number(payload), syn) : Number.NaN
  const correct = Number(ack) === expected
  return <section className="lab-panel" aria-labelledby="tcp-ack-title"><div className="lab-heading"><span className="lab-number">LAB 08</span><div><h2 id="tcp-ack-title">Calculate the next TCP ACK</h2><p>Find the next byte expected after an in-order segment. Toggle SYN to include its one sequence-space position.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>Starting sequence <span>byte number</span><input type="number" min="0" value={sequence} onChange={e => setSequence(e.target.value)}/></label><label>Payload <span>bytes</span><input type="number" min="0" value={payload} onChange={e => setPayload(e.target.value)}/></label><label>Expected ACK <span>byte number</span><input type="number" min="0" value={ack} onChange={e => setAck(e.target.value)}/></label></div><label className="bottleneck-check"><input type="checkbox" checked={syn} onChange={e => setSyn(e.target.checked)}/> Segment also carries SYN</label><p className="lab-note">ACK = sequence + payload bytes + 1 when SYN is present. FIN uses the same one-position rule.</p></div>{ack && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. The next expected byte is ${expected}.` : 'Add the payload length to the starting sequence number. Add one more only when SYN or FIN consumes sequence space.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function SequenceSpaceLab({ complete }: { complete: () => void }) {
  const [bits, setBits] = useState('4')
  const [window, setWindow] = useState('8')
  const [checked, setChecked] = useState(false)
  const limit = Number.isInteger(Number(bits)) && Number(bits) > 0 ? calculateSelectiveRepeatWindow(Number(bits)) : 0
  const correct = Number(window) <= limit && checked
  return <section className="lab-panel" aria-labelledby="sequence-space-title"><div className="lab-heading"><span className="lab-number">LAB 10</span><div><h2 id="sequence-space-title">Check sequence-space safety</h2><p>For Selective Repeat, choose a window no larger than half the sequence space.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>Sequence bits <span>m</span><input type="number" min="1" max="30" value={bits} onChange={e => setBits(e.target.value)}/></label><label>SR window <span>packets</span><input type="number" min="1" value={window} onChange={e => setWindow(e.target.value)}/></label></div><p className="lab-note">Safe maximum for {bits} bits: {limit || 'invalid input'} packets. Rule: W &lt;= 2^(m - 1).</p><label className="bottleneck-check"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}/> I can explain why an old wrapped value must not look new</label></div>{checked && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Safe. The current acceptance window leaves enough unused sequence values to separate delayed duplicates.' : 'Reduce the window to the half-space limit for the selected sequence size.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function RttLab({ complete }: { complete: () => void }) {
  const [sample, setSample] = useState('120')
  const [estimate, setEstimate] = useState('100')
  const [deviation, setDeviation] = useState('20')
  const [answer, setAnswer] = useState('')
  const result = calculateRttEstimate(Number(sample) / 1000, Number(estimate) / 1000, Number(deviation) / 1000)
  const correct = Math.abs(Number(answer) - result.timeoutSeconds * 1000) < 0.01
  return <section className="lab-panel" aria-labelledby="rtt-title"><div className="lab-heading"><span className="lab-number">LAB 11</span><div><h2 id="rtt-title">Estimate a TCP timeout</h2><p>Use one SampleRTT of 120 ms, prior EstimatedRTT of 100 ms, and prior DevRTT of 20 ms.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>SampleRTT <span>milliseconds</span><input type="number" min="0" value={sample} onChange={e => setSample(e.target.value)}/></label><label>Prior EstimatedRTT <span>milliseconds</span><input type="number" min="0" value={estimate} onChange={e => setEstimate(e.target.value)}/></label><label>Prior DevRTT <span>milliseconds</span><input type="number" min="0" value={deviation} onChange={e => setDeviation(e.target.value)}/></label><label>TimeoutInterval <span>milliseconds</span><input type="number" min="0" step="any" value={answer} onChange={e => setAnswer(e.target.value)}/></label></div><p className="lab-note">Use alpha = 0.125, beta = 0.25, then TimeoutInterval = EstimatedRTT + 4 DevRTT.</p></div>{answer && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? `Correct. The modeled timeout is ${result.timeoutSeconds * 1000} ms.` : 'Smooth the sample first, update deviation using the new estimate, then add four deviations.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function FlowWindowLab({ complete }: { complete: () => void }) {
  const [rwnd, setRwnd] = useState('12000')
  const [cwnd, setCwnd] = useState('8000')
  const [answer, setAnswer] = useState('')
  const correct = Number(answer) === calculateEffectiveTcpWindow(Number(rwnd), Number(cwnd))
  return <section className="lab-panel" aria-labelledby="flow-title"><div className="lab-heading"><span className="lab-number">LAB 12</span><div><h2 id="flow-title">Find the effective TCP window</h2><p>The receiver advertises 12,000 bytes and congestion control allows 8,000 bytes.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>rwnd <span>bytes</span><input type="number" min="0" value={rwnd} onChange={e => setRwnd(e.target.value)}/></label><label>cwnd <span>bytes</span><input type="number" min="0" value={cwnd} onChange={e => setCwnd(e.target.value)}/></label><label>Effective window <span>bytes</span><input type="number" min="0" value={answer} onChange={e => setAnswer(e.target.value)}/></label></div><p className="lab-note">Effective sending window = min(rwnd, cwnd). Flow control and congestion control impose independent limits.</p></div>{answer && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. The smaller path limit controls how many bytes may be outstanding.' : 'Take the smaller of the advertised receive window and congestion window.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

function CongestionLab({ complete }: { complete: () => void }) {
  const [cwnd, setCwnd] = useState(1)
  const [ssthresh, setSsthresh] = useState(8)
  const [event, setEvent] = useState<'ack' | 'timeout' | 'triple-duplicate-ack'>('ack')
  const next = advanceCongestionWindow(cwnd, ssthresh, event)
  const [checked, setChecked] = useState(false)
  const correct = event === 'timeout' && next.cwnd === 1 && next.ssthresh === 4 && checked
  return <section className="lab-panel" aria-labelledby="congestion-title"><div className="lab-heading"><span className="lab-number">LAB 09</span><div><h2 id="congestion-title">Step the congestion window</h2><p>Start with cwnd 8 and ssthresh 8, then model a timeout. This is an intentionally simplified round-based exercise.</p></div></div><div className="p2p-calculator"><div className="p2p-inputs"><label>cwnd <span>segments</span><input type="number" min="1" value={cwnd} onChange={e => setCwnd(Number(e.target.value))}/></label><label>ssthresh <span>segments</span><input type="number" min="2" value={ssthresh} onChange={e => setSsthresh(Number(e.target.value))}/></label></div><label className="bottleneck-check">Event<select value={event} onChange={e => setEvent(e.target.value as typeof event)}><option value="ack">ACK round</option><option value="timeout">Timeout</option><option value="triple-duplicate-ack">Triple duplicate ACK</option></select></label><p className="lab-note">Next modeled state: cwnd {next.cwnd}, ssthresh {next.ssthresh}, phase {next.phase}.</p><label className="bottleneck-check"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}/> I can explain why timeout is stronger congestion evidence</label></div>{checked && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. A timeout resets cwnd to 1 and halves the previous congestion window for ssthresh.' : 'Set cwnd to 8, choose Timeout, and observe the conservative reduction.'}</p>}<CompletionButton ready={correct} complete={complete}/></section>
}

export function Csc138Chapter3Practice({ completeActivity }: Props) {
  return <div className="labs-stack">
    <DemultiplexingLab complete={() => completeActivity('ch3-demultiplexing')}/>
    <UdpChecksumLab complete={() => completeActivity('ch3-udp-checksum')}/>
    <RdtMechanismsLab complete={() => completeActivity('ch3-rdt-mechanisms')}/>
    <RdtTraceLab complete={() => completeActivity('ch3-rdt-trace')}/>
    <StopAndWaitLab complete={() => completeActivity('ch3-stop-wait')}/>
    <PipelineLab complete={() => completeActivity('ch3-pipeline-window')}/>
    <PipelineRecoveryLab complete={() => completeActivity('ch3-gbn-sr')}/>
    <TcpAckLab complete={() => completeActivity('ch3-tcp-ack')}/>
    <CongestionLab complete={() => completeActivity('ch3-congestion-window')}/>
    <SequenceSpaceLab complete={() => completeActivity('ch3-sequence-space')}/>
    <RttLab complete={() => completeActivity('ch3-rtt-rto')}/>
    <FlowWindowLab complete={() => completeActivity('ch3-tcp-flow')}/>
  </div>
}
