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

  return null
}
