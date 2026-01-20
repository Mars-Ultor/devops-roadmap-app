/**
 * ML Enhanced AI Coach Callbacks Hook
 * Orchestrates ML coaching operations
 */

import { useCallback, useEffect } from "react";
import type { CoachContext } from "../../types/aiCoach";
import { useMLCoachInsights } from "./useMLCoachInsights";
import { useMLCoachContextCallbacks } from "./useMLCoachContextCallbacks";
import type { MLCoachStateSetters } from "./useMLCoachState";

interface UseMLCoachCallbacksProps {
  context?: CoachContext;
  setters: MLCoachStateSetters;
}

export function useMLCoachCallbacks({ context, setters }: UseMLCoachCallbacksProps) {
  // Use insights hook
  const { getInsights } = useMLCoachInsights({ setters });

  // Use context callbacks hook
  const { getFeedbackForContext, getRecommendationsForContext } = useMLCoachContextCallbacks();

  const refreshInsights = useCallback(() => {
    if (context) {
      getInsights(context);
    }
  }, [context, getInsights]);

  useEffect(() => {
    if (context) {
      getInsights(context);
    }
  }, [context, getInsights]);

  return {
    getInsights,
    refreshInsights,
    getFeedbackForContext,
    getRecommendationsForContext,
  };
}