/**
 * Flash Card Component
 * Spaced repetition flash card study interface
 */

import { useState } from "react";
import {
  FlashCardEmptyState,
  FlashCardSessionComplete,
  FlashCardProgressBar,
  FlashCardQuestion,
  FlashCardAnswerRating,
} from "./flashcard/FlashCardComponents";

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
  const [results, setResults] = useState<{ cardId: string; quality: number }[]>(
    [],
  );
  const [sessionComplete, setSessionComplete] = useState(false);

  const currentCard = cards[currentIndex];

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

  if (!cards.length) return <FlashCardEmptyState />;

  if (sessionComplete) {
    return (
      <FlashCardSessionComplete results={results} onReset={resetSession} />
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700">
      <FlashCardProgressBar
        currentIndex={currentIndex}
        total={cards.length}
        category={currentCard.category}
      />
      <div className="p-8">
        <FlashCardQuestion
          card={currentCard}
          showAnswer={showAnswer}
          onReveal={() => setShowAnswer(true)}
        />
        {showAnswer && (
          <FlashCardAnswerRating
            answer={currentCard.answer}
            onRate={handleQualityRating}
          />
        )}
      </div>
    </div>
  );
}
