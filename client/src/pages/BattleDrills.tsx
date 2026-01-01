/**
 * Battle Drills Library Page
 * Shows all available drills with performance stats
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, Trophy, TrendingUp, Lock, CheckCircle, Zap, AlertTriangle } from 'lucide-react';
import { BATTLE_DRILLS, getBattleDrillsByDifficulty } from '../data/battleDrills';
import { useAuthStore } from '../store/authStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BattleDrill, BattleDrillPerformance } from '../types/training';

export default function BattleDrills() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');
  const [performanceMap, setPerformanceMap] = useState<Map<string, BattleDrillPerformance>>(new Map());

  useEffect(() => {
    loadPerformance();
  }, [user?.uid]);

  const loadPerformance = async () => {
    if (!user?.uid) return;

    try {
      const performanceQuery = query(
        collection(db, 'battleDrillPerformance'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(performanceQuery);
      
      const map = new Map<string, BattleDrillPerformance>();
      snapshot.forEach(doc => {
        const data = doc.data() as BattleDrillPerformance;
        map.set(data.drillId, data);
      });
      
      setPerformanceMap(map);
    } catch (error) {
      console.error('Error loading performance:', error);
    }
  };

  const getFilteredDrills = (): BattleDrill[] => {
    let drills = BATTLE_DRILLS;

    if (selectedDifficulty !== 'all') {
      drills = getBattleDrillsByDifficulty(selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      drills = drills.filter(d => d.category === selectedCategory);
    }

    return drills;
  };

  const getDrillStats = (drill: BattleDrill) => {
    const perf = performanceMap.get(drill.id);
    return {
      attempts: perf?.attempts || 0,
      bestTime: perf?.bestTime || 0,
      successRate: perf?.successRate || 0,
      masteryLevel: perf?.masteryLevel || 'novice',
      beatTarget: perf?.bestTime ? perf.bestTime <= drill.targetTimeSeconds : false
    };
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'expert': return 'text-purple-400';
      case 'proficient': return 'text-blue-400';
      case 'competent': return 'text-green-400';
      default: return 'text-slate-400';
    }
  };

  const filteredDrills = getFilteredDrills();

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Target className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Battle Drills</h1>
              <p className="text-slate-400">Master core DevOps skills through repetitive practice</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Build Muscle Memory</h3>
                <p className="text-sm text-slate-300">
                  Execute these drills until they become automatic. Speed and accuracy improve through repetition.
                  Complete the daily drill before accessing new content.
                </p>
              </div>
            </div>
          </div>

          {/* Stress Training CTA */}
          <button
            onClick={() => navigate('/stress-training')}
            className="w-full mt-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg p-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-white font-semibold">Stress Training</div>
                  <div className="text-sm text-yellow-100">Practice under pressure • Build resilience</div>
                </div>
              </div>
              <div className="text-white">→</div>
            </div>
          </button>

          {/* Production Scenarios CTA */}
          <button
            onClick={() => navigate('/scenarios')}
            className="w-full mt-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 rounded-lg p-4 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-white" />
                <div className="text-left">
                  <div className="text-white font-semibold">Production Scenarios</div>
                  <div className="text-sm text-red-100">Real incident response • Multi-step troubleshooting</div>
                </div>
              </div>
              <div className="text-white">→</div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
              <div className="flex gap-2">
                {['all', 'basic', 'intermediate', 'advanced'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedDifficulty === diff
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'deployment', 'troubleshooting', 'security', 'scaling', 'cicd', 'recovery'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Total Drills</div>
                <div className="text-2xl font-bold text-white">{BATTLE_DRILLS.length}</div>
              </div>
              <Target className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Completed</div>
                <div className="text-2xl font-bold text-green-400">
                  {Array.from(performanceMap.values()).filter(p => p.attempts > 0).length}
                </div>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Avg Success Rate</div>
                <div className="text-2xl font-bold text-blue-400">
                  {performanceMap.size > 0
                    ? Math.round(
                        (Array.from(performanceMap.values()).reduce((sum, p) => sum + p.successRate, 0) /
                          performanceMap.size) *
                          100
                      )
                    : 0}%
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-sm">Expert Level</div>
                <div className="text-2xl font-bold text-purple-400">
                  {Array.from(performanceMap.values()).filter(p => p.masteryLevel === 'expert').length}
                </div>
              </div>
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Drills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrills.map(drill => {
            const stats = getDrillStats(drill);
            
            return (
              <div
                key={drill.id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-5 hover:border-indigo-500 transition-all cursor-pointer"
                onClick={() => navigate(`/battle-drill/${drill.id}`)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{drill.title}</h3>
                    <p className="text-xs text-slate-500">{drill.id}</p>
                  </div>
                  {stats.beatTarget && (
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{drill.description}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-3 mb-4 text-xs">
                  <span className={`px-2 py-1 rounded ${
                    drill.difficulty === 'basic' ? 'bg-green-900/30 text-green-400' :
                    drill.difficulty === 'intermediate' ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {drill.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded bg-slate-700 text-slate-300 capitalize">
                    {drill.category}
                  </span>
                </div>

                {/* Target Time */}
                <div className="flex items-center gap-2 text-slate-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Target: {Math.round(drill.targetTimeSeconds / 60)} min</span>
                  {stats.bestTime > 0 && (
                    <span className={`text-sm ml-auto font-semibold ${
                      stats.beatTarget ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      Best: {Math.round(stats.bestTime / 60)}m {Math.round(stats.bestTime % 60)}s
                    </span>
                  )}
                </div>

                {/* Performance Stats */}
                {stats.attempts > 0 ? (
                  <div className="border-t border-slate-700 pt-3">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-slate-400">Attempts: {stats.attempts}</span>
                      <span className={getMasteryColor(stats.masteryLevel) + ' font-semibold capitalize'}>
                        {stats.masteryLevel}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Success Rate</span>
                      <span className="text-white font-semibold">{Math.round(stats.successRate * 100)}%</span>
                    </div>
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                        style={{ width: `${stats.successRate * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-slate-700 pt-3 text-center">
                    <span className="text-sm text-slate-500">Not attempted yet</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredDrills.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No drills match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
