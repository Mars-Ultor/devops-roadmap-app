/**
 * ML-Enhanced AI Coach Hook
 * Provides intelligent coaching with machine learning insights
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { MLEnhancedAICoach } from '../services/mlEnhancedAICoach';
import type { MLCoachInsights } from '../services/mlEnhancedAICoach';
import type { CoachContext, CoachFeedback } from '../types/aiCoach';

export interface MLCoachState {
  insights: MLCoachInsights | null;
  feedback: CoachFeedback | null;
  recommendations: string[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useMLEnhancedAICoach(context?: CoachContext) {
  const { user } = useAuthStore();
  const [state, setState] = useState<MLCoachState>({
    insights: null,
    feedback: null,
    recommendations: [],
    loading: false,
    error: null,
    lastUpdated: null
  });

  const coachService = MLEnhancedAICoach.getInstance();

  const getInsights = useCallback(async (coachContext: CoachContext) => {
    if (!user?.uid) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const insights = await coachService.getMLCoachInsights(user.uid, coachContext);
      const feedback = await coachService.getPersonalizedCoachFeedback(user.uid, coachContext);
      const recommendations = await coachService.getAdaptiveRecommendations(user.uid, coachContext);

      setState({
        insights,
        feedback,
        recommendations,
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('ML Coach error:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to get ML coaching insights'
      }));
    }
  }, [user?.uid, coachService]);

  const refreshInsights = useCallback(() => {
    if (context) {
      getInsights(context);
    }
  }, [context, getInsights]);

  const getFeedbackForContext = useCallback(async (coachContext: CoachContext) => {
    if (!user?.uid) return null;

    try {
      return await coachService.getPersonalizedCoachFeedback(user.uid, coachContext);
    } catch (error) {
      console.error('Feedback generation error:', error);
      return null;
    }
  }, [user?.uid, coachService]);

  const getRecommendationsForContext = useCallback(async (coachContext: CoachContext) => {
    if (!user?.uid) return [];

    try {
      return await coachService.getAdaptiveRecommendations(user.uid, coachContext);
    } catch (error) {
      console.error('Recommendations generation error:', error);
      return [];
    }
  }, [user?.uid, coachService]);

  useEffect(() => {
    if (context && user?.uid) {
      getInsights(context);
    }
  }, [context, user?.uid, getInsights]);

  return {
    ...state,
    getInsights,
    refreshInsights,
    getFeedbackForContext,
    getRecommendationsForContext
  };
}

/**
 * Hook for ML-powered learning path optimization
 */
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

  const optimizePath = useCallback(async (currentContext: CoachContext) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const insights = await coachService.getMLCoachInsights(user.uid, currentContext);
      setOptimizedPath({
        topics: insights.optimalPath.nextTopics,
        estimatedTime: insights.optimalPath.estimatedTime,
        confidence: insights.optimalPath.confidence,
        reasoning: insights.optimalPath.reasoning
      });
    } catch (error) {
      console.error('Path optimization error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, coachService]);

  return {
    optimizedPath,
    loading,
    optimizePath
  };
}

/**
 * Hook for ML-powered skill gap analysis
 */
export function useMLSkillGapAnalysis() {
  const { user } = useAuthStore();
  const [skillGaps, setSkillGaps] = useState<MLCoachInsights['skillGaps']>([]);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const analyzeGaps = useCallback(async (currentContext: CoachContext) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const insights = await coachService.getMLCoachInsights(user.uid, currentContext);
      setSkillGaps(insights.skillGaps);
    } catch (error) {
      console.error('Skill gap analysis error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, coachService]);

  return {
    skillGaps,
    loading,
    analyzeGaps
  };
}

/**
 * Hook for ML-powered performance prediction
 */
export function useMLPerformancePrediction() {
  const { user } = useAuthStore();
  const [prediction, setPrediction] = useState<MLCoachInsights['performancePrediction'] | null>(null);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const predictPerformance = useCallback(async (currentContext: CoachContext) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const insights = await coachService.getMLCoachInsights(user.uid, currentContext);
      setPrediction(insights.performancePrediction);
    } catch (error) {
      console.error('Performance prediction error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, coachService]);

  return {
    prediction,
    loading,
    predictPerformance
  };
}

/**
 * Hook for ML-powered learning style detection
 */
export function useMLLearningStyle() {
  const { user } = useAuthStore();
  const [learningStyle, setLearningStyle] = useState<MLCoachInsights['learningStyle'] | null>(null);
  const [loading, setLoading] = useState(false);

  const coachService = MLEnhancedAICoach.getInstance();

  const detectStyle = useCallback(async (currentContext: CoachContext) => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const insights = await coachService.getMLCoachInsights(user.uid, currentContext);
      setLearningStyle(insights.learningStyle);
    } catch (error) {
      console.error('Learning style detection error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, coachService]);

  return {
    learningStyle,
    loading,
    detectStyle
  };
}