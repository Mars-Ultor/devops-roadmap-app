/**
 * MasteryGate Component
 * Enforces 3 perfect attempts before unlocking next level
 * Phase 2: Hard Mastery Gates
 */

import { Lock, Target, CheckCircle, Trophy, AlertCircle } from 'lucide-react';
import type { MasteryProgress, MasteryLevel } from '../types/training';

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

  const getLevelColor = (level: MasteryLevel) => {
    switch (level) {
      case 'crawl': return 'blue';
      case 'walk': return 'green';
      case 'run-guided': return 'yellow';
      case 'run-independent': return 'purple';
    }
  };

  const color = getLevelColor(level);

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${
        isMastered 
          ? 'bg-green-900/20 border-green-700' 
          : unlocked
          ? 'bg-slate-800 border-slate-600'
          : 'bg-slate-900/50 border-slate-700'
      }`}>
        <div className="flex items-center space-x-3">
          {isMastered ? (
            <Trophy className="w-5 h-5 text-yellow-400" />
          ) : unlocked ? (
            <Target className={`w-5 h-5 text-${color}-400`} />
          ) : (
            <Lock className="w-5 h-5 text-slate-500" />
          )}
          <div>
            <div className="text-sm font-medium text-white">
              {isMastered ? 'Mastered' : `${perfectCompletions}/${requiredPerfectCompletions} Perfect`}
            </div>
            {attempts > 0 && !isMastered && (
              <div className="text-xs text-slate-400">
                {attempts} total attempts
              </div>
            )}
          </div>
        </div>
        
        {!isMastered && (
          <div className="flex space-x-1">
            {[...Array(requiredPerfectCompletions)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < perfectCompletions
                    ? `bg-${color}-400`
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        )}
      </div>
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {isMastered ? (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
          ) : unlocked ? (
            <div className={`w-12 h-12 rounded-full bg-${color}-600 flex items-center justify-center`}>
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

        {isMastered && (
          <CheckCircle className="w-8 h-8 text-green-400" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">Perfect Attempts</span>
          <span className={`text-sm font-bold ${
            isMastered ? 'text-green-400' : `text-${color}-400`
          }`}>
            {perfectCompletions}/{requiredPerfectCompletions}
          </span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isMastered ? 'bg-green-500' : `bg-${color}-500`
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Attempt Indicators */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[...Array(requiredPerfectCompletions)].map((_, i) => (
          <div
            key={i}
            className={`flex items-center justify-center p-3 rounded-lg border ${
              i < perfectCompletions
                ? isMastered
                  ? 'bg-green-900/40 border-green-600'
                  : `bg-${color}-900/40 border-${color}-600`
                : 'bg-slate-800 border-slate-700'
            }`}
          >
            {i < perfectCompletions ? (
              <CheckCircle className={`w-6 h-6 ${
                isMastered ? 'text-green-400' : `text-${color}-400`
              }`} />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-600" />
            )}
            <span className="ml-2 text-sm font-medium text-slate-300">
              Attempt {i + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t border-slate-700">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{attempts}</div>
          <div className="text-xs text-slate-400">Total Attempts</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isMastered ? 'text-green-400' : `text-${color}-400`
          }`}>
            {perfectCompletions}
          </div>
          <div className="text-xs text-slate-400">Perfect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">{failedAttempts}</div>
          <div className="text-xs text-slate-400">Failed</div>
        </div>
      </div>

      {/* Status Message */}
      {!isMastered && unlocked && (
        <div className={`bg-${color}-900/20 border border-${color}-700/50 rounded-lg p-4`}>
          <div className="flex items-start space-x-3">
            <AlertCircle className={`w-5 h-5 text-${color}-400 flex-shrink-0 mt-0.5`} />
            <div>
              <p className={`text-${color}-300 text-sm font-medium mb-1`}>
                {requiredPerfectCompletions - perfectCompletions === 1 
                  ? 'One more perfect completion needed!'
                  : `${requiredPerfectCompletions - perfectCompletions} perfect completions needed`
                }
              </p>
              <p className="text-slate-400 text-xs">
                Complete this level perfectly {requiredPerfectCompletions - perfectCompletions} more {
                  requiredPerfectCompletions - perfectCompletions === 1 ? 'time' : 'times'
                } to unlock {nextLevelName || 'the next level'}.
              </p>
            </div>
          </div>
        </div>
      )}

      {isMastered && nextLevelName && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <p className="text-green-300 text-sm font-medium">
              {nextLevelName} is now unlocked! Ready for the next challenge.
            </p>
          </div>
        </div>
      )}

      {!unlocked && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-slate-400" />
            <p className="text-slate-400 text-sm">
              This level is locked. Master the previous level first.
            </p>
          </div>
        </div>
      )}

      {/* Perfect Attempt Requirements */}
      {!isMastered && unlocked && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">
            What counts as "perfect"?
          </h4>
          <ul className="space-y-1 text-xs text-slate-400">
            <li className="flex items-start">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Complete all objectives without errors</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>No hints used (for Walk and Run levels)</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>All validation checks passed</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-3 h-3 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>AAR completed with quality responses</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
