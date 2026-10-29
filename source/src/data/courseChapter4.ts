import type { Lesson, QuizQuestion } from '../types'
import { chapter4RouterLessons, chapter4RouterQuizQuestions } from './courseChapter4Router'

const slides = 'Chapter4-Data Plane-IP.pdf'
const book = 'Chaptert 4 - Computer Networking, EBook, Global Edition.pdf'
const source = (pages: string, textbook: string) => `${slides} slides ${pages}; ${book} pp. ${textbook}`

const chapter4IpLessons: Lesson[] = [
  {
    id: 'ch4-network-plane', number: '01', title: 'The Network Layer and Two Planes', eyebrow: 'Host to host, hop by hop', minutes: 20,
    summary: 'Follow an IP datagram from a sending host through routers and distinguish local forwarding from path selection.',
    objectives: ['Explain what IP does for a transport segment', 'Distinguish data-plane forwarding from control-plane routing', 'Describe the roles of IP and ICMP without confusing them'],
    sections: [
      { title: 'The host-to-host layer', body: 'A sender gives a transport segment to IP, which wraps it in a network-layer datagram. Each router examines the datagram and sends it toward the destination; the receiving host hands the payload to the indicated upper-layer protocol. The network layer is present in hosts and routers, unlike the application process that runs at the endpoints.' },
      { title: 'Two questions, two planes', body: 'The data plane asks: given a datagram arriving here, which outgoing interface should carry it next? This is forwarding, a local action repeated at each router. The control plane asks: which paths should packets use across the network? Routing algorithms or an SDN controller determine the forwarding information used by routers.', points: ['A forwarding table supports a local decision; it is not an entire end-to-end itinerary.', 'Do not mistake the router interface for an application socket port.'] },
      { title: 'IP and ICMP have different jobs', body: 'IP defines datagram format, addressing, and packet-handling conventions. The slides show ICMP alongside IP for error reporting and router signaling. Path-selection algorithms and protocols populate forwarding information; the details of routing protocols belong to later material.' },
      { title: 'Trace one packet', body: 'A host sends a segment inside an IP datagram. Router A reads the destination and chooses its next output. Router B does the same using its own forwarding table. Neither router needs to run the destination application. At the destination, IP uses its upper-layer protocol field to pass the payload onward.' },
    ], keyTerms: ['network layer', 'data plane', 'control plane', 'datagram', 'forwarding table', 'ICMP'], source: `Chapter4-Data Plane-Overview-Router.pdf slides 4–8; ${book} pp. 333–340`,
  },
  {
    id: 'ch4-ipv4-header', number: '02', title: 'Read an IPv4 Datagram', eyebrow: 'A header with a purpose', minutes: 27,
    summary: 'Interpret the IPv4 header, separate header and payload length, and trace how routers use TTL and the header checksum.',
    objectives: ['Locate the main fields in an IPv4 header', 'Compute header and payload sizes under stated assumptions', 'Trace TTL and distinguish the IP protocol number from a TCP/UDP port'],
    sections: [
      { title: 'From segment to datagram', body: 'An IP datagram consists of an IP header followed by data, commonly a TCP or UDP segment. With no IP options the IPv4 header occupies 20 bytes. A TCP segment with no TCP options also has a 20-byte header, so an IP datagram carrying TCP has at least 40 bytes of IP+TCP headers before application bytes.', points: ['Total length counts both the IP header and its payload, in bytes.', 'Header length identifies where the IP payload begins; options make an IPv4 header longer than 20 bytes.'] },
      { title: 'Read the fields by job', body: 'Version identifies IPv4. Type of service carries differentiated-service and ECN information. Identifier, flags, and fragment offset relate to fragmentation. Source and destination addresses identify the sending and receiving interfaces; the destination remains the ultimate host, not merely the next hop.', points: ['The 16-bit total-length field has a theoretical maximum of 65,535 bytes.', 'The IP protocol field identifies the payload protocol: 6 for TCP and 17 for UDP.'] },
      { title: 'What changes at each router?', body: 'Time-to-live (TTL) is a hop limit: every forwarding router decrements it. A router drops a datagram whose TTL reaches zero, preventing endless circulation. IPv4 checksums only its own header; since TTL changes, the header checksum must be updated. This is not a guarantee that the payload is error-free or that the datagram arrives.' },
      { title: 'Worked field reading', body: 'Suppose an IPv4 datagram has 20 bytes of IP header and total length 1,500 bytes. Its IP payload is 1,480 bytes. If it carries TCP with a 20-byte header and no options, the remaining application data is 1,460 bytes. State these no-options assumptions before subtracting.' },
    ], keyTerms: ['IPv4 datagram', 'total length', 'header length', 'TTL', 'protocol field', 'fragmentation', 'header checksum'], source: source('4', '361–363'),
  },
  {
    id: 'ch4-ip-interfaces', number: '03', title: 'Addresses Belong to Interfaces', eyebrow: 'Read every octet', minutes: 22,
    summary: 'Translate dotted-decimal IPv4 addresses into four eight-bit groups and locate each host or router interface.',
    objectives: ['Explain why a router can have multiple IP addresses', 'Convert an IPv4 octet between decimal and binary', 'Recognize which addresses belong to the same /24 subnet'],
    sections: [
      { title: 'An address identifies an interface', body: 'An interface connects a host or router to a physical link. A host often has one or two interfaces; a router connecting three networks normally has at least three. Each IP-enabled interface has an IP address. A router is not assigned only one address for all of its links.', points: ['A WiFi and a wired interface on the same host can have different IP addresses.', 'A router interface attached to a subnet shares its network prefix with that subnet.'] },
      { title: 'Four decimal numbers are 32 bits', body: 'IPv4 uses 32 bits, written as four decimal octets separated by dots. Each octet is eight bits and ranges from 0 to 255. To convert 223, add 128 + 64 + 16 + 8 + 4 + 2 + 1: its bits are 11011111. The value 1 is 00000001. Thus 223.1.1.1 is 11011111 00000001 00000001 00000001.' },
      { title: 'Read the network picture', body: 'The slides place hosts 223.1.1.1 through 223.1.1.3 beside router interface 223.1.1.4, and hosts 223.1.2.1 and .2 beside interface 223.1.2.9. The router has another interface 223.1.3.27 on the third subnet. The router links the distinct networks; hosts on the same local link can communicate without passing through another router.' },
    ], keyTerms: ['interface', 'IPv4 address', 'octet', 'dotted-decimal notation', 'router interface'], source: source('5–7', '364–365'),
  },
  {
    id: 'ch4-subnets', number: '04', title: 'Find the Subnets', eyebrow: 'Look for router-free islands', minutes: 25,
    summary: 'Identify groups of interfaces that communicate without an intervening router and name their /24 network prefixes.',
    objectives: ['Define a subnet from its connected interfaces', 'Count subnets in host-and-router topologies', 'Find network addresses for /24 examples'],
    sections: [
      { title: 'A subnet is a local island', body: 'Interfaces on one subnet can reach each other without passing through an intervening router. For the three-island diagram, the subnet addresses are 223.1.1.0/24, 223.1.2.0/24, and 223.1.3.0/24. Each includes the router interface attached to that island.', points: ['A switch or WiFi access point can connect interfaces within one subnet; it is not itself an intervening IP router.', 'Each router-to-router link can also form its own subnet.'] },
      { title: 'Detach the interfaces', body: 'Use the lecture recipe: conceptually detach every host and router interface. Each remaining router-free island is a subnet. In the three-router exercise, count the host-facing networks and the links between routers: three of each, for six subnets. Do not count one router with multiple interfaces as one subnet.' },
      { title: 'What /24 means', body: 'The /24 prefix reserves the first 24 bits for the network and leaves the last 8 for an interface address within it. For 223.1.2.9/24, the network address is 223.1.2.0/24. A device at 223.1.3.1/24 is on a different subnet even though the first two octets match.' },
    ], keyTerms: ['subnet', 'network address', 'host portion', 'prefix', 'subnet mask'], source: source('8–10', '364–367'),
  },
  {
    id: 'ch4-cidr', number: '05', title: 'CIDR and Prefix Bits', eyebrow: 'The slash sets the boundary', minutes: 28,
    summary: 'Use an arbitrary-length prefix to divide a 32-bit address into shared network bits and remaining host bits.',
    objectives: ['Interpret address/prefix notation', 'Find a network address from an IPv4 address and prefix length', 'Calculate block size and compare two prefixes'],
    sections: [
      { title: 'CIDR is classless', body: 'Classless InterDomain Routing uses a.b.c.d/x notation, where x is the number of high-order network bits. The other 32 − x bits vary within that block. Unlike older fixed classes, the split can fall inside an octet. A /23 prefix, for example, includes all of the first two octets and seven bits of the third.', points: ['A /24 contains 2^(32−24) = 256 addresses, including reserved network and broadcast addresses in the usual IPv4 subnet model.', 'A /23 contains 512 addresses, not just 23.'] },
      { title: 'Work across an octet boundary', body: '200.23.16.0/23 has 23 fixed bits and nine variable bits. The third octet 16 is 00010000 in binary; its first seven bits stay fixed while the last bit can change. Consequently this block runs from 200.23.16.0 through 200.23.17.255. The next /23 begins at 200.23.18.0.' },
      { title: 'Compare first, then calculate', body: 'To test whether an address belongs to a block, convert only the octet where the prefix splits to binary, compare its fixed leading bits, and check the other fixed octets. For 200.23.17.42, the first 23 bits match 200.23.16.0/23. For 200.23.18.42, they do not.' },
    ], keyTerms: ['CIDR', 'prefix length', 'network bits', 'host bits', 'address block'], source: source('11', '366–368'),
  },
  {
    id: 'ch4-dhcp', number: '06', title: 'DHCP: Join a Network', eyebrow: 'Discover, offer, request, acknowledge', minutes: 28,
    summary: 'Trace how a new host obtains a leased address and learns its first-hop router, DNS server, and network mask.',
    objectives: ['Order the four DHCP messages', 'Explain broadcasts before a host knows its address', 'Identify the additional configuration in a DHCP reply'],
    sections: [
      { title: 'Two ways to assign a host address', body: 'An administrator can configure an address manually, or DHCP can assign one as a host joins the network. DHCP supports leases that can be renewed or reused after a host leaves, which makes it useful for changing and mobile populations.' },
      { title: 'Four messages in the usual exchange', body: 'The new client broadcasts Discover to locate a server. The server replies with Offer containing a proposed address. The client sends Request to select the offer. The server returns ACK to confirm the lease. The slides note that Discover and Offer may be skipped when a client remembers and requests a previously assigned address.', points: ['The first Discover can originate from 0.0.0.0:68 and target 255.255.255.255:67.', 'The server replies from UDP port 67 to the client port 68; the transaction ID correlates each exchange.'] },
      { title: 'More than an IP address', body: 'DHCP can also give the network mask, first-hop router address, and DNS server information. A DHCP message travels as an application message inside UDP, inside IP, inside a link-layer frame. The receiving endpoint removes those layers in reverse order.' },
      { title: 'Follow a concrete lease', body: 'In the slide trace, a server at 223.1.2.5 offers 223.1.2.4 with a 3,600-second lifetime. The client requests it, then waits for the server ACK. An offer is a proposal, not proof that a lease has already been confirmed.' },
    ], keyTerms: ['DHCP', 'Discover', 'Offer', 'Request', 'ACK', 'lease', 'broadcast', 'default gateway'], source: source('12–18', '371–374'),
  },
  {
    id: 'ch4-aggregation', number: '07', title: 'Address Allocation and Route Aggregation', eyebrow: 'Many networks, one advertisement', minutes: 30,
    summary: 'See how an ISP splits an address block and advertises one summary route for its customer networks.',
    objectives: ['Split a /20 into /23 blocks', 'Describe why hierarchical allocation reduces route advertisements', 'Explain how a /23 can override a matching /20'],
    sections: [
      { title: 'Where do prefixes come from?', body: 'The slides distinguish a host obtaining an interface address from a network obtaining a block. An ISP can receive a block through the address-allocation system and assign smaller blocks to customers. ICANN coordinates allocation through regional registries; the ISP assigns a suitable portion of its space to each organization.' },
      { title: 'Split the ISP block', body: 'The example ISP holds 200.23.16.0/20. Changing the prefix to /23 uses three additional bits, creating 2^3 = 8 equal blocks: 200.23.16.0/23, 200.23.18.0/23, through 200.23.30.0/23. Every child block is contained in the parent block.', points: ['Every /23 spans two adjacent values of the third octet.', 'One /20 advertisement can summarize these eight /23 customer blocks when they are reached through the same ISP.'] },
      { title: 'What if an organization changes providers?', body: 'The first ISP still advertises 200.23.16.0/20, but organization 1 moves to a second ISP without renumbering. The second ISP advertises the more-specific 200.23.18.0/23. A destination inside that /23 matches both entries; longest-prefix matching chooses /23 and directs traffic to the new provider.' },
      { title: 'An address is not a route', body: 'CIDR describes which addresses share prefix bits; aggregation reduces the number of externally advertised routes. The local data plane applies a forwarding-table match to choose the outgoing interface. The slides illustrate this behavior without developing the routing protocols that create and exchange those advertisements.' },
    ], keyTerms: ['address allocation', 'route aggregation', 'summary route', 'more-specific route', 'longest-prefix match', 'regional registry'], source: source('19–23', '368–370'),
  },
]

