/**
 * Adaptive Difficulty Hook - Refactored
 * Automatically adjusts difficulty based on performance
 */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import type {
  DifficultyLevel,
  PerformanceMetrics,
  DifficultySettings,
  DifficultyAdjustment,
  AdaptiveRecommendation,
} from "../types/adaptiveDifficulty";
import {
  getDefaultMetrics,
  createSettingsForLevel,
  evaluateRecommendationLogic,
  loadDifficultySettingsFromDB,
  loadRecentAdjustmentsFromDB,
  calculatePerformanceMetricsFromDB,
  adjustDifficultyInDB,
} from "./adaptive-difficulty/adaptiveDifficultyUtils";

export function useAdaptiveDifficulty() {
  const { user } = useAuthStore();
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>("recruit");
  const [settings, setSettings] = useState<DifficultySettings | null>(null);
  const [recommendation, setRecommendation] =
    useState<AdaptiveRecommendation | null>(null);
  const [recentAdjustments, setRecentAdjustments] = useState<
    DifficultyAdjustment[]
  >([]);
  const [loading, setLoading] = useState(true);

  const loadDifficultySettings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const { currentLevel: level, settings: settingsData } = await loadDifficultySettingsFromDB(user.uid);
      setCurrentLevel(level);
      setSettings(settingsData);
    } catch {
      setSettings(createSettingsForLevel("recruit"));
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const loadRecentAdjustments = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const adjustments = await loadRecentAdjustmentsFromDB(user.uid);
      setRecentAdjustments(adjustments);
    } catch {
      /* ignore */
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadDifficultySettings();
      loadRecentAdjustments();
    }
  }, [user?.uid, loadDifficultySettings, loadRecentAdjustments]);

  const calculatePerformanceMetrics =
    useCallback(async (): Promise<PerformanceMetrics> => {
      if (!user?.uid) return getDefaultMetrics();
      return calculatePerformanceMetricsFromDB(user.uid);
    }, [user?.uid]);

  const evaluateRecommendation =
    useCallback(async (): Promise<AdaptiveRecommendation> => {
      const metrics = await calculatePerformanceMetrics();
      const result = evaluateRecommendationLogic(currentLevel, metrics);
      return { ...result, metricsSnapshot: metrics };
    }, [currentLevel, calculatePerformanceMetrics]);

  const adjustDifficulty = async (
    newLevel: DifficultyLevel,
    autoAdjusted: boolean,
    reason: string,
  ): Promise<void> => {
    if (!user?.uid) return;
    const { newSettings } = await adjustDifficultyInDB(
      user.uid,
      newLevel,
      currentLevel,
      reason,
      autoAdjusted,
    );
    setCurrentLevel(newLevel);
    setSettings(newSettings);
    await loadRecentAdjustments();
  };

  const checkAndAutoAdjust = async (): Promise<boolean> => {
    const rec = await evaluateRecommendation();
    setRecommendation(rec);
    if (rec.type !== "maintain" && rec.confidence > 0.7) {
      await adjustDifficulty(
        rec.suggestedLevel,
        true,
        `Auto: ${rec.reasoning.join(". ")}`,
      );
      return true;
    }
    return false;
  };

  return {
    currentLevel,
    settings,
    recommendation,
    recentAdjustments,
    loading,
    adjustDifficulty,
    evaluateRecommendation,
    checkAndAutoAdjust,
    calculatePerformanceMetrics,
  };
}
