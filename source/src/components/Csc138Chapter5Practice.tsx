import { useState } from 'react'
import { chapter5Worksheets, type NetworkWorksheet as Worksheet } from '../data/networkWorksheets'
import { dijkstraTrace, displayCost, distanceVectorRound, initialVectors, lectureGraph } from '../lib/routingAlgorithms'
import { NetworkWorksheet, NetworkWorkshopIndex, type NetworkPracticeProps } from './NetworkWorksheet'

const positions: Record<string, [number, number]> = { u: [55, 160], v: [200, 45], w: [395, 65], x: [200, 280], y: [395, 260], z: [545, 160] }

export function RoutingGraphVisual() {
  return <figure className="routing-graph"><svg viewBox="0 0 600 330" role="img" aria-labelledby="routing-graph-title routing-graph-description"><title id="routing-graph-title">Six-router weighted lecture graph</title><desc id="routing-graph-description">Undirected links: {lectureGraph.edges.map(([a, b, cost]) => `${a} to ${b} cost ${cost}`).join('; ')}.</desc>
    {lectureGraph.edges.map(([a, b, cost]) => {
      const [x1, y1] = positions[a]; const [x2, y2] = positions[b]
      const x = (x1 + x2) / 2; const y = (y1 + y2) / 2
      return <g key={`${a}-${b}`}><line x1={x1} y1={y1} x2={x2} y2={y2}/><rect x={x - 12} y={y - 13} width="24" height="26" rx="4"/><text x={x} y={y + 6}>{cost}</text></g>
    })}
    {lectureGraph.nodes.map(node => <g key={node}><circle cx={positions[node][0]} cy={positions[node][1]} r="22"/><text className="routing-node" x={positions[node][0]} y={positions[node][1] + 6}>{node}</text></g>)}
  </svg><figcaption>Undirected lecture graph. Every line label is a link cost, not a hop count. Source: u.</figcaption></figure>
}

function DijkstraLab({ completedActivities, completeActivity }: NetworkPracticeProps) {
  const trace = dijkstraTrace(lectureGraph, 'u')
  const [stepIndex, setStepIndex] = useState(0)
  const [solved, setSolved] = useState(false)
  const current = trace[stepIndex]
  const next = trace[stepIndex + 1]
  const worksheet: Worksheet | null = next ? {
    id: `ch5-dijkstra-step-${stepIndex}`, title: `Dijkstra trace: step ${stepIndex + 1} of ${trace.length - 1}`,
    prompt: 'Using the current table above, choose the next unsettled node, then enter the distance to each destination after relaxing through it. Break equal-distance ties alphabetically. Use “inf” or “∞” for an unreachable estimate.',
    fields: [
      { label: 'Next node to settle', answers: [next.settled[next.settled.length - 1]], hint: 'Find the smallest tentative distance among unsettled nodes; break ties alphabetically.', explanation: `${next.settled[next.settled.length - 1]} is the alphabetically first unsettled minimum.` },
      ...lectureGraph.nodes.filter(node => node !== 'u').map(node => ({ label: `Updated D(${node})`, answers: Number.isFinite(next.distances[node]) ? [String(next.distances[node])] : ['inf', 'infinity', '∞'], hint: current.settled.includes(node) ? 'A settled distance stays fixed.' : 'Compare the old estimate with the selected node’s distance plus its direct link, if any.', explanation: `After relaxation, D(${node}) = ${displayCost(next.distances[node])}${next.predecessors[node] ? `; p(${node}) = ${next.predecessors[node]}` : ''}.` })),
    ],
  } : null
  return <div id="ch5-dijkstra-trace" className="routing-workshop">
    <section className="lab-panel"><h2>Dijkstra: current state</h2><p>Settled N′ = {'{'}{current.settled.join(', ')}{'}'}. These values are the input for your next step.</p><div className="network-table-scroll"><table className="network-table"><caption>Source u; state after {stepIndex} iterations</caption><thead><tr><th scope="col">Node</th><th scope="col">Distance</th><th scope="col">Predecessor</th><th scope="col">Settled?</th></tr></thead><tbody>{lectureGraph.nodes.map(node => <tr key={node}><th scope="row">{node}</th><td>{displayCost(current.distances[node])}</td><td>{current.predecessors[node] ?? '—'}</td><td>{current.settled.includes(node) ? 'Yes' : 'No'}</td></tr>)}</tbody></table></div></section>
    {worksheet && <NetworkWorksheet key={stepIndex} worksheet={worksheet} onSolved={setSolved}/>}
    <div className="button-row">{next && <button className="button button-small" disabled={!solved} onClick={() => { setStepIndex(stepIndex + 1); setSolved(false) }}>Apply checked step</button>}<button className="button button-ghost button-small" onClick={() => { setStepIndex(0); setSolved(false) }}>Restart Dijkstra trace</button>{!next && <button className="button button-small" onClick={() => completeActivity('ch5-dijkstra-trace')}>{completedActivities.includes('ch5-dijkstra-trace') ? 'Activity complete' : 'Mark Dijkstra trace complete'}</button>}</div>
    {!next && <p role="status" className="feedback correct">All five steps checked. Final distances: v=2, w=3, x=1, y=2, z=4. Now derive the next hops in the forwarding-table worksheet.</p>}
  </div>
}

