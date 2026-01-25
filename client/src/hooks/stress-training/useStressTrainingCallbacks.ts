/**
 * Stress Training Callbacks Hook
 * Combines session, metrics, and completion callbacks
 * For ESLint compliance (max-lines-per-function)
 */

import type { StressTrainingSession, StressMetrics } from "../../types/training";
import { useStressTrainingSessionCallbacks } from "./useStressTrainingSessionCallbacks";
import { useStressTrainingMetricsCallbacks } from "./useStressTrainingMetricsCallbacks";
import { useStressTrainingCompletionCallbacks } from "./useStressTrainingCompletionCallbacks";

interface StressTrainingCallbacks {
  setCurrentSession: (session: StressTrainingSession | null) => void;
  setStressMetrics: (metrics: StressMetrics | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useStressTrainingCallbacks(
  userId: string | undefined,
  currentSession: StressTrainingSession | null,
  stressMetrics: StressMetrics | null,
  callbacks: StressTrainingCallbacks,
) {
  const sessionCallbacks = useStressTrainingSessionCallbacks(userId, {
    setCurrentSession: callbacks.setCurrentSession,
    setLoading: callbacks.setLoading,
    setError: callbacks.setError,
  });

  const metricsCallbacks = useStressTrainingMetricsCallbacks(currentSession, {
    setCurrentSession: callbacks.setCurrentSession,
  });

  const completionCallbacks = useStressTrainingCompletionCallbacks(
    userId,
    currentSession,
    stressMetrics,
    callbacks,
  );

  return {
    ...sessionCallbacks,
    ...metricsCallbacks,
    ...completionCallbacks,
  };
}