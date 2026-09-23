import { useEffect, useState } from 'react'
import { calculateDistributionTimes, type DistributionInputs } from '../lib/p2p'
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

function CompletionButton({ ready, complete }: { ready: boolean; complete: () => void }) {
  return <button className="button button-small" disabled={!ready} onClick={complete}><Icon name="check" size={17}/> Mark activity complete</button>
}

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

const smtpSteps = [
  'Server replies 220 Ready',
  'Client sends HELO sender.example',
  'Server replies 250 Greeting accepted',
  'Client sends MAIL FROM and RCPT TO',
  'Client sends DATA',
  'Server replies 354 Start mail input',
  'Client sends message content and a line containing only a period',
  'Server replies 250 Message accepted',
  'Client sends QUIT',
]

const smtpItems = [
  ['MAIL FROM:<alice@example>', 'Envelope command'],
  ['Subject: Lab reminder', 'Message content'],
  ['354 Start mail input', 'Server reply'],
] as const

const smtpKinds = ['Envelope command', 'Message content', 'Server reply']

function SmtpConversation({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const remaining = smtpSteps.filter(step => !sequence.includes(step))
  const sequenceCorrect = sequence.length === smtpSteps.length && sequence.every((step, index) => step === smtpSteps[index])
  const classificationCorrect = smtpItems.every(([, answer], index) => answers[index] === answer)
  const ready = sequenceCorrect && classificationCorrect

  return <section className="lab-panel" aria-labelledby="smtp-flow-title">
    <div className="lab-heading"><span className="lab-number">LAB 04</span><div><h2 id="smtp-flow-title">Build an SMTP conversation</h2><p>Order a simplified mail transfer, then separate envelope commands, message content, and server replies.</p></div></div>
    <div className="mode-sequence chapter2-sequence csc-sequence"><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the first SMTP event below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))} aria-label={`Rewind from step ${index + 1}: ${step}`}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {sequence.length === smtpSteps.length && <p role="status" className={`feedback ${sequenceCorrect ? 'correct' : 'incorrect'}`}>{sequenceCorrect ? 'The SMTP commands and replies are in order. Now classify the pieces below.' : 'Not quite. The server greets first, and DATA must be accepted before the message content is sent. Click a placed event to rewind.'}</p>}
    <div className="architecture-matcher">{smtpItems.map(([item, answer], index) => <label key={item}><span>{item}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose its role</option>{smtpKinds.map(kind => <option key={kind}>{kind}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    {ready && <p role="status" className="feedback correct"><strong>Conversation complete.</strong> SMTP envelope commands route the mail; headers and body belong to the message sent after DATA.</p>}
    <CompletionButton ready={ready} complete={complete}/>
  </section>
}

const ftpItems = [
  ['USER alice', 'Control connection'],
  ['331 Password required', 'Control connection'],
  ['RETR notes.pdf', 'Control connection'],
  ['The bytes of notes.pdf', 'Data connection'],
  ['A requested directory listing', 'Data connection'],
  ['226 Transfer complete', 'Control connection'],
] as const

function FtpConnectionSorter({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const attempted = Object.keys(answers).length === ftpItems.length
  const correct = ftpItems.every(([, answer], index) => answers[index] === answer)

  return <section className="lab-panel" aria-labelledby="ftp-connections-title">
    <div className="lab-heading"><span className="lab-number">LAB 05</span><div><h2 id="ftp-connections-title">Sort FTP control and data</h2><p>Decide which TCP connection carries each item. Commands and replies stay on control; transferred contents use data.</p></div></div>
    <div className="transport-match-grid">{ftpItems.map(([item, answer], index) => <fieldset key={item}><legend>{item}</legend>{['Control connection', 'Data connection'].map(choice => {
      const selected = answers[index] === choice
      return <label className={selected ? choice === answer ? 'right' : 'wrong' : ''} key={choice}><input type="radio" name={`ftp-${index}`} checked={selected} onChange={() => setAnswers(current => ({ ...current, [index]: choice }))}/><span>{choice}</span></label>
    })}</fieldset>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Correct. The port-21 control session remains available while each listing or file uses a separate data connection.' : 'Recheck the distinction: RETR requests a transfer on control, but the requested file bytes travel on data.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const dnsResolutionSteps = [
  'Host asks its local DNS resolver for www.example.com',
  'Local resolver asks a root DNS server',
  'Root server refers the resolver to a .com TLD server',
  'Local resolver asks the .com TLD server',
  'TLD server refers the resolver to example.com authoritative DNS',
  'Local resolver asks the authoritative DNS server',
  'Authoritative server returns the address record',
  'Local resolver returns the answer to the host',
]

function DnsResolution({ complete }: { complete: () => void }) {
  const [sequence, setSequence] = useState<string[]>([])
  const remaining = dnsResolutionSteps.filter(step => !sequence.includes(step))
  const correct = sequence.length === dnsResolutionSteps.length && sequence.every((step, index) => step === dnsResolutionSteps[index])

  return <section className="lab-panel" aria-labelledby="dns-resolution-title">
    <div className="lab-heading"><span className="lab-number">LAB 06</span><div><h2 id="dns-resolution-title">Trace iterative DNS resolution</h2><p>Follow an uncached lookup as the local resolver uses referrals to move down the DNS hierarchy.</p></div></div>
    <div className="mode-sequence chapter2-sequence csc-sequence"><div className="sequence-lane">{sequence.length === 0 && <span className="sequence-empty">Choose the host's first action below</span>}{sequence.map((step, index) => <button key={step} onClick={() => setSequence(current => current.slice(0, index))} aria-label={`Rewind from step ${index + 1}: ${step}`}><b>{index + 1}</b>{step}<span>↓</span></button>)}</div></div>
    <div className="choice-row">{remaining.map(step => <button className="chip" key={step} onClick={() => setSequence(current => [...current, step])}>{step}</button>)}</div>
    {sequence.length === dnsResolutionSteps.length && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Resolution complete. Root and TLD servers provide referrals; the authoritative server provides the final record.' : 'Follow each referral before contacting the next server. Click a placed step to rewind.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const dnsRecordItems = [
  ['www.example.com → 192.0.2.10', 'A'],
  ['example.com → dns1.example.com (authoritative server)', 'NS'],
  ['shop.example.com → storefront.hosting.example', 'CNAME'],
  ['example.com → mail.example.com', 'MX'],
  ['Authenticate signed DNS data and detect modification', 'DNSSEC provides'],
  ['Encrypt queried names or guarantee service during DDoS', 'DNSSEC does not provide'],
] as const

const dnsRecordChoices = ['A', 'NS', 'CNAME', 'MX', 'DNSSEC provides', 'DNSSEC does not provide']

function DnsRecordsAndSecurity({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const attempted = Object.keys(answers).length === dnsRecordItems.length
  const correct = dnsRecordItems.every(([, answer], index) => answers[index] === answer)

  return <section className="lab-panel" aria-labelledby="dns-records-title">
    <div className="lab-heading"><span className="lab-number">LAB 07</span><div><h2 id="dns-records-title">Match DNS records and DNSSEC scope</h2><p>Choose the record type that expresses each fact, then identify what DNSSEC does and does not protect.</p></div></div>
    <div className="architecture-matcher">{dnsRecordItems.map(([item, answer], index) => <label key={item}><span>{item}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose a match</option>{dnsRecordChoices.map(choice => <option key={choice}>{choice}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'All matched. DNSSEC authenticates signed DNS data and its integrity; it does not provide confidentiality or availability.' : 'Review what each record value names. Remember that DNSSEC signs data but does not encrypt or stop traffic floods.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

const distributionDefaults: DistributionInputs = {
  fileSizeMbits: 20_480,
  peers: 1_000,
  serverUploadMbps: 30,
  minimumDownloadMbps: 2,
  peerUploadMbps: 2,
}

const bottleneckLabels = {
  initialServerCopy: 'Initial server copy',
  minimumDownload: 'Slowest peer download',
  aggregateUpload: 'Aggregate swarm upload',
} as const

function formatDuration(seconds: number) {
  if (seconds >= 86_400) return `${(seconds / 86_400).toFixed(2)} days`
  if (seconds >= 3_600) return `${(seconds / 3_600).toFixed(2)} hours`
  if (seconds >= 60) return `${(seconds / 60).toFixed(2)} minutes`
  return `${seconds.toFixed(2)} seconds`
}

function P2pDistributionCalculator({ complete }: { complete: () => void }) {
  const [inputs, setInputs] = useState(distributionDefaults)
  const [bottleneck, setBottleneck] = useState('')
  const result = calculateDistributionTimes(inputs)
  const p2pTerms = Object.entries(result.p2pLimits) as Array<[keyof typeof result.p2pLimits, number]>
  const largestP2pTime = Math.max(...p2pTerms.map(([, seconds]) => seconds))
  const limitingP2pTerms = result.valid ? p2pTerms.filter(([, seconds]) => Math.abs(seconds - largestP2pTime) < 0.001).map(([term]) => term) : []
  const ready = result.valid && limitingP2pTerms.includes(bottleneck as keyof typeof result.p2pLimits)
  const update = (key: keyof DistributionInputs, value: number) => {
    setInputs(current => ({ ...current, [key]: value }))
    setBottleneck('')
  }

  return <section className="lab-panel" aria-labelledby="p2p-distribution-title">
    <div className="lab-heading"><span className="lab-number">LAB 08</span><div><h2 id="p2p-distribution-title">Compare file distribution time</h2><p>Change endpoint capacities, compare the ideal lower bounds, and identify the active P2P bottleneck.</p></div></div>
    <div className="p2p-calculator">
      <div className="p2p-inputs">
        <label>File size F <span>Mbits</span><input type="number" min="1" value={inputs.fileSizeMbits} onChange={event => update('fileSizeMbits', Number(event.target.value))}/></label>
        <label>Receiving peers N <span>peers</span><input type="number" min="1" value={inputs.peers} onChange={event => update('peers', Number(event.target.value))}/></label>
        <label>Server upload u<sub>s</sub> <span>Mbps</span><input type="number" min="1" value={inputs.serverUploadMbps} onChange={event => update('serverUploadMbps', Number(event.target.value))}/></label>
        <label>Slowest download d<sub>min</sub> <span>Mbps</span><input type="number" min="1" value={inputs.minimumDownloadMbps} onChange={event => update('minimumDownloadMbps', Number(event.target.value))}/></label>
        <label>Each peer upload u <span>Mbps</span><input type="number" min="0" value={inputs.peerUploadMbps} onChange={event => update('peerUploadMbps', Number(event.target.value))}/></label>
      </div>
      <div className="p2p-results" aria-live="polite"><article><span>CLIENT-SERVER LOWER BOUND</span><strong>{result.valid ? formatDuration(result.clientServerSeconds) : 'Check inputs'}</strong><small>max(NF/u<sub>s</sub>, F/d<sub>min</sub>)</small></article><article><span>P2P LOWER BOUND</span><strong>{result.valid ? formatDuration(result.p2pSeconds) : 'Check inputs'}</strong><small>max(F/u<sub>s</sub>, F/d<sub>min</sub>, NF/(u<sub>s</sub> + sum u<sub>i</sub>))</small></article></div>
    </div>
    <label className="bottleneck-check">Which term currently limits P2P distribution?<select value={bottleneck} disabled={!result.valid} onChange={event => setBottleneck(event.target.value)}><option value="">Choose the largest bound</option>{Object.entries(bottleneckLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    {!result.valid && <p role="status" className="feedback incorrect">Use a positive file size, a positive whole number of peers, positive server and download rates, and a non-negative peer upload rate.</p>}
    {result.valid && bottleneck && <p role="status" className={`feedback ${ready ? 'correct' : 'incorrect'}`}>{ready ? `${limitingP2pTerms.map(term => bottleneckLabels[term]).join(' and ')} ${limitingP2pTerms.length > 1 ? 'are tied as the largest constraints' : 'is the largest time constraint'} for these inputs.` : 'Compare the three P2P terms. The largest time is the active lower bound.'}</p>}
    <p className="lab-note">The default values reproduce the deck exercise after its stated conversion of 20 Gbits to 20,480 Mbits. These are ideal lower bounds, not measured transfer times.</p>
    <CompletionButton ready={ready} complete={complete}/>
  </section>
}

const bittorrentItems = [
  ['Tracker', 'Helps a new participant discover peers'],
  ['Rarest first', 'Replicates a scarce needed piece'],
  ['Preferred peers', 'Rewards neighbors currently providing useful upload rates'],
  ['Optimistic unchoke', 'Tries a new exchange partner periodically'],
  ['Choke', 'Pauses regular uploads to a particular peer'],
] as const

const bittorrentChoices = bittorrentItems.map(([, answer]) => answer)

function BitTorrentStrategy({ complete }: { complete: () => void }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const attempted = Object.keys(answers).length === bittorrentItems.length
  const correct = bittorrentItems.every(([, answer], index) => answers[index] === answer)

  return <section className="lab-panel" aria-labelledby="bittorrent-strategy-title">
    <div className="lab-heading"><span className="lab-number">LAB 09</span><div><h2 id="bittorrent-strategy-title">Operate a BitTorrent swarm</h2><p>Match each coordination, availability, or incentive mechanism to the job it performs.</p></div></div>
    <div className="architecture-matcher">{bittorrentItems.map(([item, answer], index) => <label key={item}><span>{item}</span><select value={answers[index] ?? ''} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))}><option value="">Choose its purpose</option>{bittorrentChoices.map(choice => <option key={choice}>{choice}</option>)}</select>{answers[index] && <i className={answers[index] === answer ? 'correct' : 'incorrect'}>{answers[index] === answer ? 'Matched' : 'Try again'}</i>}</label>)}</div>
    {attempted && <p role="status" className={`feedback ${correct ? 'correct' : 'incorrect'}`}>{correct ? 'Swarm strategy matched. Discovery finds neighbors, rarest first protects availability, and upload choices encourage useful exchange.' : 'Separate discovery, piece availability, and upload incentives, then try the unmatched rows again.'}</p>}
    <CompletionButton ready={correct} complete={complete}/>
  </section>
}

export function Csc138Chapter2Practice({ completeActivity }: Props) {
  return <div className="labs-stack">
    <TransportMatcher complete={() => completeActivity('ch2-transport-match')}/>
    <HttpExchange complete={() => completeActivity('ch2-http-exchange')}/>
    <CacheCalculator complete={() => completeActivity('ch2-cache-calculator')}/>
    <SmtpConversation complete={() => completeActivity('ch2-smtp-flow')}/>
    <FtpConnectionSorter complete={() => completeActivity('ch2-ftp-connections')}/>
    <DnsResolution complete={() => completeActivity('ch2-dns-resolution')}/>
    <DnsRecordsAndSecurity complete={() => completeActivity('ch2-dns-records-security')}/>
    <P2pDistributionCalculator complete={() => completeActivity('ch2-p2p-distribution')}/>
    <BitTorrentStrategy complete={() => completeActivity('ch2-bittorrent-strategy')}/>
  </div>
}
