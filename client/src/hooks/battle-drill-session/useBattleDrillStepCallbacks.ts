/**
 * Battle Drill Step Callbacks
 * Extracted step handling callbacks
 */

import { useCallback } from "react";
import { validateStep } from "../../utils/stepValidation";
import type { Drill, ValidationResult } from "../../types";

interface StepCallbacks {
  setStepInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setValidationResults: React.Dispatch<React.SetStateAction<Record<number, ValidationResult>>>;
  setValidatingStep: (step: number | null) => void;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  setShowHints: React.Dispatch<React.SetStateAction<Set<number>>>;
}

interface StepState {
  drill: Drill | null;
  stepInputs: Record<number, string>;
}

export function useBattleDrillStepCallbacks(
  state: StepState,
  callbacks: StepCallbacks,
) {
  const handleStepInput = useCallback((stepIndex: number, value: string) => {
    callbacks.setStepInputs((prev) => ({ ...prev, [stepIndex]: value }));
  }, [callbacks]);

  const handleValidateStep = useCallback(
    async (stepIndex: number) => {
      if (!state.drill) return;
      callbacks.setValidatingStep(stepIndex);
      try {
        const result = await validateStep(
          state.drill.steps[stepIndex],
          state.stepInputs[stepIndex] || "",
          state.drill.category,
        );
        callbacks.setValidationResults((prev) => ({ ...prev, [stepIndex]: result }));
        if (result.passed)
          callbacks.setCompletedSteps((prev) => new Set([...prev, stepIndex]));
      } catch {
        callbacks.setValidationResults((prev) => ({
          ...prev,
          [stepIndex]: {
            passed: false,
            passedCriteria: [],
            failedCriteria: state.drill.steps[stepIndex].validationCriteria,
            specificErrors: ["Validation service unavailable"],
            suggestions: ["Please try again"],
          },
        }));
      } finally {
        callbacks.setValidatingStep(null);
      }
    },
    [state.drill, state.stepInputs, callbacks],
  );

  const handleStepComplete = useCallback((stepIndex: number) => {
    callbacks.setCompletedSteps((prev) => new Set([...prev, stepIndex]));
  }, [callbacks]);

  const handleShowHint = useCallback((stepIndex: number) => {
    callbacks.setShowHints((prev) => new Set([...prev, stepIndex]));
  }, [callbacks]);

  return {
    handleStepInput,
    handleValidateStep,
    handleStepComplete,
    handleShowHint,
  };
}