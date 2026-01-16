/**
 * Predictive Analytics Hook - Refactored
 * Estimates completion times and predicts learning outcomes
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {
  calculateCompletionPrediction, predictWeakAreas, forecastPerformance, analyzeLearningTrajectory
} from './predictive-analytics/predictiveAnalyticsUtils';
import type { PredictiveData } from './predictive-analytics/predictiveAnalyticsUtils';

export type { PredictiveData } from './predictive-analytics/predictiveAnalyticsUtils';

export function usePredictiveAnalytics() {
  const { user } = useAuthStore();
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null);
  const [loading, setLoading] = useState(true);

  const generatePredictions = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const [progressSnap, , failuresSnap] = await Promise.all([
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid)))
      ]);
      setPredictiveData({
        completionPrediction: calculateCompletionPrediction(progressSnap.docs),
        weakAreaPredictions: predictWeakAreas(progressSnap.docs, failuresSnap.docs),
        performanceForecast: forecastPerformance(progressSnap.docs),
        learningTrajectory: analyzeLearningTrajectory(progressSnap.docs)
      });
    } catch (e) { console.error('Error generating predictions:', e); }
    finally { setLoading(false); }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      generatePredictions();
    }
  }, [user?.uid, generatePredictions]);

  return { predictiveData, loading, generatePredictions };
}
