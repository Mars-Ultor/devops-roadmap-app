/**
 * Production Scenario Management Callbacks
 * Extracted scenario start/completion callbacks
 */

import { useCallback } from "react";
import type { ProductionScenario, ScenarioAttempt, ScenarioPerformance } from "../../types/scenarios";
import { createInitialAttempt } from "./productionScenarioUtils";
import {
  updatePerformanceInDB,
  saveScenarioAttemptToDB,
} from "./productionScenarioOperations";
import {
  calculateEfficiency,
  calculateAccuracy,
  calculateTotalScore,
} from "./productionScenarioUtils";

interface ManagementCallbacks {
  setCurrentAttempt: (attempt: ScenarioAttempt | null) => void;
  setPerformance: React.Dispatch<React.SetStateAction<Map<string, ScenarioPerformance>>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useProductionScenarioManagementCallbacks(
  userId: string | undefined,
  currentAttempt: ScenarioAttempt | null,
  callbacks: ManagementCallbacks,
) {
  const startScenario = useCallback(async (scenario: ProductionScenario) => {
    if (!userId) {
      callbacks.setError("Must be logged in");
      return;
    }
    callbacks.setLoading(true);
    callbacks.setError(null);
    try {
      callbacks.setCurrentAttempt(createInitialAttempt(userId, scenario.id));
    } catch (err) {
      console.error("Error starting scenario:", err);
      callbacks.setError("Failed to start scenario");
    } finally {
      callbacks.setLoading(false);
    }
  }, [userId, callbacks]);

  const completeScenario = useCallback(async (
    success: boolean,
    lessonsLearned: string[],
  ) => {
    if (!userId || !currentAttempt) return;
    callbacks.setLoading(true);
    try {
      const completedAt = new Date();
      const totalTime = Math.floor(
        (completedAt.getTime() - currentAttempt.startedAt.getTime()) / 1000,
      );
      const efficiency = calculateEfficiency(currentAttempt, totalTime);
      const accuracyScore = calculateAccuracy(currentAttempt);
      const score = calculateTotalScore(
        currentAttempt,
        efficiency,
        accuracyScore,
      );
      const completedAttempt: ScenarioAttempt = {
        ...currentAttempt,
        completedAt,
        success,
        score,
        efficiency,
        accuracyScore,
        lessonsLearned,
      };
      await saveScenarioAttemptToDB(completedAttempt);
      await updatePerformanceInDB(userId, completedAttempt);
      callbacks.setPerformance((prev) =>
        new Map(prev).set(completedAttempt.scenarioId, {
          userId,
          scenarioId: completedAttempt.scenarioId,
          attempts: prev.get(completedAttempt.scenarioId)?.attempts ?? 0 + 1,
          bestScore: Math.max(
            prev.get(completedAttempt.scenarioId)?.bestScore ?? 0,
            completedAttempt.score,
          ),
          averageTimeToResolve: 0, // Will be calculated properly in utils
          successRate: 0, // Will be calculated properly in utils
          lastAttempted: completedAt,
        }),
      );
      callbacks.setCurrentAttempt(null);
    } catch (err) {
      console.error("Error completing scenario:", err);
      callbacks.setError("Failed to save results");
    } finally {
      callbacks.setLoading(false);
    }
  }, [userId, currentAttempt, callbacks]);

  return {
    startScenario,
    completeScenario,
  };
}