import type { Lesson, QuizQuestion } from '../types'

export const chapter2Lessons: Lesson[] = [
  {
    id: 'ch2-app-architectures', number: '01', title: 'Building Network Applications', eyebrow: 'Programs at the edge', minutes: 13,
    summary: 'Place application software at end systems and compare the client-server and peer-to-peer ways those systems cooperate.',
    objectives: ['Explain why network applications run at the edge', 'Describe client and server roles', 'Compare client-server and peer-to-peer architectures'],
    sections: [
      { title: 'Applications live at end systems', body: 'Network applications include the Web, messaging, e-mail, games, streaming, file sharing, calling, conferencing, search, and remote login. Their programs run on different end systems and exchange data across the network. Developers do not need to install application code in network-core devices, which helps new applications develop and spread quickly.' },
      { title: 'Client-server organization', body: 'An always-on server with a stable address waits for clients to contact it and is often replicated in data centers to scale. Clients may connect intermittently and use changing addresses; in this model, clients do not communicate directly with one another. HTTP, IMAP, and FTP are examples.' },
      { title: 'Peer-to-peer organization', body: 'A peer-to-peer application has no always-on server at its center. End systems communicate directly, requesting service from peers while supplying service to others. New peers add demand but also add capacity, producing self-scalability. Intermittent connections and changing addresses make management harder; BitTorrent is a familiar example.' },
    ],
    keyTerms: ['network application', 'end system', 'client-server', 'client', 'server', 'peer-to-peer', 'self-scalability'], source: 'Chapter 2 slides 3-7',
  },
  {
    id: 'ch2-processes-sockets', number: '02', title: 'Processes, Sockets, and Protocols', eyebrow: 'Finding the right program', minutes: 14,
    summary: 'Follow a message from one process through a socket to a specifically addressed process on another host.',
    objectives: ['Distinguish client and server processes', 'Explain the socket abstraction', 'Identify a process with an IP address and port', 'List the defining parts of an application protocol'],
    sections: [
      { title: 'Communicating processes', body: 'A process is a program running in a host. Processes on one host use operating-system inter-process communication, while processes on different hosts exchange messages. The client process initiates an exchange and the server process waits to be contacted. Even peer-to-peer applications contain processes acting in these two roles.' },
      { title: 'The socket doorway', body: 'A process sends and receives messages through its socket. Application code controls the process and what it places into this doorway; the operating system controls the transport infrastructure beyond it. Communication therefore involves one socket at each endpoint.' },
      { title: 'Addresses and protocol rules', body: 'An IP address identifies a host but cannot select among the many processes running there, so an endpoint identifier also includes a port number. For example, conventional HTTP and mail servers use ports 80 and 25. An application-layer protocol defines message types, syntax, field semantics, and the rules for sending and responding. Open protocols are published in RFCs for interoperability, while proprietary protocols are privately controlled.' },
    ],
    keyTerms: ['process', 'client process', 'server process', 'socket', 'IP address', 'port number', 'application-layer protocol', 'RFC'], source: 'Chapter 2 slides 8-12',
  },
  {
    id: 'ch2-transport-services', number: '03', title: 'Choosing a Transport Service', eyebrow: 'Application requirements first', minutes: 15,
    summary: 'Match application needs for reliability, timing, throughput, and security to TCP, UDP, and TLS.',
    objectives: ['Classify common transport-service requirements', 'Compare TCP and UDP services', 'Explain what TLS adds to TCP'],
    sections: [
      { title: 'What the application needs', body: 'Transport requirements vary along four dimensions. File transfers, e-mail, Web documents, and text generally require complete data, while real-time audio, video, and games may tolerate some loss. Interactive media is delay-sensitive, multimedia may need minimum throughput, and elastic applications adapt to whatever throughput is available. Security needs include confidentiality, integrity, and authentication.' },
      { title: 'TCP and UDP', body: 'TCP provides connection-oriented, reliable process-to-process transport, flow control so a sender does not overwhelm its receiver, and congestion control when the network is overloaded. It does not itself promise timing, minimum throughput, or security. UDP has no connection setup and offers unreliable delivery without those controls or guarantees; its minimal service can suit applications that value low overhead or application-controlled behavior.' },
      { title: 'Securing a TCP exchange', body: 'Ordinary TCP and UDP sockets do not encrypt data, so cleartext placed into them remains cleartext in transit. Transport Layer Security is used by applications above TCP to provide encryption, data integrity, and endpoint authentication. Application code uses a TLS library, which in turn uses TCP.' },
    ],
    keyTerms: ['data integrity', 'timing', 'throughput', 'elastic application', 'TCP', 'UDP', 'flow control', 'congestion control', 'TLS'], source: 'Chapter 2 slides 13-17',
  },
  {
    id: 'ch2-http-connections', number: '04', title: 'Web Objects and HTTP Connections', eyebrow: 'Fetching a page', minutes: 18,
    summary: 'Decompose a Web page into objects and compare the cost of non-persistent and persistent HTTP over TCP.',
    objectives: ['Relate a base HTML file, referenced objects, and URLs', 'Describe HTTP client-server operation', 'Calculate non-persistent HTTP response time', 'Compare connection strategies'],
    sections: [
      { title: 'Objects addressed by URLs', body: 'A Web page consists of objects that may reside on different Web servers. A base HTML file refers to images, audio, or other objects, and each object has a URL containing a host name and path. HTTP is the application-layer protocol through which a browser requests objects and a Web server returns them.' },
      { title: 'HTTP over TCP', body: 'The client opens a TCP connection to the server, conventionally at port 80 for HTTP; the server accepts it, HTTP messages cross it, and the connection is eventually closed. HTTP is stateless because the server need not retain information about earlier client requests. Avoiding protocol state simplifies recovery after a client or server failure.' },
      { title: 'One connection or many', body: 'Non-persistent HTTP carries at most one object per TCP connection. Fetching a base file with ten referenced images therefore repeats the connection, request, response, and close sequence for every object. With an RTT defined as a small packet traveling to the server and back, one non-persistent object takes about two RTTs plus its transmission time: one RTT to establish TCP and one for the request and initial response.' },
      { title: 'Persistent HTTP', body: 'Persistent HTTP leaves the TCP connection open for multiple objects from the same server. This reduces per-connection operating-system work and avoids paying two RTTs for every object. In the deck\'s HTTP/1.1 model, requests can be issued as referenced objects are discovered, allowing all referenced objects to require as little as one additional RTT.' },
    ],
    keyTerms: ['Web object', 'URL', 'HTTP', 'stateless', 'non-persistent HTTP', 'persistent HTTP', 'RTT'], source: 'Chapter 2 slides 18-26',
  },
  {
    id: 'ch2-http-messages', number: '05', title: 'Reading HTTP Messages', eyebrow: 'Requests and responses', minutes: 14,
    summary: 'Interpret the lines and body of HTTP requests and responses, including methods and common status codes.',
    objectives: ['Identify request and response message parts', 'Compare GET, POST, HEAD, and PUT', 'Interpret common response status codes'],
    sections: [
      { title: 'Request structure', body: 'An HTTP request is presented in the deck as human-readable ASCII. Its request line gives a method, URL, and protocol version. Header lines contain named values, a blank CRLF line ends the header, and an optional entity body follows. Headers can describe the host, client software, acceptable formats and languages, encodings, and connection preference.' },
      { title: 'Methods carry intent', body: 'GET retrieves a resource and can place submitted data in the URL after a question mark. POST commonly sends form input in its entity body. HEAD asks only for the headers that a GET would return. PUT uploads an object or completely replaces the resource at the specified URL, with the replacement content in the PUT request entity body.' },
      { title: 'Response structure and status', body: 'A response starts with a protocol version, numeric status code, and phrase, followed by headers, a blank line, and possibly the requested data. Common outcomes include 200 OK for success, 301 Moved Permanently with a new Location, 400 Bad Request for an unintelligible request, 404 Not Found for a missing resource, and 505 HTTP Version Not Supported.' },
    ],
    keyTerms: ['request line', 'header', 'entity body', 'GET', 'POST', 'HEAD', 'PUT', 'status code'], source: 'Chapter 2 slides 27-31',
  },
  {
    id: 'ch2-cookies-state', number: '06', title: 'Cookies, State, and Privacy', eyebrow: 'Remembering a stateless client', minutes: 17,
    summary: 'Explain how cookies connect independent HTTP exchanges and why first- and third-party tracking creates privacy concerns.',
    objectives: ['Describe the four components of cookie-based state', 'Distinguish first-party from third-party cookies', 'Explain cross-site tracking', 'Relate identifying cookies to GDPR'],
    sections: [
      { title: 'State above stateless HTTP', body: 'Independent HTTP request-response pairs do not by themselves form a multi-step transaction. A site can add continuity with four pieces: a Set-Cookie header in a response, a Cookie header in later requests, browser-managed cookie storage, and a back-end database keyed by the cookie value. This supports authorization, shopping carts, recommendations, and user sessions.' },
      { title: 'From recognition to tracking', body: 'A first-party cookie comes from the site a user chose to visit and can associate activity on that site. A third-party resource embedded by multiple sites can receive its own persistent identifier and contextual request data, allowing the third party to correlate browsing across those sites. The tracking request may come from a visible ad or an invisible resource.' },
      { title: 'A dated browser claim', body: 'Slide 40 states that third-party cookie tracking was disabled by default in Firefox, Safari, and Chrome. Treat that as the deck\'s browser-specific snapshot, not a current universal rule: cookie defaults and tracking protections vary by browser, version, settings, and deployment.' },
      { title: 'Cookies as personal data', body: 'Cookies can reveal substantial behavior and may help identify or profile a person when combined with IP addresses or other identifiers. The deck connects this capability to the EU General Data Protection Regulation: identifying cookies can count as personal data, and users should have explicit control over whether they are allowed.' },
    ],
    keyTerms: ['cookie', 'Set-Cookie', 'session state', 'first-party cookie', 'third-party cookie', 'tracking cookie', 'GDPR', 'personal data'], source: 'Chapter 2 slides 32-41',
  },
  {
    id: 'ch2-caching-http-evolution', number: '07', title: 'Caching and Modern HTTP', eyebrow: 'Less traffic, less waiting', minutes: 21,
    summary: 'Calculate the value of a Web cache, validate cached objects, and trace HTTP framing from HTTP/1.1 through HTTP/3.',
    objectives: ['Explain a Web cache\'s dual role', 'Calculate cache-adjusted utilization and delay', 'Describe a conditional GET', 'Compare HTTP/1.1, HTTP/2, and HTTP/3 behavior'],
    sections: [
      { title: 'A cache between client and origin', body: 'A browser can send requests to a local Web cache. On a hit, the cache returns its stored object; on a miss, it acts as a client to the origin server, stores the response, and returns it. The cache is therefore a server to the browser and a client to the origin. Nearby hits reduce response time and traffic on the institution\'s access link, while response headers tell caches what storage is allowed.' },
      { title: 'Quantifying the benefit', body: 'The deck\'s example sends 1.50 Mbps through a 1.54 Mbps access link, producing utilization near 0.97 and severe queueing. With a 0.40 cache hit rate, only the 0.60 miss fraction crosses that link: 0.60 times 1.50 Mbps equals 0.90 Mbps, and utilization becomes 0.90/1.54, about 0.58. Weighting roughly 2.01 seconds for misses and milliseconds for hits gives an average near 1.2 seconds.' },
      { title: 'Validate instead of retransmit', body: 'A conditional GET lets a browser check whether its cached copy is current by sending If-Modified-Since. If unchanged, the server returns 304 Not Modified with no object body, saving bandwidth and transmission delay. If changed, it returns 200 OK and the new data.' },
      { title: 'Framing around head-of-line blocking', body: 'In the deck\'s account, HTTP/1.1 can pipeline requests over one TCP connection, but in-order responses can leave small objects behind a large one. HTTP/2 keeps familiar methods and status codes while dividing objects into frames that can be interleaved and prioritized, reducing application-level head-of-line blocking. Because HTTP/2 still uses one TCP connection, packet loss can stall all streams. HTTP/3 runs over UDP with integrated security and per-object error and congestion control to reduce that coupling.' },
    ],
    keyTerms: ['Web cache', 'proxy server', 'cache hit rate', 'access link utilization', 'conditional GET', '304 Not Modified', 'head-of-line blocking', 'HTTP/2', 'HTTP/3'], source: 'Chapter 2 slides 42-53',
  },
]

