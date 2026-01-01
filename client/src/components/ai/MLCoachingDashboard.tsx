/**
 * ML-Powered Coaching Dashboard
 * Comprehensive AI coaching with machine learning insights
 */

import { useState, useEffect } from 'react';
import { useMLEnhancedAICoach, useMLLearningPath, useMLSkillGapAnalysis, useMLPerformancePrediction, useMLLearningStyle } from '../../hooks/useMLEnhancedAICoach';
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
  BarChart3,
  Zap,
  RefreshCw
} from 'lucide-react';
import type { CoachContext } from '../../types/aiCoach';

interface MLCoachingDashboardProps {
  context?: CoachContext;
}

export function MLCoachingDashboard({ context }: MLCoachingDashboardProps) {
  const [currentContext, setCurrentContext] = useState<CoachContext | undefined>(context);

  // ML-powered hooks
  const {
    feedback,
    recommendations,
    loading: coachLoading,
    error: coachError,
    refreshInsights
  } = useMLEnhancedAICoach(currentContext);

  const { optimizedPath, loading: pathLoading, optimizePath } = useMLLearningPath();
  const { skillGaps, loading: gapLoading, analyzeGaps } = useMLSkillGapAnalysis();
  const { prediction, loading: predictionLoading, predictPerformance } = useMLPerformancePrediction();
  const { learningStyle, loading: styleLoading, detectStyle } = useMLLearningStyle();

  const [activeTab, setActiveTab] = useState<'overview' | 'learning-path' | 'skill-gaps' | 'performance' | 'style'>('overview');

  useEffect(() => {
    if (context) {
      setCurrentContext(context);
    }
  }, [context]);

  const handleRefreshAll = async () => {
    if (!currentContext) return;

    await Promise.all([
      refreshInsights(),
      optimizePath(currentContext),
      analyzeGaps(currentContext),
      predictPerformance(currentContext),
      detectStyle(currentContext)
    ]);
  };

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case 'encouragement': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'insight': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tactical_advice': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'discipline': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  if (!currentContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 text-center">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Please provide coaching context to enable ML-powered insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold">ML-Powered AI Coach</h2>
            <p className="text-gray-600">Intelligent coaching with machine learning insights</p>
          </div>
        </div>
        <button
          onClick={handleRefreshAll}
          disabled={coachLoading || pathLoading || gapLoading || predictionLoading || styleLoading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${coachLoading ? 'animate-spin' : ''}`} />
          Refresh Insights
        </button>
      </div>

      {/* Current Feedback */}
      {feedback && (
        <div className={`border-2 rounded-lg ${getFeedbackColor(feedback.type)}`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {getPriorityIcon(feedback.priority)}
              <h3 className="text-lg font-semibold">AI Coach Feedback</h3>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-auto">
                {feedback.confidence ? `${Math.round(feedback.confidence * 100)}%` : 'High'} confidence
              </span>
            </div>
          </div>
          <div className="p-6">
            <p className="text-lg mb-3">{feedback.message}</p>
            {feedback.context && (
              <p className="text-sm text-gray-600 mb-3">{feedback.context}</p>
            )}
            {feedback.followUpQuestions && feedback.followUpQuestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Follow-up questions:</p>
                <ul className="space-y-1">
                  {feedback.followUpQuestions.map((question, index) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'learning-path', label: 'Learning Path', icon: BookOpen },
          { id: 'skill-gaps', label: 'Skill Gaps', icon: Target },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'style', label: 'Learning Style', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'learning-path' | 'skill-gaps' | 'performance' | 'style')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Learning Style Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Learning Style</h3>
                </div>
              </div>
              <div className="p-6">
                {learningStyle ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{learningStyle.primary}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {Math.round(learningStyle.confidence * 100)}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      {learningStyle.recommendations.slice(0, 2).map((rec, index) => (
                        <p key={index} className="text-sm text-gray-600">• {rec}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Analyzing...</p>
                )}
              </div>
            </div>

            {/* Performance Prediction Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Completion Prediction</h3>
                </div>
              </div>
              <div className="p-6">
                {prediction ? (
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-indigo-600">
                      {Math.round(prediction.completionProbability * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">
                      Est. completion: {prediction.estimatedCompletionDate.toLocaleDateString()}
                    </p>
                    {prediction.riskFactors.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        {prediction.riskFactors.length} risk factor{prediction.riskFactors.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Calculating...</p>
                )}
              </div>
            </div>

            {/* Skill Gaps Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Skill Gaps</h3>
                </div>
              </div>
              <div className="p-6">
                {skillGaps.length > 0 ? (
                  <div className="space-y-3">
                    <div className="text-2xl font-bold text-red-600">
                      {skillGaps.length}
                    </div>
                    <p className="text-sm text-gray-600">areas need attention</p>
                    <div className="space-y-1">
                      {skillGaps.slice(0, 2).map((gap, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm truncate">{gap.topic}</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            gap.priority === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {gap.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No significant gaps detected</p>
                )}
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm md:col-span-2 lg:col-span-3">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">AI Recommendations</h3>
                </div>
              </div>
              <div className="p-6">
                {recommendations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 4).map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Generating recommendations...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learning-path' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <h3 className="text-lg font-semibold">ML-Optimized Learning Path</h3>
              </div>
            </div>
            <div className="p-6">
              {optimizedPath ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-2xl font-bold">{Math.round(optimizedPath.confidence * 100)}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Time</p>
                      <p className="text-2xl font-bold">{optimizedPath.estimatedTime}h</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-3">Recommended Next Topics:</p>
                    <div className="space-y-3">
                      {optimizedPath.topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{topic}</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Priority {index + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">{optimizedPath.reasoning}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing your optimal learning path...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'skill-gaps' && (
          <div className="space-y-6">
            {skillGaps.length > 0 ? (
              skillGaps.map((gap, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">{gap.topic}</h3>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        gap.priority === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : gap.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gap.priority} priority
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Gap Size</span>
                          <span>{Math.round(gap.gapSize * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${gap.gapSize * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                        <ul className="space-y-2">
                          {gap.recommendedActions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No significant skill gaps detected!</p>
                  <p className="text-sm text-gray-500">Keep up the great work.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-lg font-semibold">ML Performance Prediction</h3>
              </div>
            </div>
            <div className="p-6">
              {prediction ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-indigo-600">
                        {Math.round(prediction.completionProbability * 100)}%
                      </div>
                      <p className="text-sm text-gray-600">Completion Probability</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {prediction.estimatedCompletionDate.toLocaleDateString()}
                      </div>
                      <p className="text-sm text-gray-600">Estimated Completion</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {Math.ceil((prediction.estimatedCompletionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                      </p>
                    </div>
                  </div>

                  {prediction.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Risk Factors
                      </h4>
                      <div className="space-y-2">
                        {prediction.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Recommended Interventions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {prediction.interventions.map((intervention, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-green-800">{intervention}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing performance predictions...</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'style' && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="text-lg font-semibold">ML-Detected Learning Style</h3>
              </div>
            </div>
            <div className="p-6">
              {learningStyle ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600 capitalize mb-2">
                      {learningStyle.primary}
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-4">
                      {Math.round(learningStyle.confidence * 100)}% confidence
                    </span>
                    <p className="text-gray-600">
                      Your learning style has been analyzed based on your interaction patterns,
                      performance data, and engagement metrics.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Personalized Recommendations:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {learningStyle.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                          <Lightbulb className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-indigo-800">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Why This Matters:</h4>
                    <p className="text-sm text-gray-600">
                      Tailoring your learning approach to your preferred style can significantly
                      improve comprehension, retention, and overall learning effectiveness.
                      The AI coach will adapt its recommendations based on this analysis.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Detecting your learning style...</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {(coachError) && (
        <div className="border border-red-200 bg-red-50 rounded-lg">
          <div className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <p className="text-sm">ML Analysis Error: {coachError}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}