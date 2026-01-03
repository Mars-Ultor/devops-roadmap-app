/**
 * Topic Mastery Heatmap Hook
 * Provides data for visualizing mastery levels across topics and weeks
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface TopicMasteryData {
  topics: Array<{
    id: string;
    name: string;
    week: number;
    masteryLevel: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
    score: number;
    attempts: number;
    lastAttempt: Date;
    timeSpent: number;
  }>;
  weekStats: Array<{
    week: number;
    totalTopics: number;
    masteredTopics: number;
    avgMasteryLevel: number;
  }>;
}

export function useTopicMasteryHeatmap() {
  const { user } = useAuthStore();
  const [heatmapData, setHeatmapData] = useState<TopicMasteryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTopicMasteryData();
    }
  }, [user, loadTopicMasteryData]);

  const loadTopicMasteryData = useCallback(async () => {
    if (!user) return;

    try {
      // Get all progress data
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid)
      );
      const progressSnap = await getDocs(progressQuery);

      const topics: TopicMasteryData['topics'] = [];
      const weekMap: Record<number, { total: number; mastered: number; levels: number[] }> = {};

      progressSnap.docs.forEach(doc => {
        const data = doc.data();
        const topic = {
          id: data.contentId || data.lessonId || doc.id,
          name: data.contentId || data.lessonId || 'Unknown Topic',
          week: data.weekNumber || 1,
          masteryLevel: data.masteryLevel || 'crawl',
          score: data.score || 0,
          attempts: data.repetitions || 1,
          lastAttempt: data.lastReviewDate?.toDate() || data.completedAt?.toDate() || new Date(),
          timeSpent: data.timeSpentMinutes || 0
        };

        topics.push(topic);

        // Update week stats
        if (!weekMap[topic.week]) {
          weekMap[topic.week] = { total: 0, mastered: 0, levels: [] };
        }
        weekMap[topic.week].total++;
        if (topic.masteryLevel === 'run-independent') {
          weekMap[topic.week].mastered++;
        }

        // Convert mastery level to number for averaging
        const levelValue = {
          'crawl': 1,
          'walk': 2,
          'run-guided': 3,
          'run-independent': 4
        }[topic.masteryLevel] || 1;
        weekMap[topic.week].levels.push(levelValue);
      });

      // Calculate week stats
      const weekStats: TopicMasteryData['weekStats'] = Object.entries(weekMap)
        .map(([week, data]) => ({
          week: parseInt(week),
          totalTopics: data.total,
          masteredTopics: data.mastered,
          avgMasteryLevel: data.levels.reduce((sum, level) => sum + level, 0) / data.levels.length
        }))
        .sort((a, b) => a.week - b.week);

      // Sort topics by week and name
      topics.sort((a, b) => {
        if (a.week !== b.week) return a.week - b.week;
        return a.name.localeCompare(b.name);
      });

      setHeatmapData({
        topics,
        weekStats
      });
    } catch (error) {
      console.error('Error loading topic mastery data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    heatmapData,
    loading,
    loadTopicMasteryData
  };
}