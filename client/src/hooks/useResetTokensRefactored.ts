/**
 * Reset Token Management Hook - Refactored
 * Enforces weekly reset limits and cooldowns
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { ResetToken, TokenAllocation, TokenType, TokenConfig, TokenUsageStats } from '../types/tokens';
import { DEFAULT_TOKEN_CONFIG } from '../types/tokens';
import {
  getCurrentWeek, checkCanReset, updateAllocationForType,
  getDefaultUsageStats, calculateUsageStats, createNewAllocation
} from './reset-tokens/resetTokensUtils';

export function useResetTokens(config: TokenConfig = DEFAULT_TOKEN_CONFIG) {
  const { user } = useAuthStore();
  const [currentAllocation, setCurrentAllocation] = useState<TokenAllocation | null>(null);
  const [recentResets, setRecentResets] = useState<ResetToken[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTokenAllocation = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const { weekStart, weekEnd } = getCurrentWeek();
      const snapshot = await getDocs(query(collection(db, 'tokenAllocations'), where('userId', '==', user.uid), where('weekStart', '>=', weekStart), where('weekStart', '<=', weekEnd)));

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCurrentAllocation({ ...data, weekStart: data.weekStart.toDate(), weekEnd: data.weekEnd.toDate() } as TokenAllocation);
      } else {
        const newAllocation = createNewAllocation(user.uid, config);
        await addDoc(collection(db, 'tokenAllocations'), newAllocation);
        setCurrentAllocation(newAllocation as TokenAllocation);
      }
    } catch (e) { console.error('Error loading token allocation:', e); }
    finally { setLoading(false); }
  }, [user?.uid, config]);

  const loadRecentResets = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const snapshot = await getDocs(query(collection(db, 'resetTokens'), where('userId', '==', user.uid), orderBy('usedAt', 'desc'), limit(10)));
      setRecentResets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), usedAt: doc.data().usedAt.toDate() })) as ResetToken[]);
    } catch (e) { console.error('Error loading recent resets:', e); }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) { loadTokenAllocation(); loadRecentResets(); }
  }, [user?.uid, loadTokenAllocation, loadRecentResets]);

  const canReset = (type: TokenType) => checkCanReset(currentAllocation, recentResets, type, config.resetCooldownMinutes);

  const useResetToken = async (type: TokenType, itemId: string, itemTitle: string, weekNumber?: number, reason?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid || !currentAllocation) return { success: false, error: 'Not authenticated or allocation not loaded' };
    const check = canReset(type);
    if (!check.allowed) return { success: false, error: check.reason };

    try {
      await addDoc(collection(db, 'resetTokens'), { userId: user.uid, type, usedAt: new Date(), itemId, itemTitle, weekNumber, reason });
      setCurrentAllocation(updateAllocationForType(currentAllocation, type));
      await loadRecentResets();
      return { success: true };
    } catch (e) { console.error('Error using reset token:', e); return { success: false, error: 'Failed to use reset token' }; }
  };

  const getRemainingTokens = () => {
    if (!currentAllocation) return { quiz: 0, lab: 0, battleDrill: 0 };
    return {
      quiz: currentAllocation.quizResets - currentAllocation.quizResetsUsed,
      lab: currentAllocation.labResets - currentAllocation.labResetsUsed,
      battleDrill: currentAllocation.battleDrillResets - currentAllocation.battleDrillResetsUsed
    };
  };

  const getUsageStats = async (): Promise<TokenUsageStats> => {
    if (!user?.uid) return getDefaultUsageStats();
    try {
      const snapshot = await getDocs(query(collection(db, 'resetTokens'), where('userId', '==', user.uid)));
      return calculateUsageStats(snapshot.docs.map(doc => doc.data() as ResetToken));
    } catch (e) { console.error('Error getting usage stats:', e); return getDefaultUsageStats(); }
  };

  return { currentAllocation, recentResets, loading, canReset, useResetToken, getRemainingTokens, getUsageStats, refreshAllocation: loadTokenAllocation };
}
