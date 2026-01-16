import React from 'react';
import { Brain, ChevronRight } from 'lucide-react';

const AIInsights: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20 p-6 mb-8">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-indigo-400" />
        AI Learning Insights
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-white font-medium mb-2">Recommended Focus Areas</h4>
          <ul className="space-y-1">
            <li className="flex items-center text-slate-300 text-sm">
              <ChevronRight className="w-3 h-3 mr-2 text-indigo-400" />
              Decision-making under pressure
            </li>
            <li className="flex items-center text-slate-300 text-sm">
              <ChevronRight className="w-3 h-3 mr-2 text-indigo-400" />
              Cross-team communication
            </li>
            <li className="flex items-center text-slate-300 text-sm">
              <ChevronRight className="w-3 h-3 mr-2 text-indigo-400" />
              Technical deep dives
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2">Learning Style Adaptation</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <p>• Scenarios will adapt based on your performance</p>
            <p>• Difficulty scales with mastery level</p>
            <p>• Focus on identified growth areas</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;