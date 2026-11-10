import type { Lesson, QuizQuestion } from '../types'

const ls = 'Chapter5 - Link State Algorithm.pdf'
const dv = 'Chapter5 - Distance Vector Algorithm.pdf'
const book = 'Textbook Chapter 5 §§5.1–5.2'

export const chapter5Lessons: Lesson[] = [
  {
    id: 'ch5-control-plane', number: '01', title: 'From Forwarding to Routing', eyebrow: 'Who builds the table?', minutes: 20,
    summary: 'Connect Chapter 4’s local packet decisions to the control plane that computes their forwarding information.',
    objectives: ['Distinguish forwarding from routing', 'Compare per-router control and a logically centralized controller', 'Separate the covered routing algorithms from later protocols'],
    sections: [
      { title: 'Use a table versus create a table', body: 'Forwarding moves one arriving packet from an input to an output using installed information. Routing determines useful paths across a network and produces that information. The control plane may operate on a slower timescale than per-packet forwarding, but its decisions shape the paths followed by the data plane.' },
      { title: 'Two control-plane structures', body: 'In per-router control, components running in each router exchange control messages and compute routing information. In SDN, a logically centralized controller computes and installs forwarding rules through control agents. The controller can be physically replicated. In either structure, packets normally use installed rules locally rather than requesting a new full path for every arrival.' },
      { title: 'Current scope', body: 'These two decks develop graph models, link-state Dijkstra computations, and distance-vector Bellman-Ford updates. OSPF, BGP, the detailed SDN control plane, ICMP, and network management appear on roadmap slides but are not yet developed here. Use the textbook to clarify the covered algorithms rather than treating the roadmap as a completed protocol lesson.' },
    ], keyTerms: ['routing', 'forwarding', 'control plane', 'per-router control', 'logically centralized'], source: `${ls} slides 2–8; ${book} pp. 408–410`,
  },
  {
    id: 'ch5-graph', number: '02', title: 'Model a Network as a Weighted Graph', eyebrow: 'Least cost is not always fewest hops', minutes: 25,
    summary: 'Turn routers and links into a graph, add path costs, and classify the information used by a routing algorithm.',
    objectives: ['Read nodes, edges, neighbors, and costs', 'Compare candidate paths by total cost', 'Distinguish global/decentralized and static/dynamic classifications'],
    sections: [
      { title: 'Nodes and edges', body: 'Write G = (N, E), where N is the set of routers and E the links. A direct link from a to b has cost c(a,b); a missing link has cost ∞. In our undirected examples c(a,b) = c(b,a). Infinity means there is no currently known finite route in that context, not a very large real link cost.' },
      { title: 'Add costs along a path', body: 'The cost of u → x → y → w is c(u,x) + c(x,y) + c(y,w). In the lecture graph these costs are 1 + 1 + 1 = 3, better than direct u → w at cost 5. Fewest-hop and least-cost paths coincide only when link costs are equal. Costs can model an operator’s policy, bandwidth, or other metrics; the exercises supply them explicitly.' },
      { title: 'Different axes of classification', body: 'Link-state routing uses a complete topology and cost map. Distance-vector routing begins with local link costs and exchanges estimates with neighbors. Separately, static routes change slowly, often manually; dynamic routes respond periodically or to changes. A global-information algorithm can still run separately on each router: “global” describes knowledge, not a mandatory single physical controller.' },
    ], keyTerms: ['graph', 'node', 'edge', 'neighbor', 'link cost', 'least-cost path', 'static routing', 'dynamic routing'], source: `${ls} slides 9–10; ${book} pp. 411–413`,
  },
  {
    id: 'ch5-dijkstra', number: '03', title: 'Run Dijkstra One Step at a Time', eyebrow: 'Settle, then relax', minutes: 35,
    summary: 'Initialize tentative distances, select a minimum unsettled node, and relax its outgoing links.',
    objectives: ['Interpret N′, D(v), and p(v)', 'Perform one Dijkstra iteration', 'Handle ties and unreachable nodes correctly'],
    sections: [
      { title: 'Build a common map first', body: 'Each router advertises its own directly connected links and costs through link-state dissemination. Once routers have a consistent topology map, each can compute a shortest-path tree rooted at itself. They need not choose identical trees because each has a different source.' },
      { title: 'Initialize the source', body: 'N′ contains nodes whose minimum source distance is settled. Start with N′ = {u}, D(u) = 0, direct-neighbor tentative costs equal to c(u,v), and all other distances ∞. Set p(v) to u for direct neighbors. A tentative cost is a current estimate, not yet proof of the final answer.' },
      { title: 'Select and relax', body: 'Choose an unsettled node w with the smallest finite D(w) and add it to N′. For every unsettled neighbor v, compare D(v) with D(w) + c(w,v). If the latter is smaller, replace D(v) and set p(v) = w. Repeat until all reachable nodes are settled. Nonnegative link costs make it safe to settle the current minimum.', points: ['Do not add a node simply because its direct edge looks cheapest; compare complete tentative source distances.', 'Tied minima may be selected in either order. The lab uses alphabetical order so that its trace is reproducible.', 'If all remaining estimates are ∞, no remaining node is reachable.'] },
    ], keyTerms: ['Dijkstra', 'link-state broadcast', 'tentative distance', 'settled set N′', 'predecessor', 'relaxation'], source: `${ls} slides 12–14; ${book} pp. 413–415`,
  },
  {
    id: 'ch5-shortest-tree', number: '04', title: 'Turn a Shortest-Path Tree into Next Hops', eyebrow: 'Predecessor is not next hop', minutes: 30,
    summary: 'Work the lecture graph, reconstruct paths backward, and extract a router’s first outgoing link.',
    objectives: ['Complete a Dijkstra table for the lecture graph', 'Reconstruct a path using predecessor pointers', 'Build forwarding entries from a shortest-path tree'],
    sections: [
      { title: 'Follow the first updates', body: 'From u, direct tentative costs are v=2, x=1, w=5, y=∞, z=∞. Settle x first. Via x, w improves to 4 and y to 2, while v remains 2. The lecture settles y before the tied v; the lab chooses v alphabetically first. Either valid ordering yields final costs v=2, x=1, y=2, w=3, z=4.' },
      { title: 'Trace backward, forward once', body: 'For destination z, the predecessors are p(z)=y, p(y)=x, and p(x)=u. Reverse that chain to obtain u → x → y → z, cost 1+1+2=4. At u, the next hop to z is x, not y. A predecessor is the node immediately before a destination on the path; a next hop is the node immediately after the source.' },
      { title: 'Install the local table', body: 'The lecture graph gives u a direct outgoing link toward v for destination v. Destinations x, y, w, and z all use the outgoing link toward x. The routing computation establishes the tree; subsequent packets use this local forwarding information. The practice lab includes both a round-by-round trace and a final cost/next-hop table.' },
    ], keyTerms: ['shortest-path tree', 'next hop', 'predecessor chain', 'forwarding entry', 'tie breaking'], source: `${ls} slides 14–16, 18–19; ${book} pp. 415–416`,
  },
  {
    id: 'ch5-ls-cost', number: '05', title: 'Link-State Cost and Route Oscillation', eyebrow: 'Computation and communication are different', minutes: 20,
    summary: 'Separate local algorithm complexity from topology dissemination and understand load-sensitive route changes.',
    objectives: ['Explain the simple implementation’s quadratic work', 'State assumptions behind message counts', 'Explain how traffic-dependent costs can oscillate'],
    sections: [
      { title: 'Count local computation', body: 'The simple table-based implementation scans the remaining nodes for a minimum in each iteration. Across n nodes this takes quadratic O(n²) work. Heap-based implementations can reduce that work; their precise bound depends on the graph and data structures. This is separate from sending control messages through the network.' },
      { title: 'Count dissemination with assumptions', body: 'Every router must disseminate its link-state information. The lecture’s simplified efficient-broadcast model uses O(n) link crossings per originating router, or O(n²) overall. General flooding counts also depend on the number of links E; the textbook describes O(|N||E|) message work. State which dissemination model you are using rather than assuming one universal message bound.' },
      { title: 'Why shortest paths can keep changing', body: 'If a link’s cost increases with its current traffic load, many routers can move traffic onto a currently idle path. That path then becomes expensive and traffic moves back. Recomputing shortest paths does not prevent these feedback-driven oscillations. Stable metrics and careful timing/advertisement policies matter; the two-deck comparison notes that link-state routing can oscillate.' },
    ], keyTerms: ['computational complexity', 'message complexity', 'flooding', 'load-sensitive cost', 'route oscillation'], source: `${ls} slide 17; ${dv} slide 24; ${book} pp. 416–417, 424–425`,
  },
  {
    id: 'ch5-bellman-ford', number: '06', title: 'Compute a Bellman-Ford Update', eyebrow: 'Local link plus neighbor’s estimate', minutes: 30,
    summary: 'Compare the cost of reaching a destination through each neighbor and identify the best next hop.',
    objectives: ['Apply the Bellman-Ford equation', 'Distinguish direct-link cost from advertised distance', 'Build a local distance table and choose a next hop'],
    sections: [
      { title: 'One candidate per neighbor', body: 'At node x, the distance estimate to destination y is D_x(y) = min over neighbors v of [c(x,v) + D_v(y)]. First pay for the link to v, then add v’s advertised estimate to y. The neighbor achieving the minimum is the next hop. Comparing only the advertised values forgets the cost of reaching the neighbor.' },
      { title: 'Work the lecture example', body: 'At u, links to v, x, and w cost 2, 1, and 5. Their advertised distances to z are 5, 3, and 3. The three candidates are 2+5=7, 1+3=4, and 5+3=8. Thus D_u(z)=4 through x. The smallest advertisement alone would not distinguish x and w; including local link costs does.' },
      { title: 'What the router stores', body: 'A distance-vector router knows its directly attached link costs, its own vector of estimates, and the latest vector from each neighbor. It does not require a complete topology map. Its distance to itself is zero. Initially it knows direct costs to neighbors and ∞ for other destinations; repeated neighbor updates supply more information.' },
    ], keyTerms: ['Bellman-Ford', 'distance vector', 'advertised distance', 'local link cost', 'next hop', 'distance table'], source: `${dv} slides 3–6; ${book} pp. 418–420`,
  },
  {
    id: 'ch5-dv-rounds', number: '07', title: 'Exchange Vectors and Converge', eyebrow: 'Information travels neighbor by neighbor', minutes: 35,
    summary: 'Compute new estimates using only the information available at the start of a round.',
    objectives: ['Perform synchronous teaching rounds', 'Explain asynchronous event-driven operation', 'Predict how far information can propagate'],
    sections: [
      { title: 'A round is a teaching model', body: 'The deck draws simultaneous send/receive/compute rounds to make the algorithm traceable. When calculating round t+1, use neighbors’ vectors from round t throughout. Do not use a just-computed value from the same round: that would silently change the update schedule. Actual DV operation can be asynchronous, triggered by a link-cost change or a neighbor’s message.' },
      { title: 'Read the nine-node example carefully', body: 'Initially, b has neighbors a at cost 8, c at cost 1, and e at cost 1. Using their initial vectors, b learns d at min(8+1, ∞, 1+1)=2 via e; f=2 and h=2 also via e. It still has ∞ for g and i in that first round. At c, whose only neighbor is b, the first update learns a=9 and e=2; d remains ∞ because b initially had no route to d.', points: ['The final vector printed on DV slide 18 appears to swap d and e. Its equations correctly give e=2 and d=∞; follow the equations and topology.', 'A finite estimate in a later round does not mean the node knew that path at initialization.'] },
      { title: 'Propagation and quiet operation', body: 'In the synchronous model each exchange carries information one additional link. Initial direct-link knowledge allows routes of at most two links after one update and at most three after two. In a fixed connected network with nonnegative costs and reliable continued exchanges, estimates converge to least costs. When a vector does not change, a triggered-update node need not notify neighbors; quiescence is not a command to shut the protocol down.' },
    ], keyTerms: ['iteration', 'asynchronous', 'synchronous round', 'convergence', 'triggered update', 'quiescent state'], source: `${dv} slides 5–20 (slide 18 transcription correction explained); ${book} pp. 419–422`,
  },
  {
    id: 'ch5-dv-changes', number: '08', title: 'Link Changes and Count-to-Infinity', eyebrow: 'A neighbor may be relying on you', minutes: 30,
    summary: 'Trace fast cost decreases and slow cost increases, including a two-router loop and poisoned reverse.',
    objectives: ['Recompute after a link cost changes', 'Explain a loop caused by stale advertisements', 'Describe what poisoned reverse can and cannot fix'],
    sections: [
      { title: 'Good news travels quickly', body: 'In the three-node example, x–y initially costs 4, y–z costs 1, and x–z costs 50. Initially y reaches x for 4 and z for 5 via y. When x–y drops to 1, y advertises 1, then z computes min(50,1+1)=2. The cheaper estimate propagates quickly.' },
      { title: 'Bad news can form a loop', body: 'Reset to the original costs, then raise x–y from 4 to 60. If y still remembers z’s old advertisement of 5, y computes min(60,1+5)=6 via z. But z’s supposed route goes through y. After hearing 6, z advertises 7 via y; y then advertises 8, and z 9. The values count upward while packets may loop between y and z. Eventually z uses its direct cost-50 route and y converges to 51 via z.' },
      { title: 'Poison the reverse advertisement', body: 'Textbook extension: if z’s route to x uses y, z tells y its distance to x is ∞ while still advertising its real distance to other neighbors. This prevents y from trusting a route that immediately depends on itself. Poisoned reverse addresses this two-router dependency but does not eliminate every loop involving three or more routers. TTL/Hop Limit limits a packet’s lifetime; it does not repair the routing algorithm.' },
    ], keyTerms: ['link-cost change', 'routing loop', 'stale advertisement', 'count-to-infinity', 'poisoned reverse'], source: `${dv} slides 22–23; ${book} pp. 422–424 (poisoned reverse is textbook support)`,
  },
  {
    id: 'ch5-ls-vs-dv', number: '09', title: 'Compare Link State and Distance Vector', eyebrow: 'Same goal, different knowledge', minutes: 20,
    summary: 'Compare what routers exchange, how they compute, and how incorrect information propagates.',
    objectives: ['Classify LS and DV behavior', 'Compare convergence and failure modes', 'Explain why neither algorithm guarantees instantaneous correct routing'],
    sections: [
      { title: 'What is shared, and with whom?', body: 'LS advertises local link state throughout the routing domain, then each router computes its own paths using a global map. DV sends destination-cost estimates only to direct neighbors, then updates estimates using Bellman-Ford. Neither description means data packets follow only one hop end to end; this comparison concerns control messages and computation.' },
      { title: 'Different convergence concerns', body: 'LS computation has a predictable algorithmic cost for a supplied graph, but distributing changed state still takes time. Load-sensitive metrics can cause oscillation. DV convergence depends on topology, timing, and the change; increases can cause loops and count-to-infinity. Do not confuse the number of Dijkstra iterations with the time required for a whole network to receive updates.' },
      { title: 'Bad information and robustness', body: 'An LS router can advertise a false attached-link cost; other routers may compute bad routes from that claim, though each computes its own table. A DV router can advertise implausibly low costs to many destinations; neighboring routers may select and propagate those estimates, attracting traffic into a black hole. Neither approach is immune to faulty or malicious advertisements.' },
    ], keyTerms: ['link state', 'distance vector', 'robustness', 'black hole', 'convergence time'], source: `${dv} slide 24; ${book} pp. 424–425`,
  },
]

