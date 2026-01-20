/**
 * Stress Training Session Callbacks
 * Extracted session-related callbacks
 */

import { useCallback } from "react";
import type { StressScenario, StressTrainingSession } from "../../types/training";

interface SessionCallbacks {
  setCurrentSession: (session: StressTrainingSession | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useStressTrainingSessionCallbacks(
  userId: string | undefined,
  callbacks: SessionCallbacks,
) {
  const startSession = useCallback(async (scenario: StressScenario) => {
    if (!userId) {
      callbacks.setError("Must be logged in to start stress training");
      return;
    }
    callbacks.setLoading(true);
    callbacks.setError(null);
    try {
      callbacks.setCurrentSession({
        id: "",
        userId,
        scenario,
        startedAt: new Date(),
        completedAt: undefined,
        tasksCompleted: 0,
        totalTasks: scenario.successCriteria.length,
        errorsCount: 0,
        timeToCompletion: 0,
        stressScore: 0,
        fatigueLevel: 0,
        focusLevel: 100,
        performanceRating: undefined,
        adaptabilityScore: 0,
        succeeded: false,
      });
    } catch (err) {
      console.error("Error starting stress session:", err);
      callbacks.setError("Failed to start stress session");
    } finally {
      callbacks.setLoading(false);
    }
  }, [userId, callbacks]);

  const updateSessionMetrics = useCallback((
    tasksCompleted: number,
    errorsCount: number,
  ) => {
    callbacks.setCurrentSession((prev) =>
      prev ? { ...prev, tasksCompleted, errorsCount } : null,
    );
  }, [callbacks]);

  return {
    startSession,
    updateSessionMetrics,
  };
}