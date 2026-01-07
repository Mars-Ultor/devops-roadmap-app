import React from 'react';
import { Trophy, Award, Clock, AlertTriangle, CheckCircle, XCircle, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';
import type { CertificationStatus, RecertificationAttempt, RecertificationDrill } from '../../types/training';
import { getCertificationColor, getUrgencyColor, calculateDaysUntilExpiry } from './recertificationUtils';

// Header Component
interface HeaderProps {
  certificationCount: number;
  passedDrillsCount: number;
}

export const RecertificationHeader: React.FC<HeaderProps> = ({ certificationCount, passedDrillsCount }) => (
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
          <div className="text-2xl font-bold">{certificationCount}</div>
          <div className="text-sm text-blue-100">Active Certifications</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{passedDrillsCount}</div>
          <div className="text-sm text-blue-100">Passed Drills</div>
        </div>
      </div>
    </div>
  </div>
);

// Urgent Recertifications Component
interface UrgentRecertificationsProps {
  certifications: CertificationStatus[];
  drills: RecertificationDrill[];
  onSelectDrill: (drill: RecertificationDrill) => void;
}

export const UrgentRecertifications: React.FC<UrgentRecertificationsProps> = ({ 
  certifications, 
  drills, 
  onSelectDrill 
}) => {
  if (certifications.length === 0) return null;

  return (
    <div className="bg-red-900/50 border border-red-700 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
        <h2 className="text-xl font-semibold text-red-300">Urgent Recertification Required</h2>
      </div>
      <div className="space-y-3">
        {certifications.map(cert => {
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
                  const drill = drills.find(d =>
                    d.id.includes(cert.skillId) &&
                    d.certificationLevel === cert.certificationLevel
                  );
                  if (drill) onSelectDrill(drill);
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
  );
};

// Certifications List Component
interface CertificationsListProps {
  certifications: CertificationStatus[];
}

export const CertificationsList: React.FC<CertificationsListProps> = ({ certifications }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
    <div className="flex items-center mb-6">
      <Trophy className="h-6 w-6 text-yellow-400 mr-3" />
      <h2 className="text-xl font-semibold text-white">Your Certifications</h2>
    </div>

    {certifications.length === 0 ? (
      <div className="text-center py-8">
        <Award className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-300">No certifications yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Complete recertification drills to earn your first certification
        </p>
      </div>
    ) : (
      <div className="space-y-4">
        {certifications.map(cert => {
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
);

// Available Drills List Component
interface AvailableDrillsListProps {
  drills: RecertificationDrill[];
  onSelectDrill: (drill: RecertificationDrill) => void;
}

export const AvailableDrillsList: React.FC<AvailableDrillsListProps> = ({ drills, onSelectDrill }) => (
  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
    <div className="flex items-center mb-6">
      <Target className="h-6 w-6 text-blue-400 mr-3" />
      <h2 className="text-xl font-semibold text-white">Available Recertification Drills</h2>
    </div>

    <div className="space-y-4">
      {drills.map(drill => (
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
              onClick={() => onSelectDrill(drill)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Start Drill
            </button>
          </div>
        </div>
      ))}

      {drills.length === 0 && (
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
);

// Recent Attempts List Component
interface RecentAttemptsListProps {
  attempts: RecertificationAttempt[];
  drills: RecertificationDrill[];
}

export const RecentAttemptsList: React.FC<RecentAttemptsListProps> = ({ attempts, drills }) => {
  if (attempts.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl p-6 border border-slate-700">
      <div className="flex items-center mb-6">
        <TrendingUp className="h-6 w-6 text-green-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Recent Recertification Attempts</h2>
      </div>

      <div className="space-y-3">
        {attempts.slice(0, 5).map(attempt => {
          const drill = drills.find(d => d.id === attempt.drillId);
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
  );
};

// Skill Decay Info Component
export const SkillDecayInfo: React.FC = () => (
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
);
