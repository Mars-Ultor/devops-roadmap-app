import React from 'react';
import { Brain, TrendingUp, Award } from 'lucide-react';
import type { MasterTrainingState, MasterTrainingActions } from '../../hooks/useMasterTraining';

interface ProgressPhaseProps {
  state: MasterTrainingState;
  actions: MasterTrainingActions;
}

const ProgressPhase: React.FC<ProgressPhaseProps> = ({ state, actions }) => {
  const { adaptiveMetrics } = state;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          adaptiveMetrics.performanceScore >= 80 ? 'bg-green-500/20 text-green-400' :
          adaptiveMetrics.performanceScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Training Session Complete</h2>
        <p className="text-slate-400">
          Session Score: <span className="text-indigo-400 font-semibold">{adaptiveMetrics.performanceScore}%</span>
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard value={`${adaptiveMetrics.performanceScore}%`} label="Performance" color="indigo" />
        <MetricCard value={`${adaptiveMetrics.timeEfficiency}%`} label="Efficiency" color="green" />
        <MetricCard value={adaptiveMetrics.learningVelocity.toFixed(1)} label="Learning Rate" color="blue" />
        <MetricCard 
          value={`${adaptiveMetrics.difficultyAdjustment > 0 ? '+' : ''}${adaptiveMetrics.difficultyAdjustment}`} 
          label="Difficulty Adj." 
          color={adaptiveMetrics.difficultyAdjustment >= 0 ? 'green' : 'red'} 
        />
      </div>

      {/* AI Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <AIAnalysisPanel metrics={adaptiveMetrics} />
        <LearningInsightsPanel />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={actions.backToPathOverview}
          className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          Back to Learning Path
        </button>
        <button
          onClick={() => actions.goToPhase('selection')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
        >
          Choose New Path
        </button>
      </div>
    </div>
  );
};

interface MetricCardProps {
  value: string;
  label: string;
  color: 'indigo' | 'green' | 'blue' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, color }) => {
  const colorClasses = {
    indigo: 'text-indigo-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    red: 'text-red-400'
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
};

interface AIAnalysisPanelProps {
  metrics: {
    performanceScore: number;
    timeEfficiency: number;
    learningVelocity: number;
  };
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ metrics }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Brain className="w-5 h-5 mr-2 text-indigo-400" />
        AI Performance Analysis
      </h3>
      <div className="space-y-4">
        <ProgressBar label="Overall Performance" value={metrics.performanceScore} color="indigo" />
        <ProgressBar label="Time Efficiency" value={metrics.timeEfficiency} color="green" />
        <ProgressBar 
          label="Learning Velocity" 
          value={Math.min(metrics.learningVelocity * 10, 100)} 
          displayValue={metrics.learningVelocity.toString()}
          color="blue" 
        />
      </div>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  value: number;
  displayValue?: string;
  color: 'indigo' | 'green' | 'blue';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, displayValue, color }) => {
  const colorClasses = {
    indigo: { text: 'text-indigo-400', bg: 'bg-indigo-500' },
    green: { text: 'text-green-400', bg: 'bg-green-500' },
    blue: { text: 'text-blue-400', bg: 'bg-blue-500' }
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-300">{label}</span>
        <span className={`${colorClasses[color].text} font-semibold`}>
          {displayValue ?? `${value}%`}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2">
        <div 
          className={`${colorClasses[color].bg} h-2 rounded-full`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

const LearningInsightsPanel: React.FC = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
        Learning Insights
      </h3>
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Strengths</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Technical analysis</li>
            <li>• Problem prioritization</li>
            <li>• Systematic approach</li>
          </ul>
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Improvement Areas</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Time management</li>
            <li>• Stakeholder communication</li>
            <li>• Risk assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProgressPhase;