export const chapter2QuizQuestions: QuizQuestion[] = [
  { id: 'ch2-q1', prompt: 'Why can peer-to-peer applications be self-scalable?', choices: ['New peers add service capacity as well as demand', 'Every peer has a permanent IP address', 'A central server adds capacity for each peer', 'Peers never disconnect'], answer: 0, explanation: 'Each arriving peer consumes resources but can also provide resources to other peers, so aggregate service capacity grows with participation.' },
  { id: 'ch2-q2', prompt: 'What identifies a particular receiving process on an Internet host?', choices: ['A URL path alone', 'An IP address and port number', 'A protocol version and status code', 'A socket body and header'], answer: 1, explanation: 'The IP address selects the host and the port number selects the process on that host.' },
  { id: 'ch2-q3', prompt: 'Which service is supplied by TCP but not by UDP?', choices: ['A minimum throughput guarantee', 'Built-in encryption', 'Reliable data transfer', 'A maximum delay guarantee'], answer: 2, explanation: 'TCP supplies reliable transport, flow control, and congestion control. Neither protocol alone guarantees timing, throughput, or security.' },
  { id: 'ch2-q4', prompt: 'Ignoring transmission time, how many RTTs does non-persistent HTTP need for one object in the deck model?', choices: ['One half RTT', 'One RTT', 'Three RTTs', 'Two RTTs'], answer: 3, explanation: 'One RTT establishes TCP and a second carries the HTTP request and the beginning of the response, for 2 RTT plus transmission time.' },
  { id: 'ch2-q5', prompt: 'Where does PUT carry the content that completely replaces the resource at its URL?', choices: ['In the PUT request entity body', 'In the response status line', 'Only in the URL query string', 'In a later POST response'], answer: 0, explanation: 'The replacement representation belongs in the PUT request entity body.' },
  { id: 'ch2-q6', prompt: 'Which response indicates that a requested resource has a new permanent location?', choices: ['200 OK', '301 Moved Permanently', '400 Bad Request', '505 HTTP Version Not Supported'], answer: 1, explanation: 'A 301 response reports permanent movement and provides the new location in a Location header.' },
  { id: 'ch2-q7', prompt: 'Which set contains all four components used by the deck\'s cookie model?', choices: ['URL, TCP port, cache, and TLS key', 'GET method, status code, proxy, and IP address', 'Response header, later request header, browser cookie file, and site database', 'Browser history, DNS record, router table, and request body'], answer: 2, explanation: 'Cookie state links a response header, a later request header, browser-managed storage, and a back-end database entry.' },
  { id: 'ch2-q8', prompt: 'How should the deck\'s claim about default third-party-cookie blocking be interpreted?', choices: ['As a rule required by HTTP', 'As behavior shared by every browser forever', 'As proof that cross-site tracking is impossible', 'As a dated claim about named browsers, not a universal current fact'], answer: 3, explanation: 'Browser policies change and depend on product, version, configuration, and rollout, so the slide records a point-in-time claim.' },
  { id: 'ch2-q9', prompt: 'A site sends 1.50 Mbps toward browsers and a cache hit rate is 0.40. What rate crosses the access link toward origin servers?', choices: ['0.90 Mbps', '0.60 Mbps', '1.10 Mbps', '1.50 Mbps'], answer: 0, explanation: 'Only the 60 percent miss fraction crosses the access link: 0.60 times 1.50 Mbps equals 0.90 Mbps.' },
  { id: 'ch2-q10', prompt: 'How does HTTP/2 reduce application-level head-of-line blocking among objects?', choices: ['It opens a new origin server for every frame', 'It divides objects into frames that can be interleaved', 'It removes all loss recovery', 'It replaces every request with a conditional GET'], answer: 1, explanation: 'HTTP/2 frames and interleaves object data, allowing small objects to make progress rather than waiting for one large object to finish.' },
]

