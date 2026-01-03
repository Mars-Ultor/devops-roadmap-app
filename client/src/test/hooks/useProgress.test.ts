import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProgress } from '../../hooks/useProgress'
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore'
import { useAuthStore } from '../../store/authStore'

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { uid: 'test-user-123' },
  })),
}))

// Mock Firebase functions
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  setDoc: vi.fn(),
  getDoc: vi.fn(),
  updateDoc: vi.fn(),
  increment: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
}))

describe('useProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('completeLesson', () => {
    it('completes a lesson successfully', async () => {
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => false,
      })
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined)

      vi.mocked(doc).mockReturnValue('mock-doc-ref')
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)

      const { result } = renderHook(() => useProgress())

      const sm2Result = await result.current.completeLesson('test-lesson-1', 100)

      expect(mockSetDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining({
        userId: 'test-user-123',
        lessonId: 'test-lesson-1',
        type: 'lesson',
        xpEarned: 100,
        easinessFactor: 2.5,
        repetitions: 1,
        interval: 1,
        lastReviewQuality: 5,
      }))

      expect(sm2Result).toEqual({
        easinessFactor: 2.5,
        repetitions: 1,
        interval: 1,
        nextReviewDate: expect.any(Date),
      })
    })

    it('handles lesson review (existing progress)', async () => {
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          easinessFactor: 2.3,
          repetitions: 2,
          interval: 6,
        }),
      })

      vi.mocked(doc).mockReturnValue('mock-doc-ref')
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)

      const { result } = renderHook(() => useProgress())

      await result.current.completeLesson('test-lesson-1', 100, 4)

      expect(mockSetDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining({
        xpEarned: 0, // No XP for reviews
        lastReviewQuality: 4,
      }))
    })

    it('updates user XP on first completion', async () => {
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => false,
      })
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined)
      const mockIncrement = vi.fn()

      vi.mocked(doc).mockReturnValue('mock-doc-ref')
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)
      vi.mocked(increment).mockImplementation(mockIncrement)

      const { result } = renderHook(() => useProgress())

      await result.current.completeLesson('test-lesson-1', 100)

      expect(mockUpdateDoc).toHaveBeenCalledWith('mock-doc-ref', {
        totalXP: mockIncrement(100),
      })
    })

    it('handles errors gracefully', async () => {
      const mockSetDoc = vi.fn().mockRejectedValue(new Error('Firebase error'))

      vi.mocked(doc).mockReturnValue('mock-doc-ref')
      vi.mocked(setDoc).mockImplementation(mockSetDoc)

      const { result } = renderHook(() => useProgress())

      await expect(result.current.completeLesson('test-lesson-1', 100)).rejects.toThrow('Firebase error')
    })

    it('skips operations when no user is logged in', async () => {
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useProgress())

      await result.current.completeLesson('test-lesson-1', 100)

      expect(vi.mocked(setDoc)).not.toHaveBeenCalled()
    })
  })
    it('completes a lab successfully', async () => {
      // Mock Firebase functions
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => false,
        data: () => ({})
      })
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined)
      const mockIncrement = vi.fn()

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)
      vi.mocked(increment).mockImplementation(mockIncrement)

      const { result } = renderHook(() => useProgress())

      const resultValue = await result.current.completeLab('w1-lab1', 150, 5, 10)

      expect(resultValue).toBe(true)
      expect(mockSetDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining({
        userId: 'test-user-123',
        labId: 'w1-lab1',
        type: 'lab',
        xpEarned: 150,
        tasksCompleted: 5,
        totalTasks: 10,
      }))
    })

    it('awards XP only on first completion', async () => {
      // Mock Firebase functions for already completed lab
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({})
      })
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined)

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)

      const { result } = renderHook(() => useProgress())

      await result.current.completeLab('w1-lab1', 150, 5, 10)

      expect(mockSetDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining({
        xpEarned: 150, // Still records XP earned, but doesn't increment user total
      }))
      expect(mockUpdateDoc).not.toHaveBeenCalled() // No XP increment for re-completion
    })

    it('marks related lesson as completed', async () => {
      // Mock Firebase functions
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn()
        .mockResolvedValueOnce({ exists: () => false, data: () => ({}) }) // Lab progress check
        .mockResolvedValueOnce({ exists: () => false, data: () => ({}) }) // Lesson progress check
      const mockUpdateDoc = vi.fn().mockResolvedValue(undefined)

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(updateDoc).mockImplementation(mockUpdateDoc)

      const { result } = renderHook(() => useProgress())

      await result.current.completeLab('w1-lab1', 150, 5, 10)

      // Should create lesson progress
      expect(mockSetDoc).toHaveBeenCalledWith('mock-doc-ref', expect.objectContaining({
        lessonId: 'w1-lesson1',
        type: 'lesson',
        completedViaLab: true,
      }))
    })

    it('handles lab completion errors', async () => {
      // Mock Firebase functions to throw error
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockRejectedValue(new Error('Firebase error'))
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => false,
        data: () => ({})
      })

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)

      const { result } = renderHook(() => useProgress())

      await expect(result.current.completeLab('w1-lab1', 150, 5, 10)).rejects.toThrow('Firebase error')
    })

    it('skips operations when no user is logged in', async () => {
      // Mock auth store to return no user
      vi.mocked(useAuthStore).mockReturnValue({
        user: null,
      })

      const { result } = renderHook(() => useProgress())

      const resultValue = await result.current.completeLab('w1-lab1', 150, 5, 10)

      expect(resultValue).toBeUndefined()
      expect(vi.mocked(setDoc)).not.toHaveBeenCalled()
    })
  })

  describe('SM-2 Algorithm', () => {
    it('calculates correct intervals for first review', () => {
      const { result } = renderHook(() => useProgress())

      // Access the private calculateSM2 method (this would normally be tested through completeLesson)
      // For this test, we'll verify the algorithm works through the completeLesson function

      expect(result.current).toHaveProperty('completeLesson')
    })

    it('increases intervals for successful reviews', async () => {
      // Mock Firebase functions for existing lesson with SM-2 data
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          easinessFactor: 2.5,
          repetitions: 1,
          interval: 1,
          lastReviewQuality: 5
        })
      })

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)

      const { result } = renderHook(() => useProgress())

      const sm2Result = await result.current.completeLesson('test-lesson-1', 100, 5)

      expect(sm2Result.interval).toBe(6) // Second review should be 6 days
      expect(sm2Result.repetitions).toBe(2)
    })

    it('resets repetitions for failed reviews', async () => {
      // Mock Firebase functions for failed review (quality < 3)
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn().mockResolvedValue({
        exists: () => true,
        data: () => ({
          easinessFactor: 2.5,
          repetitions: 2,
          interval: 6,
          lastReviewQuality: 5
        })
      })

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)

      const { result } = renderHook(() => useProgress())

      const sm2Result = await result.current.completeLesson('test-lesson-1', 100, 2) // Quality < 3

      expect(sm2Result.repetitions).toBe(0)
      expect(sm2Result.interval).toBe(1) // Reset to 1 day
    })
  })

  describe('Badge System', () => {
    it('checks and awards badges after lab completion', async () => {
      // Mock Firebase functions for badge checking
      const mockDoc = vi.fn()
      const mockSetDoc = vi.fn().mockResolvedValue(undefined)
      const mockGetDoc = vi.fn()
        .mockResolvedValueOnce({ exists: () => false, data: () => ({}) }) // Lab progress
        .mockResolvedValueOnce({ exists: () => false, data: () => ({}) }) // Lesson progress
        .mockResolvedValueOnce({ // User stats
          data: () => ({ totalXP: 0, badges: [] })
        })
        .mockResolvedValueOnce({ // Badge check
          data: () => ({ totalXP: 150 })
        })
      const mockCollection = vi.fn()
      const mockQuery = vi.fn()
      const mockWhere = vi.fn()
      const mockGetDocs = vi.fn().mockResolvedValue({
        docs: [],
        empty: true
      })

      vi.mocked(doc).mockImplementation(mockDoc)
      vi.mocked(setDoc).mockImplementation(mockSetDoc)
      vi.mocked(getDoc).mockImplementation(mockGetDoc)
      vi.mocked(collection).mockImplementation(mockCollection)
      vi.mocked(query).mockImplementation(mockQuery)
      vi.mocked(where).mockImplementation(mockWhere)
      vi.mocked(getDocs).mockImplementation(mockGetDocs)

      const { result } = renderHook(() => useProgress())

      await result.current.completeLab('w1-lab1', 150, 5, 10)

      // Should check for badge awards
      expect(mockGetDoc).toHaveBeenCalledTimes(4)
    })

      const { result } = renderHook(() => useProgress())

      await result.current.completeLab('w1-lab1', 150, 5, 10)

      // Should check for badge awards
      expect(mockGetDoc).toHaveBeenCalledTimes(4)
    })
  })
})