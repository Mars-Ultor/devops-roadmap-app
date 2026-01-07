/**
 * MasteryLevelCard - Display 4 mastery levels with progress
 * Shows locked/unlocked status, perfect completions, and requirements
 */

import { Lock, CheckCircle } from 'lucide-react';
import type { MasteryLevel, MasteryProgress } from '../../types/training';

interface MasteryLevelCardProps {
  level: MasteryLevel;
  progress: MasteryProgress;
  isActive: boolean;
  onSelect: () => void;
}

const LEVEL_CONFIG = {
  crawl: {
    title: 'Crawl',
    description: 'Step-by-step guided execution',
    color: 'emerald',
    icon: '🐾'
  },
  walk: {
    title: 'Walk',
    description: 'Fill-in-the-blank templates',
    color: 'blue',
    icon: '🚶'
  },
  'run-guided': {
    title: 'Run (Guided)',
    description: 'Conceptual guidance only',
    color: 'purple',
    icon: '🏃'
  },
  'run-independent': {
    title: 'Run (Independent)',
    description: 'Solo execution, objective only',
    color: 'amber',
    icon: '🎯'
  }
} as const;

export default function MasteryLevelCard({
  level,
  progress,
  isActive,
  onSelect
}: MasteryLevelCardProps) {
  const config = LEVEL_CONFIG[level];
  const isMastered = progress.perfectCompletions >= progress.requiredPerfectCompletions;
  const isLocked = !progress.unlocked;

  const getColorClasses = () => {
    if (isLocked) {
      return 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed';
    }
    if (isActive) {
      return `bg-${config.color}-900/30 border-${config.color}-500 ring-2 ring-${config.color}-500`;
    }
    if (isMastered) {
      return `bg-${config.color}-900/20 border-${config.color}-600 hover:border-${config.color}-500`;
    }
    return `bg-slate-800 border-slate-600 hover:border-${config.color}-500`;
  };

  return (
    <button
      onClick={isLocked ? undefined : onSelect}
      disabled={isLocked}
      className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${getColorClasses()}`}
    >
      {/* Lock Icon for Locked Levels */}
      {isLocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-5 h-5 text-slate-500" />
        </div>
      )}

      {/* Mastered Badge */}
      {isMastered && !isLocked && (
        <div className="absolute top-2 right-2">
          <CheckCircle className={`w-5 h-5 text-${config.color}-400`} />
        </div>
      )}

      {/* Level Title */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{config.icon}</span>
        <div className="text-left">
          <h3 className={`text-lg font-bold ${isLocked ? 'text-slate-500' : 'text-white'}`}>
            {config.title}
          </h3>
          <p className={`text-xs ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>
            {config.description}
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      {!isLocked && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Perfect Completions</span>
            <span className={`text-sm font-semibold ${isMastered ? 'text-' + config.color + '-400' : 'text-white'}`}>
              {progress.perfectCompletions}/{progress.requiredPerfectCompletions}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-${config.color}-500 transition-all duration-500`}
              style={{
                width: `${Math.min((progress.perfectCompletions / progress.requiredPerfectCompletions) * 100, 100)}%`
              }}
            />
          </div>

          {/* Attempts */}
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{progress.attempts} attempts</span>
            {(progress.averageTime ?? 0) > 0 && (
              <span>Avg: {Math.round((progress.averageTime ?? 0) / 60)}m</span>
            )}
          </div>
        </div>
      )}

      {/* Locked Message */}
      {isLocked && (
        <div className="mt-3 text-xs text-slate-600 text-center">
          Master previous level to unlock
        </div>
      )}
    </button>
  );
}
