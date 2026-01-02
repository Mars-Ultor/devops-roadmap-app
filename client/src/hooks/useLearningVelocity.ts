/**
 * Learning Velocity Analysis Hook
 * Tracks progress speed and learning acceleration over time
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

export interface WeeklyProgress {
  week: number;
  itemsCompleted: number;
  avgTimePerItem: number;
  masteryRate: number;
  date: Date;
}

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

  useEffect(() => {
    if (user) {
      analyzeLearningVelocity();
    }
  }, [user]);

  const analyzeLearningVelocity = async () => {
    if (!user) return;

    try {
      // Get progress data over time
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        orderBy('completedAt', 'asc')
      );
      const progressSnap = await getDocs(progressQuery);

      // Group by weeks
      const weeklyData: Record<string, {
        items: { id: string; data: () => Record<string, unknown> }[];
        totalTime: number;
        masteredItems: number;
        weekStart: Date;
      }> = {};

      progressSnap.docs.forEach(doc => {
        const data = doc.data();
        const completedAt = data.completedAt?.toDate();
        if (!completedAt) return;

        // Calculate week number (weeks since epoch)
        const weekStart = new Date(completedAt);
        weekStart.setDate(completedAt.getDate() - completedAt.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString();

        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = {
            items: [],
            totalTime: 0,
            masteredItems: 0,
            weekStart
          };
        }

        weeklyData[weekKey].items.push(data);
        weeklyData[weekKey].totalTime += data.timeSpentMinutes || 0;
        if (data.masteryLevel === 'run-independent') {
          weeklyData[weekKey].masteredItems++;
        }
      });

      // Convert to weekly progress array
      const weeklyProgress: WeeklyProgress[] = Object.entries(weeklyData)
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([weekKey, data]) => {
          const weekNumber = Math.floor((new Date(weekKey).getTime() - new Date('2024-01-01').getTime()) / (1000 * 60 * 60 * 24 * 7)) + 1;

          return {
            week: weekNumber,
            itemsCompleted: data.items.length,
            avgTimePerItem: data.items.length > 0 ? data.totalTime / data.items.length : 0,
            masteryRate: data.items.length > 0 ? (data.masteredItems / data.items.length) * 100 : 0,
            date: data.weekStart
          };
        });

      // Calculate velocity trend
      const velocityTrend = calculateVelocityTrend(weeklyProgress);

      // Calculate current pace (last 4 weeks average)
      const recentWeeks = weeklyProgress.slice(-4);
      const currentPace = recentWeeks.length > 0
        ? recentWeeks.reduce((sum, w) => sum + w.itemsCompleted, 0) / recentWeeks.length
        : 0;

      // Calculate optimal pace (assume 12-week program, adjust based on remaining content)
      const totalWeeks = 12;
      const completedWeeks = Math.max(...weeklyProgress.map(w => w.week), 0);
      const remainingWeeks = Math.max(totalWeeks - completedWeeks, 1);
      const remainingItems = 100; // Estimated remaining items
      const optimalPace = remainingItems / remainingWeeks;

      // Project completion date
      const projectedCompletion = currentPace > 0
        ? new Date(Date.now() + (remainingItems / currentPace) * 7 * 24 * 60 * 60 * 1000)
        : null;

      setVelocityData({
        weeklyProgress,
        velocityTrend,
        projectedCompletion,
        currentPace: Math.round(currentPace * 10) / 10,
        optimalPace: Math.round(optimalPace * 10) / 10
      });
    } catch (error) {
      console.error('Error analyzing learning velocity:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateVelocityTrend = (weeklyData: WeeklyProgress[]): 'accelerating' | 'steady' | 'decelerating' => {
    if (weeklyData.length < 3) return 'steady';

    // Calculate trend using linear regression on items completed
    const n = weeklyData.length;
    const sumX = weeklyData.reduce((sum, _, idx) => sum + idx, 0);
    const sumY = weeklyData.reduce((sum, w) => sum + w.itemsCompleted, 0);
    const sumXY = weeklyData.reduce((sum, w, idx) => sum + idx * w.itemsCompleted, 0);
    const sumXX = weeklyData.reduce((sum, _, idx) => sum + idx * idx, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    if (slope > 0.5) return 'accelerating';
    if (slope < -0.5) return 'decelerating';
    return 'steady';
  };

  return {
    velocityData,
    loading,
    analyzeLearningVelocity
  };
}