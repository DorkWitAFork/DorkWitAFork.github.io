import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Csc138App } from './Csc138App'

beforeEach(() => {
  localStorage.clear()
  window.scrollTo = vi.fn()
})

afterEach(cleanup)

describe('CSC 138 Chapter 2', () => {
  it('renders the Chapter 2 lesson collection', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter2' }}/>)
    expect(screen.getByRole('heading', { name: 'Follow the request.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Building Network Applications/ })).toBeInTheDocument()
    expect(screen.getByText('CHAPTER 2')).toBeInTheDocument()
  })

  it('renders chapter-specific practice activities', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter2' }}/>)
    expect(screen.getByRole('heading', { name: 'Transport requirement match' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Non-persistent HTTP exchange' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Web cache impact' })).toBeInTheDocument()
    expect(screen.getByText('0/3')).toBeInTheDocument()
  })

  it('renders the Chapter 2 reference', () => {
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter2' }}/>)
    expect(screen.getByText('2RTT + transmission time')).toBeInTheDocument()
    expect(screen.getByText('HTTP METHODS')).toBeInTheDocument()
    expect(screen.getByText('Application-layer protocol')).toBeInTheDocument()
  })
})
