/**
 * FailureLogForm - Capture failure details with context
 * Military-style incident reporting for learning
 */

import { useState } from 'react';
import { AlertTriangle, X, FileText, Lightbulb } from 'lucide-react';
import type { FailureLog, FailureCategory, FailureSeverity } from '../../types/training';

interface FailureLogFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill' | 'project';
  contentTitle: string;
  onSubmit: (failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'>) => Promise<void>;
  onCancel: () => void;
  prefilledError?: string; // Auto-fill from validation errors
}

const CATEGORIES: { value: FailureCategory; label: string }[] = [
  { value: 'docker', label: 'Docker' },
  { value: 'deployment', label: 'Deployment' },
  { value: 'security', label: 'Security' },
  { value: 'networking', label: 'Networking' },
  { value: 'database', label: 'Database' },
  { value: 'cicd', label: 'CI/CD' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'testing', label: 'Testing' },
  { value: 'monitoring', label: 'Monitoring' },
  { value: 'configuration', label: 'Configuration' },
  { value: 'other', label: 'Other' }
];

const SEVERITIES: { value: FailureSeverity; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-green-400 bg-green-900/30' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-400 bg-yellow-900/30' },
  { value: 'high', label: 'High', color: 'text-orange-400 bg-orange-900/30' },
  { value: 'critical', label: 'Critical', color: 'text-red-400 bg-red-900/30' }
];

export default function FailureLogForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel,
  prefilledError
}: FailureLogFormProps) {
  const [category, setCategory] = useState<FailureCategory>('other');
  const [severity, setSeverity] = useState<FailureSeverity>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(prefilledError || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in title and description');
      return;
    }

    setSubmitting(true);
    try {
      const failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'> = {
        contentType,
        contentId,
        contentTitle,
        category,
        severity,
        title: title.trim(),
        description: description.trim(),
        errorMessage: errorMessage.trim() || undefined,
        lessonsLearned: [],
        relatedConcepts: []
      };

      await onSubmit(failureData);
    } catch (error) {
      console.error('Error submitting failure log:', error);
      alert('Failed to log failure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500/50 max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Log Failure</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-300 mt-2">
            Document what went wrong to identify patterns and improve
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Context Info */}
          <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">Context:</span> {contentType} - {contentTitle}
            </p>
          </div>

          {/* Category & Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FailureCategory)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Severity *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SEVERITIES.map(sev => (
                  <button
                    key={sev.value}
                    type="button"
                    onClick={() => setSeverity(sev.value)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      severity === sev.value
                        ? sev.color + ' border-2 border-current'
                        : 'bg-slate-700 text-slate-400 border-2 border-transparent hover:bg-slate-600'
                    }`}
                  >
                    {sev.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Brief Title * <span className="text-slate-500">(3-10 words)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Docker container failed to start"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Detailed Description * <span className="text-slate-500">(What happened?)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you were doing, what you expected, and what actually happened..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">
              {description.trim().split(/\s+/).filter(w => w.length > 0).length} words
            </p>
          </div>

          {/* Error Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Error Message <span className="text-slate-500">(Optional - exact error text)</span>
            </label>
            <textarea
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              placeholder="Paste the exact error message if available..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
            />
          </div>

          {/* Info Box */}
          <div className="bg-indigo-900/20 border border-indigo-600/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-200">
                <strong>Pro Tip:</strong> You can add root cause analysis and resolution details after you fix the issue. This initial log helps track what's going wrong.
              </p>
            </div>
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
              disabled={submitting || !title.trim() || !description.trim()}
              className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
            >
              {submitting ? 'Logging...' : 'Log Failure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
