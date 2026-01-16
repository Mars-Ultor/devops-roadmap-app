/**
 * Battle Drill Complete Modal Sub-Components
 * Extracted for ESLint compliance
 */

import { CheckCircle, Target, Trophy, TrendingUp } from 'lucide-react';

// Result Header (Passed or Failed)
interface ResultHeaderProps {
  readonly passed: boolean;
}

export function ResultHeader({ passed }: ResultHeaderProps) {
  if (passed) {
    return (
      <>
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Drill Complete!</h2>
      </>
    );
  }
  return (
    <>
      <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Target className="w-12 h-12 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">Drill Ended</h2>
    </>
  );
}

// AAR Required Warning
export function AARRequiredWarning() {
  return (
    <div className="mt-6 bg-indigo-900/30 border border-indigo-600/30 rounded-lg p-4">
      <p className="text-indigo-200 text-sm">⚠️ AAR Required: Complete your After Action Review to proceed</p>
    </div>
  );
}

// Stats Grid
interface StatsGridProps {
  readonly durationSeconds: number;
  readonly targetTimeSeconds: number;
  readonly completedSteps: number;
  readonly totalSteps: number;
  readonly hintsUsed: number;
  readonly beatTarget: boolean;
  readonly formatTime: (seconds: number) => string;
}

export function StatsGrid({ durationSeconds, targetTimeSeconds, completedSteps, totalSteps, hintsUsed, beatTarget, formatTime }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">Your Time</div>
        <div className={`text-2xl font-bold ${beatTarget ? 'text-green-400' : 'text-yellow-400'}`}>{formatTime(durationSeconds)}</div>
      </div>
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">Target Time</div>
        <div className="text-2xl font-bold text-white">{formatTime(targetTimeSeconds)}</div>
      </div>
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">Steps Completed</div>
        <div className="text-2xl font-bold text-white">{completedSteps}/{totalSteps}</div>
      </div>
      <div className="bg-slate-900 rounded-lg p-4">
        <div className="text-slate-400 text-sm mb-1">Hints Used</div>
        <div className="text-2xl font-bold text-white">{hintsUsed}</div>
      </div>
    </div>
  );
}

// Achievement Badges
interface AchievementBadgesProps {
  readonly beatTarget: boolean;
  readonly personalBest: boolean;
}

export function AchievementBadges({ beatTarget, personalBest }: AchievementBadgesProps) {
  return (
    <>
      {beatTarget && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Trophy className="w-5 h-5" /><span className="font-semibold">Beat Target Time!</span>
          </div>
        </div>
      )}
      {personalBest && (
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center gap-2 text-purple-400">
            <TrendingUp className="w-5 h-5" /><span className="font-semibold">New Personal Best!</span>
          </div>
        </div>
      )}
    </>
  );
}

// Action Buttons
interface ActionButtonsProps {
  readonly aarSubmitted: boolean;
  readonly onTryAgain: () => void;
  readonly onBackToDrills: () => void;
  readonly onCompleteAAR: () => void;
}

export function ActionButtons({ aarSubmitted, onTryAgain, onBackToDrills, onCompleteAAR }: ActionButtonsProps) {
  if (aarSubmitted) {
    return (
      <div className="flex gap-3 mt-6">
        <button onClick={onTryAgain} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Try Again</button>
        <button onClick={onBackToDrills} className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">Back to Drills</button>
      </div>
    );
  }
  return (
    <div className="flex gap-3 mt-6">
      <button onClick={onCompleteAAR} className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors">Complete AAR to Proceed</button>
    </div>
  );
}
