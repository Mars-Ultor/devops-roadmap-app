/**
 * TokenManagementComponents - Extracted UI components for TokenManagement
 */

import { RefreshCw, TrendingDown, Clock, AlertTriangle, ArrowLeft, Trophy, Target } from 'lucide-react';
import ResetTokenDisplay from '../components/tokens/ResetTokenDisplay';
import type { TokenUsageStats, TokenAllocation, ResetTokenUsage } from '../types/tokens';
import { formatDate, getTypeColor, getTypeLabel } from './TokenManagementUtils';

interface PageHeaderProps {
  onBack: () => void;
}

export function PageHeader({ onBack }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" />Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-2">
        <RefreshCw className="w-8 h-8 text-yellow-400" />
        <h1 className="text-3xl font-bold">Reset Token Management</h1>
      </div>
      <p className="text-gray-400">Limited resets encourage learning from failures. Tokens refresh every Monday.</p>
    </div>
  );
}

interface CurrentWeekSectionProps {
  allocation: TokenAllocation | null;
}

export function CurrentWeekSection({ allocation }: CurrentWeekSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">This Week's Tokens</h2>
      {allocation && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Week of {allocation.weekStart.toLocaleDateString()}</span>
            <span>Resets refresh: {allocation.weekEnd.toLocaleDateString()}</span>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResetTokenDisplay allocation={allocation} type="quiz" />
        <ResetTokenDisplay allocation={allocation} type="lab" />
        <ResetTokenDisplay allocation={allocation} type="battleDrill" />
      </div>
    </div>
  );
}

interface StatsSectionProps {
  stats: TokenUsageStats;
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">All-Time Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<RefreshCw className="w-8 h-8 text-gray-600" />} label="Total Resets" value={stats.totalResetsUsed} color="text-white" />
        <StatCard icon={<Target className="w-8 h-8 text-blue-600" />} label="Quiz Resets" value={stats.quizResetsUsed} color="text-blue-400" />
        <StatCard icon={<Target className="w-8 h-8 text-purple-600" />} label="Lab Resets" value={stats.labResetsUsed} color="text-purple-400" />
        <StatCard icon={<TrendingDown className="w-8 h-8 text-yellow-600" />} label="Avg/Week" value={stats.averageResetsPerWeek.toFixed(1)} color="text-yellow-400" />
      </div>
      {stats.itemsMostReset.length > 0 && <MostResetItems items={stats.itemsMostReset} />}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div><div className="text-sm text-gray-400">{label}</div><div className={`text-2xl font-bold ${color}`}>{value}</div></div>
        {icon}
      </div>
    </div>
  );
}

function MostResetItems({ items }: { items: TokenUsageStats['itemsMostReset'] }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-orange-400" />Items Requiring Most Resets
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={item.itemId} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-900/30 border border-orange-700 rounded-full flex items-center justify-center">
                <span className="text-orange-400 font-semibold text-sm">#{index + 1}</span>
              </div>
              <div>
                <div className="font-medium text-white">{item.itemTitle}</div>
                <div className={`text-xs ${getTypeColor(item.type)}`}>{getTypeLabel(item.type)}</div>
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
        <p className="text-sm text-orange-300">💡 <span className="font-semibold">Tip:</span> Items requiring multiple resets may need additional study.</p>
      </div>
    </div>
  );
}

interface RecentHistoryProps {
  resets: ResetTokenUsage[];
}

export function RecentHistory({ resets }: RecentHistoryProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Reset History</h2>
      {resets.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
          <Trophy className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Resets Used!</h3>
          <p className="text-gray-400">Excellent discipline. You haven't used any reset tokens yet.</p>
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
              {resets.map((reset) => (
                <tr key={reset.id} className="hover:bg-gray-900/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-300"><div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" />{formatDate(reset.usedAt)}</div></td>
                  <td className="px-4 py-3"><div className="font-medium text-white">{reset.itemTitle}</div>{reset.weekNumber && <div className="text-xs text-gray-500">Week {reset.weekNumber}</div>}</td>
                  <td className="px-4 py-3"><span className={`text-sm font-medium ${getTypeColor(reset.type)}`}>{getTypeLabel(reset.type)}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-400">{reset.reason || <span className="italic">No reason provided</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function PhilosophyReminder() {
  return (
    <div className="mt-8 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800/50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <AlertTriangle className="w-8 h-8 text-yellow-400 flex-shrink-0" />
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Military Training Philosophy</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">→</span><span><span className="font-semibold">Limited resets simulate real-world consequences</span> - In production, you can't just restart without cost.</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">→</span><span><span className="font-semibold">Failures are learning opportunities</span> - Review your After Action Reports and Failure Log before resetting.</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">→</span><span><span className="font-semibold">30-minute cooldown encourages reflection</span> - Don't immediately retry. Analyze what went wrong first.</span></li>
            <li className="flex items-start gap-2"><span className="text-yellow-400 mt-1">→</span><span><span className="font-semibold">Discipline builds mastery</span> - The best operators rarely need resets because they learn from each attempt.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
