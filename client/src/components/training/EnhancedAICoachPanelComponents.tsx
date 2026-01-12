/**
 * EnhancedAICoachPanelComponents - Extracted UI components
 */

import { Brain, Sparkles, MessageCircle, AlertTriangle } from 'lucide-react';
import type { CoachFeedback, CodeAnalysis } from '../../types/aiCoach';
import { getIconColor, getTypeLabel, getPriorityColor } from './EnhancedAICoachPanelUtils';

function getIssueSeverityStyles(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'bg-red-900/50 border border-red-700';
    case 'high':
      return 'bg-amber-900/50 border border-amber-700';
    default:
      return 'bg-slate-900/50';
  }
}

export function LoadingState() {
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

interface DisciplineAlertsProps {
  readonly alerts: string[];
}

export function DisciplineAlerts({ alerts }: DisciplineAlertsProps) {
  if (alerts.length === 0) return null;
  return (
    <div className="mb-4 space-y-2">
      {alerts.map((alert) => (
        <div key={alert} className="bg-red-900/50 border border-red-700 rounded p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-200 text-sm font-medium">{alert}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface FeedbackHeaderProps {
  readonly feedback: CoachFeedback | null;
}

export function FeedbackHeader({ feedback }: FeedbackHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className={`font-bold text-lg ${getIconColor(feedback)}`}>{getTypeLabel(feedback)}</span>
      {feedback?.priority && feedback.priority !== 'low' && (
        <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(feedback.priority)} text-white uppercase`}>
          {feedback.priority}
        </span>
      )}
      {feedback && feedback.confidence >= 0.9 && <Sparkles className="w-4 h-4 text-yellow-400" />}
    </div>
  );
}

interface FeedbackContentProps {
  readonly feedback: CoachFeedback;
}

export function FeedbackContent({ feedback }: FeedbackContentProps) {
  return (
    <div className="space-y-3">
      <p className="text-slate-200 leading-relaxed">{feedback.message}</p>
      {feedback.followUpQuestions && feedback.followUpQuestions.length > 0 && (
        <div className="bg-slate-900/50 rounded p-3">
          <div className="text-sm text-slate-300 font-medium mb-2">Follow-up Questions:</div>
          <ul className="space-y-1">
            {feedback.followUpQuestions.map((question) => (
              <li key={question} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>{question}
              </li>
            ))}
          </ul>
        </div>
      )}
      {feedback.context && (
        <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-900/50 rounded">
          Context: {feedback.context}
        </div>
      )}
    </div>
  );
}

interface CodeAnalysisDisplayProps {
  readonly analysis: CodeAnalysis;
}

export function CodeAnalysisDisplay({ analysis }: CodeAnalysisDisplayProps) {
  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium text-slate-300">Code Analysis:</div>
      {analysis.issues.length > 0 && (
        <div className="space-y-2">
          {analysis.issues.map((issue) => (
            <div key={issue.message} className={`p-3 rounded text-sm ${getIssueSeverityStyles(issue.severity)}`}>
              <div className="font-medium text-slate-200">{issue.message}</div>
              <div className="text-slate-400 mt-1">{issue.suggestion}</div>
            </div>
          ))}
        </div>
      )}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-slate-400">Suggestions:</div>
          {analysis.suggestions.map((suggestion) => (
            <div key={suggestion.description} className="p-2 bg-blue-900/20 border border-blue-700/50 rounded text-sm">
              <div className="text-blue-200">{suggestion.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface FeedbackFooterProps {
  readonly feedback: CoachFeedback | null;
  readonly loading: boolean;
  readonly onFetch: () => void;
}

export function FeedbackFooter({ feedback, loading, onFetch }: FeedbackFooterProps) {
  return (
    <div className="flex items-center justify-end mt-4 pt-3 border-t border-slate-700/50">
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-500">
          Confidence: {feedback ? Math.round(feedback.confidence * 100) : 0}%
        </div>
        <button onClick={onFetch} disabled={loading}
          className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors flex items-center gap-1">
          <MessageCircle className="w-3 h-3" />
          {loading ? 'Analyzing...' : 'Get Feedback'}
        </button>
      </div>
    </div>
  );
}
