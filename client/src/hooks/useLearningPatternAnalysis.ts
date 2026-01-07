/**
 * Learning Pattern Analysis Hook - Refactored
 * Identifies patterns in study behavior and performance correlations
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  analyzeStudyConsistency, analyzeTimeOptimization, analyzeTopicStruggles,
  analyzePerformanceCorrelations, generateAdaptiveRecommendations, generateInsights
} from './learning-pattern/learningPatternUtils';

export interface LearningPatternData {
  patterns: {
    studyConsistency: { score: number; description: string; recommendation: string };
    timeOptimization: { optimalHours: number[]; wastedHours: number[]; efficiency: number };
    topicStruggles: Array<{ topic: string; pattern: string; frequency: number; suggestion: string }>;
    performanceCorrelations: Array<{ factor: string; correlation: number; insight: string }>;
    adaptiveRecommendations: string[];
  };
  insights: Array<{ type: 'success' | 'warning' | 'info'; title: string; description: string; actionable: boolean }>;
}

export function useLearningPatternAnalysis() {
  const { user } = useAuthStore();
  const [patternData, setPatternData] = useState<LearningPatternData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) analyzeLearningPatterns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const analyzeLearningPatterns = async () => {
    if (!user) return;

    try {
      const [sessionsSnap, progressSnap, failuresSnap] = await Promise.all([
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid)))
      ]);

      const studyConsistency = analyzeStudyConsistency(sessionsSnap.docs);
      const timeOptimization = analyzeTimeOptimization(sessionsSnap.docs, progressSnap.docs);
      const topicStruggles = analyzeTopicStruggles(failuresSnap.docs);
      const performanceCorrelations = analyzePerformanceCorrelations(sessionsSnap.docs, progressSnap.docs);
      const adaptiveRecommendations = generateAdaptiveRecommendations(studyConsistency, timeOptimization, topicStruggles, performanceCorrelations);
      const insights = generateInsights(studyConsistency, timeOptimization, topicStruggles, performanceCorrelations);

      setPatternData({
        patterns: { studyConsistency, timeOptimization, topicStruggles, performanceCorrelations, adaptiveRecommendations },
        insights
      });
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  return { patternData, loading, analyzeLearningPatterns };
}
