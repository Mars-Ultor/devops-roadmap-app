import React from 'react';
import { Lock, Target, CheckCircle, Trophy, AlertCircle } from 'lucide-react';
import { getDotClass, getAttemptClass, getColorClass } from './masteryGateUtils';

// Compact View Component
interface CompactViewProps {
  isMastered: boolean;
  unlocked: boolean;
  perfectCompletions: number;
  requiredPerfectCompletions: number;
  attempts: number;
  color: string;
}

export const MasteryGateCompact: React.FC<CompactViewProps> = ({
  isMastered,
  unlocked,
  perfectCompletions,
  requiredPerfectCompletions,
  attempts,
  color
}) => {
  const containerClass = isMastered 
    ? 'bg-green-900/20 border-green-700' 
    : unlocked ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-700';
  
  const targetClass = `w-5 h-5 text-${color}-400`;

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${containerClass}`}>
      <div className="flex items-center space-x-3">
        {isMastered ? (
          <Trophy className="w-5 h-5 text-yellow-400" />
        ) : unlocked ? (
          <Target className={targetClass} />
        ) : (
          <Lock className="w-5 h-5 text-slate-500" />
        )}
        <div>
          <div className="text-sm font-medium text-white">
            {isMastered ? 'Mastered' : `${perfectCompletions}/${requiredPerfectCompletions} Perfect`}
          </div>
          {attempts > 0 && !isMastered && (
            <div className="text-xs text-slate-400">{attempts} total attempts</div>
          )}
        </div>
      </div>
      
      {!isMastered && (
        <div className="flex space-x-1">
          {[...Array(requiredPerfectCompletions)].map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${getDotClass(i, perfectCompletions, color)}`} />
          ))}
        </div>
      )}
    </div>
  );
};

// Header Section
interface HeaderProps {
  isMastered: boolean;
  unlocked: boolean;
  color: string;
  perfectCompletions: number;
  requiredPerfectCompletions: number;
}

export const MasteryGateHeader: React.FC<HeaderProps> = ({
  isMastered,
  unlocked,
  color,
  perfectCompletions,
  requiredPerfectCompletions
}) => {
  const iconContainerClass = `w-12 h-12 rounded-full bg-${color}-600 flex items-center justify-center`;

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-3">
        {isMastered ? (
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-400" />
          </div>
        ) : unlocked ? (
          <div className={iconContainerClass}>
            <Target className="w-6 h-6 text-white" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-white">
            {isMastered ? 'Level Mastered!' : 'Mastery Progress'}
          </h3>
          <p className={`text-sm ${isMastered ? 'text-green-300' : 'text-slate-400'}`}>
            {isMastered 
              ? `Achieved ${requiredPerfectCompletions} perfect completions`
              : `${perfectCompletions} of ${requiredPerfectCompletions} perfect completions`
            }
          </p>
        </div>
      </div>

      {isMastered && <CheckCircle className="w-8 h-8 text-green-400" />}
    </div>
  );
};

// Progress Bar
interface ProgressBarProps {
  isMastered: boolean;
  color: string;
  perfectCompletions: number;
  requiredPerfectCompletions: number;
  progressPercentage: number;
}

export const MasteryProgressBar: React.FC<ProgressBarProps> = ({
  isMastered,
  color,
  perfectCompletions,
  requiredPerfectCompletions,
  progressPercentage
}) => {
  const textClass = getColorClass(isMastered, color, 'text');
  const barClass = getColorClass(isMastered, color, 'bg');

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-300">Perfect Attempts</span>
        <span className={`text-sm font-bold ${textClass}`}>
          {perfectCompletions}/{requiredPerfectCompletions}
        </span>
      </div>
      
      <div className="w-full bg-slate-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${barClass}`}
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
    </div>
  );
};

// Attempt Indicators
interface AttemptIndicatorsProps {
  isMastered: boolean;
  color: string;
  perfectCompletions: number;
  requiredPerfectCompletions: number;
}

