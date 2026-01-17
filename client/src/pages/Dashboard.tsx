/* eslint-disable max-lines-per-function */
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { useDailyDrill } from '../hooks/useDailyDrill';
import { useResetTokens } from '../hooks/useResetTokens';
import { useAccountability } from '../hooks/useAccountability';
import { useAdaptiveDifficulty } from '../hooks/useAdaptiveDifficulty';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import DailyDrillModal from '../components/training/DailyDrillModal';
import { DailyChallengeModal } from '../components/challenges/DailyChallengeModal';
import { BossBattleModal } from '../components/challenges/BossBattleModal';
import { useRecertification } from '../hooks/useRecertification';
import { RecertificationModal } from '../components/recertification/RecertificationModal';
import {
  HeroSection,
  DiagnosticBanner,
  ProgressOverview,
  ResetTokensSection,
  AccountabilitySection,
  AdaptiveDifficultySection,
  QuickActionsSection,
  MotivationSection,
  ChallengeButtonsSection
} from '../components/dashboard/DashboardComponents';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { getUserStats } = useProgress();
  const { dailyDrillRequired, completeDailyDrill } = useDailyDrill();
  const { currentAllocation } = useResetTokens();
  const { currentWeekCommitment, loading: accountabilityLoading } = useAccountability();
  const { currentLevel, settings, loading: difficultyLoading } = useAdaptiveDifficulty();
  const [stats, setStats] = useState({
    totalXP: 0,
    currentWeek: 1,
    labsCompleted: 0,
    badgesEarned: 0
  });
  const [loading, setLoading] = useState(true);
  const [hasDiagnostic, setHasDiagnostic] = useState(true);
  const [showDrillModal, setShowDrillModal] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [showBossBattle, setShowBossBattle] = useState(false);
  const [showRecertification, setShowRecertification] = useState(false);
  const { status: recertStatus, loading: recertLoading, completeRecertification } = useRecertification();

  useEffect(() => {
    async function fetchUserProgress() {
      if (!user) return;

      try {
        // Get user stats
        const userStats = await getUserStats();
        
        // Check if user has completed diagnostic
        const diagnosticDoc = await getDoc(doc(db, 'diagnostics', user.uid));
        setHasDiagnostic(diagnosticDoc.exists());
        
        // Count completed labs
        const progressQuery = query(
          collection(db, 'progress'),
          where('userId', '==', user.uid),
          where('type', '==', 'lab')
        );
        const progressSnap = await getDocs(progressQuery);
        const labsCompleted = progressSnap.size;

        // Count earned badges
        const badgesQuery = query(
          collection(db, 'badges'),
          where('userId', '==', user.uid)
        );
        const badgesSnap = await getDocs(badgesQuery);
        const badgesEarned = badgesSnap.size;

        setStats({
          totalXP: userStats?.totalXP || 0,
          currentWeek: userStats?.currentWeek || 1,
          labsCompleted,
          badgesEarned
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserProgress();
  }, [user, getUserStats]);

  useEffect(() => {
    // Show daily drill modal if required and not loading
    if (!loading && dailyDrillRequired) {
      setShowDrillModal(true);
    }
  }, [loading, dailyDrillRequired]);

  const handleDrillComplete = async () => {
    await completeDailyDrill();
    setShowDrillModal(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      {/* Daily Drill Modal */}
      <DailyDrillModal
        isOpen={showDrillModal}
        onComplete={handleDrillComplete}
        canDismiss={false}
      />

      <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />

        {/* Diagnostic Banner (if not completed) */}
        {!hasDiagnostic && <DiagnosticBanner />}

        {/* Progress Overview */}
        <ProgressOverview stats={stats} currentStreak={user?.currentStreak || 0} />

        {/* Reset Tokens Section */}
        <ResetTokensSection currentAllocation={currentAllocation} />

        {/* Accountability Section */}
        <AccountabilitySection
          currentWeekCommitment={currentWeekCommitment}
          accountabilityLoading={accountabilityLoading}
        />

        {/* Adaptive Difficulty */}
        <AdaptiveDifficultySection
          currentLevel={currentLevel}
          settings={settings}
          difficultyLoading={difficultyLoading}
        />

        {/* Quick Actions */}
        <QuickActionsSection stats={stats} />

        {/* Motivation */}
        <MotivationSection stats={stats} />

        {/* Challenge Buttons */}
        <ChallengeButtonsSection
          stats={stats}
          showDailyChallenge={() => setShowDailyChallenge(true)}
          showBossBattle={() => setShowBossBattle(true)}
          recertStatus={recertStatus}
          recertLoading={recertLoading}
          showRecertification={() => setShowRecertification(true)}
        />
      </div>

      {/* Modals */}
      <DailyChallengeModal
        isOpen={showDailyChallenge}
        onClose={() => setShowDailyChallenge(false)}
        onComplete={(success, timeUsed) => {
          console.log(`Challenge ${success ? 'passed' : 'failed'} in ${timeUsed}s`);
          setShowDailyChallenge(false);
        }}
      />
      
      <BossBattleModal
        isOpen={showBossBattle}
        onClose={() => setShowBossBattle(false)}
        onComplete={(success) => {
          console.log(`Boss Battle ${success ? 'passed' : 'failed'}`);
          setShowBossBattle(false);
        }}
        week={stats.currentWeek}
      />

      <RecertificationModal
        isOpen={showRecertification}
        onClose={() => setShowRecertification(false)}
        skillDecayAlerts={recertStatus?.skillsNeedingRecert || []}
        onComplete={async (results) => {
          await completeRecertification(results);
          setShowRecertification(false);
        }}
      />
    </div>
    </>
  );
}
