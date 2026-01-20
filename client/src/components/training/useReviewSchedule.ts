/**
 * useReviewSchedule - Custom hook for review schedule state management
 */

import { useState, useEffect } from "react";
import { useProgress } from "../../hooks/useProgress";
import {
  generateReviewSchedule,
  getReviewsDueToday,
  calculateDailyReviewLoad,
  type ReviewSchedule,
} from "../../services/spacedRepetition";
import { type DailyLoadData } from "./ReviewSchedulePanelUtils";

interface ReviewScheduleState {
  reviews: ReviewSchedule[];
  dueToday: ReviewSchedule[];
  dailyLoad: DailyLoadData | null;
  loading: boolean;
}

export function useReviewSchedule() {
  const { getAllLessonProgress } = useProgress();
  const [state, setState] = useState<ReviewScheduleState>({
    reviews: [],
    dueToday: [],
    dailyLoad: null,
    loading: true,
  });

  useEffect(() => {
    loadReviewSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadReviewSchedule = async () => {
    try {
      // Get all lesson progress with SM-2 data
      const allProgress = await getAllLessonProgress();

      // Get mastery data for each lesson
      const masteryData = new Map();
      const lessonTitles = new Map();

      // For now, use lesson IDs as titles (would need to fetch actual titles)
      allProgress.forEach((p) => {
        lessonTitles.set(p.lessonId, `Lesson ${p.lessonId.substring(0, 8)}`);
      });

      // Generate review schedule
      const schedule = generateReviewSchedule(
        allProgress,
        masteryData,
        lessonTitles,
      );
      const todayReviews = getReviewsDueToday(schedule);

      // Calculate mastery distribution (mock for now)
      const masteryDist = {
        crawl: 0,
        walk: 0,
        "run-guided": 0,
        "run-independent": 0,
      };

      const load = calculateDailyReviewLoad(todayReviews.length, masteryDist);

      setState({
        reviews: schedule,
        dueToday: todayReviews,
        dailyLoad: load,
        loading: false,
      });
    } catch (error) {
      console.error("Error loading review schedule:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return state;
}
