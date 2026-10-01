/** Returns the Internet checksum for a sequence of unsigned 16-bit words. */
export function calculateOnesComplementChecksum(words: readonly number[]): number {
  if (!Array.isArray(words)) throw new TypeError('Checksum words must be an array')

  let sum = 0
  for (const word of words) {
    if (!Number.isInteger(word) || word < 0 || word > 0xffff) {
      throw new RangeError('Each checksum word must be an integer from 0x0000 through 0xffff')
    }
    sum += word
    sum = (sum & 0xffff) + Math.floor(sum / 0x10000)
  }

  return (~sum) & 0xffff
}

/**
 * Calculates ideal stop-and-wait sender utilization as
 * (L / R) / (RTT + L / R).
 */
export function calculateStopAndWaitUtilization(
  packetLengthBits: number,
  transmissionRateBitsPerSecond: number,
  roundTripTimeSeconds: number,
): number {
  if (!Number.isFinite(packetLengthBits) || packetLengthBits <= 0) {
    throw new RangeError('Packet length must be a positive finite number')
  }
  if (!Number.isFinite(transmissionRateBitsPerSecond) || transmissionRateBitsPerSecond <= 0) {
    throw new RangeError('Transmission rate must be a positive finite number')
  }
  if (!Number.isFinite(roundTripTimeSeconds) || roundTripTimeSeconds < 0) {
    throw new RangeError('RTT must be a non-negative finite number')
  }

  const transmissionTimeSeconds = packetLengthBits / transmissionRateBitsPerSecond
  const utilization = transmissionTimeSeconds / (roundTripTimeSeconds + transmissionTimeSeconds)
  if (!Number.isFinite(utilization)) throw new RangeError('Inputs produce a non-finite utilization')
  return utilization
}
