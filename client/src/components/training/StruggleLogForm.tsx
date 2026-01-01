/**
 * StruggleLogForm - Mandatory reflection before requesting hints
 */

import { useState } from 'react';
import { BookOpen, AlertCircle } from 'lucide-react';
import type { StruggleLog } from '../../types/training';

interface StruggleLogFormProps {
  onSubmit: (log: StruggleLog) => Promise<void>;
  hintsUnlocked: boolean;
}

export default function StruggleLogForm({ onSubmit, hintsUnlocked }: StruggleLogFormProps) {
  const [attemptedSolutions, setAttemptedSolutions] = useState<string[]>(['', '', '']);
  const [stuckLocation, setStuckLocation] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAttemptChange = (index: number, value: string) => {
    const updated = [...attemptedSolutions];
    updated[index] = value;
    setAttemptedSolutions(updated);
  };

  const handleAddAttempt = () => {
    setAttemptedSolutions([...attemptedSolutions, '']);
  };

  const isValid = () => {
    const validAttempts = attemptedSolutions.filter(a => a.trim().length >= 10).length >= 3;
    const validLocation = stuckLocation.trim().length >= 20;
    const validHypothesis = hypothesis.trim().length >= 30;
    return validAttempts && validLocation && validHypothesis;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid() || !hintsUnlocked) return;

    setSubmitting(true);
    try {
      const log: StruggleLog = {
        attemptedSolutions: attemptedSolutions.filter(a => a.trim()),
        stuckLocation: stuckLocation.trim(),
        hypothesis: hypothesis.trim(),
        createdAt: new Date()
      };

      await onSubmit(log);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting struggle log:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-900/30 border-2 border-green-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-400">
          <BookOpen className="w-8 h-8" />
          <div>
            <h3 className="text-lg font-bold">Struggle Log Submitted</h3>
            <p className="text-sm text-green-300 mt-1">
              Excellent reflection! You can now request progressive hints below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-6">
        <BookOpen className="w-6 h-6 text-indigo-400 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Struggle Log Required</h3>
          <p className="text-slate-300 text-sm">
            Before requesting hints, document your struggle. This reflection deepens learning
            and helps identify patterns in your problem-solving approach.
          </p>
        </div>
      </div>

      {!hintsUnlocked && (
        <div className="mb-6 bg-amber-900/30 border border-amber-600/30 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-100">
              This form will unlock when the 30-minute struggle period is complete.
              Use this time to continue working on the problem.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Attempted Solutions */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Solutions Attempted (minimum 3, at least 10 chars each)
          </label>
          <div className="space-y-3">
            {attemptedSolutions.map((attempt, index) => (
              <div key={index}>
                <textarea
                  value={attempt}
                  onChange={(e) => handleAttemptChange(index, e.target.value)}
                  placeholder={`Attempt ${index + 1}: Describe what you tried and what happened`}
                  disabled={!hintsUnlocked}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={2}
                />
                <div className="text-xs text-slate-500 mt-1">
                  {attempt.trim().length}/10 chars minimum
                </div>
              </div>
            ))}
          </div>
          {attemptedSolutions.length < 5 && hintsUnlocked && (
            <button
              type="button"
              onClick={handleAddAttempt}
              className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Add another attempt
            </button>
          )}
        </div>

        {/* Where Stuck */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Where exactly are you stuck? (minimum 20 chars)
          </label>
          <textarea
            value={stuckLocation}
            onChange={(e) => setStuckLocation(e.target.value)}
            placeholder="Example: I can build the Docker image, but when I run the container, it exits immediately with code 1. The logs show 'Cannot find module express' even though it's in package.json"
            disabled={!hintsUnlocked}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <div className="text-xs text-slate-500 mt-1">
            {stuckLocation.trim().length}/20 chars minimum
          </div>
        </div>

        {/* Hypothesis */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            What do you think is causing the issue? (minimum 30 chars)
          </label>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="Example: I think the issue is that npm dependencies aren't being installed during the Docker build. The package.json might not be copied before RUN npm install, or the working directory might not be set correctly."
            disabled={!hintsUnlocked}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={3}
          />
          <div className="text-xs text-slate-500 mt-1">
            {hypothesis.trim().length}/30 chars minimum
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid() || !hintsUnlocked || submitting}
          className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
        >
          {submitting ? 'Submitting...' : 'Submit Struggle Log'}
        </button>

        {hintsUnlocked && !isValid() && (
          <p className="text-sm text-amber-400 text-center">
            Complete all fields with minimum character requirements to submit
          </p>
        )}
      </form>
    </div>
  );
}
