import type { Lesson, QuizQuestion } from '../types'

export const lessons: Lesson[] = [
  {
    id: 'internet-overview', number: '01', title: 'What is the Internet?', eyebrow: 'The big picture', minutes: 12,
    summary: 'See the Internet from two complementary perspectives: the machinery that moves data and the services applications use.',
    objectives: ['Identify hosts, packet switches, links, and networks', 'Explain why the Internet is a network of networks', 'Distinguish infrastructure from the services it provides'],
    sections: [
      { title: 'A nuts-and-bolts view', body: 'Billions of hosts, also called end systems, run applications at the network edge. Routers and switches forward packets across communication links made from fiber, copper, radio, or satellite.', points: ['A packet is a chunk of application data.', 'A link transmission rate is its bandwidth, measured in bits per second.', 'A network is a collection of devices, routers, and links managed by an organization.'] },
      { title: 'A services view', body: 'The same infrastructure offers communication services to distributed applications. Applications use programming interfaces, or sockets, to ask the transport system to send and receive data.' },
      { title: 'Standards keep it connected', body: 'Protocols such as HTTP, TCP, IP, WiFi, and Ethernet work together. The Internet Engineering Task Force develops many Internet standards and publishes them as Requests for Comments.' },
    ],
    keyTerms: ['host', 'end system', 'packet', 'router', 'switch', 'bandwidth', 'ISP', 'RFC', 'IETF'], source: 'Chapter 1 slides 3-7',
  },
  {
    id: 'protocols', number: '02', title: 'Speaking in Protocols', eyebrow: 'Rules of communication', minutes: 10,
    summary: 'Understand how communicating entities agree on what to send, when to send it, and what happens next.',
    objectives: ['Define a network protocol precisely', 'Recognize format, order, and action rules', 'Map a familiar human exchange to a network exchange'],
    sections: [
      { title: 'More than a message format', body: 'A protocol defines the format and order of messages exchanged between network entities and the actions taken when messages are transmitted, received, or when another event occurs.' },
      { title: 'Conversation as a model', body: 'A greeting creates context before a question and answer. Likewise, a client may request a TCP connection, receive a response, send an HTTP request, and then receive content. Reordering these messages breaks the exchange.' },
    ],
    keyTerms: ['protocol', 'message format', 'message order', 'network entity', 'TCP connection'], source: 'Chapter 1 slides 8-9',
  },
  {
    id: 'network-edge', number: '03', title: 'The Network Edge', eyebrow: 'Getting connected', minutes: 16,
    summary: 'Follow an end system through residential, enterprise, mobile, and data-center access networks.',
    objectives: ['Separate the network edge, access network, and core', 'Compare cable and DSL access', 'Describe home, enterprise, wireless, and data-center networks'],
    sections: [
      { title: 'Edge, access, core', body: 'Clients and servers live at the edge. An access network connects a host to its first, or edge, router. The core is the mesh of interconnected routers beyond that point.' },
      { title: 'Residential access', body: 'Hybrid fiber coax cable systems share a distribution network among homes. DSL uses an existing telephone line that is dedicated from a home to the telephone company central office.', points: ['Cable carries data and television in different frequency bands.', 'DSL separates voice and data frequencies with splitters.', 'Both commonly provide asymmetric downstream and upstream rates.'] },
      { title: 'Other access environments', body: 'Enterprise networks mix Ethernet, WiFi, switches, and routers. Wireless LANs cover a building-scale area, while cellular access covers a much wider area. Data centers use very high bandwidth links to connect large groups of servers.' },
    ],
    keyTerms: ['network edge', 'access network', 'HFC', 'CMTS', 'DSL', 'DSLAM', 'WLAN', 'data center'], source: 'Chapter 1 slides 10-21',
  },
  {
    id: 'physical-media', number: '04', title: 'Packets and Physical Media', eyebrow: 'Bits on the move', minutes: 14,
    summary: 'Connect packet size and link rate to transmission delay, then compare guided and unguided media.',
    objectives: ['Calculate transmission delay using L/R', 'Distinguish transmission rate from packet size', 'Compare copper, fiber, coax, and radio media'],
    sections: [
      { title: 'A host sends packets', body: 'A sending host breaks an application message into packets of L bits and pushes each packet onto a link operating at R bits per second. The time required to put one complete packet onto that link is L divided by R.' },
      { title: 'Guided media', body: 'Signals in guided media travel through a solid material. Twisted-pair copper is common in Ethernet, coaxial cable supports multiple frequency channels, and fiber carries light pulses at high rates with low error and resistance to electromagnetic noise.' },
      { title: 'Unguided media', body: 'Radio signals propagate without a physical wire. Wireless links are affected by reflection, obstruction, interference, and noise. Examples include WiFi, cellular, Bluetooth, terrestrial microwave, and satellite.' },
    ],
    keyTerms: ['transmission delay', 'L/R', 'guided media', 'twisted pair', 'coaxial cable', 'fiber', 'radio'], source: 'Chapter 1 slides 22-25',
  },
  {
    id: 'network-core', number: '05', title: 'Inside the Network Core', eyebrow: 'Forwarding packets', minutes: 14,
    summary: 'Trace packets across routers and separate the local act of forwarding from the global process of routing.',
    objectives: ['Describe packet switching', 'Distinguish routing from forwarding', 'Explain store-and-forward operation'],
    sections: [
      { title: 'Forwarding versus routing', body: 'Forwarding is a local router action: inspect a packet header and move the packet to an output link using a forwarding table. Routing is the global process that determines source-to-destination paths and creates those tables.' },
      { title: 'Store and forward', body: 'A router must receive an entire packet before transmitting it on the next link. For equal-rate links and no queueing, every link adds another L/R of transmission time before the packet is fully delivered.' },
    ],
    keyTerms: ['network core', 'packet switching', 'forwarding', 'routing', 'forwarding table', 'store-and-forward'], source: 'Chapter 1 slides 26-31',
  },
  {
    id: 'resource-sharing', number: '06', title: 'Sharing Network Resources', eyebrow: 'Packets or circuits?', minutes: 18,
    summary: 'Explore queueing and loss, then compare packet switching with reserved circuit capacity.',
    objectives: ['Predict when a queue grows', 'Explain why full buffers cause packet loss', 'Compare packet and circuit switching', 'Distinguish FDM from TDM'],
    sections: [
      { title: 'Queues absorb bursts', body: 'When packets arrive at an output link faster than the link can transmit them, packets wait in a router buffer. If this continues and the finite buffer fills, newly arriving packets are dropped.' },
      { title: 'Reserved circuits', body: 'Circuit switching reserves end-to-end resources for a call. It can provide predictable performance, but reserved capacity sits idle when its owner is not sending.', points: ['FDM gives each call a narrow frequency band.', 'TDM gives each call periodic time slots.', 'Packet switching shares capacity on demand and handles bursty use efficiently.'] },
    ],
    keyTerms: ['queueing', 'buffer', 'packet loss', 'circuit switching', 'FDM', 'TDM', 'statistical multiplexing'], source: 'Chapter 1 slides 32-36',
  },
  {
    id: 'internet-structure', number: '07', title: 'A Network of Networks', eyebrow: 'How ISPs interconnect', minutes: 15,
    summary: 'Build the Internet outward from access ISPs to regional providers, tier-1 networks, IXPs, and content-provider networks.',
    objectives: ['Explain why a full mesh of access ISPs does not scale', 'Describe customer-provider and peering relationships', 'Identify the roles of IXPs and content-provider networks'],
    sections: [
      { title: 'Why hierarchy emerges', body: 'Connecting every access ISP directly to every other access ISP requires a number of connections that grows approximately with the square of the ISP count. Transit providers aggregate those connections through customer-provider relationships.' },
      { title: 'Peering and IXPs', body: 'Competing ISPs still need to exchange traffic. They can peer directly or connect at Internet exchange points. Regional networks connect access networks upward to larger providers.' },
      { title: 'Content moves closer', body: 'Large content providers operate private global networks and place services near users. Their networks may connect directly to access ISPs or IXPs, bypassing some traditional transit paths.' },
    ],
    keyTerms: ['access ISP', 'regional ISP', 'tier-1 ISP', 'transit', 'peering', 'IXP', 'content-provider network'], source: 'Chapter 1 slides 37-45',
  },
]

