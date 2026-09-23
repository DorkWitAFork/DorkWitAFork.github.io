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
  })

  it('renders nothing when a lesson has no dedicated figure', () => {
    const { container } = render(<LessonVisual lessonId="unknown"/>)
    expect(container).toBeEmptyDOMElement()
  })
})
