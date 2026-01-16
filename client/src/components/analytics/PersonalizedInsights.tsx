import React from 'react';
import { Award } from 'lucide-react';

interface AnalyticsData {
  bestStudyHour: number;
  currentStreak: number;
  masteryRate: number;
  quizSuccessRate: number;
  resetTokensUsed: number;
  battleDrillSuccessRate: number;
}

interface PersonalizedInsightsProps {
  analytics: AnalyticsData;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ analytics }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Award className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold">Personalized Insights</h2>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="text-indigo-400">→</span>
          <span className="text-gray-300">
            <strong>Study Pattern:</strong> Your most productive hour is {analytics.bestStudyHour > 12 ? analytics.bestStudyHour - 12 : analytics.bestStudyHour}{analytics.bestStudyHour >= 12 ? 'PM' : 'AM'}.
            Schedule important sessions during this time.
          </span>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-indigo-400">→</span>
          <span className="text-gray-300">
            <strong>Consistency:</strong> Current streak is {analytics.currentStreak} days. {analytics.currentStreak >= 7 ? '🔥 Excellent discipline!' : 'Aim for 7+ days to build lasting habits.'}
          </span>
        </div>

        {analytics.masteryRate < 0.3 && (
          <div className="flex items-start gap-3">
            <span className="text-yellow-400">→</span>
            <span className="text-gray-300">
              <strong>Mastery Focus:</strong> Only {Math.round(analytics.masteryRate * 100)}% of items at Run-Independent level. Focus on completing Battle Drills to build muscle memory.
            </span>
          </div>
        )}

        {analytics.quizSuccessRate < 0.7 && (
          <div className="flex items-start gap-3">
            <span className="text-orange-400">→</span>
            <span className="text-gray-300">
              <strong>Quiz Performance:</strong> Success rate at {Math.round(analytics.quizSuccessRate * 100)}%. Review AAR feedback and focus on weak topics before retrying.
            </span>
          </div>
        )}

        {analytics.resetTokensUsed > 5 && (
          <div className="flex items-start gap-3">
            <span className="text-red-400">→</span>
            <span className="text-gray-300">
              <strong>Reset Token Usage:</strong> {analytics.resetTokensUsed} resets used. High reset count suggests rushing through content. Slow down and focus on understanding.
            </span>
          </div>
        )}

        {analytics.battleDrillSuccessRate > 0.8 && (
          <div className="flex items-start gap-3">
            <span className="text-green-400">→</span>
            <span className="text-gray-300">
              <strong>Battle Drill Excellence:</strong> {Math.round(analytics.battleDrillSuccessRate * 100)}% success rate! Your muscle memory is strong. Ready for production scenarios.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedInsights;