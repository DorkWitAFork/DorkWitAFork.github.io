import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Csc138App } from './Csc138App'

beforeEach(() => {
  localStorage.clear()
  window.location.hash = ''
  window.scrollTo = vi.fn()
})

afterEach(cleanup)

describe('CSC 138 Chapter 2', () => {
  it('renders the Chapter 2 lesson collection', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter2' }}/>)
    expect(screen.getByRole('heading', { name: 'Follow the request.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Building Network Applications/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Distributing Files at Scale/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Inside a BitTorrent Swarm/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Socket Programming with UDP/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Socket Programming with TCP/ })).toBeInTheDocument()
    expect(screen.getByText('CHAPTER 2')).toBeInTheDocument()
    expect(within(screen.getByRole('complementary', { name: 'Chapter 2 lessons' })).queryByText(/\d+ min/i)).not.toBeInTheDocument()
  })

  it('selects chapters from an accessible dropdown', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter2' }}/>)
    const trigger = screen.getByRole('button', { name: 'Chapters' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const activeChapter = screen.getByRole('button', { name: /Chapter 2 Application Layer/ })
    expect(activeChapter).toHaveAttribute('aria-current', 'page')
    fireEvent.click(activeChapter)
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(trigger).toHaveFocus()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('button', { name: /Chapter 1 Introduction to Networks/ }))
    expect(window.location.hash).toBe('#/student/csc138/chapter1')
  })

  it('renders the socket lessons and their Python examples', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter2' }}/>)
    fireEvent.click(screen.getByRole('button', { name: /Socket Programming with UDP/ }))
    expect(screen.getByRole('heading', { name: 'Socket Programming with UDP' })).toBeInTheDocument()
    expect(screen.getByText(/clientSocket\.sendto\(message\.encode\(\)/)).toBeInTheDocument()
    expect(screen.getByText('SOURCE · CHAPTER2-SOCKET PROGRAMMING.PDF PAGES 3-8')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Socket Programming with TCP/ }))
    expect(screen.getByRole('heading', { name: 'Socket Programming with TCP' })).toBeInTheDocument()
    expect(screen.getByText(/serverSocket\.listen\(1\)/)).toBeInTheDocument()
  })

  it('renders chapter-specific practice activities', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' }}/>)
    expect(screen.getByRole('heading', { name: 'Transport requirement match' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Non-persistent HTTP exchange' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Web cache impact' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Build an SMTP conversation' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sort FTP control and data' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Trace iterative DNS resolution' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Match DNS records and DNSSEC scope' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Compare file distribution time' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Operate a BitTorrent swarm' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Read the socket API' })).toBeInTheDocument()
    expect(screen.getByText('0/10')).toBeInTheDocument()
  })

  it('validates the P2P calculator and accepts tied bottlenecks', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' }}/>)
    const lab = within(screen.getByRole('region', { name: 'Compare file distribution time' }))
    const bottleneck = lab.getByLabelText(/Which term currently limits/)
    const complete = lab.getByRole('button', { name: 'Mark activity complete' })

    fireEvent.change(lab.getByLabelText(/File size F/), { target: { value: '100' } })
    fireEvent.change(lab.getByLabelText(/Receiving peers N/), { target: { value: '1' } })
    fireEvent.change(lab.getByLabelText(/Server upload/), { target: { value: '10' } })
    fireEvent.change(lab.getByLabelText(/Slowest download/), { target: { value: '10' } })
    fireEvent.change(lab.getByLabelText(/Each peer upload/), { target: { value: '0' } })
    fireEvent.change(bottleneck, { target: { value: 'minimumDownload' } })
    expect(complete).toBeEnabled()
    expect(lab.getByText(/are tied as the largest constraints/)).toBeInTheDocument()

    fireEvent.change(lab.getByLabelText(/Server upload/), { target: { value: '0' } })
    expect(bottleneck).toBeDisabled()
    expect(complete).toBeDisabled()
    expect(lab.getAllByText('Check inputs')).toHaveLength(2)
  })

  it('requires every BitTorrent strategy to be matched before completion', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' }}/>)
    const lab = within(screen.getByRole('region', { name: 'Operate a BitTorrent swarm' }))
    const matches = [
      ['Tracker', 'Helps a new participant discover peers'],
      ['Rarest first', 'Replicates a scarce needed piece'],
      ['Preferred peers', 'Rewards neighbors currently providing useful upload rates'],
      ['Optimistic unchoke', 'Tries a new exchange partner periodically'],
      ['Choke', 'Pauses regular uploads to a particular peer'],
    ]
    const complete = lab.getByRole('button', { name: 'Mark activity complete' })
    expect(complete).toBeDisabled()
    for (const [label, value] of matches) fireEvent.change(lab.getByLabelText(label), { target: { value } })
    expect(complete).toBeEnabled()
    expect(lab.getByText(/Swarm strategy matched/)).toBeInTheDocument()
  })

  it('requires every socket API call to be matched before completion', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' }}/>)
    const lab = within(screen.getByRole('region', { name: 'Read the socket API' }))
    const matches = [
      ['socket(AF_INET, SOCK_DGRAM)', 'Create an IPv4 UDP socket'],
      ['sendto(data, address)', 'Send one datagram to an explicit destination'],
      ['recvfrom(size)', 'Receive one datagram and its sender address'],
      ['socket(AF_INET, SOCK_STREAM)', 'Create an IPv4 TCP socket'],
      ['connect(address)', 'Establish the client TCP connection'],
      ['listen()', 'Make a bound TCP socket welcome connections'],
      ['accept()', 'Return a new socket for one connected client'],
      ['recv(size)', 'Read available bytes from a connected TCP stream'],
    ]
    const complete = lab.getByRole('button', { name: 'Mark activity complete' })
    expect(complete).toBeDisabled()
    for (const [label, value] of matches) fireEvent.change(lab.getByLabelText(label), { target: { value } })
    expect(complete).toBeEnabled()
    expect(lab.getByText(/Socket calls matched/)).toBeInTheDocument()
  })

  it('renders the Chapter 2 reference', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter2' }}/>)
    expect(screen.getByText('2RTT + transmission time')).toBeInTheDocument()
    expect(screen.getByText('HTTP METHODS')).toBeInTheDocument()
    expect(screen.getByText('DNS RECORDS')).toBeInTheDocument()
    expect(screen.getByText('BITTORRENT STRATEGY')).toBeInTheDocument()
    expect(screen.getByText('UDP SOCKET PATH')).toBeInTheDocument()
    expect(screen.getByText('TCP SOCKET PATH')).toBeInTheDocument()
    expect(screen.getByText('Chapter2-Mail-DNS.pdf')).toBeInTheDocument()
    expect(screen.getByText('Chapter2-P2P.pdf')).toBeInTheDocument()
    expect(screen.getByText('Chapter2-Socket Programming.pdf')).toBeInTheDocument()
    expect(screen.getByText('Application-layer protocol')).toBeInTheDocument()
  })
})

