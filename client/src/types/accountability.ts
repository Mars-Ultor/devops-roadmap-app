/**
 * Accountability System Types
 * Weekly commitments and peer accountability tracking
 */

export type CommitmentStatus = 'pending' | 'in-progress' | 'completed' | 'failed' | 'extended';

export interface WeeklyCommitment {
  id: string;
  userId: string;
  weekNumber: number;
  weekStart: Date;
  weekEnd: Date;
  commitments: Commitment[];
  createdAt: Date;
  completedAt?: Date;
  overallStatus: CommitmentStatus;
}

export interface Commitment {
  id: string;
  type: 'study-hours' | 'battle-drills' | 'lessons' | 'labs' | 'quizzes' | 'custom';
  description: string;
  target: number; // e.g., 10 hours, 5 drills, etc.
  current: number;
  status: CommitmentStatus;
  public: boolean; // Make this commitment visible to accountability partner
  importance: 'low' | 'medium' | 'high' | 'critical';
}

export interface AccountabilityPartner {
  id: string;
  userId: string; // The user who has this partner
  partnerId: string; // The partner's user ID
  partnerEmail: string;
  partnerName: string;
  status: 'pending' | 'active' | 'paused' | 'ended';
  startedAt: Date;
  lastCheckIn?: Date;
  sharedGoals: boolean; // Can see each other's goals
  mutualAccountability: boolean; // Both hold each other accountable
}

export interface AccountabilityCheckIn {
  id: string;
  userId: string;
  partnerId?: string; // Optional: check-in with partner
  weekNumber: number;
  checkInDate: Date;
  completed: boolean;
  commitmentsMet: number;
  commitmentsTotal: number;
  weekReflection: string; // What went well, what didn't
  nextWeekFocus: string; // What to focus on next week
  partnerFeedback?: string; // Feedback from accountability partner
}

export interface PublicCommitment {
  id: string;
  userId: string;
  userName: string;
  commitment: string;
  targetDate: Date;
  witnesses: string[]; // User IDs who witnessed this commitment
  status: CommitmentStatus;
  proofOfCompletion?: string; // Link to certificate, project, etc.
  createdAt: Date;
  completedAt?: Date;
}

export interface AccountabilityStats {
  weeklyCompletionRate: number;
  currentStreak: number; // Consecutive weeks meeting commitments
  longestStreak: number;
  totalCommitments: number;
  completedCommitments: number;
  failedCommitments: number;
  avgCommitmentsPerWeek: number;
  partnerCheckIns: number;
  publicCommitmentsMade: number;
  publicCommitmentsKept: number;
}
