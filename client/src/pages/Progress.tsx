import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProgress } from '../hooks/useProgress';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt: Date;
}

interface LabProgress {
  labId: string;
  completedAt: Date;
  xpEarned: number;
  tasksCompleted: number;
  totalTasks: number;
}

export default function Progress() {
  const user = useAuthStore((state) => state.user);
  const { getUserStats } = useProgress();
  const [stats, setStats] = useState({ totalXP: 0, currentWeek: 1, labsCompleted: 0, badgesEarned: 0 });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [labProgress, setLabProgress] = useState<LabProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user) return;
      
      try {
        // Get user stats
        const userStats = await getUserStats();
        
        // Get badges
        const badgesQuery = query(
          collection(db, 'badges'),
          where('userId', '==', user.uid),
          orderBy('earnedAt', 'desc')
        );
        const badgesSnapshot = await getDocs(badgesQuery);
        const earnedBadges = badgesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          earnedAt: doc.data().earnedAt?.toDate(),
        })) as Badge[];
        
        // Get completed labs
        const labsQuery = query(
          collection(db, 'progress'),
          where('userId', '==', user.uid),
          where('type', '==', 'lab'),
          orderBy('completedAt', 'desc')
        );
        const labsSnapshot = await getDocs(labsQuery);
        const completedLabs = labsSnapshot.docs.map(doc => ({
          labId: doc.data().labId,
          completedAt: doc.data().completedAt?.toDate(),
          xpEarned: doc.data().xpEarned,
          tasksCompleted: doc.data().tasksCompleted,
          totalTasks: doc.data().totalTasks,
        })) as LabProgress[];
        
        setStats({
          totalXP: userStats?.totalXP || 0,
          currentWeek: userStats?.currentWeek || 1,
          labsCompleted: labsSnapshot.size,
          badgesEarned: badgesSnapshot.size,
        });
        setBadges(earnedBadges);
        setLabProgress(completedLabs);
      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [user, getUserStats]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Your Progress 📊</h1>
          <p className="text-xl text-gray-300">Track your DevOps learning journey and celebrate your achievements</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading your progress...</p>
          </div>
        ) : (
          <>
            {/* Overall Progress */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  📈
                </span>
                Overall Progress
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-300 font-medium">Current Week</span>
                    <span className="text-white font-bold text-lg">Week {stats.currentWeek} of 12</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.currentWeek / 12) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.round((stats.currentWeek / 12) * 100)}% complete</p>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-300 font-medium">Labs Completed</span>
                    <span className="text-white font-bold text-lg">{stats.labsCompleted}/33</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${(stats.labsCompleted / 33) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.round((stats.labsCompleted / 33) * 100)}% complete</p>
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-gray-300 font-medium">Total XP Earned</span>
                    <span className="text-white font-bold text-lg">{stats.totalXP.toLocaleString()} XP</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-4 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min((stats.totalXP / 6000) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.round((stats.totalXP / 6000) * 100)}% of 6000 XP target</p>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 mb-8 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
                Badges Earned ({badges.length})
              </h3>
              {badges.length === 0 ? (
                <div className="text-center py-12 bg-slate-900 rounded-lg border-2 border-dashed border-slate-700">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    Complete labs and reach milestones to earn badges!
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your first badge is waiting for you 🎯
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="group relative flex items-center p-6 rounded-xl bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/50 hover:border-indigo-400 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/20"
                    >
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                        +{badge.xpReward} XP
                      </div>
                      <span className="text-5xl mr-5">{badge.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg mb-1">{badge.name}</h4>
                        <p className="text-sm text-gray-300 mb-2">{badge.description}</p>
                        <p className="text-xs text-indigo-300 font-medium">
                          Earned {badge.earnedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Labs */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-slate-700 shadow-xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="bg-gradient-to-r from-green-600 to-teal-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  ⚡
                </span>
                Recent Labs
              </h3>
              {labProgress.length === 0 ? (
                <div className="text-center py-12 bg-slate-900 rounded-lg border-2 border-dashed border-slate-700">
                  <div className="text-6xl mb-4">🧪</div>
                  <p className="text-gray-400 text-lg mb-2">
                    No labs completed yet. Start your first lab to begin earning XP!
                  </p>
                  <p className="text-gray-500 text-sm">
                    Head to the Curriculum page to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {labProgress.slice(0, 10).map((lab, index) => (
                    <div
                      key={`${lab.labId}-${index}`}
                      className="flex items-center justify-between p-5 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 border border-slate-600 hover:border-green-500/50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="bg-green-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{lab.labId}</h4>
                          <p className="text-sm text-gray-400">
                            {lab.tasksCompleted}/{lab.totalTasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">+{lab.xpEarned} XP</p>
                        <p className="text-xs text-gray-500">
                          {lab.completedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