export const chapter2Glossary: Array<[string, string]> = [
  ['Application-layer protocol', 'Rules for message types, syntax, semantics, and the timing of exchanges between application processes.'],
  ['Cache hit rate', 'The fraction of requests a cache can satisfy from stored objects.'],
  ['Client process', 'The process that initiates communication with another process.'],
  ['Client-server architecture', 'An organization in which clients contact an always-on server rather than communicating directly with one another.'],
  ['Conditional GET', 'An HTTP request that asks the server to send an object only if the cached copy is no longer current.'],
  ['Cookie', 'A browser-managed identifier carried in HTTP headers to associate otherwise independent requests with stored site state.'],
  ['Entity body', 'The optional message area carrying content, such as POST form data or a representation uploaded by PUT.'],
  ['HTTP', 'The Web application-layer protocol for requesting and returning objects.'],
  ['HTTP/2', 'An HTTP version that frames and interleaves object data to reduce delay among concurrent transfers.'],
  ['HTTP/3', 'An HTTP version built over UDP-based transport with integrated security and less coupling between object streams.'],
  ['Non-persistent HTTP', 'HTTP operation in which a TCP connection carries at most one object.'],
  ['Peer-to-peer architecture', 'An organization in which intermittently connected end systems directly request and provide service.'],
  ['Persistent HTTP', 'HTTP operation that carries multiple objects between the same client and server over one TCP connection.'],
  ['Port number', 'A host-local number used with an IP address to identify a communicating process.'],
  ['Round-trip time', 'The time for a small packet to travel from client to server and back.'],
  ['Socket', 'The application process interface through which messages enter or leave transport services.'],
  ['Transport Layer Security', 'An application-used security layer over TCP providing encryption, integrity, and endpoint authentication.'],
  ['Web cache', 'An intermediary that serves stored objects and fetches misses from origin servers as a client.'],
]

export const chapter2ActivityIds = ['ch2-transport-match', 'ch2-http-exchange', 'ch2-cache-calculator'] as const
