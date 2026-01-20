/**
 * ML Coach Context Callbacks Hook
 * Handles context-specific ML coaching operations
 */

import { useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";

export function useMLCoachContextCallbacks() {
  const { user } = useAuthStore();
  const coachService = MLEnhancedAICoach.getInstance();

  const getFeedbackForContext = useCallback(
    async (coachContext: CoachContext) => {
      if (!user?.uid) return null;

      try {
        return await coachService.getPersonalizedCoachFeedback(
          user.uid,
          coachContext,
        );
      } catch (error) {
        console.error("Feedback generation error:", error);
        return null;
      }
    },
    [user?.uid, coachService],
  );

  const getRecommendationsForContext = useCallback(
    async (coachContext: CoachContext) => {
      if (!user?.uid) return [];

      try {
        return await coachService.getAdaptiveRecommendations(
          user.uid,
          coachContext,
        );
      } catch (error) {
        console.error("Recommendations generation error:", error);
        return [];
      }
    },
    [user?.uid, coachService],
  );

  return {
    getFeedbackForContext,
    getRecommendationsForContext,
  };
}