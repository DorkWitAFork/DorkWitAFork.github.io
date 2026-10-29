import { chapter4Lessons } from '../data/courseChapter4'

const captions: Record<string, string> = {
  'ch4-network-plane': 'Forwarding happens locally at every router; the control plane prepares the forwarding information.',
  'ch4-service-model': 'Internet best effort supplies no delivery, ordering, bandwidth, or timing guarantee.',
  'ch4-router-architecture': 'The routing processor supplies tables; a packet goes from input lookup through the switching fabric to the output queue.',
  'ch4-prefix-lookup': '200.23.24.170 matches both shown routes, so the longer /24 prefix selects interface 1.',
  'ch4-switching-fabrics': 'A shared bus admits one crossing at a time; a crossbar can use distinct input and output ports simultaneously.',
  'ch4-router-queues': 'A packet for a free output waits behind a blocked head packet in the same input queue.',
  'ch4-packet-scheduling': 'The current packet finishes; FCFS selects the earlier arrival, whereas strict priority selects the waiting high-priority packet.',
  'ch4-ipv4-header': 'IPv4 has a variable header length; this diagram shows the standard 20-byte header without options.',
  'ch4-ip-interfaces': 'The same router has a distinct IP address on each subnet-facing interface.',
  'ch4-subnets': 'Each router-free island, including a router-to-router link, is a separate subnet.',
  'ch4-cidr': 'A /23 fixes 23 high-order bits. The last bit of the third octet and all eight bits of the fourth can vary.',
  'ch4-dhcp': 'Discover, Offer, Request, ACK: a client finds a server, selects an offer, and receives a confirmed lease.',
  'ch4-aggregation': 'One /20 summarizes eight /23 blocks. A more-specific /23 can direct one block to another ISP.',
}

function Graphic({ id }: { id: string }) {
  switch (id) {
    case 'ch4-network-plane': return <div className="ch4-path"><div><small>CONTROL PLANE</small><strong>path selection → forwarding tables</strong></div><div><b>HOST</b><span>datagram →</span><b>ROUTER A</b><span>→</span><b>ROUTER B</b><span>→</span><b>HOST</b></div><small>DATA PLANE: each router looks up its own output interface</small></div>
    case 'ch4-service-model': return <div className="ch4-guarantees"><b>INTERNET · BEST EFFORT</b><div>{['Delivery', 'Order', 'Minimum bandwidth', 'Timing'].map(item => <span key={item}><strong>{item}</strong><small>no guarantee</small></span>)}</div><small>Applications and transport can adapt or recover at the endpoints.</small></div>
    case 'ch4-router-architecture': return <div className="ch4-router-path"><div>CONTROL PLANE <b>routing processor</b><small>updates forwarding information</small></div><section><span>INPUT<br/><small>receive · lookup</small></span><i>→</i><span>FABRIC<br/><small>move internally</small></span><i>→</i><span>OUTPUT<br/><small>queue · transmit</small></span></section></div>
    case 'ch4-prefix-lookup': return <div className="ch4-lookup"><b>Destination: 200.23.24.170</b><div><span>200.23.16.0/20 → interface 2</span><small>matches</small></div><div className="winner"><span>200.23.24.0/24 → interface 1</span><strong>longest match ✓</strong></div><small>The router uses the most fixed leading bits.</small></div>
    case 'ch4-switching-fabrics': return <div className="ch4-fabrics"><div><b>SHARED BUS</b><span>A → X</span><span>B waits → Y</span><small>one crossing at a time</small></div><div><b>CROSSBAR</b><span>A → X</span><span>B → Y</span><small>different outputs can run in parallel</small></div></div>
    case 'ch4-router-queues': return <div className="ch4-queues"><b>ONE INPUT QUEUE · front → back</b><div><span>front: to output X</span><i>→</i><strong>output X busy</strong></div><div><span>behind: to output Y</span><i>⏸</i><strong>output Y free</strong></div><small>The second packet waits because the front of its own queue is blocked: HOL blocking.</small></div>
    case 'ch4-packet-scheduling': return <div className="ch4-schedule"><b>One output link · packet 1 currently transmitting</b><div><span>Waiting: 2 (low) · 3 (high)</span><strong>FCFS: 1 → 2 → 3</strong><strong>Priority: 1 → 3 → 2</strong></div></div>
    case 'ch4-ipv4-header': return <div className="ch4-ip-header"><small>IPv4 · field groups (not drawn to bit scale)</small><div className="ch4-fields"><span>Version</span><span>Header length</span><span>Service</span><span>Total length</span><span className="wide">Identifier · flags · fragment offset</span><span>TTL</span><span>Protocol</span><span className="double">Header checksum</span><span className="full">Source IP address</span><span className="full">Destination IP address</span><span className="full ch4-payload">Payload · e.g., TCP or UDP segment</span></div><small>Without options: 20-byte header + variable payload</small></div>
    case 'ch4-ip-interfaces':
    case 'ch4-subnets': return <div className="ch4-islands"><div><b>223.1.1.0/24</b><span>host .1 · host .2</span><strong>router interface .4</strong></div><i>ROUTER</i><div><b>223.1.2.0/24</b><span>host .1 · host .2</span><strong>router interface .9</strong></div><div><b>223.1.3.0/24</b><span>host .1 · host .2</span><strong>router interface .27</strong></div></div>
    case 'ch4-cidr': return <div className="ch4-bits"><small>200.23.16.0/23</small><div><span>11001000</span><span>00010111</span><span>0001000<b>0</b></span><span>00000000</span></div><div className="ch4-bit-label"><b>23 network bits</b><b>9 host bits</b></div><small>200.23.16.0 → 200.23.17.255</small></div>
    case 'ch4-dhcp': return <div className="ch4-dhcp"><div><b>CLIENT : 68</b><b>SERVER : 67</b></div><span>Discover →</span><span>← Offer (223.1.2.4)</span><span>Request →</span><span>← ACK (lease confirmed)</span></div>
    case 'ch4-aggregation': return <div className="ch4-aggregation"><b>ISP advertisement: 200.23.16.0/20</b><div>{[16, 18, 20, 22, 24, 26, 28, 30].map(third => <span key={third}>200.23.{third}.0/23</span>)}</div><small>Exception: 200.23.18.0/23 can be advertised by a different ISP and wins for matching destinations.</small></div>
    default: return null
  }
}

export function Csc138Chapter4Visual({ lessonId }: { lessonId: string }) {
  const lesson = chapter4Lessons.find(item => item.id === lessonId)
  if (!lesson) return null
  return <figure className="lesson-visual ch4-lesson-visual"><div role="img" aria-label={captions[lessonId]} className="ch4-graphic"><Graphic id={lessonId}/></div><figcaption><strong>{lesson.title}</strong>{captions[lessonId]}</figcaption></figure>
}
