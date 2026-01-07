/**
 * EnhancedAICoachPanel - Military Training Methodology
 * Refactored to use extracted components and custom hook
 */

import type { CoachContext } from '../../types/aiCoach';
import { getMilitaryStyling, getIcon } from './EnhancedAICoachPanelUtils';
import {
  LoadingState,
  DisciplineAlerts,
  FeedbackHeader,
  FeedbackContent,
  CodeAnalysisDisplay,
  FeedbackFooter
} from './EnhancedAICoachPanelComponents';
import { useEnhancedAICoach } from './useEnhancedAICoach';

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
  updateInterval = 15000,
  showCodeAnalysis = false,
  codeSnippet,
  onDisciplineAction,
  militaryMode = true
}: EnhancedAICoachPanelProps) {
  const { feedback, loading, codeAnalysis, disciplineAlerts, fetchFeedback } = useEnhancedAICoach({
    context, autoUpdate, updateInterval, showCodeAnalysis, codeSnippet, onDisciplineAction
  });

  if (loading && !feedback) return <LoadingState />;

  const militaryStyle = getMilitaryStyling(feedback, militaryMode);
  const IconComponent = getIcon(feedback);

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${militaryStyle.border} ${militaryStyle.background}`}>
      <DisciplineAlerts alerts={disciplineAlerts} />

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          <FeedbackHeader feedback={feedback} />
          {feedback && <FeedbackContent feedback={feedback} />}
          {codeAnalysis && showCodeAnalysis && <CodeAnalysisDisplay analysis={codeAnalysis} />}
          <FeedbackFooter feedback={feedback} loading={loading} onFetch={fetchFeedback} />
        </div>
      </div>
    </div>
  );
}
