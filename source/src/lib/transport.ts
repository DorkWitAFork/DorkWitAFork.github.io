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

/** Returns the total UDP segment length in bytes, including its 8-byte header. */
export function calculateUdpLength(payloadBytes: number): number {
  if (!Number.isInteger(payloadBytes) || payloadBytes < 0) {
    throw new RangeError('UDP payload length must be a non-negative integer')
  }
  return payloadBytes + 8
}

/** Converts packet length and link rate into transmission time in seconds. */
export function calculateTransmissionTimeSeconds(packetLengthBits: number, transmissionRateBitsPerSecond: number): number {
  if (!Number.isFinite(packetLengthBits) || packetLengthBits <= 0) {
    throw new RangeError('Packet length must be a positive finite number')
  }
  if (!Number.isFinite(transmissionRateBitsPerSecond) || transmissionRateBitsPerSecond <= 0) {
    throw new RangeError('Transmission rate must be a positive finite number')
  }
  const transmissionTime = packetLengthBits / transmissionRateBitsPerSecond
  if (!Number.isFinite(transmissionTime)) throw new RangeError('Inputs produce a non-finite transmission time')
  return transmissionTime
}

/** Doubles one-way propagation delay to produce the simplified RTT model. */
export function calculateRoundTripTimeSeconds(oneWayDelaySeconds: number): number {
  if (!Number.isFinite(oneWayDelaySeconds) || oneWayDelaySeconds < 0) {
    throw new RangeError('One-way delay must be a non-negative finite number')
  }
  return oneWayDelaySeconds * 2
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
  if (!Number.isFinite(roundTripTimeSeconds) || roundTripTimeSeconds < 0) {
    throw new RangeError('RTT must be a non-negative finite number')
  }

  const transmissionTimeSeconds = calculateTransmissionTimeSeconds(packetLengthBits, transmissionRateBitsPerSecond)
  const utilization = transmissionTimeSeconds / (roundTripTimeSeconds + transmissionTimeSeconds)
  if (!Number.isFinite(utilization)) throw new RangeError('Inputs produce a non-finite utilization')
  return utilization
}

/** Converts a link rate and utilization fraction into useful bits per second. */
export function calculateStopAndWaitThroughputBps(transmissionRateBitsPerSecond: number, utilization: number): number {
  if (!Number.isFinite(transmissionRateBitsPerSecond) || transmissionRateBitsPerSecond <= 0) {
    throw new RangeError('Transmission rate must be a positive finite number')
  }
  if (!Number.isFinite(utilization) || utilization < 0 || utilization > 1) {
    throw new RangeError('Utilization must be a finite fraction from zero through one')
  }
  return transmissionRateBitsPerSecond * utilization
}
