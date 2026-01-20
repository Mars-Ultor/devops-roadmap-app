/**
 * Failure Log Hook - Refactored
 * Track all failures with context, resolution, and pattern detection
 */

import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import type {
  FailureLog,
  FailurePattern,
  FailureCategory,
} from "../types/training";
import {
  findSimilarFailures,
  updateFailurePattern,
} from "./failure-log/failureLogUtils";

interface UseFailureLogReturn {
  logFailure: (
    failureData: Omit<
      FailureLog,
      "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
    >,
  ) => Promise<string>;
  updateFailure: (
    failureId: string,
    updates: Partial<
      Pick<
        FailureLog,
        | "rootCause"
        | "resolution"
        | "preventionStrategy"
        | "lessonsLearned"
        | "resolvedAt"
      >
    >,
  ) => Promise<void>;
  getFailureLogs: (
    contentId?: string,
    category?: FailureCategory,
  ) => Promise<FailureLog[]>;
  detectPatterns: () => Promise<FailurePattern[]>;
  loading: boolean;
}

export function useFailureLog(): UseFailureLogReturn {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const logFailure = useCallback(
    async (
      failureData: Omit<
        FailureLog,
        "id" | "userId" | "timestamp" | "isRecurring" | "previousOccurrences"
      >,
    ): Promise<string> => {
      if (!user?.uid) throw new Error("User not authenticated");
      setLoading(true);
      try {
        const previousFailures = await findSimilarFailures(
          user.uid,
          failureData.category,
          failureData.title,
        );
        const isRecurring = previousFailures.length > 0;
        const previousOccurrences = previousFailures.map((f) => f.id);
        const failure: Omit<FailureLog, "id"> = {
          ...failureData,
          userId: user.uid,
          timestamp: new Date(),
          isRecurring,
          previousOccurrences,
        };
        const docRef = await addDoc(collection(db, "failureLogs"), {
          ...failure,
          timestamp: serverTimestamp(),
        });
        if (isRecurring)
          await updateFailurePattern(
            user.uid,
            failureData.category,
            failureData.title,
            docRef.id,
          );
        return docRef.id;
      } catch (error) {
        console.error("Error logging failure:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user?.uid],
  );

  const updateFailure = useCallback(
    async (
      failureId: string,
      updates: Partial<
        Pick<
          FailureLog,
          | "rootCause"
          | "resolution"
          | "preventionStrategy"
          | "lessonsLearned"
          | "resolvedAt"
        >
      >,
    ): Promise<void> => {
      if (!user?.uid) throw new Error("User not authenticated");
      setLoading(true);
      try {
        const failureRef = doc(db, "failureLogs", failureId);
        const updateData: Record<string, unknown> = { ...updates };
        if (updates.resolvedAt) {
          const failureDoc = await getDocs(
            query(
              collection(db, "failureLogs"),
              where("__name__", "==", failureId),
            ),
          );
          if (!failureDoc.empty) {
            const failureData = failureDoc.docs[0].data();
            const timestamp = failureData.timestamp?.toDate() || new Date();
            updateData.timeToResolveMinutes = Math.floor(
              (updates.resolvedAt.getTime() - timestamp.getTime()) / 60000,
            );
          }
          updateData.resolvedAt = serverTimestamp();
        }
        await updateDoc(failureRef, updateData);
      } catch (error) {
        console.error("Error updating failure:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user?.uid],
  );

  const getFailureLogs = useCallback(
    async (
      contentId?: string,
      category?: FailureCategory,
    ): Promise<FailureLog[]> => {
      if (!user?.uid) return [];
      setLoading(true);
      try {
        let q = query(
          collection(db, "failureLogs"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
        );
        if (contentId)
          q = query(
            collection(db, "failureLogs"),
            where("userId", "==", user.uid),
            where("contentId", "==", contentId),
            orderBy("timestamp", "desc"),
          );
        else if (category)
          q = query(
            collection(db, "failureLogs"),
            where("userId", "==", user.uid),
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
    [user?.uid],
  );

  const detectPatterns = useCallback(async (): Promise<FailurePattern[]> => {
    if (!user?.uid) return [];
    setLoading(true);
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "failurePatterns"),
          where("userId", "==", user.uid),
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
  }, [user?.uid]);

  return { logFailure, updateFailure, getFailureLogs, detectPatterns, loading };
}
