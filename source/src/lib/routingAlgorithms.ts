export type Edge = readonly [string, string, number]
export type RoutingGraph = { nodes: readonly string[]; edges: readonly Edge[] }
export type DijkstraStep = { settled: string[]; distances: Record<string, number>; predecessors: Record<string, string | null> }
export type DistanceVectors = Record<string, Record<string, number>>

// The six-router graph used in the lecture and textbook Figure 5.3.
export const lectureGraph: RoutingGraph = {
  nodes: ['u', 'v', 'w', 'x', 'y', 'z'],
  edges: [['u', 'v', 2], ['u', 'w', 5], ['u', 'x', 1], ['v', 'w', 3], ['v', 'x', 2], ['w', 'x', 3], ['w', 'y', 1], ['w', 'z', 5], ['x', 'y', 1], ['y', 'z', 2]],
}

export function neighbors(graph: RoutingGraph, node: string): Array<[string, number]> {
  return graph.edges.flatMap(([a, b, cost]) => a === node ? [[b, cost] as [string, number]] : b === node ? [[a, cost] as [string, number]] : [])
}

export function dijkstraTrace(graph: RoutingGraph, source: string): DijkstraStep[] {
  const distances = Object.fromEntries(graph.nodes.map(node => [node, node === source ? 0 : Infinity]))
  const predecessors: Record<string, string | null> = Object.fromEntries(graph.nodes.map(node => [node, null]))
  const settled = [source]
  for (const [node, cost] of neighbors(graph, source)) { distances[node] = cost; predecessors[node] = source }
  const snapshot = (): DijkstraStep => ({ settled: [...settled], distances: { ...distances }, predecessors: { ...predecessors } })
  const steps = [snapshot()]
  while (settled.length < graph.nodes.length) {
    const next = graph.nodes.filter(node => !settled.includes(node)).sort((a, b) => distances[a] - distances[b] || a.localeCompare(b))[0]
    if (!next || !Number.isFinite(distances[next])) break
    settled.push(next)
    for (const [node, cost] of neighbors(graph, next)) {
      if (!settled.includes(node) && distances[next] + cost < distances[node]) {
        distances[node] = distances[next] + cost
        predecessors[node] = next
      }
    }
    steps.push(snapshot())
  }
  return steps
}

export function initialVectors(graph: RoutingGraph): DistanceVectors {
  return Object.fromEntries(graph.nodes.map(node => {
    const vector = Object.fromEntries(graph.nodes.map(destination => [destination, destination === node ? 0 : Infinity]))
    for (const [neighbor, cost] of neighbors(graph, node)) vector[neighbor] = cost
    return [node, vector]
  }))
}

// Each router reads the same immutable previous-round snapshot.
export function distanceVectorRound(graph: RoutingGraph, previous: DistanceVectors): DistanceVectors {
  return Object.fromEntries(graph.nodes.map(node => [node, Object.fromEntries(graph.nodes.map(destination => [destination,
    destination === node ? 0 : Math.min(...neighbors(graph, node).map(([neighbor, cost]) => cost + previous[neighbor][destination])),
  ]))]))
}

export function nextHop(step: DijkstraStep, source: string, destination: string): string | null {
  if (source === destination || !Number.isFinite(step.distances[destination])) return null
  let node = destination
  const seen = new Set<string>()
  while (step.predecessors[node] !== source) {
    if (seen.has(node) || !step.predecessors[node]) return null
    seen.add(node)
    node = step.predecessors[node]!
  }
  return node
}

export function displayCost(cost: number) { return Number.isFinite(cost) ? String(cost) : '∞' }

export function answerMatches(value: string, accepted: readonly string[]) {
  const normalize = (text: string) => text.trim().toLowerCase().replace(/\s+/g, ' ')
  return accepted.some(answer => normalize(value) === normalize(answer))
}
