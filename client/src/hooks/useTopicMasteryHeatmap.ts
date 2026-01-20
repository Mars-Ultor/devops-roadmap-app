/**
 * Topic Mastery Heatmap Hook
 * Provides data for visualizing mastery levels across topics and weeks
 */

import { useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import type { TopicMasteryData } from "./useTopicMasteryHeatmap";
import { useTopicMasteryHeatmapData } from "./topic-mastery-heatmap/useTopicMasteryHeatmapData";

export interface TopicMasteryData {
  topics: Array<{
    id: string;
    name: string;
    week: number;
    masteryLevel: "crawl" | "walk" | "run-guided" | "run-independent";
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
  const { heatmapData, loading, loadTopicMasteryData } = useTopicMasteryHeatmapData();

  useEffect(() => {
    if (user) {
      loadTopicMasteryData();
    }
  }, [user, loadTopicMasteryData]);

  return {
    heatmapData,
    loading,
    loadTopicMasteryData,
  };
}
