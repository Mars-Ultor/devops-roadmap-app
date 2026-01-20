/**
 * Topic Mastery Heatmap Data Loader Hook
 * Handles loading and processing of heatmap data
 */

import { useState, useCallback } from "react";
import { useAuthStore } from "../../store/authStore";
import { db } from "../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { TopicMasteryData } from "../useTopicMasteryHeatmap";
import { processProgressDocuments } from "./topicMasteryHeatmapUtils";

export function useTopicMasteryHeatmapData() {
  const { user } = useAuthStore();
  const [heatmapData, setHeatmapData] = useState<TopicMasteryData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTopicMasteryData = useCallback(async () => {
    if (!user) return;

    try {
      // Get all progress data
      const progressQuery = query(
        collection(db, "progress"),
        where("userId", "==", user.uid),
      );
      const progressSnap = await getDocs(progressQuery);

      const processedData = processProgressDocuments(progressSnap.docs);
      setHeatmapData(processedData);
    } catch (error) {
      console.error("Error loading topic mastery data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    heatmapData,
    loading,
    loadTopicMasteryData,
  };
}