/**
 * Adaptive Difficulty Hook - Refactored
 * Automatically adjusts difficulty based on performance
 */
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { DifficultyLevel, PerformanceMetrics, DifficultySettings, DifficultyAdjustment, AdaptiveRecommendation } from '../types/adaptiveDifficulty';
import {
  getDefaultMetrics, createSettingsForLevel, processQuizDocs, processLabDocs, processDrillDocs, processProgressDocs,
  calculateStudyStreak, buildMetricsFromData, evaluateRecommendationLogic
} from './adaptive-difficulty/adaptiveDifficultyUtils';

export function useAdaptiveDifficulty() {
  const { user } = useAuthStore();
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>('recruit');
  const [settings, setSettings] = useState<DifficultySettings | null>(null);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [recentAdjustments, setRecentAdjustments] = useState<DifficultyAdjustment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDifficultySettings = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const settingsDoc = await getDoc(doc(db, 'difficultySettings', user.uid));
      if (settingsDoc.exists()) { setCurrentLevel(settingsDoc.data().currentLevel); setSettings(settingsDoc.data() as DifficultySettings); }
      else { const init = createSettingsForLevel('recruit'); await setDoc(doc(db, 'difficultySettings', user.uid), init); setSettings(init); }
    } catch { setSettings(createSettingsForLevel('recruit')); }
    finally { setLoading(false); }
  }, [user?.uid]);

  const loadRecentAdjustments = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const snap = await getDocs(query(collection(db, 'difficultyAdjustments'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(10)));
      setRecentAdjustments(snap.docs.map(d => ({ id: d.id, ...d.data(), timestamp: d.data().timestamp.toDate() } as DifficultyAdjustment)));
    } catch { /* ignore */ }
  }, [user?.uid]);

  useEffect(() => { if (user?.uid) { loadDifficultySettings(); loadRecentAdjustments(); } }, [user?.uid, loadDifficultySettings, loadRecentAdjustments]);

  const calculatePerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    if (!user?.uid) return getDefaultMetrics();
    try {
      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const [quizSnap, labSnap, drillSnap, progressSnap, failureSnap, tokenSnap, sessionSnap] = await Promise.all([
        getDocs(query(collection(db, 'quizAttempts'), where('userId', '==', user.uid), where('completedAt', '>=', thirtyDaysAgo))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid), where('type', '==', 'lab'))),
        getDocs(query(collection(db, 'battleDrillPerformance'), where('userId', '==', user.uid), where('completedAt', '>=', thirtyDaysAgo))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid), where('occurredAt', '>=', thirtyDaysAgo))),
        getDocs(query(collection(db, 'resetTokens'), where('userId', '==', user.uid), where('usedAt', '>=', thirtyDaysAgo))),
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid), orderBy('startTime', 'desc'), limit(365)))
      ]);
      let aarCompleted = 0; failureSnap.forEach(d => { if (d.data().aarCompleted) aarCompleted++; });
      const sessionDates = new Set<string>(); sessionSnap.forEach(d => { const dt = d.data().startTime.toDate(); dt.setHours(0,0,0,0); sessionDates.add(dt.toISOString().split('T')[0]); });
      return buildMetricsFromData({
        quiz: processQuizDocs(quizSnap.docs),
        lab: processLabDocs(labSnap.docs),
        drill: processDrillDocs(drillSnap.docs),
        ef: processProgressDocs(progressSnap.docs),
        aarCompleted,
        failureCount: failureSnap.size,
        tokenCount: tokenSnap.size,
        studyStreak: calculateStudyStreak(sessionDates),
        sessionCount: sessionSnap.size
      });
    } catch { return getDefaultMetrics(); }
  }, [user?.uid]);

  const evaluateRecommendation = useCallback(async (): Promise<AdaptiveRecommendation> => {
    const metrics = await calculatePerformanceMetrics();
    const result = evaluateRecommendationLogic(currentLevel, metrics);
    return { ...result, metricsSnapshot: metrics };
  }, [currentLevel, calculatePerformanceMetrics]);

  const adjustDifficulty = async (newLevel: DifficultyLevel, autoAdjusted: boolean, reason: string): Promise<void> => {
    if (!user?.uid) return;
    const metrics = await calculatePerformanceMetrics();
    const newSettings = createSettingsForLevel(newLevel);
    await updateDoc(doc(db, 'difficultySettings', user.uid), newSettings);
    await addDoc(collection(db, 'difficultyAdjustments'), { userId: user.uid, timestamp: new Date(), previousLevel: currentLevel, newLevel, reason, metrics, autoAdjusted });
    setCurrentLevel(newLevel); setSettings(newSettings); await loadRecentAdjustments();
  };

  const checkAndAutoAdjust = async (): Promise<boolean> => {
    const rec = await evaluateRecommendation(); setRecommendation(rec);
    if (rec.type !== 'maintain' && rec.confidence > 0.7) { await adjustDifficulty(rec.suggestedLevel, true, `Auto: ${rec.reasoning.join('. ')}`); return true; }
    return false;
  };

  return { currentLevel, settings, recommendation, recentAdjustments, loading, adjustDifficulty, evaluateRecommendation, checkAndAutoAdjust, calculatePerformanceMetrics };
}
