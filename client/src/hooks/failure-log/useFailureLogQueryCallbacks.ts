/**
 * Failure Log Query Callbacks Hook
 * Handles failure querying and pattern detection operations
 */

import { useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { FailureLog, FailurePattern, FailureCategory } from "../../types/training";

interface FailureLogQueryCallbacksParams {
  userId: string | undefined;
  setLoading: (loading: boolean) => void;
}

export function useFailureLogQueryCallbacks({ userId, setLoading }: FailureLogQueryCallbacksParams) {
  const getFailureLogs = useCallback(
    async (
      contentId?: string,
      category?: FailureCategory,
    ): Promise<FailureLog[]> => {
      if (!userId) return [];
      setLoading(true);
      try {
        let q = query(
          collection(db, "failureLogs"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
        );
        if (contentId)
          q = query(
            collection(db, "failureLogs"),
            where("userId", "==", userId),
            where("contentId", "==", contentId),
            orderBy("timestamp", "desc"),
          );
        else if (category)
          q = query(
            collection(db, "failureLogs"),
            where("userId", "==", userId),
            where("category", "==", category),
            orderBy("timestamp", "desc"),
          );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
              timestamp: doc.data().timestamp?.toDate() || new Date(),
              resolvedAt: doc.data().resolvedAt?.toDate(),
            }) as FailureLog,
        );
      } catch (error) {
        console.error("Error fetching failure logs:", error);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [userId, setLoading],
  );

  const detectPatterns = useCallback(async (): Promise<FailurePattern[]> => {
    if (!userId) return [];
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "failurePatterns"),
          where("userId", "==", userId),
          orderBy("lastSeen", "desc"),
        ),
      );
      return snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            firstSeen: doc.data().firstSeen?.toDate() || new Date(),
            lastSeen: doc.data().lastSeen?.toDate() || new Date(),
          }) as FailurePattern,
      );
    } catch (error) {
      console.error("Error detecting patterns:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, setLoading]);

  return { getFailureLogs, detectPatterns };
}