/**
 * Reset Tokens Usage Callbacks Hook
 * Handles token usage and utility operations
 */

import { useCallback } from "react";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { TokenAllocation, ResetToken, TokenType, TokenUsageStats } from "../../types/tokens";
import {
  updateAllocationForType,
  getDefaultUsageStats,
  calculateUsageStats,
} from "./resetTokensUtils";

interface ResetTokensUsageCallbacksParams {
  userId: string | undefined;
  currentAllocation: TokenAllocation | null;
  setCurrentAllocation: (allocation: TokenAllocation | null) => void;
  loadRecentResets: () => Promise<void>;
  canReset: (type: TokenType) => { allowed: boolean; reason?: string };
}

export function useResetTokensUsageCallbacks({
  userId,
  currentAllocation,
  setCurrentAllocation,
  loadRecentResets,
  canReset,
}: ResetTokensUsageCallbacksParams) {
  const useResetToken = useCallback(
    async (
      type: TokenType,
      itemId: string,
      itemTitle: string,
      weekNumber?: number,
      reason?: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!userId || !currentAllocation)
        return {
          success: false,
          error: "Not authenticated or allocation not loaded",
        };
      const check = canReset(type);
      if (!check.allowed) return { success: false, error: check.reason };

      try {
        await addDoc(collection(db, "resetTokens"), {
          userId,
          type,
          usedAt: new Date(),
          itemId,
          itemTitle,
          weekNumber,
          reason,
        });
        setCurrentAllocation(updateAllocationForType(currentAllocation, type));
        await loadRecentResets();
        return { success: true };
      } catch (e) {
        console.error("Error using reset token:", e);
        return { success: false, error: "Failed to use reset token" };
      }
    },
    [userId, currentAllocation, canReset, setCurrentAllocation, loadRecentResets],
  );

  const getRemainingTokens = useCallback(() => {
    if (!currentAllocation) return { quiz: 0, lab: 0, battleDrill: 0 };
    return {
      quiz: currentAllocation.quizResets - currentAllocation.quizResetsUsed,
      lab: currentAllocation.labResets - currentAllocation.labResetsUsed,
      battleDrill:
        currentAllocation.battleDrillResets -
        currentAllocation.battleDrillResetsUsed,
    };
  }, [currentAllocation]);

  const getUsageStats = useCallback(async (): Promise<TokenUsageStats> => {
    if (!userId) return getDefaultUsageStats();
    try {
      const snapshot = await getDocs(
        query(collection(db, "resetTokens"), where("userId", "==", userId)),
      );
      return calculateUsageStats(
        snapshot.docs.map((doc) => doc.data() as ResetToken),
      );
    } catch (e) {
      console.error("Error getting usage stats:", e);
      return getDefaultUsageStats();
    }
  }, [userId]);

  return {
    useResetToken,
    getRemainingTokens,
    getUsageStats,
  };
}