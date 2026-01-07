/* eslint-disable max-lines-per-function */
/**
 * Personal Runbook - Auto-generated troubleshooting guide
 * Aggregates failure logs into organized reference
 */

import { type FC } from 'react';
import { BookOpen, Download, AlertTriangle, TrendingUp } from 'lucide-react';
import { useRunbook } from '../../hooks/useRunbook';
import { RunbookCategory } from './RunbookCategory';
import { downloadRunbook } from '../../services/runbookGenerator';

interface FailureEntry {
  id: string;
  entryNumber: number;
  task: string;
  whatBroke: string;
  whatTried: string[];
  rootCause: string;
  solution: string;
  timeWasted: number;
  keyLesson: string;
  prevention: string;
  quickCheck: string;
  category: string;
  createdAt: Date;
}

interface PersonalRunbookProps {
  entries: FailureEntry[];
}

export const PersonalRunbook: FC<PersonalRunbookProps> = ({ entries }) => {
  const { runbook, loading } = useRunbook(entries);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Generating your personal runbook...</p>
        </div>
      </div>
    );
  }

  if (!runbook || runbook.totalFailures === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
        <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Runbook Yet</h3>
        <p className="text-slate-400 mb-4">
          Your personal runbook will appear here as you log failures during your training.
          Each mistake you document becomes part of your troubleshooting guide.
        </p>
        <p className="text-sm text-slate-500">
          Start by completing lessons and logging any issues you encounter!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 border border-purple-700 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-300" />
              Personal Troubleshooting Runbook
            </h2>
            <p className="text-purple-200">
              Auto-generated from your {runbook.totalFailures} logged failure{runbook.totalFailures !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadRunbook(runbook)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Markdown
            </button>
          </div>
        </div>

        <div className="text-sm text-purple-100">
          Last updated: {runbook.generatedAt.toLocaleDateString()} {runbook.generatedAt.toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Most Common Issue */}
        <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold text-amber-300">Most Common Issue</h3>
          </div>
          <p className="text-white text-sm">{runbook.mostCommonIssue}</p>
        </div>

        {/* Total Failures */}
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-red-300">Total Issues Logged</h3>
          </div>
          <p className="text-white text-3xl font-bold">{runbook.totalFailures}</p>
        </div>

        {/* Categories */}
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold text-blue-300">Categories</h3>
          </div>
          <p className="text-white text-3xl font-bold">{runbook.categories.length}</p>
        </div>
      </div>

      {/* Recent Patterns */}
      {runbook.recentPatterns.length > 0 && (
        <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-purple-300">Recent Patterns (Last 30 Days)</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {runbook.recentPatterns.map((pattern, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-800/50 text-purple-200 rounded-full text-sm"
              >
                {pattern}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-indigo-900/30 border border-indigo-700/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-100">
            <p className="font-semibold mb-1">How to use this runbook:</p>
            <ul className="space-y-1 text-indigo-200">
              <li>• Issues are organized by technology category and sorted by frequency</li>
              <li>• Each entry shows root cause, proven solution, and prevention strategy</li>
              <li>• Quick check commands help diagnose similar issues faster</li>
              <li>• Export as Markdown to keep offline or share with your team</li>
              <li>• Runbook updates automatically as you log new failures</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">Troubleshooting Guide by Category</h3>
        {runbook.categories.map((category, index) => (
          <RunbookCategory 
            key={category.category} 
            category={category}
            defaultExpanded={index === 0} // Expand most common category by default
          />
        ))}
      </div>

      {/* Footer Tip */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-center">
        <p className="text-sm text-slate-400">
          💡 <span className="font-semibold">Pro Tip:</span> Review your runbook weekly to identify patterns 
          and create preventive checklists for common issues.
        </p>
      </div>
    </div>
  );
};
