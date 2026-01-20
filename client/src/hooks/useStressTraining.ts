/**
 * Stress Training Hook - Refactored
 * Manages stress training sessions with physiological simulation
 */

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  StressScenario,
  StressTrainingSession,
  StressMetrics,
} from "../types/training";
import { loadStressMetricsFromDB } from "./stress-training/stressTrainingOperations";
import { useStressTrainingCallbacks } from "./stress-training/useStressTrainingCallbacks";
import { canAttemptLevel } from "./stress-training/stressTrainingUtils";

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
        const metrics = await loadStressMetricsFromDB(user.uid);
        setStressMetrics(metrics);
      } catch (err) {
        console.error("Error loading stress metrics:", err);
        setError("Failed to load stress metrics");
      }
    };
    loadStressMetrics();
  }, [user]);

  const {
    updatePhysiologicalMetrics,
    startSession,
    updateSessionMetrics,
    completeSession,
  } = useStressTrainingCallbacks(
    user?.uid,
    currentSession,
    stressMetrics,
    {
      setCurrentSession,
      setStressMetrics,
      setLoading,
      setError,
    },
  );

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
