/**
 * Learning Pattern Analysis Utilities
 * Extracted analysis functions for ESLint compliance
 */

import type { LearningPatternData } from './useLearningPatternAnalysis';

// ============================================================================
// Correlation Calculation
// ============================================================================

export function calculateCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

// ============================================================================
// Study Consistency Analysis
// ============================================================================

type StudyConsistency = LearningPatternData['patterns']['studyConsistency'];

export function analyzeStudyConsistency(sessions: { data: () => { startTime?: { toDate: () => Date } } }[]): StudyConsistency {
  if (sessions.length === 0) {
    return { score: 0, description: 'No study sessions recorded yet.', recommendation: 'Start studying regularly to establish patterns.' };
  }

  const dailySessions: Record<string, boolean> = {};
  sessions.forEach(session => {
    const date = session.data().startTime?.toDate().toISOString().split('T')[0];
    if (date) dailySessions[date] = true;
  });

  const totalDays = Object.keys(dailySessions).length;
  const totalSessions = sessions.length;
  const avgSessionsPerDay = totalSessions / Math.max(totalDays, 1);

  const consistencyScore = Math.min(100, Math.max(0,
    (avgSessionsPerDay * 20) + (totalDays > 7 ? 30 : totalDays * 4) + (totalSessions > 10 ? 20 : totalSessions * 2)
  ));

  const { description, recommendation } = getConsistencyFeedback(consistencyScore);
  return { score: Math.round(consistencyScore), description, recommendation };
}

function getConsistencyFeedback(score: number): { description: string; recommendation: string } {
  if (score >= 80) return { description: 'Excellent study consistency!', recommendation: 'Keep up the great work.' };
  if (score >= 60) return { description: 'Good consistency with room for improvement.', recommendation: 'Try studying at same times daily.' };
  if (score >= 40) return { description: 'Inconsistent study patterns detected.', recommendation: 'Establish a regular schedule.' };
  return { description: 'Study consistency needs improvement.', recommendation: 'Create a daily routine with reminders.' };
}

// ============================================================================
// Time Optimization Analysis
// ============================================================================

type TimeOptimization = LearningPatternData['patterns']['timeOptimization'];

export function analyzeTimeOptimization(
  sessions: { data: () => { startTime?: { toDate: () => Date } } }[],
  progress: { data: () => { score?: number; completedAt?: { toDate: () => Date } } }[]
): TimeOptimization {
  const hourlyPerformance: Record<number, { sessions: number; scores: number[] }> = {};
  for (let i = 0; i < 24; i++) hourlyPerformance[i] = { sessions: 0, scores: [] };

  sessions.forEach(session => {
    const data = session.data();
    const hour = data.startTime?.toDate().getHours() || 0;
    hourlyPerformance[hour].sessions++;

    const progressData = progress.find(p => 
      p.data().completedAt?.toDate().getTime() === data.startTime?.toDate().getTime()
    );
    if (progressData) hourlyPerformance[hour].scores.push(progressData.data().score || 0);
  });

  const hourlyAvgScores = Object.entries(hourlyPerformance).map(([hour, data]) => ({
    hour: parseInt(hour),
    avgScore: data.scores.length > 0 ? data.scores.reduce((s, x) => s + x, 0) / data.scores.length : 0,
    sessions: data.sessions
  }));

  const sortedHours = hourlyAvgScores.sort((a, b) => b.avgScore - a.avgScore);
  const optimalHours = sortedHours.slice(0, 3).filter(h => h.avgScore > 0).map(h => h.hour);
  const wastedHours = sortedHours.slice(-3).filter(h => h.sessions > 0 && h.avgScore < 50).map(h => h.hour);

  const totalSessions = sessions.length;
  const optimalSessions = optimalHours.reduce((sum, h) => sum + (hourlyPerformance[h]?.sessions || 0), 0);
  const efficiency = totalSessions > 0 ? (optimalSessions / totalSessions) * 100 : 0;

  return { optimalHours, wastedHours, efficiency: Math.round(efficiency) };
}

// ============================================================================
// Topic Struggles Analysis
// ============================================================================

type TopicStruggles = LearningPatternData['patterns']['topicStruggles'];

