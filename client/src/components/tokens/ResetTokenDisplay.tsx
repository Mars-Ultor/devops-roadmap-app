/**
 * Reset Token Display Component
 * Shows remaining tokens with visual indicators
 */

import { AlertCircle, RefreshCw, Trophy } from 'lucide-react';
import type { TokenAllocation } from '../../types/tokens';

interface ResetTokenDisplayProps {
  allocation: TokenAllocation | null;
  type: 'quiz' | 'lab' | 'battleDrill';
  compact?: boolean;
}

export default function ResetTokenDisplay({ allocation, type, compact = false }: ResetTokenDisplayProps) {
  if (!allocation) {
    return (
      <div className="animate-pulse bg-gray-800 rounded h-8 w-32" />
    );
  }

  const getTokenInfo = () => {
    switch (type) {
      case 'quiz':
        return {
          total: allocation.quizResets,
          used: allocation.quizResetsUsed,
          label: 'Quiz Resets',
          color: 'blue'
        };
      case 'lab':
        return {
          total: allocation.labResets,
          used: allocation.labResetsUsed,
          label: 'Lab Resets',
          color: 'purple'
        };
      case 'battleDrill':
        return {
          total: allocation.battleDrillResets,
          used: allocation.battleDrillResetsUsed,
          label: 'Drill Resets',
          color: 'green'
        };
    }
  };

  const info = getTokenInfo();
  const remaining = info.total - info.used;
  const percentage = (remaining / info.total) * 100;

  const getColorClasses = () => {
    const base: Record<string, { bg: string; border: string; text: string; fill: string }> = {
      blue: {
        bg: 'bg-blue-900/30',
        border: 'border-blue-700',
        text: 'text-blue-400',
        fill: 'bg-blue-600'
      },
      purple: {
        bg: 'bg-purple-900/30',
        border: 'border-purple-700',
        text: 'text-purple-400',
        fill: 'bg-purple-600'
      },
      green: {
        bg: 'bg-green-900/30',
        border: 'border-green-700',
        text: 'text-green-400',
        fill: 'bg-green-600'
      }
    };

    return base[info.color];
  };

  const colors = getColorClasses();

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} border ${colors.border} rounded-lg`}>
        <RefreshCw className={`w-4 h-4 ${colors.text}`} />
        <span className={`text-sm font-semibold ${colors.text}`}>
          {remaining}/{info.total}
        </span>
      </div>
    );
  }

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${colors.text}`} />
          <span className="text-sm font-medium text-gray-300">{info.label}</span>
        </div>
        <div className={`text-2xl font-bold ${colors.text}`}>
          {remaining}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-2">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${colors.fill} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{info.used} used</span>
        <span className="text-gray-400">Resets this week</span>
      </div>

      {remaining === 0 && (
        <div className="mt-3 flex items-start gap-2 p-2 bg-red-900/20 border border-red-800 rounded">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-300">
            No resets remaining. Resets refresh every Monday.
          </div>
        </div>
      )}

      {remaining === 1 && (
        <div className="mt-3 flex items-start gap-2 p-2 bg-yellow-900/20 border border-yellow-800 rounded">
          <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-300">
            Last reset available. Use wisely!
          </div>
        </div>
      )}

      {remaining === info.total && info.used === 0 && (
        <div className="mt-3 flex items-start gap-2 p-2 bg-green-900/20 border border-green-800 rounded">
          <Trophy className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-green-300">
            No resets used yet. Great discipline!
          </div>
        </div>
      )}
    </div>
  );
}
