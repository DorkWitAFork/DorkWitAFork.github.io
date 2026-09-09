export function NetworkDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <svg className={compact ? 'network-diagram compact' : 'network-diagram'} viewBox="0 0 620 340" role="img" aria-label="A packet traveling from a laptop through access, regional, and core networks to a server">
      <defs>
        <linearGradient id="lineGlow" x1="0" x2="1"><stop stopColor="#efbd21"/><stop offset="1" stopColor="#ffdf74"/></linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path className="diagram-path-muted" d="M72 210 C145 210 138 102 218 102 S300 255 370 210 S445 88 548 115"/>
      <path className="diagram-path" d="M72 210 C145 210 138 102 218 102 S300 255 370 210 S445 88 548 115"/>
      <g className="diagram-node endpoint" transform="translate(38 179)"><rect width="68" height="49" rx="5"/><path d="M12 10h44v25H12zM5 42h58"/><text x="34" y="70">HOST</text></g>
      <g className="diagram-node" transform="translate(188 72)"><circle cx="30" cy="30" r="30"/><path d="m13 30 17-10 17 10-17 10-17-10ZM30 20v20"/><text x="30" y="75">ACCESS</text></g>
      <g className="diagram-node" transform="translate(340 180)"><circle cx="30" cy="30" r="30"/><path d="m13 30 17-10 17 10-17 10-17-10ZM30 20v20"/><text x="30" y="75">REGIONAL</text></g>
      <g className="diagram-node core" transform="translate(440 68)"><circle cx="27" cy="27" r="27"/><path d="M14 27h26M27 14v26"/><text x="27" y="69">CORE</text></g>
      <g className="diagram-node endpoint" transform="translate(518 82)"><rect width="61" height="66" rx="5"/><path d="M10 13h41M10 25h41M10 37h41M10 49h41"/><circle cx="17" cy="56" r="2"/><text x="30" y="87">SERVER</text></g>
      <g className="packet"><rect width="19" height="13" rx="2"/><path d="M5 4h9M5 8h6"/></g>
    </svg>
  )
}