export const chapter5Glossary: Array<[string, string]> = [
  ['Link state (LS)', 'Routing with a complete topology/cost map, commonly using Dijkstra at each source.'],
  ['Distance vector (DV)', 'Neighbor-to-neighbor exchange of destination-cost estimates, updated using Bellman-Ford.'],
  ['D(v)', 'A current tentative distance from the source to v in Dijkstra.'],
  ['N′', 'The set of nodes whose shortest distances have been settled.'],
  ['Predecessor p(v)', 'The node immediately before v along the current source-to-v path.'],
  ['Next hop', 'The directly attached neighbor used as the first step toward a destination.'],
  ['Relaxation', 'Compare an existing estimate with a candidate path through a newly settled node.'],
  ['Bellman-Ford equation', 'Estimate a destination cost by minimizing local-link cost plus neighbor-advertised distance.'],
  ['Asynchronous', 'Nodes act on local events without a required network-wide clock or lockstep rounds.'],
  ['Convergence', 'Estimates reach stable least costs under the fixed-network and exchange assumptions.'],
  ['Count-to-infinity', 'Slowly increasing DV estimates caused by routers relying on stale, mutually dependent routes.'],
  ['Poisoned reverse', 'Advertise infinity for a destination back to the neighbor used as its next hop.'],
  ['Route oscillation', 'Repeated route changes, for example due to synchronized load-sensitive cost feedback.'],
  ['Black hole', 'A route that attracts traffic but fails to deliver it onward toward its destination.'],
]

