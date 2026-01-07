/**
 * ResetTokenUtils - Utility functions for Reset Token components
 * Separated from .tsx files for fast-refresh compliance
 */

import type { TokenAllocation, TokenType } from '../../../types/tokens';

// ============================================================================
// Type Definitions
// ============================================================================

export interface TokenInfo {
  total: number;
  used: number;
  label: string;
  color: string;
}

export interface TokenDisplayInfo {
  total: number;
  used: number;
  label: string;
  color: string;
}

export interface ColorClasses {
  bg: string;
  border: string;
  text: string;
  fill: string;
}

// ============================================================================
// Token Helper Functions
// ============================================================================

export function getTypeLabel(type: TokenType): string {
  switch (type) {
    case 'quiz-reset': return 'Quiz';
    case 'lab-reset': return 'Lab';
    case 'battle-drill-reset': return 'Battle Drill';
  }
}

export function getTokenInfo(allocation: TokenAllocation, type: 'quiz' | 'lab' | 'battleDrill'): TokenInfo {
  switch (type) {
    case 'quiz':
      return {
        total: allocation.quizResets,
        used: allocation.quizResetsUsed,
        label: 'Quiz Reset',
        color: 'blue'
      };
    case 'lab':
      return {
        total: allocation.labResets,
        used: allocation.labResetsUsed,
        label: 'Lab Reset',
        color: 'purple'
      };
    case 'battleDrill':
      return {
        total: allocation.battleDrillResets,
        used: allocation.battleDrillResetsUsed,
        label: 'Battle Drill Reset',
        color: 'green'
      };
  }
}

export function getDaysUntilRefresh(): number {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
}

export function getTokenDisplayInfo(
  allocation: TokenAllocation, 
  type: 'quiz' | 'lab' | 'battleDrill'
): TokenDisplayInfo {
  switch (type) {
    case 'quiz':
      return { total: allocation.quizResets, used: allocation.quizResetsUsed, label: 'Quiz Resets', color: 'blue' };
    case 'lab':
      return { total: allocation.labResets, used: allocation.labResetsUsed, label: 'Lab Resets', color: 'purple' };
    case 'battleDrill':
      return { total: allocation.battleDrillResets, used: allocation.battleDrillResetsUsed, label: 'Drill Resets', color: 'green' };
  }
}

export function getColorClasses(color: string): ColorClasses {
  const colorMap: Record<string, ColorClasses> = {
    blue: { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-400', fill: 'bg-blue-600' },
    purple: { bg: 'bg-purple-900/30', border: 'border-purple-700', text: 'text-purple-400', fill: 'bg-purple-600' },
    green: { bg: 'bg-green-900/30', border: 'border-green-700', text: 'text-green-400', fill: 'bg-green-600' }
  };
  return colorMap[color] || colorMap.blue;
}
