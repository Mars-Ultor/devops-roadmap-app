/**
 * Reset Tokens State Hook
 * Manages state for reset token operations
 */

import { useState } from "react";
import type { TokenAllocation, ResetToken } from "../../types/tokens";

export function useResetTokensState() {
  const [currentAllocation, setCurrentAllocation] =
    useState<TokenAllocation | null>(null);
  const [recentResets, setRecentResets] = useState<ResetToken[]>([]);
  const [loading, setLoading] = useState(true);

  return {
    currentAllocation,
    setCurrentAllocation,
    recentResets,
    setRecentResets,
    loading,
    setLoading,
  };
}