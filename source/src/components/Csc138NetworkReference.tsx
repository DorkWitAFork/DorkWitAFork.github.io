import { RoutingGraphVisual } from './Csc138Chapter5Practice'
import { MathText } from './MathText'
import './networkPractice.css'

export function Csc138Chapter5Reference() {
  return <>
    <section className="reference-grid"><article><span className="section-label-text">DIJKSTRA / LINK STATE</span><h2>Settle → relax → repeat</h2><p>N′: settled nodes. D(v): tentative source distance. p(v): predecessor.</p><p><strong>D(v) ← min(D(v), D(w) + c(w,v))</strong></p><p>Select a minimum unsettled w first. On improvement, set p(v)=w. Reconstruct backward, then choose the first neighbor after the source for the next hop.</p></article><article><span className="section-label-text">BELLMAN-FORD / DISTANCE VECTOR</span><h2>Local cost + advertised cost</h2><p><strong><MathText>{'D_x(y) ← min over neighbors v [c(x,v) + D_v(y)]'}</MathText></strong></p><p>The minimizing neighbor is the next hop. Synchronous exercises use a previous-round snapshot; real DV need not operate in lockstep.</p></article></section>
    <section className="lab-panel"><RoutingGraphVisual/><p>From u: v=2 (next v), w=3 (next x), x=1 (next x), y=2 (next x), z=4 (next x). The predecessor of z is y; its next hop from u is x.</p></section>
    <section className="protocol-reference"><article><span>ALGORITHM CHECKLIST</span><p>Initialize self=0; missing paths=∞. State tie-breaking and update schedule. Distinguish a predecessor from a next hop. Never forget the local link in a Bellman-Ford candidate.</p></article><article><span>CHANGES AND LIMITATIONS</span><p>DV cost increases can count upward through stale dependencies. Poisoned reverse advertises infinity back to the next hop and helps with two-router loops; it does not fix all loops. Load-sensitive costs can cause oscillation.</p></article></section>
  </>
}

export function Csc138Chapter4ExtendedReference() {
  return <section className="protocol-reference">
    <article><span>SUBNET ALLOCATION</span><p><MathText>{'Ordinary usable interfaces = 2^(32−prefix) − 2. Pick capacity, then align the block. A /26 inside a /24 starts at .0, .64, .128, or .192. The review’s .32/26 is not a valid network boundary.'}</MathText></p></article>
    <article><span>NAT DIRECTION</span><p>Outgoing: rewrite source private IP:port → public IP:port. Incoming reply: rewrite destination public pair → private pair. The remote endpoint stays unchanged.</p></article>
    <article><span>IPV6 AND TUNNEL SIZES</span><p>IPv6 base header = 40 bytes, addresses = 128 bits. Payload Length excludes that base header. With a 20-byte outer IPv4 header, a 1,500-byte tunnel MTU leaves 1,480 inner IPv6 bytes or 1,440 upper-layer bytes.</p></article>
    <article><span>MATCH + ACTION</span><p>Match header fields and ingress interface; apply the highest stated priority. Actions: forward, drop, modify, send to controller. Counters measure packets/bytes. Default drop is an explicit exercise assumption.</p></article>
    <article><span>ARCHITECTURE</span><p>IP is the narrow waist. NAT, firewalls, caches, and load balancers add on-path functions. In-network help can improve performance without replacing endpoint checks for complete correctness.</p></article>
  </section>
}
