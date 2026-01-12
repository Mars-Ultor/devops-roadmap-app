/**
 * Level configuration utilities for MasteryLesson component
 */

import { BookOpen, Target, Brain, Zap } from 'lucide-react';

export interface LevelConfig {
  name: string;
  icon: () => React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  showHints: boolean;
  showVideo: boolean;
  allowStruggle: boolean;
}

export type MasteryLevel = 'crawl' | 'walk' | 'run-guided' | 'run-independent';

export interface LessonContent {
  videoId?: string;
  instructions: string;
  objectives: string[];
  hints?: string[];
  quiz?: unknown[];
  labInstructions?: string;
}

export interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  content: {
    crawl: LessonContent;
    walk: LessonContent;
    runGuided: LessonContent;
    runIndependent: LessonContent;
  };
}

/**
 * Get configuration for a specific mastery level
 */
export function getLevelConfig(level: MasteryLevel): LevelConfig {
  switch (level) {
    case 'crawl':
      return {
        name: 'Crawl - Guided Learning',
        icon: () => <BookOpen className="w-5 h-5" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/20',
        description: 'Step-by-step guided instruction with full support',
        showHints: true,
        showVideo: true,
        allowStruggle: false
      };
    case 'walk':
      return {
        name: 'Walk - Interactive Learning',
        icon: () => <Target className="w-5 h-5" />,
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        description: 'Fill-in-the-blanks with some independence',
        showHints: true,
        showVideo: false,
        allowStruggle: true
      };
    case 'run-guided':
      return {
        name: 'Run-Guided - Conceptual Mastery',
        icon: () => <Brain className="w-5 h-5" />,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-900/20',
        description: 'Conceptual understanding with minimal guidance',
        showHints: false,
        showVideo: false,
        allowStruggle: true
      };
    case 'run-independent':
      return {
        name: 'Run-Independent - Full Mastery',
        icon: () => <Zap className="w-5 h-5" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-900/20',
        description: 'Complete independence with no assistance',
        showHints: false,
        showVideo: false,
        allowStruggle: true
      };
  }
}

/**
 * Get next level name for display purposes
 */
export function getNextLevelDisplayName(currentLevel: MasteryLevel): string | undefined {
  const levelMap: Record<MasteryLevel, string | undefined> = {
    'crawl': 'Walk',
    'walk': 'Run-Guided',
    'run-guided': 'Run-Independent',
    'run-independent': undefined
  };
  return levelMap[currentLevel];
}

/**
 * Get next level ID for navigation
 */
export function getNextLevelId(currentLevel: MasteryLevel): MasteryLevel | null {
  const levelMap: Record<MasteryLevel, MasteryLevel | null> = {
    'crawl': 'walk',
    'walk': 'run-guided',
    'run-guided': 'run-independent',
    'run-independent': null
  };
  return levelMap[currentLevel];
}

/**
 * Get content key for accessing lesson data
 */
export function getContentKey(level: MasteryLevel): keyof LessonData['content'] {
  switch (level) {
    case 'crawl': return 'crawl';
    case 'walk': return 'walk';
    case 'run-guided': return 'runGuided';
    case 'run-independent': return 'runIndependent';
  }
}

/**
 * Normalize level parameter (support both kebab-case and camelCase)
 */
export function normalizeLevel(param: string | undefined): MasteryLevel {
  if (!param) return 'crawl';
  const levelMap: Record<string, MasteryLevel> = {
    'crawl': 'crawl',
    'walk': 'walk',
    'run-guided': 'run-guided',
    'runGuided': 'run-guided',
    'run-independent': 'run-independent',
    'runIndependent': 'run-independent'
  };
  return levelMap[param] || param as MasteryLevel;
}

/**
 * Check if level parameters are valid
 */
export function isValidLevelParam(levelParam: string | undefined): boolean {
  const validLevels = new Set<MasteryLevel>(['crawl', 'walk', 'run-guided', 'run-independent']);
  return levelParam ? validLevels.has(levelParam as MasteryLevel) : false;
}