/**
 * Stress Training Hook
 * Manages stress training sessions with physiological simulation
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { StressScenario, StressTrainingSession, StressMetrics } from '../types/training';
import {
  calculateStressScore,
  calculateFatigueLevel,
  calculateFocusLevel,
  calculatePerformanceRating,
  calculateAdaptabilityScore
} from '../data/stressScenarios';

interface UseStressTrainingReturn {
  currentSession: StressTrainingSession | null;
  stressMetrics: StressMetrics | null;
  loading: boolean;
  error: string | null;
  startSession: (scenario: StressScenario) => Promise<void>;
  updateSessionMetrics: (tasksCompleted: number, errorsCount: number) => void;
  completeSession: (success: boolean) => Promise<void>;
  canAttemptStressLevel: (level: string) => boolean;
}

export function useStressTraining(): UseStressTrainingReturn {
  const { user } = useAuthStore();
  const [currentSession, setCurrentSession] = useState<StressTrainingSession | null>(null);
  const [stressMetrics, setStressMetrics] = useState<StressMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // Load user's stress metrics
  useEffect(() => {
    if (!user) return;

    const loadStressMetrics = async () => {
      try {
        const metricsQuery = query(
          collection(db, 'stressMetrics'),
          where('userId', '==', user.uid),
          limit(1)
        );
        const snapshot = await getDocs(metricsQuery);

        if (!snapshot.empty) {
          setStressMetrics(snapshot.docs[0].data() as StressMetrics);
        } else {
          // Initialize metrics
          const initialMetrics: StressMetrics = {
            userId: user.uid,
            totalSessions: 0,
            sessionsByStressLevel: {
              none: 0,
              low: 0,
              medium: 0,
              high: 0,
              extreme: 0
            },
            averageStressScore: 0,
            averageAdaptabilityScore: 0,
            stressToleranceLevel: 'low',
            performanceDegradation: {
              normalAccuracy: 0,
              stressedAccuracy: 0,
              degradationRate: 0
            },
            lastUpdated: new Date()
          };
          setStressMetrics(initialMetrics);
        }
      } catch (err) {
        console.error('Error loading stress metrics:', err);
        setError('Failed to load stress metrics');
      }
    };

    loadStressMetrics();
  }, [user]);

  // Update physiological metrics every second during active session
  useEffect(() => {
    if (!currentSession || currentSession.completedAt) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      return;
    }

    const id = window.setInterval(() => {
      updatePhysiologicalMetrics();
    }, 1000);

    setIntervalId(id);

    return () => clearInterval(id);
  }, [currentSession, updatePhysiologicalMetrics]);

  const updatePhysiologicalMetrics = useCallback(() => {
    if (!currentSession) return;

    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - currentSession.startedAt.getTime()) / 1000);

    const stressScore = calculateStressScore(
      currentSession.scenario.conditions,
      elapsedSeconds,
      currentSession.errorsCount,
      currentSession.totalTasks - currentSession.tasksCompleted
    );

    const fatigueLevel = calculateFatigueLevel(elapsedSeconds, stressScore);
    const focusLevel = calculateFocusLevel(fatigueLevel, stressScore);

    setCurrentSession(prev => prev ? {
      ...prev,
      stressScore,
      fatigueLevel,
      focusLevel
    } : null);
  }, [currentSession]);

  const startSession = async (scenario: StressScenario) => {
    if (!user) {
      setError('Must be logged in to start stress training');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const session: StressTrainingSession = {
        id: '', // Will be set by Firestore
        userId: user.uid,
        scenario,
        startedAt: new Date(),
        completedAt: undefined,
        tasksCompleted: 0,
        totalTasks: scenario.successCriteria.length,
        errorsCount: 0,
        timeToCompletion: 0,
        stressScore: 0,
        fatigueLevel: 0,
        focusLevel: 100,
        performanceRating: undefined,
        adaptabilityScore: 0,
        succeeded: false
      };

      setCurrentSession(session);
    } catch (err) {
      console.error('Error starting stress session:', err);
      setError('Failed to start stress session');
    } finally {
      setLoading(false);
    }
  };

  const updateSessionMetrics = (tasksCompleted: number, errorsCount: number) => {
    setCurrentSession(prev => prev ? {
      ...prev,
      tasksCompleted,
      errorsCount
    } : null);
  };

  const completeSession = async (success: boolean) => {
    if (!user || !currentSession) {
      setError('No active session to complete');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completedAt = new Date();
      const timeToCompletion = Math.floor((completedAt.getTime() - currentSession.startedAt.getTime()) / 1000);

      const performanceRating = calculatePerformanceRating(
        currentSession.tasksCompleted,
        currentSession.totalTasks,
        timeToCompletion,
        currentSession.scenario.duration,
        currentSession.errorsCount
      );

      const adaptabilityScore = calculateAdaptabilityScore(
        performanceRating,
        currentSession.scenario.stressLevel,
        currentSession.errorsCount,
        currentSession.focusLevel
      );

      const completedSession: StressTrainingSession = {
        ...currentSession,
        completedAt,
        timeToCompletion,
        performanceRating,
        adaptabilityScore,
        succeeded: success
      };

      // Save to Firestore
      await addDoc(collection(db, 'stressTrainingSessions'), completedSession);

      // Update metrics
      await updateStressMetrics(completedSession);

      setCurrentSession(completedSession);
    } catch (err) {
      console.error('Error completing stress session:', err);
      setError('Failed to complete stress session');
    } finally {
      setLoading(false);
    }
  };

  const updateStressMetrics = async (session: StressTrainingSession) => {
    if (!user || !stressMetrics) return;

    try {
      const updatedMetrics: StressMetrics = {
        ...stressMetrics,
        totalSessions: stressMetrics.totalSessions + 1,
        sessionsByStressLevel: {
          ...stressMetrics.sessionsByStressLevel,
          [session.scenario.stressLevel]: (stressMetrics.sessionsByStressLevel[session.scenario.stressLevel] || 0) + 1
        },
        averageStressScore: calculateRunningAverage(
          stressMetrics.averageStressScore,
          session.stressScore,
          stressMetrics.totalSessions
        ),
        averageAdaptabilityScore: calculateRunningAverage(
          stressMetrics.averageAdaptabilityScore,
          session.adaptabilityScore,
          stressMetrics.totalSessions
        ),
        stressToleranceLevel: calculateStressTolerance(stressMetrics, session),
        lastUpdated: new Date()
      };

      // Update performance degradation
      await updatePerformanceDegradation(updatedMetrics, session);

      // Save to Firestore
      const metricsQuery = query(
        collection(db, 'stressMetrics'),
        where('userId', '==', user.uid),
        limit(1)
      );
      const snapshot = await getDocs(metricsQuery);

      if (!snapshot.empty) {
        await addDoc(collection(db, 'stressMetrics'), updatedMetrics);
      } else {
        await addDoc(collection(db, 'stressMetrics'), updatedMetrics);
      }

      setStressMetrics(updatedMetrics);
    } catch (err) {
      console.error('Error updating stress metrics:', err);
    }
  };

  const calculateRunningAverage = (currentAvg: number, newValue: number, count: number): number => {
    return ((currentAvg * count) + newValue) / (count + 1);
  };

  const calculateStressTolerance = (metrics: StressMetrics, latestSession: StressTrainingSession): string => {
    const { sessionsByStressLevel } = metrics;

    // Unlock progression based on successful sessions at each level
    if (sessionsByStressLevel.extreme >= 3 && String(latestSession.scenario.stressLevel) === 'extreme' && latestSession.succeeded) {
      return 'extreme';
    }
    if (sessionsByStressLevel.high >= 3 && String(latestSession.scenario.stressLevel) === 'high' && latestSession.succeeded) {
      return 'high';
    }
    if (sessionsByStressLevel.medium >= 3 && String(latestSession.scenario.stressLevel) === 'medium' && latestSession.succeeded) {
      return 'medium';
    }
    if (sessionsByStressLevel.low >= 3) {
      return 'low';
    }

    return 'low';
  };

  const updatePerformanceDegradation = async (metrics: StressMetrics, session: StressTrainingSession) => {
    // Calculate accuracy based on tasks completed vs errors
    const sessionAccuracy = session.totalTasks > 0
      ? ((session.tasksCompleted - session.errorsCount) / session.totalTasks) * 100
      : 0;

    // Get baseline accuracy from normal (non-stress) sessions
    const normalSessionsQuery = query(
      collection(db, 'battleDrillAttempts'),
      where('userId', '==', user!.uid),
      orderBy('attemptedAt', 'desc'),
      limit(10)
    );

    const normalSnapshot = await getDocs(normalSessionsQuery);
    let normalAccuracy = 0;

    if (!normalSnapshot.empty) {
      const accuracies = normalSnapshot.docs.map(doc => {
        const data = doc.data();
        return data.accuracy || 0;
      });
      normalAccuracy = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length;
    }

    // Update metrics
    metrics.performanceDegradation = {
      normalAccuracy,
      stressedAccuracy: calculateRunningAverage(
        metrics.performanceDegradation.stressedAccuracy,
        sessionAccuracy,
        metrics.totalSessions
      ),
      degradationRate: normalAccuracy > 0
        ? ((normalAccuracy - sessionAccuracy) / normalAccuracy) * 100
        : 0
    };
  };

  const canAttemptStressLevel = (level: string): boolean => {
    if (!stressMetrics) return level === 'low';

    const tolerance = stressMetrics.stressToleranceLevel;
    const levelOrder = ['none', 'low', 'medium', 'high', 'extreme'];
    const toleranceIndex = levelOrder.indexOf(tolerance);
    const requestedIndex = levelOrder.indexOf(level);

    return requestedIndex <= toleranceIndex;
  };

  return {
    currentSession,
    stressMetrics,
    loading,
    error,
    startSession,
    updateSessionMetrics,
    completeSession,
    canAttemptStressLevel
  };
}
