/**
 * useDailyDrill - Custom hook for daily drill selection
 */

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuthStore } from "../../store/authStore";
import {
  selectDailyDrill,
  type DailyDrillCandidate,
} from "../../services/spacedRepetition";
import { getRandomBattleDrill } from "../../data/battleDrills";
import type { BattleDrill } from "../../types/training";

export function useDailyDrill(isOpen: boolean) {
  const { user } = useAuthStore();
  const [selectedDrill, setSelectedDrill] = useState<BattleDrill | null>(null);
  const [drillCandidate, setDrillCandidate] =
    useState<DailyDrillCandidate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) selectTodaysDrill();
  }, [isOpen, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectTodaysDrill = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const progressQuery = query(
        collection(db, "progress"),
        where("userId", "==", user.uid),
        where("completed", "==", true),
        orderBy("completedAt", "desc"),
        limit(50),
      );
      const progressSnap = await getDocs(progressQuery);

      const completedContent = await Promise.all(
        progressSnap.docs.map(async (doc) => {
          const data = doc.data();
          let masteryLevel;
          if (data.type === "lesson") {
            const masteryDoc = await getDocs(
              query(
                collection(db, "lessonMastery"),
                where("userId", "==", user.uid),
                where("lessonId", "==", data.lessonId),
                limit(1),
              ),
            );
            if (!masteryDoc.empty)
              masteryLevel = masteryDoc.docs[0].data().currentLevel;
          }
          return {
            id: data.lessonId || data.labId || doc.id,
            type: data.type,
            title: data.title || "Unknown",
            completedAt: data.completedAt?.toDate() || new Date(),
            masteryLevel,
          };
        }),
      );

      const candidate = selectDailyDrill(completedContent);
      if (candidate) {
        setDrillCandidate(candidate);
        const drill = getRandomBattleDrill();
        setSelectedDrill(drill);
      } else {
        const drill = getRandomBattleDrill();
        setSelectedDrill(drill);
      }
    } catch (error) {
      console.error("Error selecting daily drill:", error);
      const drill = getRandomBattleDrill();
      setSelectedDrill(drill);
    } finally {
      setLoading(false);
    }
  };

  return { selectedDrill, drillCandidate, loading };
}
