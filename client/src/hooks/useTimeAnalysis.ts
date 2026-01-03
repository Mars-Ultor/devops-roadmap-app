/**
 * Study Time Analysis Hook
 * Tracks performance by hour and recommends optimal study times
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface HourlyPerformance {
  hour: number; // 0-23
  totalSessions: number;
  averageScore: number;
  totalTimeMinutes: number;
  completionRate: number; // percentage of tasks completed
}

export interface TimeRecommendation {
  bestHours: number[];
  worstHours: number[];
  peakPerformanceWindow: string;
  recommendation: string;
  confidenceLevel: 'low' | 'medium' | 'high';
}

export interface TimeAnalysisData {
  hourlyPerformance: HourlyPerformance[];
  recommendation: TimeRecommendation;
  totalDataPoints: number;
}

export function useTimeAnalysis() {
  const { user } = useAuthStore();
  const [analysisData, setAnalysisData] = useState<TimeAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeStudyTimes = useCallback(async () => {
    if (!user) return;

    try {
      // Get all user progress with timestamps
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid)
      );
      const progressSnap = await getDocs(progressQuery);

      const hourlyData: Record<number, {
        scores: number[];
        completions: number;
        attempts: number;
        totalMinutes: number;
      }> = {};

      // Initialize all 24 hours
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { scores: [], completions: 0, attempts: 0, totalMinutes: 0 };
      }

      // Aggregate data by hour
      progressSnap.docs.forEach(doc => {
        const data = doc.data();
        const completedAt = data.completedAt?.toDate();
        if (!completedAt) return;

        const hour = completedAt.getHours();
        const score = data.score || 0;
        const timeSpent = data.timeSpentMinutes || 0;

        hourlyData[hour].scores.push(score);
        hourlyData[hour].attempts++;
        hourlyData[hour].totalMinutes += timeSpent;
        
        if (data.completed) {
          hourlyData[hour].completions++;
        }
      });

      // Calculate hourly performance
      const hourlyPerformance: HourlyPerformance[] = Object.entries(hourlyData).map(([hour, data]) => ({
        hour: parseInt(hour),
        totalSessions: data.attempts,
        averageScore: data.scores.length > 0 
          ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length 
          : 0,
        totalTimeMinutes: data.totalMinutes,
        completionRate: data.attempts > 0 
          ? (data.completions / data.attempts) * 100 
          : 0
      }));

      // Generate recommendations
      const recommendation = generateRecommendation(hourlyPerformance);

      setAnalysisData({
        hourlyPerformance,
        recommendation,
        totalDataPoints: progressSnap.size
      });
    } catch (error) {
      console.error('Error analyzing study times:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      analyzeStudyTimes();
    }
  }, [user, analyzeStudyTimes]);

  const generateRecommendation = (hourlyData: HourlyPerformance[]): TimeRecommendation => {
    // Filter hours with sufficient data (at least 3 sessions)
    const significantHours = hourlyData.filter(h => h.totalSessions >= 3);

    if (significantHours.length < 3) {
      return {
        bestHours: [],
        worstHours: [],
        peakPerformanceWindow: 'Insufficient data',
        recommendation: 'Complete more sessions to generate time recommendations. Try studying at different times of day.',
        confidenceLevel: 'low'
      };
    }

    // Sort by combined performance metric (score + completion rate)
    const sortedByPerformance = [...significantHours].sort((a, b) => {
      const scoreA = (a.averageScore * 0.6) + (a.completionRate * 0.4);
      const scoreB = (b.averageScore * 0.6) + (b.completionRate * 0.4);
      return scoreB - scoreA;
    });

    const bestHours = sortedByPerformance.slice(0, 3).map(h => h.hour).sort((a, b) => a - b);
    const worstHours = sortedByPerformance.slice(-3).map(h => h.hour).sort((a, b) => a - b);

    // Find consecutive best hours for "peak window"
    const peakWindow = findPeakWindow(bestHours);
    const peakPerformanceWindow = formatTimeWindow(peakWindow);

    // Generate recommendation text
    const bestTime = formatHour(bestHours[0]);
    const worstTime = formatHour(worstHours[0]);
    const bestScore = Math.round(sortedByPerformance[0].averageScore);
    const worstScore = Math.round(sortedByPerformance[sortedByPerformance.length - 1].averageScore);

    const recommendation = `Your best performance is around ${bestTime} (avg ${bestScore}%), ` +
      `while ${worstTime} shows lower scores (avg ${worstScore}%). ` +
      `Schedule critical learning and battle drills during ${peakPerformanceWindow} for optimal results.`;

    const confidenceLevel: 'low' | 'medium' | 'high' = 
      significantHours.length >= 10 ? 'high' :
      significantHours.length >= 5 ? 'medium' : 'low';

    return {
      bestHours,
      worstHours,
      peakPerformanceWindow,
      recommendation,
      confidenceLevel
    };
  };

  const findPeakWindow = (hours: number[]): number[] => {
    if (hours.length === 0) return [];
    if (hours.length === 1) return hours;

    // Find longest consecutive sequence
    let longestSequence: number[] = [hours[0]];
    let currentSequence: number[] = [hours[0]];

    for (let i = 1; i < hours.length; i++) {
      if (hours[i] === hours[i - 1] + 1) {
        currentSequence.push(hours[i]);
      } else {
        if (currentSequence.length > longestSequence.length) {
          longestSequence = currentSequence;
        }
        currentSequence = [hours[i]];
      }
    }

    if (currentSequence.length > longestSequence.length) {
      longestSequence = currentSequence;
    }

    return longestSequence.length > 1 ? longestSequence : [hours[0], hours[1] || hours[0]];
  };

  const formatTimeWindow = (hours: number[]): string => {
    if (hours.length === 0) return 'Not enough data';
    if (hours.length === 1) return formatHour(hours[0]);
    
    const start = formatHour(hours[0]);
    const end = formatHour(hours[hours.length - 1] + 1); // End is exclusive
    return `${start} - ${end}`;
  };

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  return {
    analysisData,
    loading,
    analyzeStudyTimes,
    formatHour
  };
}
