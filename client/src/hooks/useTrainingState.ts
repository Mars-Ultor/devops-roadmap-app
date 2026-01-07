/**
 * Training State Hook - Refactored
 * Handles mastery progression, daily drills, reset tokens, streaks
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { UserTrainingState } from '../types/training';
import { initializeUserTrainingState, checkDailyDrillStatus, getResetTokenCount, updateWeeklyTokens } from '../lib/firestoreSchema';
import { buildTrainingState } from './training-state/trainingStateUtils';

export function useTrainingState() {
  const { user } = useAuthStore();
  const [trainingState, setTrainingState] = useState<UserTrainingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyDrillRequired, setDailyDrillRequired] = useState(false);

  const loadTrainingState = useCallback(async () => {
    if (!user?.uid) return;
    try {
      setLoading(true);
      await initializeUserTrainingState(user.uid, user.currentWeek || 1);
      
      const dailyDrill = await checkDailyDrillStatus(user.uid);
      const drillNeeded = !dailyDrill || !dailyDrill.completed;
      setDailyDrillRequired(drillNeeded);

      const resetTokens = await getResetTokenCount(user.uid);
      const streakSnap = await getDoc(doc(db, 'progressStreaks', user.uid));
      const streakData = streakSnap.exists() ? streakSnap.data() : null;

      setTrainingState(buildTrainingState(
        user.uid,
        user.currentWeek || 1,
        !drillNeeded,
        resetTokens,
        streakData?.currentStreak || 0,
        streakData?.longestStreak || 0
      ));
    } catch (error) { console.error('Error loading training state:', error); }
    finally { setLoading(false); }
  }, [user?.uid, user?.currentWeek]);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    loadTrainingState();
  }, [user?.uid, user?.currentWeek, loadTrainingState]);

  const updateCurrentWeek = async (newWeek: number) => {
    if (!user?.uid) return;
    try { await updateWeeklyTokens(user.uid, newWeek); await loadTrainingState(); }
    catch (error) { console.error('Error updating week:', error); }
  };

  const completeDailyDrill = async () => {
    if (!user?.uid) return;
    setDailyDrillRequired(false);
    await loadTrainingState();
  };

  return { trainingState, loading, dailyDrillRequired, updateCurrentWeek, completeDailyDrill, refreshState: loadTrainingState };
}
