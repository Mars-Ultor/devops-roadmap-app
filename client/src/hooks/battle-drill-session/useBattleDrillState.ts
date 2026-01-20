/**
 * Battle Drill State Hook
 * Manages all state for battle drill session
 */

import { useState } from "react";
import type { Drill, AAR, ValidationResult } from "../../types";
import type { BattleDrillSessionState } from "./battleDrillSessionTypes";

export function useBattleDrillState() {
  const [drill, setDrill] = useState<Drill | null>(null);
  const [performance, setPerformance] = useState<BattleDrillSessionState["performance"]>(null);

  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showHints, setShowHints] = useState<Set<number>>(new Set());
  const [stepInputs, setStepInputs] = useState<Record<number, string>>({});

  const [validationResults, setValidationResults] = useState<Record<number, ValidationResult>>({});
  const [validatingStep, setValidatingStep] = useState<number | null>(null);

  const [sessionResult, setSessionResult] = useState<BattleDrillSessionState["sessionResult"]>(null);
  const [showAARForm, setShowAARForm] = useState(false);
  const [aarSubmitted, setAARSubmitted] = useState(false);
  const [submittedAAR, setSubmittedAAR] = useState<AAR | null>(null);
  const [showFailureLog, setShowFailureLog] = useState(false);

  const [coachContext, setCoachContext] = useState<BattleDrillSessionState["coachContext"]>(null);

  return {
    // State values
    drill,
    performance,
    sessionStarted,
    sessionComplete,
    elapsedSeconds,
    completedSteps,
    showHints,
    stepInputs,
    validationResults,
    validatingStep,
    sessionResult,
    showAARForm,
    aarSubmitted,
    submittedAAR,
    showFailureLog,
    coachContext,

    // State setters
    setDrill,
    setPerformance,
    setSessionStarted,
    setElapsedSeconds,
    setCompletedSteps,
    setShowHints,
    setStepInputs,
    setValidationResults,
    setValidatingStep,
    setSessionComplete,
    setSessionResult,
    setShowAARForm,
    setAARSubmitted,
    setSubmittedAAR,
    setShowFailureLog,
    setCoachContext,
  };
}