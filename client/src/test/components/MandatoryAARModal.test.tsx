import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MandatoryAARModal from '../../components/MandatoryAARModal'

describe('MandatoryAARModal', () => {
  const mockOnComplete = vi.fn()
  const defaultProps = {
    labId: 'test-lab-1',
    userId: 'test-user-123',
    labTitle: 'Test Linux Lab',
    passed: true,
    onComplete: mockOnComplete,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders modal with correct title and status', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    expect(screen.getByText('After Action Review Required')).toBeInTheDocument()
    expect(screen.getByText('Test Linux Lab - Passed')).toBeInTheDocument()
    expect(screen.getByText('Cannot Skip')).toBeInTheDocument()
  })

  it('shows all required AAR questions', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    expect(screen.getByText('What was I trying to accomplish?')).toBeInTheDocument()
    expect(screen.getByText('What worked well? (List at least 3 things)')).toBeInTheDocument()
    expect(screen.getByText("What didn't work?")).toBeInTheDocument()
    expect(screen.getByText("Why didn't it work?")).toBeInTheDocument()
    expect(screen.getByText('What would I do differently next time?')).toBeInTheDocument()
    expect(screen.getByText('What did I learn that I can use later?')).toBeInTheDocument()
  })

  it('shows word count requirements', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    const wordCountElements = screen.getAllByText(/\d+\/\d+ words/)
    expect(wordCountElements).toHaveLength(6) // One for each question
  })

  it('validates minimum word counts', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    // Mock window.alert
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Try to submit without filling anything
    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    expect(window.alert).toHaveBeenCalledWith('This question is required')

    alertMock.mockRestore()
  })

  it('updates word counts as user types', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    const firstTextarea = screen.getByPlaceholderText(/describe the lab objective/i)
    await user.type(firstTextarea, 'This is a test objective')

    expect(screen.getByText('5/20 words')).toBeInTheDocument()
  })

  it('validates minimum word count for each question', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Fill all textareas with insufficient content
    const textareas = screen.getAllByRole('textbox')
    for (const textarea of textareas) {
      await user.type(textarea, 'Short')
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    expect(window.alert).toHaveBeenCalledWith('This question is required')

    alertMock.mockRestore()
  })

  it('accepts valid AAR submission', async () => {
    const user = userEvent.setup({ delay: null })

    // Mock Firebase functions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(addDoc as any).mockResolvedValue({ id: 'test-doc-id' })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(collection as any).mockReturnValue('test-collection')

    render(<MandatoryAARModal {...defaultProps} />)

    // Fill all required fields with sufficient content
    const textareas = screen.getAllByRole('textbox')

    const responses = [
      'I was trying to accomplish setting up a basic Linux environment and learning command line navigation',
      'The cd command worked well, ls showed directory contents correctly, pwd displayed current location accurately',
      'The mkdir command did not work as expected - it created directories in wrong location',
      'The mkdir command failed because I was not in the correct directory when executing it',
      'Next time I would verify my current location with pwd before creating directories',
      'I learned that understanding your current location is crucial in Linux command line operations'
    ]

    for (let i = 0; i < textareas.length; i++) {
      await user.type(textareas[i], responses[i])
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    // Should call onComplete
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled()
    })

    // Should save to Firebase
    expect(mockAddDoc).toHaveBeenCalledWith('test-collection', expect.objectContaining({
      labId: 'test-lab-1',
      userId: 'test-user-123',
      labTitle: 'Test Linux Lab',
      passed: true,
      responses: expect.any(Object),
      submittedAt: expect.any(Date),
    }))
  })

  it('shows submission progress', async () => {
    const user = userEvent.setup({ delay: null })

    // Mock slow Firebase call
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(addDoc as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(collection as any).mockReturnValue('test-collection')

    render(<MandatoryAARModal {...defaultProps} />)

    // Fill required fields
    const textareas = screen.getAllByRole('textbox')
    for (const textarea of textareas) {
      await user.type(textarea, 'This is sufficient content for the minimum word count requirement')
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    // Should show submitting state
    expect(screen.getByText('Submitting...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('handles submission errors gracefully', async () => {
    const user = userEvent.setup({ delay: null })

    // Mock Firebase error
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(addDoc as any).mockRejectedValue(new Error('Firebase error'))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(collection as any).mockReturnValue('test-collection')

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<MandatoryAARModal {...defaultProps} />)

    // Fill required fields
    const textareas = screen.getAllByRole('textbox')
    for (const textarea of textareas) {
      await user.type(textarea, 'This is sufficient content for the minimum word count requirement')
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Error submitting AAR. Please try again.')
    })

    alertMock.mockRestore()
  })

  it('shows completion progress indicator', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    // Initially shows 0/6 complete
    expect(screen.getByText('0/6 complete')).toBeInTheDocument()

    // Fill one textarea with enough words (20 minimum)
    const firstTextarea = screen.getByPlaceholderText(/describe the lab objective/i)
    await user.type(firstTextarea, 'This is sufficient content for the minimum word count requirement that meets the twenty word minimum requirement for this particular question in the after action review process')

    expect(screen.getByText('1/6 complete')).toBeInTheDocument()
  })

  it('disables submit button until all questions are answered', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when all questions meet requirements', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    const textareas = screen.getAllByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })

    // Fill all textareas with sufficient content
    for (const textarea of textareas) {
      await user.type(textarea, 'This is sufficient content for the minimum word count requirement that meets all validation criteria')
    }

    await waitFor(() => {
      expect(submitButton).toBeEnabled()
    })

    expect(screen.getByText('All questions answered')).toBeInTheDocument()
  })

  it('shows warning about mandatory reflection', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    expect(screen.getByText(/mandatory reflection/i)).toBeInTheDocument()
    expect(screen.getByText(/you must complete this aar before continuing/i)).toBeInTheDocument()
    expect(screen.getByText(/no navigation, no skipping, no shortcuts/i)).toBeInTheDocument()
  })

  it('shows different status for failed labs', () => {
    render(<MandatoryAARModal {...defaultProps} passed={false} />)

    expect(screen.getByText('Test Linux Lab - Failed')).toBeInTheDocument()
  })

  it('includes attempt inputs for "what worked well" question', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    // Should have input fields for listing 3 things that worked
    const inputs = screen.getAllByPlaceholderText(/list successful approaches/i)
    expect(inputs).toHaveLength(3)
  })

  it('validates attempt inputs separately', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    // Fill all textareas but leave attempt inputs empty
    const textareas = screen.getAllByRole('textbox').filter(element =>
      element.tagName.toLowerCase() === 'textarea'
    )
    for (const textarea of textareas) {
      await user.type(textarea, 'This is sufficient content for validation')
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    expect(window.alert).toHaveBeenCalledWith('Please list at least 3 things you tried')

    alertMock.mockRestore()
  })
})