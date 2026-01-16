/**
 * Mastery Hook - Refactored
 * Handles 4-level mastery system (Crawl → Walk → Run-Guided → Run-Independent)
 */

import { useState, useEffect, useCallback } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useProgress } from './useProgress';
import type { LessonMastery, MasteryLevel, MasteryProgress } from '../types/training';
import { initializeLessonMastery } from '../lib/firestoreSchema';
import { getLevelKey, getLevelProgressFromMastery, checkCanAccessLevel, checkIsLevelMastered, updateMasteryAfterAttempt } from './mastery/masteryUtils';

export function useMastery(lessonId: string) {
  const { user } = useAuthStore();
  const { completeLesson } = useProgress();
  const [mastery, setMastery] = useState<LessonMastery | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<MasteryLevel>('crawl');

  const loadMastery = useCallback(async () => {
    if (!user?.uid || !lessonId) return;
    try {
      setLoading(true);
      const masteryData = await initializeLessonMastery(user.uid, lessonId);
      setMastery(masteryData);
      setCurrentLevel(masteryData.currentLevel);
    } catch (error) { console.error('Error loading mastery:', error); }
    finally { setLoading(false); }
  }, [user?.uid, lessonId]);

  useEffect(() => {
    if (!user?.uid || !lessonId) { setLoading(false); return; }
    loadMastery();
  }, [user?.uid, lessonId, loadMastery]);

  const recordAttempt = async (level: MasteryLevel, perfect: boolean, timeSpent: number) => {
    if (!user?.uid || !lessonId || !mastery) return null;

    const levelKey = getLevelKey(level);
    if (!mastery[levelKey].unlocked) return null;

    try {
      const { updatedMastery, levelMastered } = updateMasteryAfterAttempt(mastery, level, perfect, timeSpent);
      
      await setDoc(doc(db, 'masteryProgress', `${user.uid}_${lessonId}`), updatedMastery);
      
      if (updatedMastery.fullyMastered && !mastery.fullyMastered) {
        try { await completeLesson(lessonId, 100); } catch (e) { console.error('Failed to complete lesson:', e); }
      }
      
      setMastery(updatedMastery);
      setCurrentLevel(updatedMastery.currentLevel);

      return { levelMastered, nextLevelUnlocked: levelMastered && level !== 'run-independent', fullyMastered: updatedMastery.fullyMastered };
    } catch (error) { console.error('Error recording attempt:', error); return null; }
  };

  const getLevelProgress = (level: MasteryLevel): MasteryProgress | null => getLevelProgressFromMastery(mastery, level);
  const canAccessLevel = (level: MasteryLevel): boolean => checkCanAccessLevel(mastery, level);
  const isLevelMastered = (level: MasteryLevel): boolean => checkIsLevelMastered(mastery, level);

  return { mastery, loading, currentLevel, recordAttempt, getLevelProgress, canAccessLevel, isLevelMastered, refreshMastery: loadMastery };
}
