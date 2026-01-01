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
      // Use explicit imports with glob pattern for Vite compatibility
      const modules = import.meta.glob('../data/week*Lessons.ts');
      const modulePath = `../data/week${weekNumber}Lessons.ts`;
      
      console.log(`CurriculumLoader: Loading week ${weekNumber}, path: ${modulePath}`);
      console.log(`CurriculumLoader: Available modules:`, Object.keys(modules));
      
      if (!modules[modulePath]) {
        console.error(`CurriculumLoader: Module ${modulePath} not found in available modules`);
        // Return base week data without lessons if module not found
        const weekData = baseWeeks.find(w => w.weekNumber === weekNumber);
        if (weekData) {
          return { ...weekData, lessons: [] };
        }
        throw new Error(`Module ${modulePath} not found`);
      }
      
      const lessonsModule = await modules[modulePath]() as Record<string, unknown>;
      console.log(`CurriculumLoader: Loaded module for week ${weekNumber}:`, Object.keys(lessonsModule));
      
      const weekLessons = lessonsModule[`WEEK_${weekNumber}_LESSONS`];

      // Get the base week structure
      const weekData = baseWeeks.find(w => w.weekNumber === weekNumber);

      if (!weekData) {
        throw new Error(`Week ${weekNumber} not found in base weeks data`);
      }

      // Merge the lessons into the week data
      return {
        ...weekData,
        lessons: (weekLessons as Week['lessons']) || []
      };
    } catch (error) {
      console.error(`Failed to load week ${weekNumber}:`, error);
      // Return base week data without lessons on error
      const weekData = baseWeeks.find(w => w.weekNumber === weekNumber);
      if (weekData) {
        return { ...weekData, lessons: [] };
      }
      throw error;
    }
  }

  private async importAllWeeksData(): Promise<Week[]> {
    try {
      // Use explicit imports with glob pattern for Vite compatibility
      const modules = import.meta.glob('../data/week*Lessons.ts');
      
      console.log('CurriculumLoader: Loading all weeks, available modules:', Object.keys(modules));
      
      const results: Week[] = [];
      
      for (let i = 1; i <= 12; i++) {
        const modulePath = `../data/week${i}Lessons.ts`;
        const weekData = baseWeeks.find(w => w.weekNumber === i);
        
        if (!weekData) {
          console.warn(`CurriculumLoader: Week ${i} not found in base weeks`);
          continue;
        }
        
        try {
          if (modules[modulePath]) {
            const mod = await modules[modulePath]() as Record<string, unknown>;
            const lessons = mod[`WEEK_${i}_LESSONS`] as Week['lessons'] || [];
            results.push({ ...weekData, lessons });
          } else {
            console.warn(`CurriculumLoader: Module ${modulePath} not found, using empty lessons`);
            results.push({ ...weekData, lessons: [] });
          }
        } catch (moduleError) {
          console.error(`CurriculumLoader: Error loading module for week ${i}:`, moduleError);
          results.push({ ...weekData, lessons: [] });
        }
      }
      
      console.log(`CurriculumLoader: Loaded ${results.length} weeks`);
      return results;
    } catch (error) {
      console.error('Failed to load all weeks data:', error);
      // Return base weeks without lessons on error
      return baseWeeks.map(week => ({ ...week, lessons: [] }));
    }
  }
}

// Export singleton instance
export const curriculumLoader = new CurriculumLoader();

// Export types
export type { Week };