/**
 * Battle Drill Callbacks Hook
 * Combines session, step, and completion callbacks
 * For ESLint compliance (max-lines-per-function)
 */

import type { Drill, AAR, ValidationResult } from "../../types";

interface SessionResult {
  passed: boolean;
  completedSteps: number;
  hintsUsed: number;
  totalSteps: number;
}
import { useBattleDrillSessionCallbacks } from "./useBattleDrillSessionCallbacks";
import { useBattleDrillStepCallbacks } from "./useBattleDrillStepCallbacks";
import { useBattleDrillCompletionCallbacks } from "./useBattleDrillCompletionCallbacks";

interface BattleDrillCallbacks {
  setSessionStarted: (started: boolean) => void;
  setElapsedSeconds: (seconds: number) => void;
  setCompletedSteps: React.Dispatch<React.SetStateAction<Set<number>>>;
  setShowHints: React.Dispatch<React.SetStateAction<Set<number>>>;
  setStepInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  setValidationResults: React.Dispatch<React.SetStateAction<Record<number, ValidationResult>>>;
  setValidatingStep: (step: number | null) => void;
  setSessionComplete: (complete: boolean) => void;
  setSessionResult: (result: SessionResult | null) => void;
  setShowAARForm: (show: boolean) => void;
  setAARSubmitted: (submitted: boolean) => void;
  setSubmittedAAR: (aar: AAR | null) => void;
  setShowFailureLog: (show: boolean) => void;
}

interface BattleDrillState {
  drill: Drill | null;
  completedSteps: Set<number>;
  showHints: Set<number>;
  stepInputs: Record<number, string>;
}

export function useBattleDrillCallbacks(
  state: BattleDrillState,
  callbacks: BattleDrillCallbacks,
) {
  const sessionCallbacks = useBattleDrillSessionCallbacks(callbacks);

  const stepCallbacks = useBattleDrillStepCallbacks(
    {
      drill: state.drill,
      stepInputs: state.stepInputs,
    },
    callbacks,
  );

  const completionCallbacks = useBattleDrillCompletionCallbacks(
    {
      drill: state.drill,
      completedSteps: state.completedSteps,
      showHints: state.showHints,
    },
    callbacks,
  );

  return {
    ...sessionCallbacks,
    ...stepCallbacks,
    ...completionCallbacks,
  };
}