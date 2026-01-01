/**
 * Hook for managing lesson mastery progression
 * Handles 4-level mastery system (Crawl → Walk → Run-Guided → Run-Independent)
 */

import { useState, useEffect } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { useProgress } from './useProgress';
import type { LessonMastery, MasteryLevel, MasteryProgress } from '../types/training';
import { initializeLessonMastery } from '../lib/firestoreSchema';

export function useMastery(lessonId: string) {
  const { user } = useAuthStore();
  const { completeLesson } = useProgress();
  const [mastery, setMastery] = useState<LessonMastery | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState<MasteryLevel>('crawl');

  // Helper to map level to property key
  const getLevelKey = (level: MasteryLevel): keyof Pick<LessonMastery, 'crawl' | 'walk' | 'runGuided' | 'runIndependent'> => {
    if (level === 'run-guided') return 'runGuided';
    if (level === 'run-independent') return 'runIndependent';
    return level as 'crawl' | 'walk';
  };

  useEffect(() => {
    if (!user?.uid || !lessonId) {
      setLoading(false);
      return;
    }

    loadMastery();
  }, [user?.uid, lessonId]);

  const loadMastery = async () => {
    if (!user?.uid || !lessonId) return;

    try {
      setLoading(true);
      const masteryData = await initializeLessonMastery(user.uid, lessonId);
      setMastery(masteryData);
      setCurrentLevel(masteryData.currentLevel);
    } catch (error) {
      console.error('Error loading mastery:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordAttempt = async (
    level: MasteryLevel,
    perfect: boolean,
    timeSpent: number
  ) => {
    console.log('🟢 recordAttempt called with:', { level, perfect, timeSpent });
    console.log('🟢 User ID:', user?.uid);
    console.log('🟢 Lesson ID:', lessonId);
    console.log('🟢 Mastery exists:', !!mastery);
    
    if (!user?.uid || !lessonId || !mastery) {
      console.log('🔴 recordAttempt EARLY RETURN - missing data:', {
        hasUser: !!user?.uid,
        hasLesson: !!lessonId,
        hasMastery: !!mastery
      });
      return;
    }

    // Edge case: Check if level is actually unlocked before allowing attempt
    const levelKey = getLevelKey(level);
    if (!mastery[levelKey].unlocked) {
      console.log('🔴 Attempt blocked - level not unlocked:', level);
      return null;
    }

    try {
      const masteryRef = doc(db, 'masteryProgress', `${user.uid}_${lessonId}`);
      console.log('🟢 Firestore doc path:', `masteryProgress/${user.uid}_${lessonId}`);
      
      const levelData = mastery[levelKey];
      console.log('🟢 Current level data:', levelData);
      
      const newAttempts = levelData.attempts + 1;
      const newPerfectCompletions = perfect
        ? levelData.perfectCompletions + 1
        : levelData.perfectCompletions;

      console.log('🟢 New counts:', {
        newAttempts,
        newPerfectCompletions,
        oldAttempts: levelData.attempts,
        oldPerfectCompletions: levelData.perfectCompletions
      });

      // Calculate new average time (prevent division by zero)
      const totalTime = (levelData.averageTime || 0) * levelData.attempts + timeSpent;
      const newAverageTime = newAttempts > 0 ? totalTime / newAttempts : timeSpent;

      // Check if level is now mastered
      const isLevelMastered = newPerfectCompletions >= levelData.requiredPerfectCompletions;
      console.log('🟢 Is level mastered?', isLevelMastered, `(${newPerfectCompletions}/${levelData.requiredPerfectCompletions})`);

      // Determine next level to unlock
      const updatedMastery = { ...mastery };
      updatedMastery[levelKey] = {
        ...levelData,
        attempts: newAttempts,
        perfectCompletions: newPerfectCompletions,
        lastAttemptDate: new Date(),
        averageTime: newAverageTime
      };

      // Unlock next level if current is mastered (only if not already unlocked)
      if (isLevelMastered) {
        if (level === 'crawl' && !mastery.walk.unlocked) {
          updatedMastery.walk = { ...mastery.walk, unlocked: true };
          updatedMastery.currentLevel = 'walk';
        } else if (level === 'walk' && !mastery.runGuided.unlocked) {
          updatedMastery.runGuided = { ...mastery.runGuided, unlocked: true };
          updatedMastery.currentLevel = 'run-guided';
        } else if (level === 'run-guided' && !mastery.runIndependent.unlocked) {
          updatedMastery.runIndependent = { ...mastery.runIndependent, unlocked: true };
          updatedMastery.currentLevel = 'run-independent';
        } else if (level === 'run-independent') {
          updatedMastery.fullyMastered = true;
          // Ensure currentLevel reflects completion
          updatedMastery.currentLevel = 'run-independent';
        }
      }

      // Edge case: Ensure currentLevel is set to the highest unlocked level
      const levelOrder: MasteryLevel[] = ['crawl', 'walk', 'run-guided', 'run-independent'];
      for (const lvl of levelOrder.reverse()) {
        const lvlKey = getLevelKey(lvl);
        if (updatedMastery[lvlKey].unlocked) {
          updatedMastery.currentLevel = lvl;
          break;
        }
      }

      console.log('🟢 About to save to Firestore:', updatedMastery);
      await setDoc(masteryRef, updatedMastery);
      console.log('✅ Firestore save SUCCESS');
      
      // If lesson was just fully mastered, mark it as completed in progress system
      if (updatedMastery.fullyMastered && !mastery.fullyMastered) {
        try {
          await completeLesson(lessonId, 100);
        } catch (error) {
          console.error('Failed to complete lesson in progress system:', error);
          // Don't fail the whole operation for this
        }
      }
      
      setMastery(updatedMastery);
      setCurrentLevel(updatedMastery.currentLevel);

      return {
        levelMastered: isLevelMastered,
        nextLevelUnlocked: isLevelMastered && level !== 'run-independent',
        fullyMastered: updatedMastery.fullyMastered
      };
    } catch (error) {
      console.error('🔴 Error recording attempt:', error);
      return null;
    }
  };

  const getLevelProgress = (level: MasteryLevel): MasteryProgress | null => {
    if (!mastery) return null;
    const levelKey = getLevelKey(level);
    return mastery[levelKey];
  };

  const canAccessLevel = (level: MasteryLevel): boolean => {
    if (!mastery) return false;
    const levelKey = getLevelKey(level);
    return mastery[levelKey].unlocked;
  };

  const isLevelMastered = (level: MasteryLevel): boolean => {
    if (!mastery) return false;
    const levelKey = getLevelKey(level);
    const levelData = mastery[levelKey];
    return levelData.perfectCompletions >= levelData.requiredPerfectCompletions;
  };

  return {
    mastery,
    loading,
    currentLevel,
    recordAttempt,
    getLevelProgress,
    canAccessLevel,
    isLevelMastered,
    refreshMastery: loadMastery
  };
}
