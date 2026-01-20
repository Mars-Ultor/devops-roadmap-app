/**
 * Progress Hook Utilities
 * Extracted utility functions and constants from useProgress
 * For ESLint compliance (max-lines-per-function)
 */

import type { Badge, LessonProgress } from "./useProgress";

// ============================================================================
// Badge Constants
// ============================================================================

export const BADGES: Badge[] = [
  {
    id: "first-lab",
    title: "First Steps",
    description: "Complete your first lab",
    icon: "🎯",
    xp: 50,
    requirement: { id: "first-lab", type: "labs_completed", value: 1 },
  },
  {
    id: "lab-novice",
    title: "Lab Novice",
    description: "Complete 5 labs",
    icon: "⚡",
    xp: 100,
    requirement: { id: "lab-novice", type: "labs_completed", value: 5 },
  },
  {
    id: "xp-hunter",
    title: "XP Hunter",
    description: "Earn 500 XP",
    icon: "💎",
    xp: 100,
    requirement: { id: "xp-hunter", type: "xp_earned", value: 500 },
  },
  {
    id: "week-one-warrior",
    title: "Week One Warrior",
    description: "Complete all Week 1 labs",
    icon: "🏆",
    xp: 200,
    requirement: { id: "week-one-warrior", type: "week_completed", value: 1 },
  },
  {
    id: "dedicated-learner",
    title: "Dedicated Learner",
    description: "Maintain a 7-day streak",
    icon: "🔥",
    xp: 150,
    requirement: { id: "dedicated-learner", type: "streak_days", value: 7 },
  },
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
  interval: number,
): SM2Result {
  let newEasinessFactor = easinessFactor;
  let newRepetitions = repetitions;
  let newInterval = interval;

  // Update easiness factor
  newEasinessFactor =
    easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

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
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
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
    nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
  };
}

// ============================================================================
// Progress Utilities
// ============================================================================

/**
 * Check if a lesson is due for review based on SM-2 algorithm
 */
export function isLessonDueForReview(
  lessonProgress: LessonProgress | null,
): boolean {
  if (!lessonProgress) return false;
  return new Date() >= lessonProgress.nextReviewDate;
}

/**
 * Parse lab ID to extract week and lab numbers
 */
export function parseLabId(
  labId: string,
): { weekNum: string; labNum: string } | null {
  const match = labId.match(/w(\d+)-lab(\d+)/);
  if (!match) return null;
  return { weekNum: match[1], labNum: match[2] };
}

/**
 * Convert Firestore document data to LessonProgress
 */
