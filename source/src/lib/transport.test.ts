import { describe, expect, it } from 'vitest'
import { calculateOnesComplementChecksum, calculateRoundTripTimeSeconds, calculateStopAndWaitThroughputBps, calculateStopAndWaitUtilization, calculateTransmissionTimeSeconds, calculateUdpLength } from './transport'

describe('calculateOnesComplementChecksum', () => {
  it('computes a UDP checksum with repeated end-around carries', () => {
    const words = [0xc000, 0x0201, 0xc633, 0x6402, 0x0011, 0x000c, 0x1388, 0x0035, 0x000c, 0x0000, 0x4142, 0x4344]

    expect(calculateOnesComplementChecksum(words)).toBe(0x7b5b)
    expect(words).toEqual([0xc000, 0x0201, 0xc633, 0x6402, 0x0011, 0x000c, 0x1388, 0x0035, 0x000c, 0x0000, 0x4142, 0x4344])
  })

  it('computes the two-word lecture checksum with end-around carry', () => {
    expect(calculateOnesComplementChecksum([0xe666, 0xd555])).toBe(0x4443)
  })

  it('wraps carry bits back into the low 16 bits', () => {
    expect(calculateOnesComplementChecksum([0xffff, 0x0001])).toBe(0xfffe)
    expect(calculateOnesComplementChecksum([0xffff, 0xffff])).toBe(0x0000)
  })

  it('returns the complement of zero for an empty word sequence', () => {
    expect(calculateOnesComplementChecksum([])).toBe(0xffff)
  })

  it.each([-1, 0x10000, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid 16-bit word %s',
    word => expect(() => calculateOnesComplementChecksum([word])).toThrow(RangeError),
  )

  it('rejects non-arrays and sparse arrays at runtime', () => {
    expect(() => calculateOnesComplementChecksum('ffff' as unknown as number[])).toThrow(TypeError)
    expect(() => calculateOnesComplementChecksum(new Array(1))).toThrow(RangeError)
  })
})

describe('transport word-problem helpers', () => {
  it('adds the UDP header to payload length', () => {
    expect(calculateUdpLength(0)).toBe(8)
    expect(calculateUdpLength(20)).toBe(28)
    expect(calculateUdpLength(1_000)).toBe(1_008)
  })

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid UDP payload length %s', payload => {
    expect(() => calculateUdpLength(payload)).toThrow(RangeError)
  })

  it('converts the lecture packet and link rate into 8 microseconds', () => {
    expect(calculateTransmissionTimeSeconds(8_000, 1_000_000_000)).toBeCloseTo(0.000008)
  })

  it('doubles the lecture one-way propagation delay into a 30 ms RTT', () => {
    expect(calculateRoundTripTimeSeconds(0.015)).toBeCloseTo(0.03)
  })

  it('interprets utilization as useful throughput', () => {
    expect(calculateStopAndWaitThroughputBps(1_000_000_000, 0.0002665955745134631)).toBeCloseTo(266_595.57, 0)
  })

  it.each([[-1, 0], [1, -0.01], [1, 1.01], [1, Number.NaN]])('rejects invalid throughput inputs (%s, %s)', (rate, utilization) => {
    expect(() => calculateStopAndWaitThroughputBps(rate, utilization)).toThrow(RangeError)
  })
})

describe('calculateStopAndWaitUtilization', () => {
  it('matches the lecture utilization word problem', () => {
    expect(calculateStopAndWaitUtilization(8_000, 1_000_000_000, 0.03)).toBeCloseTo(0.0002666)
  })
  it('uses L/R transmission time and RTT for the cycle time', () => {
    expect(calculateStopAndWaitUtilization(12_000, 12_000_000, 0.039)).toBeCloseTo(0.025)
  })

  it('returns full utilization when RTT is zero', () => {
    expect(calculateStopAndWaitUtilization(1_000, 1_000_000, 0)).toBe(1)
  })

  it('supports fractional positive values', () => {
    expect(calculateStopAndWaitUtilization(0.5, 2, 0.75)).toBeCloseTo(0.25)
  })

  it.each([
    [0, 1, 0],
    [-1, 1, 0],
    [Number.NaN, 1, 0],
    [Number.POSITIVE_INFINITY, 1, 0],
    [1, 0, 0],
    [1, -1, 0],
    [1, Number.NaN, 0],
    [1, Number.POSITIVE_INFINITY, 0],
    [1, 1, -1],
    [1, 1, Number.NaN],
    [1, 1, Number.POSITIVE_INFINITY],
  ])('rejects invalid inputs (%s, %s, %s)', (length, rate, rtt) => {
    expect(() => calculateStopAndWaitUtilization(length, rate, rtt)).toThrow(RangeError)
  })

  it('rejects finite inputs whose intermediate transmission time overflows', () => {
    expect(() => calculateStopAndWaitUtilization(Number.MAX_VALUE, Number.MIN_VALUE, 1)).toThrow(RangeError)
  })
})
