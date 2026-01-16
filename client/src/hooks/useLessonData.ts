/**
 * Custom hook for managing lesson data fetching and state
 */

import { useState, useEffect } from 'react';
import { loadLessonContent } from '../utils/lessonContentLoader';
import { curriculumLoader } from '../utils/curriculumLoader';
import type { LeveledLessonContent } from '../types/lessonContent';
import type { LessonData } from './masteryLevelConfig';

export interface UseLessonDataResult {
  lessonData: LessonData | null;
  detailedContent: LeveledLessonContent | null;
  weekNumber: number | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch and manage lesson data
 */
export function useLessonData(lessonId: string | undefined, isValidParams: boolean): UseLessonDataResult {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [detailedContent, setDetailedContent] = useState<LeveledLessonContent | null>(null);
  const [weekNumber, setWeekNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId || !isValidParams) {
      setLoading(false);
      return;
    }

    async function fetchLessonData() {
      try {
        setError(null);

        // Load all weeks data to find the lesson
        const allWeeks = await curriculumLoader.loadAllWeeks();

        // Load basic lesson data from local curriculum data
        let lessonInfo = null;
        let foundWeek = null;
        for (const week of allWeeks) {
          const foundLesson = week.lessons.find(l => l.id === lessonId || l.lessonId === lessonId);
          if (foundLesson) {
            lessonInfo = foundLesson;
            foundWeek = week.weekNumber;
            break;
          }
        }

        if (lessonInfo && foundWeek) {
          setWeekNumber(foundWeek);
          // Create lesson data structure from curriculum info
          const data: LessonData = {
            id: lessonInfo.id || lessonInfo.lessonId,
            title: lessonInfo.baseLesson.title,
            description: lessonInfo.baseLesson.description,
            duration: lessonInfo.baseLesson.estimatedTimePerLevel.crawl.toString(),
            xp: 100, // Default XP, could be calculated based on completion
            content: {
              crawl: {
                instructions: '',
                objectives: lessonInfo.baseLesson.learningObjectives
              },
              walk: {
                instructions: '',
                objectives: lessonInfo.baseLesson.learningObjectives
              },
              runGuided: {
                instructions: '',
                objectives: lessonInfo.baseLesson.learningObjectives
              },
              runIndependent: {
                instructions: '',
                objectives: lessonInfo.baseLesson.learningObjectives
              }
            }
          };
          setLessonData(data);
        }

        // Load detailed mastery content
        const content = await loadLessonContent(lessonId);
        setDetailedContent(content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson data');
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [lessonId, isValidParams]);

  return {
    lessonData,
    detailedContent,
    weekNumber,
    loading,
    error
  };
}