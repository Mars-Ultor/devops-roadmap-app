/**
 * useProgress Hook - Refactored
 * Manages user progress, XP, and spaced repetition
 */
import { useAuthStore } from "../store/authStore";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  BADGES,
  calculateSM2,
  initializeSM2Data,
  parseLabId,
  docToLessonProgress,
  showBadgeNotification,
  isLessonDueForReview as checkLessonDue,
  checkBadgeRequirementHelper,
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
    const progressRef = doc(db, "progress", `${user.uid}_${lessonId}`);
    const existingProgress = await getDoc(progressRef);
    const isReview = existingProgress.exists();
    const sm2Data = isReview
      ? calculateSM2(
          quality,
          existingProgress.data()?.easinessFactor || 2.5,
          existingProgress.data()?.repetitions || 0,
          existingProgress.data()?.interval || 0,
        )
      : initializeSM2Data();
    await setDoc(progressRef, {
      userId: user.uid,
      lessonId,
      type: "lesson",
      completedAt: new Date(),
      xpEarned: isReview ? 0 : xp,
      ...sm2Data,
      lastReviewQuality: quality,
    });
    if (!isReview)
      await updateDoc(doc(db, "users", user.uid), { totalXP: increment(xp) });
    return sm2Data;
  };

  const markRelatedLessonComplete = async (weekNum: string, labNum: string) => {
    if (!user) return;
    const lessonId = `w${weekNum}-lesson${labNum}`;
    const lessonRef = doc(db, "progress", `${user.uid}_${lessonId}`);
    if (!(await getDoc(lessonRef)).exists()) {
      await setDoc(lessonRef, {
        userId: user.uid,
        lessonId,
        type: "lesson",
        completedAt: new Date(),
        xpEarned: 0,
        ...initializeSM2Data(),
        lastReviewQuality: 5,
        completedViaLab: true,
      });
    }
  };

  const awardBadge = async (badge: Badge) => {
    if (!user) return;
    await setDoc(doc(db, "badges", `${user.uid}_${badge.id}`), {
      userId: user.uid,
      badgeId: badge.id,
      title: badge.title,
      description: badge.description,
      icon: badge.icon,
      xpEarned: badge.xp,
      earnedAt: new Date(),
    });
    await updateDoc(doc(db, "users", user.uid), {
      totalXP: increment(badge.xp),
    });
    showBadgeNotification(badge);
  };

  const checkAndAwardBadges = async () => {
    if (!user) return;
    const userData = (await getDoc(doc(db, "users", user.uid))).data();
    const labsCompleted = (
      await getDocs(
        query(
          collection(db, "progress"),
          where("userId", "==", user.uid),
          where("type", "==", "lab"),
        ),
      )
    ).size;
    for (const badge of BADGES) {
      if ((await getDoc(doc(db, "badges", `${user.uid}_${badge.id}`))).exists())
        continue;
      if (
        await checkBadgeRequirementHelper(
          badge,
          labsCompleted,
          userData,
          user.uid,
        )
      )
        await awardBadge(badge);
    }
  };

  const completeLab = async (
    labId: string,
    xp: number,
    tasksCompleted: number,
    totalTasks: number,
  ) => {
    if (!user) return;
    const progressRef = doc(db, "progress", `${user.uid}_${labId}`);
    const alreadyCompleted = (await getDoc(progressRef)).exists();
    await setDoc(progressRef, {
      userId: user.uid,
      labId,
      type: "lab",
      completedAt: new Date(),
      xpEarned: xp,
      tasksCompleted,
      totalTasks,
    });
    if (!alreadyCompleted) {
      await updateDoc(doc(db, "users", user.uid), { totalXP: increment(xp) });
      const parsed = parseLabId(labId);
      if (parsed)
        await markRelatedLessonComplete(parsed.weekNum, parsed.labNum);
    }
    await checkAndAwardBadges();
    return true;
  };

  const getLabProgress = async (labId: string): Promise<boolean> => {
    if (!user) return false;
    return (await getDoc(doc(db, "progress", `${user.uid}_${labId}`))).exists();
  };

  const getLessonProgress = async (
    lessonId: string,
  ): Promise<LessonProgress | null> => {
    if (!user) return null;
    const snap = await getDoc(doc(db, "progress", `${user.uid}_${lessonId}`));
    return snap.exists() ? docToLessonProgress(snap.data()) : null;
  };

  const getLessonsDueForReview = async (): Promise<LessonProgress[]> => {
    if (!user) return [];
    const snap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", user.uid),
        where("type", "==", "lesson"),
        where("nextReviewDate", "<=", new Date()),
      ),
    );
    return snap.docs.map((d) => docToLessonProgress(d.data()));
  };

  const getAllLessonProgress = async (): Promise<LessonProgress[]> => {
    if (!user) return [];
    const snap = await getDocs(
      query(
        collection(db, "progress"),
        where("userId", "==", user.uid),
        where("type", "==", "lesson"),
      ),
    );
    return snap.docs.map((d) => docToLessonProgress(d.data()));
  };

  const getUserStats = async () => {
    if (!user) return null;
    const snap = await getDoc(doc(db, "users", user.uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      totalXP: data.totalXP || 0,
      currentWeek: data.currentWeek || 1,
      name: data.name,
      email: data.email,
    };
  };

  return {
    completeLesson,
    completeLab,
    getLabProgress,
    getLessonProgress,
    getLessonsDueForReview,
    getAllLessonProgress,
    isLessonDueForReview: checkLessonDue,
    getUserStats,
    checkAndAwardBadges,
  };
}
