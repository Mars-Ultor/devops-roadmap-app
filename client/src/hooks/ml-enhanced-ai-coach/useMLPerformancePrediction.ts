/**
 * ML Performance Prediction Hook
 * Provides ML-powered performance prediction
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";
import type { MLCoachInsights } from "../../services/mlEnhancedAICoach";

export function useMLPerformancePrediction() {
  const { user } = useAuthStore();
  const [prediction, setPrediction] = useState<
    MLCoachInsights["performancePrediction"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const predictPerformance = useCallback(
    async (currentContext: CoachContext) => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const insights = await coachService.getMLCoachInsights(
          user.uid,
          currentContext,
        );
        setPrediction(insights.performancePrediction);
      } catch (error) {
        console.error("Performance prediction error:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, coachService],
  );

  return {
    prediction,
    loading,
    predictPerformance,
  };
}