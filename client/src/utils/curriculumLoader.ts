/**
 * Lazy Curriculum Data Loader
 * Loads curriculum data on-demand to reduce initial bundle size
 */

import { baseWeeks, type Week } from '../data/baseWeeks';

class CurriculumLoader {
  private cache = new Map<number, Promise<Week>>();
  private allWeeksCache: Promise<Week[]> | null = null;

  /**
   * Load a specific week's data
   */
  async loadWeek(weekNumber: number): Promise<Week> {
    if (this.cache.has(weekNumber)) {
      return this.cache.get(weekNumber)!;
    }

    const weekPromise = this.importWeekData(weekNumber);
    this.cache.set(weekNumber, weekPromise);
    return weekPromise;
  }

  /**
   * Load all weeks data (use sparingly - loads everything)
   */
  async loadAllWeeks(): Promise<Week[]> {
    if (this.allWeeksCache) {
      return this.allWeeksCache;
    }

    this.allWeeksCache = this.importAllWeeksData();
    return this.allWeeksCache;
  }

  /**
   * Get week data synchronously if already loaded
   */
  getWeekSync(weekNumber: number): Week | null {
    // This would require preloading, but for now return null
    // Parameter is intentionally unused in current implementation
    void weekNumber;
    return null;
  }

  /**
   * Preload critical weeks (current + adjacent)
   */
  async preloadWeeks(weekNumbers: number[]): Promise<void> {
    const promises = weekNumbers.map(weekNum => this.loadWeek(weekNum));
    await Promise.all(promises);
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

  private async importWeekData(weekNumber: number): Promise<Week> {
    try {
      // Import the specific week lessons
      const lessonsModule = await import(`../data/week${weekNumber}Lessons.ts`);
      const weekLessons = lessonsModule[`WEEK_${weekNumber}_LESSONS`];

      // Get the base week structure
      const weekData = baseWeeks.find(w => w.weekNumber === weekNumber);

      if (!weekData) {
        throw new Error(`Week ${weekNumber} not found in base weeks data`);
      }

      // Merge the lessons into the week data
      return {
        ...weekData,
        lessons: weekLessons
      };
    } catch (error) {
      console.error(`Failed to load week ${weekNumber}:`, error);
      throw error;
    }
  }

  private async importAllWeeksData(): Promise<Week[]> {
    try {
      // Load all week lesson files
      const lessonPromises = [];
      for (let i = 1; i <= 12; i++) {
        lessonPromises.push(import(`../data/week${i}Lessons.ts`));
      }

      const lessonModules = await Promise.all(lessonPromises);

      // Merge lessons into base week data
      return baseWeeks.map((week, index) => ({
        ...week,
        lessons: lessonModules[index][`WEEK_${week.weekNumber}_LESSONS`]
      }));
    } catch (error) {
      console.error('Failed to load all weeks data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const curriculumLoader = new CurriculumLoader();

// Export types
export type { Week };