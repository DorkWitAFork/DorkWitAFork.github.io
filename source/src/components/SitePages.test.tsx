import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HiringPortfolio, PortfolioHome, TeacherPage } from './SitePages'

afterEach(cleanup)

describe('portfolio home', () => {
  it('introduces Spencer and offers three audience choices', () => {
    render(<PortfolioHome />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Spencer Le Bleu')
    expect(screen.getByRole('heading', { name: 'Hello! Are you a:' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /01 Student/ })).toHaveAttribute('href', '#/student')
    expect(screen.getByRole('link', { name: /02 Teacher/ })).toHaveAttribute('href', '#/teacher')
    expect(screen.getByRole('link', { name: /03 Hiring Professional/ })).toHaveAttribute('href', '#/hiring')
    expect(screen.getByRole('heading', { name: 'A little context.' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Linear Algebra Helper' })).not.toBeInTheDocument()
  })
})

describe('audience pages', () => {
  it('keeps project records in the hiring section', () => {
    render(<HiringPortfolio />)

    expect(screen.getByRole('link', { name: /Open Network Lab/ })).toHaveAttribute('href', '#/student/csc138/dashboard')
    expect(screen.getByRole('link', { name: /Open OS Lab/ })).toHaveAttribute('href', '#/student/csc139/dashboard')
    expect(screen.getAllByRole('link', { name: /Read the source/ })).toHaveLength(3)
  })

  it('links teachers directly to both course tools', () => {
    render(<TeacherPage />)

    expect(screen.getByRole('link', { name: /CSC 138 Computer Network Fundamentals Network Lab/ })).toHaveAttribute('href', '#/student/csc138/dashboard')
    expect(screen.getByRole('link', { name: /CSC 139 Operating System Principles Operating Systems Lab/ })).toHaveAttribute('href', '#/student/csc139/dashboard')
  })
})
