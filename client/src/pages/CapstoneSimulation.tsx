/* eslint-disable max-lines-per-function */
/**
 * CapstoneSimulation Page - Scenario Challenge System
 * Final 4-hour production incident simulation
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Crown,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Mail,
  Shield,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { ScenarioChallengeService } from '../services/scenarioChallenge';
import { getScenariosByType } from '../data/scenarios';
import type { ChallengeScenario, ChallengeAttempt } from '../types/scenarios';
import { useAuthStore } from '../store/authStore';
import TimerCountdown from '../components/stress/TimerCountdown';

interface CommunicationLog {
  id: string;
  timestamp: Date;
  type: 'internal' | 'external' | 'status';
  from: string;
  to: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface IncidentMetrics {
  startTime: Date;
  affectedUsers: number;
  revenueImpact: number;
  systemDowntime: number;
  responseTime: number;
  resolutionTime: number;
}

export default function CapstoneSimulation() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [scenarios, setScenarios] = useState<ChallengeScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ChallengeScenario | null>(null);
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'selection' | 'briefing' | 'execution' | 'debrief'>('selection');

  // Capstone-specific state
  const [communicationLog, setCommunicationLog] = useState<CommunicationLog[]>([]);
  const [incidentMetrics, setIncidentMetrics] = useState<IncidentMetrics>({
    startTime: new Date(),
    affectedUsers: 0,
    revenueImpact: 0,
    systemDowntime: 0,
    responseTime: 0,
    resolutionTime: 0
  });
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [incidentTimeline, setIncidentTimeline] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const challengeService = ScenarioChallengeService.getInstance();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load capstone simulation scenarios
    const capstoneScenarios = getScenariosByType('capstone');
    setScenarios(capstoneScenarios);
    setLoading(false);
  }, [user, navigate]);

  const selectScenario = (scenario: ChallengeScenario) => {
    setSelectedScenario(scenario);
    setCurrentPhase('briefing');
  };

  const startSimulation = () => {
    if (!selectedScenario || !user) return;

    const newAttempt = challengeService.startScenarioAttempt(user.uid, selectedScenario.id);
    if (newAttempt) {
      setAttempt(newAttempt);
      setIsActive(true);
      setCurrentPhase('execution');

      // Initialize capstone-specific data
      setIncidentMetrics({
        ...incidentMetrics,
        startTime: new Date(),
        affectedUsers: 2000000, // 2M users affected
        revenueImpact: 200000 // $200K/hour
      });

      setTeamMembers([
        'Alice Johnson (SRE Lead)',
        'Bob Chen (Database Admin)',
        'Carol Williams (DevOps Engineer)',
        'David Rodriguez (Security Engineer)',
        'Emma Thompson (Product Manager)'
      ]);

      // Add initial communication
      addCommunication({
        type: 'external',
        from: 'Monitoring System',
        to: 'Incident Response Team',
        message: '🚨 CRITICAL: Global production outage detected. All services down.',
        priority: 'critical'
      });
    }
  };

  const addCommunication = (comm: Omit<CommunicationLog, 'id' | 'timestamp'>) => {
    const newComm: CommunicationLog = {
      id: `comm_${Date.now()}`,
      timestamp: new Date(),
      ...comm
    };
    setCommunicationLog(prev => [newComm, ...prev]);
  };

  const addTimelineEntry = (entry: string) => {
    setIncidentTimeline(prev => [...prev, `${new Date().toLocaleTimeString()}: ${entry}`]);
  };

  const completeObjective = (objectiveId: string) => {
    if (!completedObjectives.includes(objectiveId)) {
      setCompletedObjectives([...completedObjectives, objectiveId]);
      addTimelineEntry(`Objective completed: ${selectedScenario?.objectives[parseInt(objectiveId.split('_')[1])]}`);
    }
  };

  const completeSimulation = (passed: boolean) => {
    if (!attempt) return;

    const finalAttempt = challengeService.completeScenarioAttempt(
      attempt.attemptId,
      completedObjectives,
      passed
    );

    if (finalAttempt) {
      setAttempt(finalAttempt);
      setIsActive(false);
      setCurrentPhase('debrief');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading capstone simulation...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/50 border-b border-purple-500 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Crown className="w-10 h-10 text-yellow-400" />
              Capstone Simulation
            </h1>
            <p className="text-purple-200">4-hour production incident command simulation</p>
          </div>

          {isActive && attempt && selectedScenario && (
            <div className="flex items-center gap-6">
              <TimerCountdown
                sessionId={attempt.attemptId}
                initialTimeSeconds={selectedScenario.timeLimitSeconds}
                onTimeUp={() => completeSimulation(false)}
                className="text-2xl font-bold"
              />

              <div className="text-right">
                <div className="text-sm text-purple-200">Incident Commander</div>
                <div className="text-xl font-bold text-yellow-400">LEVEL 5</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Scenario Selection Phase */}
        {currentPhase === 'selection' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Final Challenge</h2>
              <p className="text-xl text-gray-300 mb-8">
                Lead the response to a catastrophic production incident as Incident Commander
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border-2 border-purple-500 hover:border-yellow-400 transition-all cursor-pointer shadow-2xl"
                  onClick={() => selectScenario(scenario)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-yellow-400 mb-2">{scenario.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">{scenario.description}</p>
                    </div>
                    <div className="ml-6">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-red-400 mb-2">5</div>
                        <div className="text-sm text-gray-400">MAX DIFFICULTY</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-blue-400" />
                      <div>
                        <div className="font-semibold">4 Hours</div>
                        <div className="text-sm text-gray-400">Time Limit</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-green-400" />
                      <div>
                        <div className="font-semibold">{scenario.objectives.length} Objectives</div>
                        <div className="text-sm text-gray-400">Critical Tasks</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-red-400" />
                      <div>
                        <div className="font-semibold">$200K/hour</div>
                        <div className="text-sm text-gray-400">Revenue Impact</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span className="font-semibold text-red-400">CRITICAL INCIDENT</span>
                    </div>
                    <p className="text-red-200 text-sm">
                      This simulation represents a real production disaster. Your decisions will determine
                      business continuity, customer trust, and millions in revenue. Act decisively.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Briefing Phase */}
        {currentPhase === 'briefing' && selectedScenario && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-purple-500">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-10 h-10 text-blue-400" />
                <div>
                  <h2 className="text-3xl font-bold">Incident Commander Briefing</h2>
                  <p className="text-gray-400">You are now in command of this critical incident</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Incident Overview</h3>
                  <div className="space-y-4">
                    <div className="bg-red-900/20 border border-red-500 rounded p-4">
                      <p className="text-red-200">{selectedScenario.scenario}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-2xl font-bold text-blue-400">2M+</div>
                        <div className="text-sm text-gray-400">Users Affected</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-2xl font-bold text-red-400">$200K</div>
                        <div className="text-sm text-gray-400">Per Hour Loss</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-400">Your Resources</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold mb-2">Incident Response Team</h4>
                      <div className="space-y-1 text-sm">
                        {['SRE Lead', 'Database Admin', 'DevOps Engineer', 'Security Engineer', 'Product Manager'].map((role, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-green-400" />
                            <span>{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Stakeholders</h4>
                      <div className="space-y-1 text-sm">
                        {['CEO', 'CTO', 'VP Engineering', 'VP Product', 'Customer Success'].map((role, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-yellow-400" />
                            <span>{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setCurrentPhase('selection')}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded font-semibold transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startSimulation}
                  className="bg-red-600 hover:bg-red-500 px-8 py-3 rounded font-semibold flex items-center gap-2 transition-colors text-lg"
                >
                  <Crown className="w-6 h-6" />
                  Assume Command
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Execution Phase */}
        {currentPhase === 'execution' && selectedScenario && attempt && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Command Center */}
            <div className="xl:col-span-3 space-y-6">
              {/* Incident Status Dashboard */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-red-500">
                <h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Incident Status Dashboard
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{incidentMetrics.affectedUsers.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Users Affected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">${incidentMetrics.revenueImpact.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Revenue/Hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {Math.floor((Date.now() - incidentMetrics.startTime.getTime()) / (1000 * 60))}m
                    </div>
                    <div className="text-sm text-gray-400">Downtime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{completedObjectives.length}</div>
                    <div className="text-sm text-gray-400">Objectives Complete</div>
                  </div>
                </div>

                {/* Communication Input */}
                <div className="border-t border-slate-600 pt-4">
                  <h4 className="font-semibold mb-2">Send Communication</h4>
                  <div className="flex gap-2">
                    <select className="bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm">
                      <option>Team Update</option>
                      <option>Stakeholder Update</option>
                      <option>Status Report</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter communication..."
                      className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addCommunication({
                            type: 'internal',
                            from: 'Incident Commander',
                            to: 'Team',
                            message: e.currentTarget.value.trim(),
                            priority: 'high'
                          });
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-6 border border-green-500">
                <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Critical Objectives ({completedObjectives.length}/{selectedScenario.objectives.length})
                </h3>
                <div className="space-y-3">
                  {selectedScenario.objectives.map((objective, index) => {
                    const objectiveId = `obj_${index}`;
                    const isCompleted = completedObjectives.includes(objectiveId);

                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-4 rounded border ${
                          isCompleted
                            ? 'bg-green-900/20 border-green-500'
                            : 'bg-slate-700/50 border-slate-600'
                        }`}
                      >
                        <button
                          onClick={() => completeObjective(objectiveId)}
                          className={`mt-1 ${
                            isCompleted
                              ? 'text-green-400'
                              : 'text-gray-400 hover:text-green-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <div className="w-6 h-6 border-2 border-current rounded" />
                          )}
                        </button>
                        <div className="flex-1">
                          <span className={isCompleted ? 'line-through text-gray-400' : ''}>
                            {objective}
                          </span>
                          {index < 3 && (
                            <span className="ml-2 px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded">
                              PRIORITY {index + 1}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Command Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => completeSimulation(true)}
                  className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-colors text-lg"
                >
                  <Award className="w-6 h-6" />
                  Declare Incident Resolved
                </button>
                <button
                  onClick={() => completeSimulation(false)}
                  className="bg-red-600 hover:bg-red-500 px-8 py-4 rounded-lg font-bold flex items-center gap-2 transition-colors text-lg"
                >
                  <XCircle className="w-6 h-6" />
                  Escalate to Higher Management
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Communication Log */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-blue-500">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  Communication Log
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {communicationLog.slice(0, 10).map((comm) => (
                    <div key={comm.id} className="bg-slate-700/50 p-2 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        {comm.type === 'external' && <Mail className="w-3 h-3 text-red-400" />}
                        {comm.type === 'internal' && <Users className="w-3 h-3 text-blue-400" />}
                        <span className="font-semibold text-xs">{comm.from}</span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="font-semibold text-xs">{comm.to}</span>
                      </div>
                      <p className="text-gray-300 text-xs">{comm.message}</p>
                      <div className="text-xs text-gray-500 mt-1">
                        {comm.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incident Timeline */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-purple-500">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  Incident Timeline
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {incidentTimeline.slice(-8).map((entry, index) => (
                    <div key={index} className="text-xs text-gray-300 py-1 border-l border-purple-500 pl-2">
                      {entry}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Status */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-green-500">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Team Status
                </h4>
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debrief Phase */}
        {currentPhase === 'debrief' && attempt && selectedScenario && (
          <div className="space-y-6">
            <div className={`p-8 rounded-xl border-2 ${
              attempt.passed
                ? 'bg-green-900/20 border-green-500'
                : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="text-center mb-8">
                {attempt.passed ? (
                  <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
                ) : (
                  <XCircle className="w-20 h-20 mx-auto mb-4 text-red-400" />
                )}
                <h2 className="text-4xl font-bold mb-2">
                  {attempt.passed ? 'Incident Commander Victory!' : 'Incident Escalated'}
                </h2>
                <p className="text-2xl text-gray-400">Final Score: {attempt.score}/100</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {Math.round(attempt.timeSpentSeconds / 3600 * 10) / 10}h
                  </div>
                  <div className="text-sm text-gray-400">Total Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {completedObjectives.length}
                  </div>
                  <div className="text-sm text-gray-400">Objectives Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {communicationLog.length}
                  </div>
                  <div className="text-sm text-gray-400">Communications Sent</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {incidentTimeline.length}
                  </div>
                  <div className="text-sm text-gray-400">Timeline Entries</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded mb-8">
                <h3 className="text-xl font-bold mb-4">After-Action Review</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">What Went Well</h4>
                    <p className="text-gray-300">{attempt.feedback}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Areas for Improvement</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Communication frequency and clarity</li>
                      <li>• Stakeholder management during crisis</li>
                      <li>• Decision-making under time pressure</li>
                      <li>• Team coordination and delegation</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Key Learnings</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Incident command requires clear communication channels</li>
                      <li>• Stakeholder expectations must be managed proactively</li>
                      <li>• Technical decisions impact business outcomes significantly</li>
                      <li>• Team morale and confidence are critical during extended incidents</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded font-bold transition-colors"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded font-bold transition-colors"
                >
                  Command Another Incident
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}