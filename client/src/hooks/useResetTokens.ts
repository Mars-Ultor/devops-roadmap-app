/**
 * Reset Token Management Hook
 * Enforces weekly reset limits and cooldowns
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { ResetToken, TokenAllocation, TokenType, TokenConfig, TokenUsageStats } from '../types/tokens';
import { DEFAULT_TOKEN_CONFIG } from '../types/tokens';

export function useResetTokens(config: TokenConfig = DEFAULT_TOKEN_CONFIG) {
  const { user } = useAuthStore();
  const [currentAllocation, setCurrentAllocation] = useState<TokenAllocation | null>(null);
  const [recentResets, setRecentResets] = useState<ResetToken[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load or create current week's token allocation
   */
  const loadTokenAllocation = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const { weekStart, weekEnd } = getCurrentWeek();

      // Check if allocation exists for current week
      const allocQuery = query(
        collection(db, 'tokenAllocations'),
        where('userId', '==', user.uid),
        where('weekStart', '>=', weekStart),
        where('weekStart', '<=', weekEnd)
      );

      const snapshot = await getDocs(allocQuery);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCurrentAllocation({
          ...data,
          weekStart: data.weekStart.toDate(),
          weekEnd: data.weekEnd.toDate()
        } as TokenAllocation);
      } else {
        // Create new allocation for the week
        const newAllocation: Omit<TokenAllocation, 'id'> = {
          userId: user.uid,
          weekStart,
          weekEnd,
          quizResets: config.quizResetsPerWeek,
          labResets: config.labResetsPerWeek,
          battleDrillResets: config.battleDrillResetsPerWeek,
          quizResetsUsed: 0,
          labResetsUsed: 0,
          battleDrillResetsUsed: 0
        };

        await addDoc(collection(db, 'tokenAllocations'), newAllocation);
        setCurrentAllocation(newAllocation as TokenAllocation);
      }
    } catch (error) {
      console.error('Error loading token allocation:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, config]);

  /**
   * Load recent reset history
   */
  const loadRecentResets = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const resetsQuery = query(
        collection(db, 'resetTokens'),
        where('userId', '==', user.uid),
        orderBy('usedAt', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(resetsQuery);
      const resets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        usedAt: doc.data().usedAt.toDate()
      })) as ResetToken[];

      setRecentResets(resets);
    } catch (error) {
      console.error('Error loading recent resets:', error);
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      loadTokenAllocation();
      loadRecentResets();
    }
  }, [user?.uid, loadTokenAllocation, loadRecentResets]);

  /**
   * Get the current week's date range (Monday to Sunday)
   */
  const getCurrentWeek = (): { weekStart: Date; weekEnd: Date } => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  };

  /**
   * Check if user can reset an item
   */
  const canReset = (type: TokenType): { allowed: boolean; reason?: string } => {
    if (!currentAllocation) {
      return { allowed: false, reason: 'Loading token allocation...' };
    }

    // Check weekly limit
    let remaining = 0;
    switch (type) {
      case 'quiz-reset':
        remaining = currentAllocation.quizResets - currentAllocation.quizResetsUsed;
        if (remaining <= 0) {
          return { allowed: false, reason: 'No quiz resets remaining this week' };
        }
        break;
      case 'lab-reset':
        remaining = currentAllocation.labResets - currentAllocation.labResetsUsed;
        if (remaining <= 0) {
          return { allowed: false, reason: 'No lab resets remaining this week' };
        }
        break;
      case 'battle-drill-reset':
        remaining = currentAllocation.battleDrillResets - currentAllocation.battleDrillResetsUsed;
        if (remaining <= 0) {
          return { allowed: false, reason: 'No battle drill resets remaining this week' };
        }
        break;
    }

    // Check cooldown (last reset must be > 30 min ago)
    if (recentResets.length > 0) {
      const lastReset = recentResets[0];
      const minutesSinceLastReset = (new Date().getTime() - lastReset.usedAt.getTime()) / (1000 * 60);
      
      if (minutesSinceLastReset < config.resetCooldownMinutes) {
        const remainingMinutes = Math.ceil(config.resetCooldownMinutes - minutesSinceLastReset);
        return {
          allowed: false,
          reason: `Cooldown active. Wait ${remainingMinutes} more minute(s)`
        };
      }
    }

    return { allowed: true };
  };

  /**
   * Use a reset token
   */
  const useResetToken = async (
    type: TokenType,
    itemId: string,
    itemTitle: string,
    weekNumber?: number,
    reason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.uid || !currentAllocation) {
      return { success: false, error: 'Not authenticated or allocation not loaded' };
    }

    // Check if reset is allowed
    const check = canReset(type);
    if (!check.allowed) {
      return { success: false, error: check.reason };
    }

    try {
      // Record the reset
      const resetToken: Omit<ResetToken, 'id'> = {
        userId: user.uid,
        type,
        usedAt: new Date(),
        itemId,
        itemTitle,
        weekNumber,
        reason
      };

      await addDoc(collection(db, 'resetTokens'), resetToken);

      // Update allocation (increment used count)
      const updatedAllocation = { ...currentAllocation };
      switch (type) {
        case 'quiz-reset':
          updatedAllocation.quizResetsUsed++;
          break;
        case 'lab-reset':
          updatedAllocation.labResetsUsed++;
          break;
        case 'battle-drill-reset':
          updatedAllocation.battleDrillResetsUsed++;
          break;
      }

      setCurrentAllocation(updatedAllocation);

      // Reload recent resets
      await loadRecentResets();

      return { success: true };
    } catch (error) {
      console.error('Error using reset token:', error);
      return { success: false, error: 'Failed to use reset token' };
    }
  };

  /**
   * Get remaining tokens for each type
   */
  const getRemainingTokens = () => {
    if (!currentAllocation) {
      return { quiz: 0, lab: 0, battleDrill: 0 };
    }

    return {
      quiz: currentAllocation.quizResets - currentAllocation.quizResetsUsed,
      lab: currentAllocation.labResets - currentAllocation.labResetsUsed,
      battleDrill: currentAllocation.battleDrillResets - currentAllocation.battleDrillResetsUsed
    };
  };

  /**
   * Get usage statistics
   */
  const getUsageStats = async (): Promise<TokenUsageStats> => {
    if (!user?.uid) {
      return {
        totalResetsUsed: 0,
        quizResetsUsed: 0,
        labResetsUsed: 0,
        battleDrillResetsUsed: 0,
        averageResetsPerWeek: 0,
        weeksMostResets: 0,
        itemsMostReset: []
      };
    }

    try {
      const resetsQuery = query(
        collection(db, 'resetTokens'),
        where('userId', '==', user.uid)
      );
      
      const snapshot = await getDocs(resetsQuery);
      const allResets = snapshot.docs.map(doc => doc.data() as ResetToken);

      const quizResets = allResets.filter(r => r.type === 'quiz-reset').length;
      const labResets = allResets.filter(r => r.type === 'lab-reset').length;
      const battleDrillResets = allResets.filter(r => r.type === 'battle-drill-reset').length;

      // Calculate average per week (rough estimate)
      const firstReset = allResets.length > 0 ? 
        new Date(Math.min(...allResets.map(r => new Date(r.usedAt as string | number | Date).getTime()))) : 
        new Date();
      const weeksSinceFirst = Math.max(1, Math.ceil(
        (new Date().getTime() - firstReset.getTime()) / (7 * 24 * 60 * 60 * 1000)
      ));

      // Find items most reset
      const itemCounts = new Map<string, { title: string; type: TokenType; count: number }>();
      allResets.forEach(reset => {
        const key = reset.itemId;
        const existing = itemCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          itemCounts.set(key, {
            title: reset.itemTitle,
            type: reset.type,
            count: 1
          });
        }
      });

      const itemsMostReset = Array.from(itemCounts.entries())
        .map(([itemId, data]) => ({
          itemId,
          itemTitle: data.title,
          type: data.type,
          resetCount: data.count
        }))
        .sort((a, b) => b.resetCount - a.resetCount)
        .slice(0, 5);

      return {
        totalResetsUsed: allResets.length,
        quizResetsUsed: quizResets,
        labResetsUsed: labResets,
        battleDrillResetsUsed: battleDrillResets,
        averageResetsPerWeek: allResets.length / weeksSinceFirst,
        weeksMostResets: 0, // Would need week-by-week calculation
        itemsMostReset
      };
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {
        totalResetsUsed: 0,
        quizResetsUsed: 0,
        labResetsUsed: 0,
        battleDrillResetsUsed: 0,
        averageResetsPerWeek: 0,
        weeksMostResets: 0,
        itemsMostReset: []
      };
    }
  };

  return {
    currentAllocation,
    recentResets,
    loading,
    canReset,
    useResetToken,
    getRemainingTokens,
    getUsageStats,
    refreshAllocation: loadTokenAllocation
  };
}
