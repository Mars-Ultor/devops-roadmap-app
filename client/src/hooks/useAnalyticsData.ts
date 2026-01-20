/**
 * Analytics Data Hook - Refactored
 * Collects comprehensive learning analytics
 */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import {
  getDefaultAnalytics,
  loadInitialAnalyticsData,
} from "./analytics-data/analyticsDataUtils";
import type {
  AnalyticsData,
  TimeRange,
} from "./analytics-data/analyticsDataUtils";

export type {
  AnalyticsData,
  TimeRange,
} from "./analytics-data/analyticsDataUtils";

export const useAnalyticsData = (timeRange: TimeRange) => {
  const { user } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData>(
    getDefaultAnalytics(),
  );
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const analyticsData = await loadInitialAnalyticsData(user.uid, timeRange);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, timeRange]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  return { analytics, loading, loadAnalytics };
};
