/**
 * Reset Tokens Load Callbacks Hook
 * Handles loading operations for token allocations and resets
 */

import { useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { TokenAllocation, ResetToken, TokenConfig } from "../../types/tokens";
import {
  getCurrentWeek,
  createNewAllocation,
} from "./resetTokensUtils";

interface ResetTokensLoadCallbacksParams {
  userId: string | undefined;
  config: TokenConfig;
  setCurrentAllocation: (allocation: TokenAllocation | null) => void;
  setRecentResets: (resets: ResetToken[]) => void;
  setLoading: (loading: boolean) => void;
}

export function useResetTokensLoadCallbacks({
  userId,
  config,
  setCurrentAllocation,
  setRecentResets,
  setLoading,
}: ResetTokensLoadCallbacksParams) {
  const loadTokenAllocation = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { weekStart, weekEnd } = getCurrentWeek();
      const snapshot = await getDocs(
        query(
          collection(db, "tokenAllocations"),
          where("userId", "==", userId),
          where("weekStart", ">=", weekStart),
          where("weekStart", "<=", weekEnd),
        ),
      );

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCurrentAllocation({
          ...data,
          weekStart: data.weekStart.toDate(),
          weekEnd: data.weekEnd.toDate(),
        } as TokenAllocation);
      } else {
        const newAllocation = createNewAllocation(userId, config);
        await addDoc(collection(db, "tokenAllocations"), newAllocation);
        setCurrentAllocation(newAllocation as TokenAllocation);
      }
    } catch (e) {
      console.error("Error loading token allocation:", e);
    } finally {
      setLoading(false);
    }
  }, [userId, config, setCurrentAllocation, setLoading]);

  const loadRecentResets = useCallback(async () => {
    if (!userId) return;
    try {
      const snapshot = await getDocs(
        query(
          collection(db, "resetTokens"),
          where("userId", "==", userId),
          orderBy("usedAt", "desc"),
          limit(10),
        ),
      );
      setRecentResets(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          usedAt: doc.data().usedAt.toDate(),
        })) as ResetToken[],
      );
    } catch (e) {
      console.error("Error loading recent resets:", e);
    }
  }, [userId, setRecentResets]);

  return { loadTokenAllocation, loadRecentResets };
}