/**
 * Recertification Drill Component
 * Assessment drill for certification maintenance
 */

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "../store/authStore";
import { RECERTIFICATION_DRILLS } from "../data/recertificationDrills";
import type {
  RecertificationDrill,
  RecertificationAttempt,
  RecertificationAnswer,
} from "../types/training";
import { DrillLoadingState } from "./RecertificationDrillComponents";
import { DrillResultsView, DrillQuizView } from "./RecertificationDrillViews";

interface RecertificationDrillProps {
  drillId?: string;
  onComplete?: (attempt: RecertificationAttempt) => void;
  onCancel?: () => void;
}

export default function RecertificationDrillComponent({
  drillId,
  onComplete,
  onCancel,
}: RecertificationDrillProps) {
  const { user } = useAuthStore();
  const [currentDrill, setCurrentDrill] = useState<RecertificationDrill | null>(
    null,
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RecertificationAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [attempt, setAttempt] = useState<RecertificationAttempt | null>(null);

  const handleSubmit = useCallback(
    (autoSubmit = false) => {
      if (!currentDrill || !user) return;
      const endTime = new Date();
      const timeSpentMinutes =
        (endTime.getTime() - startTime.getTime()) / (1000 * 60);
      const correctAnswers = answers.filter((a) => a.correct).length;
      const score = Math.round(
        (correctAnswers / currentDrill.questions.length) * 100,
      );
      const passed = score >= currentDrill.passingScore;
      const attemptResult: RecertificationAttempt = {
        id: `attempt-${Date.now()}`,
        drillId: currentDrill.id,
        userId: user.uid,
        startedAt: startTime,
        completedAt: endTime,
        score,
        passed,
        timeSpentMinutes,
        answers,
        feedback: autoSubmit ? "Time expired - auto-submitted" : undefined,
      };
      setAttempt(attemptResult);
      setShowResults(true);
      onComplete?.(attemptResult);
    },
    [currentDrill, user, startTime, answers, onComplete],
  );

  useEffect(() => {
    if (drillId) {
      const drill = RECERTIFICATION_DRILLS.find((d) => d.id === drillId);
      if (drill) {
        setCurrentDrill(drill);
        setTimeRemaining(drill.timeLimitMinutes * 60);
        setStartTime(new Date());
      }
    }
  }, [drillId]);

  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => setTimeRemaining((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults && currentDrill) {
      handleSubmit(true);
    }
  }, [timeRemaining, showResults, handleSubmit, currentDrill]);

  const handleAnswer = (answer: string | number | boolean) => {
    const question = currentDrill!.questions[currentQuestionIndex];
    const answerObj: RecertificationAnswer = {
      questionId: question.id,
      answer,
      correct: answer === question.correctAnswer,
      timeSpentSeconds: Math.floor((Date.now() - startTime.getTime()) / 1000),
    };
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerObj;
    setAnswers(newAnswers);
  };

  if (!currentDrill) return <DrillLoadingState />;

  if (showResults && attempt) {
    return (
      <DrillResultsView
        drill={currentDrill}
        attempt={attempt}
        answers={answers}
        onRetry={() => window.location.reload()}
        onCancel={onCancel}
      />
    );
  }

  return (
    <DrillQuizView
      drill={currentDrill}
      currentIndex={currentQuestionIndex}
      timeRemaining={timeRemaining}
      answers={answers}
      onAnswer={handleAnswer}
      onPrevious={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
      onNext={() =>
        setCurrentQuestionIndex((i) =>
          Math.min(currentDrill.questions.length - 1, i + 1),
        )
      }
      onSubmit={() => handleSubmit()}
    />
  );
}
