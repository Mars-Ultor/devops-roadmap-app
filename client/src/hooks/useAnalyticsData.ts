/**
 * Analytics Data Hook - Refactored
 * Collects comprehensive learning analytics
 */
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useResetTokens } from '../hooks/useResetTokens';
import {
  getDefaultAnalytics, getDateFilter, processSessionDocs, processDrillDocs, processProgressDocs,
  processQuizDocs, processLabDocs, processFailureDocs, calculateStreaks, calculateWeeklyProgress,
  calculateMonthlyTrends, buildAnalytics
} from './analytics-data/analyticsDataUtils';
import type { AnalyticsData, TimeRange } from './analytics-data/analyticsDataUtils';

export type { AnalyticsData, TimeRange };

export const useAnalyticsData = (timeRange: TimeRange) => {
  const { user } = useAuthStore();
  const { getUsageStats } = useResetTokens();
  const [analytics, setAnalytics] = useState<AnalyticsData>(getDefaultAnalytics());
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const dateFilter = getDateFilter(timeRange);

      // Parallel queries
      const [sessionsSnap, drillPerfSnap, stressSnap, scenarioSnap, progressSnap, quizSnap, labSnap, failureSnap] = await Promise.all([
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid), where('completed', '==', true), where('startTime', '>=', dateFilter))),
        getDocs(query(collection(db, 'battleDrillPerformance'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'stressTrainingSessions'), where('userId', '==', user.uid), where('completed', '==', true))),
        getDocs(query(collection(db, 'scenarioAttempts'), where('userId', '==', user.uid), where('completed', '==', true))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'quizAttempts'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid), where('type', '==', 'lab'))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid)))
      ]);

      // Process all data
      const session = processSessionDocs(sessionsSnap.docs);
      const drill = processDrillDocs(drillPerfSnap.docs);
      const mastery = processProgressDocs(progressSnap.docs);
      const quiz = processQuizDocs(quizSnap.docs);
      const lab = processLabDocs(labSnap.docs);
      const failure = processFailureDocs(failureSnap.docs);
      const streaks = calculateStreaks(sessionsSnap.docs);
      const weeklyProgress = calculateWeeklyProgress(sessionsSnap.docs);
      const monthlyTrends = calculateMonthlyTrends(progressSnap.docs);
      const tokenStats = await getUsageStats();

      setAnalytics(buildAnalytics({
        session, drill, stress: stressSnap.size, scenarios: scenarioSnap.size,
        mastery, progressSize: progressSnap.size, quiz, lab,
        failure, tokenUsage: tokenStats.totalResetsUsed, streaks,
        weeklyProgress, monthlyTrends
      }));
    } catch (error) { console.error('Error loading analytics:', error); }
    finally { setLoading(false); }
  }, [user?.uid, getUsageStats, timeRange]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  return { analytics, loading, loadAnalytics };
};
