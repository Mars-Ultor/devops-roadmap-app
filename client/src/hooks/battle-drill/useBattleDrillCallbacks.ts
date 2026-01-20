/**
 * Battle Drill Callbacks Hook
 * Handles callback functions for battle drill operations
 */

import { useCallback } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";
import type { BattleDrill } from "../../types/training";
import {
  createAttemptResult,
  completeBattleDrillAttempt,
} from "./battleDrillUtils";
import type { BattleDrillState, BattleDrillStateSetters } from "./useBattleDrillState";

interface UseBattleDrillCallbacksProps {
  state: BattleDrillState;
  setters: BattleDrillStateSetters;
}

export function useBattleDrillCallbacks({ state, setters }: UseBattleDrillCallbacksProps) {
  const { user } = useAuthStore();
  const { performance, currentAttempt } = state;
  const { setPerformance, setCurrentAttempt } = setters;

  const startAttempt = useCallback(async (drill: BattleDrill) => {
    if (!user?.uid) return null;
    try {
      const attemptRef = await addDoc(collection(db, "battleDrillAttempts"), {
        drillId: drill.id,
        userId: user.uid,
        startedAt: serverTimestamp(),
        passed: false,
        hintsUsed: 0,
        resetsUsed: 0,
        stepsCompleted: 0,
        totalSteps: drill.steps.length,
      });
      setCurrentAttempt({
        id: attemptRef.id,
        startTime: Date.now(),
        hintsUsed: 0,
        currentStep: 0,
      });
      return attemptRef.id;
    } catch (e) {
      console.error("Error starting drill attempt:", e);
      return null;
    }
  }, [user?.uid, setCurrentAttempt]);

  const completeAttempt = useCallback(async (
    drill: BattleDrill,
    passed: boolean,
    stepsCompleted: number,
    hintsUsed = 0,
    resetsUsed = 0,
  ) => {
    if (!user?.uid || !currentAttempt) return null;
    try {
      const { updatedPerformance, durationSeconds } = await completeBattleDrillAttempt({
        userId: user.uid,
        drillId: drill.id,
        attemptId: currentAttempt.id,
        drill,
        passed,
        stepsCompleted,
        hintsUsed,
        resetsUsed,
        startTime: currentAttempt.startTime,
        currentPerformance: performance,
      });

      if (updatedPerformance) {
        setPerformance(updatedPerformance);
      }

      setCurrentAttempt(null);
      return createAttemptResult(
        durationSeconds,
        passed,
        drill.targetTimeSeconds,
        performance?.bestTime,
      );
    } catch (e) {
      console.error("Error completing drill attempt:", e);
      return null;
    }
  }, [user?.uid, currentAttempt, performance, setPerformance, setCurrentAttempt]);

  const recordHintUsed = useCallback(() => {
    if (currentAttempt)
      setCurrentAttempt({
        ...currentAttempt,
        hintsUsed: currentAttempt.hintsUsed + 1,
      });
  }, [currentAttempt, setCurrentAttempt]);

  const recordStepCompleted = useCallback(() => {
    if (currentAttempt)
      setCurrentAttempt({
        ...currentAttempt,
        currentStep: currentAttempt.currentStep + 1,
      });
  }, [currentAttempt, setCurrentAttempt]);

  return {
    startAttempt,
    completeAttempt,
    recordHintUsed,
    recordStepCompleted,
  };
}