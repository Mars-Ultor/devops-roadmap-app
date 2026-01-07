import React from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

interface AnalyticsData {
  weeklyProgress: Array<{
    week: string;
    sessions: number;
    avgScore: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    totalXP: number;
    skillsLearned: number;
  }>;
}

interface PerformanceTrendsProps {
  analytics: AnalyticsData;
}

const PerformanceTrends: React.FC<PerformanceTrendsProps> = ({ analytics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Weekly Progress */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Weekly Progress</h2>
        </div>

        <div className="space-y-4">
          {analytics.weeklyProgress.map((week, index) => (
            <div key={week.week} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{week.week}</div>
                  <div className="text-sm text-gray-400">{week.sessions} sessions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-400">{Math.round(week.avgScore)}%</div>
                <div className="text-sm text-gray-400">avg score</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold">Monthly Trends</h2>
        </div>

        <div className="space-y-4">
          {analytics.monthlyTrends.map((month) => (
            <div key={month.month} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="font-medium">{month.month}</div>
                  <div className="text-sm text-gray-400">{month.skillsLearned} skills learned</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-yellow-400">+{month.totalXP} XP</div>
                <div className="text-sm text-gray-400">total XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrends;