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
    expect(screen.getByText('CHAPTER 2')).toBeInTheDocument()
    expect(within(screen.getByRole('complementary', { name: 'Chapter 2 lessons' })).queryByText(/\d+ min/i)).not.toBeInTheDocument()
  })

  it('selects chapters from an accessible dropdown', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter2' }}/>)
    const trigger = screen.getByRole('button', { name: 'Chapters' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const activeChapter = screen.getByRole('button', { name: /Chapter 2 Application Principles and HTTP/ })
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
    expect(screen.getByText('0/9')).toBeInTheDocument()
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

  it('renders the Chapter 2 reference', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter2' }}/>)
    expect(screen.getByText('2RTT + transmission time')).toBeInTheDocument()
    expect(screen.getByText('HTTP METHODS')).toBeInTheDocument()
    expect(screen.getByText('DNS RECORDS')).toBeInTheDocument()
    expect(screen.getByText('BITTORRENT STRATEGY')).toBeInTheDocument()
    expect(screen.getByText('Chapter2-Mail-DNS.pdf')).toBeInTheDocument()
    expect(screen.getByText('Chapter2-P2P.pdf')).toBeInTheDocument()
    expect(screen.getByText('Application-layer protocol')).toBeInTheDocument()
  })
})
