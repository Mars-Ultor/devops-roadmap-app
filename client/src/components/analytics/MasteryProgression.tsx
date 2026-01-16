import React from 'react';
import { Trophy, Target, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  masteryLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  skillsMastered: number;
  totalSkills: number;
  currentStreak: number;
  longestStreak: number;
}

interface MasteryProgressionProps {
  analytics: AnalyticsData;
}

const MasteryProgression: React.FC<MasteryProgressionProps> = ({ analytics }) => {
  const masteryProgress = (analytics.totalXP / (analytics.totalXP + analytics.xpToNextLevel)) * 100;
  const skillsProgress = (analytics.skillsMastered / analytics.totalSkills) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Mastery Level */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-semibold">Mastery Level</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{analytics.masteryLevel}</div>
            <div className="text-sm text-gray-400">Current Level</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">XP Progress</span>
              <span className="text-white">{analytics.totalXP} / {analytics.totalXP + analytics.xpToNextLevel}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all"
                style={{ width: `${masteryProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skills Mastery */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold">Skills Mastery</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{analytics.skillsMastered}</div>
            <div className="text-sm text-gray-400">of {analytics.totalSkills} mastered</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Progress</span>
              <span className="text-white">{Math.round(skillsProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${skillsProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Streaks */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold">Streaks</h2>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{analytics.currentStreak}</div>
            <div className="text-sm text-gray-400">Current Streak</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Longest Streak</span>
              <span className="text-white font-semibold">{analytics.longestStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Current</span>
              <span className="text-green-400 font-semibold">{analytics.currentStreak}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MasteryProgression;