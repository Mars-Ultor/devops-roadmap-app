/**
 * Topic Mastery Heatmap
 * Visual representation of mastery levels across topics and weeks
 */

import { type FC } from 'react';
import { BookOpen, Target, Award, Flame } from 'lucide-react';

interface TopicMasteryData {
  topics: Array<{
    id: string;
    name: string;
    week: number;
    masteryLevel: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
    score: number;
    attempts: number;
    lastAttempt: Date;
    timeSpent: number;
  }>;
  weekStats: Array<{
    week: number;
    totalTopics: number;
    masteredTopics: number;
    avgMasteryLevel: number;
  }>;
}

interface TopicMasteryHeatmapProps {
  data?: TopicMasteryData;
}

export const TopicMasteryHeatmap: FC<TopicMasteryHeatmapProps> = ({ data }) => {
  // Handle undefined data gracefully
  if (!data) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        <div className="text-center">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Topic Mastery Data</h3>
          <p className="text-gray-500">Mastery heatmap data is being prepared...</p>
        </div>
      </div>
    );
  }

  const { topics, weekStats } = data;

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'run-independent':
        return 'bg-green-500';
      case 'run-guided':
        return 'bg-blue-500';
      case 'walk':
        return 'bg-yellow-500';
      case 'crawl':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getMasteryIcon = (level: string) => {
    switch (level) {
      case 'run-independent':
        return <Award className="w-3 h-3" />;
      case 'run-guided':
        return <Target className="w-3 h-3" />;
      case 'walk':
        return <BookOpen className="w-3 h-3" />;
      case 'crawl':
        return <Flame className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getMasteryLabel = (level: string) => {
    switch (level) {
      case 'run-independent':
        return 'Master';
      case 'run-guided':
        return 'Guided';
      case 'walk':
        return 'Learning';
      case 'crawl':
        return 'Struggle';
      default:
        return 'Unknown';
    }
  };

  // Group topics by week
  const topicsByWeek = topics.reduce((acc, topic) => {
    if (!acc[topic.week]) acc[topic.week] = [];
    acc[topic.week].push(topic);
    return acc;
  }, {} as Record<number, typeof topics>);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            Topic Mastery Heatmap
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Mastery levels across curriculum topics
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-300">Master</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Guided</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-slate-300">Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-slate-300">Struggle</span>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-6">
        {weekStats.map((week) => (
          <div key={week.week} className="bg-slate-900/50 rounded-lg p-3 text-center">
            <div className="text-xs text-slate-400 mb-1">W{week.week}</div>
            <div className="text-lg font-bold text-white">
              {Math.round((week.masteredTopics / week.totalTopics) * 100)}%
            </div>
            <div className="text-xs text-slate-500">
              {week.masteredTopics}/{week.totalTopics}
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="space-y-4">
        {Object.entries(topicsByWeek)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([week, weekTopics]) => (
            <div key={week} className="flex items-center gap-4">
              {/* Week Label */}
              <div className="w-12 text-sm text-slate-300 font-mono text-right">
                W{week}
              </div>

              {/* Topic Cells */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {weekTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`${getMasteryColor(topic.masteryLevel)} rounded-lg p-3 cursor-pointer hover:opacity-80 transition-opacity group relative`}
                    title={`${topic.name}: ${getMasteryLabel(topic.masteryLevel)} (${topic.score}%, ${topic.attempts} attempts)`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMasteryIcon(topic.masteryLevel)}
                        <span className="text-white text-xs font-medium truncate">
                          {topic.name}
                        </span>
                      </div>
                      <span className="text-white text-xs font-bold">
                        {topic.score}%
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <div className="font-semibold">{topic.name}</div>
                      <div>Level: {getMasteryLabel(topic.masteryLevel)}</div>
                      <div>Score: {topic.score}% | Attempts: {topic.attempts}</div>
                      <div>Time: {Math.round(topic.timeSpent / 60)}m</div>
                      <div>Last: {topic.lastAttempt.toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {topics.filter(t => t.masteryLevel === 'run-independent').length}
          </div>
          <div className="text-sm text-slate-400">Mastered Topics</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {topics.filter(t => t.masteryLevel === 'walk').length}
          </div>
          <div className="text-sm text-slate-400">Learning Topics</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {topics.filter(t => t.masteryLevel === 'crawl').length}
          </div>
          <div className="text-sm text-slate-400">Struggle Topics</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(topics.reduce((sum, t) => sum + t.score, 0) / topics.length)}%
          </div>
          <div className="text-sm text-slate-400">Avg Score</div>
        </div>
      </div>
    </div>
  );
};