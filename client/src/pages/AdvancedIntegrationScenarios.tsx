/**
 * Phase 2.8: Advanced Integration Scenarios
 * Multi-team coordination and cross-domain incident response
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Star,
  Target,
  MessageSquare,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import TimerCountdown from '../components/stress/TimerCountdown';

interface IntegrationScenario {
  id: string;
  title: string;
  complexity: 'intermediate' | 'advanced' | 'expert';
  description: string;
  teams: Team[];
  incident: string;
  timeLimit: number;
  challenges: IntegrationChallenge[];
  successCriteria: string[];
  debriefing: {
    keyTakeaways: string[];
    commonMistakes: string[];
    bestPractices: string[];
    nextSteps: string[];
  };
}

interface Team {
  id: string;
  name: string;
  role: string;
  specialization: string;
  status: 'available' | 'busy' | 'offline';
  communicationStyle: 'direct' | 'collaborative' | 'formal';
}

interface IntegrationChallenge {
  id: string;
  title: string;
  description: string;
  type: 'coordination' | 'communication' | 'decision' | 'escalation';
  teams: string[]; // team IDs involved
  options?: string[];
  correctApproach?: string;
  timeLimit?: number;
  points: number;
  communicationRequired: boolean;
}

interface IntegrationAttempt {
  scenarioId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  teamCommunications: TeamCommunication[];
  decisions: IntegrationDecision[];
  completed: boolean;
}

interface TeamCommunication {
  fromTeam: string;
  toTeam: string;
  message: string;
  timestamp: Date;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface IntegrationDecision {
  challengeId: string;
  selectedApproach: string;
  teamsInvolved: string[];
  communicationUsed: boolean;
  isCorrect: boolean;
  timeSpent: number;
  points: number;
}

const INTEGRATION_SCENARIOS: IntegrationScenario[] = [
  {
    id: 'multi-service-outage',
    title: 'Multi-Service Outage Coordination',
    complexity: 'expert',
    description: 'Coordinate response across 6 teams when a database corruption affects multiple critical services simultaneously.',
    teams: [
      { id: 'platform', name: 'Platform Team', role: 'Infrastructure Lead', specialization: 'Cloud Infrastructure', status: 'available', communicationStyle: 'direct' },
      { id: 'database', name: 'Database Team', role: 'DBA Lead', specialization: 'Database Administration', status: 'available', communicationStyle: 'formal' },
      { id: 'security', name: 'Security Team', role: 'Security Lead', specialization: 'DevSecOps', status: 'available', communicationStyle: 'collaborative' },
      { id: 'frontend', name: 'Frontend Team', role: 'Frontend Lead', specialization: 'React/Angular', status: 'busy', communicationStyle: 'direct' },
      { id: 'backend', name: 'Backend Team', role: 'Backend Lead', specialization: 'Microservices', status: 'available', communicationStyle: 'collaborative' },
      { id: 'monitoring', name: 'Monitoring Team', role: 'SRE Lead', specialization: 'Observability', status: 'available', communicationStyle: 'direct' }
    ],
    incident: `**CRITICAL INCIDENT: Multi-Service Database Corruption**

**Current Situation:**
- PostgreSQL primary database corruption detected at 2:15 AM
- 4 critical services affected: Payment, User Auth, Order Processing, Inventory
- Customer transactions failing, revenue impact: $50K/hour
- Replica databases showing data inconsistency
- Monitoring alerts flooding all channels

**Business Impact:**
- E-commerce platform down for premium customers
- Payment processing halted
- Customer support overwhelmed (500+ tickets in 10 minutes)
- SLA breach imminent (99.9% uptime requirement)

**Technical Details:**
- Corruption appears to be from failed backup restoration
- Point-in-time recovery needed
- Cross-service dependencies complicate rollback
- Security scan required before production restore

**Your Role:** Incident Commander - Coordinate 6 teams across infrastructure, database, security, frontend, backend, and monitoring domains.`,
    timeLimit: 2400, // 40 minutes
    challenges: [
      {
        id: 'initial-assessment',
        title: 'Initial Assessment & Team Assembly',
        description: 'How do you quickly assess the situation and assemble the right teams?',
        type: 'coordination',
        teams: ['platform', 'database', 'monitoring'],
        options: [
          'Call immediate all-hands meeting with all 6 teams',
          'Form core incident response team first, then expand',
          'Let each team leader assess independently',
          'Wait for complete technical assessment before coordinating'
        ],
        correctApproach: 'Form core incident response team first, then expand',
        points: 150,
        communicationRequired: true
      },
      {
        id: 'communication-protocol',
        title: 'Establish Communication Protocol',
        description: 'What communication channels and protocols should be established?',
        type: 'communication',
        teams: ['platform', 'database', 'security', 'frontend', 'backend', 'monitoring'],
        options: [
          'Use existing Slack channels with @everyone mentions',
          'Create dedicated incident Slack channel and bridge call',
          'Send individual emails to team leads only',
          'Use existing standup meeting format'
        ],
        correctApproach: 'Create dedicated incident Slack channel and bridge call',
        points: 120,
        communicationRequired: true
      },
      {
        id: 'dependency-mapping',
        title: 'Cross-Team Dependency Management',
        description: 'How do you handle the complex dependencies between database, security, and application teams?',
        type: 'coordination',
        teams: ['database', 'security', 'backend', 'frontend'],
        options: [
          'Let each team work independently on their components',
          'Create dependency map and assign clear handoffs',
          'Force serial execution (one team at a time)',
          'Parallel execution with constant communication'
        ],
        correctApproach: 'Create dependency map and assign clear handoffs',
        points: 180,
        communicationRequired: true
      },
      {
        id: 'escalation-decision',
        title: 'Executive Escalation',
        description: 'Business stakeholders are demanding immediate updates. When and how do you escalate?',
        type: 'escalation',
        teams: ['platform', 'monitoring'],
        options: [
          'Provide hourly updates via email only',
          'Schedule immediate executive briefing with technical lead',
          'Give real-time updates in incident channel',
          'Wait until resolution before communicating'
        ],
        correctApproach: 'Schedule immediate executive briefing with technical lead',
        points: 140,
        communicationRequired: true
      },
      {
        id: 'rollback-strategy',
        title: 'Coordinated Rollback Execution',
        description: 'Database team recommends 2-hour rollback. How do you coordinate this across all teams?',
        type: 'decision',
        teams: ['database', 'platform', 'security', 'backend', 'frontend'],
        options: [
          'Execute rollback immediately without coordination',
          'Create detailed rollback plan with all team approvals',
          'Let database team handle rollback independently',
          'Cancel rollback and focus on forward fix'
        ],
        correctApproach: 'Create detailed rollback plan with all team approvals',
        points: 200,
        communicationRequired: true
      },
      {
        id: 'data-integrity-check',
        title: 'Cross-Team Data Validation',
        description: 'After rollback, how do you coordinate data integrity validation across teams?',
        type: 'coordination',
        teams: ['database', 'backend', 'frontend', 'monitoring'],
        options: [
          'Database team validates independently',
          'Coordinated validation with each team verifying their domain',
          'Automated tests only for validation',
          'Wait for user reports of data issues'
        ],
        correctApproach: 'Coordinated validation with each team verifying their domain',
        points: 170,
        communicationRequired: true
      },
      {
        id: 'post-incident-coordination',
        title: 'Post-Incident Review Coordination',
        description: 'How do you coordinate post-incident review across 6 teams effectively?',
        type: 'communication',
        teams: ['platform', 'database', 'security', 'frontend', 'backend', 'monitoring'],
        options: [
          'Individual team retrospectives only',
          'Single combined post-mortem with all teams',
          'Written incident report distributed via email',
          'Async collaboration doc with follow-up meeting'
        ],
        correctApproach: 'Single combined post-mortem with all teams',
        points: 160,
        communicationRequired: true
      }
    ],
    successCriteria: [
      'All teams effectively coordinated within first 10 minutes',
      'Clear communication protocols established',
      'Dependencies properly mapped and managed',
      'Business stakeholders appropriately informed',
      'Rollback executed without additional incidents',
      'Incident resolved within 2 hours'
    ],
    debriefing: {
      keyTakeaways: [
        'Multi-team coordination requires structured communication',
        'Dependency mapping prevents conflicts and delays',
        'Early escalation prevents stakeholder panic',
        'Clear roles and responsibilities are critical'
      ],
      commonMistakes: [
        'Trying to involve everyone in every decision',
        'Poor communication leading to duplicated work',
        'Not establishing clear escalation paths',
        'Underestimating cross-team dependencies'
      ],
      bestPractices: [
        'Establish incident command structure immediately',
        'Create dedicated communication channels',
        'Map dependencies before taking action',
        'Regular stakeholder updates with clear timelines'
      ],
      nextSteps: [
        'Document incident response procedures',
        'Conduct cross-team coordination training',
        'Implement automated dependency mapping',
        'Establish executive communication protocols'
      ]
    }
  },
  {
    id: 'cloud-migration-crisis',
    title: 'Cloud Migration Crisis Management',
    complexity: 'advanced',
    description: 'Manage a failing cloud migration affecting multiple business units during peak business hours.',
    teams: [
      { id: 'migration', name: 'Migration Team', role: 'Migration Lead', specialization: 'Cloud Migration', status: 'available', communicationStyle: 'direct' },
      { id: 'networking', name: 'Network Team', role: 'Network Lead', specialization: 'Cloud Networking', status: 'available', communicationStyle: 'formal' },
      { id: 'application', name: 'App Team', role: 'Application Lead', specialization: 'Application Support', status: 'busy', communicationStyle: 'collaborative' },
      { id: 'business', name: 'Business Team', role: 'Business Lead', specialization: 'Business Operations', status: 'available', communicationStyle: 'formal' },
      { id: 'vendor', name: 'Cloud Vendor', role: 'Vendor Rep', specialization: 'AWS/Azure Support', status: 'available', communicationStyle: 'formal' }
    ],
    incident: `**MAJOR INCIDENT: Cloud Migration Failure**

**Current Situation:**
- Migration of 12 applications to AWS failing during cutover
- 3 applications successfully migrated, 9 failing
- Business users unable to access critical systems
- Migration window: 2 hours remaining before business opens
- Data synchronization issues causing inconsistencies

**Business Impact:**
- Customer service operations halted
- Financial reporting systems down
- Supply chain visibility lost
- Executive leadership demanding immediate resolution

**Technical Issues:**
- DNS propagation delays causing routing failures
- Database replication lag causing data inconsistencies
- Application configuration issues in new environment
- Network connectivity problems between regions

**Your Role:** Migration Crisis Manager - Coordinate migration team, network team, application team, business stakeholders, and cloud vendor.`,
    timeLimit: 1800, // 30 minutes
    challenges: [
      {
        id: 'rollback-vs-fix',
        title: 'Rollback vs. Fix Forward Decision',
        description: 'Migration is failing with 2 hours left. Do you rollback or fix forward?',
        type: 'decision',
        teams: ['migration', 'application', 'business'],
        options: [
          'Immediate rollback of all migrated applications',
          'Continue fixing issues while extending migration window',
          'Pause migration and assess each application individually',
          'Accept partial migration and rollback only critical failures'
        ],
        correctApproach: 'Pause migration and assess each application individually',
        points: 160,
        communicationRequired: true
      },
      {
        id: 'vendor-escalation',
        title: 'Cloud Vendor Support Coordination',
        description: 'How do you effectively engage cloud vendor support?',
        type: 'escalation',
        teams: ['migration', 'networking', 'vendor'],
        options: [
          'Open standard support ticket and wait',
          'Request immediate escalation to enterprise support',
          'Contact vendor account manager directly',
          'Post in community forums for quick answers'
        ],
        correctApproach: 'Request immediate escalation to enterprise support',
        points: 130,
        communicationRequired: true
      },
      {
        id: 'business-communication',
        title: 'Business Stakeholder Management',
        description: 'Business leaders are panicking. How do you communicate effectively?',
        type: 'communication',
        teams: ['business', 'migration'],
        options: [
          'Provide technical details and timelines via email',
          'Schedule emergency stakeholder meeting with clear action plan',
          'Give constant updates in migration channel',
          'Limit communication to prevent information overload'
        ],
        correctApproach: 'Schedule emergency stakeholder meeting with clear action plan',
        points: 140,
        communicationRequired: true
      },
      {
        id: 'technical-coordination',
        title: 'Multi-Team Technical Coordination',
        description: 'Network and application teams have conflicting diagnoses. How do you coordinate resolution?',
        type: 'coordination',
        teams: ['migration', 'networking', 'application'],
        options: [
          'Let teams debate and reach consensus',
          'Choose one team\'s diagnosis and proceed',
          'Facilitate structured troubleshooting session',
          'Escalate to senior technical leadership'
        ],
        correctApproach: 'Facilitate structured troubleshooting session',
        points: 150,
        communicationRequired: true
      },
      {
        id: 'recovery-execution',
        title: 'Coordinated Recovery Execution',
        description: 'You\'ve decided on a path forward. How do you coordinate recovery across all teams?',
        type: 'decision',
        teams: ['migration', 'networking', 'application', 'business', 'vendor'],
        options: [
          'Sequential recovery - one team completes before next starts',
          'Parallel recovery with frequent sync points',
          'Let each team execute independently',
          'Vendor leads recovery with teams supporting'
        ],
        correctApproach: 'Parallel recovery with frequent sync points',
        points: 180,
        communicationRequired: true
      }
    ],
    successCriteria: [
      'Migration issues properly triaged and prioritized',
      'Vendor support effectively engaged',
      'Business stakeholders properly informed and managed',
      'Clear decision made on rollback vs. fix forward',
      'Communication channels established and maintained'
    ],
    debriefing: {
      keyTakeaways: [
        'Migration crises require rapid decision-making',
        'Vendor relationships are critical during incidents',
        'Business communication is as important as technical coordination',
        'Rollback planning should be part of migration strategy'
      ],
      commonMistakes: [
        'Not having rollback procedures ready',
        'Poor vendor communication during crisis',
        'Ignoring business stakeholder concerns',
        'Trying to fix everything simultaneously'
      ],
      bestPractices: [
        'Always have rollback procedures documented',
        'Establish vendor escalation paths in advance',
        'Include business stakeholders in crisis communication',
        'Regular migration rehearsals and dry runs'
      ],
      nextSteps: [
        'Review and update migration procedures',
        'Strengthen vendor relationship management',
        'Implement migration monitoring and alerting',
        'Conduct post-mortem with all involved teams'
      ]
    }
  }
];

export default function AdvancedIntegrationScenarios() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedScenario, setSelectedScenario] = useState<IntegrationScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<IntegrationAttempt | null>(null);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [phase, setPhase] = useState<'selection' | 'briefing' | 'execution' | 'debrief'>('selection');
  const [decisions, setDecisions] = useState<IntegrationDecision[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [selectedApproach, setSelectedApproach] = useState<string>('');
  const [communications, setCommunications] = useState<TeamCommunication[]>([]);
  const [showCommunication, setShowCommunication] = useState(false);
  const [communicationMessage, setCommunicationMessage] = useState('');
  const [communicationFrom, setCommunicationFrom] = useState<string>('');
  const [communicationTo, setCommunicationTo] = useState<string>('');

  const startScenario = (scenario: IntegrationScenario) => {
    setSelectedScenario(scenario);
    setCurrentAttempt({
      scenarioId: scenario.id,
      startTime: new Date(),
      score: 0,
      teamCommunications: [],
      decisions: [],
      completed: false
    });
    setPhase('briefing');
    setTimeRemaining(scenario.timeLimit);
  };

  const startExecution = () => {
    setPhase('execution');
    setCurrentChallengeIndex(0);
  };

  const submitDecision = () => {
    if (!selectedScenario || !currentAttempt) return;

    const currentChallenge = selectedScenario.challenges[currentChallengeIndex];
    const isCorrect = selectedApproach === currentChallenge.correctApproach;

    const decision: IntegrationDecision = {
      challengeId: currentChallenge.id,
      selectedApproach,
      teamsInvolved: currentChallenge.teams,
      communicationUsed: communications.length > 0,
      isCorrect,
      timeSpent: selectedScenario.timeLimit - timeRemaining,
      points: isCorrect ? currentChallenge.points : Math.floor(currentChallenge.points * 0.3)
    };

    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    const newScore = newDecisions.reduce((sum, d) => sum + d.points, 0);
    setCurrentAttempt({
      ...currentAttempt,
      score: newScore,
      decisions: newDecisions
    });

    if (currentChallengeIndex < selectedScenario.challenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSelectedApproach('');
      setCommunications([]);
    } else {
      completeScenario(newScore, newDecisions, communications);
    }
  };

  const sendCommunication = () => {
    if (!communicationMessage.trim() || !communicationFrom || !communicationTo) return;

    const communication: TeamCommunication = {
      fromTeam: communicationFrom,
      toTeam: communicationTo,
      message: communicationMessage,
      timestamp: new Date(),
      urgency: 'medium'
    };

    setCommunications([...communications, communication]);
    setCommunicationMessage('');
    setCommunicationFrom('');
    setCommunicationTo('');
    setShowCommunication(false);
  };

  const completeScenario = (
    finalScore: number,
    finalDecisions: IntegrationDecision[],
    finalCommunications: TeamCommunication[]
  ) => {
    if (!currentAttempt) return;

    setCurrentAttempt({
      ...currentAttempt,
      endTime: new Date(),
      score: finalScore,
      decisions: finalDecisions,
      teamCommunications: finalCommunications,
      completed: true
    });
    setPhase('debrief');
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setCurrentAttempt(null);
    setCurrentChallengeIndex(0);
    setPhase('selection');
    setDecisions([]);
    setCommunications([]);
    setTimeRemaining(0);
    setSelectedApproach('');
    setCommunicationMessage('');
    setCommunicationFrom('');
    setCommunicationTo('');
    setShowCommunication(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Please log in to access advanced integration scenarios.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Network className="w-8 h-8 mr-3 text-indigo-400" />
                Advanced Integration Scenarios
              </h1>
              <p className="text-slate-400 mt-2">
                Phase 2.8: Multi-team coordination and cross-domain incident response
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {phase === 'selection' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {INTEGRATION_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    scenario.complexity === 'expert' ? 'bg-red-500/20 text-red-400' :
                    scenario.complexity === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {scenario.complexity}
                  </span>
                  <div className="flex items-center text-slate-400 text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    {scenario.teams.length} teams
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{scenario.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{scenario.description}</p>

                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Teams Involved:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scenario.teams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center px-2 py-1 bg-slate-700 rounded text-xs"
                      >
                        <span className="text-slate-300">{team.name}</span>
                        <span className={`ml-2 w-2 h-2 rounded-full ${
                          team.status === 'available' ? 'bg-green-400' :
                          team.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.floor(scenario.timeLimit / 60)} minutes
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {scenario.challenges.length} challenges
                  </div>
                </div>

                <button
                  onClick={() => startScenario(scenario)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Start Integration Scenario
                </button>
              </div>
            ))}
          </div>
        )}

        {phase === 'briefing' && selectedScenario && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  selectedScenario.complexity === 'expert' ? 'bg-red-500/20 text-red-400' :
                  selectedScenario.complexity === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedScenario.complexity}
                </span>
              </div>

              {/* Teams Overview */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Teams & Stakeholders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedScenario.teams.map((team) => (
                    <div key={team.id} className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{team.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          team.status === 'available' ? 'bg-green-500/20 text-green-400' :
                          team.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {team.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{team.role}</p>
                      <p className="text-slate-500 text-xs">{team.specialization}</p>
                      <p className="text-slate-500 text-xs mt-1">Style: {team.communicationStyle}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Incident Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Incident Overview</h3>
                <div className="bg-slate-900 rounded-lg p-6 border border-slate-600">
                  <p className="text-slate-300 whitespace-pre-line">{selectedScenario.incident}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="text-sm">Time Limit</span>
                  </div>
                  <p className="text-white font-semibold">{Math.floor(selectedScenario.timeLimit / 60)} minutes</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Users className="w-5 h-5 mr-2" />
                    <span className="text-sm">Teams Involved</span>
                  </div>
                  <p className="text-white font-semibold">{selectedScenario.teams.length}</p>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center text-slate-400 mb-2">
                    <Target className="w-5 h-5 mr-2" />
                    <span className="text-sm">Challenges</span>
                  </div>
                  <p className="text-white font-semibold">{selectedScenario.challenges.length}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={resetScenario}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startExecution}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Begin Integration Scenario
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'execution' && selectedScenario && currentAttempt && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Main Challenge Area */}
              <div className="lg:col-span-3">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
                  {/* Header with timer and progress */}
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedScenario.title}</h2>
                      <p className="text-slate-400">Challenge {currentChallengeIndex + 1} of {selectedScenario.challenges.length}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-400">Score</p>
                        <p className="text-xl font-bold text-indigo-400">{currentAttempt.score}</p>
                      </div>
                      <TimerCountdown
                        sessionId={currentAttempt?.scenarioId || 'integration-scenario'}
                        initialTimeSeconds={timeRemaining}
                        onTimeUp={() => completeScenario(currentAttempt.score, decisions, communications)}
                        className="text-2xl font-mono"
                      />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>{currentChallengeIndex + 1} / {selectedScenario.challenges.length}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentChallengeIndex + 1) / selectedScenario.challenges.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Current challenge */}
                  {(() => {
                    const currentChallenge = selectedScenario.challenges[currentChallengeIndex];
                    return (
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center mb-3">
                            <h3 className="text-xl font-semibold text-white mr-3">{currentChallenge.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${
                              currentChallenge.type === 'coordination' ? 'bg-blue-500/20 text-blue-400' :
                              currentChallenge.type === 'communication' ? 'bg-green-500/20 text-green-400' :
                              currentChallenge.type === 'decision' ? 'bg-purple-500/20 text-purple-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {currentChallenge.type}
                            </span>
                          </div>
                          <p className="text-slate-300 text-lg">{currentChallenge.description}</p>
                        </div>

                        {/* Teams involved */}
                        <div className="bg-slate-900 rounded-lg p-4 border border-slate-600">
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Teams Involved
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentChallenge.teams.map((teamId) => {
                              const team = selectedScenario.teams.find(t => t.id === teamId);
                              return team ? (
                                <div key={teamId} className="flex items-center px-3 py-1 bg-slate-700 rounded text-sm">
                                  <span className="text-slate-300">{team.name}</span>
                                  <span className={`ml-2 w-2 h-2 rounded-full ${
                                    team.status === 'available' ? 'bg-green-400' :
                                    team.status === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                                  }`} />
                                </div>
                              ) : null;
                            })}
                          </div>
                        </div>

                        {currentChallenge.options && (
                          <div className="space-y-3">
                            {currentChallenge.options.map((option, index) => (
                              <label
                                key={index}
                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                                  selectedApproach === option
                                    ? 'border-indigo-500 bg-indigo-500/10'
                                    : 'border-slate-600 hover:border-slate-500'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="approach"
                                  value={option}
                                  checked={selectedApproach === option}
                                  onChange={(e) => setSelectedApproach(e.target.value)}
                                  className="mr-3"
                                />
                                <span className="text-white">{option}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {/* Communication system */}
                        <div className="border-t border-slate-700 pt-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium flex items-center">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Team Communications ({communications.length})
                            </h4>
                            <button
                              onClick={() => setShowCommunication(!showCommunication)}
                              className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors text-sm"
                            >
                              {showCommunication ? 'Cancel' : 'Send Message'}
                            </button>
                          </div>

                          {showCommunication && (
                            <div className="bg-slate-900 rounded-lg p-4 border border-slate-600 mb-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                  <label className="block text-sm text-slate-400 mb-1">From Team</label>
                                  <select
                                    value={communicationFrom}
                                    onChange={(e) => setCommunicationFrom(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
                                  >
                                    <option value="">Select team</option>
                                    {selectedScenario.teams.map((team) => (
                                      <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm text-slate-400 mb-1">To Team</label>
                                  <select
                                    value={communicationTo}
                                    onChange={(e) => setCommunicationTo(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white"
                                  >
                                    <option value="">Select team</option>
                                    {selectedScenario.teams.map((team) => (
                                      <option key={team.id} value={team.id}>{team.name}</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-end">
                                  <button
                                    onClick={sendCommunication}
                                    disabled={!communicationMessage.trim() || !communicationFrom || !communicationTo}
                                    className="w-full px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                                  >
                                    Send
                                  </button>
                                </div>
                              </div>
                              <textarea
                                value={communicationMessage}
                                onChange={(e) => setCommunicationMessage(e.target.value)}
                                placeholder="Enter your communication..."
                                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded text-white resize-none"
                                rows={3}
                              />
                            </div>
                          )}

                          {communications.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {communications.map((comm, index) => {
                                const fromTeam = selectedScenario.teams.find(t => t.id === comm.fromTeam);
                                const toTeam = selectedScenario.teams.find(t => t.id === comm.toTeam);
                                return (
                                  <div key={index} className="bg-slate-900 rounded p-3 border border-slate-600">
                                    <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                                      <span>{fromTeam?.name} → {toTeam?.name}</span>
                                      <span>{comm.timestamp.toLocaleTimeString()}</span>
                                    </div>
                                    <p className="text-slate-300">{comm.message}</p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end space-x-4 pt-6 border-t border-slate-700">
                          <button
                            onClick={resetScenario}
                            className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                          >
                            Abort Scenario
                          </button>
                          <button
                            onClick={submitDecision}
                            disabled={!selectedApproach}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors font-medium"
                          >
                            Submit Decision
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Teams Status Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Team Status</h3>
                  <div className="space-y-3">
                    {selectedScenario.teams.map((team) => (
                      <div key={team.id} className="bg-slate-900 rounded-lg p-3 border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium text-sm">{team.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            team.status === 'available' ? 'bg-green-500/20 text-green-400' :
                            team.status === 'busy' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {team.status}
                          </span>
                        </div>
                        <p className="text-slate-400 text-xs mb-1">{team.role}</p>
                        <p className="text-slate-500 text-xs">{team.specialization}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'debrief' && selectedScenario && currentAttempt && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  currentAttempt.score >= 600 ? 'bg-green-500/20 text-green-400' :
                  currentAttempt.score >= 400 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {currentAttempt.score >= 600 ? (
                    <CheckCircle className="w-8 h-8" />
                  ) : (
                    <AlertTriangle className="w-8 h-8" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Integration Complete</h2>
                <p className="text-slate-400">
                  Final Score: <span className="text-indigo-400 font-semibold">{currentAttempt.score}</span> points
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Communications: {communications.length} messages exchanged
                </p>
              </div>

              {/* Decision summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Decision Summary</h3>
                <div className="space-y-3">
                  {decisions.map((decision, index) => {
                    const challenge = selectedScenario.challenges.find(c => c.id === decision.challengeId);
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                        <div className="flex items-center">
                          {decision.isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mr-3" />
                          )}
                          <div>
                            <p className="text-white font-medium">{challenge?.title}</p>
                            <p className="text-slate-400 text-sm">{decision.selectedApproach}</p>
                            {decision.communicationUsed && (
                              <p className="text-green-400 text-xs">✓ Communication used</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-indigo-400 font-semibold">+{decision.points}</p>
                          <p className="text-slate-400 text-sm">{decision.timeSpent}s</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Communication summary */}
              {communications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Communication Log</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {communications.map((comm, index) => {
                      const fromTeam = selectedScenario.teams.find(t => t.id === comm.fromTeam);
                      const toTeam = selectedScenario.teams.find(t => t.id === comm.toTeam);
                      return (
                        <div key={index} className="bg-slate-900 rounded p-3 border border-slate-600">
                          <div className="flex items-center justify-between text-sm text-slate-400 mb-1">
                            <span>{fromTeam?.name} → {toTeam?.name}</span>
                            <span>{comm.timestamp.toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-300">{comm.message}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Debriefing content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-green-400" />
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.keyTakeaways.map((takeaway, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5 flex-shrink-0" />
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    Common Mistakes
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <XCircle className="w-4 h-4 mr-2 text-red-400 mt-0.5 flex-shrink-0" />
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-400" />
                    Best Practices
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <Target className="w-4 h-4 mr-2 text-blue-400 mt-0.5 flex-shrink-0" />
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
                    Next Steps
                  </h3>
                  <ul className="space-y-2">
                    {selectedScenario.debriefing.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start text-slate-300">
                        <Activity className="w-4 h-4 mr-2 text-indigo-400 mt-0.5 flex-shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetScenario}
                  className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Try Another Scenario
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}