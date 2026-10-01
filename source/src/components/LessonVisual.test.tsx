import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { LessonVisual } from './LessonVisual'

afterEach(cleanup)

describe('LessonVisual', () => {
  it('provides meaningful text alternatives for instructional figures', () => {
    const { rerender } = render(<LessonVisual lessonId="physical-media"/>)
    expect(screen.getByRole('img', { name: /Transmission delay places every packet bit/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch2-dns-resolution"/>)
    expect(screen.getByRole('img', { name: /local resolver follows referrals/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch2-p2p-distribution"/>)
    expect(screen.getByRole('img', { name: /peer-to-peer lower bound is the maximum/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch2-bittorrent-swarm"/>)
    expect(screen.getByRole('img', { name: /tracker returns peer discovery information/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch2-udp-sockets"/>)
    expect(screen.getByRole('img', { name: /UDP server binds a datagram socket/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch2-tcp-sockets"/>)
    expect(screen.getByRole('img', { name: /accept returns a separate connection socket/ })).toBeInTheDocument()
  })

  it('describes representative Chapter 3 instructional visuals', () => {
    const { rerender } = render(<LessonVisual lessonId="ch3-transport-services"/>)
    expect(screen.getByRole('img', { name: /IP provides host-to-host delivery/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch3-demultiplexing"/>)
    expect(screen.getByRole('img', { name: /TCP instead selects separate connection sockets using source IP/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch3-checksum"/>)
    expect(screen.getByRole('img', { name: /wrapping the carry to the low end/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch3-alternating-bit"/>)
    expect(screen.getByRole('img', { name: /recognizes sequence 0 as a duplicate/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch3-rdt3"/>)
    expect(screen.getByRole('img', { name: /ACK-loss trace/ })).toBeInTheDocument()
    rerender(<LessonVisual lessonId="ch3-stop-wait"/>)
    expect(screen.getByRole('img', { name: /Pipelining keeps multiple packets in flight/ })).toBeInTheDocument()
  })

  it('renders nothing when a lesson has no dedicated figure', () => {
    const { container } = render(<LessonVisual lessonId="unknown"/>)
    expect(container).toBeEmptyDOMElement()
  })
})
