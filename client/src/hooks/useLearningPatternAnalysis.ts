/**
 * Learning Pattern Analysis Hook
 * Identifies patterns in study behavior and performance correlations
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface LearningPatternData {
  patterns: {
    studyConsistency: {
      score: number;
      description: string;
      recommendation: string;
    };
    timeOptimization: {
      optimalHours: number[];
      wastedHours: number[];
      efficiency: number;
    };
    topicStruggles: Array<{
      topic: string;
      pattern: string;
      frequency: number;
      suggestion: string;
    }>;
    performanceCorrelations: Array<{
      factor: string;
      correlation: number;
      insight: string;
    }>;
    adaptiveRecommendations: string[];
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    actionable: boolean;
  }>;
}

export function useLearningPatternAnalysis() {
  const { user } = useAuthStore();
  const [patternData, setPatternData] = useState<LearningPatternData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      analyzeLearningPatterns();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const analyzeLearningPatterns = async () => {
    if (!user) return;

    try {
      // Get study sessions and progress data
      const [sessionsSnap, progressSnap, failuresSnap] = await Promise.all([
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid)))
      ]);

      // Analyze study consistency
      const studyConsistency = analyzeStudyConsistency(sessionsSnap.docs);

      // Analyze time optimization
      const timeOptimization = analyzeTimeOptimization(sessionsSnap.docs, progressSnap.docs);

      // Analyze topic struggles
      const topicStruggles = analyzeTopicStruggles(failuresSnap.docs);

      // Analyze performance correlations
      const performanceCorrelations = analyzePerformanceCorrelations(sessionsSnap.docs, progressSnap.docs);

      // Generate adaptive recommendations
      const adaptiveRecommendations = generateAdaptiveRecommendations(
        studyConsistency,
        timeOptimization,
        topicStruggles,
        performanceCorrelations
      );

      // Generate insights
      const insights = generateInsights(
        studyConsistency,
        timeOptimization,
        topicStruggles,
        performanceCorrelations
      );

      setPatternData({
        patterns: {
          studyConsistency,
          timeOptimization,
          topicStruggles,
          performanceCorrelations,
          adaptiveRecommendations
        },
        insights
      });
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeStudyConsistency = (sessions: { data: () => { startTime?: { toDate: () => Date } } }[]): LearningPatternData['patterns']['studyConsistency'] => {
    if (sessions.length === 0) {
      return {
        score: 0,
        description: 'No study sessions recorded yet.',
        recommendation: 'Start studying regularly to establish patterns.'
      };
    }

    // Calculate daily study frequency
    const dailySessions: Record<string, boolean> = {};
    sessions.forEach(session => {
      const date = session.data().startTime?.toDate().toISOString().split('T')[0];
      if (date) dailySessions[date] = true;
    });

    const totalDays = Object.keys(dailySessions).length;
    const totalSessions = sessions.length;
    const avgSessionsPerDay = totalSessions / Math.max(totalDays, 1);

    // Calculate consistency score (0-100)
    const consistencyScore = Math.min(100, Math.max(0,
      (avgSessionsPerDay * 20) + // Base score from frequency
      (totalDays > 7 ? 30 : totalDays * 4) + // Bonus for longer streaks
      (totalSessions > 10 ? 20 : totalSessions * 2) // Bonus for volume
    ));

    let description = '';
    let recommendation = '';

    if (consistencyScore >= 80) {
      description = 'Excellent study consistency! You maintain regular learning habits.';
      recommendation = 'Keep up the great work. Consider optimizing study times for even better results.';
    } else if (consistencyScore >= 60) {
      description = 'Good study consistency with room for improvement.';
      recommendation = 'Try to study at the same times each day to build stronger habits.';
    } else if (consistencyScore >= 40) {
      description = 'Inconsistent study patterns detected.';
      recommendation = 'Establish a regular study schedule and stick to it for better retention.';
    } else {
      description = 'Study consistency needs significant improvement.';
      recommendation = 'Create a daily study routine and use reminders to maintain consistency.';
    }

    return {
      score: Math.round(consistencyScore),
      description,
      recommendation
    };
  };

  const analyzeTimeOptimization = (sessions: { data: () => { startTime?: { toDate: () => Date } } }[], progress: { data: () => { score?: number; startTime?: { toDate: () => Date } } }[]): LearningPatternData['patterns']['timeOptimization'] => {
    const hourlyPerformance: Record<number, { sessions: number; scores: number[] }> = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourlyPerformance[i] = { sessions: 0, scores: [] };
    }

    // Aggregate data by hour
    sessions.forEach(session => {
      const data = session.data();
      const hour = data.startTime?.toDate().getHours() || 0;
      hourlyPerformance[hour].sessions++;

      // Find corresponding progress data
      const progressData = progress.find(p =>
        p.data().completedAt?.toDate().getTime() === data.startTime?.toDate().getTime()
      );
      if (progressData) {
        const score = progressData.data().score || 0;
        hourlyPerformance[hour].scores.push(score);
      }
    });

    // Calculate average performance per hour
    const hourlyAvgScores = Object.entries(hourlyPerformance).map(([hour, data]) => ({
      hour: parseInt(hour),
      avgScore: data.scores.length > 0
        ? data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length
        : 0,
      sessions: data.sessions
    }));

    // Find optimal and wasted hours
    const sortedHours = hourlyAvgScores.sort((a, b) => b.avgScore - a.avgScore);
    const optimalHours = sortedHours.slice(0, 3).filter(h => h.avgScore > 0).map(h => h.hour);
    const wastedHours = sortedHours.slice(-3).filter(h => h.sessions > 0 && h.avgScore < 50).map(h => h.hour);

    // Calculate efficiency
    const totalSessions = sessions.length;
    const optimalSessions = optimalHours.reduce((sum, hour) =>
      sum + (hourlyPerformance[hour]?.sessions || 0), 0
    );
    const efficiency = totalSessions > 0 ? (optimalSessions / totalSessions) * 100 : 0;

    return {
      optimalHours,
      wastedHours,
      efficiency: Math.round(efficiency)
    };
  };

  const analyzeTopicStruggles = (failures: { data: () => { topic?: string; contentId?: string; failureType?: string; createdAt?: { toDate: () => Date } } }[]): LearningPatternData['patterns']['topicStruggles'] => {
    const topicFailures: Record<string, { count: number; patterns: string[]; lastFailure: Date }> = {};

    // Analyze failures by topic
    failures.forEach(failure => {
      const data = failure.data();
      const topic = data.topic || data.contentId || 'Unknown';
      const failureType = data.failureType || 'general';

      if (!topicFailures[topic]) {
        topicFailures[topic] = { count: 0, patterns: [], lastFailure: new Date(0) };
      }

      topicFailures[topic].count++;
      if (!topicFailures[topic].patterns.includes(failureType)) {
        topicFailures[topic].patterns.push(failureType);
      }
      const failureDate = data.createdAt?.toDate() || new Date();
      if (failureDate > topicFailures[topic].lastFailure) {
        topicFailures[topic].lastFailure = failureDate;
      }
    });

    // Convert to array and sort by frequency
    return Object.entries(topicFailures)
      .map(([topic, data]) => ({
        topic,
        pattern: `Frequently struggles with: ${data.patterns.join(', ')}`,
        frequency: data.count,
        suggestion: generateStruggleSuggestion(data.patterns, data.count)
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  };

  const analyzePerformanceCorrelations = (sessions: { data: () => { startTime?: { toDate: () => Date } } }[], progress: { data: () => { timeSpentMinutes?: number; score?: number } }[]): LearningPatternData['patterns']['performanceCorrelations'] => {
    const correlations: Array<{ factor: string; correlation: number; insight: string }> = [];

    // Time spent vs score correlation
    const timeScoreData = progress.map(p => {
      const data = p.data();
      return {
        time: data.timeSpentMinutes || 0,
        score: data.score || 0
      };
    }).filter(d => d.time > 0 && d.score > 0);

    if (timeScoreData.length > 5) {
      const timeScoreCorr = calculateCorrelation(
        timeScoreData.map(d => d.time),
        timeScoreData.map(d => d.score)
      );
      correlations.push({
        factor: 'Time Spent vs Score',
        correlation: timeScoreCorr,
        insight: timeScoreCorr > 0.5
          ? 'More time spent correlates with higher scores. Quality over quantity approach works well.'
          : timeScoreCorr > 0.2
          ? 'Some correlation between time and performance. Focus on efficient study methods.'
          : 'Time spent doesn\'t strongly predict performance. Focus on study quality and techniques.'
      });
    }

    // Session frequency vs mastery correlation
    const sessionMasteryData = sessions.map(session => {
      const data = session.data();
      const sessionDate = data.startTime?.toDate().toISOString().split('T')[0];
      const dayProgress = progress.filter(p => {
        const progressDate = p.data().completedAt?.toDate().toISOString().split('T')[0];
        return progressDate === sessionDate;
      });
      const avgMastery = dayProgress.length > 0
        ? dayProgress.reduce((sum, p) => sum + (p.data().score || 0), 0) / dayProgress.length
        : 0;

      return {
        sessions: 1, // Count per session
        mastery: avgMastery
      };
    });

    if (sessionMasteryData.length > 5) {
      const sessionMasteryCorr = calculateCorrelation(
        sessionMasteryData.map(d => d.sessions),
        sessionMasteryData.map(d => d.mastery)
      );
      correlations.push({
        factor: 'Session Frequency vs Mastery',
        correlation: sessionMasteryCorr,
        insight: sessionMasteryCorr > 0.3
          ? 'Regular study sessions correlate with better mastery. Consistency is key.'
          : 'Session frequency doesn\'t strongly impact mastery. Focus on quality of each session.'
      });
    }

    return correlations;
  };

  const generateStruggleSuggestion = (patterns: string[], frequency: number): string => {
    if (patterns.includes('time-pressure')) {
      return 'Practice time management and break complex topics into smaller chunks.';
    }
    if (patterns.includes('conceptual')) {
      return 'Review fundamental concepts and seek additional learning resources.';
    }
    if (patterns.includes('application')) {
      return 'Focus on hands-on practice and real-world application scenarios.';
    }
    if (frequency > 3) {
      return 'Consider seeking help from mentors or taking a break from this topic.';
    }
    return 'Review previous lessons and practice with simpler examples first.';
  };

  const generateAdaptiveRecommendations = (
    consistency: LearningPatternData['patterns']['studyConsistency'],
    timeOpt: LearningPatternData['patterns']['timeOptimization'],
    struggles: LearningPatternData['patterns']['topicStruggles'],
    correlations: LearningPatternData['patterns']['performanceCorrelations']
  ): string[] => {
    const recommendations: string[] = [];

    if (consistency.score < 60) {
      recommendations.push('Establish a consistent daily study routine with fixed times.');
    }

    if (timeOpt.optimalHours.length > 0) {
      recommendations.push(`Schedule study sessions during optimal hours: ${timeOpt.optimalHours.join(', ')}`);
    }

    if (struggles.length > 0) {
      recommendations.push('Focus on struggling topics with additional practice and review.');
    }

    const timeScoreCorr = correlations.find(c => c.factor === 'Time Spent vs Score');
    if (timeScoreCorr && timeScoreCorr.correlation < 0.3) {
      recommendations.push('Focus on study quality rather than quantity. Use active recall and spaced repetition.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current study habits while monitoring progress regularly.');
    }

    return recommendations;
  };

  const generateInsights = (
    consistency: LearningPatternData['patterns']['studyConsistency'],
    timeOpt: LearningPatternData['patterns']['timeOptimization'],
    struggles: LearningPatternData['patterns']['topicStruggles'],
    correlations: LearningPatternData['patterns']['performanceCorrelations']
  ): LearningPatternData['insights'] => {
    const insights: LearningPatternData['insights'] = [];

    // Study consistency insight
    if (consistency.score >= 80) {
      insights.push({
        type: 'success',
        title: 'Strong Study Habits',
        description: 'Your consistent study routine is contributing to excellent learning outcomes.',
        actionable: false
      });
    } else if (consistency.score < 40) {
      insights.push({
        type: 'warning',
        title: 'Inconsistent Study Pattern',
        description: 'Irregular study sessions may impact retention and mastery development.',
        actionable: true
      });
    }

    // Time optimization insight
    if (timeOpt.efficiency > 70) {
      insights.push({
        type: 'success',
        title: 'Optimal Study Timing',
        description: `You're studying at efficient times, achieving ${timeOpt.efficiency}% of sessions during peak performance hours.`,
        actionable: false
      });
    } else if (timeOpt.wastedHours.length > 0) {
      insights.push({
        type: 'info',
        title: 'Time Optimization Opportunity',
        description: `Consider avoiding study sessions during ${timeOpt.wastedHours.join(', ')} when performance is typically lower.`,
        actionable: true
      });
    }

    // Topic struggles insight
    if (struggles.length > 2) {
      insights.push({
        type: 'warning',
        title: 'Multiple Topic Challenges',
        description: `${struggles.length} topics showing repeated struggles. Consider reviewing fundamentals or seeking additional support.`,
        actionable: true
      });
    }

    // Performance correlation insights
    const timeCorr = correlations.find(c => c.factor === 'Time Spent vs Score');
    if (timeCorr && timeCorr.correlation < 0.2) {
      insights.push({
        type: 'info',
        title: 'Efficiency Focus',
        description: 'Study time doesn\'t strongly correlate with performance. Focus on quality study techniques.',
        actionable: true
      });
    }

    return insights;
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
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
  };

  return {
    patternData,
    loading,
    analyzeLearningPatterns
  };
}