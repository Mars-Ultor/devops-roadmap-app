/**
 * Battle Drill Completion Callbacks
 * Extracted completion and AAR callbacks
 */

import { useCallback } from "react";
import { completeAttempt, submitAAR, logFailure } from "../../services/drillService";
import type { Drill, AAR } from "../../types";

interface SessionResult {
  passed: boolean;
  completedSteps: number;
  hintsUsed: number;
  totalSteps: number;
}

interface CompletionCallbacks {
  setSessionResult: (result: SessionResult | null) => void;
  setSessionComplete: (complete: boolean) => void;
  setShowAARForm: (show: boolean) => void;
  setAARSubmitted: (submitted: boolean) => void;
  setSubmittedAAR: (aar: AAR | null) => void;
  setShowFailureLog: (show: boolean) => void;
}

interface CompletionState {
  drill: Drill | null;
  completedSteps: Set<number>;
  showHints: Set<number>;
}

export function useBattleDrillCompletionCallbacks(
  state: CompletionState,
  callbacks: CompletionCallbacks,
) {
  const handleComplete = useCallback(async () => {
    if (!state.drill) return;
    const result = await completeAttempt(
      state.drill,
      state.completedSteps.size === state.drill.steps.length,
      state.completedSteps.size,
      state.showHints.size,
      0,
    );
    callbacks.setSessionResult(result);
    callbacks.setSessionComplete(true);
    callbacks.setShowAARForm(true);
  }, [state.drill, state.completedSteps, state.showHints, callbacks]);

  const handleSubmitAAR = useCallback(
    async (
      aarData: Omit<AAR, "id" | "userId" | "createdAt" | "aiReviewed">,
    ) => {
      const aar = await submitAAR(aarData);
      callbacks.setAARSubmitted(true);
      callbacks.setSubmittedAAR(aar);
      callbacks.setShowAARForm(false);
    },
    [callbacks],
  );

  const handleLogFailure = useCallback(async (failureData: unknown) => {
    await logFailure(failureData);
    callbacks.setShowFailureLog(false);
    alert("✅ Failure logged successfully!");
  }, [callbacks]);

  return {
    handleComplete,
    handleSubmitAAR,
    handleLogFailure,
  };
}