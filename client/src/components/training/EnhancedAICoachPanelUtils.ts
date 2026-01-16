/**
 * EnhancedAICoachPanelUtils - Types and utilities for EnhancedAICoachPanel
 */

import type { CoachFeedback } from '../../types/aiCoach';
import { Brain, Target, AlertTriangle, Zap, Shield } from 'lucide-react';

export interface MilitaryStyle {
  border: string;
  background: string;
}

export function getMilitaryStyling(feedback: CoachFeedback | null, militaryMode: boolean): MilitaryStyle {
  if (!militaryMode) return { border: 'border-slate-700', background: 'bg-slate-800' };

  if (feedback?.type === 'discipline') {
    return { border: 'border-red-500/50', background: 'bg-red-900/20' };
  }
  if (feedback?.priority === 'critical') {
    return { border: 'border-red-400/50', background: 'bg-red-900/10' };
  }
  if (feedback?.priority === 'high') {
    return { border: 'border-amber-400/50', background: 'bg-amber-900/10' };
  }
  return { border: 'border-slate-700', background: 'bg-slate-800' };
}

export function getIcon(feedback: CoachFeedback | null) {
  if (!feedback) return Brain;
  const icons = { discipline: Shield, tactical_advice: Target, warning: AlertTriangle, hint: Zap };
  return icons[feedback.type as keyof typeof icons] || Brain;
}

export function getIconColor(feedback: CoachFeedback | null): string {
  if (!feedback) return 'text-slate-400';
  const colors: Record<string, string> = {
    discipline: 'text-red-400', tactical_advice: 'text-green-400', warning: 'text-amber-400',
    hint: 'text-blue-400', insight: 'text-purple-400', question: 'text-indigo-400', encouragement: 'text-emerald-400'
  };
  return colors[feedback.type] || 'text-slate-400';
}

export function getTypeLabel(feedback: CoachFeedback | null): string {
  if (!feedback) return 'AI Coach';
  const labels: Record<string, string> = {
    discipline: 'DISCIPLINE', tactical_advice: 'TACTICAL', warning: 'WARNING', hint: 'GUIDANCE',
    insight: 'INSIGHT', question: 'COACHING', encouragement: 'AFFIRMATION'
  };
  return labels[feedback.type] || 'COACH';
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = { medium: 'bg-blue-600', high: 'bg-amber-600', critical: 'bg-red-600' };
  return colors[priority] || 'bg-slate-600';
}
