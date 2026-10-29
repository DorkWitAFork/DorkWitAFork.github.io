import type { ReactNode } from 'react'

const mathToken = /(2\^\([0-9m]+\s*[−-]\s*[0-9]+\)|2\^[0-9mk]+|10\^9|N\^2|D_CS|D_P2P|U_sender|[ud]_(?:min|[si])|ACK[01])/g

function renderToken(token: string): ReactNode {
  if (token.includes('^')) {
    const [base, exponent] = token.split('^')
    return <>{base}<sup>{exponent.replaceAll('-', '−')}</sup></>
  }
  if (token.startsWith('ACK')) return <>ACK<sub>{token.slice(3)}</sub></>
  const [base, subscript] = token.split('_')
  return <><i>{base}</i><sub>{subscript}</sub></>
}

export function MathText({ children }: { children: string }) {
  const parts = children.split(mathToken)
  let tokenIndex = 0
  return <span className="math-text">{parts.map((part, index) => {
    if (index % 2 === 0) return <span key={`${part}-${index}`}>{part}</span>
    const token = children.match(mathToken)?.[tokenIndex++] ?? part
    return <span className="math-token" key={`${token}-${index}`}>{renderToken(token)}</span>
  })}</span>
}
