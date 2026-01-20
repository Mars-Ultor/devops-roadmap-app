/**
 * ML Learning Style Detection Hook
 * Provides ML-powered learning style detection
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";
import type { MLCoachInsights } from "../../services/mlEnhancedAICoach";

export function useMLLearningStyle() {
  const { user } = useAuthStore();
  const [learningStyle, setLearningStyle] = useState<
    MLCoachInsights["learningStyle"] | null
  >(null);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const detectStyle = useCallback(
    async (currentContext: CoachContext) => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const insights = await coachService.getMLCoachInsights(
          user.uid,
          currentContext,
        );
        setLearningStyle(insights.learningStyle);
      } catch (error) {
        console.error("Learning style detection error:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, coachService],
  );

  return {
    learningStyle,
    loading,
    detectStyle,
  };
}