/**
 * Enhanced AI Coach Panel - Military Training Methodology
 * Advanced coaching interface with real-time analysis and discipline enforcement
 */

import { useState, useEffect, useRef } from 'react';
import { Brain, Sparkles, MessageCircle, AlertTriangle, Target, Zap, Shield } from 'lucide-react';
import { aiCoachService } from '../../services/aiCoachEnhanced';
import type { CoachFeedback, CoachContext, CodeAnalysis } from '../../types/aiCoach';

interface EnhancedAICoachPanelProps {
  context: CoachContext;
  autoUpdate?: boolean;
  updateInterval?: number;
  showCodeAnalysis?: boolean;
  codeSnippet?: string;
  onDisciplineAction?: (action: string) => void;
  militaryMode?: boolean;
}

export default function EnhancedAICoachPanel({
  context,
  autoUpdate = true,
  updateInterval = 15000, // 15 seconds for more responsive feedback
  showCodeAnalysis = false,
  codeSnippet,
  onDisciplineAction,
  militaryMode = true
}: EnhancedAICoachPanelProps) {
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date()); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [codeAnalysis, setCodeAnalysis] = useState<CodeAnalysis | null>(null);
  const [disciplineAlerts, setDisciplineAlerts] = useState<string[]>([]);
  const intervalRef = useRef<number | null>(null);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await aiCoachService.getEnhancedCoachFeedback(context);
      setFeedback(response);
      setLastUpdate(new Date());

      // Handle discipline actions
      if (response.type === 'discipline' && response.actionRequired && onDisciplineAction) {
        onDisciplineAction(response.message);
        setDisciplineAlerts(prev => [...prev, response.message].slice(-3)); // Keep last 3
      }

      // Code analysis if enabled
      if (showCodeAnalysis && codeSnippet) {
        const analysis = await aiCoachService.analyzeCode(codeSnippet);
        setCodeAnalysis(analysis);
      }
    } catch (error) {
      console.error('Error fetching enhanced coach feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFeedback();

    // Auto-update if enabled
    if (autoUpdate) {
      intervalRef.current = setInterval(fetchFeedback, updateInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [context.contentId, context.userProgress.attempts, context.userProgress.timeSpent]);

  // Military mode styling
  const getMilitaryStyling = () => {
    if (!militaryMode) return {};

    return {
      border: feedback?.type === 'discipline' ? 'border-red-500/50' :
             feedback?.priority === 'critical' ? 'border-red-400/50' :
             feedback?.priority === 'high' ? 'border-amber-400/50' : 'border-slate-700',
      background: feedback?.type === 'discipline' ? 'bg-red-900/20' :
                 feedback?.priority === 'critical' ? 'bg-red-900/10' :
                 feedback?.priority === 'high' ? 'bg-amber-900/10' : 'bg-slate-800'
    };
  };

  const getIcon = () => {
    if (!feedback) return Brain;

    switch (feedback.type) {
      case 'discipline': return Shield;
      case 'tactical_advice': return Target;
      case 'warning': return AlertTriangle;
      case 'hint': return Zap;
      default: return Brain;
    }
  };

  const getIconColor = () => {
    if (!feedback) return 'text-slate-400';

    switch (feedback.type) {
      case 'discipline': return 'text-red-400';
      case 'tactical_advice': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'hint': return 'text-blue-400';
      case 'insight': return 'text-purple-400';
      case 'question': return 'text-indigo-400';
      case 'encouragement': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  const getTypeLabel = () => {
    if (!feedback) return 'AI Coach';

    const labels = {
      discipline: 'DISCIPLINE',
      tactical_advice: 'TACTICAL',
      warning: 'WARNING',
      hint: 'GUIDANCE',
      insight: 'INSIGHT',
      question: 'COACHING',
      encouragement: 'AFFIRMATION'
    };

    return labels[feedback.type as keyof typeof labels] || 'COACH';
  };

  const getPriorityBadge = () => {
    if (!feedback?.priority || feedback.priority === 'low') return null;

    const colors = {
      medium: 'bg-blue-600',
      high: 'bg-amber-600',
      critical: 'bg-red-600'
    };

    return (
      <span className={`px-2 py-1 text-xs font-bold rounded ${colors[feedback.priority]} text-white uppercase`}>
        {feedback.priority}
      </span>
    );
  };

  if (loading && !feedback) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="text-white font-semibold">AI Coach</div>
            <div className="text-sm text-slate-400">Analyzing performance...</div>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = getIcon();
  const militaryStyle = getMilitaryStyling();

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${militaryStyle.border} ${militaryStyle.background}`}>
      {/* Discipline Alerts */}
      {disciplineAlerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {disciplineAlerts.map((alert, index) => (
            <div key={index} className="bg-red-900/50 border border-red-700 rounded p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-200 text-sm font-medium">{alert}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Feedback */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-bold text-lg ${getIconColor()}`}>
              {getTypeLabel()}
            </span>
            {getPriorityBadge()}
            {feedback && feedback.confidence >= 0.9 && (
              <Sparkles className="w-4 h-4 text-yellow-400" />
            )}
          </div>

          {feedback && (
            <div className="space-y-3">
              <p className="text-slate-200 leading-relaxed">
                {feedback.message}
              </p>

              {/* Follow-up Questions */}
              {feedback.followUpQuestions && feedback.followUpQuestions.length > 0 && (
                <div className="bg-slate-900/50 rounded p-3">
                  <div className="text-sm text-slate-300 font-medium mb-2">Follow-up Questions:</div>
                  <ul className="space-y-1">
                    {feedback.followUpQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-slate-400 flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Context Info */}
              {feedback.context && (
                <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-900/50 rounded">
                  Context: {feedback.context}
                </div>
              )}
            </div>
          )}

          {/* Code Analysis */}
          {codeAnalysis && showCodeAnalysis && (
            <div className="mt-4 space-y-3">
              <div className="text-sm font-medium text-slate-300">Code Analysis:</div>

              {codeAnalysis.issues.length > 0 && (
                <div className="space-y-2">
                  {codeAnalysis.issues.map((issue, index) => (
                    <div key={index} className={`p-3 rounded text-sm ${
                      issue.severity === 'critical' ? 'bg-red-900/50 border border-red-700' :
                      issue.severity === 'high' ? 'bg-amber-900/50 border border-amber-700' :
                      'bg-slate-900/50'
                    }`}>
                      <div className="font-medium text-slate-200">{issue.message}</div>
                      <div className="text-slate-400 mt-1">{issue.suggestion}</div>
                    </div>
                  ))}
                </div>
              )}

              {codeAnalysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">Suggestions:</div>
                  {codeAnalysis.suggestions.map((suggestion, index) => (
                    <div key={index} className="p-2 bg-blue-900/20 border border-blue-700/50 rounded text-sm">
                      <div className="text-blue-200">{suggestion.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="text-xs text-slate-500">
                Confidence: {feedback ? Math.round(feedback.confidence * 100) : 0}%
              </div>
              <button
                onClick={fetchFeedback}
                disabled={loading}
                className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                {loading ? 'Analyzing...' : 'Get Feedback'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}