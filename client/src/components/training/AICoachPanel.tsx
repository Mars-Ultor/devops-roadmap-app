/**
 * AICoachPanel - Real-time coaching feedback panel
 */

import { useState, useEffect } from 'react';
import { Brain, Sparkles, MessageCircle } from 'lucide-react';
import { getCoachFeedback, type CoachFeedback, type CoachContext } from '../../services/aiCoach';

interface AICoachPanelProps {
  context: CoachContext;
  autoUpdate?: boolean;
  updateInterval?: number; // ms
}

export default function AICoachPanel({ 
  context, 
  autoUpdate = false,
  updateInterval = 30000 // 30 seconds
}: AICoachPanelProps) {
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await getCoachFeedback(context);
      setFeedback(response);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching coach feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchFeedback();

    // Auto-update if enabled
    if (autoUpdate) {
      const interval = setInterval(fetchFeedback, updateInterval);
      return () => clearInterval(interval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.contentId, context.userProgress.attempts]);

  const getIconColor = () => {
    if (!feedback) return 'text-slate-400';
    switch (feedback.type) {
      case 'encouragement': return 'text-green-400';
      case 'hint': return 'text-blue-400';
      case 'warning': return 'text-amber-400';
      case 'insight': return 'text-purple-400';
      case 'question': return 'text-indigo-400';
      default: return 'text-slate-400';
    }
  };

  const getBorderColor = () => {
    if (!feedback) return 'border-slate-700';
    switch (feedback.type) {
      case 'encouragement': return 'border-green-500/30';
      case 'hint': return 'border-blue-500/30';
      case 'warning': return 'border-amber-500/30';
      case 'insight': return 'border-purple-500/30';
      case 'question': return 'border-indigo-500/30';
      default: return 'border-slate-700';
    }
  };

  const getBgColor = () => {
    if (!feedback) return 'bg-slate-800';
    switch (feedback.type) {
      case 'encouragement': return 'bg-green-900/20';
      case 'hint': return 'bg-blue-900/20';
      case 'warning': return 'bg-amber-900/20';
      case 'insight': return 'bg-purple-900/20';
      case 'question': return 'bg-indigo-900/20';
      default: return 'bg-slate-800';
    }
  };

  const getTypeLabel = () => {
    if (!feedback) return 'Coach';
    return feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1);
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
            <div className="text-sm text-slate-400">Analyzing your progress...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-4 transition-all ${getBorderColor()} ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0`}>
          <Brain className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`font-semibold ${getIconColor()}`}>
              {getTypeLabel()}
            </span>
            {feedback && feedback.confidence >= 0.8 && (
              <Sparkles className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          
          {feedback && (
            <p className="text-slate-200 leading-relaxed mb-3">
              {feedback.message}
            </p>
          )}

          {feedback?.context && (
            <div className="text-xs text-slate-400 mt-2 p-2 bg-slate-900/50 rounded">
              Context: {feedback.context}
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
            <div className="text-xs text-slate-500">
              Updated: {lastUpdate.toLocaleTimeString()}
            </div>
            <button
              onClick={fetchFeedback}
              disabled={loading}
              className="text-xs text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3" />
              {loading ? 'Updating...' : 'Get New Feedback'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
