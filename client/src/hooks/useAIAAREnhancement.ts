/**
 * AI AAR Enhancement Hook - Refactored
 * Detects vague responses and requires meaningful reflection
 */

import { useState } from 'react';
import {
  checkTooShort, checkVaguePatterns, checkWhatHappenedTechnical,
  checkWhatLearnedInsight, checkWhatChangeAction, getFollowUpQuestions
} from './ai-aar/aiAARUtils';

interface VaguenessDetection {
  isVague: boolean;
  reason: string;
  followUpQuestions: string[];
  suggestedImprovement: string;
}

export function useAIAAREnhancement() {
  const [detectedVagueness, setDetectedVagueness] = useState<VaguenessDetection | null>(null);

  const analyzeResponse = (response: string, context: 'what-happened' | 'what-learned' | 'what-change'): VaguenessDetection | null => {
    // Check for too short response
    const tooShort = checkTooShort(response);
    if (tooShort) {
      tooShort.followUpQuestions = getFollowUpQuestions(context, 'too-short');
      return tooShort;
    }

    // Check for vague patterns
    const vague = checkVaguePatterns(response, context);
    if (vague) return vague;

    // Context-specific checks
    if (context === 'what-happened') {
      const tech = checkWhatHappenedTechnical(response);
      if (tech) return tech;
    }

    if (context === 'what-learned') {
      const insight = checkWhatLearnedInsight(response);
      if (insight) return insight;
    }

    if (context === 'what-change') {
      const action = checkWhatChangeAction(response);
      if (action) return action;
    }

    return null;
  };

  return { analyzeResponse, detectedVagueness, setDetectedVagueness };
}
