/**
 * FailureLogListComponents - Extracted UI components for FailureLogList
 */

import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import type { FailureLog, FailureCategory } from '../../types/training';
import { getSeverityColor, type FailureStats, CATEGORY_OPTIONS, STATUS_OPTIONS } from './FailureLogListUtils';

type CategoryFilter = FailureCategory | 'all';
type StatusFilter = 'all' | 'resolved' | 'unresolved';

function getFailureItemBorderClass(failure: FailureLog): string {
  if (failure.resolvedAt) return 'border-green-700/30';
  if (failure.isRecurring) return 'border-orange-500/50';
  return 'border-slate-700';
}

interface StatsDisplayProps {
  readonly stats: FailureStats;
}

export function StatsDisplay({ stats }: StatsDisplayProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="text-2xl font-bold text-white">{stats.total}</div>
        <div className="text-sm text-slate-400">Total Failures</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-4 border border-green-700/30">
        <div className="text-2xl font-bold text-green-400">{stats.resolved}</div>
        <div className="text-sm text-slate-400">Resolved</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-4 border border-red-700/30">
        <div className="text-2xl font-bold text-red-400">{stats.unresolved}</div>
        <div className="text-sm text-slate-400">Unresolved</div>
      </div>
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="text-2xl font-bold text-indigo-400">
          {stats.avgResolutionTime > 0 ? Math.round(stats.avgResolutionTime) : '-'}
        </div>
        <div className="text-sm text-slate-400">Avg Time (min)</div>
      </div>
    </div>
  );
}

interface FiltersProps {
  readonly categoryFilter: CategoryFilter;
  readonly statusFilter: StatusFilter;
  readonly onCategoryChange: (value: CategoryFilter) => void;
  readonly onStatusChange: (value: StatusFilter) => void;
}

export function Filters({ categoryFilter, statusFilter, onCategoryChange, onStatusChange }: FiltersProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-slate-400" />
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category-filter" className="text-sm text-slate-400 mb-1 block">Category</label>
            <select id="category-filter" value={categoryFilter} onChange={(e) => onCategoryChange(e.target.value as FailureCategory | 'all')}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500">
              {CATEGORY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status-filter" className="text-sm text-slate-400 mb-1 block">Status</label>
            <select id="status-filter" value={statusFilter} onChange={(e) => onStatusChange(e.target.value as 'all' | 'resolved' | 'unresolved')}
              className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500">
              {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FailureItemProps {
  readonly failure: FailureLog;
  readonly onResolve: (failure: FailureLog) => void;
}

export function FailureItem({ failure, onResolve }: FailureItemProps) {
  const borderClass = getFailureItemBorderClass(failure);

  return (
    <div className={`bg-slate-800 rounded-lg p-5 border transition-all ${borderClass}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {failure.resolvedAt ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertTriangle className="w-5 h-5 text-red-400" />}
            <h3 className="text-lg font-semibold text-white">{failure.title}</h3>
            {failure.isRecurring && <span className="px-2 py-1 bg-orange-900/30 text-orange-400 text-xs font-semibold rounded">RECURRING</span>}
          </div>
          <div className="flex items-center gap-3 text-sm mb-2">
            <span className={`px-2 py-1 rounded ${getSeverityColor(failure.severity)}`}>{failure.severity}</span>
            <span className="text-slate-400">{failure.category}</span>
            <span className="text-slate-500">{failure.timestamp.toLocaleDateString()}</span>
          </div>
        </div>
        {!failure.resolvedAt && (
          <button onClick={() => onResolve(failure)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Mark Resolved
          </button>
        )}
      </div>
      <p className="text-slate-300 mb-3">{failure.description}</p>
      {failure.errorMessage && <pre className="text-xs text-red-400 bg-slate-900 p-3 rounded mb-3 overflow-x-auto">{failure.errorMessage}</pre>}
      {failure.resolution && <ResolutionDetails failure={failure} />}
    </div>
  );
}

function ResolutionDetails({ failure }: { readonly failure: FailureLog }) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
      <div><h4 className="text-sm font-semibold text-green-400 mb-1">Root Cause:</h4><p className="text-sm text-slate-300">{failure.rootCause}</p></div>
      <div><h4 className="text-sm font-semibold text-green-400 mb-1">Resolution:</h4><p className="text-sm text-slate-300">{failure.resolution}</p></div>
      {failure.preventionStrategy && <div><h4 className="text-sm font-semibold text-indigo-400 mb-1">Prevention:</h4><p className="text-sm text-slate-300">{failure.preventionStrategy}</p></div>}
      {failure.lessonsLearned.length > 0 && (
        <div><h4 className="text-sm font-semibold text-purple-400 mb-1">Lessons Learned:</h4>
          <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">{failure.lessonsLearned.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul>
        </div>
      )}
      {failure.timeToResolveMinutes && (
        <div className="flex items-center gap-2 text-sm text-slate-400"><Clock className="w-4 h-4" /><span>Resolved in {failure.timeToResolveMinutes} minutes</span></div>
      )}
    </div>
  );
}

interface EmptyStateProps {
  readonly hasFailures: boolean;
}

export function EmptyState({ hasFailures }: EmptyStateProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
      <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
      <p className="text-slate-400">{hasFailures ? 'No failures match the current filters.' : 'No failures logged yet. Keep learning!'}</p>
    </div>
  );
}
