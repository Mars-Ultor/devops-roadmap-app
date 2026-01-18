/**
 * Study Time Analysis Hook - Refactored
 * Tracks performance by hour and recommends optimal study times
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { QuerySnapshot } from 'firebase/firestore';
import type { HourlyPerformance, TimeRecommendation } from './time-analysis/timeAnalysisUtils';
import { formatHour, calculateHourlyPerformance, generateRecommendation } from './time-analysis/timeAnalysisUtils';

export type { HourlyPerformance, TimeRecommendation } from './time-analysis/timeAnalysisUtils';

export interface TimeAnalysisData {
  hourlyPerformance: HourlyPerformance[];
  recommendation: TimeRecommendation;
  totalDataPoints: number;
}

export function useTimeAnalysis(progressSnap?: QuerySnapshot) {
  const { user } = useAuthStore();
  const [analysisData, setAnalysisData] = useState<TimeAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeStudyTimes = useCallback(async (data?: QuerySnapshot) => {
    if (!user?.uid) return;
    try {
      const snapToUse = data || await getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid)));
      
      // Initialize hourly data
      const hourlyData: Record<number, { scores: number[]; completions: number; attempts: number; totalMinutes: number }> = {};
      for (let i = 0; i < 24; i++) hourlyData[i] = { scores: [], completions: 0, attempts: 0, totalMinutes: 0 };

      // Aggregate by hour
      snapToUse.docs.forEach(doc => {
        const docData = doc.data();
        const completedAt = docData.completedAt?.toDate();
        if (!completedAt) return;
        const hour = completedAt.getHours();
        hourlyData[hour].scores.push(docData.score || 0);
        hourlyData[hour].attempts++;
        hourlyData[hour].totalMinutes += docData.timeSpentMinutes || 0;
        if (docData.completed) hourlyData[hour].completions++;
      });

      const hourlyPerformance = calculateHourlyPerformance(hourlyData);
      const recommendation = generateRecommendation(hourlyPerformance);

      setAnalysisData({ hourlyPerformance, recommendation, totalDataPoints: snapToUse.size });
    } catch (error) { console.error('Error analyzing study times:', error); }
    finally { setLoading(false); }
  }, [user?.uid]);

  useEffect(() => {
    if (progressSnap) {
      analyzeStudyTimes(progressSnap);
    } else if (user?.uid) {
      analyzeStudyTimes();
    }
  }, [analyzeStudyTimes, user?.uid, progressSnap]);

  return { analysisData, loading, analyzeStudyTimes, formatHour };
}
