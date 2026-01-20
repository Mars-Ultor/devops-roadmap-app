/**
 * Production Scenario Hook - Refactored
 * Manages real-world troubleshooting scenarios
 */

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  ProductionScenario,
  ScenarioAttempt,
  ScenarioPerformance,
} from "../types/scenarios";
import { loadPerformanceFromDB } from "./production-scenario/productionScenarioOperations";
import { useProductionScenarioCallbacks } from "./production-scenario/useProductionScenarioCallbacks";

interface UseProductionScenarioReturn {
  currentAttempt: ScenarioAttempt | null;
  performance: Map<string, ScenarioPerformance>;
  loading: boolean;
  error: string | null;
  startScenario: (scenario: ProductionScenario) => Promise<void>;
  completeInvestigationStep: (stepId: string) => void;
  incrementHintsUsed: () => void;
  identifyRootCause: () => boolean;
  completeResolutionStep: (stepId: string) => void;
  completeScenario: (
    success: boolean,
    lessonsLearned: string[],
  ) => Promise<void>;
  getPerformance: (scenarioId: string) => ScenarioPerformance | undefined;
}

export function useProductionScenario(): UseProductionScenarioReturn {
  const { user } = useAuthStore();
  const [currentAttempt, setCurrentAttempt] = useState<ScenarioAttempt | null>(
    null,
  );
  const [performance, setPerformance] = useState<
    Map<string, ScenarioPerformance>
  >(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPerformance = useCallback(async () => {
    if (!user) return;
    try {
      const perfMap = await loadPerformanceFromDB(user.uid);
      setPerformance(perfMap);
    } catch (err) {
      console.error("Error loading performance:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadPerformance();
  }, [user, loadPerformance]);

  const {
    startScenario,
    completeInvestigationStep,
    incrementHintsUsed,
    identifyRootCause,
    completeResolutionStep,
    completeScenario,
  } = useProductionScenarioCallbacks(user?.uid, currentAttempt, {
    setCurrentAttempt,
    setPerformance,
    setLoading,
    setError,
  });

  const getPerformance = (scenarioId: string) => performance.get(scenarioId);

  return {
    currentAttempt,
    performance,
    loading,
    error,
    startScenario,
    completeInvestigationStep,
    incrementHintsUsed,
    identifyRootCause,
    completeResolutionStep,
    completeScenario,
    getPerformance,
  };
}
