/**
 * Hook for managing battle drill attempts and performance
 */

import { useState, useEffect } from 'react';
import { doc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { BattleDrill, BattleDrillPerformance } from '../types/training';
import { initializeBattleDrillPerformance } from '../lib/firestoreSchema';

export function useBattleDrill(drillId?: string) {
  const { user } = useAuthStore();
  const [performance, setPerformance] = useState<BattleDrillPerformance | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentAttempt, setCurrentAttempt] = useState<{
    id: string;
    startTime: number;
    hintsUsed: number;
    currentStep: number;
  } | null>(null);

  useEffect(() => {
    if (!user?.uid || !drillId) {
      setLoading(false);
      return;
    }

    loadPerformance();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, drillId]);

  const loadPerformance = async () => {
    if (!user?.uid || !drillId) return;

    try {
      setLoading(true);
      const performanceData = await initializeBattleDrillPerformance(user.uid, drillId);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error loading drill performance:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAttempt = async (drill: BattleDrill) => {
    if (!user?.uid) return null;

    try {
      // Create attempt record
      const attemptRef = await addDoc(collection(db, 'battleDrillAttempts'), {
        drillId: drill.id,
        userId: user.uid,
        startedAt: serverTimestamp(),
        passed: false,
        hintsUsed: 0,
        resetsUsed: 0,
        stepsCompleted: 0,
        totalSteps: drill.steps.length
      });

      const attemptId = attemptRef.id;
      setCurrentAttempt({
        id: attemptId,
        startTime: Date.now(),
        hintsUsed: 0,
        currentStep: 0
      });

      return attemptId;
    } catch (error) {
      console.error('Error starting drill attempt:', error);
      return null;
    }
  };

  const completeAttempt = async (
    drill: BattleDrill,
    passed: boolean,
    stepsCompleted: number,
    hintsUsed: number = 0,
    resetsUsed: number = 0
  ) => {
    if (!user?.uid || !currentAttempt) return;

    try {
      const durationSeconds = Math.floor((Date.now() - currentAttempt.startTime) / 1000);

      // Update attempt record
      const attemptRef = doc(db, 'battleDrillAttempts', currentAttempt.id);
      await updateDoc(attemptRef, {
        completedAt: serverTimestamp(),
        durationSeconds,
        passed,
        hintsUsed,
        resetsUsed,
        stepsCompleted
      });

      // Update performance stats
      if (performance) {
        const newAttempts = performance.attempts + 1;
        const newBestTime = passed && durationSeconds < performance.bestTime 
          ? durationSeconds 
          : performance.bestTime;
        
        // Calculate new average (only for passed attempts)
        let newAverageTime = performance.averageTime;
        if (passed) {
          const totalTime = performance.averageTime * (performance.attempts || 0) + durationSeconds;
          newAverageTime = totalTime / newAttempts;
        }

        const successCount = passed ? (performance.successRate * performance.attempts) + 1 : (performance.successRate * performance.attempts);
        const newSuccessRate = successCount / newAttempts;

        // Determine mastery level based on success rate and best time
        let masteryLevel: BattleDrillPerformance['masteryLevel'] = 'novice';
        if (newSuccessRate >= 0.9 && newBestTime <= drill.targetTimeSeconds) {
          masteryLevel = 'expert';
        } else if (newSuccessRate >= 0.75 && newBestTime <= drill.targetTimeSeconds * 1.25) {
          masteryLevel = 'proficient';
        } else if (newSuccessRate >= 0.5) {
          masteryLevel = 'competent';
        }

        const performanceRef = doc(db, 'battleDrillPerformance', `${user.uid}_${drill.id}`);
        const updatedPerformance: BattleDrillPerformance = {
          ...performance,
          attempts: newAttempts,
          bestTime: newBestTime,
          averageTime: newAverageTime,
          successRate: newSuccessRate,
          masteryLevel,
          lastAttemptDate: new Date()
        };

        await setDoc(performanceRef, updatedPerformance);
        setPerformance(updatedPerformance);
      }

      setCurrentAttempt(null);

      return {
        durationSeconds,
        passed,
        beatTarget: durationSeconds <= drill.targetTimeSeconds,
        personalBest: performance && durationSeconds < performance.bestTime
      };
    } catch (error) {
      console.error('Error completing drill attempt:', error);
      return null;
    }
  };

  const recordHintUsed = () => {
    if (currentAttempt) {
      setCurrentAttempt({
        ...currentAttempt,
        hintsUsed: currentAttempt.hintsUsed + 1
      });
    }
  };

  const recordStepCompleted = () => {
    if (currentAttempt) {
      setCurrentAttempt({
        ...currentAttempt,
        currentStep: currentAttempt.currentStep + 1
      });
    }
  };

  return {
    performance,
    loading,
    currentAttempt,
    startAttempt,
    completeAttempt,
    recordHintUsed,
    recordStepCompleted,
    refreshPerformance: loadPerformance
  };
}