describe('CSC 138 Chapter 3', () => {
  it('renders the lecture-aligned transport lesson collection and chapter navigation', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter3' }}/>)
    expect(screen.getByRole('heading', { name: 'Make delivery reliable.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Transport Services Between Processes/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /The Internet Checksum/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rdt3.0: Handling Loss/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Stop-and-Wait Performance/ })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Chapters' }))
    expect(screen.getByRole('button', { name: /Chapter 3 Transport Layer/ })).toHaveAttribute('aria-current', 'page')
  })

  it('preserves Chapter 3 context when opening practice from a lesson', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter3' }}/>)
    fireEvent.click(screen.getByRole('button', { name: /Open practice lab/ }))
    expect(window.location.hash).toBe('#/student/csc138/practice/chapter3')
  })

  it('renders all Chapter 3 corrective labs and validates the checksum exercise', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter3' }}/>)
    expect(screen.getByRole('heading', { name: 'Demultiplex transport traffic' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Solve UDP word problems' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Match RDT problems to mechanisms' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Trace RDT recovery scenarios' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Solve the lecture stop-and-wait problem' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fill the pipeline' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Choose a pipelined recovery' })).toBeInTheDocument()
    expect(screen.getByText('0/12')).toBeInTheDocument()

    const lab = within(screen.getByRole('region', { name: 'Solve UDP word problems' }))
    const complete = lab.getByRole('button', { name: 'Mark activity complete' })
    expect(complete).toBeDisabled()
    fireEvent.change(lab.getByLabelText(/Payload length/), { target: { value: '4' } })
    fireEvent.change(lab.getByLabelText(/UDP length/), { target: { value: '12' } })
    fireEvent.change(lab.getByLabelText(/One's-complement checksum/), { target: { value: '0x4443' } })
    expect(complete).toBeEnabled()
    expect(lab.getByText(/The UDP length is 12 bytes/)).toBeInTheDocument()
  })

  it('supports the complete lecture stop-and-wait calculation', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter3' }}/>)
    const lab = within(screen.getByRole('region', { name: 'Solve the lecture stop-and-wait problem' }))
    fireEvent.change(lab.getByLabelText(/Transmission time L\/R/), { target: { value: '8' } })
    fireEvent.change(lab.getByLabelText(/Round-trip time/), { target: { value: '30' } })
    fireEvent.change(lab.getByLabelText(/Sender utilization/), { target: { value: '0.02666' } })
    fireEvent.change(lab.getByLabelText(/Useful throughput/), { target: { value: '266.6' } })
    fireEvent.change(lab.getByLabelText(/How does pipelining/), { target: { value: 'Keep multiple unacknowledged packets in flight' } })
    expect(lab.getByRole('button', { name: 'Mark activity complete' })).toBeEnabled()
    expect(lab.getByText(/L\/R is 8.000 microseconds/)).toBeInTheDocument()
  })

  it('renders the expanded Chapter 3 quiz', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter3' }}/>)
    fireEvent.click(screen.getByRole('tab', { name: 'Chapter quiz' }))
    expect(screen.getByText(/36 questions covering the chapter/)).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(144)
  })

  it('renders Chapter 3 formulas, mechanisms, glossary, and sources', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter3' }}/>)
    expect(screen.getByText('(L/R) / (RTT + L/R)')).toBeInTheDocument()
    expect(screen.getByText('RDT PROGRESSION')).toBeInTheDocument()
    expect(screen.getByText('PIPELINING MOTIVATION')).toBeInTheDocument()
    expect(screen.getByText('Alternating-bit protocol')).toBeInTheDocument()
    expect(screen.getByText('Chapter3-Transport Layer-Intro-MUX-UDP.pdf')).toBeInTheDocument()
    expect(screen.getByText('Chapter3-Principle of reliable data transfer.pdf')).toBeInTheDocument()
  })
})
