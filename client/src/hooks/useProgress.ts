/**
 * useProgress Hook - Refactored
 * Manages user progress, XP, and spaced repetition
 */
import { useAuthStore } from "../store/authStore";
import {
  BADGES,
  completeLessonInDB,
  checkAndAwardBadgesForUser,
  completeLabInDB,
  getLabProgressFromDB,
  getLessonProgressFromDB,
  getLessonsDueForReviewFromDB,
  getAllLessonProgressFromDB,
  getUserStatsFromDB,
} from "./progress/progressUtils";
export type { SM2Result } from "./progress/progressUtils";

export interface LessonProgress {
  lessonId: string;
  completedAt: Date;
  xpEarned: number;
  easinessFactor: number;
  repetitions: number;
  interval: number;
  nextReviewDate: Date;
  lastReviewQuality?: number;
}
export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  requirement: {
    id: string;
    type: "labs_completed" | "xp_earned" | "week_completed" | "streak_days";
    value: number;
  };
  earnedAt?: Date;
}
export { BADGES };

export function useProgress() {
  const { user } = useAuthStore();

  const completeLesson = async (lessonId: string, xp: number, quality = 5) => {
    if (!user) return;
    return completeLessonInDB(user.uid, lessonId, xp, quality);
  };

  const checkAndAwardBadges = async () => {
    if (!user) return;
    return checkAndAwardBadgesForUser(user.uid);
  };

  const completeLab = async (
    labId: string,
    xp: number,
    tasksCompleted: number,
    totalTasks: number,
  ) => {
    if (!user) return;
    return completeLabInDB(user.uid, labId, xp, tasksCompleted, totalTasks);
  };

  const getLabProgress = async (labId: string): Promise<boolean> => {
    if (!user) return false;
    return getLabProgressFromDB(user.uid, labId);
  };

  const getLessonProgress = async (
    lessonId: string,
  ): Promise<LessonProgress | null> => {
    if (!user) return null;
    return getLessonProgressFromDB(user.uid, lessonId);
  };

  const getLessonsDueForReview = async (): Promise<LessonProgress[]> => {
    if (!user) return [];
    return getLessonsDueForReviewFromDB(user.uid);
  };

  const getAllLessonProgress = async (): Promise<LessonProgress[]> => {
    if (!user) return [];
    return getAllLessonProgressFromDB(user.uid);
  };

  const getUserStats = async () => {
    if (!user) return null;
    return getUserStatsFromDB(user.uid);
  };

  return {
    completeLesson,
    completeLab,
    getLabProgress,
    getLessonProgress,
    getLessonsDueForReview,
    getAllLessonProgress,
    getUserStats,
    checkAndAwardBadges,
  };
}
