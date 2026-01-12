/**
 * MLCoachingComponents - Extracted UI components for MLCoachingDashboard
 * These components handle the tab-based display of ML coaching insights
 */

import {
  Brain,
  Target,
  TrendingUp,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Users,
  Calendar,
  Zap
} from 'lucide-react';

// Inline types matching MLCoachInsights from mlEnhancedAICoach service
export interface OptimizedPath {
  topics: string[];
  estimatedTime: number;
  confidence: number;
  reasoning: string;
}

export interface SkillGap {
  topic: string;
  gapSize: number;
  priority: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

export interface PerformancePrediction {
  completionProbability: number;
  estimatedCompletionDate: Date;
  riskFactors: string[];
  interventions: string[];
}

export interface LearningStyleResult {
  primary: 'visual' | 'kinesthetic' | 'reading' | 'auditory';
  confidence: number;
  recommendations: string[];
}

// ============================================================================
// Overview Tab Components
// ============================================================================

interface LearningStyleCardProps {
  readonly learningStyle: LearningStyleResult | null;
}

export function LearningStyleCard({ learningStyle }: LearningStyleCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Learning Style</h3>
        </div>
      </div>
      <div className="p-6">
        {learningStyle ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white capitalize">{learningStyle.primary}</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                {Math.round(learningStyle.confidence * 100)}%
              </span>
            </div>
            <div className="space-y-1">
              {learningStyle.recommendations.slice(0, 2).map((rec) => (
                <p key={rec} className="text-sm text-gray-400">• {rec}</p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Analyzing...</p>
        )}
      </div>
    </div>
  );
}

interface PerformancePredictionCardProps {
  readonly prediction: PerformancePrediction | null;
}

export function PerformancePredictionCard({ prediction }: PerformancePredictionCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Completion Prediction</h3>
        </div>
      </div>
      <div className="p-6">
        {prediction ? (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-indigo-400">
              {Math.round(prediction.completionProbability * 100)}%
            </div>
            <p className="text-sm text-gray-400">
              Est. completion: {prediction.estimatedCompletionDate.toLocaleDateString()}
            </p>
            {prediction.riskFactors.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="w-4 h-4" />
                {prediction.riskFactors.length} risk factor{prediction.riskFactors.length === 1 ? '' : 's'}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Calculating...</p>
        )}
      </div>
    </div>
  );
}

interface SkillGapsCardProps {
  readonly skillGaps: SkillGap[];
}

export function SkillGapsCard({ skillGaps }: SkillGapsCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Skill Gaps</h3>
        </div>
      </div>
      <div className="p-6">
        {skillGaps.length > 0 ? (
          <div className="space-y-3">
            <div className="text-2xl font-bold text-red-400">
              {skillGaps.length}
            </div>
            <p className="text-sm text-gray-400">areas need attention</p>
            <div className="space-y-1">
              {skillGaps.slice(0, 2).map((gap) => (
                <div key={gap.topic} className="flex items-center justify-between">
                  <span className="text-sm text-white truncate">{gap.topic}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    gap.priority === 'high' 
                      ? 'bg-red-900/30 text-red-300' 
                      : 'bg-gray-700 text-gray-300'
                  }`}>
                    {gap.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No significant gaps detected</p>
        )}
      </div>
    </div>
  );
}

interface RecommendationsCardProps {
  readonly recommendations: string[];
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">AI Recommendations</h3>
        </div>
      </div>
      <div className="p-6">
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 4).map((rec) => (
              <div key={rec} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Generating recommendations...</p>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Learning Path Tab Component
// ============================================================================

interface LearningPathTabProps {
  readonly optimizedPath: OptimizedPath | null;
}

export function LearningPathTab({ optimizedPath }: LearningPathTabProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">ML-Optimized Learning Path</h3>
        </div>
      </div>
      <div className="p-6">
        {optimizedPath ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Confidence</p>
                <p className="text-2xl font-bold text-indigo-400">{Math.round(optimizedPath.confidence * 100)}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Estimated Time</p>
                <p className="text-2xl font-bold text-white">{optimizedPath.estimatedTime}h</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-3">Recommended Next Topics:</p>
              <div className="space-y-3">
                {optimizedPath.topics.map((topic, index) => (
                  <div key={topic} className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{topic}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-gray-300">
                      Priority {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300">{optimizedPath.reasoning}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Analyzing your optimal learning path...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Skill Gaps Tab Component
// ============================================================================

interface SkillGapsTabProps {
  readonly skillGaps: SkillGap[];
}

export function SkillGapsTab({ skillGaps }: SkillGapsTabProps) {
  if (skillGaps.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
        <div className="p-6 text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="text-gray-400">No significant skill gaps detected!</p>
          <p className="text-sm text-gray-500">Keep up the great work.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {skillGaps.map((gap) => (
        <SkillGapItem key={gap.topic} gap={gap} />
      ))}
    </div>
  );
}

interface SkillGapItemProps {
  readonly gap: SkillGap;
}

function SkillGapItem({ gap }: SkillGapItemProps) {
  const getPriorityBadgeClass = (priority: 'high' | 'medium' | 'low') => {
    if (priority === 'high') return 'bg-red-900/20 text-red-400 border border-red-800';
    if (priority === 'medium') return 'bg-yellow-900/20 text-yellow-400 border border-yellow-800';
    return 'bg-slate-700 text-gray-300';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">{gap.topic}</h3>
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(gap.priority)}`}>
            {gap.priority} priority
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Gap Size</span>
              <span className="text-white">{Math.round(gap.gapSize * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full"
                style={{ width: `${gap.gapSize * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Recommended Actions:</p>
            <ul className="space-y-2">
              {gap.recommendedActions.map((action) => (
                <li key={action} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Performance Tab Component
// ============================================================================

interface PerformanceTabProps {
  readonly prediction: PerformancePrediction | null;
}

export function PerformanceTab({ prediction }: PerformanceTabProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">ML Performance Prediction</h3>
        </div>
      </div>
      <div className="p-6">
        {prediction ? (
          <PerformanceContent prediction={prediction} />
        ) : (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Analyzing performance predictions...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PerformanceContent({ prediction }: { readonly prediction: PerformancePrediction }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-400">
            {Math.round(prediction.completionProbability * 100)}%
          </div>
          <p className="text-sm text-gray-400">Completion Probability</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">
            {prediction.estimatedCompletionDate.toLocaleDateString()}
          </div>
          <p className="text-sm text-gray-400">Estimated Completion</p>
        </div>
        <div className="text-center">
          <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            {Math.ceil((prediction.estimatedCompletionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
          </p>
        </div>
      </div>

      {prediction.riskFactors.length > 0 && (
        <div>
          <h4 className="font-medium text-red-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Factors
          </h4>
          <div className="space-y-2">
            {prediction.riskFactors.map((risk) => (
              <div key={risk} className="flex items-start gap-2 p-3 bg-red-900/20 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-300">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="font-medium text-green-400 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-400" />
          Recommended Interventions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.interventions.map((intervention) => (
            <div key={intervention} className="flex items-start gap-2 p-3 bg-green-900/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-300">{intervention}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Learning Style Tab Component
// ============================================================================

interface LearningStyleTabProps {
  readonly learningStyle: LearningStyleResult | null;
}

export function LearningStyleTab({ learningStyle }: LearningStyleTabProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">ML-Detected Learning Style</h3>
        </div>
      </div>
      <div className="p-6">
        {learningStyle ? (
          <LearningStyleContent learningStyle={learningStyle} />
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Detecting your learning style...</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LearningStyleContent({ learningStyle }: { readonly learningStyle: LearningStyleResult }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-indigo-400 capitalize mb-2">
          {learningStyle.primary}
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-600 text-gray-300 mb-4">
          {Math.round(learningStyle.confidence * 100)}% confidence
        </span>
        <p className="text-gray-400">
          Your learning style has been analyzed based on your interaction patterns,
          performance data, and engagement metrics.
        </p>
      </div>

      <div>
        <h4 className="font-medium text-white mb-3">Personalized Recommendations:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {learningStyle.recommendations.map((rec) => (
            <div key={rec} className="flex items-start gap-3 p-3 bg-gray-700 rounded-lg">
              <Lightbulb className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-700 p-4 rounded-lg">
        <h4 className="font-medium text-white mb-2">Why This Matters:</h4>
        <p className="text-sm text-gray-400">
          Tailoring your learning approach to your preferred style can significantly
          improve comprehension, retention, and overall learning effectiveness.
          The AI coach will adapt its recommendations based on this analysis.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Common UI Components
// ============================================================================

interface NoContextDisplayProps {
  readonly message?: string;
}

export function NoContextDisplay({ message }: NoContextDisplayProps) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-sm">
      <div className="p-6 text-center">
        <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">{message || 'Please provide coaching context to enable ML-powered insights.'}</p>
      </div>
    </div>
  );
}

interface ErrorDisplayProps {
  readonly error: string;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="border border-red-800 bg-red-900/20 rounded-lg">
      <div className="p-4">
        <div className="flex items-center gap-2 text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <p className="text-sm">ML Analysis Error: {error}</p>
        </div>
      </div>
    </div>
  );
}
