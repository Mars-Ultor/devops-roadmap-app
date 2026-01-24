/* eslint-disable max-lines-per-function */
/**
 * WalkLevelContent - Fill-in-the-blank exercises
 * User fills in missing parameters to complete commands
 */

import { type FC, useState } from "react";
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from "lucide-react";
import type { WalkContent } from "../../types/lessonContent";

/** Regex pattern for blank placeholders */
const BLANK_PATTERN = /__(\w+)__/;

/** Get button style class based on exercise state */
function getExerciseButtonClass(
  exerciseNumber: number,
  currentExercise: number,
  completedExercises: number[],
): string {
  if (currentExercise === exerciseNumber) {
    return "bg-purple-600 text-white";
  }
  if (completedExercises.includes(exerciseNumber)) {
    return "bg-emerald-900/50 text-emerald-300 border border-emerald-500/50";
  }
  return "bg-slate-800 text-slate-300 hover:bg-slate-700";
}

interface WalkLevelContentProps {
  content: WalkContent;
  onExerciseComplete: (exerciseNumber: number, correct: boolean) => void;
  completedExercises: number[];
}

export const WalkLevelContent: FC<WalkLevelContentProps> = ({
  content,
  onExerciseComplete,
  completedExercises,
}) => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState<Record<string, boolean>>({});
  const [validation, setValidation] = useState<{
    correct: boolean;
    message: string;
  } | null>(null);

  const exercise = content.exercises.find(
    (ex) => ex.exerciseNumber === currentExercise,
  );
  if (!exercise) return null;

  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));
    setValidation(null);
  };

  const checkAnswers = () => {
    const allCorrect = exercise.blanks.every((blank) => {
      const userAnswer = answers[blank.id]?.trim().toLowerCase() || "";
      if (blank.validationPattern) {
        // Use case-insensitive matching for all patterns
        return new RegExp(blank.validationPattern, "i").test(userAnswer);
      }
      return userAnswer === blank.correctValue.toLowerCase();
    });

    if (allCorrect) {
      setValidation({
        correct: true,
        message: "Perfect! All blanks filled correctly.",
      });
      onExerciseComplete(currentExercise, true);
    } else {
      setValidation({
        correct: false,
        message: "Some answers are incorrect. Review and try again.",
      });
      onExerciseComplete(currentExercise, false);
    }
  };

  const showSolution = () => {
    const solutionAnswers: Record<string, string> = {};
    exercise.blanks.forEach((blank) => {
      solutionAnswers[blank.id] = blank.correctValue;
    });
    setAnswers(solutionAnswers);
  };

  const isCompleted = completedExercises.includes(currentExercise);

  return (
    <WalkLevelContentRender
      content={content}
      exercise={exercise}
      currentExercise={currentExercise}
      setCurrentExercise={setCurrentExercise}
      answers={answers}
      handleAnswerChange={handleAnswerChange}
      showHint={showHint}
      setShowHint={setShowHint}
      validation={validation}
      isCompleted={isCompleted}
      checkAnswers={checkAnswers}
      showSolution={showSolution}
      completedExercises={completedExercises}
      onExerciseComplete={onExerciseComplete}
    />
  );
};

interface WalkLevelContentRenderProps extends WalkLevelContentProps {
  exercise: NonNullable<WalkContent["exercises"][0]>;
  currentExercise: number;
  setCurrentExercise: (exercise: number) => void;
  answers: Record<string, string>;
  handleAnswerChange: (blankId: string, value: string) => void;
  showHint: Record<string, boolean>;
  setShowHint: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  validation: { correct: boolean; message: string } | null;
  isCompleted: boolean;
  checkAnswers: () => void;
  showSolution: () => void;
}

