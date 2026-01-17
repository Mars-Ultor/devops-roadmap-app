/**
 * Dashboard Components - Extracted for ESLint compliance
 * Reduces complexity of main Dashboard component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import ResetTokenDisplay from '../tokens/ResetTokenDisplay';
import {
  Flame, BookOpen, Zap, Code, Trophy, Target, Settings, Brain,
  Users, Award, RefreshCw, AlertTriangle, Shield
} from 'lucide-react';
import type { WeeklyCommitment, ResetTokenAllocation, DifficultyLevel, AdaptiveDifficultySettings } from '../types/accountability';
import type { RecertificationStatus } from '../types/recertification';
import { DIFFICULTY_THRESHOLDS } from '../types/adaptiveDifficulty';

interface DashboardStats {
  totalXP: number;
  currentWeek: number;
  labsCompleted: number;
  badgesEarned: number;
}

export const HeroSection: React.FC = () => (
  <div className="mb-12">
    <h1 className="text-4xl font-bold text-white mb-3">
      Welcome back! 👋
    </h1>
    <p className="text-xl text-gray-400">
      Continue your DevOps journey and become job-ready in 3 months.
    </p>
  </div>
);

export const DiagnosticBanner: React.FC = () => (
  <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 border border-indigo-500">
    <div className="flex items-start gap-4">
      <Brain className="w-12 h-12 text-white flex-shrink-0" />
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-2">
          📊 Personalize Your Learning Path
        </h3>
        <p className="text-indigo-100 mb-4">
          Take our 2-minute diagnostic quiz to get a customized learning path based on your current skills.
          Skip topics you know and focus on what matters most!
        </p>
        <div className="flex gap-3">
          <Link
            to="/diagnostic"
            className="bg-white text-indigo-600 font-semibold py-2 px-6 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Take Diagnostic Quiz
          </Link>
          <Link
            to="/learning-settings"
            className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-800 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Customize Settings
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export const ProgressOverview: React.FC<{ stats: DashboardStats; currentStreak: number }> = ({ stats, currentStreak }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
    <div className="bg-gradient-to-br from-orange-900 to-red-800 rounded-xl p-6 border border-orange-700 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-orange-200">Current Streak</p>
        <Flame className="w-6 h-6 text-orange-400" />
      </div>
      <p className="text-4xl font-bold text-white mb-1">{currentStreak}</p>
      <p className="text-sm text-orange-300">days in a row 🔥</p>
    </div>
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-xl p-6 border border-indigo-700 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-indigo-200">Current Week</p>
        <BookOpen className="w-6 h-6 text-indigo-300" />
      </div>
      <p className="text-4xl font-bold text-white mb-1">{stats.currentWeek}</p>
      <p className="text-sm text-indigo-300">of 12 weeks</p>
    </div>
    <div className="bg-gradient-to-br from-yellow-900 to-orange-800 rounded-xl p-6 border border-yellow-700 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-yellow-200">Total XP</p>
        <Zap className="w-6 h-6 text-yellow-400" />
      </div>
      <p className="text-4xl font-bold text-white mb-1">{stats.totalXP}</p>
      <p className="text-sm text-yellow-300">Keep earning!</p>
    </div>
    <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-xl p-6 border border-green-700 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-green-200">Labs Done</p>
        <Code className="w-6 h-6 text-green-300" />
      </div>
      <p className="text-4xl font-bold text-white mb-1">{stats.labsCompleted}</p>
      <p className="text-sm text-green-300">{Math.round((stats.labsCompleted / 33) * 100)}% of 33</p>
    </div>
    <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-xl p-6 border border-purple-700 shadow-lg hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-purple-200">Badges</p>
        <Trophy className="w-6 h-6 text-purple-300" />
      </div>
      <p className="text-4xl font-bold text-white mb-1">{stats.badgesEarned}</p>
      <p className="text-sm text-purple-300">of 9 total</p>
    </div>
  </div>
);

export const ResetTokensSection: React.FC<{ currentAllocation: ResetTokenAllocation }> = ({ currentAllocation }) => (
  <div className="mb-12">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold text-white">Reset Tokens</h2>
      <Link
        to="/tokens"
        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
      >
        View Details →
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ResetTokenDisplay allocation={currentAllocation} type="quiz" />
      <ResetTokenDisplay allocation={currentAllocation} type="lab" />
      <ResetTokenDisplay allocation={currentAllocation} type="battleDrill" />
    </div>
    <div className="mt-4 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <RefreshCw className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-300">
          <span className="font-semibold">Limited resets encourage learning from failures.</span> Tokens refresh every Monday.
          Review your After Action Reports before using a reset!
        </p>
      </div>
    </div>
  </div>
);

export const AccountabilitySection: React.FC<{
  currentWeekCommitment: WeeklyCommitment | null;
  accountabilityLoading: boolean;
}> = ({ currentWeekCommitment, accountabilityLoading }) => {
  if (accountabilityLoading) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Weekly Commitments</h2>
        <Link
          to="/accountability"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          Manage Accountability →
        </Link>
      </div>

      {currentWeekCommitment ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">
              Week {currentWeekCommitment.weekNumber} • {currentWeekCommitment.weekStart.toLocaleDateString()} - {currentWeekCommitment.weekEnd.toLocaleDateString()}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold bg-green-900/30 text-green-400`}>
              {currentWeekCommitment.overallStatus.toUpperCase()}
            </span>
          </div>

          <div className="space-y-3">
            {(currentWeekCommitment.commitments || []).slice(0, 3).map((commitment) => (
              <div key={commitment.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span className="font-medium text-white">{commitment.description}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {commitment.current} / {commitment.target}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min((commitment.current / commitment.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {currentWeekCommitment.commitments && currentWeekCommitment.commitments.length > 3 && (
            <p className="mt-4 text-center text-sm text-gray-400">
              +{currentWeekCommitment.commitments.length - 3} more commitments
            </p>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-6 text-center">
          <Users className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">No Active Commitments</h3>
          <p className="text-gray-400 mb-4">
            Start your week strong by setting clear, measurable commitments
          </p>
          <Link
            to="/accountability"
            className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
          >
            Create This Week's Commitments
          </Link>
        </div>
      )}
    </div>
  );
};

const getLevelClass = (level: DifficultyLevel) => {
  switch (level) {
    case 'recruit': return 'bg-green-900/30 border-green-700';
    case 'soldier': return 'bg-blue-900/30 border-blue-700';
    case 'specialist': return 'bg-purple-900/30 border-purple-700';
    case 'elite': return 'bg-red-900/30 border-red-700';
  }
};

const getLevelTextClass = (level: DifficultyLevel) => {
  switch (level) {
    case 'recruit': return 'text-green-400';
    case 'soldier': return 'text-blue-400';
    case 'specialist': return 'text-purple-400';
    case 'elite': return 'text-red-400';
  }
};

export const AdaptiveDifficultySection: React.FC<{
  currentLevel: DifficultyLevel | null;
  settings: AdaptiveDifficultySettings | null;
  difficultyLoading: boolean;
}> = ({ currentLevel, settings, difficultyLoading }) => {
  if (difficultyLoading || !currentLevel || !settings) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Difficulty Level</h2>
        <Link
          to="/difficulty"
          className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
        >
          Manage Settings →
        </Link>
      </div>

      <div className={`border rounded-lg p-6 ${getLevelClass(currentLevel)}`}>
        <div className="flex items-center gap-4 mb-4">
          <Award className={`w-10 h-10 ${getLevelTextClass(currentLevel)}`} />
          <div>
            <h3 className="text-xl font-bold text-white">
              {DIFFICULTY_THRESHOLDS[currentLevel].name}
            </h3>
            <p className="text-sm text-gray-300">
              {DIFFICULTY_THRESHOLDS[currentLevel].description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-900/40 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Quiz Pass</div>
            <div className="text-lg font-bold text-white">{settings.quizPassingScore}%</div>
          </div>
          <div className="bg-gray-900/40 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Time Limit</div>
            <div className="text-lg font-bold text-white">{(settings.quizTimeMultiplier * 100).toFixed(0)}%</div>
          </div>
          <div className="bg-gray-900/40 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Lab Support</div>
            <div className="text-lg font-bold text-white capitalize">{settings.labGuidanceLevel}</div>
          </div>
          <div className="bg-gray-900/40 rounded-lg p-3">
            <div className="text-xs text-gray-400 mb-1">Stress Level</div>
            <div className="text-lg font-bold text-white">{settings.stressIntensity}/5</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuickActionsSection: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
    <Link
      to="/training"
      className="group bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] min-h-[120px] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Continue Learning</h3>
        <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-200 group-hover:scale-110 transition flex-shrink-0" />
      </div>
      <p className="text-indigo-100 text-base sm:text-lg">Pick up where you left off in Week {stats.currentWeek}</p>
    </Link>
    <Link
      to="/projects"
      className="group bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] min-h-[120px] flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Portfolio Projects</h3>
        <Code className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-200 group-hover:scale-110 transition flex-shrink-0" />
      </div>
      <p className="text-emerald-100 text-base sm:text-lg">Build real-world projects for your resume</p>
    </Link>
  </div>
);

export const MotivationSection: React.FC<{ stats: DashboardStats }> = ({ stats }) => (
  <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-lg">
    <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
      🎯 Your 3-Month Goal
    </h3>
    <div className="w-full bg-slate-700 rounded-full h-6 mb-3 overflow-hidden">
      <div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-3"
        style={{ width: `${(stats.currentWeek / 12) * 100}%` }}
      >
        <span className="text-white text-xs font-bold">
          {Math.round((stats.currentWeek / 12) * 100)}%
        </span>
      </div>
    </div>
    <p className="text-gray-300 text-lg">
      <span className="font-bold text-indigo-400">{12 - stats.currentWeek}</span> weeks until job-ready 🚀
    </p>
  </div>
);

export const RecertificationAlert: React.FC<{
  recertStatus: RecertificationStatus | null;
  recertLoading: boolean;
  showRecertification: () => void;
}> = ({ recertStatus, recertLoading, showRecertification }) => {
  if (recertLoading || !recertStatus || (!recertStatus.isOverdue && recertStatus.skillsNeedingRecert.length === 0)) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={showRecertification}
        className="w-full bg-gradient-to-r from-red-900 to-orange-900 hover:from-red-800 hover:to-orange-800 rounded-xl p-6 border border-red-700 text-left shadow-lg hover:shadow-xl transition"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Recertification {recertStatus.isOverdue ? 'Overdue' : 'Recommended'}
            </h3>
            <p className="text-red-100 mt-2">
              {recertStatus.skillsNeedingRecert.length} skill{recertStatus.skillsNeedingRecert.length === 1 ? '' : 's'} showing decay
              {recertStatus.isOverdue && ' • Content blocked until recertified'}
            </p>
          </div>
          <Shield className="w-12 h-12 text-red-300" />
        </div>
      </button>
    </div>
  );
};

export const ChallengeButtonsSection: React.FC<{
  stats: DashboardStats;
  showDailyChallenge: () => void;
  showBossBattle: () => void;
  recertStatus: RecertificationStatus | null;
  recertLoading: boolean;
  showRecertification: () => void;
}> = ({ stats, showDailyChallenge, showBossBattle, recertStatus, recertLoading, showRecertification }) => (
  <>
    {/* Challenge Buttons */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-8">
      <button
        onClick={showDailyChallenge}
        className="bg-gradient-to-r from-amber-900 to-orange-900 hover:from-amber-800 hover:to-orange-800 rounded-xl p-4 sm:p-6 border border-amber-700 text-left shadow-lg hover:shadow-xl transition group min-h-[100px] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-2xl font-bold text-white">Daily Challenge</h3>
          <Target className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300 group-hover:scale-110 transition flex-shrink-0" />
        </div>
        <p className="text-amber-100 text-sm sm:text-base">5-minute randomized scenario • Sharpen your skills</p>
      </button>

      <button
        onClick={showBossBattle}
        className="bg-gradient-to-r from-red-900 to-rose-900 hover:from-red-800 hover:to-rose-800 rounded-xl p-4 sm:p-6 border border-red-700 text-left shadow-lg hover:shadow-xl transition group min-h-[100px] flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg sm:text-2xl font-bold text-white">Week {stats.currentWeek} Boss Battle</h3>
          <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-red-300 group-hover:scale-110 transition flex-shrink-0" />
        </div>
        <p className="text-red-100 text-sm sm:text-base">2-hour comprehensive challenge • Required to advance</p>
      </button>
    </div>

    {/* Recertification Alert */}
    <RecertificationAlert
      recertStatus={recertStatus}
      recertLoading={recertLoading}
      showRecertification={showRecertification}
    />
  </>
);