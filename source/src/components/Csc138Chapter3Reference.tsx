export function Csc138Chapter3Reference() {
  return <>
    <section className="reference-grid">
      <article><span className="section-label-text">STOP-AND-WAIT UTILIZATION</span><div className="reference-equation">(L/R) / (RTT + L/R)</div><p><strong>L/R</strong> is the packet transmission time. Keep it in the same time unit as RTT before calculating the fraction or percentage.</p></article>
      <article><span className="section-label-text">UDP HEADER</span><div className="unit-list"><span><b>Source port</b>16 bits</span><span><b>Destination port</b>16 bits</span><span><b>Length</b>header + payload bytes</span><span><b>Checksum</b>error detection</span></div></article>
    </section>
    <section className="protocol-reference numeric-reference">
      <article><span>UDP LENGTH EXAMPLES</span><p><b>4-byte payload</b> → 12-byte segment · <b>20-byte payload</b> → 28-byte segment · <b>1,000-byte payload</b> → 1,008-byte segment</p></article>
      <article><span>CANONICAL CHECKSUM</span><p><b>0xE666 + 0xD555</b> → raw 0x1BBBB → wrap to 0xBBBC → complement to <b>0x4443</b></p></article>
      <article><span>LECTURE STOP-AND-WAIT</span><p><b>8,000 bits / 1 Gbps</b> = 8 microseconds · 15 ms one-way → RTT ≈ 30 ms · utilization ≈ <b>0.027%</b></p></article>
      <article><span>THROUGHPUT INTERPRETATION</span><p><b>1 Gbps × 0.0002666</b> ≈ 266,600 bits/s, or approximately 266 kbps in the simplified model.</p></article>
    </section>
    <section className="protocol-reference">
      <article><span>DEMULTIPLEXING</span><p><b>UDP</b> uses the destination port to select the receiving socket in the deck model. <b>Connection-oriented</b> delivery uses source IP, source port, destination IP, and destination port.</p></article>
      <article><span>CHECKSUM PROCEDURE</span><p>Split protected data into 16-bit words, add with end-around carry, then complement every bit. A match means <b>no error was detected</b>, not that correctness is guaranteed.</p></article>
      <article><span>RDT INTERFACES</span><p><b>rdt_send</b> receives data from above · <b>udt_send</b> sends through the unreliable channel · <b>rdt_rcv</b> reports arrival · <b>deliver_data</b> passes accepted data upward</p></article>
      <article><span>RDT PROGRESSION</span><p><b>1.0</b> reliable channel · <b>2.0</b> checksum, ACK, NAK · <b>2.1</b> sequence numbers · <b>2.2</b> numbered ACKs without NAK · <b>3.0</b> timer and timeout</p></article>
      <article><span>DUPLICATE SAFETY</span><p>Sequence numbers 0 and 1 distinguish the expected packet from a retransmission in stop-and-wait. A duplicate is acknowledged as needed but never delivered upward twice.</p></article>
      <article><span>PIPELINING MOTIVATION</span><p>Stop-and-wait leaves the sender idle during most of a long RTT. Pipelining permits multiple unacknowledged packets in flight and therefore needs more sequence numbers and buffering.</p></article>
    </section>
  </>
}
