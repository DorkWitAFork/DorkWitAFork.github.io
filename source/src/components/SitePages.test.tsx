import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PortfolioHome } from './SitePages'

afterEach(cleanup)

describe('portfolio home', () => {
  it('leads with real work instead of audience choices', () => {
    render(<PortfolioHome />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('When I want to understand something')
    expect(screen.getByRole('heading', { name: 'Linear Algebra Helper' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Network Lab' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Operating Systems Lab' })).toBeInTheDocument()
    expect(screen.queryByText('Choose your path')).not.toBeInTheDocument()
  })

  it('keeps the course tools and source code reachable', () => {
    render(<PortfolioHome />)

    expect(screen.getByRole('link', { name: /Open Network Lab/ })).toHaveAttribute('href', '#/student/csc138/dashboard')
    expect(screen.getByRole('link', { name: /Open OS Lab/ })).toHaveAttribute('href', '#/student/csc139/dashboard')
    expect(screen.getByRole('link', { name: /Browse the course tools/ })).toHaveAttribute('href', '#/student')
    expect(screen.getAllByRole('link', { name: /Read the source/ })).toHaveLength(3)
  })
})
