/**
 * Analytics Data Utilities
 * Extracted helper functions for ESLint compliance
 */

// ============================================================================
// Default Analytics Data
// ============================================================================

export interface WeakTopic {
  topic: string;
  easinessFactor: number;
  attempts: number;
  lastAttempt: Date;
}
export interface WeeklyProgress {
  week: string;
  sessions: number;
  avgScore: number;
}
export interface MonthlyTrend {
  month: string;
  totalXP: number;
  skillsLearned: number;
}
export interface Skill {
  name: string;
  category: string;
  proficiency: number;
  sessionsCompleted: number;
  lastPracticed: string;
}

export interface AnalyticsData {
  totalStudyTime: number;
  avgSessionDuration: number;
  totalSessions: number;
  bestStudyHour: number;
  longestStreak: number;
  currentStreak: number;
  battleDrillsCompleted: number;
  battleDrillAvgTime: number;
  battleDrillSuccessRate: number;
  stressSessionsCompleted: number;
  productionScenariosCompleted: number;
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
  quizSuccessRate: number;
  avgQuizScore: number;
  labSuccessRate: number;
  avgLabScore: number;
  totalFailures: number;
  aarCompleted: number;
  lessonsLearned: number;
  resetTokensUsed: number;
  weakTopics: WeakTopic[];
  weeklyProgress: WeeklyProgress[];
  monthlyTrends: MonthlyTrend[];
  skills: Skill[];
}

export function getDefaultAnalytics(): AnalyticsData {
  return {
    totalStudyTime: 0,
    avgSessionDuration: 0,
    totalSessions: 0,
    bestStudyHour: 14,
    longestStreak: 0,
    currentStreak: 0,
    battleDrillsCompleted: 0,
    battleDrillAvgTime: 0,
    battleDrillSuccessRate: 0,
    stressSessionsCompleted: 0,
    productionScenariosCompleted: 0,
    crawlItems: 0,
    walkItems: 0,
    runGuidedItems: 0,
    runIndependentItems: 0,
    masteryLevel: 1,
    totalXP: 0,
    xpToNextLevel: 1000,
    skillsMastered: 0,
    totalSkills: 0,
    masteryRate: 0,
    quizSuccessRate: 0,
    avgQuizScore: 0,
    labSuccessRate: 0,
    avgLabScore: 0,
    totalFailures: 0,
    aarCompleted: 0,
    lessonsLearned: 0,
    resetTokensUsed: 0,
    weakTopics: [],
    weeklyProgress: [],
    monthlyTrends: [],
    skills: [],
  };
}

// ============================================================================
// Date Filter
// ============================================================================

export type TimeRange = "week" | "month" | "all";

export function getDateFilter(timeRange: TimeRange): Date {
  const now = new Date();
  switch (timeRange) {
    case "week": {
      const d = new Date(now);
      d.setDate(now.getDate() - 7);
      return d;
    }
    case "month": {
      const d = new Date(now);
      d.setMonth(now.getMonth() - 1);
      return d;
    }
    default:
      return new Date(0);
  }
}

// ============================================================================
// Session Processors
// ============================================================================

export interface SessionMetrics {
  totalTime: number;
  count: number;
  bestHour: number;
}

export function processSessionDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): SessionMetrics {
  let totalTime = 0;
  const hourCounts: Record<number, number> = {};

  docs.forEach((doc) => {
    const data = doc.data();
    totalTime += (data.duration as number) || 0;
    const ts = data.startTime as { toDate: () => Date } | undefined;
    const hour = ts?.toDate().getHours() || 14;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  let bestHour = 14,
    maxCount = 0;
  Object.entries(hourCounts).forEach(([h, c]) => {
    if (c > maxCount) {
      maxCount = c;
      bestHour = Number.parseInt(h);
    }
  });

  return { totalTime, count: docs.length, bestHour };
}

export interface DrillMetrics {
  count: number;
  avgTime: number;
  successRate: number;
}

export function processDrillDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): DrillMetrics {
  let count = 0,
    totalTime = 0,
    successful = 0;
  docs.forEach((doc) => {
    const data = doc.data();
    count += (data.attempts as number) || 0;
    totalTime += (data.bestTime as number) || 0;
    if ((data.bestTime as number) && (data.bestTime as number) <= 300)
      successful++;
  });
  return {
    count,
    avgTime: count > 0 ? totalTime / count : 0,
    successRate: docs.length > 0 ? successful / docs.length : 0,
  };
}

// ============================================================================
// Progress Processors
// ============================================================================

export interface MasteryMetrics {
  crawl: number;
  walk: number;
  runGuided: number;
  runIndependent: number;
  weakTopics: WeakTopic[];
}

export function processProgressDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): MasteryMetrics {
  let crawl = 0,
    walk = 0,
    runGuided = 0,
    runIndependent = 0;
  const weak: WeakTopic[] = [];

  docs.forEach((doc) => {
    const data = doc.data();
    switch (data.masteryLevel) {
      case "crawl":
        crawl++;
        break;
      case "walk":
        walk++;
        break;
      case "run-guided":
        runGuided++;
        break;
      case "run-independent":
        runIndependent++;
        break;
    }
    const ef = data.easinessFactor as number | undefined;
    if (ef && ef < 2) {
      const ts = data.lastReviewDate as { toDate: () => Date } | undefined;
      weak.push({
        topic: (data.lessonId || data.contentId || "Unknown") as string,
        easinessFactor: ef,
        attempts: (data.repetitions as number) || 0,
        lastAttempt: ts?.toDate() || new Date(),
      });
    }
  });

  const sortedWeak = weak
    .slice()
    .sort((a: WeakTopic, b: WeakTopic) => a.easinessFactor - b.easinessFactor);
  return {
    crawl,
    walk,
    runGuided,
    runIndependent,
    weakTopics: sortedWeak.slice(0, 5),
  };
}

