/**
 * Production Scenario Hook
 * Manages real-world troubleshooting scenarios
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { ProductionScenario, ScenarioAttempt, ScenarioPerformance } from '../types/scenarios';

interface UseProductionScenarioReturn {
  currentAttempt: ScenarioAttempt | null;
  performance: Map<string, ScenarioPerformance>;
  loading: boolean;
  error: string | null;
  startScenario: (scenario: ProductionScenario) => Promise<void>;
  completeInvestigationStep: (stepId: string) => void;
  incrementHintsUsed: () => void;
  identifyRootCause: (causeId: string) => boolean;
  completeResolutionStep: (stepId: string) => void;
  completeScenario: (success: boolean, lessonsLearned: string[]) => Promise<void>;
  getPerformance: (scenarioId: string) => ScenarioPerformance | undefined;
}

export function useProductionScenario(): UseProductionScenarioReturn {
  const { user } = useAuthStore();
  const [currentAttempt, setCurrentAttempt] = useState<ScenarioAttempt | null>(null);
  const [performance, setPerformance] = useState<Map<string, ScenarioPerformance>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPerformance = useCallback(async () => {
    if (!user) return;

    try {
      const perfQuery = query(
        collection(db, 'scenarioPerformance'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(perfQuery);

      const perfMap = new Map<string, ScenarioPerformance>();
      snapshot.forEach(doc => {
        const data = doc.data() as ScenarioPerformance;
        perfMap.set(data.scenarioId, data);
      });

      setPerformance(perfMap);
    } catch (err) {
      console.error('Error loading performance:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadPerformance();
    }
  }, [user, loadPerformance]);

  const startScenario = async (scenario: ProductionScenario) => {
    if (!user) {
      setError('Must be logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const attempt: ScenarioAttempt = {
        id: '',
        userId: user.uid,
        scenarioId: scenario.id,
        startedAt: new Date(),
        stepsCompleted: [],
        hintsUsed: 0,
        investigationTime: 0,
        rootCauseIdentified: false,
        rootCauseAttempts: 0,
        resolutionStepsCompleted: [],
        resolutionTime: 0,
        rollbacksRequired: 0,
        success: false,
        score: 0,
        efficiency: 0,
        accuracyScore: 0,
        lessonsLearned: [],
        mistakesMade: []
      };

      setCurrentAttempt(attempt);
    } catch (err) {
      console.error('Error starting scenario:', err);
      setError('Failed to start scenario');
    } finally {
      setLoading(false);
    }
  };

  const completeInvestigationStep = (stepId: string) => {
    setCurrentAttempt(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        stepsCompleted: [...prev.stepsCompleted, stepId],
        investigationTime: Math.floor((new Date().getTime() - prev.startedAt.getTime()) / 1000)
      };
    });
  };

  const incrementHintsUsed = () => {
    setCurrentAttempt(prev => {
      if (!prev) return null;
      return { ...prev, hintsUsed: prev.hintsUsed + 1 };
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const identifyRootCause = (_causeId: string): boolean => {
    if (!currentAttempt) return false;

    const now = new Date();
    const timeToIdentify = Math.floor((now.getTime() - currentAttempt.startedAt.getTime()) / 1000);

    setCurrentAttempt(prev => {
      if (!prev) return null;

      return {
        ...prev,
        rootCauseAttempts: prev.rootCauseAttempts + 1,
        rootCauseIdentified: true,
        timeToIdentify
      };
    });

    return true;
  };

  const completeResolutionStep = (stepId: string) => {
    setCurrentAttempt(prev => {
      if (!prev) return null;

      return {
        ...prev,
        resolutionStepsCompleted: [...prev.resolutionStepsCompleted, stepId],
        resolutionTime: Math.floor((new Date().getTime() - prev.startedAt.getTime()) / 1000)
      };
    });
  };

  const completeScenario = async (success: boolean, lessonsLearned: string[]) => {
    if (!user || !currentAttempt) return;

    setLoading(true);

    try {
      const completedAt = new Date();
      const totalTime = Math.floor((completedAt.getTime() - currentAttempt.startedAt.getTime()) / 1000);

      // Calculate scores
      const efficiency = calculateEfficiency(currentAttempt, totalTime);
      const accuracyScore = calculateAccuracy(currentAttempt);
      const score = calculateTotalScore(currentAttempt, efficiency, accuracyScore);

      const completedAttempt: ScenarioAttempt = {
        ...currentAttempt,
        completedAt,
        success,
        score,
        efficiency,
        accuracyScore,
        lessonsLearned
      };

      // Save to Firestore
      await addDoc(collection(db, 'scenarioAttempts'), completedAttempt);

      // Update performance
      await updatePerformance(completedAttempt);

      setCurrentAttempt(null);
    } catch (err) {
      console.error('Error completing scenario:', err);
      setError('Failed to save results');
    } finally {
      setLoading(false);
    }
  };

  const calculateEfficiency = (attempt: ScenarioAttempt, totalTime: number): number => {
    // Base efficiency on time and hints used
    const timeEfficiency = Math.max(0, 100 - (totalTime / 60)); // Lose 1 point per minute
    const hintPenalty = attempt.hintsUsed * 10; // -10 points per hint
    const rollbackPenalty = attempt.rollbacksRequired * 5; // -5 points per rollback

    return Math.max(0, Math.min(100, timeEfficiency - hintPenalty - rollbackPenalty));
  };

  const calculateAccuracy = (attempt: ScenarioAttempt): number => {
    // Base accuracy on root cause identification attempts
    const baseAccuracy = attempt.rootCauseIdentified ? 100 : 0;
    const attemptPenalty = (attempt.rootCauseAttempts - 1) * 20; // -20 per wrong attempt

    return Math.max(0, baseAccuracy - attemptPenalty);
  };

  const calculateTotalScore = (
    attempt: ScenarioAttempt,
    efficiency: number,
    accuracyScore: number
  ): number => {
    // Weighted score: 40% accuracy, 30% efficiency, 30% completion
    const completionRate = (attempt.stepsCompleted.length + attempt.resolutionStepsCompleted.length) / 10;
    const completionScore = completionRate * 100;

    return Math.round(
      accuracyScore * 0.4 +
      efficiency * 0.3 +
      completionScore * 0.3
    );
  };

  const updatePerformance = async (attempt: ScenarioAttempt) => {
    if (!user) return;

    try {
      const perfQuery = query(
        collection(db, 'scenarioPerformance'),
        where('userId', '==', user.uid),
        where('scenarioId', '==', attempt.scenarioId)
      );
      const snapshot = await getDocs(perfQuery);

      let existingPerf: ScenarioPerformance | null = null;
      if (!snapshot.empty) {
        existingPerf = snapshot.docs[0].data() as ScenarioPerformance;
      }

      const newAttempts = (existingPerf?.attempts || 0) + 1;
      const newSuccessful = (existingPerf?.successfulAttempts || 0) + (attempt.success ? 1 : 0);
      const totalTime = (existingPerf?.averageTimeToResolve || 0) * (existingPerf?.attempts || 0);
      const attemptTime = attempt.investigationTime + attempt.resolutionTime;
      const newAvgTime = (totalTime + attemptTime) / newAttempts;

      const updatedPerf: ScenarioPerformance = {
        userId: user.uid,
        scenarioId: attempt.scenarioId,
        attempts: newAttempts,
        successfulAttempts: newSuccessful,
        averageTimeToResolve: newAvgTime,
        bestScore: Math.max(existingPerf?.bestScore || 0, attempt.score),
        investigationSkillGrowth: calculateSkillGrowth(existingPerf?.investigationSkillGrowth || 0, attempt.accuracyScore),
        resolutionSkillGrowth: calculateSkillGrowth(existingPerf?.resolutionSkillGrowth || 0, attempt.efficiency),
        troubleshootingSpeed: calculatePercentile(newAvgTime),
        lastAttemptedAt: new Date(),
        masteryLevel: calculateMasteryLevel(newAttempts, newSuccessful, attempt.score)
      };

      await addDoc(collection(db, 'scenarioPerformance'), updatedPerf);

      // Update local state
      setPerformance(prev => new Map(prev).set(attempt.scenarioId, updatedPerf));
    } catch (err) {
      console.error('Error updating performance:', err);
    }
  };

  const calculateSkillGrowth = (current: number, newScore: number): number => {
    // Gradual skill growth based on performance
    return Math.min(100, current + (newScore - current) * 0.2);
  };

  const calculatePercentile = (avgTime: number): number => {
    // Simplified percentile calculation
    // In production, this would compare against all users
    if (avgTime < 300) return 95;
    if (avgTime < 600) return 75;
    if (avgTime < 900) return 50;
    if (avgTime < 1200) return 25;
    return 10;
  };

  const calculateMasteryLevel = (
    attempts: number,
    successful: number,
    bestScore: number
  ): 'novice' | 'competent' | 'proficient' | 'expert' => {
    if (attempts < 2) return 'novice';
    
    const successRate = successful / attempts;
    
    if (successRate >= 0.9 && bestScore >= 90) return 'expert';
    if (successRate >= 0.7 && bestScore >= 75) return 'proficient';
    if (successRate >= 0.5 && bestScore >= 60) return 'competent';
    
    return 'novice';
  };

  const getPerformance = (scenarioId: string): ScenarioPerformance | undefined => {
    return performance.get(scenarioId);
  };

  return {
    currentAttempt,
    performance,
    loading,
    error,
    startScenario,
    completeInvestigationStep,
    incrementHintsUsed,
    identifyRootCause,
    completeResolutionStep,
    completeScenario,
    getPerformance
  };
}