function DistanceVectorLab({ completedActivities, completeActivity }: NetworkPracticeProps) {
  const [round, setRound] = useState(0)
  const [vectors, setVectors] = useState(() => initialVectors(lectureGraph))
  const [solved, setSolved] = useState(false)
  const next = distanceVectorRound(lectureGraph, vectors)
  const worksheet: Worksheet = {
    id: `ch5-dv-round-${round}`, title: `Distance vector: predict u’s round ${round + 1}`,
    prompt: 'The matrix below contains only the previous-round advertisements. u’s neighbors are v (cost 2), w (cost 5), and x (cost 1). For each destination, minimize local link cost + that neighbor’s old advertised cost. Enter “inf” or “∞” for infinity.',
    fields: lectureGraph.nodes.filter(node => node !== 'u').map(node => ({
      label: `New D_u(${node})`, answers: Number.isFinite(next.u[node]) ? [String(next.u[node])] : ['inf', 'infinity', '∞'],
      hint: `Compare 2 + D_v(${node}), 5 + D_w(${node}), and 1 + D_x(${node}) using the old matrix.`,
      explanation: `min(2+${displayCost(vectors.v[node])}, 5+${displayCost(vectors.w[node])}, 1+${displayCost(vectors.x[node])}) = ${displayCost(next.u[node])}.`,
    })),
  }
  return <div id="ch5-dv-rounds" className="routing-workshop">
    <section className="lab-panel"><h2>Distance vectors: previous-round matrix</h2><p>Round {round}. Row = advertising router; column = destination. All routers update from this snapshot together after you check u’s new row.</p><div className="network-table-scroll"><table className="network-table"><caption>Advertisements at round {round}</caption><thead><tr><th scope="col">From / to</th>{lectureGraph.nodes.map(node => <th scope="col" key={node}>{node}</th>)}</tr></thead><tbody>{lectureGraph.nodes.map(node => <tr key={node}><th scope="row">{node}</th>{lectureGraph.nodes.map(destination => <td key={destination}>{displayCost(vectors[node][destination])}</td>)}</tr>)}</tbody></table></div></section>
    {round < 3 && <NetworkWorksheet key={round} worksheet={worksheet} onSolved={setSolved}/>}
    <div className="button-row">{round < 3 && <button className="button button-small" disabled={!solved} onClick={() => { setVectors(next); setRound(round + 1); setSolved(false) }}>Exchange checked round</button>}<button className="button button-ghost button-small" onClick={() => { setVectors(initialVectors(lectureGraph)); setRound(0); setSolved(false) }}>Restart vector exchange</button>{round === 3 && <button className="button button-small" onClick={() => completeActivity('ch5-dv-rounds')}>{completedActivities.includes('ch5-dv-rounds') ? 'Activity complete' : 'Mark vector exchange complete'}</button>}</div>
    {round === 3 && <p role="status" className="feedback correct">Three rounds checked. u’s vector is stable at 0,2,3,1,2,4. Other routers can still need further exchanges: a stable row at one router alone does not prove network-wide convergence. Compare u’s distances with Dijkstra’s final results.</p>}
  </div>
}

export function Csc138Chapter5Practice(props: NetworkPracticeProps) {
  const worksheet = (id: string) => {
    const item = chapter5Worksheets.find(item => item.id === id)!
    return <NetworkWorksheet key={id} worksheet={item} completed={props.completedActivities.includes(id)} onComplete={() => props.completeActivity(id)}/>
  }
  return <div className="labs-stack network-labs">
    <NetworkWorkshopIndex items={[...chapter5Worksheets, { id: 'ch5-dijkstra-trace', title: 'Dijkstra step-by-step trace' }, { id: 'ch5-dv-rounds', title: 'Distance-vector round exchange' }]}/>
    {worksheet('ch5-control-model')}
    {worksheet('ch5-graph-cost')}
    <section className="lab-panel"><h2>Shared topology for the routing workshops</h2><RoutingGraphVisual/><p className="lab-note">Dijkstra and distance vector use the same graph so you can compare their answers. The trace breaks ties alphabetically; the slides may use another valid tie order.</p></section>
    <DijkstraLab {...props}/>
    {worksheet('ch5-forwarding-table')}
    {worksheet('ch5-ls-complexity')}
    {worksheet('ch5-bellman-ford')}
    <DistanceVectorLab {...props}/>
    {worksheet('ch5-link-change')}
    {worksheet('ch5-compare')}
  </div>
}