export function docToLessonProgress(
  data: Record<string, unknown>,
): LessonProgress {
  return {
    lessonId: data.lessonId as string,
    completedAt: (data.completedAt as { toDate: () => Date })?.toDate(),
    xpEarned: data.xpEarned as number,
    easinessFactor: data.easinessFactor as number,
    repetitions: data.repetitions as number,
    interval: data.interval as number,
    nextReviewDate: (data.nextReviewDate as { toDate: () => Date })?.toDate(),
    lastReviewQuality: data.lastReviewQuality as number,
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

import { curriculumData } from "../../data/curriculumData";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export async function checkBadgeRequirementHelper(
  badge: Badge,
  labsCompleted: number,
  userData: Record<string, unknown> | undefined,
  userId: string,
): Promise<boolean> {
  switch (badge.requirement.type) {
    case "labs_completed":
      return labsCompleted >= badge.requirement.value;
    case "xp_earned":
      return ((userData?.totalXP as number) || 0) >= badge.requirement.value;
    case "week_completed": {
      const weekData = curriculumData.find(
        (w) => w.weekNumber === badge.requirement.value,
      );
      if (!weekData) return false;
      const weekLabsSnap = await getDocs(
        query(
          collection(db, "progress"),
          where("userId", "==", userId),
          where("type", "==", "lab"),
          where(
            "itemId",
            "in",
            weekData.labs.map((l) => l.id),
          ),
        ),
      );
      return weekLabsSnap.size === weekData.labs.length;
    }
    case "streak_days": {
      const streakData = (
        await getDoc(doc(db, "progressStreaks", userId))
      ).data();
      return (streakData?.currentStreak || 0) >= badge.requirement.value;
    }
    default:
      return false;
  }
}

// ============================================================================
// Progress Management Functions
// ============================================================================

export async function completeLessonInDB(
  userId: string,
  lessonId: string,
  xp: number,
  quality = 5,
) {
  const progressRef = doc(db, "progress", `${userId}_${lessonId}`);
  const existingProgress = await getDoc(progressRef);
  const isReview = existingProgress.exists();
  const sm2Data = isReview
    ? calculateSM2(
        quality,
        existingProgress.data()?.easinessFactor || 2.5,
        existingProgress.data()?.repetitions || 0,
        existingProgress.data()?.interval || 0,
      )
    : initializeSM2Data();

  await setDoc(progressRef, {
    userId,
    lessonId,
    type: "lesson",
    completedAt: new Date(),
    xpEarned: isReview ? 0 : xp,
    ...sm2Data,
    lastReviewQuality: quality,
  });

  if (!isReview) {
    await updateDoc(doc(db, "users", userId), { totalXP: increment(xp) });
  }

  return sm2Data;
}

export async function markRelatedLessonCompleteInDB(
  userId: string,
  weekNum: string,
  labNum: string,
) {
  const lessonId = `w${weekNum}-lesson${labNum}`;
  const lessonRef = doc(db, "progress", `${userId}_${lessonId}`);
  if (!(await getDoc(lessonRef)).exists()) {
    await setDoc(lessonRef, {
      userId,
      lessonId,
      type: "lesson",
      completedAt: new Date(),
      xpEarned: 0,
      ...initializeSM2Data(),
      lastReviewQuality: 5,
      completedViaLab: true,
    });
  }
}

export async function awardBadgeToUser(userId: string, badge: Badge) {
  await setDoc(doc(db, "badges", `${userId}_${badge.id}`), {
    userId,
    badgeId: badge.id,
    title: badge.title,
    description: badge.description,
    icon: badge.icon,
    xpEarned: badge.xp,
    earnedAt: new Date(),
  });
  await updateDoc(doc(db, "users", userId), {
    totalXP: increment(badge.xp),
  });
  showBadgeNotification(badge);
}

export async function checkAndAwardBadgesForUser(userId: string) {
  const userData = (await getDoc(doc(db, "users", userId))).data();
  const labsCompleted = (
    await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", userId),
        where("type", "==", "lab"),
      ),
    )
  ).size;

  for (const badge of BADGES) {
    if ((await getDoc(doc(db, "badges", `${userId}_${badge.id}`))).exists())
      continue;
    if (await checkBadgeRequirementHelper(badge, labsCompleted, userData, userId))
      await awardBadgeToUser(userId, badge);
  }
}

export async function completeLabInDB(
  userId: string,
  labId: string,
  xp: number,
  tasksCompleted: number,
  totalTasks: number,
) {
  const progressRef = doc(db, "progress", `${userId}_${labId}`);
  const alreadyCompleted = (await getDoc(progressRef)).exists();
  await setDoc(progressRef, {
    userId,
    labId,
    type: "lab",
    completedAt: new Date(),
    xpEarned: xp,
    tasksCompleted,
    totalTasks,
  });

  if (!alreadyCompleted) {
    await updateDoc(doc(db, "users", userId), { totalXP: increment(xp) });
    const parsed = parseLabId(labId);
    if (parsed) await markRelatedLessonCompleteInDB(userId, parsed.weekNum, parsed.labNum);
  }

  await checkAndAwardBadgesForUser(userId);
  return true;
}

export async function getLabProgressFromDB(
  userId: string,
  labId: string,
): Promise<boolean> {
  return (await getDoc(doc(db, "progress", `${userId}_${labId}`))).exists();
}

export async function getLessonProgressFromDB(
  userId: string,
  lessonId: string,
): Promise<LessonProgress | null> {
  const snap = await getDoc(doc(db, "progress", `${userId}_${lessonId}`));
  return snap.exists() ? docToLessonProgress(snap.data()) : null;
}

export async function getLessonsDueForReviewFromDB(
  userId: string,
): Promise<LessonProgress[]> {
  const snap = await getDocs(
    query(
      collection(db, "progress"),
      where("userId", "==", userId),
      where("type", "==", "lesson"),
      where("nextReviewDate", "<=", new Date()),
    ),
  );
  return snap.docs.map((d) => docToLessonProgress(d.data()));
}

export async function getAllLessonProgressFromDB(
  userId: string,
): Promise<LessonProgress[]> {
  const snap = await getDocs(
    query(
      collection(db, "progress"),
      where("userId", "==", userId),
      where("type", "==", "lesson"),
    ),
  );
  return snap.docs.map((d) => docToLessonProgress(d.data()));
}

export async function getUserStatsFromDB(userId: string) {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    totalXP: data.totalXP || 0,
    currentWeek: data.currentWeek || 1,
    name: data.name,
    email: data.email,
  };
}
