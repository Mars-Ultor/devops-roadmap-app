/**
 * Flash Card Sub-Components
 * Extracted from FlashCard.tsx for ESLint compliance
 */

import { Brain, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import type { FlashCardData } from '../FlashCard';

// Empty State Component
export function FlashCardEmptyState() {
  return (
    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
      <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">No Flash Cards Yet</h3>
      <p className="text-slate-400">Flash cards will be generated from your completed lessons for review practice.</p>
    </div>
  );
}

// Session Complete Component
interface SessionCompleteProps {
  readonly results: { cardId: string; quality: number }[];
  readonly onReset: () => void;
}

export function FlashCardSessionComplete({ results, onReset }: SessionCompleteProps) {
  const correctCount = results.filter(r => r.quality >= 3).length;
  const accuracy = (correctCount / results.length) * 100;

  return (
    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
      <div className="text-center mb-6">
        {accuracy >= 70 
          ? <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          : <XCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        }
        <h3 className="text-2xl font-bold text-white mb-2">Review Complete!</h3>
        <p className="text-slate-300">You got {correctCount} out of {results.length} correct</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-900 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400">{accuracy.toFixed(0)}%</div>
          <div className="text-sm text-slate-400">Accuracy</div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">{results.length}</div>
          <div className="text-sm text-slate-400">Cards Reviewed</div>
        </div>
      </div>
      <button onClick={onReset}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all">
        <RotateCcw className="w-5 h-5" />Review Again
      </button>
    </div>
  );
}

// Progress Bar Component
interface ProgressBarProps {
  readonly currentIndex: number;
  readonly total: number;
  readonly category: string;
}

export function FlashCardProgressBar({ currentIndex, total, category }: ProgressBarProps) {
  const progress = ((currentIndex + 1) / total) * 100;
  return (
    <div className="p-4 border-b border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-400">Card {currentIndex + 1} of {total}</span>
        <span className="text-sm text-slate-400">{category}</span>
      </div>
      <div className="w-full bg-slate-900 rounded-full h-2">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

// Question Display Component
interface QuestionDisplayProps {
  readonly card: FlashCardData;
  readonly showAnswer: boolean;
  readonly onReveal: () => void;
}

export function FlashCardQuestion({ card, showAnswer, onReveal }: QuestionDisplayProps) {
  return (
    <>
      <div className="text-xs text-purple-400 mb-2">{card.lessonTitle}</div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Question:</h3>
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
          <p className="text-slate-200">{card.question}</p>
        </div>
      </div>
      {!showAnswer && (
        <button onClick={onReveal}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all">
          <Brain className="w-5 h-5" />Reveal Answer<ChevronRight className="w-5 h-5" />
        </button>
      )}
    </>
  );
}

// Answer and Rating Component
interface AnswerRatingProps {
  readonly answer: string;
  readonly onRate: (quality: number) => void;
}

const QUALITY_OPTIONS = [
  { quality: 5, label: 'Perfect', desc: 'Remembered easily', color: 'bg-green-600 hover:bg-green-500' },
  { quality: 4, label: 'Good', desc: 'Recalled after thought', color: 'bg-blue-600 hover:bg-blue-500' },
  { quality: 3, label: 'OK', desc: 'Barely remembered', color: 'bg-yellow-600 hover:bg-yellow-500' },
  { quality: 2, label: 'Hard', desc: 'Seemed familiar', color: 'bg-orange-600 hover:bg-orange-500' },
  { quality: 1, label: 'Failed', desc: "Didn't remember", color: 'bg-red-600 hover:bg-red-500' },
];

export function FlashCardAnswerRating({ answer, onRate }: AnswerRatingProps) {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Answer:</h3>
        <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
          <p className="text-slate-200 whitespace-pre-wrap">{answer}</p>
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-sm text-slate-300 text-center mb-4">How well did you recall this?</p>
        {QUALITY_OPTIONS.map(opt => (
          <button key={opt.quality} onClick={() => onRate(opt.quality)}
            className={`w-full px-4 py-3 ${opt.color} text-white rounded-lg transition text-left`}>
            <span className="font-semibold">{opt.label} ({opt.quality})</span>
            <span className="text-sm opacity-80 ml-2">- {opt.desc}</span>
          </button>
        ))}
      </div>
    </>
  );
}
