/* eslint-disable max-lines-per-function */
/**
 * StressDashboard Component - Progressive Stress System
 * Unified dashboard showing all active stress constraints and monitoring
 */

import React, { useState, useEffect } from 'react';
import { Zap, Shield, AlertTriangle } from 'lucide-react';
import { ProgressiveStressService } from '../../services/progressiveStress';
import type { StressSession, StressLevel } from '../../types/stress';
import TimerCountdown from './TimerCountdown';
import DocumentationRestrictor from './DocumentationRestrictor';
import CopyPasteBlocker from './CopyPasteBlocker';
import DistractionSimulator from './DistractionSimulator';
import MultiTaskMonitor from './MultiTaskMonitor';

interface StressDashboardProps {
  sessionId: string;
  week: number;
  onSessionEnd?: (passed: boolean) => void;
  className?: string;
}

export const StressDashboard: React.FC<StressDashboardProps> = ({
  sessionId,
  week,
  onSessionEnd,
  className = ''
}) => {
  const [session, setSession] = useState<StressSession | null>(null);
  const [stressLevel, setStressLevel] = useState<StressLevel | null>(null);
  const [isActive, setIsActive] = useState(false);

  const stressService = ProgressiveStressService.getInstance();

  useEffect(() => {
    const currentSession = stressService.getSessionStatus(sessionId);
    if (currentSession) {
      setSession(currentSession);
      setIsActive(true);
      setStressLevel(stressService.getStressLevelForWeek(week));
    }
  }, [sessionId, week, stressService]);

  const handleTimeUp = () => {
    stressService.endStressSession(sessionId, false);
    setIsActive(false);
    onSessionEnd?.(false);
  };

  const handleTimeWarning = (percentage: number) => {
    stressService.recordStressEvent(sessionId, {
      type: 'time_warning',
      message: `Time warning: ${percentage}% remaining`,
      severity: percentage <= 25 ? 'critical' : 'high',
      resolved: false
    });
  };

  const handleAccessBlocked = (url: string) => {
    console.log(`Access blocked: ${url}`);
  };

  const handleActionBlocked = (action: 'copy' | 'paste') => {
    console.log(`${action} blocked`);
  };

  const handleDistractionShown = (distraction: string) => {
    console.log(`Distraction shown: ${distraction}`);
  };

  const handleDistractionDismissed = (distraction: string, timeToDismiss: number) => {
    console.log(`Distraction dismissed: ${distraction} (${timeToDismiss}ms)`);
  };

  const handleTaskCompleted = (taskId: string) => {
    console.log(`Task completed: ${taskId}`);
  };

  const handleAllTasksCompleted = () => {
    console.log('All multi-tasks completed');
  };

  if (!isActive || !session || !stressLevel) {
    return null;
  }

  const getStressIntensity = () => {
    if (week <= 4) return 'minimal';
    if (week <= 8) return 'moderate';
    if (week <= 12) return 'high';
    return 'extreme';
  };

  const getIntensityColor = () => {
    const intensity = getStressIntensity();
    switch (intensity) {
      case 'extreme': return 'text-red-400 border-red-500 bg-red-900/20';
      case 'high': return 'text-orange-400 border-orange-500 bg-orange-900/20';
      case 'moderate': return 'text-yellow-400 border-yellow-500 bg-yellow-900/20';
      default: return 'text-blue-400 border-blue-500 bg-blue-900/20';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Stress Level Header */}
      <div className={`p-4 rounded-lg border-2 ${getIntensityColor()}`}>
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold">
              PROGRESSIVE STRESS: WEEK {week} ({getStressIntensity().toUpperCase()})
            </h3>
            <p className="text-sm opacity-75">
              Military-grade training constraints active
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Time Limit:</span>
            <div className="font-mono">
              {stressLevel.timeLimit ? `${Math.round(stressLevel.timeLimit / 60)} min` : 'None'}
            </div>
          </div>
          <div>
            <span className="text-gray-400">Documentation:</span>
            <div className="font-mono">{stressLevel.documentation.toUpperCase()}</div>
          </div>
          <div>
            <span className="text-gray-400">Copy/Paste:</span>
            <div className="font-mono">{stressLevel.copyPaste ? 'Allowed' : 'BLOCKED'}</div>
          </div>
          <div>
            <span className="text-gray-400">Multi-Task:</span>
            <div className="font-mono">{stressLevel.simultaneousTasks} tasks</div>
          </div>
        </div>
      </div>

      {/* Timer */}
      {stressLevel.timeLimit && (
        <TimerCountdown
          sessionId={sessionId}
          initialTimeSeconds={stressLevel.timeLimit}
          onTimeUp={handleTimeUp}
          onWarning={handleTimeWarning}
        />
      )}

      {/* Stress Components Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Documentation Restrictor */}
        <DocumentationRestrictor
          sessionId={sessionId}
          onAccessBlocked={handleAccessBlocked}
        />

        {/* Copy/Paste Blocker */}
        <CopyPasteBlocker
          sessionId={sessionId}
          onActionBlocked={handleActionBlocked}
        />

        {/* Multi-Task Monitor */}
        {stressLevel.simultaneousTasks > 1 && (
          <div className="lg:col-span-2">
            <MultiTaskMonitor
              sessionId={sessionId}
              onTaskCompleted={handleTaskCompleted}
              onAllTasksCompleted={handleAllTasksCompleted}
            />
          </div>
        )}
      </div>

      {/* Distraction Simulator */}
      {stressLevel.distractions && (
        <DistractionSimulator
          sessionId={sessionId}
          onDistractionShown={handleDistractionShown}
          onDistractionDismissed={handleDistractionDismissed}
        />
      )}

      {/* Stress Metrics Summary */}
      <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-400">Training Status</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Hints Used:</span>
            <div className="font-mono text-yellow-400">{session.hintsUsed}</div>
          </div>
          <div>
            <span className="text-gray-400">Resets Used:</span>
            <div className="font-mono text-red-400">{session.resetsUsed}</div>
          </div>
          <div>
            <span className="text-gray-400">Stress Events:</span>
            <div className="font-mono text-orange-400">{session.stressEvents.length}</div>
          </div>
          <div>
            <span className="text-gray-400">Time Remaining:</span>
            <div className="font-mono text-green-400">
              {session.timeRemaining ? `${Math.round(session.timeRemaining / 60)} min` : 'N/A'}
            </div>
          </div>
        </div>

        <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/50 rounded">
          <p className="text-xs text-blue-300">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            These constraints build resilience and prepare you for real-world DevOps scenarios
            where time pressure and limited resources are the norm.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StressDashboard;