import { useAuthStore } from '../store/authStore';
import { doc, setDoc, getDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { curriculumData } from '../data/curriculumData';

export interface LabCompletion {
  labId: string;
  completedAt: Date;
  xpEarned: number;
  tasksCompleted: number;
  totalTasks: number;
}

export interface LessonProgress {
  lessonId: string;
  completedAt: Date;
  xpEarned: number;
  // SM-2 Algorithm fields
  easinessFactor: number; // 1.3 to 2.5, starts at 2.5
  repetitions: number; // number of consecutive correct reviews
  interval: number; // days until next review
  nextReviewDate: Date; // when to review next
  lastReviewQuality?: number; // 0-5, quality of last review
}

export interface BadgeRequirement {
  id: string;
  type: 'labs_completed' | 'xp_earned' | 'week_completed' | 'streak_days';
  value: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  requirement: BadgeRequirement;
  earnedAt?: Date;
}

export const BADGES: Badge[] = [
  {
    id: 'first-lab',
    title: 'First Steps',
    description: 'Complete your first lab',
    icon: '🎯',
    xp: 50,
    requirement: { id: 'first-lab', type: 'labs_completed', value: 1 }
  },
  {
    id: 'lab-novice',
    title: 'Lab Novice',
    description: 'Complete 5 labs',
    icon: '⚡',
    xp: 100,
    requirement: { id: 'lab-novice', type: 'labs_completed', value: 5 }
  },
  {
    id: 'xp-hunter',
    title: 'XP Hunter',
    description: 'Earn 500 XP',
    icon: '💎',
    xp: 100,
    requirement: { id: 'xp-hunter', type: 'xp_earned', value: 500 }
  },
  {
    id: 'week-one-warrior',
    title: 'Week One Warrior',
    description: 'Complete all Week 1 labs',
    icon: '🏆',
    xp: 200,
    requirement: { id: 'week-one-warrior', type: 'week_completed', value: 1 }
  },
  {
    id: 'dedicated-learner',
    title: 'Dedicated Learner',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    xp: 150,
    requirement: { id: 'dedicated-learner', type: 'streak_days', value: 7 }
  }
];

export function useProgress() {
  const { user } = useAuthStore();

  /**
   * SM-2 Spaced Repetition Algorithm
   * Calculate next review interval based on quality of recall (0-5)
   * 
   * @param quality - Quality of recall: 0 (complete blackout) to 5 (perfect recall)
   * @param easinessFactor - Current easiness factor (1.3 to 2.5)
   * @param repetitions - Number of consecutive correct reviews
   * @param interval - Current interval in days
   * @returns Updated SM-2 values
   */
  const calculateSM2 = (
    quality: number, 
    easinessFactor: number, 
    repetitions: number, 
    interval: number
  ) => {
    let newEasinessFactor = easinessFactor;
    let newRepetitions = repetitions;
    let newInterval = interval;

    // Update easiness factor
    newEasinessFactor = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Ensure easiness factor stays within bounds
    if (newEasinessFactor < 1.3) newEasinessFactor = 1.3;
    
    // If quality < 3, reset repetitions (failed recall)
    if (quality < 3) {
      newRepetitions = 0;
      newInterval = 1; // Review again tomorrow
    } else {
      // Successful recall
      if (repetitions === 0) {
        newInterval = 1; // First review after 1 day
      } else if (repetitions === 1) {
        newInterval = 6; // Second review after 6 days
      } else {
        newInterval = Math.round(interval * newEasinessFactor);
      }
      newRepetitions = repetitions + 1;
    }

    return {
      easinessFactor: newEasinessFactor,
      repetitions: newRepetitions,
      interval: newInterval,
      nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
    };
  };

  const completeLesson = async (lessonId: string, xp: number, quality: number = 5) => {
    if (!user) return;

    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${lessonId}`);
      
      // Check if lesson was completed before
      const existingProgress = await getDoc(progressRef);
      const isReview = existingProgress.exists();

      let sm2Data;
      if (isReview) {
        // This is a review - update SM-2 values
        const prevData = existingProgress.data();
        sm2Data = calculateSM2(
          quality,
          prevData.easinessFactor || 2.5,
          prevData.repetitions || 0,
          prevData.interval || 0
        );
      } else {
        // First completion - initialize SM-2 values
        sm2Data = {
          easinessFactor: 2.5,
          repetitions: 1,
          interval: 1,
          nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
        };
      }

      await setDoc(progressRef, {
        userId: user.uid,
        lessonId,
        type: 'lesson',
        completedAt: new Date(),
        xpEarned: isReview ? 0 : xp, // Only award XP on first completion
        ...sm2Data,
        lastReviewQuality: quality
      });

      // Update user's total XP only on first completion
      if (!isReview) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          totalXP: increment(xp)
        });
      }

      console.log(`✅ Lesson ${isReview ? 'reviewed' : 'completed'}: ${isReview ? 'SM-2 updated' : `+${xp} XP`}`);
      console.log(`📅 Next review in ${sm2Data.interval} days`);
      
      return sm2Data;
    } catch (error) {
      console.error('Error completing lesson:', error);
      throw error;
    }
  };

  const completeLab = async (labId: string, xp: number, tasksCompleted: number, totalTasks: number) => {
    if (!user) {
      console.warn('⚠️ No user logged in, cannot save progress');
      return;
    }

    try {
      console.log('💾 Saving lab to Firestore...', { labId, xp, userId: user.uid });
      
      const progressRef = doc(db, 'progress', `${user.uid}_${labId}`);
      
      // Check if lab was already completed
      const existingProgress = await getDoc(progressRef);
      const alreadyCompleted = existingProgress.exists();
      
      // Save lab completion
      await setDoc(progressRef, {
        userId: user.uid,
        labId,
        type: 'lab',
        completedAt: new Date(),
        xpEarned: xp,
        tasksCompleted,
        totalTasks
      });

      console.log('✅ Progress saved to Firestore');

      // Update user's total XP only if not already completed
      if (!alreadyCompleted) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          totalXP: increment(xp)
        });
        console.log(`✅ Lab completed: +${xp} XP awarded`);
      } else {
        console.log('✅ Lab re-completed (no additional XP)');
      }

      // Extract lesson ID from lab ID (e.g., "w1-lab1" -> related to week 1 lessons)
      // Mark the first lesson of the week as completed when lab is done
      const weekMatch = labId.match(/w(\d+)-lab(\d+)/);
      if (weekMatch && !alreadyCompleted) {
        const weekNum = weekMatch[1];
        const labNum = weekMatch[2];
        
        // Derive lesson ID (e.g., w1-lab1 -> w1-lesson1)
        const relatedLessonId = `w${weekNum}-lesson${labNum}`;
        
        console.log(`🔗 Marking related lesson ${relatedLessonId} as completed...`);
        
        // Check if lesson already completed
        const lessonProgressRef = doc(db, 'progress', `${user.uid}_${relatedLessonId}`);
        const lessonProgress = await getDoc(lessonProgressRef);
        
        if (!lessonProgress.exists()) {
          // Mark lesson as completed with SM-2 initialization
          const sm2Data = {
            easinessFactor: 2.5,
            repetitions: 1,
            interval: 1,
            nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          };

          await setDoc(lessonProgressRef, {
            userId: user.uid,
            lessonId: relatedLessonId,
            type: 'lesson',
            completedAt: new Date(),
            xpEarned: 0, // No XP for implicit lesson completion via lab
            ...sm2Data,
            lastReviewQuality: 5, // Assume perfect understanding if lab completed
            completedViaLab: true // Flag to indicate this was completed via lab
          });

          console.log(`✅ Lesson ${relatedLessonId} marked as completed (via lab completion)`);
          console.log(`📅 Next review in ${sm2Data.interval} day(s)`);
        }
      }

      console.log('📊 Navigate to Dashboard or Progress page to see your updated stats!');

      // Check for badge awards
      await checkAndAwardBadges();
      
      return true;
    } catch (error) {
      console.error('❌ Error completing lab:', error);
      throw error;
    }
  };

  const checkAndAwardBadges = async () => {
    if (!user) return;

    try {
      console.log('🏆 Checking for badge awards...');
      
      // Get user's current stats
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();

      // Count completed labs
      const labsQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('type', '==', 'lab')
      );
      const labsSnap = await getDocs(labsQuery);
      const labsCompleted = labsSnap.size;

      console.log(`📊 Current stats: ${labsCompleted} labs, ${userData?.totalXP || 0} XP`);

      for (const badge of BADGES) {
        const badgeRef = doc(db, 'badges', `${user.uid}_${badge.id}`);
        const badgeSnap = await getDoc(badgeRef);

        // Skip if already earned
        if (badgeSnap.exists()) continue;

        let shouldAward = false;

        switch (badge.requirement.type) {
          case 'labs_completed':
            if (labsCompleted >= badge.requirement.value) {
              shouldAward = true;
            }
            break;
          
          case 'xp_earned':
            if (userData && userData.totalXP >= badge.requirement.value) {
              shouldAward = true;
            }
            break;

          case 'week_completed':
            // Check if all week's labs are complete
            const weekNumber = badge.requirement.value;
            const weekData = curriculumData.find(week => week.weekNumber === weekNumber);
            if (weekData) {
              const weekLabIds = weekData.labs.map(lab => lab.id);
              // Query for completed labs in this week
              const weekLabsQuery = query(
                collection(db, 'progress'),
                where('userId', '==', user.uid),
                where('type', '==', 'lab'),
                where('itemId', 'in', weekLabIds)
              );
              const weekLabsSnap = await getDocs(weekLabsQuery);
              if (weekLabsSnap.size === weekLabIds.length) {
                shouldAward = true;
              }
            }
            break;

          case 'streak_days':
            // Check login streak
            // TODO: Implement streak tracking
            break;
        }

        if (shouldAward) {
          console.log(`🎉 Awarding badge: ${badge.title}`);
          await awardBadge(badge);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const awardBadge = async (badge: Badge) => {
    if (!user) return;

    try {
      const badgeRef = doc(db, 'badges', `${user.uid}_${badge.id}`);
      
      await setDoc(badgeRef, {
        userId: user.uid,
        badgeId: badge.id,
        title: badge.title,
        description: badge.description,
        icon: badge.icon,
        xpEarned: badge.xp,
        earnedAt: new Date()
      });

      // Award badge XP
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        totalXP: increment(badge.xp)
      });

      console.log(`🏆 Badge earned: ${badge.title} (+${badge.xp} XP)`);
      
      // Show notification to user
      showBadgeNotification(badge);
      
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  };

  const showBadgeNotification = (badge: Badge) => {
    // This would trigger a toast notification in the UI
    // For now, just log it
    console.log(`🎉 New badge unlocked: ${badge.icon} ${badge.title}`);
  };

  const getLabProgress = async (labId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${labId}`);
      const progressSnap = await getDoc(progressRef);
      
      return progressSnap.exists();
    } catch (error) {
      console.error('Error getting lab progress:', error);
      return false;
    }
  };

  const getLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
    if (!user) return null;

    try {
      const progressRef = doc(db, 'progress', `${user.uid}_${lessonId}`);
      const progressSnap = await getDoc(progressRef);
      
      if (!progressSnap.exists()) return null;

      const data = progressSnap.data();
      return {
        lessonId: data.lessonId,
        completedAt: data.completedAt?.toDate(),
        xpEarned: data.xpEarned,
        easinessFactor: data.easinessFactor,
        repetitions: data.repetitions,
        interval: data.interval,
        nextReviewDate: data.nextReviewDate?.toDate(),
        lastReviewQuality: data.lastReviewQuality
      } as LessonProgress;
    } catch (error) {
      console.error('Error getting lesson progress:', error);
      return null;
    }
  };

  const getLessonsDueForReview = async (): Promise<LessonProgress[]> => {
    if (!user) return [];

    try {
      const now = new Date();
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('type', '==', 'lesson'),
        where('nextReviewDate', '<=', now)
      );
      
      const progressSnap = await getDocs(progressQuery);
      
      return progressSnap.docs.map(doc => {
        const data = doc.data();
        return {
          lessonId: data.lessonId,
          completedAt: data.completedAt?.toDate(),
          xpEarned: data.xpEarned,
          easinessFactor: data.easinessFactor,
          repetitions: data.repetitions,
          interval: data.interval,
          nextReviewDate: data.nextReviewDate?.toDate(),
          lastReviewQuality: data.lastReviewQuality
        } as LessonProgress;
      });
    } catch (error) {
      console.error('Error getting lessons due for review:', error);
      return [];
    }
  };

  const getAllLessonProgress = async (): Promise<LessonProgress[]> => {
    if (!user) return [];

    try {
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('type', '==', 'lesson')
      );
      
      const progressSnap = await getDocs(progressQuery);
      
      return progressSnap.docs.map(doc => {
        const data = doc.data();
        return {
          lessonId: data.lessonId,
          completedAt: data.completedAt?.toDate(),
          xpEarned: data.xpEarned,
          easinessFactor: data.easinessFactor,
          repetitions: data.repetitions,
          interval: data.interval,
          nextReviewDate: data.nextReviewDate?.toDate(),
          lastReviewQuality: data.lastReviewQuality
        } as LessonProgress;
      });
    } catch (error) {
      console.error('Error getting all lesson progress:', error);
      return [];
    }
  };

  const isLessonDueForReview = (lessonProgress: LessonProgress | null): boolean => {
    if (!lessonProgress) return false;
    return new Date() >= lessonProgress.nextReviewDate;
  };

  const getUserStats = async () => {
    if (!user) return null;

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) return null;

      const userData = userSnap.data();
      
      return {
        totalXP: userData.totalXP || 0,
        currentWeek: userData.currentWeek || 1,
        name: userData.name,
        email: userData.email
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  };

  return {
    completeLesson,
    completeLab,
    getLabProgress,
    getLessonProgress,
    getLessonsDueForReview,
    getAllLessonProgress,
    isLessonDueForReview,
    getUserStats,
    checkAndAwardBadges
  };
}
