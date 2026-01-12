/* eslint-disable max-lines-per-function */
/**
 * Predictive Analytics Dashboard
 * Estimates completion times and predicts learning outcomes
 */

import type { FC } from 'react';
import { Sparkles, TrendingUp, Target, AlertTriangle, CheckCircle } from 'lucide-react';

interface PredictiveData {
  completionPrediction: {
    estimatedCompletionDate: Date;
    confidence: number; // 0-100
    remainingWeeks: number;
    remainingItems: number;
    currentPace: number; // items per week
    requiredPace: number; // items per week to meet goal
    riskFactors: string[];
  };
  weakAreaPredictions: Array<{
    topic: string;
    riskLevel: 'low' | 'medium' | 'high';
    predictedStruggles: string;
    preventiveActions: string[];
    estimatedDifficulty: number; // 1-10
  }>;
  performanceForecast: {
    nextWeekPrediction: {
      expectedItems: number;
      expectedMastery: number;
      confidence: number;
    };
    monthProjection: {
      totalItems: number;
      masteryRate: number;
      skillImprovements: string[];
    };
  };
  learningTrajectory: {
    currentTrajectory: 'accelerating' | 'steady' | 'plateauing' | 'declining';
    optimalTrajectory: 'accelerating' | 'steady';
    adjustments: string[];
  };
}

interface PredictiveAnalyticsProps {
  data: PredictiveData;
}

export const PredictiveAnalytics: FC<PredictiveAnalyticsProps> = ({ data }) => {
  const {
    completionPrediction,
    weakAreaPredictions,
    performanceForecast,
    learningTrajectory
  } = data;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-900/20 border-red-700 text-red-300';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-700 text-yellow-300';
      case 'low':
        return 'bg-green-900/20 border-green-700 text-green-300';
      default:
        return 'bg-blue-900/20 border-blue-700 text-blue-300';
    }
  };

  const getTrajectoryColor = (trajectory: string) => {
    switch (trajectory) {
      case 'accelerating':
        return 'text-green-400';
      case 'steady':
        return 'text-blue-400';
      case 'plateauing':
        return 'text-yellow-400';
      case 'declining':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-900/30 text-green-300';
    if (confidence >= 60) return 'bg-blue-900/30 text-blue-300';
    if (confidence >= 40) return 'bg-yellow-900/30 text-yellow-300';
    return 'bg-red-900/30 text-red-300';
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Predictive Analytics
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            AI-powered predictions for your learning journey
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge(completionPrediction.confidence)}`}>
          {completionPrediction.confidence}% confidence
        </div>
      </div>

      {/* Completion Prediction */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-green-400" />
            Completion Prediction
          </h4>
          <span className="text-green-400 text-sm font-semibold">
            {completionPrediction.remainingWeeks} weeks remaining
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Estimated Completion</div>
            <div className="text-xl font-bold text-white">
              {completionPrediction.estimatedCompletionDate.toLocaleDateString()}
            </div>
            <div className="text-xs text-slate-500">
              {Math.round((completionPrediction.estimatedCompletionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Current Pace</div>
            <div className="text-xl font-bold text-blue-400">
              {completionPrediction.currentPace}
            </div>
            <div className="text-xs text-slate-500">items/week</div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Required Pace</div>
            <div className="text-xl font-bold text-indigo-400">
              {completionPrediction.requiredPace}
            </div>
            <div className="text-xs text-slate-500">items/week</div>
          </div>
        </div>

        {/* Pace Comparison */}
        <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm">Pace Progress</span>
            <span className="text-slate-400 text-sm">
              {Math.round((completionPrediction.currentPace / completionPrediction.requiredPace) * 100)}% of required
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                completionPrediction.currentPace >= completionPrediction.requiredPace ? 'bg-green-500' : 'bg-yellow-500'
              }`}
              style={{ width: `${Math.min((completionPrediction.currentPace / completionPrediction.requiredPace) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Risk Factors */}
        {completionPrediction.riskFactors.length > 0 && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h5 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Factors
            </h5>
            <ul className="space-y-1">
              {completionPrediction.riskFactors.map((risk) => (
                <li key={risk} className="text-red-300 text-sm flex items-start gap-2">
                  <span>•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Weak Area Predictions */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          Predicted Challenge Areas
        </h4>

        <div className="space-y-3">
          {weakAreaPredictions.map((prediction) => (
            <div key={prediction.topic} className={`rounded-lg p-4 border ${getRiskColor(prediction.riskLevel)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{prediction.topic}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold capitalize">
                    {prediction.riskLevel} Risk
                  </span>
                  <span className="text-xs opacity-75">
                    Difficulty: {prediction.estimatedDifficulty}/10
                  </span>
                </div>
              </div>

              <p className="text-sm mb-3 opacity-90">{prediction.predictedStruggles}</p>

              <div>
                <h6 className="text-sm font-semibold mb-2">Preventive Actions:</h6>
                <ul className="space-y-1">
                  {prediction.preventiveActions.map((action) => (
                    <li key={action} className="text-sm flex items-start gap-2 opacity-85">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Forecast */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Performance Forecast
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h5 className="text-blue-400 font-semibold mb-3">Next Week Prediction</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Expected Items:</span>
                <span className="text-white font-semibold">{performanceForecast.nextWeekPrediction.expectedItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Expected Mastery:</span>
                <span className="text-white font-semibold">{performanceForecast.nextWeekPrediction.expectedMastery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Confidence:</span>
                <span className={`font-semibold ${getConfidenceBadge(performanceForecast.nextWeekPrediction.confidence).split(' ')[1]}`}>
                  {performanceForecast.nextWeekPrediction.confidence}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <h5 className="text-purple-400 font-semibold mb-3">Month Projection</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Total Items:</span>
                <span className="text-white font-semibold">{performanceForecast.monthProjection.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Mastery Rate:</span>
                <span className="text-white font-semibold">{performanceForecast.monthProjection.masteryRate}%</span>
              </div>
              <div className="text-sm text-slate-400 mt-2">
                Key improvements: {performanceForecast.monthProjection.skillImprovements.join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Trajectory */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white">Learning Trajectory</h4>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Current:</span>
            <span className={`font-semibold capitalize ${getTrajectoryColor(learningTrajectory.currentTrajectory)}`}>
              {learningTrajectory.currentTrajectory}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-indigo-400 font-semibold mb-2">Optimal Trajectory</h5>
            <p className="text-slate-300 text-sm capitalize">{learningTrajectory.optimalTrajectory}</p>
          </div>

          <div>
            <h5 className="text-indigo-400 font-semibold mb-2">Recommended Adjustments</h5>
            <ul className="space-y-1">
              {learningTrajectory.adjustments.map((adjustment) => (
                <li key={adjustment} className="text-slate-300 text-sm flex items-start gap-2">
                  <span className="text-indigo-400">•</span>
                  <span>{adjustment}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};