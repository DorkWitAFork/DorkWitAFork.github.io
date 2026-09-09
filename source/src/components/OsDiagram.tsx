export function OsDiagram({ compact = false }: { compact?: boolean }) {
  return <svg className={`os-diagram ${compact ? 'compact' : ''}`} viewBox="0 0 620 340" role="img" aria-label="Applications use system calls to cross from user mode into the operating system kernel, which manages hardware">
    <defs><linearGradient id="osGlow" x1="0" x2="1"><stop stopColor="#ff8a4c"/><stop offset="1" stopColor="#f4c95d"/></linearGradient></defs>
    <rect className="os-layer os-user-layer" x="70" y="35" width="480" height="76" rx="5"/>
    <text className="os-layer-label" x="95" y="62">USER MODE</text>
    <g className="os-apps"><rect x="100" y="76" width="94" height="20"/><rect x="214" y="76" width="94" height="20"/><rect x="328" y="76" width="94" height="20"/><rect x="442" y="76" width="78" height="20"/></g>
    <path className="os-call-path" d="M310 112v45"/><path className="os-call-arrow" d="m303 148 7 10 7-10"/><text className="os-call-label" x="327" y="140">SYSTEM CALL</text>
    <rect className="os-layer os-kernel-layer" x="70" y="160" width="480" height="90" rx="5"/>
    <text className="os-layer-label kernel-label" x="95" y="188">KERNEL MODE</text>
    <g className="os-services"><rect x="101" y="204" width="90" height="25"/><rect x="211" y="204" width="90" height="25"/><rect x="321" y="204" width="90" height="25"/><rect x="431" y="204" width="89" height="25"/></g>
    <g className="os-service-labels"><text x="146" y="221">PROCESS</text><text x="256" y="221">MEMORY</text><text x="366" y="221">FILES</text><text x="476" y="221">I/O</text></g>
    <path className="os-bus" d="M115 270h390M145 250v55M255 250v55M365 250v55M475 250v55"/>
    <g className="os-hardware"><rect x="108" y="305" width="74" height="23"/><rect x="218" y="305" width="74" height="23"/><rect x="328" y="305" width="74" height="23"/><rect x="438" y="305" width="74" height="23"/></g>
    <g className="os-hardware-labels"><text x="145" y="321">CPU</text><text x="255" y="321">RAM</text><text x="365" y="321">DISK</text><text x="475" y="321">DEVICE</text></g>
  </svg>
}
