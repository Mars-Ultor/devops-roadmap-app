import React from 'react';
import {
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Play,
  Pause
} from 'lucide-react';
import type { MasterTrainingState, MasterTrainingActions } from '../../hooks/useMasterTraining';

interface TrainingPhaseProps {
  state: MasterTrainingState;
  actions: MasterTrainingActions;
}

const TrainingPhase: React.FC<TrainingPhaseProps> = ({ state, actions }) => {
  const { currentSession, challengeResults, currentChallengeIndex, selectedAnswer } = state;
  
  if (!currentSession) return null;

  const currentChallenge = currentSession.currentScenario.challenges[currentChallengeIndex];
  const hasAnswered = currentChallenge ? challengeResults.some(r => r.challengeId === currentChallenge.id) : false;
  const userResult = currentChallenge ? challengeResults.find(r => r.challengeId === currentChallenge.id) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Training Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Header */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <SessionHeader state={state} actions={actions} />

            {/* Scenario Content */}
            <ScenarioContent
              currentSession={currentSession}
              currentChallengeIndex={currentChallengeIndex}
              currentChallenge={currentChallenge}
              hasAnswered={hasAnswered}
              userResult={userResult}
              selectedAnswer={selectedAnswer}
              actions={actions}
            />
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <StrengthsPanel />
          <ProgressPanel state={state} />
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  value: string;
  label: string;
  color: 'indigo' | 'green' | 'blue' | 'red';
  showPlaceholder: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, color, showPlaceholder }) => {
  const colorClasses = {
    indigo: 'text-indigo-400',
    green: 'text-green-400',
    blue: 'text-blue-400',
    red: 'text-red-400'
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 text-center">
      <div className={`text-2xl font-bold ${showPlaceholder ? 'text-slate-600' : colorClasses[color]}`}>
        {value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
      {showPlaceholder && (
        <div className="text-xs text-slate-500 mt-1">Answer to start</div>
      )}
    </div>
  );
};

// Session Header Component
const SessionHeader: React.FC<{ state: MasterTrainingState; actions: MasterTrainingActions }> = ({ state, actions }) => {
  const { currentSession, trainingActive, adaptiveMetrics, challengeResults } = state;
  if (!currentSession) return null;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{currentSession.currentScenario.title}</h2>
          <p className="text-slate-400">Adaptive Difficulty: Level {currentSession.currentScenario.currentDifficulty}/10</p>
        </div>
        <div className="flex items-center space-x-3">
          {trainingActive ? (
            <button
              onClick={actions.pauseTraining}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </button>
          ) : (
            <button
              onClick={actions.resumeTraining}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="w-4 h-4 mr-2" />
              Resume
            </button>
          )}
          <button
            onClick={actions.completeSession}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Complete Session
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          value={challengeResults.length > 0 ? `${adaptiveMetrics.performanceScore}%` : '—'}
          label="Performance"
          color="indigo"
          showPlaceholder={challengeResults.length === 0}
        />
        <MetricCard
          value={challengeResults.length > 0 ? `${adaptiveMetrics.timeEfficiency}%` : '—'}
          label="Efficiency"
          color="green"
          showPlaceholder={challengeResults.length === 0}
        />
        <MetricCard
          value={challengeResults.length > 0 ? adaptiveMetrics.learningVelocity.toFixed(1) : '—'}
          label="Learning Rate"
          color="blue"
          showPlaceholder={challengeResults.length === 0}
        />
        <MetricCard
          value={challengeResults.length > 0 
            ? `${adaptiveMetrics.difficultyAdjustment > 0 ? '+' : ''}${adaptiveMetrics.difficultyAdjustment}` 
            : '—'}
          label="Difficulty Adj."
          color={adaptiveMetrics.difficultyAdjustment > 0 ? 'green' : 'red'}
          showPlaceholder={challengeResults.length === 0}
        />
      </div>
    </>
  );
};

// Scenario Content Component  
interface ScenarioContentProps {
  currentSession: MasterTrainingState['currentSession'];
  currentChallengeIndex: number;
  currentChallenge: MasterTrainingState['currentSession'] extends { currentScenario: { challenges: (infer T)[] } } ? T : never;
  hasAnswered: boolean;
  userResult: { selectedOptionId: string } | null | undefined;
  selectedAnswer: string | null;
  actions: MasterTrainingActions;
}

const ScenarioContent: React.FC<ScenarioContentProps> = ({
  currentSession,
  currentChallengeIndex,
  currentChallenge,
  hasAnswered,
  userResult,
  selectedAnswer,
  actions
}) => {
  if (!currentSession) return null;
  
  return (
    <div className="bg-slate-900 rounded-lg p-6 mb-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Scenario Context</h3>
          <span className="text-xs px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
            Challenge {currentChallengeIndex + 1} of {currentSession.currentScenario.challenges.length}
          </span>
        </div>
        <p className="text-slate-300 mb-4">{currentSession.currentScenario.scenario}</p>
      </div>

      {currentChallenge && (
        <ChallengeDisplay
          challenge={currentChallenge}
          hasAnswered={hasAnswered}
          userResult={userResult}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={actions.selectAnswer}
          onSubmitAnswer={actions.submitAnswer}
          onNextChallenge={actions.nextChallenge}
          isLastChallenge={currentChallengeIndex >= currentSession.currentScenario.challenges.length - 1}
        />
      )}
    </div>
  );
};

