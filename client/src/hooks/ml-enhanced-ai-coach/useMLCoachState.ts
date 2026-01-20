/**
 * ML Enhanced AI Coach State Hook
 * Manages state for ML-powered coaching
 */

import { useState } from "react";
import type { MLCoachInsights } from "../../services/mlEnhancedAICoach";
import type { CoachFeedback } from "../../types/aiCoach";

export interface MLCoachState {
  insights: MLCoachInsights | null;
  feedback: CoachFeedback | null;
  recommendations: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export interface MLCoachStateSetters {
  setState: React.Dispatch<React.SetStateAction<MLCoachState>>;
}

export function useMLCoachState(): MLCoachState & MLCoachStateSetters {
  const [state, setState] = useState<MLCoachState>({
    insights: null,
    feedback: null,
    recommendations: [],
    loading: false,
    error: null,
    lastUpdated: null,
  });

  return {
    ...state,
    setState,
  };
}