/**
 * Progress Hook Utilities
 * Extracted utility functions and constants from useProgress
 * For ESLint compliance (max-lines-per-function)
 */

import type { Badge, LessonProgress } from './useProgress';

// ============================================================================
// Badge Constants
// ============================================================================

export const BADGES: Badge[] = [
  {
    id: 'first-lab',
    title: 'First Steps',
    description: 'Complete your first lab',
    icon: '🎯',
    xp: 50,
    requirement: { id: 'first-lab', type: 'labs_completed', value: 1 }
  },
  {
    id: 'lab-novice',
    title: 'Lab Novice',
    description: 'Complete 5 labs',
    icon: '⚡',
    xp: 100,
    requirement: { id: 'lab-novice', type: 'labs_completed', value: 5 }
  },
  {
    id: 'xp-hunter',
    title: 'XP Hunter',
    description: 'Earn 500 XP',
    icon: '💎',
    xp: 100,
    requirement: { id: 'xp-hunter', type: 'xp_earned', value: 500 }
  },
  {
    id: 'week-one-warrior',
    title: 'Week One Warrior',
    description: 'Complete all Week 1 labs',
    icon: '🏆',
    xp: 200,
    requirement: { id: 'week-one-warrior', type: 'week_completed', value: 1 }
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xp: 150,
    requirement: { id: 'dedicated-learner', type: 'streak_days', value: 7 }
  }
];

// ============================================================================
// SM-2 Algorithm
// ============================================================================

export interface SM2Result {
  easinessFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: Date;
}

/**
 * SM-2 Spaced Repetition Algorithm
 * Calculate next review interval based on quality of recall (0-5)
 */
export function calculateSM2(
  quality: number,
  easinessFactor: number,
  repetitions: number,
  interval: number
): SM2Result {
  let newEasinessFactor = easinessFactor;
  let newRepetitions = repetitions;
  let newInterval = interval;

  // Update easiness factor
  newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure easiness factor stays within bounds
  if (newEasinessFactor < 1.3) newEasinessFactor = 1.3;
  
  // If quality < 3, reset repetitions (failed recall)
  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Successful recall
    if (repetitions === 0) {
      newInterval = 1; // First review after 1 day
    } else if (repetitions === 1) {
      newInterval = 6; // Second review after 6 days
    } else {
      newInterval = Math.round(interval * newEasinessFactor);
    }
    newRepetitions = repetitions + 1;
  }

  return {
    easinessFactor: newEasinessFactor,
    repetitions: newRepetitions,
    interval: newInterval,
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
  };
}

/**
 * Initialize SM-2 data for first completion
 */
export function initializeSM2Data(): SM2Result {
  return {
    easinessFactor: 2.5,
    repetitions: 1,
    interval: 1,
    nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
  };
}

// ============================================================================
// Progress Utilities
// ============================================================================

/**
 * Check if a lesson is due for review based on SM-2 algorithm
 */
export function isLessonDueForReview(lessonProgress: LessonProgress | null): boolean {
  if (!lessonProgress) return false;
  return new Date() >= lessonProgress.nextReviewDate;
}

/**
 * Parse lab ID to extract week and lab numbers
 */
export function parseLabId(labId: string): { weekNum: string; labNum: string } | null {
  const match = labId.match(/w(\d+)-lab(\d+)/);
  if (!match) return null;
  return { weekNum: match[1], labNum: match[2] };
}

/**
 * Convert Firestore document data to LessonProgress
 */
export function docToLessonProgress(data: Record<string, unknown>): LessonProgress {
  return {
    lessonId: data.lessonId as string,
    completedAt: (data.completedAt as { toDate: () => Date })?.toDate(),
    xpEarned: data.xpEarned as number,
    easinessFactor: data.easinessFactor as number,
    repetitions: data.repetitions as number,
    interval: data.interval as number,
    nextReviewDate: (data.nextReviewDate as { toDate: () => Date })?.toDate(),
    lastReviewQuality: data.lastReviewQuality as number
  };
}

/**
 * Show badge notification (placeholder for toast integration)
 */
export function showBadgeNotification(badge: Badge): void {
  console.log(`🎉 New badge unlocked: ${badge.icon} ${badge.title}`);
}

// ============================================================================
// Badge Requirement Checker
// ============================================================================

import { curriculumData } from '../../data/curriculumData';
import { doc, getDoc, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export async function checkBadgeRequirementHelper(
  badge: Badge,
  labsCompleted: number,
  userData: Record<string, unknown> | undefined,
  userId: string
): Promise<boolean> {
  switch (badge.requirement.type) {
    case 'labs_completed': return labsCompleted >= badge.requirement.value;
    case 'xp_earned': return (userData?.totalXP as number || 0) >= badge.requirement.value;
    case 'week_completed': {
      const weekData = curriculumData.find(w => w.weekNumber === badge.requirement.value);
      if (!weekData) return false;
      const weekLabsSnap = await getDocs(query(collection(db, 'progress'), where('userId', '==', userId), where('type', '==', 'lab'), where('itemId', 'in', weekData.labs.map(l => l.id))));
      return weekLabsSnap.size === weekData.labs.length;
    }
    case 'streak_days': {
      const streakData = (await getDoc(doc(db, 'progressStreaks', userId))).data();
      return (streakData?.currentStreak || 0) >= badge.requirement.value;
    }
    default: return false;
  }
}
