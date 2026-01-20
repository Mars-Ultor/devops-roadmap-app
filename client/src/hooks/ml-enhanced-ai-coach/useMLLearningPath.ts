/**
 * ML Learning Path Hook
 * Provides ML-powered learning path optimization
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { MLEnhancedAICoach } from "../../services/mlEnhancedAICoach";
import type { CoachContext } from "../../types/aiCoach";

export function useMLLearningPath() {
  const { user } = useAuthStore();
  const [optimizedPath, setOptimizedPath] = useState<{
    topics: string[];
    estimatedTime: number;
    confidence: number;
    reasoning: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const optimizePath = useCallback(
    async (currentContext: CoachContext) => {
      if (!user?.uid) return;

      setLoading(true);
      try {
        const insights = await coachService.getMLCoachInsights(
          user.uid,
          currentContext,
        );
        setOptimizedPath({
          topics: insights.optimalPath.nextTopics,
          estimatedTime: insights.optimalPath.estimatedTime,
          confidence: insights.optimalPath.confidence,
          reasoning: insights.optimalPath.reasoning,
        });
      } catch (error) {
        console.error("Path optimization error:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid, coachService],
  );

  return {
    optimizedPath,
    loading,
    optimizePath,
  };
}