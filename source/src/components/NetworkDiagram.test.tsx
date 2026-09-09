import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NetworkDiagram } from './NetworkDiagram'

describe('NetworkDiagram', () => {
  it('provides a useful accessible description', () => {
    render(<NetworkDiagram />)
    expect(screen.getByRole('img')).toHaveAccessibleName(/packet traveling from a laptop/i)
  })
})
