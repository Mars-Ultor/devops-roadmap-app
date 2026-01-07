/**
 * Enhanced Analytics Dashboard
 * Comprehensive military training performance metrics
 */

import { useState, type FC } from 'react';
import { BarChart3, Activity, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { useTimeAnalysis } from '../hooks/useTimeAnalysis';
import { useLearningVelocity } from '../hooks/useLearningVelocity';
import { LearningVelocityChart } from '../components/analytics/LearningVelocityChart';
import { TopicMasteryHeatmap } from '../components/analytics/TopicMasteryHeatmap';
import { PredictiveAnalytics } from '../components/analytics/PredictiveAnalytics';
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';
import { useAnalyticsData } from '../hooks/useAnalyticsData';

type TimeRange = 'week' | 'month' | 'all';
type TabId = 'overview' | 'velocity' | 'mastery' | 'predictions';

interface TabButtonProps { label: string; icon: LucideIcon; isActive: boolean; onClick: () => void; }
const TabButton: FC<TabButtonProps> = ({ label, icon: Icon, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
    <Icon className="w-4 h-4" />{label}
  </button>
);

const TIME_LABELS: Record<TimeRange, string> = { week: 'Last 7 Days', month: 'Last 30 Days', all: 'All Time' };
const TABS: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'velocity', label: 'Learning Velocity', icon: Activity },
  { id: 'mastery', label: 'Topic Mastery', icon: Target },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp }
];

export default function Analytics() {
  const { analysisData, formatHour, loading: timeAnalysisLoading } = useTimeAnalysis();
  const { predictiveData, loading: predictiveLoading } = usePredictiveAnalytics();
  const { velocityData } = useLearningVelocity();
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const { analytics, loading } = useAnalyticsData(timeRange);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading analytics...</div></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-indigo-400" /><h1 className="text-3xl font-bold">Performance Analytics</h1></div>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(range => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {TIME_LABELS[range]}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-400">Comprehensive training metrics and performance insights</p>
        </div>
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-700">
            {TABS.map(tab => <TabButton key={tab.id} {...tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />)}
          </div>
        </div>
        {activeTab === 'overview' && <AnalyticsOverview analytics={analytics} analysisData={analysisData} timeAnalysisLoading={timeAnalysisLoading} formatHour={formatHour} formatDuration={formatDuration} formatTime={formatTime} />}
        {activeTab === 'velocity' && velocityData && <LearningVelocityChart data={velocityData} />}
        {activeTab === 'mastery' && <TopicMasteryHeatmap />}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {predictiveData && <PredictiveAnalytics data={predictiveData} />}
            {predictiveLoading && <div className="text-center py-8"><div className="text-gray-400">Generating predictions...</div></div>}
          </div>
        )}
      </div>
    </div>
  );
}
