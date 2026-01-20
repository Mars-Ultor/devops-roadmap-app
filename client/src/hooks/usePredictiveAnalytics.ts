/**
 * Predictive Analytics Hook - Refactored
 * Estimates completion times and predicts learning outcomes
 */
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { QuerySnapshot } from "firebase/firestore";
import {
  calculateCompletionPrediction,
  predictWeakAreas,
  forecastPerformance,
  analyzeLearningTrajectory,
} from "./predictive-analytics/predictiveAnalyticsUtils";
import type { PredictiveData } from "./predictive-analytics/predictiveAnalyticsUtils";

export type { PredictiveData } from "./predictive-analytics/predictiveAnalyticsUtils";

export function usePredictiveAnalytics(
  progressSnap?: QuerySnapshot,
  failuresSnap?: QuerySnapshot,
) {
  const { user } = useAuthStore();
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const generatePredictions = useCallback(
    async (progSnap?: QuerySnapshot, failSnap?: QuerySnapshot) => {
      if (!user?.uid) return;
      try {
        const progressSnapToUse =
          progSnap ||
          (await getDocs(
            query(collection(db, "progress"), where("userId", "==", user.uid)),
          ));
        const failuresSnapToUse =
          failSnap ||
          (await getDocs(
            query(
              collection(db, "failureLogs"),
              where("userId", "==", user.uid),
            ),
          ));

        setPredictiveData({
          completionPrediction: calculateCompletionPrediction(
            progressSnapToUse.docs,
          ),
          weakAreaPredictions: predictWeakAreas(
            progressSnapToUse.docs,
            failuresSnapToUse.docs,
          ),
          performanceForecast: forecastPerformance(progressSnapToUse.docs),
          learningTrajectory: analyzeLearningTrajectory(progressSnapToUse.docs),
        });
      } catch (e) {
        console.error("Error generating predictions:", e);
      } finally {
        setLoading(false);
      }
    },
    [user?.uid],
  );

  useEffect(() => {
    if (progressSnap && failuresSnap) {
      generatePredictions(progressSnap, failuresSnap);
    } else if (user?.uid) {
      generatePredictions();
    }
  }, [generatePredictions, user?.uid, progressSnap, failuresSnap]);

  return { predictiveData, loading, generatePredictions };
}
