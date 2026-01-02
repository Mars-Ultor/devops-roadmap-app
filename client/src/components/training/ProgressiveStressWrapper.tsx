/**
 * Progressive Stress System
 * Weeks 1-4: Comfort, Weeks 5-8: Moderate Pressure, Weeks 9-12: Realistic Conditions
 */

import { type FC, useState, useEffect } from 'react';
import { Clock, Copy, AlertTriangle, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface StressConstraints {
  week: number;
  timeLimit?: number; // minutes, undefined = unlimited
  copyPasteDisabled: boolean;
  documentationLevel: 'full' | 'core' | 'minimal';
  distractionsEnabled: boolean;
  externalResourcesAllowed: boolean;
  maxExternalResearchMinutes?: number;
}

interface ProgressiveStressWrapperProps {
  children: React.ReactNode;
  contentType: 'lesson' | 'lab' | 'quiz';
  estimatedTime: number; // base time in minutes
  onTimeExpired?: () => void;
}

export const ProgressiveStressWrapper: FC<ProgressiveStressWrapperProps> = ({
  children,
  contentType,
  estimatedTime,
  onTimeExpired
}) => {
  const { user } = useAuthStore();
  const [constraints, setConstraints] = useState<StressConstraints | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showDistraction, setShowDistraction] = useState(false);
  const [copyAttempts, setCopyAttempts] = useState(0);

  useEffect(() => {
    if (user) {
      const weekConstraints = getConstraintsForWeek(user.currentWeek, estimatedTime);
      setConstraints(weekConstraints);
      
      if (weekConstraints.timeLimit) {
        setTimeRemaining(weekConstraints.timeLimit * 60); // convert to seconds
      }
    }
  }, [user, estimatedTime]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          onTimeExpired?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  // Random distractions for weeks 9-12
  useEffect(() => {
    if (!constraints?.distractionsEnabled) return;

    const showRandomDistraction = () => {
      setShowDistraction(true);
      setTimeout(() => setShowDistraction(false), 5000);
    };

    // Random interval between 5-15 minutes
    const interval = (5 + Math.random() * 10) * 60 * 1000;
    const timer = setInterval(showRandomDistraction, interval);

    return () => clearInterval(timer);
  }, [constraints]);

  // Block copy-paste for weeks 9-12
  useEffect(() => {
    if (!constraints?.copyPasteDisabled) return;

    const preventCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      setCopyAttempts(prev => prev + 1);
    };

    const preventPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setCopyAttempts(prev => prev + 1);
    };

    document.addEventListener('copy', preventCopy);
    document.addEventListener('paste', preventPaste);

    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('paste', preventPaste);
    };
  }, [constraints]);

  if (!constraints) return <>{children}</>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timeRemaining) return 'text-slate-400';
    const percentRemaining = timeRemaining / (constraints.timeLimit! * 60);
    if (percentRemaining > 0.5) return 'text-emerald-400';
    if (percentRemaining > 0.2) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="relative">
      {/* Constraints Banner */}
      <div className="bg-slate-800 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-semibold mb-2">
              Week {constraints.week} Training Constraints
            </h3>
            <div className="space-y-1 text-sm text-slate-300">
              {constraints.timeLimit && (
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Limit: {constraints.timeLimit} minutes
                </p>
              )}
              {constraints.copyPasteDisabled && (
                <p className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copy/Paste: Disabled (type all commands)
                </p>
              )}
              <p>
                Documentation: <span className="text-amber-300">{constraints.documentationLevel}</span>
              </p>
              {constraints.externalResourcesAllowed && constraints.maxExternalResearchMinutes && (
                <p>External research limited to {constraints.maxExternalResearchMinutes} minutes</p>
              )}
              {constraints.distractionsEnabled && (
                <p className="flex items-center gap-2 text-amber-300">
                  <AlertTriangle className="w-4 h-4" />
                  Simulated distractions active (realistic conditions)
                </p>
              )}
            </div>
          </div>

          {/* Timer Display */}
          {timeRemaining !== null && (
            <div className="text-right">
              <div className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {timeRemaining === 0 ? 'Time Expired' : 'Remaining'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Copy/Paste Warning */}
      {copyAttempts > 0 && constraints.copyPasteDisabled && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-300">
            <strong>Copy/Paste Disabled.</strong> You've attempted {copyAttempts} times. 
            Type all commands manually to build muscle memory.
          </p>
        </div>
      )}

      {/* Random Distraction Notification */}
      {showDistraction && (
        <div className="fixed top-20 right-4 z-50 bg-amber-900 border border-amber-500 rounded-lg p-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-amber-300" />
            <div>
              <p className="text-white font-semibold">Production Alert</p>
              <p className="text-sm text-amber-200">
                {getRandomDistraction()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Time Expired Overlay */}
      {timeRemaining === 0 && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-slate-800 border border-red-500 rounded-lg p-8 max-w-md text-center">
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Time Expired</h2>
            <p className="text-slate-300 mb-6">
              You've reached the {constraints.timeLimit}-minute time limit for this {contentType}. 
              In production, deadlines matter. Work on improving your speed.
            </p>
            <button
              onClick={() => setTimeRemaining(null)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {children}
    </div>
  );
};

/**
 * Get stress constraints based on current week
 */
function getConstraintsForWeek(week: number, baseTime: number): StressConstraints {
  // Weeks 1-4: Comfort Zone
  if (week <= 4) {
    return {
      week,
      timeLimit: undefined, // unlimited
      copyPasteDisabled: false,
      documentationLevel: 'full',
      distractionsEnabled: false,
      externalResourcesAllowed: true,
      maxExternalResearchMinutes: undefined
    };
  }
  
  // Weeks 5-8: Moderate Pressure
  if (week <= 8) {
    return {
      week,
      timeLimit: Math.ceil(baseTime * 1.5), // 50% extra time
      copyPasteDisabled: false,
      documentationLevel: 'core',
      distractionsEnabled: false,
      externalResourcesAllowed: true,
      maxExternalResearchMinutes: 10
    };
  }
  
  // Weeks 9-12: Realistic Conditions
  return {
    week,
    timeLimit: baseTime, // strict time limit
    copyPasteDisabled: true,
    documentationLevel: 'minimal',
    distractionsEnabled: true,
    externalResourcesAllowed: false
  };
}

/**
 * Random production-like distraction messages
 */
function getRandomDistraction(): string {
  const distractions = [
    'Database connection spike detected',
    'API response time degrading',
    'Disk space warning: 85% full',
    'SSL certificate expires in 7 days',
    'Unusual traffic pattern from IP range',
    'Memory usage increasing on prod-server-03',
    'Backup job failed - requires attention',
    'Security scan found 3 medium vulnerabilities'
  ];
  
  return distractions[Math.floor(Math.random() * distractions.length)];
}
