/**
 * Curriculum Data Loader
 * Uses eager loading via Vite's import.meta.glob to avoid circular dependency issues
 */

import { baseWeeks, type Week } from '../data/baseWeeks';

// Eagerly load all lesson modules at build time to avoid runtime circular dependency issues
const lessonModules = import.meta.glob('../data/week*Lessons.ts', { eager: true }) as Record<string, Record<string, unknown>>;

class CurriculumLoader {
  private cache = new Map<number, Week>();
  private allWeeksCache: Week[] | null = null;

  constructor() {
    // Pre-populate cache on initialization
    console.log('CurriculumLoader: Initialized with modules:', Object.keys(lessonModules));
  }

  /**
   * Load a specific week's data
   */
  async loadWeek(weekNumber: number): Promise<Week> {
    // Check cache first
    if (this.cache.has(weekNumber)) {
      return this.cache.get(weekNumber)!;
    }

    const week = this.getWeekData(weekNumber);
    this.cache.set(weekNumber, week);
    return week;
  }

  /**
   * Load all weeks data
   */
  async loadAllWeeks(): Promise<Week[]> {
    if (this.allWeeksCache) {
      return this.allWeeksCache;
    }

    this.allWeeksCache = this.getAllWeeksData();
    return this.allWeeksCache;
  }

  /**
   * Get week data synchronously
   */
  getWeekSync(weekNumber: number): Week | null {
    if (this.cache.has(weekNumber)) {
      return this.cache.get(weekNumber)!;
    }
    return this.getWeekData(weekNumber);
  }

  /**
   * Preload critical weeks (current + adjacent)
   */
  async preloadWeeks(weekNumbers: number[]): Promise<void> {
    weekNumbers.forEach(weekNum => {
      if (!this.cache.has(weekNum)) {
        this.cache.set(weekNum, this.getWeekData(weekNum));
      }
    });
  }

  /**
   * Preload current week and adjacent weeks for better UX
   */
  async preloadCurrentWeek(currentWeek: number): Promise<void> {
    const weeksToPreload = [
      currentWeek, // Current week
      Math.max(1, currentWeek - 1), // Previous week
      Math.min(12, currentWeek + 1), // Next week
    ].filter((week, index, arr) => arr.indexOf(week) === index); // Remove duplicates

    await this.preloadWeeks(weeksToPreload);
  }

  private getWeekData(weekNumber: number): Week {
    const modulePath = `../data/week${weekNumber}Lessons.ts`;
    const weekData = baseWeeks.find(w => w.weekNumber === weekNumber);

    if (!weekData) {
      console.error(`CurriculumLoader: Week ${weekNumber} not found in base weeks`);
      throw new Error(`Week ${weekNumber} not found in base weeks data`);
    }

    try {
      const module = lessonModules[modulePath];
      if (module) {
        const lessons = module[`WEEK_${weekNumber}_LESSONS`] as Week['lessons'] || [];
        console.log(`CurriculumLoader: Loaded week ${weekNumber} with ${lessons.length} lessons`);
        return { ...weekData, lessons };
      } else {
        console.warn(`CurriculumLoader: Module ${modulePath} not found, using empty lessons`);
        return { ...weekData, lessons: [] };
      }
    } catch (error) {
      console.error(`CurriculumLoader: Error loading week ${weekNumber}:`, error);
      return { ...weekData, lessons: [] };
    }
  }

  private getAllWeeksData(): Week[] {
    console.log('CurriculumLoader: Loading all weeks data');
    const results: Week[] = [];

    for (let i = 1; i <= 12; i++) {
      try {
        results.push(this.getWeekData(i));
      } catch (error) {
        console.error(`CurriculumLoader: Error loading week ${i}:`, error);
        const weekData = baseWeeks.find(w => w.weekNumber === i);
        if (weekData) {
          results.push({ ...weekData, lessons: [] });
        }
      }
    }

    console.log(`CurriculumLoader: Loaded ${results.length} weeks total`);
    return results;
  }
}

// Export singleton instance
export const curriculumLoader = new CurriculumLoader();

// Export types
export type { Week };