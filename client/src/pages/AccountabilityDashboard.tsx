/**
 * Accountability Dashboard Page
 * Weekly commitments, partners, and public goals
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Users, TrendingUp, CheckCircle,
  Clock, Award, Flame, ArrowLeft, Plus, Eye, Lock, Trash2, X
} from 'lucide-react';
import { useAccountability } from '../hooks/useAccountability';
import type { Commitment, AccountabilityStats } from '../types/accountability';

export default function AccountabilityDashboard() {
  const navigate = useNavigate();
  const {
    currentWeekCommitment,
    partners,
    publicCommitments,
    loading,
    createWeeklyCommitment,
    updateCommitmentProgress,
    deleteIndividualCommitment,
    deleteWeeklyCommitment,
    completeWeeklyCheckIn,
    getAccountabilityStats
  } = useAccountability();

  const [showNewCommitmentForm, setShowNewCommitmentForm] = useState(false);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [stats, setStats] = useState<AccountabilityStats | null>(null);
  const [newCommitments, setNewCommitments] = useState<Array<Omit<Commitment, 'id' | 'current' | 'status'>>>([
    { type: 'study-hours', description: 'Study for 10 hours', target: 10, public: true, importance: 'high' }
  ]);
  const [checkInReflection, setCheckInReflection] = useState('');
  const [checkInFocus, setCheckInFocus] = useState('');

  const loadStats = useCallback(async () => {
    const accountabilityStats = await getAccountabilityStats();
    setStats(accountabilityStats);
  }, [getAccountabilityStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleCreateCommitments = async () => {
    try {
      await createWeeklyCommitment(newCommitments);
      setShowNewCommitmentForm(false);
      setNewCommitments([{ type: 'study-hours', description: '', target: 0, public: true, importance: 'medium' }]);
    } catch (error) {
      console.error('Error creating commitments:', error);
    }
  };

  const handleDeleteCommitment = async () => {
    if (confirm('Are you sure you want to delete this week\'s commitments? This action cannot be undone.')) {
      try {
        await deleteWeeklyCommitment();
      } catch (error) {
        console.error('Error deleting commitment:', error);
      }
    }
  };

  const handleDeleteIndividualCommitment = async (commitmentId: string, description: string) => {
    if (confirm(`Are you sure you want to delete "${description}"?`)) {
      try {
        await deleteIndividualCommitment(commitmentId);
      } catch (error) {
        console.error('Error deleting commitment:', error);
      }
    }
  };

  const handleCheckIn = async () => {
    try {
      await completeWeeklyCheckIn(checkInReflection, checkInFocus);
      setShowCheckInForm(false);
      setCheckInReflection('');
      setCheckInFocus('');
    } catch (error) {
      console.error('Error completing check-in:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'failed': return 'text-red-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-red-900/30 border-red-700 text-red-400';
      case 'high': return 'bg-orange-900/30 border-orange-700 text-orange-400';
      case 'medium': return 'bg-blue-900/30 border-blue-700 text-blue-400';
      case 'low': return 'bg-gray-900/30 border-gray-700 text-gray-400';
      default: return 'bg-gray-900/30 border-gray-700 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading accountability data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-8 h-8 text-indigo-400" />
                <h1 className="text-3xl font-bold">Accountability Dashboard</h1>
              </div>
              <p className="text-gray-400">
                Weekly commitments, peer accountability, and public goals
              </p>
            </div>

            {!currentWeekCommitment && (
              <button
                onClick={() => setShowNewCommitmentForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Week Commitment
              </button>
            )}
          </div>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 border border-green-500">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{Math.round(stats.weeklyCompletionRate * 100)}%</div>
                  <div className="text-sm text-green-200">Completion Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 border border-orange-500">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-8 h-8 text-orange-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
                  <div className="text-sm text-orange-200">Week Streak</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 border border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-blue-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{stats.completedCommitments}</div>
                  <div className="text-sm text-blue-200">Kept Commitments</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 border border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-200" />
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">{partners.length}</div>
                  <div className="text-sm text-purple-200">Active Partners</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Week Commitment */}
        {currentWeekCommitment ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">This Week's Commitments</h2>
                <p className="text-sm text-gray-400">
                  Week {currentWeekCommitment.weekNumber} • {currentWeekCommitment.weekStart.toLocaleDateString()} - {currentWeekCommitment.weekEnd.toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusColor(currentWeekCommitment.overallStatus)}`}>
                  {currentWeekCommitment.overallStatus.toUpperCase()}
                </div>
                <button
                  onClick={handleDeleteCommitment}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete commitments"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {currentWeekCommitment.commitments.map((commitment) => (
                <div
                  key={commitment.id}
                  className={`border rounded-lg p-4 ${getImportanceColor(commitment.importance)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {commitment.public ? <Eye className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span className="font-semibold text-white">{commitment.description}</span>
                      </div>
                      <span className="px-2 py-1 bg-gray-900/50 rounded text-xs">
                        {commitment.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-sm font-semibold ${getStatusColor(commitment.status)}`}>
                        {commitment.status}
                      </div>
                      <button
                        onClick={() => handleDeleteIndividualCommitment(commitment.id, commitment.description)}
                        className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                        title="Delete commitment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-300">Progress</span>
                      <span className="font-semibold text-white">
                        {commitment.current} / {commitment.target}
                      </span>
                    </div>
                    <div className="w-full bg-gray-900/50 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          commitment.status === 'completed' ? 'bg-green-500' :
                          commitment.status === 'in-progress' ? 'bg-blue-500' :
                          commitment.status === 'failed' ? 'bg-red-500' :
                          'bg-gray-600'
                        }`}
                        style={{ width: `${Math.min((commitment.current / commitment.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {commitment.status !== 'completed' && commitment.status !== 'failed' && (
                    <button
                      onClick={() => updateCommitmentProgress(commitment.id, commitment.current + 1)}
                      className="mt-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-sm font-medium transition-colors"
                    >
                      Update Progress +1
                    </button>
                  )}
                </div>
              ))}
            </div>

            {!showCheckInForm && (
              <button
                onClick={() => setShowCheckInForm(true)}
                className="mt-6 w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
              >
                Complete Weekly Check-In
              </button>
            )}

            {showCheckInForm && (
              <div className="mt-6 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Weekly Check-In</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What went well this week?
                    </label>
                    <textarea
                      value={checkInReflection}
                      onChange={(e) => setCheckInReflection(e.target.value)}
                      placeholder="Reflect on your accomplishments, challenges, and lessons learned..."
                      className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What will you focus on next week?
                    </label>
                    <textarea
                      value={checkInFocus}
                      onChange={(e) => setCheckInFocus(e.target.value)}
                      placeholder="Set your intentions and priorities for the upcoming week..."
                      className="w-full h-24 bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCheckIn}
                      disabled={!checkInReflection || !checkInFocus}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                    >
                      Submit Check-In
                    </button>
                    <button
                      onClick={() => setShowCheckInForm(false)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8 text-center">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Active Commitments</h3>
            <p className="text-gray-400 mb-6">
              Start your week strong by setting clear, measurable commitments
            </p>
            <button
              onClick={() => setShowNewCommitmentForm(true)}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-colors"
            >
              Create This Week's Commitments
            </button>
          </div>
        )}

        {/* New Commitment Form */}
        {showNewCommitmentForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Create Weekly Commitments</h2>
                
                <div className="space-y-6">
                  {newCommitments.map((commitment, index) => (
                    <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                          <select
                            value={commitment.type}
                            onChange={(e) => {
                              const updated = [...newCommitments];
                              updated[index].type = e.target.value as 'study-hours' | 'battle-drills' | 'labs-completed' | 'custom';
                              setNewCommitments(updated);
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                          >
                            <option value="study-hours">Study Hours</option>
                            <option value="battle-drills">Battle Drills</option>
                            <option value="lessons">Lessons</option>
                            <option value="labs">Labs</option>
                            <option value="quizzes">Quizzes</option>
                            <option value="custom">Custom</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Target</label>
                          <input
                            type="number"
                            value={commitment.target}
                            onChange={(e) => {
                              const updated = [...newCommitments];
                              updated[index].target = parseInt(e.target.value) || 0;
                              setNewCommitments(updated);
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <input
                          type="text"
                          value={commitment.description}
                          onChange={(e) => {
                            const updated = [...newCommitments];
                            updated[index].description = e.target.value;
                            setNewCommitments(updated);
                          }}
                          placeholder="e.g., Complete 5 battle drills this week"
                          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white placeholder-gray-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Importance</label>
                          <select
                            value={commitment.importance}
                            onChange={(e) => {
                              const updated = [...newCommitments];
                              updated[index].importance = e.target.value as unknown;
                              setNewCommitments(updated);
                            }}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 pt-7">
                          <input
                            type="checkbox"
                            checked={commitment.public}
                            onChange={(e) => {
                              const updated = [...newCommitments];
                              updated[index].public = e.target.checked;
                              setNewCommitments(updated);
                            }}
                            className="w-4 h-4"
                          />
                          <label className="text-sm text-gray-300">Make Public</label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setNewCommitments([...newCommitments, { 
                      type: 'custom', 
                      description: '', 
                      target: 0, 
                      public: false, 
                      importance: 'medium' 
                    }])}
                    className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg font-medium transition-colors"
                  >
                    + Add Another Commitment
                  </button>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCreateCommitments}
                    disabled={newCommitments.some(c => !c.description || c.target <= 0)}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                  >
                    Create Commitments
                  </button>
                  <button
                    onClick={() => setShowNewCommitmentForm(false)}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Public Commitments */}
        {publicCommitments.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold">Public Commitments</h2>
            </div>

            <div className="space-y-3">
              {publicCommitments.map((commitment) => (
                <div key={commitment.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-white">{commitment.commitment}</div>
                    <div className={`text-sm font-semibold ${getStatusColor(commitment.status)}`}>
                      {commitment.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Target: {commitment.targetDate.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {commitment.witnesses.length} witnesses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Military Training Philosophy */}
        <div className="mt-8 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <TrendingUp className="w-8 h-8 text-indigo-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Accountability Philosophy</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span><span className="font-semibold">Public commitments create pressure</span> - Making goals public increases follow-through by 65%.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span><span className="font-semibold">Weekly check-ins build discipline</span> - Regular reflection prevents drift and maintains momentum.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span><span className="font-semibold">Accountability partners matter</span> - Having someone to answer to dramatically improves commitment rates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">→</span>
                  <span><span className="font-semibold">Track streaks for motivation</span> - Consecutive weeks of kept commitments build unstoppable momentum.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