export function analyzeTopicStruggles(
  failures: { data: () => { topic?: string; contentId?: string; failureType?: string; createdAt?: { toDate: () => Date } } }[]
): TopicStruggles {
  const topicFailures: Record<string, { count: number; patterns: string[]; lastFailure: Date }> = {};

  failures.forEach(failure => {
    const data = failure.data();
    const topic = data.topic || data.contentId || 'Unknown';
    const failureType = data.failureType || 'general';

    if (!topicFailures[topic]) topicFailures[topic] = { count: 0, patterns: [], lastFailure: new Date(0) };

    topicFailures[topic].count++;
    if (!topicFailures[topic].patterns.includes(failureType)) topicFailures[topic].patterns.push(failureType);
    
    const failureDate = data.createdAt?.toDate() || new Date();
    if (failureDate > topicFailures[topic].lastFailure) topicFailures[topic].lastFailure = failureDate;
  });

  return Object.entries(topicFailures)
    .map(([topic, data]) => ({
      topic,
      pattern: `Frequently struggles with: ${data.patterns.join(', ')}`,
      frequency: data.count,
      suggestion: generateStruggleSuggestion(data.patterns, data.count)
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);
}

export function generateStruggleSuggestion(patterns: string[], frequency: number): string {
  if (patterns.includes('time-pressure')) return 'Practice time management and break topics into smaller chunks.';
  if (patterns.includes('conceptual')) return 'Review fundamental concepts and seek additional resources.';
  if (patterns.includes('application')) return 'Focus on hands-on practice and real-world scenarios.';
  if (frequency > 3) return 'Consider seeking help from mentors or taking a break.';
  return 'Review previous lessons and practice with simpler examples.';
}

// ============================================================================
// Performance Correlations Analysis
// ============================================================================

type PerformanceCorrelations = LearningPatternData['patterns']['performanceCorrelations'];

export function analyzePerformanceCorrelations(
  sessions: { data: () => { startTime?: { toDate: () => Date } } }[],
  progress: { data: () => { timeSpentMinutes?: number; score?: number; completedAt?: { toDate: () => Date } } }[]
): PerformanceCorrelations {
  const correlations: PerformanceCorrelations = [];

  // Time spent vs score
  const timeScoreData = progress.map(p => ({ time: p.data().timeSpentMinutes || 0, score: p.data().score || 0 }))
    .filter(d => d.time > 0 && d.score > 0);

  if (timeScoreData.length > 5) {
    const corr = calculateCorrelation(timeScoreData.map(d => d.time), timeScoreData.map(d => d.score));
    correlations.push({
      factor: 'Time Spent vs Score',
      correlation: corr,
      insight: corr > 0.5 ? 'More time correlates with higher scores.' : corr > 0.2 ? 'Some time-performance correlation.' : 'Focus on study quality.'
    });
  }

  // Session frequency vs mastery
  const sessionMasteryData = sessions.map(session => {
    const sessionDate = session.data().startTime?.toDate().toISOString().split('T')[0];
    const dayProgress = progress.filter(p => p.data().completedAt?.toDate().toISOString().split('T')[0] === sessionDate);
    const avgMastery = dayProgress.length > 0 ? dayProgress.reduce((s, p) => s + (p.data().score || 0), 0) / dayProgress.length : 0;
    return { sessions: 1, mastery: avgMastery };
  });

  if (sessionMasteryData.length > 5) {
    const corr = calculateCorrelation(sessionMasteryData.map(d => d.sessions), sessionMasteryData.map(d => d.mastery));
    correlations.push({
      factor: 'Session Frequency vs Mastery',
      correlation: corr,
      insight: corr > 0.3 ? 'Regular sessions correlate with better mastery.' : 'Focus on quality per session.'
    });
  }

  return correlations;
}

// ============================================================================
// Recommendations & Insights Generation
// ============================================================================

type Insights = LearningPatternData['insights'];

export function generateAdaptiveRecommendations(
  consistency: StudyConsistency,
  timeOpt: TimeOptimization,
  struggles: TopicStruggles,
  correlations: PerformanceCorrelations
): string[] {
  const recommendations: string[] = [];
  if (consistency.score < 60) recommendations.push('Establish a consistent daily study routine.');
  if (timeOpt.optimalHours.length > 0) recommendations.push(`Study during optimal hours: ${timeOpt.optimalHours.join(', ')}`);
  if (struggles.length > 0) recommendations.push('Focus on struggling topics with additional practice.');
  const timeCorr = correlations.find(c => c.factor === 'Time Spent vs Score');
  if (timeCorr && timeCorr.correlation < 0.3) recommendations.push('Focus on study quality over quantity.');
  if (recommendations.length === 0) recommendations.push('Continue current habits while monitoring progress.');
  return recommendations;
}

export function generateInsights(
  consistency: StudyConsistency,
  timeOpt: TimeOptimization,
  struggles: TopicStruggles,
  correlations: PerformanceCorrelations
): Insights {
  const insights: Insights = [];

  if (consistency.score >= 80) insights.push({ type: 'success', title: 'Strong Study Habits', description: 'Your consistent routine is contributing to excellent outcomes.', actionable: false });
  else if (consistency.score < 40) insights.push({ type: 'warning', title: 'Inconsistent Study Pattern', description: 'Irregular sessions may impact retention.', actionable: true });

  if (timeOpt.efficiency > 70) insights.push({ type: 'success', title: 'Optimal Study Timing', description: `${timeOpt.efficiency}% of sessions at peak hours.`, actionable: false });
  else if (timeOpt.wastedHours.length > 0) insights.push({ type: 'info', title: 'Time Optimization', description: `Avoid studying during ${timeOpt.wastedHours.join(', ')}.`, actionable: true });

  if (struggles.length > 2) insights.push({ type: 'warning', title: 'Multiple Topic Challenges', description: `${struggles.length} topics showing struggles.`, actionable: true });

  const timeCorr = correlations.find(c => c.factor === 'Time Spent vs Score');
  if (timeCorr && timeCorr.correlation < 0.2) insights.push({ type: 'info', title: 'Efficiency Focus', description: 'Focus on quality study techniques.', actionable: true });

  return insights;
}
