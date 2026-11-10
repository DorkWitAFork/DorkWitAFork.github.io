import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { chapter4Worksheets } from '../data/networkWorksheets'
import { Csc138App } from './Csc138App'
import { NetworkWorksheet } from './NetworkWorksheet'
import { Csc138Chapter5Practice } from './Csc138Chapter5Practice'

afterEach(() => { cleanup(); localStorage.clear() })

describe('network calculation workshops', () => {
  it('provides feedback, rejects an unaligned allocation, and only enables completion after a correct check', () => {
    const worksheet = chapter4Worksheets[0]
    const complete = vi.fn()
    render(<NetworkWorksheet worksheet={worksheet} onComplete={complete}/>)
    const completion = screen.getByRole('button', { name: 'Mark activity complete' })
    fireEvent.click(screen.getByRole('button', { name: 'Show worked solution' }))
    expect(completion).toBeDisabled()
    worksheet.fields.forEach(field => fireEvent.change(screen.getByLabelText(field.label), { target: { value: field.answers[0] } }))
    fireEvent.change(screen.getByLabelText('B network (CIDR)'), { target: { value: '126.91.140.32/26' } })
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(screen.getByLabelText('B network (CIDR)')).toHaveAttribute('aria-invalid', 'true')
    expect(completion).toBeDisabled()
    fireEvent.change(screen.getByLabelText('B network (CIDR)'), { target: { value: '126.91.140.0/26' } })
    fireEvent.click(screen.getByRole('button', { name: 'Check answers' }))
    expect(completion).toBeEnabled()
    fireEvent.click(completion)
    expect(complete).toHaveBeenCalledOnce()
    fireEvent.click(screen.getByRole('button', { name: 'Reset answers' }))
    expect(completion).toBeDisabled()
  })

  it('requires a checked Dijkstra step and invalidates it when an answer changes', () => {
    render(<Csc138Chapter5Practice completedActivities={[]} completeActivity={vi.fn()}/>)
    const worksheet = screen.getByRole('region', { name: 'Dijkstra trace: step 1 of 5' })
    const inputs = within(worksheet).getAllByRole('textbox')
    const apply = screen.getByRole('button', { name: 'Apply checked step' })
    expect(apply).toBeDisabled()
    ;['x', '2', '4', '1', '2', 'inf'].forEach((value, index) => fireEvent.change(inputs[index], { target: { value } }))
    fireEvent.click(within(worksheet).getByRole('button', { name: 'Check answers' }))
    expect(apply).toBeEnabled()
    fireEvent.change(inputs[0], { target: { value: 'w' } })
    expect(apply).toBeDisabled()
    fireEvent.change(inputs[0], { target: { value: 'x' } })
    fireEvent.click(within(worksheet).getByRole('button', { name: 'Check answers' }))
    fireEvent.click(apply)
    expect(screen.getByRole('region', { name: 'Dijkstra trace: step 2 of 5' })).toBeInTheDocument()
    expect(apply).toBeDisabled()
  })

  it('routes Chapter 5 through lessons, references, and its own quiz', () => {
    window.scrollTo = vi.fn()
    const app = render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'chapter5' }}/>)
    expect(screen.getByRole('complementary', { name: 'Chapter 5 lessons' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Run Dijkstra One Step at a Time/ }))
    expect(screen.getByRole('heading', { name: 'Run Dijkstra One Step at a Time' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Open practice lab/ }))
    expect(window.location.hash).toBe('#/student/csc138/practice/chapter5')
    app.unmount()
    const practice = render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'practice', chapter: 'chapter5' }}/>)
    expect(screen.getByText('0/9')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Chapter quiz' }))
    expect(screen.getAllByRole('radio')).toHaveLength(72)
    practice.unmount()
    render(<Csc138App route={{ section: 'course', course: 'csc138', view: 'reference', chapter: 'chapter5' }}/>)
    expect(screen.getByRole('heading', { name: 'Local cost + advertised cost' })).toBeInTheDocument()
  })
})
