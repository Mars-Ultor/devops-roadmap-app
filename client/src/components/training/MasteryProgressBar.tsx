/**
 * MasteryProgressBar - Horizontal progress indicator for all 4 levels
 * Shows overall mastery journey at a glance
 */

import { CheckCircle, Lock } from 'lucide-react';
import type { LessonMastery } from '../../types/training';

interface MasteryProgressBarProps {
  mastery: LessonMastery;
  compact?: boolean;
}

export default function MasteryProgressBar({ mastery, compact = false }: MasteryProgressBarProps) {
  const levels = [
    { key: 'crawl', label: 'Crawl', icon: '🐾' },
    { key: 'walk', label: 'Walk', icon: '🚶' },
    { key: 'run-guided', label: 'Run (G)', icon: '🏃' },
    { key: 'run-independent', label: 'Run (I)', icon: '🎯' }
  ] as const;

  const getLevelStatus = (levelKey: typeof levels[number]['key']) => {
    const mappedKey = levelKey === 'run-guided' ? 'runGuided' : levelKey === 'run-independent' ? 'runIndependent' : levelKey;
    const levelData = mastery[mappedKey as 'crawl' | 'walk' | 'runGuided' | 'runIndependent'];
    const isMastered = levelData.perfectCompletions >= levelData.requiredPerfectCompletions;
    const isUnlocked = levelData.unlocked;
    
    return { isMastered, isUnlocked, data: levelData };
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {levels.map(({ key, icon }) => {
          const { isMastered, isUnlocked } = getLevelStatus(key);
          
          return (
            <div
              key={key}
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                isMastered
                  ? 'bg-emerald-500 border-emerald-400'
                  : isUnlocked
                  ? 'bg-slate-700 border-slate-500'
                  : 'bg-slate-800 border-slate-700 opacity-40'
              }`}
              title={`${key}: ${isMastered ? 'Mastered' : isUnlocked ? 'In Progress' : 'Locked'}`}
            >
              {isMastered ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : isUnlocked ? (
                <span className="text-xs">{icon}</span>
              ) : (
                <Lock className="w-3 h-3 text-slate-600" />
              )}
            </div>
          );
        })}
        {mastery.fullyMastered && (
          <span className="ml-2 text-xs font-semibold text-emerald-400">
            ✓ Mastered
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-slate-300">Mastery Progress</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {levels.map(({ key, label, icon }) => {
          const { isMastered, isUnlocked, data } = getLevelStatus(key);
          
          return (
            <div key={key} className="text-center">
              <div
                className={`mx-auto w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all ${
                  isMastered
                    ? 'bg-emerald-500 border-emerald-400'
                    : isUnlocked
                    ? 'bg-slate-700 border-slate-500'
                    : 'bg-slate-800 border-slate-700 opacity-40'
                }`}
              >
                {isMastered ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : isUnlocked ? (
                  <span className="text-xl">{icon}</span>
                ) : (
                  <Lock className="w-5 h-5 text-slate-600" />
                )}
              </div>
              
              <div className={`text-xs font-medium ${isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                {label}
              </div>
              
              {isUnlocked && (
                <div className="text-xs text-slate-400 mt-1">
                  {data.perfectCompletions}/{data.requiredPerfectCompletions}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Overall Mastery</span>
          <span className="text-xs text-white font-semibold">
            {Math.round(
              ((mastery.crawl.perfectCompletions >= mastery.crawl.requiredPerfectCompletions ? 1 : 0) +
                (mastery.walk.perfectCompletions >= mastery.walk.requiredPerfectCompletions ? 1 : 0) +
                (mastery.runGuided.perfectCompletions >= mastery.runGuided.requiredPerfectCompletions ? 1 : 0) +
                (mastery.runIndependent.perfectCompletions >= mastery.runIndependent.requiredPerfectCompletions ? 1 : 0)) *
                25
            )}%
          </span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${
                ((mastery.crawl.perfectCompletions >= mastery.crawl.requiredPerfectCompletions ? 1 : 0) +
                  (mastery.walk.perfectCompletions >= mastery.walk.requiredPerfectCompletions ? 1 : 0) +
                  (mastery.runGuided.perfectCompletions >= mastery.runGuided.requiredPerfectCompletions ? 1 : 0) +
                  (mastery.runIndependent.perfectCompletions >= mastery.runIndependent.requiredPerfectCompletions ? 1 : 0)) *
                25
              }%`
            }}
          />
        </div>
      </div>
    </div>
  );
}
