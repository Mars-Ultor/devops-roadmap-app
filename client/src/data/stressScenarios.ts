/**
 * Stress Training Scenarios
 * Progressive difficulty scenarios simulating real production pressure
 */

import type { StressScenario, TimePressureCondition, MultiTaskingCondition, ProductionIncidentCondition, StressLevel, ResourceConstraintCondition, InterruptionCondition } from '../types/training';

export const STRESS_SCENARIOS: StressScenario[] = [
  // LOW STRESS - Introduction to pressure
  {
    id: 'time-pressure-1',
    title: 'Quick Deploy Under Deadline',
    description: 'Deploy a Docker container within tight deadline. Customer demo in 30 minutes.',
    stressLevel: 'low' as StressLevel,
    conditions: [
      {
        id: 'tp-1',
        type: 'time-pressure',
        description: 'Deploy within 10 minutes',
        enabled: true,
        severity: 'low' as StressLevel,
        targetTimeSeconds: 600,
        penaltyPerSecondOver: 1,
        warningThresholdPercent: 75
      } as TimePressureCondition
    ],
    duration: 600,
    successCriteria: [
      'Container deployed successfully',
      'Service responding to health checks',
      'Completed within time limit'
    ],
    failurePenalty: 50,
    bonusReward: 100
  },

  // MEDIUM STRESS - Multiple simultaneous issues
  {
    id: 'multi-task-1',
    title: 'Parallel Deployment Crisis',
    description: 'Two services need deployment simultaneously. Different teams waiting.',
    stressLevel: 'medium' as StressLevel,
    conditions: [
      {
        id: 'mt-1',
        type: 'multi-tasking',
        description: 'Deploy 2 services in parallel',
        enabled: true,
        severity: 'medium' as StressLevel,
        simultaneousTasks: 2,
        taskSwitchPenalty: 30,
        requiresParallelExecution: true
      } as MultiTaskingCondition,
      {
        id: 'tp-2',
        type: 'time-pressure',
        description: 'Complete both within 15 minutes',
        enabled: true,
        severity: 'medium' as StressLevel,
        targetTimeSeconds: 900,
        penaltyPerSecondOver: 2,
        warningThresholdPercent: 70
      } as TimePressureCondition
    ],
    duration: 900,
    successCriteria: [
      'Both services deployed',
      'No cross-contamination of configs',
      'Both passing health checks',
      'Completed within time limit'
    ],
    failurePenalty: 100,
    bonusReward: 200
  },

  // HIGH STRESS - Production incident
  {
    id: 'incident-1',
    title: 'Production Outage Response',
    description: 'Service down! 5,000 users affected. CEO is asking for updates.',
    stressLevel: 'high' as StressLevel,
    conditions: [
      {
        id: 'pi-1',
        type: 'production-incident',
        description: 'Critical production outage',
        enabled: true,
        severity: 'critical',
        affectedUsers: 5000,
        revenueImpact: 1000,
        stakeholderPressure: true,
        timeToResolve: 15
      } as ProductionIncidentCondition,
      {
        id: 'tp-3',
        type: 'time-pressure',
        description: 'Restore service in 15 minutes',
        enabled: true,
        severity: 'high' as StressLevel,
        targetTimeSeconds: 900,
        penaltyPerSecondOver: 5,
        warningThresholdPercent: 60
      } as TimePressureCondition
    ],
    duration: 900,
    successCriteria: [
      'Service restored',
      'Root cause identified',
      'Rollback executed if needed',
      'Incident documented'
    ],
    failurePenalty: 200,
    bonusReward: 300
  },

  // EXTREME STRESS - Everything at once
  {
    id: 'chaos-1',
    title: 'Black Friday Chaos',
    description: 'Multiple services failing during peak traffic. All hands on deck!',
    stressLevel: 'extreme' as StressLevel,
    conditions: [
      {
        id: 'mt-2',
        type: 'multi-tasking',
        description: 'Handle 3 simultaneous incidents',
        enabled: true,
        severity: 'high' as StressLevel,
        simultaneousTasks: 3,
        taskSwitchPenalty: 60,
        requiresParallelExecution: true
      } as MultiTaskingCondition,
      {
        id: 'pi-2',
        type: 'production-incident',
        description: 'Critical outage during peak sales',
        enabled: true,
        severity: 'outage',
        affectedUsers: 50000,
        revenueImpact: 10000,
        stakeholderPressure: true,
        timeToResolve: 20
      } as ProductionIncidentCondition,
      {
        id: 'tp-4',
        type: 'time-pressure',
        description: 'Resolve all within 20 minutes',
        enabled: true,
        severity: 'extreme' as StressLevel,
        targetTimeSeconds: 1200,
        penaltyPerSecondOver: 10,
        warningThresholdPercent: 50
      } as TimePressureCondition
    ],
    duration: 1200,
    successCriteria: [
      'All critical services restored',
      'Traffic stabilized',
      'No data loss',
      'Stakeholders updated',
      'Post-incident plan created'
    ],
    failurePenalty: 500,
    bonusReward: 1000
  },

  // MEDIUM STRESS - Resource constraints
  {
    id: 'constrained-1',
    title: 'Limited Access Deployment',
    description: 'Deploy to production with limited permissions and no documentation.',
    stressLevel: 'medium' as StressLevel,
    conditions: [
      {
        id: 'rc-1',
        type: 'resource-constraint',
        description: 'Limited resources available',
        enabled: true,
        severity: 'medium' as StressLevel,
        limitedHints: 1,
        limitedAttempts: 2,
        noDocumentation: true,
        limitedTools: ['docker', 'git']
      } as ResourceConstraintCondition,
      {
        id: 'tp-5',
        type: 'time-pressure',
        description: 'Deploy within 12 minutes',
        enabled: true,
        severity: 'medium' as StressLevel,
        targetTimeSeconds: 720,
        penaltyPerSecondOver: 3,
        warningThresholdPercent: 70
      } as TimePressureCondition
    ],
    duration: 720,
    successCriteria: [
      'Deployment successful',
      'Worked within constraints',
      'No excessive retries'
    ],
    failurePenalty: 100,
    bonusReward: 250
  },

  // HIGH STRESS - Interruption handling
  {
    id: 'interrupt-1',
    title: 'Deploy While On-Call',
    description: 'Deploy new feature while handling incoming alerts and questions.',
    stressLevel: 'high' as StressLevel,
    conditions: [
      {
        id: 'int-1',
        type: 'interruption',
        description: 'Handle frequent interruptions',
        enabled: true,
        severity: 'high' as StressLevel,
        interruptionFrequency: 4,
        interruptionTypes: ['alert', 'question', 'incident'],
        mustRespond: true,
        responseTimeSeconds: 60
      } as InterruptionCondition,
      {
        id: 'tp-6',
        type: 'time-pressure',
        description: 'Complete deployment in 18 minutes',
        enabled: true,
        severity: 'medium' as StressLevel,
        targetTimeSeconds: 1080,
        penaltyPerSecondOver: 3,
        warningThresholdPercent: 65
      } as TimePressureCondition
    ],
    duration: 1080,
    successCriteria: [
      'Deployment completed',
      'All interruptions handled',
      'No missed alerts',
      'Context maintained between interruptions'
    ],
    failurePenalty: 150,
    bonusReward: 350
  }
];

