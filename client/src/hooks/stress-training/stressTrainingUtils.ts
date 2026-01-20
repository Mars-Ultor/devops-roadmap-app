/**
 * Stress Training Utilities
 * Helper functions for stress training sessions
 */

import type {
  StressMetrics,
  StressTrainingSession,
} from "../../types/training";

/** Initial stress metrics for new users */
export function getInitialStressMetrics(userId: string): StressMetrics {
  return {
    userId,
    totalSessions: 0,
    sessionsByStressLevel: { none: 0, low: 0, medium: 0, high: 0, extreme: 0 },
    averageStressScore: 0,
    averageAdaptabilityScore: 0,
    stressToleranceLevel: "low",
    performanceDegradation: {
      normalAccuracy: 0,
      stressedAccuracy: 0,
      degradationRate: 0,
    },
    lastUpdated: new Date(),
  };
}

/** Calculate running average */
export function calculateRunningAverage(
  currentAvg: number,
  newValue: number,
  count: number,
): number {
  return (currentAvg * count + newValue) / (count + 1);
}

/** Calculate stress tolerance level based on completed sessions */
export function calculateStressTolerance(
  metrics: StressMetrics,
  latestSession: StressTrainingSession,
): string {
  const { sessionsByStressLevel } = metrics;

  if (
    sessionsByStressLevel.extreme >= 3 &&
    String(latestSession.scenario.stressLevel) === "extreme" &&
    latestSession.succeeded
  ) {
    return "extreme";
  }
  if (
    sessionsByStressLevel.high >= 3 &&
    String(latestSession.scenario.stressLevel) === "high" &&
    latestSession.succeeded
  ) {
    return "high";
  }
  if (
    sessionsByStressLevel.medium >= 3 &&
    String(latestSession.scenario.stressLevel) === "medium" &&
    latestSession.succeeded
  ) {
    return "medium";
  }
  return "low";
}

/** Check if user can attempt a specific stress level */
export function canAttemptLevel(
  stressMetrics: StressMetrics | null,
  level: string,
): boolean {
  if (!stressMetrics) return level === "low";

  const tolerance = stressMetrics.stressToleranceLevel;
  const levelOrder = ["none", "low", "medium", "high", "extreme"];
  const toleranceIndex = levelOrder.indexOf(tolerance);
  const requestedIndex = levelOrder.indexOf(level);

  return requestedIndex <= toleranceIndex;
}

/** Calculate session accuracy */
export function calculateSessionAccuracy(
  tasksCompleted: number,
  errorsCount: number,
  totalTasks: number,
): number {
  return totalTasks > 0
    ? ((tasksCompleted - errorsCount) / totalTasks) * 100
    : 0;
}

/** Calculate performance degradation rate */
export function calculateDegradationRate(
  normalAccuracy: number,
  stressedAccuracy: number,
): number {
  return normalAccuracy > 0
    ? ((normalAccuracy - stressedAccuracy) / normalAccuracy) * 100
    : 0;
}

/** Update session by stress level counter */
export function updateSessionsByLevel(
  current: Record<string, number>,
  level: string,
): Record<string, number> {
  return { ...current, [level]: (current[level] || 0) + 1 };
}

/** Calculate updated metrics after session */
export function calculateUpdatedMetrics(
  metrics: StressMetrics,
  session: StressTrainingSession,
): StressMetrics {
  const newTotalSessions = metrics.totalSessions + 1;
  return {
    ...metrics,
    totalSessions: newTotalSessions,
    sessionsByStressLevel: updateSessionsByLevel(
      metrics.sessionsByStressLevel,
      session.scenario.stressLevel,
    ),
    averageStressScore: calculateRunningAverage(
      metrics.averageStressScore,
      session.stressScore,
      metrics.totalSessions,
    ),
    averageAdaptabilityScore: calculateRunningAverage(
      metrics.averageAdaptabilityScore,
      session.adaptabilityScore,
      metrics.totalSessions,
    ),
    stressToleranceLevel: calculateStressTolerance(metrics, session),
    lastUpdated: new Date(),
  };
}

/** Update performance degradation in metrics */
export function updateMetricsPerformanceDegradation(
  metrics: StressMetrics,
  sessionAccuracy: number,
  normalAccuracy: number,
): StressMetrics {
  const stressedAccuracy = calculateRunningAverage(
    metrics.performanceDegradation.stressedAccuracy,
    sessionAccuracy,
    metrics.totalSessions,
  );
  return {
    ...metrics,
    performanceDegradation: {
      normalAccuracy,
      stressedAccuracy,
      degradationRate: calculateDegradationRate(
        normalAccuracy,
        sessionAccuracy,
      ),
    },
  };
}
