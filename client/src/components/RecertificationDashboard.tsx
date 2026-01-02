import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import RecertificationDrillComponent from './RecertificationDrill';
import { RECERTIFICATION_DRILLS, CERTIFICATION_REQUIREMENTS, SKILL_DECAY_MODELS } from '../data/recertificationDrills';
import type {
  CertificationStatus,
  CertificationLevel,
  RecertificationAttempt,
  RecertificationDrill
} from '../types/training';
import {
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trophy,
  Target,
  Calendar,
  TrendingUp,
  BookOpen,
  Star,
  Zap,
  XCircle
} from 'lucide-react';

export default function RecertificationDashboard() {
  const { user } = useAuthStore();
  const [selectedDrill, setSelectedDrill] = useState<RecertificationDrill | null>(null);
  const [certificationStatus, setCertificationStatus] = useState<CertificationStatus[]>([]);
  const [recentAttempts, setRecentAttempts] = useState<RecertificationAttempt[]>([]);

  // Mock certification status - in real app, this would come from database
  useEffect(() => {
    if (user) {
      // Simulate some certifications for demo
      const mockCertifications: CertificationStatus[] = [
        {
          userId: user.uid,
          skillId: 'docker-basics',
          certificationLevel: 'bronze',
          earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
          lastRecertifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          recertificationRequired: false,
          gracePeriodDays: 30,
          consecutivePasses: 2,
          totalAttempts: 3
        },
        {
          userId: user.uid,
          skillId: 'kubernetes-fundamentals',
          certificationLevel: 'silver',
          earnedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Expires soon
          lastRecertifiedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          recertificationRequired: true,
          gracePeriodDays: 15,
          consecutivePasses: 1,
          totalAttempts: 2
        }
      ];
      setCertificationStatus(mockCertifications);
    }
  }, [user]);

  const handleDrillComplete = (attempt: RecertificationAttempt) => {
    setRecentAttempts(prev => [attempt, ...prev.slice(0, 9)]); // Keep last 10 attempts
    setSelectedDrill(null);

    // Update certification status based on attempt
    if (attempt.passed) {
      setCertificationStatus(prev =>
        prev.map(cert =>
          cert.skillId === attempt.drillId.split('-')[2] // Extract skill from drill ID
            ? {
                ...cert,
                lastRecertifiedAt: new Date(),
                recertificationRequired: false,
                consecutivePasses: cert.consecutivePasses + 1,
                totalAttempts: cert.totalAttempts + 1
              }
            : cert
        )
      );
    }
  };

  const getCertificationColor = (level: CertificationLevel) => {
    switch (level) {
      case 'bronze': return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'silver': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'gold': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'platinum': return 'text-purple-600 bg-purple-100 border-purple-200';
      case 'master': return 'text-red-600 bg-red-100 border-red-200';
    }
  };

  const getUrgencyColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (daysUntilExpiry <= 7) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (daysUntilExpiry <= 30) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const calculateDaysUntilExpiry = (expiresAt: Date) => {
    const now = new Date();
    const diffTime = expiresAt.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getAvailableDrills = () => {
    return RECERTIFICATION_DRILLS.filter(drill => {
      // Check if user has required certifications
      const hasPrerequisites = drill.prerequisites.every(prereq => {
        return certificationStatus.some(cert =>
          cert.skillId === prereq ||
          (prereq.includes('-completed') && cert.certificationLevel !== 'bronze')
        );
      });
      return hasPrerequisites;
    });
  };

  const getUpcomingRecertifications = () => {
    return certificationStatus
      .filter(cert => cert.recertificationRequired)
      .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());
  };

  if (selectedDrill) {
    return (
      <RecertificationDrillComponent
        drillId={selectedDrill.id}
        onComplete={handleDrillComplete}
        onCancel={() => setSelectedDrill(null)}
      />
    );
  }

  const upcomingRecertifications = getUpcomingRecertifications();
  const availableDrills = getAvailableDrills();

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Recertification Center</h1>
              <p className="text-blue-100 mt-2">
                Maintain your DevOps expertise through continuous learning and recertification
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{certificationStatus.length}</div>
                <div className="text-sm text-blue-100">Active Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{recentAttempts.filter(a => a.passed).length}</div>
                <div className="text-sm text-blue-100">Passed Drills</div>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Recertifications */}
        {upcomingRecertifications.length > 0 && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-red-300">Urgent Recertification Required</h2>
            </div>
            <div className="space-y-3">
              {upcomingRecertifications.map(cert => {
                const daysLeft = calculateDaysUntilExpiry(cert.expiresAt);
                return (
                  <div key={cert.skillId} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(cert.certificationLevel)}`}>
                        {cert.certificationLevel.toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{cert.skillId.replace('-', ' ').toUpperCase()}</h3>
                        <p className="text-sm text-gray-400">
                          Expires in {daysLeft} days
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const drill = RECERTIFICATION_DRILLS.find(d =>
                          d.id.includes(cert.skillId) &&
                          d.certificationLevel === cert.certificationLevel
                        );
                        if (drill) setSelectedDrill(drill);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Recertify Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Certifications */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
            <div className="flex items-center mb-6">
              <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Your Certifications</h2>
            </div>

            {certificationStatus.length === 0 ? (
              <div className="text-center py-8">
                <Award className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No certifications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Complete recertification drills to earn your first certification
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {certificationStatus.map(cert => {
                  const daysLeft = calculateDaysUntilExpiry(cert.expiresAt);
                  return (
                    <div key={cert.skillId} className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(cert.certificationLevel)}`}>
                            {cert.certificationLevel.toUpperCase()}
                          </div>
                          <span className="font-medium text-white">
                            {cert.skillId.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(daysLeft)}`}>
                          {daysLeft < 0 ? 'EXPIRED' : `${daysLeft} days left`}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                        <div>
                          <span className="font-medium">Earned:</span> {cert.earnedAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Last Recertified:</span> {cert.lastRecertifiedAt.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Consecutive Passes:</span> {cert.consecutivePasses}
                        </div>
                        <div>
                          <span className="font-medium">Total Attempts:</span> {cert.totalAttempts}
                        </div>
                      </div>

                      {cert.recertificationRequired && (
                        <div className="mt-3 p-2 bg-yellow-900/50 border border-yellow-700 rounded">
                          <p className="text-sm text-yellow-200">
                            Recertification required to maintain this certification
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Available Drills */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Available Recertification Drills</h2>
            </div>

            <div className="space-y-4">
              {availableDrills.map(drill => (
                <div key={drill.id} className="border border-slate-600 rounded-lg p-4 hover:border-blue-500 transition-colors bg-slate-800/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{drill.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{drill.description}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(drill.certificationLevel)}`}>
                      {drill.certificationLevel.toUpperCase()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {drill.timeLimitMinutes} min
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {drill.questions.length} questions
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {drill.passingScore}% to pass
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Recertify every {drill.recertificationIntervalDays} days
                    </div>
                    <button
                      onClick={() => setSelectedDrill(drill)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Start Drill
                    </button>
                  </div>
                </div>
              ))}

              {availableDrills.length === 0 && (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-300">No drills available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete prerequisite certifications to unlock more recertification drills
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Attempts */}
        {recentAttempts.length > 0 && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Recent Recertification Attempts</h2>
            </div>

            <div className="space-y-3">
              {recentAttempts.slice(0, 5).map(attempt => {
                const drill = RECERTIFICATION_DRILLS.find(d => d.id === attempt.drillId);
                return (
                  <div key={attempt.id} className="flex items-center justify-between p-4 border border-slate-600 rounded-lg bg-slate-800/50">
                    <div className="flex items-center space-x-3">
                      {attempt.passed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <h3 className="font-medium text-white">
                          {drill?.title || 'Unknown Drill'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {attempt.completedAt?.toLocaleDateString()} • {Math.round(attempt.timeSpentMinutes)} minutes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {attempt.score}%
                      </div>
                      <div className="text-sm text-gray-400">
                        {attempt.passed ? 'PASSED' : 'FAILED'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Skill Decay Information */}
        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Zap className="h-6 w-6 text-blue-400 mr-3" />
            <h2 className="text-xl font-semibold text-blue-300">Knowledge Retention & Recertification</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Why Recertification Matters</h3>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Skills decay over time without practice</li>
                <li>• Technology evolves rapidly in DevOps</li>
                <li>• Maintain professional credibility</li>
                <li>• Ensure compliance with best practices</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-300 mb-2">Recertification Schedule</h3>
              <div className="text-sm text-blue-200 space-y-1">
                <div className="flex justify-between">
                  <span>Bronze:</span>
                  <span>Every 90 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Silver:</span>
                  <span>Every 120 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Gold:</span>
                  <span>Every 180 days</span>
                </div>
                <div className="flex justify-between">
                  <span>Platinum:</span>
                  <span>Annual</span>
                </div>
                <div className="flex justify-between">
                  <span>Master:</span>
                  <span>Annual</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}