import { describe, expect, it } from 'vitest'
import { answerMatches, dijkstraTrace, distanceVectorRound, initialVectors, lectureGraph, nextHop } from './routingAlgorithms'

describe('routing practice algorithms', () => {
  it('computes lecture shortest distances and keeps next hops distinct from predecessors', () => {
    const trace = dijkstraTrace(lectureGraph, 'u')
    const final = trace[trace.length - 1]
    expect(trace[1].distances).toEqual({ u: 0, v: 2, w: 4, x: 1, y: 2, z: Infinity })
    expect(final.distances).toEqual({ u: 0, v: 2, w: 3, x: 1, y: 2, z: 4 })
    expect(final.settled).toEqual(['u', 'x', 'v', 'y', 'w', 'z'])
    expect(final.predecessors.z).toBe('y')
    expect(nextHop(final, 'u', 'z')).toBe('x')
    expect(nextHop(final, 'u', 'v')).toBe('v')
    expect(nextHop(final, 'u', 'u')).toBeNull()
  })

  it('leaves disconnected nodes at infinity instead of inventing a predecessor', () => {
    const graph = { nodes: ['a', 'b', 'c'], edges: [['a', 'b', 2] as const] }
    const trace = dijkstraTrace(graph, 'a')
    const final = trace[trace.length - 1]
    expect(final.settled).toEqual(['a', 'b'])
    expect(final.distances.c).toBe(Infinity)
    expect(nextHop(final, 'a', 'c')).toBeNull()
  })

  it('uses only the previous DV round, without mutating old advertisements', () => {
    const graph = { nodes: ['a', 'b', 'c', 'd'], edges: [['a', 'b', 1] as const, ['b', 'c', 1] as const, ['c', 'd', 1] as const] }
    const initial = initialVectors(graph)
    const first = distanceVectorRound(graph, initial)
    expect(initial.a.c).toBe(Infinity)
    expect(first.a.c).toBe(2)
    expect(first.a.d).toBe(Infinity)
    expect(distanceVectorRound(graph, first).a.d).toBe(3)
  })

  it('converges to Dijkstra distances for every source on the lecture graph', () => {
    let vectors = initialVectors(lectureGraph)
    for (let i = 0; i < lectureGraph.nodes.length; i++) vectors = distanceVectorRound(lectureGraph, vectors)
    for (const source of lectureGraph.nodes) {
      const trace = dijkstraTrace(lectureGraph, source)
      expect(vectors[source]).toEqual(trace[trace.length - 1].distances)
    }
  })

  it('normalizes human spacing and case but rejects blank answers and wrong values', () => {
    expect(answerMatches('  Tcp  ', ['TCP', '6'])).toBe(true)
    expect(answerMatches(' U   x Y  w ', ['u x y w'])).toBe(true)
    expect(answerMatches('', ['0'])).toBe(false)
    expect(answerMatches('5', ['4'])).toBe(false)
  })
})
