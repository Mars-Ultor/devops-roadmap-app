/**
 * Stress Training Completion Callbacks
 * Extracted completion-related callbacks
 */

import { useCallback } from "react";
import type { StressTrainingSession, StressMetrics } from "../../types/training";
import {
  calculatePerformanceRating,
  calculateAdaptabilityScore,
} from "../../data/stressScenarios";
import {
  calculateUpdatedMetrics,
  updateMetricsPerformanceDegradation,
  calculateSessionAccuracy,
} from "./stressTrainingUtils";
import {
  updateStressMetricsInDB,
  saveStressTrainingSessionToDB,
  loadNormalSessionAccuracy,
} from "./stressTrainingOperations";

interface CompletionCallbacks {
  setCurrentSession: (session: StressTrainingSession | null) => void;
  setStressMetrics: (metrics: StressMetrics | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useStressTrainingCompletionCallbacks(
  userId: string | undefined,
  currentSession: StressTrainingSession | null,
  stressMetrics: StressMetrics | null,
  callbacks: CompletionCallbacks,
) {
  const updateStressMetrics = useCallback(async (session: StressTrainingSession) => {
    if (!userId || !stressMetrics) return;
    try {
      let updatedMetrics = calculateUpdatedMetrics(stressMetrics, session);
      const normalAccuracy = await loadNormalSessionAccuracy(userId);
      const sessionAccuracy = calculateSessionAccuracy(
        session.tasksCompleted,
        session.errorsCount,
        session.totalTasks,
      );
      updatedMetrics = updateMetricsPerformanceDegradation(
        updatedMetrics,
        sessionAccuracy,
        normalAccuracy,
      );
      await updateStressMetricsInDB(updatedMetrics);
      callbacks.setStressMetrics(updatedMetrics);
    } catch (err) {
      console.error("Error updating stress metrics:", err);
    }
  }, [userId, stressMetrics, callbacks]);

  const completeSession = useCallback(async (success: boolean) => {
    if (!userId || !currentSession) {
      callbacks.setError("No active session to complete");
      return;
    }
    callbacks.setLoading(true);
    callbacks.setError(null);
    try {
      const completedAt = new Date();
      const timeToCompletion = Math.floor(
        (completedAt.getTime() - currentSession.startedAt.getTime()) / 1000,
      );
      const performanceRating = calculatePerformanceRating(
        currentSession.tasksCompleted,
        currentSession.totalTasks,
        timeToCompletion,
        currentSession.scenario.duration,
        currentSession.errorsCount,
      );
      const adaptabilityScore = calculateAdaptabilityScore(
        performanceRating,
        currentSession.scenario.stressLevel,
        currentSession.errorsCount,
        currentSession.focusLevel,
      );
      const completedSession: StressTrainingSession = {
        ...currentSession,
        completedAt,
        timeToCompletion,
        performanceRating,
        adaptabilityScore,
        succeeded: success,
      };
      await saveStressTrainingSessionToDB(completedSession);
      await updateStressMetrics(completedSession);
      callbacks.setCurrentSession(completedSession);
    } catch (err) {
      console.error("Error completing stress session:", err);
      callbacks.setError("Failed to complete stress session");
    } finally {
      callbacks.setLoading(false);
    }
  }, [userId, currentSession, updateStressMetrics, callbacks]);

  return {
    completeSession,
  };
}