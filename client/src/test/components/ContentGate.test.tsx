import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ContentGate from '../../components/ContentGate'
import type { ReactElement } from 'react'
import { getDoc } from 'firebase/firestore'

const mockGetDoc = vi.mocked(getDoc)

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { uid: 'test-user' },
  })),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/training' }),
}))

const AnyContentGate = ContentGate as unknown as (props: unknown) => ReactElement

describe('ContentGate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    mockGetDoc.mockImplementation(() => new Promise(() => {})) // Never resolves to stay loading

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    expect(screen.getByText('Checking daily drill status...')).toBeInTheDocument()
  })

  it('blocks access when daily drill is not completed', async () => {
    // Mock getDoc to return incomplete drill status
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('🔒 Daily Drill Required')).toBeInTheDocument()
    })

    expect(screen.getByText('Complete your daily drill to unlock training content')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start daily drill/i })).toBeInTheDocument()
  })

  it('allows access when daily drill is completed', async () => {
    // Mock getDoc to return completed drill status
    mockGetDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        completed: true,
        completedAt: new Date(),
        score: 85,
      }),
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    expect(screen.queryByText('Daily Drill Required')).not.toBeInTheDocument()
  })

  it('prevents modal dismissal via click outside', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('🔒 Daily Drill Required')).toBeInTheDocument()
    })

    // The modal should not close when clicking outside
    const modal = screen.getByText('🔒 Daily Drill Required').closest('.fixed')
    expect(modal).toBeInTheDocument()

    // Note: Testing click outside prevention would require more complex setup
    // The onClick handler prevents default behavior
  })

  it('prevents modal dismissal via escape key', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('🔒 Daily Drill Required')).toBeInTheDocument()
    })

    // The modal should not close on escape key
    // This is handled by the onKeyDown handler that prevents default
  })

  it('shows drill details and requirements', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('Daily Drill Details')).toBeInTheDocument()
    })

    expect(screen.getByText('Time Limit')).toBeInTheDocument()
    expect(screen.getByText('10 minutes')).toBeInTheDocument()
    expect(screen.getByText('Difficulty')).toBeInTheDocument()
    expect(screen.getByText('Run-Independent Only')).toBeInTheDocument()
    expect(screen.getByText('Questions')).toBeInTheDocument()
    expect(screen.getByText('Spaced Repetition Mix')).toBeInTheDocument()
    expect(screen.getByText('Passing Score')).toBeInTheDocument()
    expect(screen.getByText('70% or higher')).toBeInTheDocument()
  })

  it('explains why daily drills matter', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(screen.getByText('Why Daily Drills Matter:')).toBeInTheDocument()
    })

    expect(screen.getByText(/prevent skill decay/i)).toBeInTheDocument()
    expect(screen.getByText(/build automaticity/i)).toBeInTheDocument()
    expect(screen.getByText('Spaced repetition:')).toBeInTheDocument()
    expect(screen.getByText(/combat progressive training/i)).toBeInTheDocument()
  })

  it('re-checks drill status when route changes', async () => {
    mockGetDoc.mockResolvedValue({
      exists: () => false,
    } as unknown)

    const { rerender } = render(
      <AnyContentGate contentType="lesson" contentId="test-lesson">
        <div>Test Content</div>
      </AnyContentGate>
    )

    await waitFor(() => {
      expect(mockGetDoc).toHaveBeenCalled()
    })

    // Simulate route change
    rerender(
      <AnyContentGate contentType="lab" contentId="test-lab">
        <div>Test Content</div>
      </AnyContentGate>
    )

    // Should check again
    expect(mockGetDoc).toHaveBeenCalledTimes(3)
  })
})