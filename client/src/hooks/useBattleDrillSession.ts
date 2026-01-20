/**
 * Battle Drill Session Hook - Refactored
 * Manages drill execution, timing, and validation
 */
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getDrill,
  completeAttempt,
  submitAAR,
  logFailure,
} from "../services/drillService";
import { buildCoachContext } from "../services/coachService";
import { validateStep } from "../utils/stepValidation";
import type { Drill, AAR, ValidationResult } from "../types";
import {
  formatTime as formatTimeFn,
  getTimeColor as getTimeColorFn,
} from "./battle-drill/battleDrillUtils";

export interface BattleDrillSessionState {
  drill: Drill | null;
  sessionStarted: boolean;
  sessionComplete: boolean;
  elapsedSeconds: number;
  completedSteps: Set<number>;
  showHints: Set<number>;
  stepInputs: Record<number, string>;
  validationResults: Record<number, ValidationResult>;
  validatingStep: number | null;
  sessionResult: {
    passed: boolean;
    beatTarget: boolean;
    personalBest: boolean;
    durationSeconds: number;
    targetTimeSeconds: number;
    completedSteps: number;
    totalSteps: number;
    hintsUsed: number;
  } | null;
  showAARForm: boolean;
  aarSubmitted: boolean;
  submittedAAR: AAR | null;
  showFailureLog: boolean;
  coachContext: {
    drillTitle: string;
    currentStep: number;
    totalSteps: number;
    elapsedTime: number;
    targetTime: number;
    hintsUsed: number;
    completedSteps: number[];
    difficulty: string;
    category: string;
  } | null;
  performance: {
    attempts: number;
    bestTime: number;
    successRate: number;
    masteryLevel: string;
  } | null;
}

export interface BattleDrillSessionActions {
  handleStart: () => void;
  handleStepInput: (stepIndex: number, value: string) => void;
  handleValidateStep: (stepIndex: number) => Promise<void>;
  handleStepComplete: (stepIndex: number) => void;
  handleShowHint: (stepIndex: number) => void;
  handleComplete: () => Promise<void>;
  handleSubmitAAR: (
    aarData: Omit<AAR, "id" | "userId" | "createdAt" | "aiReviewed">,
  ) => Promise<void>;
  handleLogFailure: (failureData: unknown) => Promise<void>;
  resetSession: () => void;
  formatTime: (seconds: number) => string;
  getTimeColor: () => string;
}

