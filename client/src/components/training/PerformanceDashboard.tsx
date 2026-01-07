/**
 * PerformanceDashboard - Military Training Analytics
 * Refactored to use extracted components
 */

import { useState, useEffect, useCallback } from 'react';
import { aiCoachService } from '../../services/aiCoachEnhanced';
import type { PerformanceAnalytics, LearningPath, CoachContext } from '../../types/aiCoach';
import { generateLearningPath } from './PerformanceDashboardUtils';
import {
  LoadingState,
  HeaderSection,
  TrendsSection,
  LearningPathSection,
  RecommendationsSection
} from './PerformanceDashboardComponents';

interface PerformanceDashboardProps {
  context: CoachContext;
}

export default function PerformanceDashboard({ context }: PerformanceDashboardProps) {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerformanceData = useCallback(async () => {
    setLoading(true);
    try {
      const performanceData = await aiCoachService['analyzePerformance'](context);
      setAnalytics(performanceData);
      const pathData = await generateLearningPath(context, performanceData);
      setLearningPath(pathData);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => { loadPerformanceData(); }, [loadPerformanceData]);

  if (loading) return <LoadingState />;
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <HeaderSection analytics={analytics} />
      <TrendsSection analytics={analytics} />
      {learningPath && <LearningPathSection learningPath={learningPath} />}
      <RecommendationsSection recommendations={analytics.recommendations} />
    </div>
  );
}
