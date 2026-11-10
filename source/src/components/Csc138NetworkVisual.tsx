import { RoutingGraphVisual } from './Csc138Chapter5Practice'

const concepts: Record<string, { title: string; steps: string[]; caption: string }> = {
  'ch4-subnet-allocation': { title: 'Pack aligned blocks first', steps: ['B: .0–.63 /26', 'A: .64–.95 /27', 'Free: .96–.255'], caption: 'Within 126.91.140.0/24: largest required block first. Free space is contiguous but not a single CIDR block.' },
  'ch4-nat': { title: 'Translate and reverse', steps: ['LAN: 10.0.0.1:3345', 'NAT mapping ↔', 'WAN: 138.76.29.7:5001'], caption: 'Outgoing source translation; incoming destination translation. The remote server endpoint does not change.' },
  'ch4-ipv6': { title: 'IPv6 packet layout', steps: ['40-byte base header', 'Optional extension headers', 'Transport + data'], caption: 'Payload Length counts everything after the base header. Next Header tells the receiver how to interpret what comes next.' },
  'ch4-tunneling': { title: 'Two layers of endpoints', steps: ['Outer IPv4: B → E', 'Inner IPv6: A → F', 'Upper-layer payload'], caption: 'B encapsulates, the IPv4 network forwards toward E, and E removes the outer header. The inner endpoints remain A and F.' },
  'ch4-generalized-forwarding': { title: 'Flow-table pipeline', steps: ['Match fields + ingress', 'Resolve by priority', 'Action + counters'], caption: 'Generalized forwarding can match several protocol layers, then forward, drop, modify, or send a packet to a controller.' },
  'ch4-middleboxes': { title: 'Assistance along the path', steps: ['Sender verifies', 'Network forwards / filters / translates', 'Receiver verifies'], caption: 'Middleboxes add useful on-path behavior, but complete application correctness may still require endpoint knowledge.' },
  'ch5-control-plane': { title: 'Control supplies the data plane', steps: ['Exchange control information', 'Compute and install table', 'Forward packets locally'], caption: 'Per-router algorithms or SDN control determine information that local forwarding uses.' },
  'ch5-bellman-ford': { title: 'Compare complete candidates to z', steps: ['Via v: 2 + 5 = 7', 'Via x: 1 + 3 = 4 ✓', 'Via w: 5 + 3 = 8'], caption: 'Choose the smallest local-link cost plus neighbor advertisement, not the smallest advertisement alone.' },
  'ch5-dv-changes': { title: 'A stale estimate feeds back', steps: ['y hears z: 5', 'y advertises 6 via z', 'z advertises 7 via y', 'y advertises 8 via z'], caption: 'After x–y rises to 60, stale advertisements form a circular dependency. Plain DV eventually reaches the better available costs, but bad news travels slowly.' },
  'ch5-ls-vs-dv': { title: 'Two ways to learn paths', steps: ['LS: distribute local link state widely', 'DV: share destination costs with neighbors', 'Both: compute local next hops'], caption: 'The algorithms differ in knowledge and exchanges, not in the basic goal of supplying forwarding information.' },
}

export function Csc138NetworkVisual({ lessonId }: { lessonId: string }) {
  const concept = concepts[lessonId]
  if (concept) return <figure className="lesson-visual"><div className="network-concept-flow">{concept.steps.map((step, index) => <span key={step}>{index + 1}. {step}</span>)}</div><figcaption><strong>{concept.title}</strong>{concept.caption}</figcaption></figure>
  if (lessonId.startsWith('ch5-')) return <div className="lesson-visual"><RoutingGraphVisual/></div>
  return null
}

export function hasNetworkVisual(lessonId: string) { return lessonId in concepts || lessonId.startsWith('ch5-') }
