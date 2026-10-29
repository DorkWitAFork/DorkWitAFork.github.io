export function parseIpv4(value: string): number | null {
  const parts = value.trim().split('.')
  if (parts.length !== 4 || parts.some(part => !/^(0|[1-9]\d{0,2})$/.test(part) || Number(part) > 255)) return null
  return parts.reduce((address, part) => ((address << 8) | Number(part)) >>> 0, 0)
}

export function formatIpv4(address: number): string {
  return [24, 16, 8, 0].map(shift => (address >>> shift) & 255).join('.')
}

export function cidrBlock(address: string, length: number) {
  const ip = parseIpv4(address)
  if (ip === null || !Number.isInteger(length) || length < 0 || length > 32) return null
  const mask = length === 0 ? 0 : (0xffffffff << (32 - length)) >>> 0
  const network = (ip & mask) >>> 0
  return { network: formatIpv4(network), last: formatIpv4((network | (~mask >>> 0)) >>> 0), size: 2 ** (32 - length), prefix: length, mask }
}

export function longestPrefix(address: string, routes: readonly { block: string; prefix: number; output: string }[]) {
  const destination = parseIpv4(address)
  if (destination === null) return null
  return routes.filter(route => {
    const block = cidrBlock(route.block, route.prefix)
    return block !== null && (destination & block.mask) >>> 0 === parseIpv4(block.network)
  }).sort((a, b) => b.prefix - a.prefix)[0] ?? null
}
