/**
 * Hook for managing user training state
 * Handles mastery progression, daily drills, reset tokens, streaks
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { UserTrainingState } from '../types/training';
import {
  initializeUserTrainingState,
  checkDailyDrillStatus,
  getResetTokenCount,
  updateWeeklyTokens
} from '../lib/firestoreSchema';

export function useTrainingState() {
  const { user } = useAuthStore();
  const [trainingState, setTrainingState] = useState<UserTrainingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyDrillRequired, setDailyDrillRequired] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    loadTrainingState();
  }, [user?.uid, user?.currentWeek, loadTrainingState]);

  const loadTrainingState = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Initialize if needed
      await initializeUserTrainingState(user.uid, user.currentWeek || 1);

      // Check daily drill status
      const dailyDrill = await checkDailyDrillStatus(user.uid);
      const drillNeeded = !dailyDrill || !dailyDrill.completed;
      setDailyDrillRequired(drillNeeded);

      // Get reset token count
      const resetTokens = await getResetTokenCount(user.uid);

      // Get streak data
      const streakRef = doc(db, 'progressStreaks', user.uid);
      const streakSnap = await getDoc(streakRef);
      const streakData = streakSnap.exists() ? streakSnap.data() : null;

      // Build training state
      const state: UserTrainingState = {
        userId: user.uid,
        currentWeek: user.currentWeek || 1,
        currentLesson: undefined,
        lessonsCompleted: [],
        lessonsMastered: [],
        weeksMastered: [],
        dailyDrillCompleted: !drillNeeded,
        resetTokensRemaining: resetTokens,
        currentStreak: streakData?.currentStreak || 0,
        longestStreak: streakData?.longestStreak || 0,
        metrics: {
          userId: user.uid,
          week: user.currentWeek || 1,
          battleDrillStats: {
            averageTime: 0,
            bestTime: undefined,
            improvementRate: 0,
            drillsCompleted: 0
          },
          averageStruggleEndurance: 0,
          firstTrySuccessRate: 0,
          hintsRequestedPerLab: 0,
          resetsUsedThisWeek: 0,
          errorPatterns: [],
          degradingSkills: [],
          topicMastery: {},
          productivityByHour: {},
          totalTimeSpent: 0
        }
      };

      setTrainingState(state);
    } catch (error) {
      console.error('Error loading training state:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.currentWeek]);

  const updateCurrentWeek = async (newWeek: number) => {
    if (!user?.uid) return;

    try {
      // Update reset tokens for new week
      await updateWeeklyTokens(user.uid, newWeek);

      // Reload training state
      await loadTrainingState();
    } catch (error) {
      console.error('Error updating week:', error);
    }
  };

  const completeDailyDrill = async () => {
    if (!user?.uid) return;

    setDailyDrillRequired(false);
    await loadTrainingState();
  };

  return {
    trainingState,
    loading,
    dailyDrillRequired,
    updateCurrentWeek,
    completeDailyDrill,
    refreshState: loadTrainingState
  };
}