export const AttemptIndicators: React.FC<AttemptIndicatorsProps> = ({
  isMastered,
  color,
  perfectCompletions,
  requiredPerfectCompletions
}) => (
  <div className="grid grid-cols-3 gap-2 mb-4">
    {[...Array(requiredPerfectCompletions)].map((_, i) => {
      const indicatorClass = getAttemptClass(i, perfectCompletions, isMastered, color);
      const iconClass = getColorClass(isMastered, color, 'text');
      
      return (
        <div key={i} className={`flex items-center justify-center p-3 rounded-lg border ${indicatorClass}`}>
          {i < perfectCompletions ? (
            <CheckCircle className={`w-6 h-6 ${iconClass}`} />
          ) : (
            <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
          )}
          <span className="ml-2 text-sm font-medium text-slate-300">Attempt {i + 1}</span>
        </div>
      );
    })}
  </div>
);

// Statistics
interface StatisticsProps {
  isMastered: boolean;
  color: string;
  attempts: number;
  perfectCompletions: number;
  failedAttempts: number;
}

export const MasteryStatistics: React.FC<StatisticsProps> = ({
  isMastered,
  color,
  attempts,
  perfectCompletions,
  failedAttempts
}) => {
  const perfectClass = getColorClass(isMastered, color, 'text');

  return (
    <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-slate-700">
      <div className="text-center">
        <div className="text-2xl font-bold text-white">{attempts}</div>
        <div className="text-xs text-slate-400">Total Attempts</div>
      </div>
      <div className="text-center">
        <div className={`text-2xl font-bold ${perfectClass}`}>{perfectCompletions}</div>
        <div className="text-xs text-slate-400">Perfect</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-red-400">{failedAttempts}</div>
        <div className="text-xs text-slate-400">Failed</div>
      </div>
    </div>
  );
};

// Status Messages
interface StatusMessageProps {
  isMastered: boolean;
  unlocked: boolean;
  color: string;
  perfectCompletions: number;
  requiredPerfectCompletions: number;
  nextLevelName?: string;
}

export const StatusMessages: React.FC<StatusMessageProps> = ({
  isMastered,
  unlocked,
  color,
  perfectCompletions,
  requiredPerfectCompletions,
  nextLevelName
}) => {
  const remaining = requiredPerfectCompletions - perfectCompletions;
  const containerClass = `bg-${color}-900/20 border border-${color}-700/50 rounded-lg p-4`;
  const alertClass = `w-5 h-5 text-${color}-400 flex-shrink-0 mt-0.5`;
  const textClass = `text-${color}-300 text-sm font-medium mb-1`;

  if (!isMastered && unlocked) {
    return (
      <div className={containerClass}>
        <div className="flex items-start space-x-3">
          <AlertCircle className={alertClass} />
          <div>
            <p className={textClass}>
              {remaining === 1 ? 'One more perfect completion needed!' : `${remaining} perfect completions needed`}
            </p>
            <p className="text-slate-400 text-xs">
              Complete this level perfectly {remaining} more {remaining === 1 ? 'time' : 'times'} to unlock {nextLevelName || 'the next level'}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isMastered && nextLevelName) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <p className="text-green-300 text-sm font-medium">
            {nextLevelName} is now unlocked! Ready for the next challenge.
          </p>
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Lock className="w-5 h-5 text-slate-400" />
          <p className="text-slate-400 text-sm">This level is locked. Master the previous level first.</p>
        </div>
      </div>
    );
  }

  return null;
};

// Perfect Requirements Info
interface PerfectRequirementsProps {
  isMastered: boolean;
  unlocked: boolean;
}

export const PerfectRequirements: React.FC<PerfectRequirementsProps> = ({ isMastered, unlocked }) => {
  if (isMastered || !unlocked) return null;

  const requirements = [
    'Complete all objectives without errors',
    'No hints used (for Walk and Run levels)',
    'All validation checks passed',
    'AAR completed with quality responses'
  ];

  return (
    <div className="mt-4 pt-4 border-t border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">What counts as "perfect"?</h4>
      <ul className="space-y-1 text-xs text-slate-400">
        {requirements.map((req, idx) => (
          <li key={idx} className="flex items-start">
            <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span>{req}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
