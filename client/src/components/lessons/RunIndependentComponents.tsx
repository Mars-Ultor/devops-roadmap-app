/**
 * RunIndependentWorkspace Components
 * Extracted UI components for linting compliance
 */

import { Clock, Save, CheckCircle, FileText, AlertTriangle, Sparkles, Send } from 'lucide-react';

interface TimerBarProps {
  readonly elapsedTime: number;
  readonly timeTarget?: number;
  readonly wordCount: number;
  readonly checkedCount: number;
  readonly totalCriteria: number;
  readonly allChecked: boolean;
  readonly onSaveDraft: () => void;
  readonly onToggleChecklist: () => void;
}

export function TimerBar({
  elapsedTime,
  timeTarget,
  wordCount,
  checkedCount,
  totalCriteria,
  allChecked,
  onSaveDraft,
  onToggleChecklist
}: TimerBarProps) {
  const isOverTime = timeTarget && elapsedTime > timeTarget * 60;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className={`flex items-center space-x-2 ${isOverTime ? 'text-red-400' : 'text-yellow-400'}`}>
          <Clock className="w-5 h-5" />
          <span className="font-mono text-lg">{formatTime(elapsedTime)}</span>
          {timeTarget && (
            <span className="text-slate-500 text-sm">/ {timeTarget}:00 target</span>
          )}
        </div>
        <div className="text-slate-400 text-sm">
          <span className="font-semibold text-white">{wordCount}</span> words
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onSaveDraft}
          className="flex items-center space-x-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300"
        >
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </button>
        <button
          onClick={onToggleChecklist}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded text-sm ${
            allChecked 
              ? 'bg-green-600/20 text-green-400 border border-green-600' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{checkedCount}/{totalCriteria} Criteria</span>
        </button>
      </div>
    </div>
  );
}

interface ChecklistProps {
  readonly successCriteria: string[];
  readonly checkedCriteria: Set<number>;
  readonly onToggle: (index: number) => void;
}

export function SelfAssessmentChecklist({ successCriteria, checkedCriteria, onToggle }: ChecklistProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <h3 className="font-semibold mb-3 text-green-400 flex items-center">
        <CheckCircle className="w-5 h-5 mr-2" />
        Self-Assessment Checklist
      </h3>
      <p className="text-sm text-slate-400 mb-3">
        Check off each criterion as you address it in your response:
      </p>
      <ul className="space-y-2">
        {successCriteria.map((criteria, i) => (
          <li 
            key={`check-${criteria.slice(0, 30)}`}
            className={`flex items-start space-x-3 p-2 rounded transition ${
              checkedCriteria.has(i) 
                ? 'bg-green-900/30 border border-green-600/50' 
                : 'hover:bg-slate-700'
            }`}
          >
            <label className="flex items-start space-x-3 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={checkedCriteria.has(i)}
                onChange={() => onToggle(i)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-700 text-green-500 focus:ring-green-500"
              />
              <span className={checkedCriteria.has(i) ? 'text-green-300' : 'text-slate-300'}>
                {criteria}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface EditorProps {
  readonly submission: string;
  readonly objective: string;
  readonly onChange: (value: string) => void;
}

export function ResponseEditor({ submission, objective, onChange }: EditorProps) {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-white">Your Response</span>
        </div>
        <div className="text-xs text-slate-500">
          Markdown supported • Auto-saves every 30s
        </div>
      </div>
      <textarea
        value={submission}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your response here...\n\nObjective: ${objective}\n\nAddress each success criterion in your response. You can use markdown formatting:\n- **Bold** for emphasis\n- # Headers for sections\n- - Bullet points for lists\n- \`code\` for technical terms`}
        className="w-full h-96 p-4 bg-slate-900 text-white resize-none focus:outline-none font-mono text-sm"
      />
    </div>
  );
}

export function SubmissionGuidelines() {
  return (
    <div className="bg-amber-900/20 border border-amber-600 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-400 mb-1">Before Submitting</h4>
          <ul className="text-sm text-amber-200 space-y-1">
            <li>• Review all success criteria and ensure each is addressed</li>
            <li>• Check that minimum requirements are met</li>
            <li>• Your response should demonstrate mastery, not just completion</li>
            <li>• This is your final test - no hints, no guidance, just your knowledge</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

interface SubmitButtonProps {
  readonly allCriteriaChecked: boolean;
  readonly uncheckedCount: number;
  readonly canSubmit: boolean;
  readonly onSubmit: () => void;
}

export function SubmitButton({ allCriteriaChecked, uncheckedCount, canSubmit, onSubmit }: SubmitButtonProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-slate-400">
        {!allCriteriaChecked && (
          <span className="text-amber-400">
            ⚠️ {uncheckedCount} criteria unchecked
          </span>
        )}
      </div>
      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
          canSubmit
            ? 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span>Submit for Mastery Evaluation</span>
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
