import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { QuizResults, QuizQuestionView } from './quiz/QuizComponents';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizProps {
  readonly quizId: string;
  readonly title: string;
  readonly questions: QuizQuestion[];
  readonly passingScore: number;
  readonly xpReward: number;
}

export default function Quiz({ quizId, title, questions, passingScore, xpReward }: QuizProps) {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [awarding, setAwarding] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  const handleClaimReward = async () => {
    if (!user || awarding) return;
    const score = calculateScore();
    if (score < passingScore) {
      alert(`You need ${passingScore}% to pass. You scored ${score}%. Try again!`);
      return;
    }

    setAwarding(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        completedQuizzes: arrayUnion(quizId),
        xp: increment(xpReward)
      });
      alert(`🎉 Congratulations! You earned ${xpReward} XP!`);
      setTimeout(() => globalThis.location.reload(), 1000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to award XP. Please try again.');
    } finally {
      setAwarding(false);
    }
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <QuizResults
        score={score}
        passed={passed}
        passingScore={passingScore}
        xpReward={xpReward}
        questions={questions}
        selectedAnswers={selectedAnswers}
        awarding={awarding}
        onRetake={handleRetake}
        onClaimReward={handleClaimReward}
      />
    );
  }

  return (
    <QuizQuestionView
      title={title}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      question={questions[currentQuestion]}
      userAnswer={selectedAnswers[currentQuestion]}
      answeredCount={selectedAnswers.filter(a => a !== null).length}
      onSelectAnswer={handleSelectAnswer}
      onPrevious={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
      onNext={() => currentQuestion < questions.length - 1 && setCurrentQuestion(currentQuestion + 1)}
      onSubmit={() => setShowResults(true)}
      canSubmit={!selectedAnswers.includes(null)}
    />
  );
}
