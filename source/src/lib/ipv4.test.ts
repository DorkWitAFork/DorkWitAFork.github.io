import { describe, expect, it } from 'vitest'
import { cidrBlock, longestPrefix, parseIpv4 } from './ipv4'

describe('IPv4 CIDR calculations', () => {
  it('validates dotted-decimal octets rather than accepting partial or malformed addresses', () => {
    expect(parseIpv4('223.1.1.1')).toBe(0xdf010101)
    for (const address of ['256.1.1.1', '01.2.3.4', '1.2.3', '1.2.3.4.5', '1.2.3.-1', '1.2.3.x']) expect(parseIpv4(address)).toBeNull()
  })

  it('finds subnet boundaries at /0, /23, /24, and /32', () => {
    expect(cidrBlock('200.23.17.42', 23)).toMatchObject({ network: '200.23.16.0', last: '200.23.17.255', size: 512 })
    expect(cidrBlock('223.1.2.9', 24)).toMatchObject({ network: '223.1.2.0', last: '223.1.2.255', size: 256 })
    expect(cidrBlock('10.1.2.3', 0)).toMatchObject({ network: '0.0.0.0', last: '255.255.255.255', size: 2 ** 32 })
    expect(cidrBlock('10.1.2.3', 32)).toMatchObject({ network: '10.1.2.3', last: '10.1.2.3', size: 1 })
    expect(cidrBlock('10.1.2.3', 33)).toBeNull()
  })

  it('selects the more-specific route and falls back to a broader match', () => {
    const routes = [{ block: '200.23.16.0', prefix: 20, output: 'A' }, { block: '200.23.18.0', prefix: 23, output: 'B' }]
    expect(longestPrefix('200.23.18.42', routes)?.output).toBe('B')
    expect(longestPrefix('200.23.17.255', routes)?.output).toBe('A')
    expect(longestPrefix('200.23.32.0', routes)).toBeNull()
    expect(longestPrefix('bad', routes)).toBeNull()
  })
})
