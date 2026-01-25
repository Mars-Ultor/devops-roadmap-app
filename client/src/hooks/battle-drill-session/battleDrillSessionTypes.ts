/**
 * Battle Drill Session Types
 * Extracted type definitions for ESLint compliance
 */

import type { BattleDrill, AAR, ValidationResult } from "../../types";

export interface BattleDrillSessionState {
  drill: BattleDrill | null;
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