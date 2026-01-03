/**
 * Failure Review Page - Pattern analysis and resolution tracking
 * Military-style incident review for continuous improvement
 */

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, TrendingDown, Target, Brain } from 'lucide-react';
import { useFailureLog } from '../hooks/useFailureLog';
import FailureLogList from '../components/training/FailureLogList';
import type { FailurePattern, FailureAnalytics } from '../types/training';

export default function FailureReview() {
  const { detectPatterns, getFailureLogs } = useFailureLog();
  const [, setPatterns] = useState<FailurePattern[]>([]);
  const [analytics, setAnalytics] = useState<FailureAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [detectedPatterns, allFailures] = await Promise.all([
        detectPatterns(),
        getFailureLogs()
      ]);

      setPatterns(detectedPatterns);

      // Calculate analytics
      const resolvedFailures = allFailures.filter(f => f.resolvedAt);
      const unresolvedFailures = allFailures.filter(f => !f.resolvedAt);
      
      const avgResolutionTime = resolvedFailures.length > 0
        ? resolvedFailures.reduce((acc, f) => acc + (f.timeToResolveMinutes || 0), 0) / resolvedFailures.length
        : 0;

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const failuresLast7Days = allFailures.filter(f => f.timestamp >= sevenDaysAgo).length;
      const failuresLast30Days = allFailures.filter(f => f.timestamp >= thirtyDaysAgo).length;

      // Improvement rate: reduction in failures over time
      const failuresPrevious30Days = allFailures.filter(f => 
        f.timestamp >= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) &&
        f.timestamp < thirtyDaysAgo
      ).length;
      
      const improvementRate = failuresPrevious30Days > 0
        ? ((failuresPrevious30Days - failuresLast30Days) / failuresPrevious30Days) * 100
        : 0;

      // Group by category
      const failuresByCategory: Record<string, number> = {};
      allFailures.forEach(f => {
        failuresByCategory[f.category] = (failuresByCategory[f.category] || 0) + 1;
      });

      // Group by severity
      const failuresBySeverity: Record<string, number> = {};
      allFailures.forEach(f => {
        failuresBySeverity[f.severity] = (failuresBySeverity[f.severity] || 0) + 1;
      });

      setAnalytics({
        userId: '', // Not needed for display
        totalFailures: allFailures.length,
        resolvedFailures: resolvedFailures.length,
        unresolvedFailures: unresolvedFailures.length,
        averageResolutionTimeMinutes: Math.round(avgResolutionTime),
        failuresByCategory,
        failuresBySeverity,
        activePatterns: detectedPatterns.filter(p => !p.resolved),
        resolvedPatterns: detectedPatterns.filter(p => p.resolved),
        failuresLast7Days,
        failuresLast30Days,
        improvementRate
      });
    } catch (error) {
      console.error('Error loading failure data:', error);
    } finally {
      setLoading(false);
    }
  }, [detectPatterns, getFailureLogs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto text-center py-20">
          <div className="text-white text-xl">Loading failure analysis...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-red-400" />
            Failure Review
          </h1>
          <p className="text-xl text-slate-400">
            Analyze patterns, track resolutions, and improve continuously
          </p>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="mb-8 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="text-3xl font-bold text-white mb-1">
                  {analytics.totalFailures}
                </div>
                <div className="text-sm text-slate-400">Total Failures</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-green-700/30">
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {analytics.resolvedFailures}
                </div>
                <div className="text-sm text-slate-400">Resolved</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-red-700/30">
                <div className="text-3xl font-bold text-red-400 mb-1">
                  {analytics.unresolvedFailures}
                </div>
                <div className="text-sm text-slate-400">Unresolved</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-indigo-700/30">
                <div className="text-3xl font-bold text-indigo-400 mb-1">
                  {analytics.averageResolutionTimeMinutes || '-'}
                </div>
                <div className="text-sm text-slate-400">Avg Resolution (min)</div>
              </div>
            </div>

            {/* Trends */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  <div className="text-sm text-slate-400">Last 7 Days</div>
                </div>
                <div className="text-2xl font-bold text-yellow-400">
                  {analytics.failuresLast7Days}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  <div className="text-sm text-slate-400">Last 30 Days</div>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  {analytics.failuresLast30Days}
                </div>
              </div>
              <div className="bg-slate-800 rounded-lg p-6 border border-emerald-700/30">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-emerald-400" />
                  <div className="text-sm text-slate-400">Improvement Rate</div>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {analytics.improvementRate > 0 ? '+' : ''}{analytics.improvementRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Active Patterns */}
            {analytics.activePatterns.length > 0 && (
              <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-lg p-6 border-2 border-orange-500/50">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-white">Active Patterns Detected</h2>
                </div>
                <div className="space-y-3">
                  {analytics.activePatterns.map(pattern => (
                    <div
                      key={pattern.id}
                      className="bg-slate-800 rounded-lg p-4 border border-orange-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {pattern.pattern}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="capitalize">{pattern.category}</span>
                            <span>•</span>
                            <span>{pattern.occurrences} occurrences</span>
                            <span>•</span>
                            <span>First: {pattern.firstSeen.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>Last: {pattern.lastSeen.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-orange-900/30 text-orange-400 font-semibold rounded-lg">
                          {pattern.occurrences}x
                        </div>
                      </div>
                      {pattern.recommendedActions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <p className="text-sm text-slate-300">
                            <strong>Recommended:</strong> {pattern.recommendedActions.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Failure Log List */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">All Failures</h2>
          <FailureLogList showFilters={true} />
        </div>
      </div>
    </div>
  );
}
