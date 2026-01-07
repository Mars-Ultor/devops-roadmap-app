/**
 * Learning Velocity Analysis Hook - Refactored
 * Tracks progress speed and learning acceleration over time
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { WeeklyProgress } from './learning-velocity/learningVelocityUtils';
import { calculateVelocityTrend, getWeekKey, convertToWeeklyProgress, calculateCurrentPace, calculateOptimalPace, projectCompletionDate } from './learning-velocity/learningVelocityUtils';

export type { WeeklyProgress };

export interface LearningVelocityData {
  weeklyProgress: WeeklyProgress[];
  velocityTrend: 'accelerating' | 'steady' | 'decelerating';
  projectedCompletion: Date | null;
  currentPace: number;
  optimalPace: number;
}

export function useLearningVelocity() {
  const { user } = useAuthStore();
  const [velocityData, setVelocityData] = useState<LearningVelocityData | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeLearningVelocity = useCallback(async () => {
    if (!user) return;
    try {
      const progressSnap = await getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid), orderBy('completedAt', 'asc')));
      
      // Group by weeks
      const weeklyData: Record<string, { items: Array<Record<string, unknown>>; totalTime: number; masteredItems: number; weekStart: Date }> = {};
      progressSnap.docs.forEach(doc => {
        const data = doc.data();
        const completedAt = data.completedAt?.toDate();
        if (!completedAt) return;
        const weekKey = getWeekKey(completedAt);
        const weekStart = new Date(completedAt);
        weekStart.setDate(completedAt.getDate() - completedAt.getDay());
        weekStart.setHours(0, 0, 0, 0);
        if (!weeklyData[weekKey]) weeklyData[weekKey] = { items: [], totalTime: 0, masteredItems: 0, weekStart };
        weeklyData[weekKey].items.push(data);
        weeklyData[weekKey].totalTime += data.timeSpentMinutes || 0;
        if (data.masteryLevel === 'run-independent') weeklyData[weekKey].masteredItems++;
      });

      const weeklyProgress = convertToWeeklyProgress(weeklyData);
      const currentPace = calculateCurrentPace(weeklyProgress);
      const optimalPace = calculateOptimalPace(weeklyProgress);
      const remainingItems = 100;

      setVelocityData({
        weeklyProgress,
        velocityTrend: calculateVelocityTrend(weeklyProgress),
        projectedCompletion: projectCompletionDate(currentPace, remainingItems),
        currentPace: Math.round(currentPace * 10) / 10,
        optimalPace: Math.round(optimalPace * 10) / 10
      });
    } catch (error) { console.error('Error analyzing learning velocity:', error); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { if (user) analyzeLearningVelocity(); }, [user, analyzeLearningVelocity]);

  return { velocityData, loading, analyzeLearningVelocity };
}
