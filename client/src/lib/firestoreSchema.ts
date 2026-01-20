/**
 * Firestore Database Schema for Military Training System
 *
 * Collections:
 * - masteryProgress: User progress through 4 mastery levels per lesson
 * - battleDrillAttempts: Individual drill attempt records
 * - battleDrillPerformance: Aggregate performance per drill per user
 * - afterActionReviews: Required reflection after labs/drills
 * - struggleSessions: Time-boxed hint restriction tracking
 * - failureLog: Comprehensive error documentation
 * - dailyDrills: Required daily drill completion tracking
 * - resetTokens: Limited environment reset tracking
 * - performanceMetrics: Weekly aggregated metrics
 * - progressStreaks: Daily streak tracking
 * - adaptiveDifficulty: Dynamic difficulty adjustment profiles
 */

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type {
  LessonMastery,
  BattleDrillPerformance,
  DailyDrill,
  ResetToken,
  PerformanceMetrics,
  ProgressStreak,
  AdaptiveDifficultyProfile,
} from "../types/training";

/**
 * Initialize user training state with default values
 */
export async function initializeUserTrainingState(
  userId: string,
  currentWeek: number = 1,
) {
  try {
    // Initialize reset tokens
    const resetTokenRef = doc(db, "resetTokens", userId);
    const resetTokenSnap = await getDoc(resetTokenRef);

    if (!resetTokenSnap.exists()) {
      const initialTokens: ResetToken = {
        week: currentWeek,
        tokensRemaining: currentWeek <= 4 ? 999 : currentWeek <= 8 ? 5 : 2, // Unlimited (999) for weeks 1-4
        maxTokensPerWeek: currentWeek <= 4 ? 999 : currentWeek <= 8 ? 5 : 2,
        lastResetAt: new Date(),
      };
      await setDoc(resetTokenRef, initialTokens);
    }

    // Initialize progress streak
    const streakRef = doc(db, "progressStreaks", userId);
    const streakSnap = await getDoc(streakRef);

    if (!streakSnap.exists()) {
      const initialStreak: ProgressStreak = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: new Date(),
        forgivenessTokensRemaining: 1,
        milestones: [],
      };
      await setDoc(streakRef, initialStreak);
    }

    // Initialize adaptive difficulty profile
    const difficultyRef = doc(db, "adaptiveDifficulty", userId);
    const difficultySnap = await getDoc(difficultyRef);

    if (!difficultySnap.exists()) {
      const initialDifficulty: AdaptiveDifficultyProfile = {
        performanceMetrics: {
          averageCompletionTime: 0,
          hintsNeeded: 0,
          errorFrequency: 0,
          firstAttemptSuccess: 0,
        },
        currentDifficulty: "standard",
        adjustments: {
          timeMultiplier: 1.0,
          hintAvailability: "standard",
          scenarioComplexity: "standard",
        },
        learningPath: {
          strongTopics: [],
          weakTopics: [],
          skipRecommendations: [],
          extraPractice: [],
        },
      };
      await setDoc(difficultyRef, initialDifficulty);
    }

    console.log("✅ User training state initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing user training state:", error);
    return false;
  }
}

/**
 * Initialize lesson mastery tracking for a specific lesson
 */
export async function initializeLessonMastery(
  userId: string,
  lessonId: string,
) {
  const masteryRef = doc(db, "masteryProgress", `${userId}_${lessonId}`);
  const masterySnap = await getDoc(masteryRef);

  if (!masterySnap.exists()) {
    const initialMastery: LessonMastery = {
      lessonId,
      userId,
      crawl: {
        unlocked: true,
        attempts: 0,
        perfectCompletions: 0,
        requiredPerfectCompletions: 3,
        averageTime: 0,
      },
      walk: {
        unlocked: false,
        attempts: 0,
        perfectCompletions: 0,
        requiredPerfectCompletions: 3,
        averageTime: 0,
      },
      runGuided: {
        unlocked: false,
        attempts: 0,
        perfectCompletions: 0,
        requiredPerfectCompletions: 2,
        averageTime: 0,
      },
      runIndependent: {
        unlocked: false,
        attempts: 0,
        perfectCompletions: 0,
        requiredPerfectCompletions: 1,
        averageTime: 0,
      },
      currentLevel: "crawl",
      fullyMastered: false,
    };

    await setDoc(masteryRef, initialMastery);
    return initialMastery;
  }

  return masterySnap.data() as LessonMastery;
}

