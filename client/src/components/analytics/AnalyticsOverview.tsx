import { TimeAnalysisChart } from './TimeAnalysisChart';
import KeyMetricsGrid from './KeyMetricsGrid';
import TrainingPerformance from './TrainingPerformance';
import MasteryProgression from './MasteryProgression';
import PerformanceTrends from './PerformanceTrends';
import SkillBreakdown from './SkillBreakdown';
import QuizLabPerformance from './QuizLabPerformance';
import FailureAnalysis from './FailureAnalysis';
import WeakAreas from './WeakAreas';
import PersonalizedInsights from './PersonalizedInsights';
import type { TimeAnalysisData } from '../../hooks/useTimeAnalysis';

interface AnalyticsData {
  // Study metrics
  totalStudyTime: number;
  avgSessionDuration: number;
  totalSessions: number;
  bestStudyHour: number;
  longestStreak: number;
  currentStreak: number;

  // Training metrics
  battleDrillsCompleted: number;
  battleDrillAvgTime: number;
  battleDrillSuccessRate: number;
  stressSessionsCompleted: number;
  productionScenariosCompleted: number;

  // Mastery progression
  crawlItems: number;
  walkItems: number;
  runGuidedItems: number;
  runIndependentItems: number;
  masteryLevel: number;
  totalXP: number;
  xpToNextLevel: number;
  skillsMastered: number;
  totalSkills: number;
  masteryRate: number;

  // Performance metrics
  quizSuccessRate: number;
  avgQuizScore: number;
  labSuccessRate: number;
  avgLabScore: number;

  // Failure analysis
  totalFailures: number;
  aarCompleted: number;
  lessonsLearned: number;
  resetTokensUsed: number;

  // Additional data
  weakTopics: Array<{ topic: string; easinessFactor: number; attempts: number; lastAttempt: Date }>;
  weeklyProgress: Array<{ week: string; sessions: number; avgScore: number }>;
  monthlyTrends: Array<{ month: string; totalXP: number; skillsLearned: number }>;
  skills: Array<{ name: string; category: string; proficiency: number; sessionsCompleted: number; lastPracticed: string }>;
}

interface AnalyticsOverviewProps {
  readonly analytics: AnalyticsData;
  readonly analysisData: TimeAnalysisData | null;
  readonly timeAnalysisLoading: boolean;
  readonly formatHour: (hour: number) => string;
  readonly formatDuration: (seconds: number) => string;
  readonly formatTime: (seconds: number) => string;
}

export default function AnalyticsOverview({
  analytics,
  analysisData,
  timeAnalysisLoading,
  formatHour,
  formatDuration,
  formatTime
}: AnalyticsOverviewProps) {
  return (
    <div>
      {/* Key Metrics Grid */}
      <KeyMetricsGrid analytics={analytics} formatDuration={formatDuration} />

      {/* Training Performance */}
      <TrainingPerformance analytics={analytics} formatTime={formatTime} />

      {/* Mastery Progression */}
      <MasteryProgression analytics={analytics} />

      {/* Performance Trends */}
      <PerformanceTrends analytics={analytics} />

      {/* Skill Breakdown */}
      <SkillBreakdown skills={analytics.skills} />

      {/* Quiz & Lab Performance */}
      <QuizLabPerformance analytics={analytics} />

      {/* Failure Analysis */}
      <FailureAnalysis analytics={analytics} />

      {/* Weak Areas */}
      <WeakAreas analytics={analytics} />

      {/* Time Analysis Chart */}
      {!timeAnalysisLoading && analysisData && analysisData.totalDataPoints > 0 && (
        <TimeAnalysisChart
          data={analysisData}
          formatHour={formatHour}
        />
      )}

      {/* Personalized Insights */}
      <PersonalizedInsights analytics={analytics} />
    </div>
  );
}