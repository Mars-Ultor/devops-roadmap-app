import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HintSystem from '../../components/HintSystem'

describe('HintSystem', () => {
  const mockOnHintViewed = vi.fn()
  const mockHints = [
    { id: 1, text: 'First hint', difficulty: 'easy' as const },
    { id: 2, text: 'Second hint', difficulty: 'medium' as const },
    { id: 3, text: 'Third hint', difficulty: 'hard' as const },
  ]

  let mockNow = Date.now()

  beforeEach(() => {
    vi.clearAllMocks()
    // Don't use fake timers by default - only for timer-specific tests
  })

  afterEach(() => {
    // Only restore if fake timers were used
    if (vi.isFakeTimers()) {
      vi.useRealTimers()
      vi.restoreAllMocks()
    }
  })

  it('shows locked state when hints are not unlocked', () => {
    const labStartTime = Date.now()
    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={false}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    expect(screen.getByText('Hints locked. Complete the struggle timer first.')).toBeInTheDocument()
    expect(screen.getByTestId('lock')).toBeInTheDocument()
  })

  it('shows hint system when hints are unlocked', () => {
    const labStartTime = Date.now()
    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    expect(screen.getByText('Hints (0/3)')).toBeInTheDocument()
    expect(screen.getByText('Hint 1 of 3')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('shows hint progress correctly', () => {
    const labStartTime = Date.now()
    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // Should show hint indicators - there might be multiple "Hint 1" texts
    const hintIndicators = screen.getAllByText(/Hint 1/)
    expect(hintIndicators.length).toBeGreaterThan(0) // Just check that there are some

    // Progress bar should be at 0%
    const progressBar = screen.getByTestId('hint-progress-bar')
    expect(progressBar).toHaveStyle('width: 0%')
  })

  it('allows viewing first hint immediately', async () => {
    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    expect(viewHintButton).toBeEnabled()

    await user.click(viewHintButton)

    expect(mockOnHintViewed).toHaveBeenCalledWith(1, expect.any(Date))
  })

  it('shows viewed hints in history', async () => {
    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Should show in history
    expect(screen.getByText('Previously Viewed Hints')).toBeInTheDocument()
    expect(screen.getByText('First hint')).toBeInTheDocument()
    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('enforces 5-minute cooldown between hints', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Should show second hint
    expect(screen.getByText('Hint 2 of 3')).toBeInTheDocument()

    // But it should be disabled due to cooldown
    const viewSecondHintButton = screen.getByRole('button', { name: /view hint 2/i })
    expect(viewSecondHintButton).toBeDisabled()

    // Should show countdown
    expect(screen.getByText(/next hint available in/i)).toBeInTheDocument()
    expect(screen.getByText('5:00')).toBeInTheDocument()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('updates cooldown timer', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Fast-forward 30 seconds
    mockNow += 30000
    vi.advanceTimersByTime(30000)
    vi.runOnlyPendingTimers()

    await waitFor(() => {
      expect(screen.getByText('4:30')).toBeInTheDocument()
    }, { timeout: 10000 })

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('allows next hint after cooldown expires', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Fast-forward past cooldown
    mockNow += 5 * 60 * 1000 + 1000
    vi.advanceTimersByTime(5 * 60 * 1000 + 1000)

    await waitFor(() => {
      const viewSecondHintButton = screen.getByRole('button', { name: /view hint 2/i })
      expect(viewSecondHintButton).toBeEnabled()
    })

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows solution available after 90 minutes', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // Initially no solution available
    expect(screen.queryByText('Solution Available')).not.toBeInTheDocument()

    // Fast-forward 90 minutes
    mockNow += 90 * 60 * 1000
    vi.advanceTimersByTime(90 * 60 * 1000)

    // Wait for solution to become available
    await waitFor(() => {
      expect(screen.getByText('Solution Available')).toBeInTheDocument()
    }, { timeout: 2000 })

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows all hints used message when no more hints available', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View all hints
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        // Wait for cooldown to expire
        mockNow += 5 * 60 * 1000 + 1000
        vi.advanceTimersByTime(5 * 60 * 1000 + 1000)
        await waitFor(() => {
          expect(screen.getByRole('button', { name: new RegExp(`view hint ${i + 1}`, 'i') })).toBeEnabled()
        })
      }
    }

    // Should show all hints used
    expect(screen.getByText('All Hints Used')).toBeInTheDocument()
    expect(screen.getByText(/all available hints\. the full solution will unlock/i)).toBeInTheDocument()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows remaining time until solution when all hints used', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View all hints quickly
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        mockNow += 5 * 60 * 1000 + 1000
        vi.advanceTimersByTime(5 * 60 * 1000 + 1000)
      }
    }

    // Should show time remaining until solution
    expect(screen.getByText(/time remaining:/i)).toBeInTheDocument()
    expect(screen.getByText('90:00')).toBeInTheDocument()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('updates solution countdown timer', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View all hints
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        mockNow += 5 * 60 * 1000 + 1000
        vi.advanceTimersByTime(5 * 60 * 1000 + 1000)
      }
    }

    // Fast-forward 30 minutes
    mockNow += 30 * 60 * 1000
    vi.advanceTimersByTime(30 * 60 * 1000)

    await waitFor(() => {
      expect(screen.getByText('60:00')).toBeInTheDocument()
    })

    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('shows correct difficulty indicators', () => {
    const labStartTime = Date.now()
    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    expect(screen.getByText('easy')).toBeInTheDocument()
  })

  it('shows hint cooldown message', async () => {
    vi.useFakeTimers()
    let mockNow = Date.now()
    vi.spyOn(Date, 'now').mockImplementation(() => mockNow)

    const labStartTime = Date.now()
    const user = userEvent.setup({ delay: null })

    render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Should show cooldown message
    expect(screen.getByText(/next hint will be available in 5 minutes/i)).toBeInTheDocument()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })
})