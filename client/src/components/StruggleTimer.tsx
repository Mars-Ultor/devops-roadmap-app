/**
 * Struggle Timer System - 30-Minute Hint Lockout
 * Forces independent problem-solving before providing hints
 * Phase 3: Time-Boxed Struggle
 */

import { useState, useEffect } from 'react';
import { Lock, Unlock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface StruggleTimerProps {
  startTime: number;
  onHintUnlocked: () => void;
  onStruggleLogged: (struggles: StruggleLog) => void;
  currentTime?: number; // For testing
}

export interface StruggleLog {
  attemptedSolutions: string[];
  stuckPoint: string;
  hypothesis: string;
  submittedAt: Date;
}

const HINT_UNLOCK_TIME = 30 * 60 * 1000; // 30 minutes

export default function StruggleTimer({ 
  startTime, 
  onHintUnlocked,
  onStruggleLogged,
  currentTime
}: StruggleTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [hintsUnlocked, setHintsUnlocked] = useState(false);
  const [strugglesLogged, setStrugglesLogged] = useState(false);
  const [showStruggleForm, setShowStruggleForm] = useState(false);
  const [struggles, setStruggles] = useState<Partial<StruggleLog>>({
    attemptedSolutions: ['', '', ''],
    stuckPoint: '',
    hypothesis: ''
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = currentTime || Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, HINT_UNLOCK_TIME - elapsed);
      setTimeRemaining(remaining);

      if (remaining === 0 && !hintsUnlocked && strugglesLogged) {
        setHintsUnlocked(true);
        onHintUnlocked();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startTime, hintsUnlocked, strugglesLogged, onHintUnlocked, currentTime]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStruggleSubmit = () => {
    // Validate all fields
    const allSolutionsFilled = struggles.attemptedSolutions?.every(s => s && s.trim().length > 0);
    const stuckPointFilled = struggles.stuckPoint && struggles.stuckPoint.trim().length >= 20;
    const hypothesisFilled = struggles.hypothesis && struggles.hypothesis.trim().length >= 20;

    if (!allSolutionsFilled) {
      alert('Please list at least 3 things you tried');
      return;
    }

    if (!stuckPointFilled) {
      alert('Please describe where you\'re stuck (minimum 20 characters)');
      return;
    }

    if (!hypothesisFilled) {
      alert('Please provide your hypothesis about the problem (minimum 20 characters)');
      return;
    }

    const log: StruggleLog = {
      attemptedSolutions: struggles.attemptedSolutions!,
      stuckPoint: struggles.stuckPoint!,
      hypothesis: struggles.hypothesis!,
      submittedAt: new Date()
    };

    setStrugglesLogged(true);
    setShowStruggleForm(false);
    onStruggleLogged(log);
  };

  const updateAttempt = (index: number, value: string) => {
    const newAttempts = [...(struggles.attemptedSolutions || ['', '', ''])];
    newAttempts[index] = value;
    setStruggles({ ...struggles, attemptedSolutions: newAttempts });
  };

  if (hintsUnlocked) {
    return (
      <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Unlock className="w-6 h-6 text-green-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-white">Hints Available</h3>
            <p className="text-green-300 text-sm">
              You've earned access to hints after struggling independently. Remember: each hint comes with a 5-minute cooldown.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg mb-6">
      {/* Timer Display */}
      <div className="p-4 border-b border-yellow-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lock className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-white">Struggle Session Active</h3>
              <p className="text-yellow-300 text-sm">
                Hints unlock in: <span className="font-mono font-bold text-yellow-400">{formatTime(timeRemaining)}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-yellow-400">
              {strugglesLogged ? (
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Struggles logged
                </span>
              ) : (
                <span className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Documentation required
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="p-4 bg-slate-800/50 border-b border-yellow-700">
        <h4 className="text-white font-semibold mb-2">Why the wait?</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            <span><strong className="text-white">Independent Problem-Solving:</strong> Real DevOps requires working without immediate help</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            <span><strong className="text-white">Deeper Learning:</strong> Struggling builds neural pathways that hints bypass</span>
          </li>
          <li className="flex items-start">
            <span className="text-yellow-400 mr-2">•</span>
            <span><strong className="text-white">Document Your Process:</strong> Writing down attempts clarifies thinking</span>
          </li>
        </ul>
      </div>

      {/* Struggle Documentation Button/Form */}
      {!strugglesLogged && !showStruggleForm && (
        <div className="p-4">
          <button
            onClick={() => setShowStruggleForm(true)}
            className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            Document Your Struggle (Required)
          </button>
          <p className="text-center text-slate-400 text-xs mt-2">
            Must document attempts before hints unlock
          </p>
        </div>
      )}

      {showStruggleForm && !strugglesLogged && (
        <div className="p-6 bg-slate-800/50 space-y-4">
          <h4 className="text-white font-semibold mb-3">Document Your Struggle</h4>
          
          {/* Attempted Solutions */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What have you tried? (Minimum 3 things)
            </label>
            {[0, 1, 2].map(i => (
              <input
                key={i}
                type="text"
                value={struggles.attemptedSolutions?.[i] || ''}
                onChange={(e) => updateAttempt(i, e.target.value)}
                placeholder={`Attempt ${i + 1}: e.g., "Checked logs", "Restarted service", "Verified config"`}
                className="w-full px-4 py-2 mb-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            ))}
          </div>

          {/* Stuck Point */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Where are you stuck? (Be specific)
            </label>
            <textarea
              value={struggles.stuckPoint || ''}
              onChange={(e) => setStruggles({ ...struggles, stuckPoint: e.target.value })}
              placeholder="Describe the exact error, behavior, or roadblock you're facing..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              {struggles.stuckPoint?.length || 0}/20 characters minimum
            </p>
          </div>

          {/* Hypothesis */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What might be the problem?
            </label>
            <textarea
              value={struggles.hypothesis || ''}
              onChange={(e) => setStruggles({ ...struggles, hypothesis: e.target.value })}
              placeholder="Your best guess about what's causing the issue and why..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
              required
            />
            <p className="text-xs text-slate-400 mt-1">
              {struggles.hypothesis?.length || 0}/20 characters minimum
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowStruggleForm(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleStruggleSubmit}
              className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all"
            >
              Submit Documentation
            </button>
          </div>
        </div>
      )}

      {strugglesLogged && (
        <div className="p-4 bg-green-900/20">
          <div className="flex items-center text-green-400">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">Struggles documented. Hints will unlock when timer reaches 0:00</span>
          </div>
        </div>
      )}
    </div>
  );
}
