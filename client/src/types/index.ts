// Central export for all types
export type { ValidationResult } from './training';
export * from './aar';
export * from './accountability';
export * from './adaptiveDifficulty';
export * from './aiCoach';
export * from './lessonContent';
export * from './scenarios';
export * from './stress';
export * from './struggle';
export * from './tcs';
export * from './tokens';
export * from './training';

// Direct exports for build compatibility
export type DifficultyLevel = 'recruit' | 'soldier' | 'specialist' | 'elite';
export { DIFFICULTY_THRESHOLDS } from './adaptiveDifficulty';