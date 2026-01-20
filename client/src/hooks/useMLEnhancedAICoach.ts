/**
 * ML-Enhanced AI Coach Hook
 * Provides intelligent coaching with machine learning insights
 */

import type { CoachContext, CoachFeedback } from "../types/aiCoach";
import { useMLCoachState } from "./ml-enhanced-ai-coach/useMLCoachState";
import { useMLCoachCallbacks } from "./ml-enhanced-ai-coach/useMLCoachCallbacks";

export interface MLCoachState {
  insights: import("../services/mlEnhancedAICoach").MLCoachInsights | null;
  feedback: CoachFeedback | null;
  recommendations: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useMLEnhancedAICoach(context?: CoachContext) {
  // Use extracted state hook
  const state = useMLCoachState();

  // Use extracted callbacks hook
  const {
    getInsights,
    refreshInsights,
    getFeedbackForContext,
    getRecommendationsForContext,
  } = useMLCoachCallbacks({
    context,
    setters: { setState: state.setState },
  });

  return {
    ...state,
    getInsights,
    refreshInsights,
    getFeedbackForContext,
    getRecommendationsForContext,
  };
}

// Re-export the other hooks
export { useMLLearningPath } from "./ml-enhanced-ai-coach/useMLLearningPath";
export { useMLSkillGapAnalysis } from "./ml-enhanced-ai-coach/useMLSkillGapAnalysis";
export { useMLPerformancePrediction } from "./ml-enhanced-ai-coach/useMLPerformancePrediction";
export { useMLLearningStyle } from "./ml-enhanced-ai-coach/useMLLearningStyle";