export const chapter5QuizQuestions: QuizQuestion[] = [
  { id: 'ch5-q1', prompt: 'Which task belongs to routing rather than forwarding?', choices: ['Moving one packet to an output using the table', 'Computing paths used to populate forwarding information', 'Reading the next packet’s destination', 'Serializing bits on an output link'], answer: 1, explanation: 'Routing supplies paths and table information; forwarding uses that information locally for arriving packets.' },
  { id: 'ch5-q2', prompt: 'A link-state algorithm is called global-information because…', choices: ['It must run on one physical server', 'It uses the entire relevant topology and link-cost map', 'It sends every data packet worldwide', 'It ignores local links'], answer: 1, explanation: 'Global describes its input knowledge. Each router can run it independently using the same topology.' },
  { id: 'ch5-q3', prompt: 'Which statement about least-cost and fewest-hop paths is correct?', choices: ['They always coincide', 'They coincide when every link has the same positive cost', 'Fewest hops always has greater cost', 'Cost ignores traversed links'], answer: 1, explanation: 'With equal positive edge costs, minimizing the sum also minimizes the number of edges; otherwise a longer path may be cheaper.' },
  { id: 'ch5-q4', prompt: 'In Dijkstra, which node is selected next?', choices: ['An unsettled node with minimum tentative source distance', 'Any node with the cheapest last edge', 'The destination farthest from the source', 'The node with the largest address'], answer: 0, explanation: 'The algorithm settles a current minimum among unsettled nodes, then relaxes its links.' },
  { id: 'ch5-q5', prompt: 'D(w)=3, c(w,z)=2, and old D(z)=8. After relaxing through w, what are D(z) and p(z)?', choices: ['8 and w', '2 and z', '5 and w', '3 and source'], answer: 2, explanation: 'min(8,3+2)=5, so the predecessor becomes w.' },
  { id: 'ch5-q6', prompt: 'A path is u→x→y→z. At u, what are the next hop to z and predecessor of z?', choices: ['y and x', 'x and y', 'z and u', 'x and x'], answer: 1, explanation: 'The next hop follows the source; the predecessor immediately precedes the destination.' },
  { id: 'ch5-q7', prompt: 'Two unsettled nodes tie for the smallest D value. What may Dijkstra do?', choices: ['Stop because the graph is invalid', 'Select either tied minimum', 'Add their costs together', 'Set both costs to infinity'], answer: 1, explanation: 'Either order is valid for nonnegative costs. A fixed tie-break rule makes a teaching trace reproducible.' },
  { id: 'ch5-q8', prompt: 'What is the local work of the simple scan-based Dijkstra implementation?', choices: ['O(1)', 'O(log n)', 'O(n²)', 'Exactly n messages'], answer: 2, explanation: 'Repeated scans of remaining nodes produce quadratic work; message dissemination is a separate cost.' },
  { id: 'ch5-q9', prompt: 'At u, neighbors v,x,w have link costs 2,1,5 and advertisements to z of 5,3,3. Which route wins?', choices: ['v with cost 5', 'x with cost 4', 'w with cost 3', 'v with cost 7'], answer: 1, explanation: 'Compare 2+5=7, 1+3=4, and 5+3=8; choose x at total cost 4.' },
  { id: 'ch5-q10', prompt: 'What must a DV router know to update its estimates?', choices: ['Every router’s complete adjacency list', 'Local link costs and neighbors’ advertised vectors', 'Only the destination’s MAC address', 'The shortest-path tree from every source'], answer: 1, explanation: 'DV uses local costs and neighbor estimates without requiring a complete topology map.' },
  { id: 'ch5-q11', prompt: 'In a synchronous DV worksheet, round t+1 should use…', choices: ['Only the neighbors’ round-t vectors', 'Whichever same-round values were computed first', 'The final shortest distances immediately', 'Only the source’s own IP address'], answer: 0, explanation: 'Using a consistent previous-round snapshot avoids accidentally turning synchronous rounds into another update schedule.' },
  { id: 'ch5-q12', prompt: 'A triggered DV recomputation changes no estimate. What happens in the deck model?', choices: ['The router must broadcast to every router', 'No changed-vector notification is required', 'It deletes its table', 'It sets all routes to infinity'], answer: 1, explanation: 'Triggered notifications are needed when the local vector changes; stable nodes remain waiting for further events.' },
  { id: 'ch5-q13', prompt: 'With initial direct-neighbor knowledge, one synchronous DV update can learn paths of up to how many links?', choices: ['One', 'Two', 'Three', 'All paths regardless of length'], answer: 1, explanation: 'The first neighbor-vector exchange extends direct one-link knowledge by one link.' },
  { id: 'ch5-q14', prompt: 'After x–y rises to 60, y still hears z advertising cost 5 to x, and y–z costs 1. What does plain DV compute at y?', choices: ['5 through x', '6 through z', '60 through z', '0 through y'], answer: 1, explanation: 'min(60,1+5)=6, even though z’s stale route may itself depend on y.' },
  { id: 'ch5-q15', prompt: 'If z reaches x through y, what does poisoned reverse make z advertise to y for x?', choices: ['Its ordinary finite estimate', 'Zero', 'Infinity', 'The address of x'], answer: 2, explanation: 'Advertising infinity back to the next hop prevents an immediate two-router circular dependency for that destination.' },
  { id: 'ch5-q16', prompt: 'Does poisoned reverse eliminate all routing loops?', choices: ['Yes, even arbitrary loops', 'No; loops of three or more routers can remain', 'Only in IPv6', 'Only when all links cost zero'], answer: 1, explanation: 'It handles the immediate reverse dependency, not every longer loop.' },
  { id: 'ch5-q17', prompt: 'Why can load-sensitive shortest-path routing oscillate?', choices: ['Traffic shifts alter the very costs used to select paths', 'Dijkstra always returns random distances', 'Link costs can never change', 'Forwarding tables contain no destinations'], answer: 0, explanation: 'Many nodes moving to an idle path can make it busy and expensive, prompting another synchronized move.' },
  { id: 'ch5-q18', prompt: 'Which control-message description is accurate?', choices: ['LS sends destination estimates only to neighbors; DV floods all links', 'LS disseminates local link state; DV exchanges distance estimates with neighbors', 'Both require a physical central server', 'Neither exchanges routing information'], answer: 1, explanation: 'LS builds a global map from local-link advertisements; DV propagates estimated destination costs neighbor by neighbor.' },
]

export const chapter5ActivityIds = ['ch5-control-model', 'ch5-graph-cost', 'ch5-dijkstra-trace', 'ch5-forwarding-table', 'ch5-ls-complexity', 'ch5-bellman-ford', 'ch5-dv-rounds', 'ch5-link-change', 'ch5-compare'] as const
