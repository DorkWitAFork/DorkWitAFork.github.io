export type DistributionInputs = {
  fileSizeMbits: number
  peers: number
  serverUploadMbps: number
  minimumDownloadMbps: number
  peerUploadMbps: number
}

export type DistributionResult = {
  valid: boolean
  clientServerSeconds: number
  p2pSeconds: number
  clientServerLimits: {
    serverUpload: number
    minimumDownload: number
  }
  p2pLimits: {
    initialServerCopy: number
    minimumDownload: number
    aggregateUpload: number
  }
}

export function calculateDistributionTimes(inputs: DistributionInputs): DistributionResult {
  const { fileSizeMbits, peers, serverUploadMbps, minimumDownloadMbps, peerUploadMbps } = inputs
  if (![fileSizeMbits, peers, serverUploadMbps, minimumDownloadMbps, peerUploadMbps].every(Number.isFinite)
    || fileSizeMbits <= 0 || !Number.isInteger(peers) || peers <= 0 || serverUploadMbps <= 0 || minimumDownloadMbps <= 0 || peerUploadMbps < 0) {
    return {
      valid: false,
      clientServerSeconds: 0,
      p2pSeconds: 0,
      clientServerLimits: { serverUpload: 0, minimumDownload: 0 },
      p2pLimits: { initialServerCopy: 0, minimumDownload: 0, aggregateUpload: 0 },
    }
  }

  const clientServerLimits = {
    serverUpload: peers * fileSizeMbits / serverUploadMbps,
    minimumDownload: fileSizeMbits / minimumDownloadMbps,
  }
  const p2pLimits = {
    initialServerCopy: fileSizeMbits / serverUploadMbps,
    minimumDownload: fileSizeMbits / minimumDownloadMbps,
    aggregateUpload: peers * fileSizeMbits / (serverUploadMbps + peers * peerUploadMbps),
  }

  return {
    valid: true,
    clientServerSeconds: Math.max(...Object.values(clientServerLimits)),
    p2pSeconds: Math.max(...Object.values(p2pLimits)),
    clientServerLimits,
    p2pLimits,
  }
}
