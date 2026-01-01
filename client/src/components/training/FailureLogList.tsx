/**
 * FailureLogList - Display failure logs with filtering and resolution tracking
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react';
import { useFailureLog } from '../../hooks/useFailureLog';
import FailureResolutionForm from './FailureResolutionForm';
import type { FailureLog, FailureCategory } from '../../types/training';

interface FailureLogListProps {
  contentId?: string; // Filter by specific content
  showFilters?: boolean;
}

export default function FailureLogList({ contentId, showFilters = true }: FailureLogListProps) {
  const { getFailureLogs, updateFailure, loading } = useFailureLog();
  const [failures, setFailures] = useState<FailureLog[]>([]);
  const [filteredFailures, setFilteredFailures] = useState<FailureLog[]>([]);
  const [selectedFailure, setSelectedFailure] = useState<FailureLog | null>(null);
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<FailureCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'resolved' | 'unresolved'>('all');

  useEffect(() => {
    loadFailures();
  }, [contentId]);

  useEffect(() => {
    applyFilters();
  }, [failures, categoryFilter, statusFilter]);

  const loadFailures = async () => {
    const logs = await getFailureLogs(contentId);
    setFailures(logs);
  };

  const applyFilters = () => {
    let filtered = [...failures];

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(f => f.category === categoryFilter);
    }

    if (statusFilter === 'resolved') {
      filtered = filtered.filter(f => f.resolvedAt !== undefined);
    } else if (statusFilter === 'unresolved') {
      filtered = filtered.filter(f => f.resolvedAt === undefined);
    }

    setFilteredFailures(filtered);
  };

  const handleResolve = (failure: FailureLog) => {
    setSelectedFailure(failure);
    setShowResolutionForm(true);
  };

  const handleResolutionSubmit = async (updates: any) => {
    if (!selectedFailure) return;

    await updateFailure(selectedFailure.id, updates);
    await loadFailures();
    setShowResolutionForm(false);
    setSelectedFailure(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'high': return 'text-orange-400 bg-orange-900/30';
      case 'critical': return 'text-red-400 bg-red-900/30';
      default: return 'text-slate-400 bg-slate-700';
    }
  };

  const stats = {
    total: failures.length,
    resolved: failures.filter(f => f.resolvedAt).length,
    unresolved: failures.filter(f => !f.resolvedAt).length,
    avgResolutionTime: failures
      .filter(f => f.timeToResolveMinutes)
      .reduce((acc, f) => acc + (f.timeToResolveMinutes || 0), 0) / 
      failures.filter(f => f.timeToResolveMinutes).length || 0
  };

  if (loading && failures.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading failure logs...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
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

      {/* Filters */}
      {showFilters && (
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Categories</option>
                  <option value="docker">Docker</option>
                  <option value="deployment">Deployment</option>
                  <option value="security">Security</option>
                  <option value="networking">Networking</option>
                  <option value="database">Database</option>
                  <option value="cicd">CI/CD</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="testing">Testing</option>
                  <option value="monitoring">Monitoring</option>
                  <option value="configuration">Configuration</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All</option>
                  <option value="unresolved">Unresolved Only</option>
                  <option value="resolved">Resolved Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Failure List */}
      <div className="space-y-3">
        {filteredFailures.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 border border-slate-700 text-center">
            <AlertTriangle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">
              {failures.length === 0 
                ? 'No failures logged yet. Keep learning!' 
                : 'No failures match the current filters.'}
            </p>
          </div>
        ) : (
          filteredFailures.map((failure) => (
            <div
              key={failure.id}
              className={`bg-slate-800 rounded-lg p-5 border transition-all ${
                failure.resolvedAt 
                  ? 'border-green-700/30' 
                  : failure.isRecurring
                  ? 'border-orange-500/50'
                  : 'border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {failure.resolvedAt ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    )}
                    <h3 className="text-lg font-semibold text-white">{failure.title}</h3>
                    {failure.isRecurring && (
                      <span className="px-2 py-1 bg-orange-900/30 text-orange-400 text-xs font-semibold rounded">
                        RECURRING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm mb-2">
                    <span className={`px-2 py-1 rounded ${getSeverityColor(failure.severity)}`}>
                      {failure.severity}
                    </span>
                    <span className="text-slate-400">{failure.category}</span>
                    <span className="text-slate-500">
                      {failure.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {!failure.resolvedAt && (
                  <button
                    onClick={() => handleResolve(failure)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>

              <p className="text-slate-300 mb-3">{failure.description}</p>

              {failure.errorMessage && (
                <pre className="text-xs text-red-400 bg-slate-900 p-3 rounded mb-3 overflow-x-auto">
                  {failure.errorMessage}
                </pre>
              )}

              {failure.resolution && (
                <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-1">Root Cause:</h4>
                    <p className="text-sm text-slate-300">{failure.rootCause}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-1">Resolution:</h4>
                    <p className="text-sm text-slate-300">{failure.resolution}</p>
                  </div>
                  {failure.preventionStrategy && (
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-400 mb-1">Prevention:</h4>
                      <p className="text-sm text-slate-300">{failure.preventionStrategy}</p>
                    </div>
                  )}
                  {failure.lessonsLearned.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-1">Lessons Learned:</h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {failure.lessonsLearned.map((lesson, i) => (
                          <li key={i}>{lesson}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {failure.timeToResolveMinutes && (
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>Resolved in {failure.timeToResolveMinutes} minutes</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Resolution Form Modal */}
      {showResolutionForm && selectedFailure && (
        <FailureResolutionForm
          failure={selectedFailure}
          onSubmit={handleResolutionSubmit}
          onCancel={() => {
            setShowResolutionForm(false);
            setSelectedFailure(null);
          }}
        />
      )}
    </div>
  );
}