export const useBattleDrillSession = (drillId: string | undefined) => {
  const { user } = useAuth();
  const [drill, setDrill] = useState<Drill | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showHints, setShowHints] = useState<Set<number>>(new Set());
  const [stepInputs, setStepInputs] = useState<Record<number, string>>({});
  const [validationResults, setValidationResults] = useState<
    Record<number, ValidationResult>
  >({});
  const [validatingStep, setValidatingStep] = useState<number | null>(null);
  const [sessionResult, setSessionResult] =
    useState<BattleDrillSessionState["sessionResult"]>(null);
  const [showAARForm, setShowAARForm] = useState(false);
  const [aarSubmitted, setAARSubmitted] = useState(false);
  const [submittedAAR, setSubmittedAAR] = useState<AAR | null>(null);
  const [showFailureLog, setShowFailureLog] = useState(false);
  const [coachContext, setCoachContext] =
    useState<BattleDrillSessionState["coachContext"]>(null);
  const [performance, setPerformance] =
    useState<BattleDrillSessionState["performance"]>(null);

  useEffect(() => {
    const loadDrill = async () => {
      if (!drillId) return;
      try {
        const d = await getDrill(drillId);
        setDrill(d);
        setPerformance(d.performance || null);
      } catch (e) {
        console.error("Error loading drill:", e);
      }
    };
    loadDrill();
  }, [drillId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStarted && !sessionComplete)
      interval = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStarted, sessionComplete]);

  useEffect(() => {
    const buildContext = async () => {
      if (!drill || !user || !sessionStarted) return;
      try {
        const ctx = await buildCoachContext(user.uid, drill.id, "drill", {
          drillTitle: drill.title,
          currentStep: completedSteps.size,
          totalSteps: drill.steps.length,
          elapsedTime: elapsedSeconds,
          targetTime: drill.targetTimeSeconds,
          hintsUsed: showHints.size,
          completedSteps: Array.from(completedSteps),
          difficulty: drill.difficulty,
          category: drill.category,
        });
        setCoachContext(ctx);
      } catch (e) {
        console.error("Error building coach context:", e);
      }
    };
    buildContext();
  }, [drill, user, sessionStarted, completedSteps, elapsedSeconds, showHints]);

  const handleStart = useCallback(() => {
    setSessionStarted(true);
    setElapsedSeconds(0);
    setCompletedSteps(new Set());
    setShowHints(new Set());
    setStepInputs({});
    setValidationResults({});
    setValidatingStep(null);
    setSessionComplete(false);
    setSessionResult(null);
    setShowAARForm(false);
    setAARSubmitted(false);
    setSubmittedAAR(null);
    setShowFailureLog(false);
  }, []);

  const handleStepInput = useCallback((stepIndex: number, value: string) => {
    setStepInputs((prev) => ({ ...prev, [stepIndex]: value }));
  }, []);

  const handleValidateStep = useCallback(
    async (stepIndex: number) => {
      if (!drill) return;
      setValidatingStep(stepIndex);
      try {
        const result = await validateStep(
          drill.steps[stepIndex],
          stepInputs[stepIndex] || "",
          drill.category,
        );
        setValidationResults((prev) => ({ ...prev, [stepIndex]: result }));
        if (result.passed)
          setCompletedSteps((prev) => new Set([...prev, stepIndex]));
      } catch {
        setValidationResults((prev) => ({
          ...prev,
          [stepIndex]: {
            passed: false,
            passedCriteria: [],
            failedCriteria: drill.steps[stepIndex].validationCriteria,
            specificErrors: ["Validation service unavailable"],
            suggestions: ["Please try again"],
          },
        }));
      } finally {
        setValidatingStep(null);
      }
    },
    [drill, stepInputs],
  );

  const handleStepComplete = useCallback((stepIndex: number) => {
    setCompletedSteps((prev) => new Set([...prev, stepIndex]));
  }, []);
  const handleShowHint = useCallback((stepIndex: number) => {
    setShowHints((prev) => new Set([...prev, stepIndex]));
  }, []);

  const handleComplete = useCallback(async () => {
    if (!drill) return;
    const result = await completeAttempt(
      drill,
      completedSteps.size === drill.steps.length,
      completedSteps.size,
      showHints.size,
      0,
    );
    setSessionResult(result);
    setSessionComplete(true);
    setShowAARForm(true);
  }, [drill, completedSteps, showHints]);

  const handleSubmitAAR = useCallback(
    async (
      aarData: Omit<AAR, "id" | "userId" | "createdAt" | "aiReviewed">,
    ) => {
      const aar = await submitAAR(aarData);
      setAARSubmitted(true);
      setSubmittedAAR(aar);
      setShowAARForm(false);
    },
    [],
  );

  const handleLogFailure = useCallback(async (failureData: unknown) => {
    await logFailure(failureData);
    setShowFailureLog(false);
    alert("✅ Failure logged successfully!");
  }, []);

  const resetSession = useCallback(() => {
    setSessionStarted(false);
    setElapsedSeconds(0);
    setCompletedSteps(new Set());
    setShowHints(new Set());
    setStepInputs({});
    setValidationResults({});
    setValidatingStep(null);
    setSessionComplete(false);
    setSessionResult(null);
    setShowAARForm(false);
    setAARSubmitted(false);
    setSubmittedAAR(null);
    setShowFailureLog(false);
  }, []);

  const formatTime = useCallback(
    (seconds: number) => formatTimeFn(seconds),
    [],
  );
  const getTimeColor = useCallback(
    () => getTimeColorFn(elapsedSeconds, drill?.targetTimeSeconds),
    [drill, elapsedSeconds],
  );

  const state: BattleDrillSessionState = {
    drill,
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
    performance,
  };
  const actions: BattleDrillSessionActions = {
    handleStart,
    handleStepInput,
    handleValidateStep,
    handleStepComplete,
    handleShowHint,
    handleComplete,
    handleSubmitAAR,
    handleLogFailure,
    resetSession,
    formatTime,
    getTimeColor,
  };
  return { state, actions };
};
