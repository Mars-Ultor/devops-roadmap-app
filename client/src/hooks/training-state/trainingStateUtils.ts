/**
 * Training State Utilities
 * Helper functions for building training state
 */

import type { UserTrainingState, LearningMetrics, BattleDrillStats } from '../../types/training';

/** Default battle drill stats */
export function getDefaultBattleDrillStats(): BattleDrillStats {
  return {
    averageTime: 0,
    bestTime: undefined,
    improvementRate: 0,
    drillsCompleted: 0
  };
}

/** Default learning metrics */
export function getDefaultLearningMetrics(userId: string, week: number): LearningMetrics {
  return {
    userId,
    week,
    battleDrillStats: getDefaultBattleDrillStats(),
    averageStruggleEndurance: 0,
    firstTrySuccessRate: 0,
    hintsRequestedPerLab: 0,
    resetsUsedThisWeek: 0,
    errorPatterns: [],
    degradingSkills: [],
    topicMastery: {},
    productivityByHour: {},
    totalTimeSpent: 0
  };
}

/** Build full training state object */
export function buildTrainingState(
  userId: string,
  currentWeek: number,
  dailyDrillCompleted: boolean,
  resetTokensRemaining: number,
  currentStreak: number,
  longestStreak: number
): UserTrainingState {
  return {
    userId,
    currentWeek,
    currentLesson: undefined,
    lessonsCompleted: [],
    lessonsMastered: [],
    weeksMastered: [],
    dailyDrillCompleted,
    resetTokensRemaining,
    currentStreak,
    longestStreak,
    metrics: getDefaultLearningMetrics(userId, currentWeek)
  };
}
