import type { ReactNode } from 'react'

const mathToken = /(2\^\(m - 1\)|2\^m|10\^9|N\^2|D_CS|D_P2P|U_sender|[ud]_(?:min|[si])|ACK[01])/g

function renderToken(token: string): ReactNode {
  if (token === '2^m') return <>2<sup>m</sup></>
  if (token === '2^(m - 1)') return <>2<sup>(m - 1)</sup></>
  if (token === '10^9') return <>10<sup>9</sup></>
  if (token === 'N^2') return <>N<sup>2</sup></>
  if (token.startsWith('ACK')) return <>ACK<sub>{token.slice(3)}</sub></>
  const [base, subscript] = token.split('_')
  return <><i>{base}</i><sub>{subscript}</sub></>
}

export function MathText({ children }: { children: string }) {
  const parts = children.split(mathToken)
  let tokenIndex = 0
  return <>{parts.map((part, index) => {
    if (index % 2 === 0) return <span key={`${part}-${index}`}>{part}</span>
    const token = children.match(mathToken)?.[tokenIndex++] ?? part
    return <span className="math-token" key={`${token}-${index}`}>{renderToken(token)}</span>
  })}</>
}
