/**
 * Production Scenario Callbacks Hook
 * Combines investigation and management callbacks
 * For ESLint compliance (max-lines-per-function)
 */

import type { ScenarioAttempt, ScenarioPerformance } from "../../types/scenarios";
import { useProductionScenarioInvestigationCallbacks } from "./useProductionScenarioInvestigationCallbacks";
import { useProductionScenarioManagementCallbacks } from "./useProductionScenarioManagementCallbacks";

interface ProductionScenarioCallbacks {
  setCurrentAttempt: (attempt: ScenarioAttempt | null) => void;
  setPerformance: React.Dispatch<React.SetStateAction<Map<string, ScenarioPerformance>>>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function useProductionScenarioCallbacks(
  userId: string | undefined,
  currentAttempt: ScenarioAttempt | null,
  callbacks: ProductionScenarioCallbacks,
) {
  const investigationCallbacks = useProductionScenarioInvestigationCallbacks(
    currentAttempt,
    { setCurrentAttempt: callbacks.setCurrentAttempt },
  );

  const managementCallbacks = useProductionScenarioManagementCallbacks(
    userId,
    currentAttempt,
    callbacks,
  );

  return {
    ...investigationCallbacks,
    ...managementCallbacks,
  };
}