/**
 * Initialize battle drill performance tracking
 */
export async function initializeBattleDrillPerformance(
  userId: string,
  drillId: string,
) {
  const performanceRef = doc(
    db,
    "battleDrillPerformance",
    `${userId}_${drillId}`,
  );
  const performanceSnap = await getDoc(performanceRef);

  if (!performanceSnap.exists()) {
    const initialPerformance: BattleDrillPerformance = {
      drillId,
      userId,
      attempts: 0,
      bestTime: 0,
      averageTime: 0,
      successRate: 0,
      masteryLevel: "novice",
      lastAttemptDate: new Date(),
      needsRecertification: false,
      // certificationExpiresAt is optional and will be set when needed
    };

    await setDoc(performanceRef, initialPerformance);
    return initialPerformance;
  }

  return performanceSnap.data() as BattleDrillPerformance;
}

/**
 * Check if daily drill is required and completed
 */
export async function checkDailyDrillStatus(
  userId: string,
): Promise<DailyDrill | null> {
  const today = new Date().toISOString().split("T")[0];
  const drillRef = doc(db, "dailyDrills", userId, "drills", today);
  const drillSnap = await getDoc(drillRef);

  if (drillSnap.exists()) {
    return drillSnap.data() as DailyDrill;
  }

  return null;
}

/**
 * Get or consume reset token
 */
export async function consumeResetToken(
  userId: string,
  currentWeek: number,
): Promise<boolean> {
  const tokenRef = doc(db, "resetTokens", userId);
  const tokenSnap = await getDoc(tokenRef);

  if (!tokenSnap.exists()) {
    await initializeUserTrainingState(userId, currentWeek);
    const newSnap = await getDoc(tokenRef);
    if (!newSnap.exists()) return false;
  }

  const tokenData = tokenSnap.data() as ResetToken;

  if (tokenData.tokensRemaining > 0) {
    await setDoc(tokenRef, {
      ...tokenData,
      tokensRemaining: tokenData.tokensRemaining - 1,
      lastResetAt: new Date(),
    });
    return true;
  }

  return false;
}

/**
 * Get current reset token count
 */
export async function getResetTokenCount(userId: string): Promise<number> {
  const tokenRef = doc(db, "resetTokens", userId);
  const tokenSnap = await getDoc(tokenRef);

  if (!tokenSnap.exists()) {
    return 0;
  }

  const tokenData = tokenSnap.data() as ResetToken;
  return tokenData.tokensRemaining;
}

/**
 * Update weekly reset tokens based on new week
 */
export async function updateWeeklyTokens(userId: string, newWeek: number) {
  const tokenRef = doc(db, "resetTokens", userId);

  const maxTokens = newWeek <= 4 ? 999 : newWeek <= 8 ? 5 : 2;

  const updatedTokens: ResetToken = {
    week: newWeek,
    tokensRemaining: maxTokens,
    maxTokensPerWeek: maxTokens,
    lastResetAt: new Date(),
  };

  await setDoc(tokenRef, updatedTokens);
}

/**
 * Refresh performance metrics for analytics
 */
export async function refreshPerformanceMetrics(
  userId: string,
): Promise<PerformanceMetrics> {
  // This will be implemented to aggregate data from all collections
  // For now, return a stub
  const metricsRef = doc(db, "performanceMetrics", userId);
  const metricsSnap = await getDoc(metricsRef);

  if (metricsSnap.exists()) {
    return metricsSnap.data() as PerformanceMetrics;
  }

  // Return empty metrics
  return {
    userId,
    week: 1,
    battleDrillStats: {
      averageTime: 0,
      bestTime: undefined,
      improvementRate: 0,
      drillsCompleted: 0,
    },
    averageStruggleEndurance: 0,
    firstTrySuccessRate: 0,
    hintsRequestedPerLab: 0,
    resetsUsedThisWeek: 0,
    errorPatterns: [],
    degradingSkills: [],
    topicMastery: {},
    productivityByHour: {},
    totalTimeSpent: 0,
  };
}