interface ChallengeDisplayProps {
  challenge: {
    id: string;
    phase: string;
    situation: string;
    correctOptionId: string;
    options: Array<{
      id: string;
      text: string;
      outcome: string;
      explanation: string;
    }>;
  };
  hasAnswered: boolean;
  userResult: { selectedOptionId: string } | null | undefined;
  selectedAnswer: string | null;
  onSelectAnswer: (id: string) => void;
  onSubmitAnswer: () => void;
  onNextChallenge: () => void;
  isLastChallenge: boolean;
}

const ChallengeDisplay: React.FC<ChallengeDisplayProps> = ({
  challenge,
  hasAnswered,
  userResult,
  selectedAnswer,
  onSelectAnswer,
  onSubmitAnswer,
  onNextChallenge,
  isLastChallenge
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
        <div className="flex items-center text-indigo-400 mb-2">
          <Target className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{challenge.phase}</span>
        </div>
        <p className="text-white font-medium">{challenge.situation}</p>
      </div>

      <div className="space-y-3">
        <h4 className="text-white font-medium">Your Decision:</h4>
        {challenge.options.map((option) => {
          const isSelected = selectedAnswer === option.id;
          const isCorrect = option.id === challenge.correctOptionId;
          const showFeedback = hasAnswered && userResult?.selectedOptionId === option.id;

          return (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              hasAnswered={hasAnswered}
              showFeedback={showFeedback}
              onSelect={() => !hasAnswered && onSelectAnswer(option.id)}
            />
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6">
        {!hasAnswered && selectedAnswer && (
          <button
            onClick={onSubmitAnswer}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Submit Answer
          </button>
        )}
        {hasAnswered && !isLastChallenge && (
          <button
            onClick={onNextChallenge}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Next Challenge
          </button>
        )}
      </div>
    </div>
  );
};

interface OptionButtonProps {
  option: { id: string; text: string; explanation: string };
  isSelected: boolean;
  isCorrect: boolean;
  hasAnswered: boolean;
  showFeedback: boolean;
  onSelect: () => void;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  option,
  isSelected,
  isCorrect,
  hasAnswered,
  showFeedback,
  onSelect
}) => {
  const getButtonClasses = () => {
    if (hasAnswered) {
      if (showFeedback) {
        return isCorrect
          ? 'border-green-500 bg-green-500/10'
          : 'border-red-500 bg-red-500/10';
      }
      return 'border-slate-700 bg-slate-800/50 opacity-50';
    }
    return isSelected
      ? 'border-indigo-500 bg-indigo-500/10'
      : 'border-slate-700 bg-slate-800 hover:border-slate-600';
  };

  const getIndicatorClasses = () => {
    if (hasAnswered && showFeedback) {
      return isCorrect
        ? 'border-green-500 bg-green-500'
        : 'border-red-500 bg-red-500';
    }
    return isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600';
  };

  return (
    <button
      onClick={onSelect}
      disabled={hasAnswered}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getButtonClasses()}`}
    >
      <div className="flex items-start">
        <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-0.5 flex items-center justify-center ${getIndicatorClasses()}`}>
          {hasAnswered && showFeedback && isCorrect && <CheckCircle className="w-3 h-3" />}
          {hasAnswered && showFeedback && !isCorrect && <XCircle className="w-3 h-3" />}
        </div>
        <div>
          <p className="text-white">{option.text}</p>
          {hasAnswered && showFeedback && (
            <p className="text-sm mt-2 text-slate-400">{option.explanation}</p>
          )}
        </div>
      </div>
    </button>
  );
};

const StrengthsPanel: React.FC = () => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
        Learning Insights
      </h3>
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Strengths</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Technical analysis</li>
            <li>• Problem prioritization</li>
            <li>• Systematic approach</li>
          </ul>
        </div>
        <div className="bg-slate-900 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Improvement Areas</h4>
          <ul className="space-y-1 text-sm text-slate-300">
            <li>• Time management</li>
            <li>• Stakeholder communication</li>
            <li>• Risk assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface ProgressPanelProps {
  state: MasterTrainingState;
}

const ProgressPanel: React.FC<ProgressPanelProps> = ({ state }) => {
  const { currentSession, challengeResults, sessionStartTime } = state;
  
  if (!currentSession) return null;

  const elapsed = sessionStartTime ? Math.floor((Date.now() - sessionStartTime.getTime()) / 1000) : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const totalChallenges = currentSession.currentScenario?.challenges?.length || 0;
  const progressPercent = totalChallenges > 0 
    ? Math.min(100, (challengeResults.length / totalChallenges) * 100) 
    : 0;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2 text-green-400" />
        Session Progress
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Session Time</span>
            <span className="text-white">{minutes}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Challenges Completed</span>
            <span className="text-white">{challengeResults.length}/{totalChallenges}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPhase;
