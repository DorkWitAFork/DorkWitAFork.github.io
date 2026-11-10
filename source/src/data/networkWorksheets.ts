export type WorksheetField = { label: string; answers: string[]; explanation: string; hint: string }
export type NetworkWorksheet = { id: string; title: string; prompt: string; fields: WorksheetField[] }

export const chapter4Worksheets: NetworkWorksheet[] = [
  {
    id: 'ch4-vlsm-plan', title: 'Design and audit a subnet plan',
    prompt: 'Fresh parent block: 126.91.140.0/24. B needs 60 usable interfaces; A needs 30 (router interfaces already counted). Allocate the largest first, starting at the lowest available aligned address. Use the ordinary network/broadcast reservations.',
    fields: [
      { label: 'B network (CIDR)', answers: ['126.91.140.0/26'], hint: 'Find the smallest power of two covering 60 + 2 addresses.', explanation: 'B needs 64 addresses: /26. The first aligned block is .0–.63.' },
      { label: 'B broadcast address', answers: ['126.91.140.63'], hint: 'The broadcast is the final address of the block.', explanation: 'Start at .0 and add 63: .63. Usable interfaces are .1–.62.' },
      { label: 'A network (CIDR)', answers: ['126.91.140.64/27'], hint: 'A needs 32 addresses. Start after B, on a multiple of 32.', explanation: 'The next available /27 starts at .64 and ends at .95.' },
      { label: 'A first usable address', answers: ['126.91.140.65'], hint: 'Reserve the network ID first.', explanation: 'Network .64 plus one gives .65.' },
      { label: 'A last usable address', answers: ['126.91.140.94'], hint: 'Reserve the broadcast address at the end.', explanation: 'A’s broadcast is .95, so its last usable address is .94.' },
      { label: 'First unallocated address', answers: ['126.91.140.96'], hint: 'The two allocations consume the first 96 addresses.', explanation: 'The interval .96–.255 remains free. It is contiguous, but spans more than one CIDR block.' },
    ],
  },
  {
    id: 'ch4-nat-trace', title: 'Fill the four stages of a NAT exchange',
    prompt: '10.0.1.16:3468 contacts 128.119.176.184:80. The NAT’s public IP is 135.122.197.215 and this connection is assigned public port 5001. Enter endpoints as IP:port. Trace the request outside the NAT and the reply before/after inbound translation.',
    fields: [
      { label: 'Outgoing WAN source', answers: ['135.122.197.215:5001'], hint: 'Use the public mapping, not the router’s LAN interface.', explanation: 'The outgoing private source is replaced by the public IP and assigned port.' },
      { label: 'Outgoing WAN destination', answers: ['128.119.176.184:80'], hint: 'NAT does not change the remote server in this exercise.', explanation: 'The request still targets the same server and service.' },
      { label: 'Reply WAN source', answers: ['128.119.176.184:80'], hint: 'The remote server sends the reply.', explanation: 'The server is now the source; port 80 is its service port.' },
      { label: 'Reply WAN destination', answers: ['135.122.197.215:5001'], hint: 'The server only saw the translated source.', explanation: 'The reply targets the public pair that NAT put into the outgoing request.' },
      { label: 'Reply LAN destination', answers: ['10.0.1.16:3468'], hint: 'Look up the public pair in the translation table.', explanation: 'The NAT restores the original private host and port as the reply destination.' },
    ],
  },
  {
    id: 'ch4-ipv6-size', title: 'Calculate IPv6 packet sizes',
    prompt: 'An IPv6 packet has a Payload Length of 1200 bytes. There are no extension headers; its UDP header is 8 bytes. Give numeric answers in bytes, without units.',
    fields: [
      { label: 'IPv6 base-header size', answers: ['40'], hint: 'IPv6 uses a fixed-length base header.', explanation: 'The IPv6 base header occupies 40 bytes.' },
      { label: 'Total IPv6 packet size', answers: ['1240'], hint: 'Payload Length excludes the base header.', explanation: '1,200 payload + 40 base header = 1,240 bytes.' },
      { label: 'UDP application data size', answers: ['1192'], hint: 'The UDP header is already inside the IP payload.', explanation: '1,200 − 8 = 1,192 application bytes. Do not subtract the IP base header from payload length.' },
    ],
  },
  {
    id: 'ch4-tunnel-trace', title: 'Trace inner and outer tunnel headers',
    prompt: 'IPv6 A (2001:db8:a::1) sends to F (2001:db8:f::1). B (192.0.2.10) encapsulates the packet in IPv4 and E (198.51.100.20) decapsulates it. The IPv4 tunnel MTU is 1500; use a 20-byte outer IPv4 header and a 40-byte inner IPv6 base header, with no options/extensions or outer fragmentation.',
    fields: [
      { label: 'Outer IPv4 source', answers: ['192.0.2.10'], hint: 'Which router adds the outer header?', explanation: 'B is the tunnel entry, so the outer IPv4 source is B.' },
      { label: 'Outer IPv4 destination', answers: ['198.51.100.20'], hint: 'Which router removes the outer header?', explanation: 'E is the tunnel exit and the IPv4 routing destination.' },
      { label: 'Inner IPv6 destination', answers: ['2001:db8:f::1', '2001:0db8:000f:0000:0000:0000:0000:0001'], hint: 'Encapsulation preserves the original host destination.', explanation: 'The inner destination remains F; it is not the tunnel exit E.' },
      { label: 'Maximum inner IPv6 packet (bytes)', answers: ['1480'], hint: 'Only the outer header is outside the inner packet.', explanation: '1,500 − 20 = 1,480 bytes for the entire inner packet.' },
      { label: 'Maximum upper-layer payload (bytes)', answers: ['1440'], hint: 'Now subtract the inner base header too.', explanation: '1,500 − 20 − 40 = 1,440 upper-layer bytes, including any transport header.' },
    ],
  },
  {
    id: 'ch4-flow-policy', title: 'Build a strict match-and-action policy',
    prompt: 'At s1, allow only TCP from source network 10.3.0.0/24 to destination network 10.2.0.0/24 arriving on ingress 1; send it out interface 4. All transport ports are allowed. Unmatched packets drop. Enter the exact CIDR prefixes; the protocol field can be TCP or its IP number.',
    fields: [
      { label: 'Source prefix', answers: ['10.3.0.0/24'], hint: 'Restrict the source; “any” would permit unrelated networks.', explanation: 'Both source and destination are constrained by the policy.' },
      { label: 'Destination prefix', answers: ['10.2.0.0/24'], hint: 'Match the destination network, not the next router.', explanation: 'The ultimate destination prefix stays 10.2.0.0/24 along the path.' },
      { label: 'IP protocol', answers: ['TCP', '6'], hint: 'The IP protocol field is distinct from a transport port.', explanation: 'TCP is IP protocol 6. UDP is 17 and must not match this policy.' },
      { label: 'Ingress interface', answers: ['1'], hint: 'This restricts where the packet is allowed to arrive.', explanation: 'Ingress 1 prevents the rule from forwarding matching addresses arriving on a different interface.' },
      { label: 'Output interface', answers: ['4'], hint: 'Use the requested local next step, not a transport port.', explanation: 'Forward through interface 4. Equivalent constrained rules are needed at subsequent switches.' },
    ],
  },
  {
    id: 'ch4-flow-priority', title: 'Evaluate overlapping flow rules',
    prompt: 'Higher numeric priority wins. Rule A: priority 100, TCP destination port 22 → drop. Rule B: priority 10, destination 10.2.0.0/24 → forward(4). Unmatched traffic drops. Enter “drop” or “4”.',
    fields: [
      { label: 'TCP to 10.2.0.3:22', answers: ['drop'], hint: 'Both rules match. Compare priorities.', explanation: 'Rule A wins at priority 100 even though B matches the destination prefix.' },
      { label: 'TCP to 10.2.0.3:80', answers: ['4'], hint: 'The port-22 rule does not match port 80.', explanation: 'Only B matches, so forward through output 4.' },
      { label: 'UDP to 10.2.0.3:22', answers: ['4'], hint: 'A explicitly requires TCP.', explanation: 'UDP does not match A. B forwards any protocol to the stated destination subnet.' },
      { label: 'TCP to 10.9.0.3:80', answers: ['drop'], hint: 'Does either rule match?', explanation: 'Neither rule matches; this exercise specifies a default drop.' },
    ],
  },
  {
    id: 'ch4-middlebox-roles', title: 'Identify the function from its behavior',
    prompt: 'Name each function using: NAT, firewall, load balancer, cache, endpoint verification. These are short-answer classifications, not choices to click.',
    fields: [
      { label: 'Rewrites private IP/port pairs to a public pair', answers: ['NAT'], hint: 'Think of the translation-table exercise.', explanation: 'NAT maintains mappings and rewrites endpoint fields.' },
      { label: 'Distributes new connections across backend servers', answers: ['load balancer'], hint: 'Its purpose is spreading service demand.', explanation: 'A load balancer selects among service backends.' },
      { label: 'Rejects traffic forbidden by an address/port policy', answers: ['firewall'], hint: 'This is an allow/deny function.', explanation: 'A firewall enforces the access policy.' },
      { label: 'Serves a locally stored reusable Web response', answers: ['cache'], hint: 'This can avoid contacting the origin again.', explanation: 'A cache reuses content subject to freshness and validation rules.' },
      { label: 'Checks the complete received file despite reliable links', answers: ['endpoint verification'], hint: 'Link-local help cannot guarantee the whole application result.', explanation: 'End-to-end correctness still needs checks at the endpoints.' },
    ],
  },
]