export interface QuizMetrics {
  total: number;
  passed: number;
  totalScore: number;
}

export function processQuizDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): QuizMetrics {
  let passed = 0,
    totalScore = 0;
  docs.forEach((doc) => {
    const data = doc.data();
    totalScore += (data.score as number) || 0;
    if (data.passed) passed++;
  });
  return { total: docs.length, passed, totalScore };
}

export interface LabMetrics {
  total: number;
  passed: number;
  totalScore: number;
}

export function processLabDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): LabMetrics {
  let passed = 0,
    totalScore = 0;
  docs.forEach((doc) => {
    const data = doc.data();
    totalScore += (data.score as number) || 0;
    if (data.completed) passed++;
  });
  return { total: docs.length, passed, totalScore };
}

export interface FailureMetrics {
  total: number;
  aarCount: number;
  lessonsCount: number;
}

export function processFailureDocs(
  docs: Array<{ data: () => Record<string, unknown> }>,
): FailureMetrics {
  let aarCount = 0,
    lessonsCount = 0;
  docs.forEach((doc) => {
    const data = doc.data();
    if (data.aarCompleted) aarCount++;
    lessonsCount += (data.lessonsLearned as string[])?.length || 0;
  });
  return { total: docs.length, aarCount, lessonsCount };
}

// ============================================================================
// Streak Calculator
// ============================================================================

export function calculateStreaks(
  sessionDocs: Array<{ data: () => Record<string, unknown> }>,
): { current: number; longest: number } {
  const dailySessions = new Map<string, boolean>();
  sessionDocs.forEach((doc) => {
    const ts = doc.data().startTime as { toDate: () => Date } | undefined;
    const date = ts?.toDate().toISOString().split("T")[0];
    if (date) dailySessions.set(date, true);
  });

  let current = 0,
    longest = 0,
    temp = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(today.getDate() - i);
    const key = check.toISOString().split("T")[0];
    if (dailySessions.has(key)) {
      temp++;
      if (i === 0 || temp > 0) current = temp;
      longest = Math.max(longest, temp);
    } else {
      if (i === 0) current = 0;
      temp = 0;
    }
  }
  return { current, longest };
}

// ============================================================================
// Weekly Progress Calculator
// ============================================================================

export function calculateWeeklyProgress(
  sessionDocs: Array<{ data: () => Record<string, unknown> }>,
): WeeklyProgress[] {
  const result: WeeklyProgress[] = [];
  for (let i = 3; i >= 0; i--) {
    const start = new Date();
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    let sessions = 0,
      totalScore = 0,
      scoreCount = 0;

    sessionDocs.forEach((doc) => {
      const ts = doc.data().startTime as { toDate: () => Date } | undefined;
      const date = ts?.toDate();
      if (date && date >= start && date <= end) {
        sessions++;
        const score = doc.data().score as number | undefined;
        if (score) {
          totalScore += score;
          scoreCount++;
        }
      }
    });
    result.push({
      week: `Week ${4 - i}`,
      sessions,
      avgScore: scoreCount > 0 ? totalScore / scoreCount : 0,
    });
  }
  return result;
}

// ============================================================================
// Monthly Trends Calculator
// ============================================================================

