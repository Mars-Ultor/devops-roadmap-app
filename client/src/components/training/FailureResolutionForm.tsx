/**
 * FailureResolutionForm - Document how a failure was resolved
 * Captures root cause analysis and prevention strategies
 */

import { useState } from 'react';
import { CheckCircle, X, Search, Shield, BookOpen } from 'lucide-react';
import type { FailureLog } from '../../types/training';

interface FailureResolutionFormProps {
  failure: FailureLog;
  onSubmit: (updates: {
    rootCause?: string;
    resolution?: string;
    preventionStrategy?: string;
    lessonsLearned: string[];
    resolvedAt: Date;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function FailureResolutionForm({
  failure,
  onSubmit,
  onCancel
}: FailureResolutionFormProps) {
  const [rootCause, setRootCause] = useState(failure.rootCause || '');
  const [resolution, setResolution] = useState(failure.resolution || '');
  const [preventionStrategy, setPreventionStrategy] = useState(failure.preventionStrategy || '');
  const [lessons, setLessons] = useState<string[]>(failure.lessonsLearned.length > 0 ? failure.lessonsLearned : ['', '']);
  const [submitting, setSubmitting] = useState(false);

  const updateLesson = (index: number, value: string) => {
    const updated = [...lessons];
    updated[index] = value;
    setLessons(updated);
  };

  const addLesson = () => {
    setLessons([...lessons, '']);
  };

  const removeLesson = (index: number) => {
    if (lessons.length > 2) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validLessons = lessons.filter(l => l.trim().length > 0);
    
    if (!rootCause.trim() || !resolution.trim() || validLessons.length < 2) {
      alert('Please fill in root cause, resolution, and at least 2 lessons learned');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rootCause: rootCause.trim(),
        resolution: resolution.trim(),
        preventionStrategy: preventionStrategy.trim() || undefined,
        lessonsLearned: validLessons,
        resolvedAt: new Date()
      });
    } catch (error) {
      console.error('Error submitting resolution:', error);
      alert('Failed to submit resolution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-green-500/50 max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Document Resolution</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-300 mt-2">
            Capture how you fixed the issue and what you learned
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Original Failure */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <h3 className="font-semibold text-white mb-2">Original Failure:</h3>
            <p className="text-slate-300 mb-1">{failure.title}</p>
            <p className="text-sm text-slate-400">{failure.description}</p>
            {failure.errorMessage && (
              <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-2 rounded overflow-x-auto">
                {failure.errorMessage}
              </pre>
            )}
          </div>

          {/* Root Cause */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Root Cause Analysis * <span className="text-slate-500">(Why did this happen?)</span>
            </label>
            <textarea
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Dig deep - what was the underlying cause? Not just the symptom..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              {rootCause.trim().split(/\s+/).filter(w => w.length > 0).length} words (min 20 recommended)
            </p>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Resolution * <span className="text-slate-500">(How did you fix it?)</span>
            </label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Step-by-step: what actions did you take to resolve this?"
              rows={4}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              {resolution.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </p>
          </div>

          {/* Prevention Strategy */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <Shield className="w-4 h-4 inline mr-1" />
              Prevention Strategy <span className="text-slate-500">(How to avoid this in future?)</span>
            </label>
            <textarea
              value={preventionStrategy}
              onChange={(e) => setPreventionStrategy(e.target.value)}
              placeholder="What process, checklist, or practice will prevent this from happening again?"
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
            />
          </div>

          {/* Lessons Learned */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Lessons Learned * <span className="text-slate-500">(At least 2)</span>
            </label>
            <div className="space-y-2">
              {lessons.map((lesson, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={lesson}
                    onChange={(e) => updateLesson(index, e.target.value)}
                    placeholder={`Lesson ${index + 1}: What did you learn?`}
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
                  />
                  {lessons.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(index)}
                      className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="mt-2 text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              + Add Another Lesson
            </button>
          </div>

          {/* Info */}
          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
            <p className="text-sm text-green-200">
              <strong>Remember:</strong> The goal isn't just to fix the problem, but to learn from it. Future you will thank you for documenting this well!
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !rootCause.trim() || !resolution.trim() || lessons.filter(l => l.trim().length > 0).length < 2}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
            >
              {submitting ? 'Saving...' : 'Mark Resolved'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
