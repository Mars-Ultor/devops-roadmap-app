/**
 * Production Scenario Utilities
 * Helper functions for scenario attempts and performance
 */

import type {
  ScenarioAttempt,
  ScenarioPerformance,
} from "../../types/scenarios";

/** Calculate efficiency score from attempt data */
export function calculateEfficiency(
  attempt: ScenarioAttempt,
  totalTime: number,
): number {
  const timeEfficiency = Math.max(0, 100 - totalTime / 60);
  const hintPenalty = attempt.hintsUsed * 10;
  const rollbackPenalty = attempt.rollbacksRequired * 5;
  return Math.max(
    0,
    Math.min(100, timeEfficiency - hintPenalty - rollbackPenalty),
  );
}

/** Calculate accuracy score from attempt data */
export function calculateAccuracy(attempt: ScenarioAttempt): number {
  const baseAccuracy = attempt.rootCauseIdentified ? 100 : 0;
  const attemptPenalty = (attempt.rootCauseAttempts - 1) * 20;
  return Math.max(0, baseAccuracy - attemptPenalty);
}

/** Calculate total weighted score */
export function calculateTotalScore(
  attempt: ScenarioAttempt,
  efficiency: number,
  accuracyScore: number,
): number {
  const completionRate =
    (attempt.stepsCompleted.length + attempt.resolutionStepsCompleted.length) /
    10;
  const completionScore = completionRate * 100;
  return Math.round(
    accuracyScore * 0.4 + efficiency * 0.3 + completionScore * 0.3,
  );
}

/** Calculate skill growth */
export function calculateSkillGrowth(
  current: number,
  newScore: number,
): number {
  return Math.min(100, current + (newScore - current) * 0.2);
}

/** Calculate percentile based on average time */
export function calculatePercentile(avgTime: number): number {
  if (avgTime < 300) return 95;
  if (avgTime < 600) return 75;
  if (avgTime < 900) return 50;
  if (avgTime < 1200) return 25;
  return 10;
}

/** Calculate mastery level */
export function calculateMasteryLevel(
  attempts: number,
  successful: number,
  bestScore: number,
): "novice" | "competent" | "proficient" | "expert" {
  if (attempts < 2) return "novice";
  const successRate = successful / attempts;
  if (successRate >= 0.9 && bestScore >= 90) return "expert";
  if (successRate >= 0.7 && bestScore >= 75) return "proficient";
  if (successRate >= 0.5 && bestScore >= 60) return "competent";
  return "novice";
}

/** Create initial attempt object */
export function createInitialAttempt(
  userId: string,
  scenarioId: string,
): ScenarioAttempt {
  return {
    id: "",
    userId,
    scenarioId,
    startedAt: new Date(),
    stepsCompleted: [],
    hintsUsed: 0,
    investigationTime: 0,
    rootCauseIdentified: false,
    rootCauseAttempts: 0,
    resolutionStepsCompleted: [],
    resolutionTime: 0,
    rollbacksRequired: 0,
    success: false,
    score: 0,
    efficiency: 0,
    accuracyScore: 0,
    lessonsLearned: [],
    mistakesMade: [],
  };
}

/** Calculate updated performance from attempt */
export function calculateUpdatedPerformance(
  userId: string,
  scenarioId: string,
  attempt: ScenarioAttempt,
  existingPerf: ScenarioPerformance | null,
): ScenarioPerformance {
  const newAttempts = (existingPerf?.attempts || 0) + 1;
  const newSuccessful =
    (existingPerf?.successfulAttempts || 0) + (attempt.success ? 1 : 0);
  const totalTime =
    (existingPerf?.averageTimeToResolve || 0) * (existingPerf?.attempts || 0);
  const attemptTime = attempt.investigationTime + attempt.resolutionTime;
  const newAvgTime = (totalTime + attemptTime) / newAttempts;

  return {
    userId,
    scenarioId,
    attempts: newAttempts,
    successfulAttempts: newSuccessful,
    averageTimeToResolve: newAvgTime,
    bestScore: Math.max(existingPerf?.bestScore || 0, attempt.score),
    investigationSkillGrowth: calculateSkillGrowth(
      existingPerf?.investigationSkillGrowth || 0,
      attempt.accuracyScore,
    ),
    resolutionSkillGrowth: calculateSkillGrowth(
      existingPerf?.resolutionSkillGrowth || 0,
      attempt.efficiency,
    ),
    troubleshootingSpeed: calculatePercentile(newAvgTime),
    lastAttemptedAt: new Date(),
    masteryLevel: calculateMasteryLevel(
      newAttempts,
      newSuccessful,
      attempt.score,
    ),
  };
}
