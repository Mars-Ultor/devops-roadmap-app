/**
 * ML Skill Gap Analysis Hook
 * Provides ML-powered skill gap analysis
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";
import type { MLCoachInsights } from "../../services/mlEnhancedAICoach";

export function useMLSkillGapAnalysis() {
  const { user } = useAuthStore();
  const [skillGaps, setSkillGaps] = useState<MLCoachInsights["skillGaps"]>([]);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const analyzeGaps = useCallback(
    async (currentContext: CoachContext) => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const insights = await coachService.getMLCoachInsights(
          user.uid,
          currentContext,
        );
        setSkillGaps(insights.skillGaps);
      } catch (error) {
        console.error("Skill gap analysis error:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, coachService],
  );

  return {
    skillGaps,
    loading,
    analyzeGaps,
  };
}