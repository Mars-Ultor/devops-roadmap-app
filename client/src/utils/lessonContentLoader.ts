/**
 * Lesson Content Loader
 * Dynamically loads detailed lesson content for mastery-based learning
 */

import type { LeveledLessonContent } from '../types/lessonContent';

/**
 * Mapping from curriculum lesson IDs to lesson content exports
 */
const LESSON_CONTENT_MAP: Record<string, () => Promise<LeveledLessonContent>> = {
  // Week 1
  'week1-lesson1-what-is-devops': () => import('../data/week1Lesson1DevOps').then(m => m.week1Lesson1WhatIsDevOps),
  'week1-lesson2-linux-basics': () => import('../data/week1Lessons').then(m => m.week1Lesson2LinuxBasics),
  'week1-lesson3-bash-basics': () => import('../data/week1Lesson3Bash').then(m => m.week1Lesson3BashBasics),
  // Legacy short IDs for backward compatibility
  'w1-l1': () => import('../data/week1Lesson1DevOps').then(m => m.week1Lesson1WhatIsDevOps),
  'w1-l2': () => import('../data/week1Lessons').then(m => m.week1Lesson2LinuxBasics),
  'w1-l3': () => import('../data/week1Lesson3Bash').then(m => m.week1Lesson3BashBasics),

  // Week 2
  'w2-l1': () => import('../data/week2Lessons').then(m => m.week2Lesson1GitBasics),
  'w2-l2': () => import('../data/week2Lesson2VersionControl').then(m => m.week2Lesson2WhyVersionControl),
  'w2-l3': () => import('../data/week2Lesson3GitHub').then(m => m.week2Lesson3GitHubWorkflow),
  // 'w2-l4': No detailed content yet

  // Week 3
  'w3-l1': () => import('../data/week3Lesson1CloudConcepts').then(m => m.week3Lesson1CloudConcepts),
  'w3-l2': () => import('../data/week3Lesson2AWSServices').then(m => m.week3Lesson2AWSServices),
  // 'w3-l3': No detailed content yet
  // 'w3-l4': No detailed content yet

  // Week 4
  'w4-l1': () => import('../data/week4Lesson1WhyContainers').then(m => m.week4Lesson1WhyContainers),
  'w4-l2': () => import('../data/week4Lessons').then(m => m.week4Lesson2DockerBasics),
  // 'w4-l3': No detailed content yet
  // 'w4-l4': No detailed content yet

  // Week 5
  // 'w5-l1': No detailed content yet
  'w5-l2': () => import('../data/week5Lesson2GitHubActions').then(m => m.week5Lesson2GitHubActions),
  // 'w5-l3': No detailed content yet
  // 'w5-l4': No detailed content yet

  // Week 6
  // 'w6-l1': No detailed content yet
  // 'w6-l2': No detailed content yet
  // 'w6-l3': No detailed content yet
  // 'w6-l4': No detailed content yet

  // Week 7
  'w7-l1': () => import('../data/week7Lesson1WhyKubernetes').then(m => m.week7Lesson1WhyKubernetes),
  'w7-l2': () => import('../data/week7Lesson2KubernetesBasics').then(m => m.week7Lesson2KubernetesBasics),
  // 'w7-l3': No detailed content yet
  // 'w7-l4': No detailed content yet

  // Week 8
  'w8-l1': () => import('../data/week8Lesson1ObservabilityConcepts').then(m => m.week8Lesson1ObservabilityConcepts),
  // 'w8-l2': No detailed content yet
  'w8-l3': () => import('../data/week8Lesson3LogAggregation').then(m => m.week8Lesson3LogAggregation),
  // 'w8-l4': No detailed content yet

  // Week 9
  // 'w9-l1': No detailed content yet
  // 'w9-l2': No detailed content yet
  // 'w9-l3': No detailed content yet
  // 'w9-l4': No detailed content yet

  // Week 10-12: No detailed content yet
  // 'w10-l1': No detailed content yet
  // 'w10-l2': No detailed content yet
  // 'w10-l3': No detailed content yet
  // 'w11-l1': No detailed content yet
  // 'w11-l2': No detailed content yet
  // 'w11-l3': No detailed content yet
  // 'w12-l1': No detailed content yet
  // 'w12-l2': No detailed content yet
  // 'w12-l3': No detailed content yet
};

/**
 * Load detailed lesson content for a given lesson ID
 */
export async function loadLessonContent(lessonId: string): Promise<LeveledLessonContent | null> {
  const loader = LESSON_CONTENT_MAP[lessonId];
  if (!loader) {
    return null; // No detailed content available for this lesson
  }

  try {
    return await loader();
  } catch (error) {
    console.error(`Failed to load lesson content for ${lessonId}:`, error);
    return null;
  }
}

/**
 * Check if detailed content is available for a lesson
 */
export function hasDetailedContent(lessonId: string): boolean {
  return lessonId in LESSON_CONTENT_MAP;
}

/**
 * Get all available lesson IDs with detailed content
 */
export function getAvailableLessonIds(): string[] {
  return Object.keys(LESSON_CONTENT_MAP);
}