/* eslint-disable max-lines-per-function */
/**
 * DistractionSimulator Component - Progressive Stress System
 * Simulates real-world distractions during training sessions
 */

import React, { useState, useEffect } from 'react';
import { Bell, X, AlertCircle, MessageSquare, Phone, Calendar, Users } from 'lucide-react';
import { ProgressiveStressService } from '../../services/progressiveStress';
import { STRESS_CONFIG } from '../../types/stress';

interface DistractionSimulatorProps {
  sessionId: string;
  onDistractionShown?: (distraction: string) => void;
  onDistractionDismissed?: (distraction: string, timeToDismiss: number) => void;
  className?: string;
}

export const DistractionSimulator: React.FC<DistractionSimulatorProps> = ({
  sessionId,
  onDistractionShown,
  onDistractionDismissed,
  className = ''
}) => {
  const [currentDistraction, setCurrentDistraction] = useState<string | null>(null);
  const [distractionStartTime, setDistractionStartTime] = useState<Date | null>(null);
  const [distractionsHistory, setDistractionsHistory] = useState<Array<{message: string, dismissedAt: Date, timeToDismiss: number}>>([]);
  const [isEnabled, setIsEnabled] = useState(false);

  const stressService = ProgressiveStressService.getInstance();

  useEffect(() => {
    const session = stressService.getSessionStatus(sessionId);
    setIsEnabled(session ? session.distractionsEnabled : false);
  }, [sessionId, stressService]);

  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      if (currentDistraction) return; // Don't show new distraction if one is active

      const distraction = STRESS_CONFIG.distractionTypes[
        Math.floor(Math.random() * STRESS_CONFIG.distractionTypes.length)
      ];

      setCurrentDistraction(distraction);
      setDistractionStartTime(new Date());
      onDistractionShown?.(distraction);

      stressService.recordStressEvent(sessionId, {
        type: 'distraction',
        message: distraction,
        severity: 'medium',
        resolved: false
      });
    }, STRESS_CONFIG.distractionInterval);

    return () => clearInterval(interval);
  }, [isEnabled, currentDistraction, sessionId, onDistractionShown, stressService]);

  const dismissDistraction = () => {
    if (!currentDistraction || !distractionStartTime) return;

    const dismissedAt = new Date();
    const timeToDismiss = dismissedAt.getTime() - distractionStartTime.getTime();

    setDistractionsHistory(prev => [...prev, {
      message: currentDistraction,
      dismissedAt,
      timeToDismiss
    }]);

    onDistractionDismissed?.(currentDistraction, timeToDismiss);
    setCurrentDistraction(null);
    setDistractionStartTime(null);
  };

  const getDistractionIcon = (message: string) => {
    if (message.includes('Email')) return <Bell className="w-5 h-5" />;
    if (message.includes('Slack') || message.includes('message')) return <MessageSquare className="w-5 h-5" />;
    if (message.includes('Phone') || message.includes('call')) return <Phone className="w-5 h-5" />;
    if (message.includes('Calendar') || message.includes('meeting')) return <Calendar className="w-5 h-5" />;
    if (message.includes('Colleague') || message.includes('question')) return <Users className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={className}>
      {/* Active Distraction Modal */}
      {currentDistraction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                {getDistractionIcon(currentDistraction)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-400">INCOMING DISTRACTION</h3>
                <p className="text-sm text-gray-400">Real-world interruption simulation</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/50 rounded p-4 mb-4">
              <p className="text-yellow-100 font-medium">{currentDistraction}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={dismissDistraction}
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors"
              >
                ACKNOWLEDGE & CONTINUE
              </button>
              <button
                onClick={dismissDistraction}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3 text-center">
              Dismiss distractions quickly to maintain training focus
            </p>
          </div>
        </div>
      )}

      {/* Distractions History */}
      {distractionsHistory.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Distraction History ({distractionsHistory.length})
          </h4>

          <div className="max-h-32 overflow-y-auto space-y-1">
            {distractionsHistory.slice(-5).map((distraction, index) => (
              <div key={index} className="flex items-center justify-between text-xs text-gray-400 py-1">
                <span className="truncate flex-1">{distraction.message}</span>
                <span>{Math.round(distraction.timeToDismiss / 1000)}s</span>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500 mt-2">
            Average response time: {Math.round(
              distractionsHistory.reduce((sum, d) => sum + d.timeToDismiss, 0) /
              distractionsHistory.length / 1000
            )}s
          </div>
        </div>
      )}
    </div>
  );
};

export default DistractionSimulator;