export const quizQuestions: QuizQuestion[] = [
  { id: 'q1', prompt: 'Which device is an end system at the Internet edge?', choices: ['A laptop running a browser', 'A core router', 'An Ethernet switch forwarding frames', 'An Internet exchange point'], answer: 0, explanation: 'Hosts such as laptops, phones, and servers are end systems. Routers and switches move their traffic.' },
  { id: 'q2', prompt: 'What three elements does a protocol define?', choices: ['Speed, distance, and cost', 'Format, order, and actions', 'Hosts, routers, and links', 'Bits, bytes, and packets'], answer: 1, explanation: 'Protocols define message format, message order, and actions taken on transmission, receipt, or other events.' },
  { id: 'q3', prompt: 'Which residential access technology shares the distribution network among homes?', choices: ['DSL', 'HFC cable', 'Dedicated fiber pair', 'Bluetooth'], answer: 1, explanation: 'Cable/HFC users share the cable distribution network to the headend. A DSL line is dedicated to the central office.' },
  { id: 'q4', prompt: 'A 12,000-bit packet enters a 6 Mbps link. What is its transmission delay?', choices: ['0.002 ms', '0.2 ms', '2 ms', '72 ms'], answer: 2, explanation: 'L/R = 12,000 / 6,000,000 seconds = 0.002 seconds = 2 milliseconds.' },
  { id: 'q5', prompt: 'Which physical medium is immune to electromagnetic noise?', choices: ['Twisted-pair copper', 'Coaxial cable', 'Fiber optic cable', 'Radio'], answer: 2, explanation: 'Fiber carries light rather than electrical or radio signals, making it immune to electromagnetic noise.' },
  { id: 'q6', prompt: 'What is forwarding?', choices: ['Computing every end-to-end route', 'Moving a packet from an input to the correct output link', 'Reserving an end-to-end circuit', 'Splitting application data into packets'], answer: 1, explanation: 'Forwarding is a local router action. Routing is the global process that determines paths.' },
  { id: 'q7', prompt: 'Under store-and-forward operation, when can a router transmit a packet on the next link?', choices: ['As soon as the first bit arrives', 'After half the packet arrives', 'After the entire packet arrives', 'Only after the destination responds'], answer: 2, explanation: 'The router receives the complete packet before beginning transmission on the next link.' },
  { id: 'q8', prompt: 'What happens when sustained packet arrival exceeds an output link’s service rate?', choices: ['Bandwidth automatically increases', 'Packets queue and may eventually be dropped', 'A circuit is automatically reserved', 'The forwarding table is erased'], answer: 1, explanation: 'Packets wait in a finite buffer. Once the buffer is full, additional packets are lost.' },
  { id: 'q9', prompt: 'How does TDM separate users?', choices: ['By assigning different packet sizes', 'By assigning different routes', 'By assigning different frequency bands', 'By assigning periodic time slots'], answer: 3, explanation: 'Time Division Multiplexing allocates repeating time slots; FDM allocates frequency bands.' },
  { id: 'q10', prompt: 'What is the primary purpose of an IXP?', choices: ['Connect end systems to WiFi', 'Let networks exchange traffic', 'Convert analog signals to packets', 'Store content permanently'], answer: 1, explanation: 'An Internet exchange point is a location where independent networks interconnect and exchange traffic.' },
]

