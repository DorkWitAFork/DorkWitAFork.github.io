import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HiringPortfolio, PortfolioHome, TeacherPage } from './SitePages'

afterEach(cleanup)

describe('portfolio home', () => {
  it('introduces Spencer and offers three audience choices', () => {
    render(<PortfolioHome />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/^Hi! I'm Spencer Le Bleu$/)
    expect(screen.getByRole('heading', { name: 'Hello! Are you a:' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Student Open course guides/ })).toHaveAttribute('href', '#/student')
    expect(screen.getByRole('link', { name: /Teacher Review the course tools/ })).toHaveAttribute('href', '#/teacher')
    expect(screen.getByRole('link', { name: /Hiring Professional Read project notes/ })).toHaveAttribute('href', '#/hiring')
    expect(screen.getByRole('heading', { name: 'A little about me.' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Linear Algebra Helper' })).not.toBeInTheDocument()
  })
})

describe('audience pages', () => {
  it('keeps project records in the hiring section', () => {
    render(<HiringPortfolio />)

    expect(screen.getByRole('heading', { name: 'PokerApp' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Some of my recent projects.' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Three projects on my desk.' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Asteroids' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Keys2Fitness' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'rs-mercher' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Course Labs' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Choose a Course Lab/ })).toHaveAttribute('href', '#/student')
    expect(screen.getAllByRole('link', { name: /Read the source/ })).toHaveLength(3)
    expect(screen.getByText('Source code is private.')).toBeInTheDocument()
    expect(document.querySelector('a[href="https://github.com/DorkWitAFork/rs-mercher"]')).toBeNull()
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveTextContent(/^GitHub$/)
    expect(screen.getAllByRole('link', { name: /Read the source/ }).map(link => link.getAttribute('href'))).toContain('https://github.com/marynolan6/Keys2Fitness')
  })

  it('links teachers directly to both course tools', () => {
    render(<TeacherPage />)

    expect(screen.getByRole('link', { name: /CSC 138 Computer Network Fundamentals Network Lab/ })).toHaveAttribute('href', '#/student/csc138/dashboard')
    expect(screen.getByRole('link', { name: /CSC 139 Operating System Principles Operating Systems Lab/ })).toHaveAttribute('href', '#/student/csc139/dashboard')
  })
})
