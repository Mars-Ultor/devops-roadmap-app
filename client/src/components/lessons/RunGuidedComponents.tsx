/**
 * RunGuidedWorkspace Components
 * Extracted UI components for the run-guided level workspace
 */

import { useState } from 'react';
import { Clock, Save, CheckCircle, FileText, Lightbulb, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface TimerBarProps {
  readonly elapsedTime: number;
  readonly wordCount: number;
  readonly completedCheckpoints: number;
  readonly totalCheckpoints: number;
  readonly onSaveDraft: () => void;
}

export function RunGuidedTimerBar({
  elapsedTime,
  wordCount,
  completedCheckpoints,
  totalCheckpoints,
  onSaveDraft
}: TimerBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const allComplete = completedCheckpoints === totalCheckpoints && totalCheckpoints > 0;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 text-yellow-400">
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
        </div>
        <div className="text-slate-400 text-sm">
          <span className="font-semibold text-white">{wordCount}</span> words
        </div>
        <div className={`flex items-center space-x-2 ${allComplete ? 'text-green-400' : 'text-slate-400'}`}>
          <CheckCircle className="w-5 h-5" />
          <span>{completedCheckpoints}/{totalCheckpoints} checkpoints</span>
        </div>
      </div>
      <button
        onClick={onSaveDraft}
        className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300"
      >
        <Save className="w-4 h-4" />
        <span>Save Draft</span>
      </button>
    </div>
  );
}

interface Checkpoint {
  checkpoint: string;
  description: string;
  validationCriteria?: string[];
  hintIfStuck?: string;
}

interface CheckpointCardProps {
  readonly checkpoint: Checkpoint;
  readonly index: number;
  readonly isComplete: boolean;
  readonly response: string;
  readonly onToggleComplete: () => void;
  readonly onResponseChange: (value: string) => void;
  readonly onHintUsed: () => void;
}

export function CheckpointCard({
  checkpoint,
  index,
  isComplete,
  response,
  onToggleComplete,
  onResponseChange,
  onHintUsed
}: CheckpointCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleHintClick = () => {
    if (!showHint) onHintUsed();
    setShowHint(!showHint);
  };

  return (
    <div className={`bg-slate-800 rounded-lg border transition ${isComplete ? 'border-green-600' : 'border-slate-700'}`}>
      <button type="button" className="w-full p-4 flex items-center justify-between text-left"
        onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isComplete ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {isComplete ? '✓' : index + 1}
          </div>
          <div>
            <h4 className="font-semibold text-white">{checkpoint.checkpoint}</h4>
            <p className="text-sm text-slate-400">{checkpoint.description}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {checkpoint.validationCriteria && (
            <div className="bg-slate-900/50 rounded p-3">
              <div className="text-sm font-semibold text-green-400 mb-2">Validation Criteria:</div>
              <ul className="space-y-1">
                {checkpoint.validationCriteria.map((c) => (
                  <li key={`vc-${c.slice(0, 20)}`} className="text-sm text-slate-300">• {c}</li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <span className="block text-sm font-semibold text-slate-300 mb-2">Your Work:</span>
            <textarea value={response} onChange={(e) => onResponseChange(e.target.value)}
              placeholder="Document your work here..."
              className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded text-white text-sm resize-none focus:outline-none" />
          </div>

          {checkpoint.hintIfStuck && (
            <div>
              <button type="button" onClick={handleHintClick}
                className="flex items-center space-x-2 text-sm text-amber-400 hover:text-amber-300">
                <Lightbulb className="w-4 h-4" /><span>{showHint ? 'Hide Hint' : 'Get Hint'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-amber-900/20 border border-amber-600/50 rounded text-sm text-amber-200">
                  💡 {checkpoint.hintIfStuck}
                </div>
              )}
            </div>
          )}

          <label className="flex items-center space-x-3 cursor-pointer">
            <input type="checkbox" checked={isComplete} onChange={onToggleComplete}
              className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-green-500" />
            <span className={isComplete ? 'text-green-400 font-semibold' : 'text-slate-300'}>Mark complete</span>
          </label>
        </div>
      )}
    </div>
  );
}

interface ResourcesProps {
  readonly resources: string[];
}

export function AllowedResources({ resources }: ResourcesProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="font-semibold mb-3 text-cyan-400 flex items-center">
        <ExternalLink className="w-5 h-5 mr-2" />
        Allowed Resources
      </h3>
      <p className="text-sm text-slate-400 mb-3">
        You may use these resources to help complete this level:
      </p>
      <ul className="space-y-2">
        {resources.map((resource) => (
          <li key={`res-${resource.slice(0, 20)}`} className="text-slate-300 text-sm flex items-start">
            <span className="text-cyan-400 mr-2">→</span>
            {resource}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface EditorProps {
  readonly notes: string;
  readonly onChange: (value: string) => void;
}

export function GeneralNotesEditor({ notes, onChange }: EditorProps) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center space-x-2">
        <FileText className="w-5 h-5 text-cyan-400" />
        <span className="font-semibold text-white">General Notes & Summary</span>
      </div>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Use this space for additional notes, overall summary, or anything that doesn't fit in the checkpoint responses..."
        className="w-full h-48 p-4 bg-slate-900 text-white resize-none focus:outline-none font-mono text-sm"
      />
    </div>
  );
}
