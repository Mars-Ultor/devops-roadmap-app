/* eslint-disable max-lines-per-function, complexity, sonarjs/no-duplicate-string */
/**
 * Phase 2.6: Advanced Leadership & Command
 * Military-style leadership training for DevOps incident command
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Target,
  MessageSquare,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Crown,
  Star
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import TimerCountdown from '../components/stress/TimerCountdown';

interface LeadershipScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'intermediate' | 'advanced' | 'expert';
  timeLimit: number;
  teamSize: number;
  objectives: string[];
  leadershipFocus: string[];
  communicationChallenges: string[];
  decisionPoints: DecisionPoint[];
}

interface DecisionPoint {
  id: string;
  situation: string;
  options: LeadershipOption[];
  correctOptionId: string;
  timePressure: number; // seconds
  leadershipPrinciple: string;
}

interface LeadershipOption {
  id: string;
  text: string;
  leadershipStyle: 'authoritative' | 'democratic' | 'delegative' | 'laissez-faire';
  impact: 'positive' | 'negative' | 'neutral';
  explanation: string;
}

interface LeadershipAttempt {
  attemptId: string;
  userId: string;
  scenarioId: string;
  startedAt: Date;
  completedAt?: Date;
  decisions: LeadershipDecision[];
  score: number;
  leadershipRating: number;
  communicationEffectiveness: number;
  teamMorale: number;
  feedback: string;
}

interface LeadershipDecision {
  decisionPointId: string;
  selectedOptionId: string;
  timeTaken: number;
  context: string;
}

const LEADERSHIP_SCENARIOS: LeadershipScenario[] = [
  {
    id: 'crisis-communication',
    title: 'Crisis Communication Command',
    description: 'Lead communication during a major production outage affecting 1M+ users. Manage stakeholder expectations, coordinate cross-functional teams, and maintain team morale.',
    difficulty: 'intermediate',
    timeLimit: 1800, // 30 minutes
    teamSize: 8,
    objectives: [
      'Establish clear communication channels',
      'Manage stakeholder expectations',
      'Coordinate team efforts',
      'Maintain team morale',
      'Provide regular status updates'
    ],
    leadershipFocus: [
      'Situational awareness',
      'Clear communication',
      'Empathy and morale management',
      'Stakeholder management'
    ],
    communicationChallenges: [
      'Conflicting information from different teams',
      'Stakeholder pressure for immediate updates',
      'Team fatigue and stress',
      'Technical complexity explanations'
    ],
    decisionPoints: [
      {
        id: 'initial-response',
        situation: 'Major outage detected. Engineering team is panicking. CEO is demanding immediate answers. What do you do first?',
        options: [
          {
            id: 'immediate-meeting',
            text: 'Call immediate all-hands meeting to get everyone on the same page',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Creates chaos and wastes time when action is needed'
          },
          {
            id: 'establish-command',
            text: 'Establish incident command structure and designate communication lead',
            leadershipStyle: 'authoritative',
            impact: 'positive',
            explanation: 'Creates order and clear responsibilities'
          },
          {
            id: 'gather-info',
            text: 'Spend 10 minutes gathering all available information before communicating',
            leadershipStyle: 'democratic',
            impact: 'neutral',
            explanation: 'Balances information gathering with timely communication'
          }
        ],
        correctOptionId: 'establish-command',
        timePressure: 120,
        leadershipPrinciple: 'Establish command and control first'
      },
      {
        id: 'team-conflict',
        situation: 'Two senior engineers are arguing about the root cause publicly in Slack. The debate is demoralizing the team. How do you handle this?',
        options: [
          {
            id: 'take-offline',
            text: 'Direct them to take the discussion offline and focus on resolution',
            leadershipStyle: 'authoritative',
            impact: 'positive',
            explanation: 'Maintains professionalism and team morale while allowing technical discussion'
          },
          {
            id: 'pick-side',
            text: 'Support the engineer who seems more correct and move forward',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Creates winners/losers and damages team unity'
          },
          {
            id: 'ignore-conflict',
            text: 'Let them work it out - they are both senior engineers',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Passive leadership allows conflict to damage team morale'
          }
        ],
        correctOptionId: 'take-offline',
        timePressure: 90,
        leadershipPrinciple: 'Manage conflict professionally'
      },
      {
        id: 'customer-update',
        situation: 'It\'s been 45 minutes. Customers are demanding updates. Engineering says they need "just 15 more minutes". What do you communicate?',
        options: [
          {
            id: 'transparent-update',
            text: 'Send honest update: "Issue identified, actively fixing, estimated 15-30min, next update in 15min"',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Builds trust through transparency while managing expectations'
          },
          {
            id: 'delay-update',
            text: 'Wait for the fix to be complete before communicating',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Silence erodes customer trust during outages'
          },
          {
            id: 'overpromise',
            text: 'Promise resolution in 15 minutes to calm customers',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Overpromising damages credibility if timeline slips'
          }
        ],
        correctOptionId: 'transparent-update',
        timePressure: 60,
        leadershipPrinciple: 'Transparent communication builds trust'
      },
      {
        id: 'junior-engineer-help',
        situation: 'A junior engineer wants to help but doesn\'t have production access. The DBA is overwhelmed. What do you do?',
        options: [
          {
            id: 'grant-temp-access',
            text: 'Grant temporary production access with senior supervision',
            leadershipStyle: 'delegative',
            impact: 'neutral',
            explanation: 'Balances help with risk, but may violate security policies'
          },
          {
            id: 'assign-monitoring',
            text: 'Assign them to monitor metrics and communicate anomalies to the team',
            leadershipStyle: 'delegative',
            impact: 'positive',
            explanation: 'Valuable contribution within their access level'
          },
          {
            id: 'sideline-them',
            text: 'Tell them to stand by and wait for instructions',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Wastes available resources and demotivates team member'
          }
        ],
        correctOptionId: 'assign-monitoring',
        timePressure: 75,
        leadershipPrinciple: 'Utilize all team members effectively'
      },
      {
        id: 'resolution-communication',
        situation: 'Issue is resolved! How do you close out the incident communication?',
        options: [
          {
            id: 'comprehensive-closeout',
            text: 'Send clear all-clear message, thank team publicly, schedule postmortem within 48hrs',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Professional closure with accountability and recognition'
          },
          {
            id: 'quick-message',
            text: 'Send brief "Issue resolved" message and move on',
            leadershipStyle: 'authoritative',
            impact: 'neutral',
            explanation: 'Gets the job done but misses opportunity for team recognition'
          },
          {
            id: 'blame-message',
            text: 'Explain what went wrong and who was responsible',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Blame culture damages team trust and psychological safety'
          }
        ],
        correctOptionId: 'comprehensive-closeout',
        timePressure: 90,
        leadershipPrinciple: 'Close incidents with recognition and accountability'
      }
    ]
  },
  {
    id: 'team-delegation',
    title: 'Strategic Delegation Under Pressure',
    description: 'Manage a complex incident requiring specialized expertise. Delegate effectively while maintaining oversight and accountability.',
    difficulty: 'advanced',
    timeLimit: 2400, // 40 minutes
    teamSize: 12,
    objectives: [
      'Identify team member strengths',
      'Delegate appropriate tasks',
      'Maintain accountability',
      'Provide guidance without micromanaging',
      'Ensure task completion'
    ],
    leadershipFocus: [
      'Delegation skills',
      'Trust in team capabilities',
      'Accountability frameworks',
      'Situational leadership'
    ],
    communicationChallenges: [
      'Technical jargon barriers',
      'Remote team coordination',
      'Time zone differences',
      'Expertise gaps'
    ],
    decisionPoints: [
      {
        id: 'database-expert',
        situation: 'Database corruption detected. Your DBA is overwhelmed. Junior engineer offers to help but lacks experience.',
        options: [
          {
            id: 'take-over',
            text: 'Take over the database work yourself to ensure it\'s done right',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Micromanaging prevents team growth and creates bottleneck'
          },
          {
            id: 'pair-programming',
            text: 'Pair the junior engineer with the DBA for knowledge transfer',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Builds team capability while ensuring quality'
          },
          {
            id: 'delegate-supervision',
            text: 'Have DBA supervise junior engineer on the task',
            leadershipStyle: 'delegative',
            impact: 'neutral',
            explanation: 'Delegates responsibility while maintaining oversight'
          }
        ],
        correctOptionId: 'pair-programming',
        timePressure: 180,
        leadershipPrinciple: 'Develop team capabilities through mentorship'
      },
      {
        id: 'remote-coordination',
        situation: 'Half your team is in different time zones. The on-call person in India needs guidance but it\'s 3 AM their time. How do you coordinate?',
        options: [
          {
            id: 'wake-everyone',
            text: 'Call an emergency all-hands meeting across all time zones',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Burns out the team and creates unsustainable on-call culture'
          },
          {
            id: 'async-command',
            text: 'Set up async command structure with clear escalation paths and decision authority',
            leadershipStyle: 'delegative',
            impact: 'positive',
            explanation: 'Empowers global team with clear authority and boundaries'
          },
          {
            id: 'wait-morning',
            text: 'Wait until US morning for full team coordination',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Delays response and shows lack of trust in remote team'
          }
        ],
        correctOptionId: 'async-command',
        timePressure: 150,
        leadershipPrinciple: 'Enable global teams with clear authority'
      },
      {
        id: 'expertise-gap',
        situation: 'The issue requires Kubernetes expertise but your K8s expert is on vacation. What do you do?',
        options: [
          {
            id: 'recall-expert',
            text: 'Call the expert on vacation - this is critical',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Disrupts work-life balance and indicates poor succession planning'
          },
          {
            id: 'vendor-support',
            text: 'Engage vendor support and pair with your next-most-experienced engineer',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Leverages external expertise while developing team skills'
          },
          {
            id: 'trial-error',
            text: 'Have the team work through it using documentation',
            leadershipStyle: 'delegative',
            impact: 'neutral',
            explanation: 'Builds team capability but risks slower resolution'
          }
        ],
        correctOptionId: 'vendor-support',
        timePressure: 200,
        leadershipPrinciple: 'Build redundancy and leverage external expertise'
      },
      {
        id: 'task-prioritization',
        situation: 'Multiple critical tasks need attention: database recovery, log analysis, customer communication, and vendor coordination. You have 4 people. How do you delegate?',
        options: [
          {
            id: 'clear-assignment',
            text: 'Assign one person per task based on strengths, set 15-min check-ins',
            leadershipStyle: 'delegative',
            impact: 'positive',
            explanation: 'Clear ownership with accountability structure'
          },
          {
            id: 'all-database',
            text: 'Put all 4 people on database recovery - it\'s most critical',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Creates bottleneck and neglects other critical paths'
          },
          {
            id: 'let-choose',
            text: 'Let team members choose tasks they want to work on',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Chaos - critical tasks may be left uncovered'
          }
        ],
        correctOptionId: 'clear-assignment',
        timePressure: 120,
        leadershipPrinciple: 'Match tasks to strengths with clear ownership'
      },
      {
        id: 'decision-authority',
        situation: 'Your lead engineer wants to roll back the deployment, but the product manager insists on trying a quick fix first. They\'re asking you to decide.',
        options: [
          {
            id: 'technical-authority',
            text: 'Defer to engineering expertise - rollback is safer during active incident',
            leadershipStyle: 'authoritative',
            impact: 'positive',
            explanation: 'Trust technical expertise during technical incidents'
          },
          {
            id: 'compromise-timeline',
            text: 'Give quick fix 10 minutes, then mandatory rollback',
            leadershipStyle: 'democratic',
            impact: 'neutral',
            explanation: 'Balances business needs with technical safety'
          },
          {
            id: 'business-priority',
            text: 'Support product manager - we need to preserve new features',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Overriding technical judgment during crisis damages trust'
          }
        ],
        correctOptionId: 'technical-authority',
        timePressure: 90,
        leadershipPrinciple: 'Trust technical expertise during technical crises'
      }
    ]
  },
  {
    id: 'stakeholder-management',
    title: 'Executive Stakeholder Command',
    description: 'Navigate complex stakeholder dynamics during a critical incident. Balance technical reality with business expectations.',
    difficulty: 'expert',
    timeLimit: 3600, // 60 minutes
    teamSize: 15,
    objectives: [
      'Manage executive expectations',
      'Translate technical issues to business impact',
      'Maintain credibility and trust',
      'Balance transparency with confidence',
      'Drive decision-making process'
    ],
    leadershipFocus: [
      'Executive communication',
      'Business acumen',
      'Crisis management',
      'Trust building'
    ],
    communicationChallenges: [
      'Technical complexity to non-technical stakeholders',
      'Conflicting priorities between business and technical teams',
      'Media and customer communication',
      'Board-level reporting'
    ],
    decisionPoints: [
      {
        id: 'revenue-impact',
        situation: 'Outage costing $50K/minute. CFO demands immediate revenue restoration. Engineering says it needs 2 hours for proper fix.',
        options: [
          {
            id: 'rush-fix',
            text: 'Push engineering to implement quick fix to restore revenue immediately',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Creates technical debt and potential future outages'
          },
          {
            id: 'business-case',
            text: 'Present business case for proper fix vs. quick fix with cost analysis',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Balances business needs with technical best practices'
          },
          {
            id: 'compromise',
            text: 'Agree to 1-hour timeline with rollback plan if needed',
            leadershipStyle: 'democratic',
            impact: 'neutral',
            explanation: 'Finds middle ground between speed and quality'
          }
        ],
        correctOptionId: 'business-case',
        timePressure: 300,
        leadershipPrinciple: 'Balance business and technical priorities'
      },
      {
        id: 'board-presentation',
        situation: 'CEO wants you to present to the board in 30 minutes about the outage. You\'re still managing the incident. What do you do?',
        options: [
          {
            id: 'delegate-incident',
            text: 'Delegate incident command to senior engineer, prepare concise board update',
            leadershipStyle: 'delegative',
            impact: 'positive',
            explanation: 'Balances stakeholder management with operational needs'
          },
          {
            id: 'decline-meeting',
            text: 'Tell CEO you cannot leave the incident - send written update instead',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'May be technically correct but damages executive relationships'
          },
          {
            id: 'split-attention',
            text: 'Join board meeting while continuing to manage incident via laptop',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Divided attention fails both responsibilities'
          }
        ],
        correctOptionId: 'delegate-incident',
        timePressure: 240,
        leadershipPrinciple: 'Delegate to manage multiple executive demands'
      },
      {
        id: 'media-inquiry',
        situation: 'Tech media outlet is running a story about the outage. PR team asks for technical details. What information do you share?',
        options: [
          {
            id: 'coordinated-response',
            text: 'Work with PR to craft accurate, non-technical message focused on customer impact and resolution',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Professional external communication protects brand'
          },
          {
            id: 'full-technical',
            text: 'Provide full technical details to show transparency',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Too much technical detail confuses public and may expose vulnerabilities'
          },
          {
            id: 'no-comment',
            text: 'Refuse to comment until postmortem is complete',
            leadershipStyle: 'authoritative',
            impact: 'neutral',
            explanation: 'Safe but may appear evasive to customers and media'
          }
        ],
        correctOptionId: 'coordinated-response',
        timePressure: 180,
        leadershipPrinciple: 'Coordinate external communications professionally'
      },
      {
        id: 'customer-escalation',
        situation: 'Your largest enterprise customer (40% of revenue) is threatening to leave. Their CEO is on the phone demanding personal attention. What do you do?',
        options: [
          {
            id: 'personal-attention',
            text: 'Take the call, provide dedicated technical resource, commit to detailed timeline',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Strategic customer management without compromising incident response'
          },
          {
            id: 'treat-equal',
            text: 'Treat them like any other customer - same communication cadence',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Technically fair but ignores business reality of key accounts'
          },
          {
            id: 'prioritize-fix',
            text: 'Tell them you\'ll call back after the issue is resolved',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Damages critical business relationship during vulnerable moment'
          }
        ],
        correctOptionId: 'personal-attention',
        timePressure: 150,
        leadershipPrinciple: 'Balance technical response with strategic relationships'
      },
      {
        id: 'blame-accountability',
        situation: 'CFO demands to know "who is responsible for this disaster". The issue was caused by a process gap, not individual error. How do you respond?',
        options: [
          {
            id: 'systems-thinking',
            text: 'Explain it was a process failure, you take leadership accountability, commit to systemic fixes',
            leadershipStyle: 'democratic',
            impact: 'positive',
            explanation: 'Demonstrates leadership accountability and systems thinking'
          },
          {
            id: 'name-engineer',
            text: 'Identify the engineer who made the deployment',
            leadershipStyle: 'authoritative',
            impact: 'negative',
            explanation: 'Throws team under bus, destroys psychological safety'
          },
          {
            id: 'deflect-blame',
            text: 'Point to lack of resources or tools as the root cause',
            leadershipStyle: 'laissez-faire',
            impact: 'negative',
            explanation: 'Deflects responsibility instead of showing leadership'
          }
        ],
        correctOptionId: 'systems-thinking',
        timePressure: 120,
        leadershipPrinciple: 'Take leadership accountability for systemic issues'
      }
    ]
  }
];

export default function LeadershipCommand() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const scenarios = LEADERSHIP_SCENARIOS;
  const [selectedScenario, setSelectedScenario] = useState<LeadershipScenario | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<LeadershipAttempt | null>(null);
  const [currentDecisionPoint, setCurrentDecisionPoint] = useState<DecisionPoint | null>(null);
  const [phase, setPhase] = useState<'selection' | 'briefing' | 'execution' | 'debrief'>('selection');
  const [decisions, setDecisions] = useState<LeadershipDecision[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [leadershipMetrics, setLeadershipMetrics] = useState({
    communication: 0,
    delegation: 0,
    decisionMaking: 0,
    teamMorale: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const selectScenario = (scenario: LeadershipScenario) => {
    setSelectedScenario(scenario);
    setPhase('briefing');
  };

  const startLeadershipTraining = () => {
    if (!selectedScenario || !user) return;

    const attempt: LeadershipAttempt = {
      attemptId: `${user.uid}_leadership_${Date.now()}`,
      userId: user.uid,
      scenarioId: selectedScenario.id,
      startedAt: new Date(),
      decisions: [],
      score: 0,
      leadershipRating: 0,
      communicationEffectiveness: 0,
      teamMorale: 100,
      feedback: ''
    };

    setCurrentAttempt(attempt);
    setTimeRemaining(selectedScenario.timeLimit);
    setPhase('execution');
    presentNextDecision();
  };

  const presentNextDecision = (updatedDecisions?: LeadershipDecision[]) => {
    if (!selectedScenario) return;

    // Use passed decisions or current state
    const currentDecisions = updatedDecisions || decisions;

    const remainingDecisions = selectedScenario.decisionPoints.filter(
      dp => !currentDecisions.find(d => d.decisionPointId === dp.id)
    );

    if (remainingDecisions.length > 0) {
      setCurrentDecisionPoint(remainingDecisions[0]);
    } else {
      completeLeadershipTraining();
    }
  };

  const makeDecision = (optionId: string) => {
    if (!currentDecisionPoint || !currentAttempt) return;

    const decision: LeadershipDecision = {
      decisionPointId: currentDecisionPoint.id,
      selectedOptionId: optionId,
      timeTaken: selectedScenario!.timeLimit - timeRemaining,
      context: currentDecisionPoint.situation
    };

    const newDecisions = [...decisions, decision];
    setDecisions(newDecisions);

    // Update leadership metrics based on decision
    const selectedOption = currentDecisionPoint.options.find(o => o.id === optionId);
    if (selectedOption) {
      updateLeadershipMetrics(selectedOption);
    }

    setCurrentDecisionPoint(null);
    // Pass newDecisions to avoid React state timing issues
    setTimeout(() => presentNextDecision(newDecisions), 2000); // Brief pause for feedback
  };

  const updateLeadershipMetrics = (option: LeadershipOption) => {
    const updates = { ...leadershipMetrics };

    switch (option.leadershipStyle) {
      case 'authoritative':
        updates.decisionMaking += option.impact === 'positive' ? 15 : -10;
        break;
      case 'democratic':
        updates.communication += option.impact === 'positive' ? 15 : -5;
        updates.teamMorale += option.impact === 'positive' ? 10 : -5;
        break;
      case 'delegative':
        updates.delegation += option.impact === 'positive' ? 15 : -10;
        break;
    }

    if (option.impact === 'negative') {
      updates.teamMorale -= 15;
    }

    // Keep metrics in bounds
    Object.keys(updates).forEach(key => {
      updates[key as keyof typeof updates] = Math.max(0, Math.min(100, updates[key as keyof typeof updates]));
    });

    setLeadershipMetrics(updates);
  };

  const completeLeadershipTraining = () => {
    if (!currentAttempt) return;

    const finalScore = calculateLeadershipScore();
    const completedAttempt: LeadershipAttempt = {
      ...currentAttempt,
      completedAt: new Date(),
      decisions,
      score: finalScore,
      leadershipRating: calculateLeadershipRating(),
      communicationEffectiveness: leadershipMetrics.communication,
      teamMorale: leadershipMetrics.teamMorale,
      feedback: generateLeadershipFeedback()
    };

    setCurrentAttempt(completedAttempt);
    setPhase('debrief');
  };

  const calculateLeadershipScore = (): number => {
    if (!selectedScenario || decisions.length === 0) return 0;
    
    // Calculate score based on correct decisions
    const correctDecisions = decisions.filter(decision => {
      const dp = selectedScenario.decisionPoints.find(p => p.id === decision.decisionPointId);
      return dp && decision.selectedOptionId === dp.correctOptionId;
    }).length;
    
    const totalDecisions = decisions.length;
    const decisionScore = (correctDecisions / totalDecisions) * 70; // 70% weight on decisions
    
    // Average leadership metrics for 30% of score
    const avgMetrics = (leadershipMetrics.communication + leadershipMetrics.delegation +
                       leadershipMetrics.decisionMaking + leadershipMetrics.teamMorale) / 4;
    const metricsScore = (avgMetrics / 100) * 30; // 30% weight on metrics
    
    return Math.round(decisionScore + metricsScore);
  };

  const calculateLeadershipRating = (): number => {
    const avgMetrics = (leadershipMetrics.communication + leadershipMetrics.delegation +
                       leadershipMetrics.decisionMaking + leadershipMetrics.teamMorale) / 4;
    return Math.round(avgMetrics);
  };

  const generateLeadershipFeedback = (): string => {
    const strengths = [];
    const improvements = [];

    if (leadershipMetrics.communication > 70) strengths.push('excellent communication skills');
    else if (leadershipMetrics.communication < 40) improvements.push('communication effectiveness');

    if (leadershipMetrics.delegation > 70) strengths.push('strong delegation abilities');
    else if (leadershipMetrics.delegation < 40) improvements.push('delegation and trust in team');

    if (leadershipMetrics.decisionMaking > 70) strengths.push('effective decision-making under pressure');
    else if (leadershipMetrics.decisionMaking < 40) improvements.push('decision-making confidence');

    if (leadershipMetrics.teamMorale > 70) strengths.push('team morale management');
    else if (leadershipMetrics.teamMorale < 40) improvements.push('team motivation and morale');

    let feedback = 'Leadership Assessment:\n\n';
    if (strengths.length > 0) {
      feedback += `Strengths: ${strengths.join(', ')}\n\n`;
    }
    if (improvements.length > 0) {
      feedback += `Areas for improvement: ${improvements.join(', ')}\n\n`;
    }

    feedback += `Overall Leadership Rating: ${calculateLeadershipRating()}/100\n`;
    feedback += `Final Score: ${calculateLeadershipScore()}/100`;

    return feedback;
  };

  const resetToScenarioSelection = () => {
    setSelectedScenario(null);
    setCurrentAttempt(null);
    setCurrentDecisionPoint(null);
    setDecisions([]);
    setTimeRemaining(0);
    setLeadershipMetrics({
      communication: 0,
      delegation: 0,
      decisionMaking: 0,
      teamMorale: 0
    });
    setPhase('selection');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/50 border-b border-blue-500 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Crown className="w-10 h-10 text-yellow-400" />
              Leadership Command Training
            </h1>
            <p className="text-blue-200">Phase 2.6: Advanced Leadership & Incident Command</p>
          </div>

          {phase === 'execution' && selectedScenario && (
            <div className="flex items-center gap-6">
              <TimerCountdown
                sessionId={currentAttempt?.attemptId || ''}
                initialTimeSeconds={selectedScenario.timeLimit}
                onTimeUp={completeLeadershipTraining}
                className="text-2xl font-bold"
              />

              <div className="text-center">
                <div className="text-sm text-blue-200">Leadership Rating</div>
                <div className="text-xl font-bold text-yellow-400">
                  {calculateLeadershipRating()}/100
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Scenario Selection */}
        {phase === 'selection' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Advanced Leadership Training</h2>
              <p className="text-xl text-gray-300 mb-8">
                Master incident command, team leadership, and crisis communication
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border-2 border-blue-500 hover:border-yellow-400 transition-all cursor-pointer shadow-2xl"
                  onClick={() => selectScenario(scenario)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-yellow-400 mb-2">{scenario.title}</h3>
                      <p className="text-gray-300 text-lg leading-relaxed mb-4">{scenario.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-400" />
                          <span className="text-sm">{Math.floor(scenario.timeLimit / 60)} min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-green-400" />
                          <span className="text-sm">{scenario.teamSize} members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-red-400" />
                          <span className="text-sm">{scenario.objectives.length} objectives</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          <span className="text-sm capitalize">{scenario.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-400 mb-2">Leadership Focus</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {scenario.leadershipFocus.map((focus, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            {focus}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-yellow-400 mb-2">Communication Challenges</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {scenario.communicationChallenges.slice(0, 3).map((challenge, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-blue-400 mb-2">Key Objectives</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        {scenario.objectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-400" />
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Briefing Phase */}
        {phase === 'briefing' && selectedScenario && (
          <div className="space-y-6">
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-blue-500">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-10 h-10 text-blue-400" />
                <div>
                  <h2 className="text-3xl font-bold">Leadership Command Briefing</h2>
                  <p className="text-gray-400">Prepare to lead through crisis and command</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-red-400">Mission Overview</h3>
                  <div className="space-y-4">
                    <div className="bg-red-900/20 border border-red-500 rounded p-4">
                      <p className="text-red-200">{selectedScenario.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-2xl font-bold text-blue-400">{selectedScenario.teamSize}</div>
                        <div className="text-sm text-gray-400">Team Members</div>
                      </div>
                      <div className="bg-slate-700 p-3 rounded">
                        <div className="text-2xl font-bold text-green-400">{Math.floor(selectedScenario.timeLimit / 60)}m</div>
                        <div className="text-sm text-gray-400">Time Limit</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-green-400">Leadership Principles</h3>
                  <div className="space-y-3">
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="font-semibold text-yellow-400 mb-2">Command Structure</h4>
                      <p className="text-sm text-gray-300">Establish clear roles and responsibilities</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="font-semibold text-yellow-400 mb-2">Communication</h4>
                      <p className="text-sm text-gray-300">Clear, concise, and timely information flow</p>
                    </div>
                    <div className="bg-slate-700/50 p-4 rounded">
                      <h4 className="font-semibold text-yellow-400 mb-2">Decision Making</h4>
                      <p className="text-sm text-gray-300">Balance speed with quality under pressure</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setPhase('selection')}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded font-semibold transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startLeadershipTraining}
                  className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded font-bold flex items-center gap-2 transition-colors text-lg"
                >
                  <Crown className="w-6 h-6" />
                  Assume Command
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Execution Phase */}
        {phase === 'execution' && selectedScenario && currentAttempt && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Command Center */}
            <div className="xl:col-span-3 space-y-6">
              {currentDecisionPoint ? (
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-red-500">
                  <div className="flex items-center gap-4 mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <div>
                      <h3 className="text-2xl font-bold text-red-400">Leadership Decision Point</h3>
                      <p className="text-gray-400">Time pressure: {currentDecisionPoint.timePressure}s</p>
                    </div>
                  </div>

                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
                    <h4 className="text-xl font-semibold mb-4">Situation:</h4>
                    <p className="text-red-200 text-lg leading-relaxed">{currentDecisionPoint.situation}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold">Choose your leadership approach:</h4>
                    {currentDecisionPoint.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => makeDecision(option.id)}
                        className="w-full bg-slate-700/50 hover:bg-slate-600 border border-slate-600 rounded-lg p-4 text-left transition-all hover:border-blue-500"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="text-gray-200 mb-2">{option.text}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs ${
                                option.leadershipStyle === 'authoritative' ? 'bg-red-900/50 text-red-200' :
                                option.leadershipStyle === 'democratic' ? 'bg-green-900/50 text-green-200' :
                                option.leadershipStyle === 'delegative' ? 'bg-blue-900/50 text-blue-200' :
                                'bg-gray-900/50 text-gray-200'
                              }`}>
                                {option.leadershipStyle}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                option.impact === 'positive' ? 'bg-green-900/50 text-green-200' :
                                option.impact === 'negative' ? 'bg-red-900/50 text-red-200' :
                                'bg-yellow-900/50 text-yellow-200'
                              }`}>
                                {option.impact} impact
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-800/80 backdrop-blur rounded-xl p-8 border border-green-500 text-center">
                  <Award className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Leadership Training Complete</h3>
                  <p className="text-gray-300">Processing your leadership decisions...</p>
                </div>
              )}
            </div>

            {/* Leadership Dashboard */}
            <div className="space-y-6">
              {/* Leadership Metrics */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-blue-500">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Leadership Metrics
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Communication</span>
                      <span>{leadershipMetrics.communication}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${leadershipMetrics.communication}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Delegation</span>
                      <span>{leadershipMetrics.delegation}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${leadershipMetrics.delegation}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Decision Making</span>
                      <span>{leadershipMetrics.decisionMaking}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full transition-all"
                        style={{ width: `${leadershipMetrics.decisionMaking}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Team Morale</span>
                      <span>{leadershipMetrics.teamMorale}/100</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          leadershipMetrics.teamMorale > 70 ? 'bg-green-500' :
                          leadershipMetrics.teamMorale > 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${leadershipMetrics.teamMorale}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Decision History */}
              <div className="bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-purple-500">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  Decision History
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {decisions.map((decision, index) => {
                    const dp = selectedScenario.decisionPoints.find(p => p.id === decision.decisionPointId);
                    const option = dp?.options.find(o => o.id === decision.selectedOptionId);
                    return (
                      <div key={index} className="bg-slate-700/50 p-2 rounded text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          {option?.impact === 'positive' ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : option?.impact === 'negative' ? (
                            <XCircle className="w-4 h-4 text-red-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="font-semibold">{dp?.leadershipPrinciple}</span>
                        </div>
                        <p className="text-gray-300 text-xs">{option?.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debrief Phase */}
        {phase === 'debrief' && currentAttempt && selectedScenario && (
          <div className="space-y-6">
            <div className={`p-8 rounded-xl border-2 ${
              currentAttempt.score >= 70
                ? 'bg-green-900/20 border-green-500'
                : currentAttempt.score >= 40
                ? 'bg-yellow-900/20 border-yellow-500'
                : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="text-center mb-8">
                {currentAttempt.score >= 70 ? (
                  <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
                ) : currentAttempt.score >= 40 ? (
                  <Shield className="w-20 h-20 mx-auto mb-4 text-blue-400" />
                ) : (
                  <AlertTriangle className="w-20 h-20 mx-auto mb-4 text-red-400" />
                )}
                <h2 className="text-4xl font-bold mb-2">
                  {currentAttempt.score >= 70 ? 'Leadership Excellence!' :
                   currentAttempt.score >= 40 ? 'Solid Leadership Performance' :
                   'Leadership Development Needed'}
                </h2>
                <p className="text-2xl text-gray-400">Final Score: {currentAttempt.score}/100</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {currentAttempt.communicationEffectiveness}/100
                  </div>
                  <div className="text-sm text-gray-400">Communication</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {currentAttempt.leadershipRating}/100
                  </div>
                  <div className="text-sm text-gray-400">Leadership Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {decisions.length}
                  </div>
                  <div className="text-sm text-gray-400">Decisions Made</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {currentAttempt.teamMorale}/100
                  </div>
                  <div className="text-sm text-gray-400">Team Morale</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-6 rounded mb-8">
                <h3 className="text-xl font-bold mb-4">Leadership After-Action Review</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Leadership Assessment</h4>
                    <p className="text-gray-300 whitespace-pre-line">{currentAttempt.feedback}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Key Leadership Principles Demonstrated</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Establish command and control structures</li>
                      <li>• Balance technical and business priorities</li>
                      <li>• Communicate effectively under pressure</li>
                      <li>• Delegate while maintaining accountability</li>
                      <li>• Maintain team morale during crises</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-yellow-400 mb-2">Recommended Next Steps</h4>
                    <ul className="text-gray-300 space-y-1">
                      <li>• Practice crisis communication scenarios</li>
                      <li>• Study different leadership styles and their applications</li>
                      <li>• Focus on building trust and psychological safety in teams</li>
                      <li>• Develop stakeholder management strategies</li>
                      <li>• Learn advanced incident command frameworks</li>
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
                  onClick={resetToScenarioSelection}
                  className="bg-purple-600 hover:bg-purple-500 px-8 py-3 rounded font-bold transition-colors"
                >
                  Command Another Scenario
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}