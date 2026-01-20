/**
 * Hook for managing battle drill attempts and performance - Refactored
 */

import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import type { BattleDrill, BattleDrillPerformance } from "../types/training";
import { initializeBattleDrillPerformance } from "../lib/firestoreSchema";
import {
  calculateUpdatedPerformance,
  createAttemptResult,
} from "./battle-drill/battleDrillUtils";

export function useBattleDrill(drillId?: string) {
  const { user } = useAuthStore();
  const [performance, setPerformance] = useState<BattleDrillPerformance | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [currentAttempt, setCurrentAttempt] = useState<{
    id: string;
    startTime: number;
    hintsUsed: number;
    currentStep: number;
  } | null>(null);

  useEffect(() => {
    if (!user?.uid || !drillId) {
      setLoading(false);
      return;
    }
    loadPerformance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, drillId]);

  const loadPerformance = async () => {
    if (!user?.uid || !drillId) return;
    try {
      setLoading(true);
      setPerformance(await initializeBattleDrillPerformance(user.uid, drillId));
    } catch (e) {
      console.error("Error loading drill performance:", e);
    } finally {
      setLoading(false);
    }
  };

  const startAttempt = async (drill: BattleDrill) => {
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
  };

  const completeAttempt = async (
    drill: BattleDrill,
    passed: boolean,
    stepsCompleted: number,
    hintsUsed = 0,
    resetsUsed = 0,
  ) => {
    if (!user?.uid || !currentAttempt) return null;
    try {
      const durationSeconds = Math.floor(
        (Date.now() - currentAttempt.startTime) / 1000,
      );

      // Update attempt record
      await updateDoc(doc(db, "battleDrillAttempts", currentAttempt.id), {
        completedAt: serverTimestamp(),
        durationSeconds,
        passed,
        hintsUsed,
        resetsUsed,
        stepsCompleted,
      });

      // Update performance stats
      if (performance) {
        const stats = calculateUpdatedPerformance(
          performance,
          passed,
          durationSeconds,
          drill.targetTimeSeconds,
        );
        const updatedPerformance: BattleDrillPerformance = {
          ...performance,
          ...stats,
          lastAttemptDate: new Date(),
        };
        await setDoc(
          doc(db, "battleDrillPerformance", `${user.uid}_${drill.id}`),
          updatedPerformance,
        );
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
  };

  const recordHintUsed = () => {
    if (currentAttempt)
      setCurrentAttempt({
        ...currentAttempt,
        hintsUsed: currentAttempt.hintsUsed + 1,
      });
  };
  const recordStepCompleted = () => {
    if (currentAttempt)
      setCurrentAttempt({
        ...currentAttempt,
        currentStep: currentAttempt.currentStep + 1,
      });
  };

  return {
    performance,
    loading,
    currentAttempt,
    startAttempt,
    completeAttempt,
    recordHintUsed,
    recordStepCompleted,
    refreshPerformance: loadPerformance,
  };
}
