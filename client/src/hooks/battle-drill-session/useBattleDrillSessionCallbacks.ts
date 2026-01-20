/**
 * Battle Drill Session Callbacks
 * Extracted session management callbacks
 */

import { useCallback } from "react";
import type { AAR } from "../../types/training";

interface SessionResult {
  passed: boolean;
  completedSteps: number;
  hintsUsed: number;
  totalSteps: number;
}

interface SessionCallbacks {
  setSessionStarted: (started: boolean) => void;
  setElapsedSeconds: (seconds: number) => void;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  setShowHints: React.Dispatch<React.SetStateAction<Set<number>>>;
  setStepInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setValidationResults: React.Dispatch<React.SetStateAction<Record<number, unknown>>>;
  setValidatingStep: (step: number | null) => void;
  setSessionComplete: (complete: boolean) => void;
  setSessionResult: (result: SessionResult | null) => void;
  setShowAARForm: (show: boolean) => void;
  setAARSubmitted: (submitted: boolean) => void;
  setSubmittedAAR: (aar: AAR | null) => void;
  setShowFailureLog: (show: boolean) => void;
}

export function useBattleDrillSessionCallbacks(callbacks: SessionCallbacks) {
  const handleStart = useCallback(() => {
    callbacks.setSessionStarted(true);
    callbacks.setElapsedSeconds(0);
    callbacks.setCompletedSteps(new Set());
    callbacks.setShowHints(new Set());
    callbacks.setStepInputs({});
    callbacks.setValidationResults({});
    callbacks.setValidatingStep(null);
    callbacks.setSessionComplete(false);
    callbacks.setSessionResult(null);
    callbacks.setShowAARForm(false);
    callbacks.setAARSubmitted(false);
    callbacks.setSubmittedAAR(null);
    callbacks.setShowFailureLog(false);
  }, [callbacks]);

  const resetSession = useCallback(() => {
    callbacks.setSessionStarted(false);
    callbacks.setElapsedSeconds(0);
    callbacks.setCompletedSteps(new Set());
    callbacks.setShowHints(new Set());
    callbacks.setStepInputs({});
    callbacks.setValidationResults({});
    callbacks.setValidatingStep(null);
    callbacks.setSessionComplete(false);
    callbacks.setSessionResult(null);
    callbacks.setShowAARForm(false);
    callbacks.setAARSubmitted(false);
    callbacks.setSubmittedAAR(null);
    callbacks.setShowFailureLog(false);
  }, [callbacks]);

  return {
    handleStart,
    resetSession,
  };
}