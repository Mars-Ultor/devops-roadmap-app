import React from "react";
import { TrendingDown } from "lucide-react";

interface WeakTopic {
  topic: string;
  easinessFactor: number;
  attempts: number;
  lastAttempt: Date;
}

interface AnalyticsData {
  weakTopics: WeakTopic[];
}

interface WeakAreasProps {
  analytics: AnalyticsData;
}

const WeakAreas: React.FC<WeakAreasProps> = ({ analytics }) => {
  if (!analytics?.weakTopics || analytics.weakTopics.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <TrendingDown className="w-6 h-6 text-red-400" />
        <h2 className="text-xl font-semibold">Areas Needing Review</h2>
      </div>

      <div className="space-y-3">
        {analytics.weakTopics.map((topic) => (
          <div
            key={topic.topic}
            className="bg-gray-900/50 border border-red-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-white">{topic.topic}</div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
                  EF: {topic.easinessFactor.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  {topic.attempts} attempts
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.max(((topic.easinessFactor - 1.3) / (2.5 - 1.3)) * 100, 5)}%`,
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Last attempt: {topic.lastAttempt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-300">
          💡 <span className="font-semibold">Priority:</span> Focus review
          sessions on these topics to improve retention and mastery.
        </p>
      </div>
    </div>
  );
};

export default WeakAreas;