export const chapter5Worksheets: NetworkWorksheet[] = [
  {
    id: 'ch5-control-model', title: 'Separate control from forwarding',
    prompt: 'For the first two fields enter “control” or “data”. For the last two enter “per-router” or “SDN” to identify the control-plane structure.',
    fields: [
      { label: 'Compute network paths and install forwarding information', answers: ['control'], hint: 'This establishes what the local packet-handling rules should be.', explanation: 'The control plane computes the information used by forwarding.' },
      { label: 'Choose an output for an arriving packet using an installed table', answers: ['data'], hint: 'This is the local forwarding operation.', explanation: 'The data plane applies installed information to packets.' },
      { label: 'Routing components on individual routers exchange control messages', answers: ['per-router'], hint: 'No separate logically centralized controller is required.', explanation: 'Traditional per-router control distributes the routing components among routers.' },
      { label: 'A logically centralized controller installs switch rules', answers: ['SDN'], hint: 'Logical centralization can still be physically replicated.', explanation: 'An SDN controller installs information; switches still forward packets locally.' },
    ],
  },
  {
    id: 'ch5-graph-cost', title: 'Compare paths by total cost',
    prompt: 'Use these undirected links: u–w=5, u–x=1, x–y=1, y–w=1. There are no other links in this small example. Enter costs as numbers and paths as node names separated by spaces.',
    fields: [
      { label: 'Cost of direct u → w', answers: ['5'], hint: 'Read the single link weight.', explanation: 'The direct path costs 5, even though it is only one hop.' },
      { label: 'Cost of u → x → y → w', answers: ['3'], hint: 'Add all three link weights.', explanation: '1+1+1=3: more hops but less total cost.' },
      { label: 'Least-cost path', answers: ['u x y w'], hint: 'Compare sums rather than the number of links.', explanation: 'u → x → y → w costs 3 instead of 5.' },
    ],
  },
  {
    id: 'ch5-forwarding-table', title: 'Complete u’s final forwarding table',
    prompt: 'Use the six-router lecture graph displayed above. Fill final shortest costs and first next hops from source u. Keep predecessor and next hop distinct.',
    fields: [
      { label: 'Cost to v', answers: ['2'], hint: 'The direct u–v route is already optimal.', explanation: 'Direct u → v costs 2; through x it would cost 1+2=3.' },
      { label: 'Next hop to v', answers: ['v'], hint: 'Which neighbor follows u on its chosen path?', explanation: 'u reaches v directly.' },
      { label: 'Cost to w', answers: ['3'], hint: 'Try u → x → y → w.', explanation: '1+1+1=3, better than direct 5 or u → x → w at 4.' },
      { label: 'Next hop to w', answers: ['x'], hint: 'The first hop is not the predecessor of w.', explanation: 'u → x → y → w starts with x; y is w’s predecessor.' },
      { label: 'Cost to z', answers: ['4'], hint: 'Continue from x through y.', explanation: 'u → x → y → z costs 1+1+2=4.' },
      { label: 'Next hop to z', answers: ['x'], hint: 'Start tracing from u, not backward from z.', explanation: 'The outgoing link at u is toward x, even though p(z)=y.' },
      { label: 'Predecessor of z', answers: ['y'], hint: 'Which node immediately precedes z?', explanation: 'The shortest path reaches z from y.' },
    ],
  },
  {
    id: 'ch5-ls-complexity', title: 'Separate computation from dissemination',
    prompt: 'Use the slide’s simple scan-based Dijkstra and efficient-broadcast teaching model. For the first two fields enter “linear” or “quadratic”. For the final field use the numeric limit, ignoring constant factors.',
    fields: [
      { label: 'Dijkstra minimum-selection work across n nodes', answers: ['quadratic'], hint: 'Each iteration scans the remaining nodes.', explanation: 'n+(n−1)+…+1 grows as O(n²).' },
      { label: 'All n broadcasts, if each crosses O(n) links', answers: ['quadratic'], hint: 'Multiply originating routers by per-router dissemination.', explanation: 'n × O(n) = O(n²) under this model; general flooding also depends on E.' },
      { label: 'Maximum next-hop table entries for other nodes when n = 6', answers: ['5'], hint: 'Do not include an outgoing route to the source itself.', explanation: 'Six nodes minus the source leaves five other destinations.' },
    ],
  },
  {
    id: 'ch5-bellman-ford', title: 'Fill a Bellman-Ford candidate table',
    prompt: 'At u, local link costs to v,x,w are 2,1,5. Their latest advertisements to z are 5,3,3 respectively. Add the local cost to each advertisement, then choose the minimum.',
    fields: [
      { label: 'Candidate through v', answers: ['7'], hint: '2 + 5.', explanation: 'The candidate includes u→v plus v’s advertised remaining cost.' },
      { label: 'Candidate through x', answers: ['4'], hint: '1 + 3.', explanation: 'Through x the total is 4.' },
      { label: 'Candidate through w', answers: ['8'], hint: '5 + 3.', explanation: 'w advertises the same remaining distance as x, but is more expensive to reach.' },
      { label: 'New estimate to z', answers: ['4'], hint: 'Minimize the three complete candidate costs.', explanation: 'min(7,4,8)=4.' },
      { label: 'Next hop to z', answers: ['x'], hint: 'Which neighbor achieves that minimum?', explanation: 'Choose x, not destination z or the neighbor with the cheapest advertisement alone.' },
    ],
  },
  {
    id: 'ch5-link-change', title: 'Trace stale news and poisoned reverse',
    prompt: 'Initially x–y=4, y–z=1, x–z=50. y reaches x directly for 4; z advertises 5 via y. Then x–y rises to 60. First trace plain DV with the stale advertisements. Numeric fields contain costs; the last field accepts “infinity”.',
    fields: [
      { label: 'y’s first new estimate to x', answers: ['6'], hint: 'Compare direct 60 with 1 plus z’s stale 5.', explanation: 'min(60,1+5)=6 via z, although that advertised route depends on y.' },
      { label: 'z’s estimate after receiving y’s 6', answers: ['7'], hint: 'Compare direct 50 with 1+6.', explanation: 'z chooses 7 via y; the two routes now depend on each other.' },
      { label: 'y’s next estimate after hearing 7', answers: ['8'], hint: 'The cost increases by the y–z link again.', explanation: 'min(60,1+7)=8. This is count-to-infinity behavior.' },
      { label: 'Final stable cost from y to x', answers: ['51'], hint: 'Eventually z uses its direct cost-50 route.', explanation: 'y then reaches x via z for 1+50=51, better than its own direct link at 60.' },
      { label: 'With poisoned reverse, z’s advertisement to y while using y', answers: ['infinity', 'inf', '∞'], hint: 'Do not advertise a route back to the neighbor it depends on.', explanation: 'z advertises ∞ to y for x. This prevents this two-router loop, not every longer loop.' },
    ],
  },
  {
    id: 'ch5-compare', title: 'Classify algorithm behavior',
    prompt: 'Enter LS, DV, or both. Use the information-exchange models in these lessons, not the forwarding behavior of data packets.',
    fields: [
      { label: 'Uses a complete topology map to compute paths', answers: ['LS'], hint: 'Think Dijkstra and flooded local link state.', explanation: 'LS computes from global topology information.' },
      { label: 'Sends destination-distance estimates to direct neighbors', answers: ['DV'], hint: 'Think Bellman-Ford and neighbor advertisements.', explanation: 'DV exchanges distance vectors rather than requiring every node’s adjacency map.' },
      { label: 'Can produce next hops for a forwarding table', answers: ['both'], hint: 'Their goal is shared even though their knowledge differs.', explanation: 'Both supply local forwarding decisions from computed routes.' },
      { label: 'Has the classic stale-advertisement count-to-infinity problem', answers: ['DV'], hint: 'A neighbor may be depending on you.', explanation: 'This failure mode follows from distance-vector circular dependencies.' },
      { label: 'Can be affected by false routing information', answers: ['both'], hint: 'Neither model is automatically trustworthy.', explanation: 'False link-state or distance advertisements can both cause incorrect routing.' },
    ],
  },
]
