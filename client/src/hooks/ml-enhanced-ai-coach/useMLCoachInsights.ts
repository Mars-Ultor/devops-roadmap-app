/**
 * ML Coach Insights Hook
 * Handles ML insights generation
 */

import { useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";
import type { MLCoachStateSetters } from "./useMLCoachState";

interface UseMLCoachInsightsProps {
  setters: MLCoachStateSetters;
}

export function useMLCoachInsights({ setters }: UseMLCoachInsightsProps) {
  const { user } = useAuthStore();
  const { setState } = setters;
  const coachService = MLEnhancedAICoach.getInstance();

  const getInsights = useCallback(
    async (coachContext: CoachContext) => {
      if (!user?.uid) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const insights = await coachService.getMLCoachInsights(
          user.uid,
          coachContext,
        );
        const feedback = await coachService.getPersonalizedCoachFeedback(
          user.uid,
          coachContext,
        );
        const recommendations = await coachService.getAdaptiveRecommendations(
          user.uid,
          coachContext,
        );

        setState({
          insights,
          feedback,
          recommendations,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("ML Coach error:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to get ML coaching insights",
        }));
      }
    },
    [user?.uid, coachService, setState],
  );

  return {
    getInsights,
  };
}