const WalkLevelContentRender: FC<WalkLevelContentRenderProps> = ({
  content,
  exercise,
  currentExercise,
  setCurrentExercise,
  answers,
  handleAnswerChange,
  showHint,
  setShowHint,
  validation,
  isCompleted,
  checkAnswers,
  showSolution,
  completedExercises,
}) => {
  return (
    <div>
      {/* Introduction */}
      <div>
        <h3 className="text-xl font-semibold text-purple-300 mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5" />
          Walk Level: Fill-in-the-Blank
        </h3>
        <p className="text-slate-300">{content.introduction}</p>
      </div>

      {/* Exercise Navigation */}
      <div>
        {content.exercises.map((ex) => (
          <button
            key={ex.exerciseNumber}
            onClick={() => setCurrentExercise(ex.exerciseNumber)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${getExerciseButtonClass(ex.exerciseNumber, currentExercise, completedExercises)}`}
          >
            Exercise {ex.exerciseNumber}
            {completedExercises.includes(ex.exerciseNumber) && (
              <CheckCircle className="w-4 h-4 inline ml-1" />
            )}
          </button>
        ))}
      </div>

      <ExerciseContent
        exercise={exercise}
        answers={answers}
        handleAnswerChange={handleAnswerChange}
        showHint={showHint}
        setShowHint={setShowHint}
        validation={validation}
        isCompleted={isCompleted}
        checkAnswers={checkAnswers}
        showSolution={showSolution}
      />

      {/* <GeneralHints hints={content.hints} /> */}

      {/* Progress */}
      {completedExercises.length === content.exercises.length && (
        <div>
          <h3 className="text-lg font-semibold text-emerald-300 mb-2 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Walk Level Complete!
          </h3>
          <p className="text-slate-300">
            You've successfully completed all fill-in-the-blank exercises.
            Complete Walk level perfectly 3 times to unlock Run-Guided.
          </p>
        </div>
      )}
    </div>
  );
};

interface ExerciseContentProps {
  exercise: NonNullable<WalkContent["exercises"][0]>;
  answers: Record<string, string>;
  handleAnswerChange: (blankId: string, value: string) => void;
  showHint: Record<string, boolean>;
  setShowHint: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  validation: { correct: boolean; message: string } | null;
  isCompleted: boolean;
  checkAnswers: () => void;
  showSolution: () => void;
}

const ExerciseContent: FC<ExerciseContentProps> = ({
  exercise,
  answers,
  handleAnswerChange,
  showHint,
  setShowHint,
  validation,
  isCompleted,
  checkAnswers,
  showSolution,
}) => {
  return (
    <div>
      {/* Scenario */}
      <div>
        <h4 className="text-sm font-semibold text-purple-300 mb-2">
          Scenario:
        </h4>
        <p className="text-white">{exercise.scenario}</p>
      </div>

      {/* Template with Inputs */}
      <div>
        <h4 className="text-sm font-semibold text-slate-400 mb-3">
          Complete the command:
        </h4>
        {exercise.template.split(/(__\w+__)/).map((part) => {
          const blankMatch = BLANK_PATTERN.exec(part);
          if (blankMatch) {
            const blankId = blankMatch[0]; // Use full match including underscores
            const blank = exercise.blanks.find((b) => b.id === blankId);
            if (!blank)
              return (
                <span key={`error-${blankId}`} className="text-red-400">
                  {part}
                </span>
              );

            return (
              <div key={`blank-${blank.id}`} className="inline-flex flex-col">
                <input
                  type="text"
                  value={answers[blank.id] || ""}
                  onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
                  className="bg-purple-900/30 border border-purple-500/50 rounded px-2 py-1 text-white text-center min-w-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={blank.label}
                  disabled={isCompleted}
                />
                <button
                  onClick={() =>
                    setShowHint((prev) => ({
                      ...prev,
                      [blank.id]: !prev[blank.id],
                    }))
                  }
                  className="text-xs text-purple-400 hover:text-purple-300 mt-1"
                >
                  {showHint[blank.id] ? "Hide" : "Hint"}
                </button>
                {showHint[blank.id] && (
                  <span className="text-xs text-slate-400 mt-1 italic">
                    {blank.hint}
                  </span>
                )}
              </div>
            );
          }

          return (
            <span key={`text-${part}`} className="text-emerald-400">
              {part}
            </span>
          );
        })}
      </div>

      {/* Validation Result */}
      {validation && (
        <div
          className={`rounded-lg p-4 flex items-center gap-3 ${
            validation.correct
              ? "bg-emerald-900/20 border border-emerald-500/50"
              : "bg-red-900/20 border border-red-500/50"
          }`}
        >
          {validation.correct ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400" />
          )}
          <p
            className={validation.correct ? "text-emerald-300" : "text-red-300"}
          >
            {validation.message}
          </p>
        </div>
      )}

      {/* Explanation (shown after correct answer) */}
      {isCompleted && (
        <div>
          <h5 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Explanation
          </h5>
          <p className="text-slate-300 text-sm mb-3">{exercise.explanation}</p>
          <strong className="text-slate-400">Solution:</strong>{" "}
          {exercise.solution}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={checkAnswers}
          disabled={isCompleted}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-400 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Check Answers
        </button>
        <button
          onClick={showSolution}
          className="px-6 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Show Solution
        </button>
      </div>
    </div>
  );
};