const chapter4IpQuizQuestions: QuizQuestion[] = [
  { id: 'ch4-q1', prompt: 'Which network-layer action happens separately at every router along a path?', choices: ['Routing chooses the entire path for each packet at every hop', 'Forwarding uses a local table to select an output interface', 'The router runs the destination Web application', 'DHCP assigns the datagram a new destination address'], answer: 1, explanation: 'Forwarding is the local data-plane action; the control plane determines the information used by the table.' },
  { id: 'ch4-q2', prompt: 'With no options, a 1,500-byte IPv4 datagram has a 20-byte IP header. How many bytes remain as IP payload?', choices: ['1,460', '1,480', '1,500', '1,520'], answer: 1, explanation: 'IPv4 total length includes its 20-byte header: 1,500 − 20 = 1,480 bytes of IP payload.' },
  { id: 'ch4-q3', prompt: 'That datagram contains a TCP segment with a 20-byte TCP header and no TCP options. How many application bytes does it carry?', choices: ['1,460', '1,480', '1,500', '1,540'], answer: 0, explanation: 'Subtract both headers: 1,500 − 20 bytes of IP − 20 bytes of TCP = 1,460 application bytes.' },
  { id: 'ch4-q4', prompt: 'An IPv4 datagram reaches a router with TTL 1. What happens when the router processes it for forwarding?', choices: ['TTL increases to 2', 'TTL becomes 0 and the datagram is dropped', 'It is delivered to every subnet', 'Only the TCP header is removed'], answer: 1, explanation: 'A forwarding router decrements TTL; a zero TTL causes the datagram to be dropped.' },
  { id: 'ch4-q5', prompt: 'Which IPv4 header field identifies whether the destination should hand the payload to TCP or UDP?', choices: ['Source address', 'Fragment offset', 'Protocol', 'Total length'], answer: 2, explanation: 'The IP protocol field names the next protocol; 6 means TCP and 17 means UDP.' },
  { id: 'ch4-q6', prompt: 'How many IP addresses does a router with three active IP interfaces normally need in the slide model?', choices: ['One for the router', 'Two for input and output', 'Three, one per interface', '32, one per address bit'], answer: 2, explanation: 'An IP address belongs to an interface; the router connects to three links using three interfaces.' },
  { id: 'ch4-q7', prompt: 'Which binary octet represents decimal 223?', choices: ['11011111', '11111111', '11001111', '00011111'], answer: 0, explanation: '223 = 128 + 64 + 16 + 8 + 4 + 2 + 1, giving 11011111.' },
  { id: 'ch4-q8', prompt: 'Which address is in the same /24 subnet as 223.1.2.9?', choices: ['223.1.1.4', '223.1.2.2', '223.1.3.1', '223.2.2.9'], answer: 1, explanation: 'The first 24 bits, or first three octets, must match: 223.1.2.' },
  { id: 'ch4-q9', prompt: 'A topology has three host-facing subnets and three router-to-router links, each a separate router-free island. How many subnets does it have?', choices: ['3', '4', '6', '9'], answer: 2, explanation: 'Each host-facing island and each router-to-router link is a subnet: 3 + 3 = 6.' },
  { id: 'ch4-q10', prompt: 'How many total IPv4 addresses does a /23 block contain?', choices: ['23', '128', '256', '512'], answer: 3, explanation: 'A /23 leaves 32 − 23 = 9 variable bits, so there are 2^9 = 512 addresses in the block.' },
  { id: 'ch4-q11', prompt: 'Which address falls within 200.23.16.0/23?', choices: ['200.23.15.255', '200.23.17.42', '200.23.18.0', '200.23.19.42'], answer: 1, explanation: '200.23.16.0/23 runs from 200.23.16.0 through 200.23.17.255.' },
  { id: 'ch4-q12', prompt: 'Which sequence is the usual four-message DHCP exchange?', choices: ['Discover → Offer → Request → ACK', 'Request → Discover → ACK → Offer', 'Offer → ACK → Discover → Request', 'Discover → ACK → Offer → Request'], answer: 0, explanation: 'The typical DHCP sequence is Discover, Offer, Request, ACK (DORA); returning clients may skip the first two.' },
  { id: 'ch4-q13', prompt: 'Why does a new DHCP client broadcast its first request?', choices: ['It already knows the server IP', 'It does not yet know its own usable IP or a DHCP server address', 'TCP requires broadcast setup', 'Every IP packet must be broadcast'], answer: 1, explanation: 'The new host can use 0.0.0.0 as source and 255.255.255.255 as broadcast destination to find a DHCP server.' },
  { id: 'ch4-q14', prompt: 'What can DHCP supply besides an assigned IP address?', choices: ['A guaranteed Internet bandwidth', 'The network mask, first-hop router, and DNS server information', 'A permanent public IPv6 address in every case', 'The complete path through every ISP'], answer: 1, explanation: 'DHCP can also communicate mask, default gateway, and DNS configuration.' },
  { id: 'ch4-q15', prompt: 'How many /23 blocks fit inside the ISP block 200.23.16.0/20?', choices: ['2', '4', '8', '16'], answer: 2, explanation: 'A /23 fixes three more bits than a /20, so it divides into 2^3 = 8 equal blocks.' },
  { id: 'ch4-q16', prompt: 'Both 200.23.16.0/20 and 200.23.18.0/23 match destination 200.23.18.42. Which route wins?', choices: ['The /20, because it covers more addresses', 'The /23, because it has the longer matching prefix', 'Both routes are added together', 'Neither, because overlapping routes are invalid'], answer: 1, explanation: 'Longest-prefix matching selects the more specific /23 for an address inside both blocks.' },
  { id: 'ch4-q17', prompt: 'What is the benefit of advertising one /20 when an ISP serves eight contiguous /23 customer networks?', choices: ['It changes each customer address to IPv6', 'It summarizes the blocks so other routers need fewer separate route entries', 'It removes the need for host interfaces', 'It guarantees packet delivery'], answer: 1, explanation: 'Route aggregation represents multiple child blocks with one shared parent prefix.' },
  { id: 'ch4-q18', prompt: 'How does an ISP obtain a block of addresses to allocate to its customer networks?', choices: ['Through the allocation system coordinated by ICANN and regional registries', 'By asking each host to invent a new public prefix', 'By copying an unrelated ISP address without coordination', 'By reading the TTL value of an IP datagram'], answer: 0, explanation: 'The slides describe ICANN coordinating address allocation through regional registries; providers can allocate portions of their space to organizations.' },
]

