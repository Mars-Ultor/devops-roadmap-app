/**
 * Adaptive Difficulty Hook
 * Automatically adjusts difficulty based on performance
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { 
  DifficultyLevel, 
  PerformanceMetrics, 
  DifficultySettings,
  DifficultyAdjustment,
  AdaptiveRecommendation
} from '../types/adaptiveDifficulty';
import { DIFFICULTY_THRESHOLDS, PROMOTION_CRITERIA, DEMOTION_CRITERIA } from '../types/adaptiveDifficulty';

export function useAdaptiveDifficulty() {
  const { user } = useAuthStore();
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>('recruit');
  const [settings, setSettings] = useState<DifficultySettings | null>(null);
  const [recommendation, setRecommendation] = useState<AdaptiveRecommendation | null>(null);
  const [recentAdjustments, setRecentAdjustments] = useState<DifficultyAdjustment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadDifficultySettings();
      loadRecentAdjustments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const loadDifficultySettings = async () => {
    if (!user?.uid) return;

    try {
      const settingsDoc = await getDoc(doc(db, 'difficultySettings', user.uid));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setCurrentLevel(data.currentLevel);
        setSettings(data as DifficultySettings);
      } else {
        // Initialize with recruit settings
        const initialSettings = createSettingsForLevel('recruit');
        await setDoc(doc(db, 'difficultySettings', user.uid), initialSettings);
        setSettings(initialSettings);
        setCurrentLevel('recruit');
      }
    } catch (error) {
      console.error('Error loading difficulty settings:', error);
      // Fallback to recruit
      const fallbackSettings = createSettingsForLevel('recruit');
      setSettings(fallbackSettings);
      setCurrentLevel('recruit');
    } finally {
      setLoading(false);
    }
  };

  const loadRecentAdjustments = async () => {
    if (!user?.uid) return;

    try {
      const adjustmentsQuery = query(
        collection(db, 'difficultyAdjustments'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(adjustmentsQuery);
      const adjustments: DifficultyAdjustment[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        adjustments.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp.toDate()
        } as DifficultyAdjustment);
      });

      setRecentAdjustments(adjustments);
    } catch (error) {
      console.error('Error loading adjustments:', error);
    }
  };

  const createSettingsForLevel = (level: DifficultyLevel): DifficultySettings => {
    const threshold = DIFFICULTY_THRESHOLDS[level];
    
    return {
      currentLevel: level,
      quizTimeMultiplier: threshold.quizTimeMultiplier,
      quizHintAvailability: level === 'recruit' || level === 'soldier',
      quizPassingScore: threshold.quizPassingScore,
      labGuidanceLevel: threshold.labGuidanceLevel,
      labTimeLimit: level === 'elite' ? 3600 : null,
      labValidationStrictness: level === 'recruit' ? 'lenient' : level === 'elite' ? 'strict' : 'normal',
      drillTimeTarget: threshold.drillTimeTarget,
      drillComplexity: level === 'recruit' ? 'basic' : level === 'soldier' ? 'intermediate' : level === 'specialist' ? 'advanced' : 'expert',
      simultaneousFailures: level === 'recruit' ? 1 : level === 'soldier' ? 1 : level === 'specialist' ? 2 : 3,
      reviewIntervalMultiplier: level === 'recruit' ? 0.8 : level === 'elite' ? 1.2 : 1.0,
      newItemsPerDay: level === 'recruit' ? 5 : level === 'soldier' ? 8 : level === 'specialist' ? 12 : 15,
      stressIntensity: threshold.stressIntensity,
      multiTaskingRequired: level === 'specialist' || level === 'elite'
    };
  };

  const calculatePerformanceMetrics = useCallback(async (): Promise<PerformanceMetrics> => {
    if (!user?.uid) {
      return getDefaultMetrics();
    }

    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Quiz performance
      const quizQuery = query(
        collection(db, 'quizAttempts'),
        where('userId', '==', user.uid),
        where('completedAt', '>=', thirtyDaysAgo)
      );
      const quizSnap = await getDocs(quizQuery);
      
      let quizPasses = 0;
      let quizTotal = 0;
      let quizScoreSum = 0;
      let quizStreak = 0;
      let currentStreak = 0;

      quizSnap.forEach(doc => {
        const data = doc.data();
        quizTotal++;
        quizScoreSum += data.score || 0;
        if (data.passed) {
          quizPasses++;
          currentStreak++;
          quizStreak = Math.max(quizStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });

      // Lab performance
      const labQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('type', '==', 'lab')
      );
      const labSnap = await getDocs(labQuery);

      let labCompleted = 0;
      let labTotal = 0;
      let labScoreSum = 0;
      let labTimeSum = 0;

      labSnap.forEach(doc => {
        const data = doc.data();
        labTotal++;
        if (data.completed) labCompleted++;
        labScoreSum += data.score || 0;
        labTimeSum += data.timeSpent || 0;
      });

      // Battle drill performance
      const drillQuery = query(
        collection(db, 'battleDrillPerformance'),
        where('userId', '==', user.uid),
        where('completedAt', '>=', thirtyDaysAgo)
      );
      const drillSnap = await getDocs(drillQuery);

      let drillSuccess = 0;
      let drillTotal = 0;
      let drillTimeSum = 0;

      drillSnap.forEach(doc => {
        const data = doc.data();
        drillTotal++;
        if (data.success) drillSuccess++;
        drillTimeSum += data.completionTime || 0;
      });

      // Spaced repetition
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid)
      );
      const progressSnap = await getDocs(progressQuery);

      let efSum = 0;
      let efCount = 0;
      let weakTopics = 0;

      progressSnap.forEach(doc => {
        const data = doc.data();
        if (data.easinessFactor !== undefined) {
          efSum += data.easinessFactor;
          efCount++;
          if (data.easinessFactor < 2.0) weakTopics++;
        }
      });

      // Failure metrics
      const failureQuery = query(
        collection(db, 'failureLogs'),
        where('userId', '==', user.uid),
        where('occurredAt', '>=', thirtyDaysAgo)
      );
      const failureSnap = await getDocs(failureQuery);

      let aarCompleted = 0;
      failureSnap.forEach(doc => {
        if (doc.data().aarCompleted) aarCompleted++;
      });

      // Reset token usage
      const tokenQuery = query(
        collection(db, 'resetTokens'),
        where('userId', '==', user.uid),
        where('usedAt', '>=', thirtyDaysAgo)
      );
      const tokenSnap = await getDocs(tokenQuery);

      // Study consistency
      const sessionQuery = query(
        collection(db, 'studySessions'),
        where('userId', '==', user.uid),
        orderBy('startTime', 'desc'),
        limit(365)
      );
      const sessionSnap = await getDocs(sessionQuery);

      let studyStreak = 0;
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const sessionDates = new Set<string>();
      sessionSnap.forEach(doc => {
        const date = doc.data().startTime.toDate();
        date.setHours(0, 0, 0, 0);
        sessionDates.add(date.toISOString().split('T')[0]);
      });

      // Calculate streak
      while (sessionDates.has(currentDate.toISOString().split('T')[0])) {
        studyStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      }

      const totalAttempts = quizTotal + labTotal + drillTotal;
      const totalFailures = (quizTotal - quizPasses) + (labTotal - labCompleted) + (drillTotal - drillSuccess);

      return {
        quizSuccessRate: quizTotal > 0 ? quizPasses / quizTotal : 0,
        avgQuizScore: quizTotal > 0 ? quizScoreSum / quizTotal : 0,
        quizStreak,
        labCompletionRate: labTotal > 0 ? labCompleted / labTotal : 0,
        avgLabScore: labTotal > 0 ? labScoreSum / labTotal : 0,
        avgLabTime: labTotal > 0 ? labTimeSum / labTotal : 0,
        drillSuccessRate: drillTotal > 0 ? drillSuccess / drillTotal : 0,
        avgDrillTime: drillTotal > 0 ? drillTimeSum / drillTotal : 0,
        avgEasinessFactor: efCount > 0 ? efSum / efCount : 2.5,
        weakTopicCount: weakTopics,
        failureRate: totalAttempts > 0 ? totalFailures / totalAttempts : 0,
        aarCompletionRate: failureSnap.size > 0 ? aarCompleted / failureSnap.size : 1,
        resetTokenUsage: tokenSnap.size,
        studyStreak,
        avgSessionsPerWeek: sessionSnap.size / 4 // Approximate for 30 days
      };
    } catch (error) {
      console.error('Error calculating metrics:', error);
      return getDefaultMetrics();
    }
  }, [user?.uid]);

  const getDefaultMetrics = (): PerformanceMetrics => ({
    quizSuccessRate: 0,
    avgQuizScore: 0,
    quizStreak: 0,
    labCompletionRate: 0,
    avgLabScore: 0,
    avgLabTime: 0,
    drillSuccessRate: 0,
    avgDrillTime: 0,
    avgEasinessFactor: 2.5,
    weakTopicCount: 0,
    failureRate: 0,
    aarCompletionRate: 1,
    resetTokenUsage: 0,
    studyStreak: 0,
    avgSessionsPerWeek: 0
  });

  const evaluateRecommendation = useCallback(async (): Promise<AdaptiveRecommendation> => {
    const metrics = await calculatePerformanceMetrics();
    const reasoning: string[] = [];
    let suggestedLevel = currentLevel;
    let type: 'increase' | 'decrease' | 'maintain' = 'maintain';
    let confidence = 0.5;

    // Check for promotion
    if (currentLevel === 'recruit' && checkPromotionCriteria(metrics, 'toSoldier')) {
      suggestedLevel = 'soldier';
      type = 'increase';
      confidence = 0.8;
      reasoning.push(`Quiz success rate: ${(metrics.quizSuccessRate * 100).toFixed(1)}% (requires 80%)`);
      reasoning.push(`Lab completion: ${(metrics.labCompletionRate * 100).toFixed(1)}% (requires 75%)`);
      reasoning.push(`Study streak: ${metrics.studyStreak} days (requires 5)`);
    } else if (currentLevel === 'soldier' && checkPromotionCriteria(metrics, 'toSpecialist')) {
      suggestedLevel = 'specialist';
      type = 'increase';
      confidence = 0.85;
      reasoning.push(`Consistently high performance across all areas`);
      reasoning.push(`Avg EF: ${metrics.avgEasinessFactor.toFixed(2)} (requires 2.2)`);
      reasoning.push(`Study streak: ${metrics.studyStreak} days (requires 10)`);
    } else if (currentLevel === 'specialist' && checkPromotionCriteria(metrics, 'toElite')) {
      suggestedLevel = 'elite';
      type = 'increase';
      confidence = 0.9;
      reasoning.push(`Elite performance: ${(metrics.quizSuccessRate * 100).toFixed(1)}% quiz success`);
      reasoning.push(`No weak topics remaining`);
      reasoning.push(`14+ day study streak achieved`);
    }
    // Check for demotion
    else if (currentLevel === 'elite' && checkDemotionCriteria(metrics, 'fromElite')) {
      suggestedLevel = 'specialist';
      type = 'decrease';
      confidence = 0.75;
      reasoning.push(`Performance below elite standards`);
      reasoning.push(`High reset token usage: ${metrics.resetTokenUsage}`);
    } else if (currentLevel === 'specialist' && checkDemotionCriteria(metrics, 'fromSpecialist')) {
      suggestedLevel = 'soldier';
      type = 'decrease';
      confidence = 0.7;
      reasoning.push(`Struggling with specialist-level challenges`);
      reasoning.push(`Failure rate: ${(metrics.failureRate * 100).toFixed(1)}%`);
    } else if (currentLevel === 'soldier' && checkDemotionCriteria(metrics, 'fromSoldier')) {
      suggestedLevel = 'recruit';
      type = 'decrease';
      confidence = 0.65;
      reasoning.push(`Need more foundational practice`);
      reasoning.push(`Success rates below soldier thresholds`);
    }

    if (reasoning.length === 0) {
      reasoning.push(`Performing well at current ${currentLevel} level`);
      reasoning.push(`Continue building consistency and mastery`);
    }

    return {
      type,
      confidence,
      reasoning,
      suggestedLevel,
      metricsSnapshot: metrics
    };
  }, [currentLevel, calculatePerformanceMetrics]);

  const checkPromotionCriteria = (metrics: PerformanceMetrics, level: keyof typeof PROMOTION_CRITERIA): boolean => {
    const criteria = PROMOTION_CRITERIA[level];
    
    return (
      metrics.quizSuccessRate >= criteria.quizSuccessRate &&
      metrics.labCompletionRate >= criteria.labCompletionRate &&
      metrics.drillSuccessRate >= criteria.drillSuccessRate &&
      metrics.studyStreak >= criteria.studyStreak &&
      (!('avgEasinessFactor' in criteria) || metrics.avgEasinessFactor >= (criteria as { avgEasinessFactor?: number }).avgEasinessFactor!) &&
      (!('weakTopicCount' in criteria) || metrics.weakTopicCount <= (criteria as { weakTopicCount?: number }).weakTopicCount!)
    );
  };

  const checkDemotionCriteria = (metrics: PerformanceMetrics, level: keyof typeof DEMOTION_CRITERIA): boolean => {
    const criteria = DEMOTION_CRITERIA[level];
    
    return (
      metrics.quizSuccessRate < criteria.quizSuccessRate ||
      metrics.drillSuccessRate < criteria.drillSuccessRate ||
      metrics.failureRate > criteria.failureRate ||
      metrics.resetTokenUsage > criteria.resetTokenUsage
    );
  };

  const adjustDifficulty = async (newLevel: DifficultyLevel, autoAdjusted: boolean, reason: string): Promise<void> => {
    if (!user?.uid) return;

    const metrics = await calculatePerformanceMetrics();
    const newSettings = createSettingsForLevel(newLevel);

    // Update settings
    await updateDoc(doc(db, 'difficultySettings', user.uid), newSettings);

    // Record adjustment
    const adjustment: Omit<DifficultyAdjustment, 'id'> = {
      userId: user.uid,
      timestamp: new Date(),
      previousLevel: currentLevel,
      newLevel,
      reason,
      metrics,
      autoAdjusted
    };

    await addDoc(collection(db, 'difficultyAdjustments'), adjustment);

    setCurrentLevel(newLevel);
    setSettings(newSettings);
    await loadRecentAdjustments();
  };

  const checkAndAutoAdjust = async (): Promise<boolean> => {
    const rec = await evaluateRecommendation();
    setRecommendation(rec);

    if (rec.type !== 'maintain' && rec.confidence > 0.7) {
      await adjustDifficulty(
        rec.suggestedLevel,
        true,
        `Auto-adjusted: ${rec.reasoning.join('. ')}`
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
    calculatePerformanceMetrics
  };
}
