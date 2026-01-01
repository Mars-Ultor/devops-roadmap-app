/**
 * Stress Session Panel Component
 * Live session UI with physiological metrics
 */

import { useEffect, useState } from 'react';
import { Activity, Brain, Clock, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import type { StressTrainingSession } from '../../types/training';

interface StressSessionPanelProps {
  session: StressTrainingSession;
}

export function StressSessionPanel({ session }: StressSessionPanelProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startedAt]);

  const remainingSeconds = session.scenario.duration - elapsedSeconds;
  const timeProgress = (elapsedSeconds / session.scenario.duration) * 100;
  const isTimeWarning = timeProgress >= 75;
  const isTimeCritical = timeProgress >= 90;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const sign = seconds < 0 ? '-' : '';
    return `${sign}${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStressColor = (score: number): string => {
    if (score >= 80) return 'text-red-400';
    if (score >= 60) return 'text-orange-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getFocusColor = (level: number): string => {
    if (level >= 70) return 'text-green-400';
    if (level >= 50) return 'text-yellow-400';
    if (level >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      {/* Scenario Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{session.scenario.title}</h2>
        <p className="text-gray-300">{session.scenario.description}</p>
      </div>

      {/* Physiological Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {/* Stress Score */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Stress</span>
          </div>
          <div className={`text-3xl font-bold ${getStressColor(session.stressScore)}`}>
            {Math.round(session.stressScore)}
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                session.stressScore >= 80 ? 'bg-red-500' :
                session.stressScore >= 60 ? 'bg-orange-500' :
                session.stressScore >= 40 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${session.stressScore}%` }}
            />
          </div>
        </div>

        {/* Fatigue Level */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Fatigue</span>
          </div>
          <div className="text-3xl font-bold text-gray-300">
            {Math.round(session.fatigueLevel)}
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gray-500 transition-all duration-300"
              style={{ width: `${session.fatigueLevel}%` }}
            />
          </div>
        </div>

        {/* Focus Level */}
        <div className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Focus</span>
          </div>
          <div className={`text-3xl font-bold ${getFocusColor(session.focusLevel)}`}>
            {Math.round(session.focusLevel)}
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                session.focusLevel >= 70 ? 'bg-green-500' :
                session.focusLevel >= 50 ? 'bg-yellow-500' :
                session.focusLevel >= 30 ? 'bg-orange-500' :
                'bg-red-500'
              }`}
              style={{ width: `${session.focusLevel}%` }}
            />
          </div>
        </div>

        {/* Time Remaining */}
        <div className={`bg-gray-900/50 rounded-lg p-4 ${isTimeCritical ? 'ring-2 ring-red-500 animate-pulse' : isTimeWarning ? 'ring-2 ring-yellow-500' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Time Left</span>
          </div>
          <div className={`text-3xl font-bold ${
            isTimeCritical ? 'text-red-400' :
            isTimeWarning ? 'text-yellow-400' :
            'text-gray-300'
          }`}>
            {formatTime(remainingSeconds)}
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                isTimeCritical ? 'bg-red-500' :
                isTimeWarning ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, timeProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Active Conditions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">ACTIVE CONDITIONS</h3>
        <div className="grid grid-cols-2 gap-3">
          {session.scenario.conditions.map((condition, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-gray-900/30 rounded border border-gray-700"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white mb-1">
                  {condition.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div className="text-xs text-gray-400">{condition.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Criteria */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">SUCCESS CRITERIA</h3>
        <div className="space-y-2">
          {session.scenario.successCriteria.map((criterion, index) => {
            const isComplete = index < session.tasksCompleted;
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded ${
                  isComplete ? 'bg-green-900/20 border border-green-700' : 'bg-gray-900/30 border border-gray-700'
                }`}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
                )}
                <span className={`text-sm ${isComplete ? 'text-green-300 line-through' : 'text-gray-300'}`}>
                  {criterion}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-sm font-semibold text-white">
            {session.tasksCompleted} / {session.totalTasks} Complete
          </span>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(session.tasksCompleted / session.totalTasks) * 100}%` }}
          />
        </div>
        {session.errorsCount > 0 && (
          <div className="mt-2 text-xs text-orange-400">
            ⚠️ {session.errorsCount} error{session.errorsCount !== 1 ? 's' : ''} encountered
          </div>
        )}
      </div>

      {/* Warning Messages */}
      {isTimeWarning && !isTimeCritical && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">TIME WARNING: Less than 25% time remaining</span>
          </div>
        </div>
      )}

      {isTimeCritical && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">CRITICAL: Less than 10% time remaining!</span>
          </div>
        </div>
      )}
    </div>
  );
}
