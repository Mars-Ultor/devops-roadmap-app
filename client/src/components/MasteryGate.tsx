/**
 * MasteryGate Component
 * Enforces 3 perfect attempts before unlocking next level
 * Phase 2: Hard Mastery Gates
 */

import type { MasteryProgress, MasteryLevel } from '../types/training';
import { getLevelColor } from './mastery-gate/masteryGateUtils';
import {
  MasteryGateCompact,
  MasteryGateHeader,
  MasteryProgressBar,
  AttemptIndicators,
  MasteryStatistics,
  StatusMessages,
  PerfectRequirements
} from './mastery-gate/MasteryGateComponents';

interface MasteryGateProps {
  level: MasteryLevel;
  progress: MasteryProgress;
  nextLevelName?: string;
  compact?: boolean;
}

export default function MasteryGate({ level, progress, nextLevelName, compact = false }: MasteryGateProps) {
  const { attempts, perfectCompletions, requiredPerfectCompletions, unlocked } = progress;
  
  const isMastered = perfectCompletions >= requiredPerfectCompletions;
  const failedAttempts = attempts - perfectCompletions;
  const progressPercentage = (perfectCompletions / requiredPerfectCompletions) * 100;
  const color = getLevelColor(level);

  if (compact) {
    return (
      <MasteryGateCompact
        isMastered={isMastered}
        unlocked={unlocked}
        perfectCompletions={perfectCompletions}
        requiredPerfectCompletions={requiredPerfectCompletions}
        attempts={attempts}
        color={color}
      />
    );
  }

  return (
    <div className={`rounded-lg border p-6 ${
      isMastered 
        ? 'bg-green-900/20 border-green-700' 
        : unlocked
        ? `bg-${color}-900/10 border-${color}-700/30`
        : 'bg-slate-900/50 border-slate-700'
    }`}>
      <MasteryGateHeader
        isMastered={isMastered}
        unlocked={unlocked}
        color={color}
        perfectCompletions={perfectCompletions}
        requiredPerfectCompletions={requiredPerfectCompletions}
      />

      <MasteryProgressBar
        isMastered={isMastered}
        color={color}
        perfectCompletions={perfectCompletions}
        requiredPerfectCompletions={requiredPerfectCompletions}
        progressPercentage={progressPercentage}
      />

      <AttemptIndicators
        isMastered={isMastered}
        color={color}
        perfectCompletions={perfectCompletions}
        requiredPerfectCompletions={requiredPerfectCompletions}
      />

      <MasteryStatistics
        isMastered={isMastered}
        color={color}
        attempts={attempts}
        perfectCompletions={perfectCompletions}
        failedAttempts={failedAttempts}
      />

      <StatusMessages
        isMastered={isMastered}
        unlocked={unlocked}
        color={color}
        perfectCompletions={perfectCompletions}
        requiredPerfectCompletions={requiredPerfectCompletions}
        nextLevelName={nextLevelName}
      />

      <PerfectRequirements
        isMastered={isMastered}
        unlocked={unlocked}
      />
    </div>
  );
}
