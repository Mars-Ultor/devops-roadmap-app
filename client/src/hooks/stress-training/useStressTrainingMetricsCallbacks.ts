/**
 * Stress Training Metrics Callbacks
 * Extracted metrics-related callbacks
 */

import { useCallback } from "react";
import type { StressTrainingSession } from "../../types/training";
import {
  calculateStressScore,
  calculateFatigueLevel,
  calculateFocusLevel,
} from "../../data/stressScenarios";

interface MetricsCallbacks {
  setCurrentSession: React.Dispatch<React.SetStateAction<StressTrainingSession | null>>;
}

export function useStressTrainingMetricsCallbacks(
  currentSession: StressTrainingSession | null,
  callbacks: MetricsCallbacks,
) {
  const updatePhysiologicalMetrics = useCallback(() => {
    if (!currentSession) return;
    const elapsedSeconds = Math.floor(
      (Date.now() - currentSession.startedAt.getTime()) / 1000,
    );
    const stressScore = calculateStressScore(
      currentSession.scenario.conditions,
      elapsedSeconds,
      currentSession.errorsCount,
      currentSession.totalTasks - currentSession.tasksCompleted,
    );
    const fatigueLevel = calculateFatigueLevel(elapsedSeconds, stressScore);
    const focusLevel = calculateFocusLevel(fatigueLevel, stressScore);
    callbacks.setCurrentSession((prev) =>
      prev ? { ...prev, stressScore, fatigueLevel, focusLevel } : null,
    );
  }, [currentSession, callbacks]);

  return {
    updatePhysiologicalMetrics,
  };
}