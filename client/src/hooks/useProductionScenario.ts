/**
 * Production Scenario Hook - Refactored
 * Manages real-world troubleshooting scenarios
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { ProductionScenario, ScenarioAttempt, ScenarioPerformance } from '../types/scenarios';
import {
  calculateEfficiency, calculateAccuracy, calculateTotalScore,
  createInitialAttempt, calculateUpdatedPerformance
} from './production-scenario/productionScenarioUtils';

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
      const snapshot = await getDocs(query(collection(db, 'scenarioPerformance'), where('userId', '==', user.uid)));
      const perfMap = new Map<string, ScenarioPerformance>();
      snapshot.forEach(doc => { const data = doc.data() as ScenarioPerformance; perfMap.set(data.scenarioId, data); });
      setPerformance(perfMap);
    } catch (err) { console.error('Error loading performance:', err); }
  }, [user]);

  useEffect(() => { if (user) loadPerformance(); }, [user, loadPerformance]);

  const startScenario = async (scenario: ProductionScenario) => {
    if (!user) { setError('Must be logged in'); return; }
    setLoading(true); setError(null);
    try { setCurrentAttempt(createInitialAttempt(user.uid, scenario.id)); }
    catch (err) { console.error('Error starting scenario:', err); setError('Failed to start scenario'); }
    finally { setLoading(false); }
  };

  const completeInvestigationStep = (stepId: string) => {
    setCurrentAttempt(prev => prev ? { ...prev, stepsCompleted: [...prev.stepsCompleted, stepId], investigationTime: Math.floor((Date.now() - prev.startedAt.getTime()) / 1000) } : null);
  };

  const incrementHintsUsed = () => {
    setCurrentAttempt(prev => prev ? { ...prev, hintsUsed: prev.hintsUsed + 1 } : null);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const identifyRootCause = (_causeId: string): boolean => {
    if (!currentAttempt) return false;
    const timeToIdentify = Math.floor((Date.now() - currentAttempt.startedAt.getTime()) / 1000);
    setCurrentAttempt(prev => prev ? { ...prev, rootCauseAttempts: prev.rootCauseAttempts + 1, rootCauseIdentified: true, timeToIdentify } : null);
    return true;
  };

  const completeResolutionStep = (stepId: string) => {
    setCurrentAttempt(prev => prev ? { ...prev, resolutionStepsCompleted: [...prev.resolutionStepsCompleted, stepId], resolutionTime: Math.floor((Date.now() - prev.startedAt.getTime()) / 1000) } : null);
  };

  const updatePerformance = async (attempt: ScenarioAttempt) => {
    if (!user) return;
    try {
      const snapshot = await getDocs(query(collection(db, 'scenarioPerformance'), where('userId', '==', user.uid), where('scenarioId', '==', attempt.scenarioId)));
      const existingPerf = snapshot.empty ? null : snapshot.docs[0].data() as ScenarioPerformance;
      const updatedPerf = calculateUpdatedPerformance(user.uid, attempt.scenarioId, attempt, existingPerf);
      await addDoc(collection(db, 'scenarioPerformance'), updatedPerf);
      setPerformance(prev => new Map(prev).set(attempt.scenarioId, updatedPerf));
    } catch (err) { console.error('Error updating performance:', err); }
  };

  const completeScenario = async (success: boolean, lessonsLearned: string[]) => {
    if (!user || !currentAttempt) return;
    setLoading(true);
    try {
      const completedAt = new Date();
      const totalTime = Math.floor((completedAt.getTime() - currentAttempt.startedAt.getTime()) / 1000);
      const efficiency = calculateEfficiency(currentAttempt, totalTime);
      const accuracyScore = calculateAccuracy(currentAttempt);
      const score = calculateTotalScore(currentAttempt, efficiency, accuracyScore);
      const completedAttempt: ScenarioAttempt = { ...currentAttempt, completedAt, success, score, efficiency, accuracyScore, lessonsLearned };
      await addDoc(collection(db, 'scenarioAttempts'), completedAttempt);
      await updatePerformance(completedAttempt);
      setCurrentAttempt(null);
    } catch (err) { console.error('Error completing scenario:', err); setError('Failed to save results'); }
    finally { setLoading(false); }
  };

  const getPerformance = (scenarioId: string) => performance.get(scenarioId);

  return { currentAttempt, performance, loading, error, startScenario, completeInvestigationStep, incrementHintsUsed, identifyRootCause, completeResolutionStep, completeScenario, getPerformance };
}
