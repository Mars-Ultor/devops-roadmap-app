/**
 * useEnhancedAICoach - Custom hook for AI Coach state management
 */

import { useState, useEffect, useRef } from "react";
import { aiCoachService } from "../../services/aiCoachEnhanced";
import type {
  CoachFeedback,
  CoachContext,
  CodeAnalysis,
} from "../../types/aiCoach";

interface UseEnhancedAICoachProps {
  context: CoachContext;
  autoUpdate: boolean;
  updateInterval: number;
  showCodeAnalysis: boolean;
  codeSnippet?: string;
  onDisciplineAction?: (action: string) => void;
}

export function useEnhancedAICoach({
  context,
  autoUpdate,
  updateInterval,
  showCodeAnalysis,
  codeSnippet,
  onDisciplineAction,
}: UseEnhancedAICoachProps) {
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null);
  const [disciplineAlerts, setDisciplineAlerts] = useState<string[]>([]);
  const intervalRef = useRef<number | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await aiCoachService.getEnhancedCoachFeedback(context);
      setFeedback(response);

      if (
        response.type === "discipline" &&
        response.actionRequired &&
        onDisciplineAction
      ) {
        onDisciplineAction(response.message);
        setDisciplineAlerts((prev) => [...prev, response.message].slice(-3));
      }

      if (showCodeAnalysis && codeSnippet) {
        const analysis = await aiCoachService.analyzeCode(codeSnippet);
        setCodeAnalysis(analysis);
      }
    } catch (error) {
      console.error("Error fetching enhanced coach feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    if (autoUpdate) {
      intervalRef.current = setInterval(fetchFeedback, updateInterval);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    context.contentId,
    context.userProgress.attempts,
    context.userProgress.timeSpent,
  ]);

  return { feedback, loading, codeAnalysis, disciplineAlerts, fetchFeedback };
}
