/**
 * Week 9 Lessons - DevSecOps & Security
 */

import { week9Lesson1DevSecOpsFundamentals } from './week9Lesson1DevSecOpsFundamentals';
import { week9Lesson2ContainerSecurity } from './week9Lesson2ContainerSecurity';
import { week9Lesson3InfrastructureSecurity } from './week9Lesson3InfrastructureSecurity';
import type { LeveledLessonContent } from '../types/lessonContent';

export const WEEK_9_LESSONS: LeveledLessonContent[] = [
  week9Lesson1DevSecOpsFundamentals,
  week9Lesson2ContainerSecurity,
  week9Lesson3InfrastructureSecurity
];
