/**
 * Production Scenario Investigation Callbacks
 * Extracted investigation-related callbacks
 */

import { useCallback } from "react";
import type { ScenarioAttempt } from "../../types/scenarios";

interface InvestigationCallbacks {
  setCurrentAttempt: (attempt: ScenarioAttempt | null) => void;
}

export function useProductionScenarioInvestigationCallbacks(
  currentAttempt: ScenarioAttempt | null,
  callbacks: InvestigationCallbacks,
) {
  const completeInvestigationStep = useCallback((stepId: string) => {
    callbacks.setCurrentAttempt((prev) =>
      prev
        ? {
            ...prev,
            stepsCompleted: [...prev.stepsCompleted, stepId],
            investigationTime: Math.floor(
              (Date.now() - prev.startedAt.getTime()) / 1000,
            ),
          }
        : null,
    );
  }, [callbacks]);

  const incrementHintsUsed = useCallback(() => {
    callbacks.setCurrentAttempt((prev) =>
      prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null,
    );
  }, [callbacks]);

  const identifyRootCause = useCallback((): boolean => {
    if (!currentAttempt) return false;
    const timeToIdentify = Math.floor(
      (Date.now() - currentAttempt.startedAt.getTime()) / 1000,
    );
    callbacks.setCurrentAttempt((prev) =>
      prev
        ? {
            ...prev,
            rootCauseAttempts: prev.rootCauseAttempts + 1,
            rootCauseIdentified: true,
            timeToIdentify,
          }
        : null,
    );
    return true;
  }, [currentAttempt, callbacks]);

  const completeResolutionStep = useCallback((stepId: string) => {
    callbacks.setCurrentAttempt((prev) =>
      prev
        ? {
            ...prev,
            resolutionStepsCompleted: [
              ...prev.resolutionStepsCompleted,
              stepId,
            ],
            resolutionTime: Math.floor(
              (Date.now() - prev.startedAt.getTime()) / 1000,
            ),
          }
        : null,
    );
  }, [callbacks]);

  return {
    completeInvestigationStep,
    incrementHintsUsed,
    identifyRootCause,
    completeResolutionStep,
  };
}