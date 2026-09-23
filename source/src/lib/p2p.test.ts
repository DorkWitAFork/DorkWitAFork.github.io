import { describe, expect, it } from 'vitest'
import { calculateDistributionTimes } from './p2p'

describe('calculateDistributionTimes', () => {
  it('solves the Chapter 2 deck exercise using its converted file size', () => {
    const result = calculateDistributionTimes({
      fileSizeMbits: 20_480,
      peers: 1_000,
      serverUploadMbps: 30,
      minimumDownloadMbps: 2,
      peerUploadMbps: 2,
    })

    expect(result.valid).toBe(true)
    expect(result.clientServerSeconds).toBeCloseTo(682_666.67, 1)
    expect(result.p2pLimits.aggregateUpload).toBeCloseTo(10_088.67, 1)
    expect(result.p2pSeconds).toBe(10_240)
  })

  it('returns zeroed results for invalid capacities', () => {
    const zeroCapacity = calculateDistributionTimes({ fileSizeMbits: 100, peers: 10, serverUploadMbps: 0, minimumDownloadMbps: 5, peerUploadMbps: 1 })
    const fractionalPeers = calculateDistributionTimes({ fileSizeMbits: 100, peers: 1.5, serverUploadMbps: 5, minimumDownloadMbps: 5, peerUploadMbps: 1 })
    expect(zeroCapacity.valid).toBe(false)
    expect(zeroCapacity.p2pSeconds).toBe(0)
    expect(fractionalPeers.valid).toBe(false)
  })
})
