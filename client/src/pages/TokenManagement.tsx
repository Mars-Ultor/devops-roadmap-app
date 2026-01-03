/**
 * Token Management Page
 * View token allocation, usage stats, and history
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, TrendingDown, Clock, AlertTriangle, ArrowLeft, Trophy, Target } from 'lucide-react';
import { useResetTokens } from '../hooks/useResetTokens';
import ResetTokenDisplay from '../components/tokens/ResetTokenDisplay';
import type { TokenUsageStats } from '../types/tokens';

export default function TokenManagement() {
  const navigate = useNavigate();
  const { currentAllocation, recentResets, loading } = useResetTokens();
  const [stats, setStats] = useState<TokenUsageStats | null>(null);
  const { getUsageStats } = useResetTokens();

  const loadStats = useCallback(async () => {
    const usageStats = await getUsageStats();
    setStats(usageStats);
  }, [getUsageStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz-reset': return 'text-blue-400';
      case 'lab-reset': return 'text-purple-400';
      case 'battle-drill-reset': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz-reset': return 'Quiz';
      case 'lab-reset': return 'Lab';
      case 'battle-drill-reset': return 'Battle Drill';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading token information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3 mb-2">
            <RefreshCw className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">Reset Token Management</h1>
          </div>
          <p className="text-gray-400">
            Limited resets encourage learning from failures. Tokens refresh every Monday.
          </p>
        </div>

        {/* Current Week Allocation */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">This Week's Tokens</h2>
          {currentAllocation && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Week of {currentAllocation.weekStart.toLocaleDateString()}</span>
                <span>Resets refresh: {currentAllocation.weekEnd.toLocaleDateString()}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResetTokenDisplay allocation={currentAllocation} type="quiz" />
            <ResetTokenDisplay allocation={currentAllocation} type="lab" />
            <ResetTokenDisplay allocation={currentAllocation} type="battleDrill" />
          </div>
        </div>

        {/* Usage Statistics */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All-Time Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Total Resets</div>
                    <div className="text-2xl font-bold text-white">{stats.totalResetsUsed}</div>
                  </div>
                  <RefreshCw className="w-8 h-8 text-gray-600" />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Quiz Resets</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.quizResetsUsed}</div>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Lab Resets</div>
                    <div className="text-2xl font-bold text-purple-400">{stats.labResetsUsed}</div>
                  </div>
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
              </div>

              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Avg/Week</div>
                    <div className="text-2xl font-bold text-yellow-400">
                      {stats.averageResetsPerWeek.toFixed(1)}
                    </div>
                  </div>
                  <TrendingDown className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            {/* Most Reset Items */}
            {stats.itemsMostReset.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Items Requiring Most Resets
                </h3>
                <div className="space-y-3">
                  {stats.itemsMostReset.map((item, index) => (
                    <div
                      key={item.itemId}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-900/30 border border-orange-700 rounded-full flex items-center justify-center">
                          <span className="text-orange-400 font-semibold text-sm">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{item.itemTitle}</div>
                          <div className={`text-xs ${getTypeColor(item.type)}`}>
                            {getTypeLabel(item.type)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-orange-400">{item.resetCount}</div>
                        <div className="text-xs text-gray-500">resets</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-orange-900/20 border border-orange-800 rounded-lg">
                  <p className="text-sm text-orange-300">
                    💡 <span className="font-semibold">Tip:</span> Items requiring multiple resets may need additional study. 
                    Review the failure log and consider focusing extra practice on these areas.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Reset History */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Reset History</h2>
          
          {recentResets.length === 0 ? (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
              <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No Resets Used!</h3>
              <p className="text-gray-400">
                Excellent discipline. You haven't used any reset tokens yet.
              </p>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentResets.map((reset) => (
                    <tr key={reset.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          {formatDate(reset.usedAt)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{reset.itemTitle}</div>
                        {reset.weekNumber && (
                          <div className="text-xs text-gray-500">Week {reset.weekNumber}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-medium ${getTypeColor(reset.type)}`}>
                          {getTypeLabel(reset.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {reset.reason || <span className="italic">No reason provided</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Philosophy Reminder */}
        <div className="mt-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800/50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2">Military Training Philosophy</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">→</span>
                  <span><span className="font-semibold">Limited resets simulate real-world consequences</span> - In production, you can't just restart without cost.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">→</span>
                  <span><span className="font-semibold">Failures are learning opportunities</span> - Review your After Action Reports and Failure Log before resetting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">→</span>
                  <span><span className="font-semibold">30-minute cooldown encourages reflection</span> - Don't immediately retry. Analyze what went wrong first.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">→</span>
                  <span><span className="font-semibold">Discipline builds mastery</span> - The best operators rarely need resets because they learn from each attempt.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