export const chapter4Glossary: Array<[string, string]> = [
  ['Best effort', 'The Internet network layer makes no basic guarantee of datagram delivery, timing, order, or minimum bandwidth.'],
  ['Buffer overflow', 'Loss when a finite packet queue cannot hold additional arrivals.'],
  ['Crossbar', 'Switching fabric that can transfer packets between distinct input/output pairs concurrently.'],
  ['Drop-tail', 'Discarding an arriving packet because the queue is full.'],
  ['FCFS (FIFO)', 'First-come-first-served output scheduling in arrival order.'],
  ['Head-of-line blocking', 'An input-queued packet cannot move because another packet in front of it is blocked, even if its own output is free.'],
  ['Input port', 'Router interface receiving bits, processing a frame, and consulting forwarding information.'],
  ['Output port', 'Router interface buffering, scheduling, and transmitting datagrams onto an outgoing link.'],
  ['Priority scheduling', 'Servicing a nonempty higher-priority queue before a lower-priority queue at each decision.'],
  ['Round robin', 'Scheduling complete packets cyclically across nonempty traffic classes.'],
  ['Routing processor', 'Router component maintaining forwarding information and performing control-plane functions.'],
  ['Switching fabric', 'Internal router mechanism that transfers datagrams from input to selected output ports.'],
  ['Weighted fair queuing (WFQ)', 'Assigning traffic classes differing shares of output-link service based on weights.'],
  ['Address block', 'A set of IP addresses with the same leading prefix bits.'],
  ['CIDR', 'Classless InterDomain Routing: a.b.c.d/x notation with x leading network bits.'],
  ['Control plane', 'Network-wide logic that chooses routes and supplies forwarding information.'],
  ['Data plane', 'Router-local operations that process and forward arriving datagrams.'],
  ['Datagram', 'A network-layer packet containing an IP header and a payload.'],
  ['Default gateway', 'The first-hop router address a host can learn from DHCP.'],
  ['DHCP', 'Protocol that supplies a host with leased IP configuration when it joins a network.'],
  ['Dotted-decimal', 'IPv4 notation that writes each of four eight-bit octets in decimal.'],
  ['Forwarding', 'The local choice of an output interface for an arriving packet.'],
  ['Header checksum', 'IPv4 header-only error check updated when a router changes TTL.'],
  ['Interface', 'A host or router connection to a physical link; IP addresses are associated with interfaces.'],
  ['Lease', 'The period for which a DHCP-assigned address is valid before renewal.'],
  ['Longest-prefix match', 'The rule that selects the most-specific matching network prefix for forwarding.'],
  ['Network address', 'The base address of a block, with its variable host bits set to zero.'],
  ['Octet', 'An eight-bit group in an IPv4 address, represented by a value from 0 to 255.'],
  ['Prefix length', 'The number after / in CIDR notation; counts fixed leading network bits.'],
  ['Route aggregation', 'Advertising one parent prefix that covers multiple reachable child blocks.'],
  ['Routing', 'Network-wide selection of paths that packets can take between hosts.'],
  ['Subnet', 'Interfaces able to reach each other without passing through an intervening router.'],
  ['TTL', 'IPv4 hop-limit field decremented at each forwarding router; the datagram is dropped at zero.'],
  ['Total length', 'IPv4 header field counting the whole IP datagram, including header and payload, in bytes.'],
  ['Upper-layer protocol', 'IPv4 field selecting the payload handler at the destination, such as TCP (6) or UDP (17).'],
]

export const chapter4Lessons: Lesson[] = [chapter4IpLessons[0], ...chapter4RouterLessons, ...chapter4IpLessons.slice(1)].map((lesson, index) => ({ ...lesson, number: String(index + 1).padStart(2, '0') }))
export const chapter4QuizQuestions: QuizQuestion[] = [...chapter4RouterQuizQuestions, ...chapter4IpQuizQuestions]
export const chapter4ActivityIds = ['ch4-router-match', 'ch4-fabric', 'ch4-scheduler', 'ch4-header-trace', 'ch4-subnet-islands', 'ch4-cidr-calculator', 'ch4-dhcp-sequence', 'ch4-longest-prefix'] as const
