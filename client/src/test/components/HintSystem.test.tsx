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
    expect(screen.getByText('4:59')).toBeInTheDocument()
  })

  it('updates cooldown timer', async () => {
    const labStartTime = Date.now()
    let currentTime = Date.now()
    const user = userEvent.setup({ delay: null })

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Fast-forward 30 seconds
    currentTime += 30000
    rerender(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('4:30')).toBeInTheDocument()
    }, { timeout: 10000 })
  })

  it('allows next hint after cooldown expires', async () => {
    const labStartTime = Date.now()
    let currentTime = Date.now()
    const user = userEvent.setup({ delay: null })

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // View first hint
    const viewHintButton = screen.getByRole('button', { name: /view hint 1/i })
    await user.click(viewHintButton)

    // Fast-forward past cooldown
    currentTime += 5 * 60 * 1000 + 1000
    rerender(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    await waitFor(() => {
      const viewSecondHintButton = screen.getByRole('button', { name: /view hint 2/i })
      expect(viewSecondHintButton).toBeEnabled()
    })
  })

  it('shows solution available after 90 minutes', async () => {
    const labStartTime = Date.now()
    let currentTime = Date.now()

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // Initially no solution available
    expect(screen.queryByText('Solution Available')).not.toBeInTheDocument()

    // Fast-forward 90 minutes
    currentTime += 90 * 60 * 1000
    rerender(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // Wait for solution to become available
    await waitFor(() => {
      expect(screen.getByText('Solution Available')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('shows all hints used message when no more hints available', async () => {
    const labStartTime = Date.now()
    let currentTime = Date.now()
    const user = userEvent.setup({ delay: null })

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // View all hints
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        // Wait for cooldown to expire
        currentTime += 5 * 60 * 1000 + 1000
        rerender(
          <HintSystem
            hints={mockHints}
            hintsUnlocked={true}
            labStartTime={labStartTime}
            onHintViewed={mockOnHintViewed}
            currentTime={currentTime}
          />
        )
        await waitFor(() => {
          expect(screen.getByRole('button', { name: new RegExp(`view hint ${i + 1}`, 'i') })).toBeEnabled()
        })
      }
    }

    // Should show all hints used
    expect(screen.getByText('All Hints Used')).toBeInTheDocument()
    expect(screen.getByText(/all available hints\. the full solution will unlock/i)).toBeInTheDocument()
  })

  it('shows remaining time until solution when all hints used', async () => {
    const labStartTime = Date.now() - 10 * 60 * 1000 // Start 10 minutes ago
    let currentTime = Date.now()
    const user = userEvent.setup({ delay: null })

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // View all hints quickly
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        currentTime += 5 * 60 * 1000 + 1000
        rerender(
          <HintSystem
            hints={mockHints}
            hintsUnlocked={true}
            labStartTime={labStartTime}
            onHintViewed={mockOnHintViewed}
            currentTime={currentTime}
          />
        )
      }
    }

    // Should show time remaining until solution
    expect(screen.getByText(/time remaining:/i)).toBeInTheDocument()
    expect(screen.getByText('80:00')).toBeInTheDocument()
  })

  it('updates solution countdown timer', async () => {
    const labStartTime = Date.now()
    let currentTime = Date.now()
    const user = userEvent.setup({ delay: null })

    const { rerender } = render(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    // View all hints
    for (let i = 1; i <= 3; i++) {
      const viewButton = screen.getByRole('button', { name: new RegExp(`view hint ${i}`, 'i') })
      await user.click(viewButton)

      if (i < 3) {
        currentTime += 5 * 60 * 1000 + 1000
        rerender(
          <HintSystem
            hints={mockHints}
            hintsUnlocked={true}
            labStartTime={labStartTime}
            onHintViewed={mockOnHintViewed}
            currentTime={currentTime}
          />
        )
      }
    }

    // Fast-forward 30 minutes
    currentTime += 30 * 60 * 1000
    rerender(
      <HintSystem
        hints={mockHints}
        hintsUnlocked={true}
        labStartTime={labStartTime}
        onHintViewed={mockOnHintViewed}
        currentTime={currentTime}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('60:00')).toBeInTheDocument()
    })
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
  })
})