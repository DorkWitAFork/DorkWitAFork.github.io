import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SiteRoute } from '../lib/router'
import { OsApp } from './OsApp'

type Csc139Route = Extract<SiteRoute, { section: 'course'; course: 'csc139' }>

const chapter2Route = { section: 'course', course: 'csc139', view: 'chapter2' } satisfies Csc139Route
const chapter2PracticeRoute = { section: 'course', course: 'csc139', view: 'practice', chapter: 'chapter2' } satisfies Csc139Route
const chapter2ReferenceRoute = { section: 'course', course: 'csc139', view: 'reference', chapter: 'chapter2' } satisfies Csc139Route

beforeEach(() => {
  localStorage.clear()
  window.scrollTo = vi.fn()
})

afterEach(cleanup)

describe('CSC 139 Chapter 2', () => {
  it('renders the detailed Chapter 2 lesson collection', () => {
    render(<OsApp route={chapter2Route}/>)
    expect(screen.getByRole('heading', { name: 'Follow the service boundary.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Operating-System Services/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Debugging and Kernel Modules/ })).toBeInTheDocument()
    expect(screen.getByText('CHAPTER 2')).toBeInTheDocument()
  })

  it('renders the five Chapter 2 practice labs', () => {
    render(<OsApp route={chapter2PracticeRoute}/>)
    expect(screen.getByRole('heading', { name: 'Map the service boundary' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Trace a system call' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Choose the kernel structure' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Boot to a usable system' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Manage a kernel module safely' })).toBeInTheDocument()
    expect(screen.getByText('0/5')).toBeInTheDocument()
  })

  it('renders the Chapter 2 reference', () => {
    render(<OsApp route={chapter2ReferenceRoute}/>)
    expect(screen.getByText('SYSTEM-CALL PATH')).toBeInTheDocument()
    expect(screen.getByText('BOOT ORDER')).toBeInTheDocument()
    expect(screen.getByText('Jiffies')).toBeInTheDocument()
  })
})
