/**
 * Reset Token Display Component
 * Shows remaining tokens with visual indicators
 */

import { RefreshCw } from 'lucide-react';
import type { TokenAllocation } from '../../types/tokens';

// Import extracted components and utilities
import {
  TokenDisplayLoading,
  CompactTokenDisplay,
  TokenProgressBar,
  NoResetsAlert,
  LastResetAlert,
  DisciplineAlert
} from './reset-token/ResetTokenDisplayComponents';
import { getTokenDisplayInfo, getColorClasses } from './reset-token/ResetTokenUtils';

interface ResetTokenDisplayProps {
  allocation: TokenAllocation | null;
  type: 'quiz' | 'lab' | 'battleDrill';
  compact?: boolean;
}

export default function ResetTokenDisplay({ allocation, type, compact = false }: ResetTokenDisplayProps) {
  if (!allocation) return <TokenDisplayLoading />;

  const info = getTokenDisplayInfo(allocation, type);
  const remaining = info.total - info.used;
  const percentage = (remaining / info.total) * 100;
  const colors = getColorClasses(info.color);

  if (compact) {
    return <CompactTokenDisplay remaining={remaining} total={info.total} colors={colors} />;
  }

  return (
    <div className={`${colors.bg} border ${colors.border} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RefreshCw className={`w-5 h-5 ${colors.text}`} />
          <span className="text-sm font-medium text-gray-300">{info.label}</span>
        </div>
        <div className={`text-2xl font-bold ${colors.text}`}>{remaining}</div>
      </div>
      <TokenProgressBar percentage={percentage} fillClass={colors.fill} />
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">{info.used} used</span>
        <span className="text-gray-400">Resets this week</span>
      </div>
      {remaining === 0 && <NoResetsAlert />}
      {remaining === 1 && <LastResetAlert />}
      {remaining === info.total && info.used === 0 && <DisciplineAlert />}
    </div>
  );
}
