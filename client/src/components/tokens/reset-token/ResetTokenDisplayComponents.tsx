/**
 * ResetTokenDisplayComponents - Extracted UI components for ResetTokenDisplay
 * NOTE: Utility functions moved to ResetTokenUtils.ts for fast-refresh compliance
 */

import { AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import type { ColorClasses } from './ResetTokenUtils';

// ============================================================================
// Loading Placeholder
// ============================================================================

export function TokenDisplayLoading() {
  return <div className="animate-pulse bg-gray-800 rounded h-8 w-32" />;
}

// ============================================================================
// Compact Display
// ============================================================================

interface CompactDisplayProps {
  remaining: number;
  total: number;
  colors: ColorClasses;
}

export function CompactTokenDisplay({ remaining, total, colors }: CompactDisplayProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} border ${colors.border} rounded-lg`}>
      <RefreshCw className={`w-4 h-4 ${colors.text}`} />
      <span className={`text-sm font-semibold ${colors.text}`}>{remaining}/{total}</span>
    </div>
  );
}

// ============================================================================
// Progress Bar
// ============================================================================

interface ProgressBarProps {
  percentage: number;
  fillClass: string;
}

export function TokenProgressBar({ percentage, fillClass }: ProgressBarProps) {
  return (
    <div className="mb-2">
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${fillClass} transition-all duration-300`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// ============================================================================
// Status Alerts
// ============================================================================

export function NoResetsAlert() {
  return (
    <div className="mt-3 flex items-start gap-2 p-2 bg-red-900/20 border border-red-800 rounded">
      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-red-300">No resets remaining. Resets refresh every Monday.</div>
    </div>
  );
}

export function LastResetAlert() {
  return (
    <div className="mt-3 flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-800 rounded">
      <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-yellow-300">Last reset available. Use wisely!</div>
    </div>
  );
}

export function DisciplineAlert() {
  return (
    <div className="mt-3 flex items-start gap-2 p-2 bg-green-900/20 border border-green-800 rounded">
      <Trophy className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
      <div className="text-xs text-green-300">No resets used yet. Great discipline!</div>
    </div>
  );
}