export function calculateMonthlyTrends(
  progressDocs: Array<{ data: () => Record<string, unknown> }>,
): MonthlyTrend[] {
  const result: MonthlyTrend[] = [];
  for (let i = 2; i >= 0; i--) {
    const start = new Date();
    start.setMonth(start.getMonth() - i, 1);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1, 0);
    const monthName = start.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    let xp = 0,
      skills = 0;

    progressDocs.forEach((doc) => {
      const data = doc.data();
      const ts = (data.lastReviewDate || data.createdAt) as
        | { toDate: () => Date }
        | undefined;
      const date = ts?.toDate();
      if (date && date >= start && date <= end) {
        const level = data.masteryLevel;
        if (level === "run-independent") {
          xp += 100;
          skills++;
        } else if (level === "run-guided") xp += 75;
        else if (level === "walk") xp += 50;
        else if (level === "crawl") xp += 25;
      }
    });
    result.push({ month: monthName, totalXP: xp, skillsLearned: skills });
  }
  return result;
}

// ============================================================================
// Skills Builder
// ============================================================================

export function buildSkillsData(
  mastery: MasteryMetrics,
  totalProgress: number,
): Skill[] {
  const { runIndependent, runGuided, walk, crawl } = mastery;
  return [
    {
      name: "Container Orchestration",
      category: "Infrastructure",
      proficiency: Math.min(95, runIndependent * 5),
      sessionsCompleted: runIndependent,
      lastPracticed: "2 days ago",
    },
    {
      name: "CI/CD Pipelines",
      category: "Development",
      proficiency: Math.min(90, runGuided * 4),
      sessionsCompleted: runGuided,
      lastPracticed: "1 week ago",
    },
    {
      name: "Cloud Architecture",
      category: "Infrastructure",
      proficiency: Math.min(85, walk * 3),
      sessionsCompleted: walk,
      lastPracticed: "3 days ago",
    },
    {
      name: "Database Design",
      category: "Database",
      proficiency: Math.min(80, crawl * 2),
      sessionsCompleted: crawl,
      lastPracticed: "5 days ago",
    },
    {
      name: "Security Best Practices",
      category: "Security",
      proficiency: Math.min(75, Math.floor(totalProgress * 0.6)),
      sessionsCompleted: Math.floor(totalProgress * 0.6),
      lastPracticed: "1 day ago",
    },
  ];
}

// ============================================================================
// Build Full Analytics
// ============================================================================

interface BuildAnalyticsParams {
  session: SessionMetrics;
  drill: DrillMetrics;
  stress: number;
  scenarios: number;
  mastery: MasteryMetrics;
  progressSize: number;
  quiz: QuizMetrics;
  lab: LabMetrics;
  failure: FailureMetrics;
  tokenUsage: number;
  streaks: { current: number; longest: number };
  weeklyProgress: WeeklyProgress[];
  monthlyTrends: MonthlyTrend[];
}

export function buildAnalytics(params: BuildAnalyticsParams): AnalyticsData {
  const {
    session,
    drill,
    stress,
    scenarios,
    mastery,
    progressSize,
    quiz,
    lab,
    failure,
    tokenUsage,
    streaks,
    weeklyProgress,
    monthlyTrends,
  } = params;
  const { runIndependent, runGuided, crawl, walk } = mastery;
  const totalMastered = runIndependent + runGuided;
  const totalXP = totalMastered * 100 + crawl * 25 + walk * 50;
  const masteryLevel = Math.floor(totalMastered / 10) + 1;

  return {
    totalStudyTime: session.totalTime,
    avgSessionDuration:
      session.count > 0 ? session.totalTime / session.count : 0,
    totalSessions: session.count,
    bestStudyHour: session.bestHour,
    longestStreak: streaks.longest,
    currentStreak: streaks.current,
    battleDrillsCompleted: drill.count,
    battleDrillAvgTime: drill.avgTime,
    battleDrillSuccessRate: drill.successRate,
    stressSessionsCompleted: stress,
    productionScenariosCompleted: scenarios,
    crawlItems: crawl,
    walkItems: walk,
    runGuidedItems: runGuided,
    runIndependentItems: runIndependent,
    masteryLevel,
    totalXP,
    xpToNextLevel: masteryLevel * 1000 - (totalXP % 1000),
    skillsMastered: runIndependent,
    totalSkills: progressSize,
    masteryRate: progressSize > 0 ? runIndependent / progressSize : 0,
    quizSuccessRate: quiz.total > 0 ? quiz.passed / quiz.total : 0,
    avgQuizScore: quiz.total > 0 ? quiz.totalScore / quiz.total : 0,
    labSuccessRate: lab.total > 0 ? lab.passed / lab.total : 0,
    avgLabScore: lab.total > 0 ? lab.totalScore / lab.total : 0,
    totalFailures: failure.total,
    aarCompleted: failure.aarCount,
    lessonsLearned: failure.lessonsCount,
    resetTokensUsed: tokenUsage,
    weakTopics: mastery.weakTopics,
    weeklyProgress,
    monthlyTrends,
    skills: buildSkillsData(mastery, progressSize),
  };
}
