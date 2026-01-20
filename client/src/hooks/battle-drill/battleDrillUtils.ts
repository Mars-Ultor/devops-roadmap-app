/**
 * Battle Drill Utilities
 * Extracted helper functions for ESLint compliance
 */

import type { BattleDrillPerformance } from "../types/training";

// ============================================================================
// Mastery Level Calculation
// ============================================================================

export function calculateMasteryLevel(
  successRate: number,
  bestTime: number,
  targetTimeSeconds: number,
): BattleDrillPerformance["masteryLevel"] {
  if (successRate >= 0.9 && bestTime <= targetTimeSeconds) return "expert";
  if (successRate >= 0.75 && bestTime <= targetTimeSeconds * 1.25)
    return "proficient";
  if (successRate >= 0.5) return "competent";
  return "novice";
}

// ============================================================================
// Performance Stats Calculation
// ============================================================================

export interface PerformanceStats {
  attempts: number;
  bestTime: number;
  averageTime: number;
  successRate: number;
  masteryLevel: BattleDrillPerformance["masteryLevel"];
}

export function calculateUpdatedPerformance(
  current: BattleDrillPerformance,
  passed: boolean,
  durationSeconds: number,
  targetTimeSeconds: number,
): PerformanceStats {
  const newAttempts = current.attempts + 1;
  const newBestTime =
    passed && durationSeconds < current.bestTime
      ? durationSeconds
      : current.bestTime;

  // Calculate new average (only for passed attempts)
  let newAverageTime = current.averageTime;
  if (passed) {
    const totalTime =
      current.averageTime * (current.attempts || 0) + durationSeconds;
    newAverageTime = totalTime / newAttempts;
  }

  const successCount = passed
    ? current.successRate * current.attempts + 1
    : current.successRate * current.attempts;
  const newSuccessRate = successCount / newAttempts;

  const masteryLevel = calculateMasteryLevel(
    newSuccessRate,
    newBestTime,
    targetTimeSeconds,
  );

  return {
    attempts: newAttempts,
    bestTime: newBestTime,
    averageTime: newAverageTime,
    successRate: newSuccessRate,
    masteryLevel,
  };
}

// ============================================================================
// Attempt Result
// ============================================================================

export interface AttemptResult {
  durationSeconds: number;
  passed: boolean;
  beatTarget: boolean;
  personalBest: boolean;
}

export function createAttemptResult(
  durationSeconds: number,
  passed: boolean,
  targetTimeSeconds: number,
  currentBestTime: number | undefined,
): AttemptResult {
  return {
    durationSeconds,
    passed,
    beatTarget: durationSeconds <= targetTimeSeconds,
    personalBest:
      currentBestTime !== undefined && durationSeconds < currentBestTime,
  };
}

// ============================================================================
// Session Utilities
// ============================================================================

export interface SessionResetState {
  sessionStarted: boolean;
  elapsedSeconds: number;
  completedSteps: Set<number>;
  showHints: Set<number>;
  stepInputs: Record<number, string>;
  validationResults: Record<number, unknown>;
  validatingStep: number | null;
  sessionComplete: boolean;
  sessionResult: unknown;
  showAARForm: boolean;
  aarSubmitted: boolean;
  submittedAAR: unknown;
  showFailureLog: boolean;
}

export function getResetSessionState(): SessionResetState {
  return {
    sessionStarted: false,
    elapsedSeconds: 0,
    completedSteps: new Set<number>(),
    showHints: new Set<number>(),
    stepInputs: {},
    validationResults: {},
    validatingStep: null,
    sessionComplete: false,
    sessionResult: null,
    showAARForm: false,
    aarSubmitted: false,
    submittedAAR: null,
    showFailureLog: false,
  };
}

export function getStartSessionState(): Partial<SessionResetState> {
  return {
    sessionStarted: true,
    elapsedSeconds: 0,
    completedSteps: new Set<number>(),
    showHints: new Set<number>(),
    stepInputs: {},
    validationResults: {},
    validatingStep: null,
    sessionComplete: false,
    sessionResult: null,
    showAARForm: false,
    aarSubmitted: false,
    submittedAAR: null,
    showFailureLog: false,
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getTimeColor(
  elapsedSeconds: number,
  targetTimeSeconds: number | undefined,
): string {
  if (!targetTimeSeconds) return "text-white";
  if (elapsedSeconds <= targetTimeSeconds) return "text-green-400";
  if (elapsedSeconds <= targetTimeSeconds * 1.5) return "text-yellow-400";
  return "text-red-400";
}
