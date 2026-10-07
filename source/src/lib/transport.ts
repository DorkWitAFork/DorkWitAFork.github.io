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

/** Returns the idealized sender utilization for a pipeline window. */
export function calculatePipelinedUtilization(windowSize: number, packetLengthBits: number, transmissionRateBitsPerSecond: number, roundTripTimeSeconds: number): number {
  if (!Number.isInteger(windowSize) || windowSize <= 0) throw new RangeError('Window size must be a positive integer')
  if (!Number.isFinite(roundTripTimeSeconds) || roundTripTimeSeconds < 0) throw new RangeError('RTT must be a non-negative finite number')
  const transmissionTime = calculateTransmissionTimeSeconds(packetLengthBits, transmissionRateBitsPerSecond)
  return Math.min(1, (windowSize * transmissionTime) / (roundTripTimeSeconds + transmissionTime))
}

/** Returns the smallest window that can keep a link busy in the simplified model. */
export function calculateRequiredPipelineWindow(packetLengthBits: number, transmissionRateBitsPerSecond: number, roundTripTimeSeconds: number): number {
  if (!Number.isFinite(roundTripTimeSeconds) || roundTripTimeSeconds < 0) throw new RangeError('RTT must be a non-negative finite number')
  const transmissionTime = calculateTransmissionTimeSeconds(packetLengthBits, transmissionRateBitsPerSecond)
  return Math.max(1, Math.ceil(roundTripTimeSeconds / transmissionTime + 1))
}

/** Returns the maximum safe Selective Repeat window for a sequence space. */
export function calculateSelectiveRepeatWindow(sequenceBits: number): number {
  if (!Number.isInteger(sequenceBits) || sequenceBits < 1 || sequenceBits > 30) throw new RangeError('Sequence bits must be an integer from 1 through 30')
  return 2 ** (sequenceBits - 1)
}

/** Returns a cumulative ACK for a byte range starting at sequenceNumber. */
export function calculateTcpAck(sequenceNumber: number, payloadBytes: number, consumesControlSequenceSpace = false): number {
  if (!Number.isInteger(sequenceNumber) || sequenceNumber < 0) throw new RangeError('Sequence number must be a non-negative integer')
  if (!Number.isInteger(payloadBytes) || payloadBytes < 0) throw new RangeError('Payload length must be a non-negative integer')
  return sequenceNumber + payloadBytes + (consumesControlSequenceSpace ? 1 : 0)
}

/** Calculates the standard simplified TCP RTT estimators for one sample. */
export function calculateRttEstimate(sampleRttSeconds: number, estimatedRttSeconds: number, devRttSeconds: number, alpha = 0.125, beta = 0.25) {
  for (const value of [sampleRttSeconds, estimatedRttSeconds, devRttSeconds]) if (!Number.isFinite(value) || value < 0) throw new RangeError('RTT values must be non-negative and finite')
  if (!Number.isFinite(alpha) || alpha <= 0 || alpha > 1 || !Number.isFinite(beta) || beta <= 0 || beta > 1) throw new RangeError('Smoothing constants must be between zero and one')
  const nextEstimated = (1 - alpha) * estimatedRttSeconds + alpha * sampleRttSeconds
  const nextDev = (1 - beta) * devRttSeconds + beta * Math.abs(sampleRttSeconds - nextEstimated)
  return { estimatedRttSeconds: nextEstimated, devRttSeconds: nextDev, timeoutSeconds: nextEstimated + 4 * nextDev }
}

/** Returns the usable TCP sending window after flow and congestion limits. */
export function calculateEffectiveTcpWindow(receiveWindowBytes: number, congestionWindowBytes: number): number {
  if (!Number.isFinite(receiveWindowBytes) || receiveWindowBytes < 0 || !Number.isFinite(congestionWindowBytes) || congestionWindowBytes < 0) throw new RangeError('TCP windows must be non-negative and finite')
  return Math.min(receiveWindowBytes, congestionWindowBytes)
}

/** Advances a deliberately simplified TCP congestion-control round. */
export function advanceCongestionWindow(cwnd: number, ssthresh: number, event: 'ack' | 'timeout' | 'triple-duplicate-ack') {
  if (!Number.isFinite(cwnd) || cwnd <= 0 || !Number.isFinite(ssthresh) || ssthresh <= 0) throw new RangeError('TCP congestion values must be positive and finite')
  if (event === 'timeout') return { cwnd: 1, ssthresh: Math.max(2, Math.floor(cwnd / 2)), phase: 'slow start' as const }
  if (event === 'triple-duplicate-ack') return { cwnd: Math.max(1, Math.floor(cwnd / 2)), ssthresh: Math.max(2, Math.floor(cwnd / 2)), phase: 'congestion avoidance' as const }
  return cwnd < ssthresh ? { cwnd: cwnd * 2, ssthresh, phase: 'slow start' as const } : { cwnd: cwnd + 1, ssthresh, phase: 'congestion avoidance' as const }
}
