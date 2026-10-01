type VisualProps = {
  lessonId: string
}

function FlowFigure({ title, description, steps }: { title: string; description: string; steps: Array<{ label: string; detail: string }> }) {
  return <figure className="lesson-visual" aria-labelledby={`${title.replaceAll(' ', '-').toLowerCase()}-caption`}>
    <div className="visual-flow" role="img" aria-label={description}>{steps.map((step, index) => <div className="visual-step" key={step.label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step.label}</strong><small>{step.detail}</small></div>)}</div>
    <figcaption id={`${title.replaceAll(' ', '-').toLowerCase()}-caption`}><strong>{title}</strong>{description}</figcaption>
  </figure>
}

export function LessonVisual({ lessonId }: VisualProps) {
  if (lessonId === 'internet-overview') return <FlowFigure title="One request, many networks" description="A browser request moves from an end system through access and provider networks to a server; the response returns to the browser." steps={[
    { label: 'Browser', detail: 'Creates a request' },
    { label: 'Access', detail: 'WiFi and home router' },
    { label: 'Internet core', detail: 'ISPs forward packets' },
    { label: 'Server', detail: 'Processes and responds' },
  ]}/>

  if (lessonId === 'physical-media') return <figure className="lesson-visual" aria-labelledby="delay-visual-caption">
    <div className="delay-visual" role="img" aria-label="Transmission delay places every packet bit onto a link, while propagation delay carries those bits across the physical distance.">
      <div><span>SENDER</span><i className="packet-bits">10110110</i></div><b>transmit: L / R</b><div className="link-distance"><i/><i/><i/><span>propagate: d / s</span></div><div><span>RECEIVER</span><i className="packet-bits muted">10110110</i></div>
    </div>
    <figcaption id="delay-visual-caption"><strong>Two different clocks</strong>Transmission measures serialization at the sender. Propagation measures travel across the medium.</figcaption>
  </figure>

  if (lessonId === 'network-core') return <FlowFigure title="A local decision at every router" description="Each router reads the packet header, uses its own forwarding table, and selects only the next output link." steps={[
    { label: 'Packet arrives', detail: 'Read destination field' },
    { label: 'Table lookup', detail: 'Find matching entry' },
    { label: 'Select output', detail: 'Choose the next hop' },
    { label: 'Transmit', detail: 'Repeat at next router' },
  ]}/>

  if (lessonId === 'ch2-processes-sockets') return <figure className="lesson-visual" aria-labelledby="socket-visual-caption">
    <div className="socket-visual" role="img" aria-label="A browser process uses a temporary client port to communicate through sockets with a web server process listening on a known server port.">
      <div className="visual-host"><span>CLIENT HOST</span><strong>Browser process</strong><i>socket : 51842</i></div><div className="visual-wire"><b>IP + PORT</b><span>request -&gt;</span><span>&lt;- response</span></div><div className="visual-host"><span>SERVER HOST</span><strong>Web process</strong><i>socket : 443</i></div>
    </div>
    <figcaption id="socket-visual-caption"><strong>Deliver to the right process</strong>The IP address locates the host; the port identifies a transport endpoint used by the application process.</figcaption>
  </figure>

  if (lessonId === 'ch2-udp-sockets') return <figure className="lesson-visual" aria-labelledby="udp-socket-visual-caption">
    <div className="socket-sequence" role="img" aria-label="A UDP server binds a datagram socket and waits in recvfrom. A client sends a datagram with the server address, the server receives both data and client address, and the server sends a reply to that client address.">
      <div className="socket-lane"><b>UDP SERVER</b><span>socket(SOCK_DGRAM)</span><span>bind(('', 12000))</span><span>recvfrom(2048)</span><span>sendto(reply, client)</span></div>
      <div className="socket-exchange"><span>datagram + server address &lt;-</span><span>-&gt; reply + client address</span></div>
      <div className="socket-lane"><b>UDP CLIENT</b><span>socket(SOCK_DGRAM)</span><span>sendto(data, server)</span><span>recvfrom(2048)</span><span>close()</span></div>
    </div>
    <figcaption id="udp-socket-visual-caption"><strong>Address every datagram</strong>There is no setup handshake in this exchange. The destination accompanies each send, and recvfrom reports who sent the datagram.</figcaption>
  </figure>

  if (lessonId === 'ch2-tcp-sockets') return <figure className="lesson-visual" aria-labelledby="tcp-socket-visual-caption">
    <div className="socket-sequence tcp-sequence" role="img" aria-label="A TCP server binds and listens on a welcoming socket. A client connects, accept returns a separate connection socket, and that connection socket exchanges bytes with the client before closing while the welcoming socket remains open.">
      <div className="socket-lane"><b>TCP SERVER</b><span>socket + bind</span><span className="socket-emphasis">listen: welcoming socket</span><span>accept()</span><span className="socket-emphasis">connection socket</span><span>recv / sendall / close</span></div>
      <div className="socket-exchange"><span>TCP connection setup &lt;-</span><span>&lt;- request bytes</span><span>-&gt; reply bytes</span></div>
      <div className="socket-lane"><b>TCP CLIENT</b><span>socket(SOCK_STREAM)</span><span>connect(server)</span><span>sendall(request)</span><span>recv(1024)</span><span>close()</span></div>
    </div>
    <figcaption id="tcp-socket-visual-caption"><strong>Keep the two server sockets separate</strong>The welcoming socket accepts clients. Each returned connection socket carries one client byte stream.</figcaption>
  </figure>

  if (lessonId === 'ch2-http-messages') return <figure className="lesson-visual" aria-labelledby="http-visual-caption">
    <div className="message-visual" role="img" aria-label="An HTTP request contains a request line, header fields, a required blank line, and an optional message body.">
      <code><b>GET /notes.html HTTP/1.1</b><span>Request line</span>{'\n'}<b>Host: example.edu</b><span>Header</span>{'\n'}<b>Accept: text/html</b><span>Header</span>{'\n'}<em>[blank line]</em><span>Ends headers</span></code>
    </div>
    <figcaption id="http-visual-caption"><strong>Read from top to bottom</strong>The blank line is part of HTTP/1.x framing, even when the request has no body.</figcaption>
  </figure>

  if (lessonId === 'ch2-email-smtp') return <FlowFigure title="From outbox to inbox" description="The sender submits mail, SMTP transfers it between mail servers, and the recipient later accesses the stored message with IMAP or HTTP." steps={[
    { label: 'Alice user agent', detail: 'Compose and submit' },
    { label: 'Sending server', detail: 'Queue; SMTP client' },
    { label: 'Receiving server', detail: 'SMTP server; mailbox' },
    { label: 'Bob user agent', detail: 'IMAP or Web access' },
  ]}/>

  if (lessonId === 'ch2-ftp-connections') return <figure className="lesson-visual" aria-labelledby="ftp-visual-caption">
    <div className="dual-channel" role="img" aria-label="FTP keeps commands and replies on a persistent TCP control connection while each listing or file uses a separate data connection.">
      <div><span>TCP CONTROL / SERVER PORT 21</span><b>USER - PASS - LIST - RETR - STOR</b></div><div><span>TCP DATA / ACTIVE MODEL PORT 20</span><b>directory listing or file bytes</b></div>
    </div>
    <figcaption id="ftp-visual-caption"><strong>Two connections, two jobs</strong>The control session can stay open while temporary data connections open and close for individual transfers.</figcaption>
  </figure>

  if (lessonId === 'ch2-dns-resolution') return <FlowFigure title="Follow an iterative DNS lookup" description="A local resolver follows referrals from the root to the top-level domain and then to the authoritative server before returning an answer." steps={[
    { label: 'Local resolver', detail: 'Checks its cache first' },
    { label: 'Root', detail: 'Refers to the TLD' },
    { label: 'TLD server', detail: 'Refers to authority' },
    { label: 'Authoritative', detail: 'Returns the record' },
  ]}/>

  if (lessonId === 'ch2-dns-records-security') return <figure className="lesson-visual" aria-labelledby="dns-record-visual-caption">
    <div className="record-grid" role="img" aria-label="DNS A, NS, CNAME, and MX records assign different meanings to their name and value fields.">
      <div><b>A</b><span>host</span><i>IPv4 address</i></div><div><b>NS</b><span>domain</span><i>authoritative server</i></div><div><b>CNAME</b><span>alias</span><i>canonical name</i></div><div><b>MX</b><span>domain</span><i>mail server</i></div>
    </div>
    <figcaption id="dns-record-visual-caption"><strong>Type gives the value meaning</strong>Every resource record also carries a TTL that limits how long cached copies may be reused.</figcaption>
  </figure>

  if (lessonId === 'ch2-p2p-distribution') return <figure className="lesson-visual" aria-labelledby="p2p-scale-visual-caption">
    <div className="p2p-scale-visual" role="img" aria-label="The client-server lower bound is the maximum of N F divided by server upload and F divided by minimum download. The peer-to-peer lower bound is the maximum of F divided by server upload, F divided by minimum download, and N F divided by server upload plus the sum of peer uploads.">
      <article><span>CLIENT-SERVER</span><strong>max(NF/u<sub>s</sub>, F/d<sub>min</sub>)</strong><div><i/><i/><i/><i/></div><small>One server emits every copy</small></article>
      <b>versus</b>
      <article><span>PEER-TO-PEER</span><strong>max(F/u<sub>s</sub>, F/d<sub>min</sub>, NF/(u<sub>s</sub> + sum u<sub>i</sub>))</strong><div className="peer-capacity"><i/><i/><i/><i/></div><small>Each peer can add upload capacity</small></article>
    </div>
    <figcaption id="p2p-scale-visual-caption"><strong>Demand grows in both models; service capacity can grow in P2P</strong>The largest unavoidable time term sets the ideal lower bound.</figcaption>
  </figure>

  if (lessonId === 'ch2-bittorrent-swarm') return <figure className="lesson-visual" aria-labelledby="swarm-visual-caption">
    <div className="swarm-visual" role="img" aria-label="A tracker returns peer discovery information to new peer NEW. File pieces travel directly among selected peer neighbors A, B, C, D, and NEW rather than through the tracker.">
      <div className="tracker-node"><span>TRACKER</span><small>peer discovery</small></div>
      <div className="swarm-peers"><i>A</i><i>B</i><i className="new-peer">NEW</i><i>C</i><i>D</i></div>
      <div className="swarm-legend"><span>--- coordination</span><b>piece exchange between neighbors</b></div>
    </div>
    <figcaption id="swarm-visual-caption"><strong>Coordination and content take different paths</strong>The tracker helps peers find one another; it does not carry every file piece.</figcaption>
  </figure>

  if (lessonId === 'ch3-transport-services') return <figure className="lesson-visual" aria-labelledby="ch3-transport-caption">
    <div className="ch3-delivery" role="img" aria-label="IP provides host-to-host delivery between a laptop and server, while transport extends delivery upward to the correct browser and web-server processes.">
      <div className="ch3-host"><span>LAPTOP HOST</span><div><b>Browser process</b><small>socket : 51000</small></div><i>TRANSPORT</i></div>
      <div className="ch3-network"><b>process to process</b><span>transport segment</span><i>IP: host to host</i></div>
      <div className="ch3-host"><span>SERVER HOST</span><div><b>Web process</b><small>socket : 443</small></div><i>TRANSPORT</i></div>
    </div>
    <figcaption id="ch3-transport-caption"><strong>One delivery builds on another</strong>IP reaches the destination host. Transport uses endpoint information to reach the intended process inside that host.</figcaption>
  </figure>

  if (lessonId === 'ch3-multiplexing') return <figure className="lesson-visual" aria-labelledby="ch3-multiplexing-caption">
    <div className="ch3-mux" role="img" aria-label="Sender transport multiplexing accepts messages from browser, chat, and game sockets, adds a distinct source and destination port header to each, and passes the labeled segments to IP.">
      <div className="ch3-sockets"><span><b>Browser</b><small>socket 51000</small></span><span><b>Chat</b><small>socket 52000</small></span><span><b>Game</b><small>socket 53000</small></span></div>
      <div className="ch3-funnel"><span>many sockets</span><b>MULTIPLEX</b><small>add src + dst ports</small></div>
      <div className="ch3-segments"><span><b>51000 | 443</b>web data</span><span><b>52000 | 5222</b>chat data</span><span><b>53000 | 9000</b>game data</span><i>to IP</i></div>
    </div>
    <figcaption id="ch3-multiplexing-caption"><strong>Share transport without mixing conversations</strong>The sender labels data from each socket before all of the resulting segments enter the network layer.</figcaption>
  </figure>

  if (lessonId === 'ch3-demultiplexing') return <figure className="lesson-visual" aria-labelledby="ch3-demultiplexing-caption">
    <div className="ch3-demux" role="img" aria-label="UDP datagrams from different source addresses and ports select the same socket when destination port 6428 matches; TCP instead selects separate connection sockets using source IP, source port, destination IP, and destination port.">
      <article><span>UDP / CONNECTIONLESS</span><div className="ch3-arrivals"><small>A : 9157</small><small>C : 5775</small></div><b>destination port 6428</b><i>one socket : 6428</i></article>
      <article><span>TCP / CONNECTION-ORIENTED</span><div className="ch3-tuple"><small>source IP</small><small>source port</small><small>destination IP</small><small>destination port</small></div><b>four-tuple lookup</b><i>separate connection sockets</i></article>
    </div>
    <figcaption id="ch3-demultiplexing-caption"><strong>The lookup rule depends on the protocol</strong>UDP uses the local destination port in this model. TCP can distinguish clients that share one server port by using all four endpoint values.</figcaption>
  </figure>

  if (lessonId === 'ch3-udp-segment') return <figure className="lesson-visual" aria-labelledby="ch3-udp-caption">
    <div className="ch3-udp-header" role="img" aria-label="A UDP segment begins with four 16-bit header fields arranged in two rows: source port, destination port, length, and checksum. Application data follows, and length counts the header plus data in bytes.">
      <div className="ch3-bit-scale"><span>0</span><span>16</span><span>32 bits</span></div>
      <div className="ch3-header-fields"><b>Source port<small>16 bits</small></b><b>Destination port<small>16 bits</small></b><b>Length<small>header + data</small></b><b>Checksum<small>error detection</small></b><strong>Application data / payload</strong></div>
    </div>
    <figcaption id="ch3-udp-caption"><strong>A small, four-field header</strong>Ports support process delivery, length frames the complete UDP segment, and the checksum detects many bit errors.</figcaption>
  </figure>

  if (lessonId === 'ch3-checksum') return <figure className="lesson-visual" aria-labelledby="ch3-checksum-caption">
    <div className="ch3-checksum" role="img" aria-label="One's-complement checksum example: adding binary words 1110011001100110 and 1101010101010101 produces a carry and low 16 bits; wrapping the carry to the low end gives 1011101110111100, whose bitwise complement is checksum 0100010001000011.">
      <div className="ch3-binary-sum"><span>1110011001100110</span><span>+ 1101010101010101</span><b>1 | 1011101110111011</b></div>
      <div className="ch3-carry"><span>carry 1 wraps to the low end</span><b>1011101110111011 + 1</b></div>
      <div className="ch3-complement"><span>wrapped sum</span><b>1011101110111100</b><span>flip every bit</span><strong>0100010001000011</strong></div>
    </div>
    <figcaption id="ch3-checksum-caption"><strong>Keep the carry, then complement</strong>One's-complement addition uses end-around carry. A matching receiver result means no error was detected, not that every bit is guaranteed correct.</figcaption>
  </figure>

  if (lessonId === 'ch3-rdt-foundations') return <figure className="lesson-visual" aria-labelledby="ch3-rdt-foundations-caption">
    <div className="ch3-rdt-foundations" role="img" aria-label="Applications see a reliable data-transfer service between processes, implemented by sender and receiver rdt endpoints over an unreliable channel. The interfaces are rdt_send, udt_send, rdt_rcv, and deliver_data; an FSM transition reads event slash action between states.">
      <div className="ch3-rdt-stack"><span>Sending process</span><b>rdt_send(data) ↓</b><strong>sender rdt</strong><b>udt_send(packet) ↓</b></div>
      <div className="ch3-unreliable"><span>RELIABLE ABSTRACTION</span><b>unreliable channel</b><small>may corrupt or lose</small></div>
      <div className="ch3-rdt-stack"><span>Receiving process</span><b>↑ deliver_data(data)</b><strong>receiver rdt</strong><b>↑ rdt_rcv(packet)</b></div>
      <div className="ch3-fsm-key"><i>WAIT</i><span>packet arrives / check and deliver</span><i>NEXT</i><small>state</small><small>event / action</small><small>state</small></div>
    </div>
    <figcaption id="ch3-rdt-foundations-caption"><strong>Reliable above, potentially unreliable below</strong>The interfaces mark layer boundaries. An FSM records state and labels each transition with the event that triggers it and the action performed.</figcaption>
  </figure>

  if (lessonId === 'ch3-rdt2') return <figure className="lesson-visual" aria-labelledby="ch3-rdt2-caption">
    <div className="ch3-rdt-trace" role="img" aria-label="rdt2.0 sender saves and sends one checksummed packet, then waits. The receiver detects corruption and returns NAK, so the sender retransmits; a correct copy is delivered and ACK lets the sender continue. A corrupted ACK or NAK remains ambiguous.">
      <div className="ch3-trace-label"><b>SENDER</b><b>RECEIVER</b></div>
      <div className="ch3-trace-row"><span>save packet; send</span><i>data + checksum →</i><span>corrupt: do not deliver</span></div>
      <div className="ch3-trace-row reverse"><span>wait; keep packet</span><i>← NAK</i><span>report error</span></div>
      <div className="ch3-trace-row"><span>retransmit saved packet</span><i>same data →</i><span>valid: deliver once</span></div>
      <div className="ch3-trace-row reverse"><span>accept next data</span><i>← ACK</i><span>confirm success</span></div>
      <strong className="ch3-warning">Corrupt feedback? rdt2.0 cannot tell what happened.</strong>
    </div>
    <figcaption id="ch3-rdt2-caption"><strong>Detect, report, retransmit</strong>Checksum classifies the data packet, ACK or NAK returns receiver state, and stop-and-wait keeps the current packet available for recovery.</figcaption>
  </figure>

  if (lessonId === 'ch3-alternating-bit') return <figure className="lesson-visual" aria-labelledby="ch3-alternating-caption">
    <div className="ch3-alternating" role="img" aria-label="The receiver accepts packet 0, delivers its data once, and expects packet 1. When ACK0 is corrupted, the sender retransmits packet 0; the receiver recognizes sequence 0 as a duplicate, suppresses delivery, and repeats ACK0.">
      <div><span>1</span><b>packet 0</b><small>accept + deliver</small></div><i>ACK0 corrupted</i><div className="ch3-expect"><span>2</span><b>expect 1</b><small>remember next bit</small></div><i>packet 0 repeats</i><div className="ch3-duplicate"><span>3</span><b>duplicate 0</b><small>do not redeliver; ACK0</small></div>
    </div>
    <figcaption id="ch3-alternating-caption"><strong>Identity makes retransmission safe</strong>With only one unacknowledged packet, alternating sequence numbers 0 and 1 are enough to distinguish new data from the previous packet.</figcaption>
  </figure>

  if (lessonId === 'ch3-rdt3') return <figure className="lesson-visual" aria-labelledby="ch3-rdt3-caption">
    <div className="ch3-rdt3" role="img" aria-label="rdt3.0 ACK-loss trace: sender sends packet 0 and starts a timer; receiver delivers packet 0 but ACK0 is lost; sender times out and retransmits packet 0; receiver suppresses the duplicate and sends ACK0 again; sender receives it and stops the timer.">
      <div className="ch3-lifeline"><b>SENDER</b><i/><span>send pkt 0<br/>start timer</span><span className="ch3-timeout">TIMEOUT<br/>resend pkt 0</span><span>receive ACK0<br/>stop timer</span></div>
      <div className="ch3-rdt3-events"><span>pkt 0 →</span><b>ACK0 × LOST</b><span>pkt 0 →</span><span>← ACK0</span></div>
      <div className="ch3-lifeline receiver"><b>RECEIVER</b><i/><span>deliver data once<br/>send ACK0</span><span className="ch3-duplicate-event">duplicate 0<br/>do not deliver<br/>send ACK0</span></div>
    </div>
    <figcaption id="ch3-rdt3-caption"><strong>A timer turns silence into an event</strong>The sender uses the same timeout response whether data or feedback was lost. Sequence numbers keep the resulting retransmission from causing duplicate delivery.</figcaption>
  </figure>

  if (lessonId === 'ch3-stop-wait') return <figure className="lesson-visual" aria-labelledby="ch3-stop-wait-caption">
    <div className="ch3-performance" role="img" aria-label="Stop-and-wait sends one short packet and leaves the link idle for nearly a round trip before the next packet. Pipelining keeps multiple packets in flight, filling more of the same timeline and increasing sender utilization.">
      <article><span>STOP-AND-WAIT</span><div className="ch3-timebar"><i/><em/><em/><em/><em/></div><b>send L/R</b><small>wait roughly one RTT</small><strong>one packet in flight</strong></article>
      <article><span>PIPELINED IDEA</span><div className="ch3-timebar pipeline"><i/><i/><i/><i/><em/></div><b>send continuously</b><small>ACKs return later</small><strong>multiple packets in flight</strong></article>
      <div className="ch3-utilization"><b>U<sub>sender</sub> = (L/R) / (RTT + L/R)</b><span>More yellow time means a busier sender.</span></div>
    </div>
    <figcaption id="ch3-stop-wait-caption"><strong>Reliability can leave capacity idle</strong>A fast link does not help if the sender waits after every packet. Pipelining improves utilization by permitting several unacknowledged packets.</figcaption>
  </figure>

  return null
}
