import { useState } from 'react';
import { Brain, ChevronRight, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export interface FlashCardData {
  id: string;
  question: string;
  answer: string;
  lessonId: string;
  lessonTitle: string;
  category: string;
}

interface FlashCardProps {
  cards: FlashCardData[];
  onComplete: (results: { cardId: string; quality: number }[]) => void;
}

export default function FlashCard({ cards, onComplete }: FlashCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [results, setResults] = useState<{ cardId: string; quality: number }[]>([]);
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  const handleQualityRating = (quality: number) => {
    const newResults = [...results, { cardId: currentCard.id, quality }];
    setResults(newResults);

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      setSessionComplete(true);
      onComplete(newResults);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setResults([]);
    setSessionComplete(false);
  };

  if (!cards.length) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 text-center">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Flash Cards Yet</h3>
        <p className="text-slate-400">
          Flash cards will be generated from your completed lessons for review practice.
        </p>
      </div>
    );
  }

  if (sessionComplete) {
    const correctCount = results.filter(r => r.quality >= 3).length;
    const accuracy = (correctCount / results.length) * 100;

    return (
      <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
        <div className="text-center mb-6">
          {accuracy >= 70 ? (
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          )}
          <h3 className="text-2xl font-bold text-white mb-2">Review Complete!</h3>
          <p className="text-slate-300">
            You got {correctCount} out of {results.length} correct
          </p>
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

        <button
          onClick={resetSession}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          Review Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      {/* Progress Bar */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-400">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <span className="text-sm text-slate-400">
            {currentCard.category}
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-8">
        <div className="text-xs text-purple-400 mb-2">{currentCard.lessonTitle}</div>
        
        {/* Question */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Question:</h3>
          <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
            <p className="text-slate-200">{currentCard.question}</p>
          </div>
        </div>

        {/* Answer (revealed on click) */}
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all"
          >
            <Brain className="w-5 h-5" />
            Reveal Answer
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Answer:</h3>
              <div className="bg-green-900/20 rounded-lg p-4 border border-green-600/30">
                <p className="text-slate-200 whitespace-pre-wrap">{currentCard.answer}</p>
              </div>
            </div>

            {/* Quality Rating */}
            <div className="space-y-3">
              <p className="text-sm text-slate-300 text-center mb-4">
                How well did you recall this?
              </p>
              
              <button
                onClick={() => handleQualityRating(5)}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg transition text-left"
              >
                <span className="font-semibold">Perfect (5)</span>
                <span className="text-sm opacity-80 ml-2">- Remembered easily</span>
              </button>
              
              <button
                onClick={() => handleQualityRating(4)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition text-left"
              >
                <span className="font-semibold">Good (4)</span>
                <span className="text-sm opacity-80 ml-2">- Recalled after thought</span>
              </button>
              
              <button
                onClick={() => handleQualityRating(3)}
                className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition text-left"
              >
                <span className="font-semibold">OK (3)</span>
                <span className="text-sm opacity-80 ml-2">- Barely remembered</span>
              </button>
              
              <button
                onClick={() => handleQualityRating(2)}
                className="w-full px-4 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition text-left"
              >
                <span className="font-semibold">Hard (2)</span>
                <span className="text-sm opacity-80 ml-2">- Seemed familiar</span>
              </button>
              
              <button
                onClick={() => handleQualityRating(1)}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition text-left"
              >
                <span className="font-semibold">Failed (1)</span>
                <span className="text-sm opacity-80 ml-2">- Didn't remember</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