export const semesterWeeks = [
  ['01-02', 'Internet foundations', 'Chapter 1', 'Available', 'Hosts, protocols, access networks, physical media, switching, and ISP structure'],
  ['03-05', 'Application principles and the Web', 'Chapter 2', 'Available', 'Application architectures, transport needs, HTTP, cookies, caching, and modern HTTP'],
  ['06-07', 'Transport layer', 'Chapter 3', 'Provisional', 'UDP, TCP, reliable transfer, flow control, and congestion control'],
  ['08', 'Midterm checkpoint', 'Review', 'Provisional', 'Concept synthesis, calculations, packet analysis, and exam preparation'],
  ['09-11', 'Network layer', 'Chapters 4-5', 'Provisional', 'IP, forwarding, NAT, IPv6, routing, OSPF, BGP, and SDN'],
  ['12-13', 'Link layer', 'Chapter 6', 'Provisional', 'Error detection, CRC, multiple access, MAC, ARP, Ethernet, switching, and VLANs'],
  ['14', 'Wireless and mobility', 'Chapter 7', 'Provisional', 'Wireless access, mobility concepts, and protocol behavior'],
  ['15', 'Security and review', 'Chapter 8', 'Provisional', 'Security across the stack and cumulative final preparation'],
]

export const glossary: Array<[string, string]> = [
  ['Access network', 'The network connecting an end system to its first router.'],
  ['Bandwidth', 'A link’s transmission rate or capacity, measured in bits per second.'],
  ['End system', 'A host at the network edge that runs applications.'],
  ['Forwarding', 'The local action of moving an arriving packet to an output link.'],
  ['IXP', 'An Internet exchange point where independent networks exchange traffic.'],
  ['Packet', 'A chunk of data sent through a packet-switched network.'],
  ['Protocol', 'Rules defining message format, order, and resulting actions.'],
  ['Routing', 'The global process of determining source-to-destination paths.'],
  ['Store-and-forward', 'Receiving an entire packet before transmitting it on the next link.'],
  ['Transmission delay', 'Time required to push all packet bits onto a link: L/R.'],
]
