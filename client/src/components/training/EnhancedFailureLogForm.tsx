/**
 * Enhanced Failure Log Form
 * Phase 9: Mandatory fields, pattern recognition, runbook generation
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, X, FileText, BookOpen, TrendingUp, Copy, Check } from 'lucide-react';
import type { FailureLog, FailureCategory, FailureSeverity } from '../../types/training';

interface EnhancedFailureLogFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill' | 'project';
  contentTitle: string;
  onSubmit: (failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'>) => Promise<void>;
  onCancel?: () => void;
  prefilledError?: string;
}

interface PatternDetection {
  detected: boolean;
  category: string;
  occurrences: number;
  lastSeen: string;
  suggestedRunbook: string;
}

interface ValidationState {
  whatTried: boolean;
  rootCause: boolean;
  isValid: boolean;
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

export default function EnhancedFailureLogForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel,
  prefilledError
}: EnhancedFailureLogFormProps) {
  const [category, setCategory] = useState<FailureCategory>('other');
  const [severity, setSeverity] = useState<FailureSeverity>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(prefilledError || '');
  const [whatTried, setWhatTried] = useState<string[]>(['', '', '']);
  const [rootCause, setRootCause] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    whatTried: false,
    rootCause: false,
    isValid: false
  });
  const [patternDetection, setPatternDetection] = useState<PatternDetection | null>(null);
  const [generatedRunbook, setGeneratedRunbook] = useState<string>('');
  const [runbookCopied, setRunbookCopied] = useState(false);

  // Phase 9: Validate mandatory fields
  useEffect(() => {
    const validWhatTried = whatTried.filter(item => item.trim().length > 0).length >= 3;
    const validRootCause = rootCause.trim().split(/\s+/).length >= 30;

    setValidation({
      whatTried: validWhatTried,
      rootCause: validRootCause,
      isValid: validWhatTried && validRootCause && title.trim().length > 0
    });
  }, [whatTried, rootCause, title]);

  // Phase 9: Pattern detection (simulated - would be API call in production)
  useEffect(() => {
    if (category !== 'other' && errorMessage.length > 10) {
      // Simulate pattern detection
      setTimeout(() => {
        const mockPatterns: Record<string, PatternDetection> = {
          docker: {
            detected: true,
            category: 'Docker port conflicts',
            occurrences: 3,
            lastSeen: '2 days ago',
            suggestedRunbook: 'Check if port is already in use with `netstat -ano | findstr :<port>`. Kill process or change port mapping.'
          },
          networking: {
            detected: true,
            category: 'DNS resolution failures',
            occurrences: 5,
            lastSeen: '1 week ago',
            suggestedRunbook: 'Verify DNS configuration. Check /etc/resolv.conf. Test with `nslookup <domain>`. Consider using 8.8.8.8 as fallback.'
          },
          deployment: {
            detected: true,
            category: 'Environment variable issues',
            occurrences: 4,
            lastSeen: '3 days ago',
            suggestedRunbook: 'Verify all required env vars are set. Use `env | grep <VAR_NAME>`. Check .env file is loaded. Validate variable names match.'
          }
        };

        if (mockPatterns[category]) {
          setPatternDetection(mockPatterns[category]);
        }
      }, 1000);
    }
  }, [category, errorMessage]);

  // Phase 9: Auto-generate runbook
  useEffect(() => {
    if (validation.isValid && category !== 'other') {
      const runbook = generateRunbook();
      setGeneratedRunbook(runbook);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validation.isValid, category, whatTried, rootCause]);

  const generateRunbook = (): string => {
    const validSteps = whatTried.filter(step => step.trim().length > 0);
    
    return `# Runbook: ${title}

## Problem
${description}

${errorMessage ? `## Error Message\n\`\`\`\n${errorMessage}\n\`\`\`\n` : ''}

## Root Cause
${rootCause}

## Troubleshooting Steps
${validSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

## Category
${category.toUpperCase()}

## Severity
${severity.toUpperCase()}

## Prevention
- Document this pattern for future reference
- Add validation checks if applicable
- Update deployment checklist
- Share knowledge with team

---
*Auto-generated from Failure Log - ${new Date().toLocaleDateString()}*
`;
  };

  const copyRunbook = () => {
    navigator.clipboard.writeText(generatedRunbook);
    setRunbookCopied(true);
    setTimeout(() => setRunbookCopied(false), 2000);
  };

  const handleWhatTriedChange = (index: number, value: string) => {
    const newWhatTried = [...whatTried];
    newWhatTried[index] = value;
    setWhatTried(newWhatTried);
  };

  const addWhatTriedItem = () => {
    setWhatTried([...whatTried, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.isValid) {
      alert('❌ Please complete all mandatory fields:\n• Title\n• At least 3 "What I Tried" items\n• Root Cause (minimum 30 words)');
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
        lessonsLearned: whatTried.filter(item => item.trim().length > 0),
        relatedConcepts: [rootCause.trim()]
      };

      await onSubmit(failureData);
    } catch (error) {
      console.error('Error submitting failure log:', error);
      alert('Failed to log failure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500/50 max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-white">Enhanced Failure Log</h2>
            </div>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
          <p className="text-slate-300 mt-2">
            Document failures systematically to build your personal runbook
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Pattern Detection Alert */}
          {patternDetection?.detected && (
            <div className="bg-yellow-900/30 border-2 border-yellow-600 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-yellow-300 font-semibold mb-1">⚠️ Recurring Pattern Detected</h3>
                  <p className="text-yellow-200 text-sm mb-2">
                    <strong>{patternDetection.category}</strong> - Occurred {patternDetection.occurrences} times (last: {patternDetection.lastSeen})
                  </p>
                  <div className="bg-yellow-900/40 rounded p-3 text-yellow-100 text-sm">
                    <strong>Suggested Fix:</strong> {patternDetection.suggestedRunbook}
                  </div>
                </div>
              </div>
            </div>
          )}

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
              Failure Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Docker container failed to start due to port conflict"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what happened..."
              rows={3}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Error Message
              </label>
              <textarea
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-red-600/50 rounded-lg px-4 py-2 text-red-300 font-mono text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* Phase 9: Mandatory "What I Tried" (min 3 items) */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                What I Tried * 
                <span className={`text-xs px-2 py-0.5 rounded ${
                  validation.whatTried ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}>
                  {whatTried.filter(item => item.trim().length > 0).length} / 3 minimum
                </span>
              </span>
            </label>
            <div className="space-y-2">
              {whatTried.map((item, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={item}
                  onChange={(e) => handleWhatTriedChange(idx, e.target.value)}
                  placeholder={`Approach ${idx + 1}: What did you try?`}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              ))}
              <button
                type="button"
                onClick={addWhatTriedItem}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add another approach
              </button>
            </div>
          </div>

          {/* Phase 9: Mandatory Root Cause (min 30 words) */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                Root Cause Analysis *
                <span className={`text-xs px-2 py-0.5 rounded ${
                  validation.rootCause ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                }`}>
                  {wordCount(rootCause)} / 30 words minimum
                </span>
              </span>
            </label>
            <textarea
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Analyze the root cause, not just symptoms. What was the underlying reason for the failure? What misunderstanding or gap in knowledge led to this?"
              rows={4}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-1">
              Dig deeper than surface symptoms. Understanding root causes prevents recurring failures.
            </p>
          </div>

          {/* Phase 9: Auto-generated Runbook */}
          {generatedRunbook && (
            <div className="bg-indigo-900/20 border-2 border-indigo-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-indigo-300 font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Auto-Generated Runbook
                </h3>
                <button
                  type="button"
                  onClick={copyRunbook}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded flex items-center gap-2"
                >
                  {runbookCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {runbookCopied ? 'Copied!' : 'Copy Runbook'}
                </button>
              </div>
              <pre className="bg-slate-900 rounded p-4 text-xs text-gray-300 overflow-x-auto max-h-64 overflow-y-auto">
                {generatedRunbook}
              </pre>
              <p className="text-xs text-indigo-300 mt-2">
                💡 Save this runbook for future reference. It will be added to your personal knowledge base.
              </p>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <div className="text-sm text-slate-400">
              {validation.isValid ? (
                <span className="text-green-400 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Ready to submit
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Complete mandatory fields
                </span>
              )}
            </div>
            <div className="flex gap-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-400 hover:text-white border border-slate-600 rounded-md hover:border-slate-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={!validation.isValid || submitting}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Logging...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Log Failure
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
