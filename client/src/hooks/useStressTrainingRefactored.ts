/**
 * Stress Training Hook - Refactored
 * Manages stress training sessions with physiological simulation
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import type {
  StressScenario,
  StressTrainingSession,
  StressMetrics,
} from "../types/training";
import {
  calculateStressScore,
  calculateFatigueLevel,
  calculateFocusLevel,
  calculatePerformanceRating,
  calculateAdaptabilityScore,
} from "../data/stressScenarios";
import {
  getInitialStressMetrics,
  calculateUpdatedMetrics,
  updateMetricsPerformanceDegradation,
  calculateSessionAccuracy,
  canAttemptLevel,
} from "./stress-training/stressTrainingUtils";

interface UseStressTrainingReturn {
  currentSession: StressTrainingSession | null;
  stressMetrics: StressMetrics | null;
  loading: boolean;
  error: string | null;
  startSession: (scenario: StressScenario) => Promise<void>;
  updateSessionMetrics: (tasksCompleted: number, errorsCount: number) => void;
  completeSession: (success: boolean) => Promise<void>;
  canAttemptStressLevel: (level: string) => boolean;
}

export function useStressTraining(): UseStressTrainingReturn {
  const { user } = useAuthStore();
  const [currentSession, setCurrentSession] =
    useState<StressTrainingSession | null>(null);
  const [stressMetrics, setStressMetrics] = useState<StressMetrics | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const loadStressMetrics = async () => {
      try {
        const snapshot = await getDocs(
          query(
            collection(db, "stressMetrics"),
            where("userId", "==", user.uid),
            limit(1),
          ),
        );
        setStressMetrics(
          snapshot.empty
            ? getInitialStressMetrics(user.uid)
            : (snapshot.docs[0].data() as StressMetrics),
        );
      } catch (err) {
        console.error("Error loading stress metrics:", err);
        setError("Failed to load stress metrics");
      }
    };
    loadStressMetrics();
  }, [user]);

  const updatePhysiologicalMetrics = useCallback(() => {
    if (!currentSession) return;
    const elapsedSeconds = Math.floor(
      (Date.now() - currentSession.startedAt.getTime()) / 1000,
    );
    const stressScore = calculateStressScore(
      currentSession.scenario.conditions,
      elapsedSeconds,
      currentSession.errorsCount,
      currentSession.totalTasks - currentSession.tasksCompleted,
    );
    const fatigueLevel = calculateFatigueLevel(elapsedSeconds, stressScore);
    const focusLevel = calculateFocusLevel(fatigueLevel, stressScore);
    setCurrentSession((prev) =>
      prev ? { ...prev, stressScore, fatigueLevel, focusLevel } : null,
    );
  }, [currentSession]);

  useEffect(() => {
    if (!currentSession || currentSession.completedAt) {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      return;
    }
    const id = window.setInterval(updatePhysiologicalMetrics, 1000);
    intervalIdRef.current = id;
    return () => clearInterval(id);
  }, [currentSession, updatePhysiologicalMetrics]);

  const startSession = async (scenario: StressScenario) => {
    if (!user) {
      setError("Must be logged in to start stress training");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCurrentSession({
        id: "",
        userId: user.uid,
        scenario,
        startedAt: new Date(),
        completedAt: undefined,
        tasksCompleted: 0,
        totalTasks: scenario.successCriteria.length,
        errorsCount: 0,
        timeToCompletion: 0,
        stressScore: 0,
        fatigueLevel: 0,
        focusLevel: 100,
        performanceRating: undefined,
        adaptabilityScore: 0,
        succeeded: false,
      });
    } catch (err) {
      console.error("Error starting stress session:", err);
      setError("Failed to start stress session");
    } finally {
      setLoading(false);
    }
  };

  const updateSessionMetrics = (
    tasksCompleted: number,
    errorsCount: number,
  ) => {
    setCurrentSession((prev) =>
      prev ? { ...prev, tasksCompleted, errorsCount } : null,
    );
  };

  const updateStressMetrics = async (session: StressTrainingSession) => {
    if (!user || !stressMetrics) return;
    try {
      let updatedMetrics = calculateUpdatedMetrics(stressMetrics, session);
      // Get baseline accuracy from normal sessions
      const normalSnapshot = await getDocs(
        query(
          collection(db, "battleDrillAttempts"),
          where("userId", "==", user.uid),
          orderBy("attemptedAt", "desc"),
          limit(10),
        ),
      );
      const normalAccuracy = normalSnapshot.empty
        ? 0
        : normalSnapshot.docs
            .map((d) => d.data().accuracy || 0)
            .reduce((sum, acc) => sum + acc, 0) / normalSnapshot.docs.length;
      const sessionAccuracy = calculateSessionAccuracy(
        session.tasksCompleted,
        session.errorsCount,
        session.totalTasks,
      );
      updatedMetrics = updateMetricsPerformanceDegradation(
        updatedMetrics,
        sessionAccuracy,
        normalAccuracy,
      );
      await addDoc(collection(db, "stressMetrics"), updatedMetrics);
      setStressMetrics(updatedMetrics);
    } catch (err) {
      console.error("Error updating stress metrics:", err);
    }
  };

  const completeSession = async (success: boolean) => {
    if (!user || !currentSession) {
      setError("No active session to complete");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const completedAt = new Date();
      const timeToCompletion = Math.floor(
        (completedAt.getTime() - currentSession.startedAt.getTime()) / 1000,
      );
      const performanceRating = calculatePerformanceRating(
        currentSession.tasksCompleted,
        currentSession.totalTasks,
        timeToCompletion,
        currentSession.scenario.duration,
        currentSession.errorsCount,
      );
      const adaptabilityScore = calculateAdaptabilityScore(
        performanceRating,
        currentSession.scenario.stressLevel,
        currentSession.errorsCount,
        currentSession.focusLevel,
      );
      const completedSession: StressTrainingSession = {
        ...currentSession,
        completedAt,
        timeToCompletion,
        performanceRating,
        adaptabilityScore,
        succeeded: success,
      };
      await addDoc(collection(db, "stressTrainingSessions"), completedSession);
      await updateStressMetrics(completedSession);
      setCurrentSession(completedSession);
    } catch (err) {
      console.error("Error completing stress session:", err);
      setError("Failed to complete stress session");
    } finally {
      setLoading(false);
    }
  };

  const canAttemptStressLevel = (level: string) =>
    canAttemptLevel(stressMetrics, level);

  return {
    currentSession,
    stressMetrics,
    loading,
    error,
    startSession,
    updateSessionMetrics,
    completeSession,
    canAttemptStressLevel,
  };
}
