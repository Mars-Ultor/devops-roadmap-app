import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { addDoc, collection } from 'firebase/firestore'
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

    expect(screen.getByText(/What was I trying to accomplish/)).toBeInTheDocument()
    expect(screen.getByText(/What worked well/)).toBeInTheDocument()
    expect(screen.getByText(/What didn't work/)).toBeInTheDocument()
    expect(screen.getByText(/Why didn't it work/)).toBeInTheDocument()
    expect(screen.getByText(/What would I do differently/)).toBeInTheDocument()
    expect(screen.getByText(/What did I learn/)).toBeInTheDocument()
  })

  it('shows word count requirements', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    const wordCountElements = screen.getAllByText(/\d+\/\d+ words/)
    expect(wordCountElements).toHaveLength(6) // One for each question
  })

  it.skip('validates minimum word counts', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    // Button should be disabled when nothing is filled
    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    expect(submitButton).toBeDisabled()

    // Fill all textareas with insufficient content to enable button
    const textareas = screen.getAllByRole('textbox')
    for (const textarea of textareas) {
      await user.type(textarea, 'Short')
    }

    // Button should now be enabled
    expect(submitButton).toBeEnabled()

    // Try to submit
    await user.click(submitButton)

    // Should show validation errors
    expect(screen.getByText('Too brief. Need at least 20 words (currently 1)')).toBeInTheDocument()
  })

  it('updates word counts as user types', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    const firstTextarea = screen.getByPlaceholderText(/describe the lab objective/i)
    await user.type(firstTextarea, 'This is a test objective')

    expect(screen.getByText('5/20 words')).toBeInTheDocument()
  })

  it.skip('validates minimum word count for each question', async () => {
    const user = userEvent.setup({ delay: null })
    render(<MandatoryAARModal {...defaultProps} />)

    // Fill all textareas with insufficient content
    const textareas = screen.getAllByRole('textbox')
    for (const textarea of textareas) {
      await user.type(textarea, 'Short')
    }

    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })
    await user.click(submitButton)

    // Should show validation errors for insufficient content
    expect(screen.getByText(/Too brief\. Need at least \d+ words/)).toBeInTheDocument()
  })

  it('accepts valid AAR submission', async () => {
    const user = userEvent.setup({ delay: null })

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
    }, { timeout: 10000 })
  }, 15000)

  it.skip('shows submission progress', async () => {
    const user = userEvent.setup({ delay: null })

    // Mock slow Firebase call
    const mockAddDoc = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)))
    const mockCollection = vi.fn(() => 'test-collection')

    // Temporarily replace the global mocks for this test
    vi.mocked(addDoc).mockImplementation(mockAddDoc)
    vi.mocked(collection).mockImplementation(mockCollection)

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

  it.skip('handles submission errors gracefully', async () => {
    const user = userEvent.setup({ delay: null })

    // Mock Firebase error - temporarily override global mock
    const originalAddDoc = vi.mocked(addDoc)
    vi.mocked(addDoc).mockImplementationOnce(() => Promise.reject(new Error('Firebase error')))

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
    }, { timeout: 10000 })

    alertMock.mockRestore()

    // Restore the mock
    vi.mocked(addDoc).mockImplementation(originalAddDoc)
  }, 15000)

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

  it('enables submit button when all questions meet requirements', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    const textareas = screen.getAllByRole('textbox')
    const submitButton = screen.getByRole('button', { name: /submit aar and continue/i })

    // Fill all textareas with sufficient content for their minimum word counts
    const sufficientContent = [
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the twenty word minimum requirement for this question about what I was trying to accomplish.', // 20+ words
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the thirty word minimum requirement for this question about what worked well including multiple approaches commands and good decisions that were made during the lab completion process.', // 30+ words
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the twenty word minimum requirement for this question about what did not work during the lab.', // 20+ words
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the thirty word minimum requirement for this question about why things did not work including root cause analysis and specific reasons for the failures.', // 30+ words
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the twenty word minimum requirement for this question about what I would do differently next time.', // 20+ words
      'This is sufficient content for the minimum word count requirement that meets all validation criteria and provides enough words to satisfy the twenty word minimum requirement for this question about what I learned that I can use later.' // 20+ words
    ]

    for (let i = 0; i < textareas.length; i++) {
      fireEvent.change(textareas[i], { target: { value: sufficientContent[i] } })
    }

    // Button should be enabled immediately after filling all fields
    expect(submitButton).toBeEnabled()
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

  it.skip('includes attempt inputs for "what worked well" question', () => {
    render(<MandatoryAARModal {...defaultProps} />)

    // Should have input fields for listing 3 things that worked
    const inputs = screen.getAllByPlaceholderText(/list successful approaches/i)
    expect(inputs).toHaveLength(3)
  })

  it.skip('validates attempt inputs separately', async () => {
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