export function getScenarioByStressLevel(level: StressLevel | string): StressScenario[] {
  return STRESS_SCENARIOS.filter(s => s.stressLevel === level as StressLevel);
}

export function getScenarioById(id: string): StressScenario | undefined {
  return STRESS_SCENARIOS.find(s => s.id === id);
}

/**
 * Calculate stress score based on active conditions
 * Returns 0-100 score representing current stress level
 */
export function calculateStressScore(
  conditions: any[],
  elapsedSeconds: number,
  errorsCount: number,
  tasksRemaining: number
): number {
  let score = 0;
  
  // Base stress from conditions
  conditions.forEach(condition => {
    switch (condition.type) {
      case 'time-pressure':
        const timeProgress = elapsedSeconds / condition.targetTimeSeconds;
        if (timeProgress > 0.75) score += 30;
        else if (timeProgress > 0.5) score += 20;
        else score += 10;
        break;
      
      case 'multi-tasking':
        score += condition.simultaneousTasks * 15;
        break;
      
      case 'production-incident':
        score += 40;
        if (condition.stakeholderPressure) score += 20;
        break;
      
      case 'interruption':
        score += condition.interruptionFrequency * 5;
        break;
      
      case 'resource-constraint':
        if (condition.noDocumentation) score += 15;
        if (condition.limitedAttempts <= 2) score += 15;
        break;
    }
  });
  
  // Additional stress from errors
  score += errorsCount * 10;
  
  // Additional stress from remaining tasks
  score += tasksRemaining * 5;
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Calculate fatigue level based on time and stress
 */
export function calculateFatigueLevel(
  elapsedSeconds: number,
  stressScore: number
): number {
  const baseFatigue = (elapsedSeconds / 60) * 2; // 2% per minute
  const stressFatigue = (stressScore / 100) * 20; // Up to 20% from stress
  
  return Math.min(100, baseFatigue + stressFatigue);
}

/**
 * Calculate focus level (decreases with fatigue and stress)
 */
export function calculateFocusLevel(
  fatigueLevel: number,
  stressScore: number
): number {
  const focusLoss = fatigueLevel * 0.5 + stressScore * 0.3;
  return Math.max(0, 100 - focusLoss);
}

/**
 * Determine performance rating based on results
 */
export function calculatePerformanceRating(
  tasksCompleted: number,
  totalTasks: number,
  timeToCompletion: number,
  targetTime: number,
  errorsCount: number
): 'excellent' | 'good' | 'adequate' | 'poor' | 'failed' {
  const completionRate = tasksCompleted / totalTasks;
  const timeRatio = timeToCompletion / targetTime;
  
  if (completionRate < 0.5) return 'failed';
  if (completionRate < 0.75) return 'poor';
  
  if (completionRate === 1 && timeRatio < 0.8 && errorsCount === 0) return 'excellent';
  if (completionRate === 1 && timeRatio < 1.0 && errorsCount <= 1) return 'good';
  if (completionRate >= 0.9 && timeRatio < 1.2) return 'adequate';
  
  return 'poor';
}

/**
 * Calculate adaptability score (how well they handled stress)
 */
export function calculateAdaptabilityScore(
  performanceRating: string,
  stressLevel: string,
  errorsUnderPressure: number,
  focusLevel: number
): number {
  let score = focusLevel; // Base from final focus level
  
  // Bonus for performance
  const performanceBonus = {
    'excellent': 30,
    'good': 20,
    'adequate': 10,
    'poor': 0,
    'failed': -20
  }[performanceRating] || 0;
  
  score += performanceBonus;
  
  // Stress level multiplier
  const stressMultiplier = {
    'none': 0.5,
    'low': 0.75,
    'medium': 1.0,
    'high': 1.25,
    'extreme': 1.5
  }[stressLevel] || 1.0;
  
  score *= stressMultiplier;
  
  // Penalty for errors
  score -= errorsUnderPressure * 5;
  
  return Math.min(100, Math.max(0, score));
}
