/**
 * RunIndependentWorkspace - Workspace for completing run-independent level tasks
 * Provides a text editor and submission mechanism for open-ended mastery challenges
 */

import { useState, useEffect, useCallback } from "react";
import {
  TimerBar,
  SelfAssessmentChecklist,
  ResponseEditor,
  SubmissionGuidelines,
  SubmitButton,
} from "./RunIndependentComponents";
import StrategyGuide from "./StrategyGuide";

interface EvaluationCriterion {
  criterion: string;
  weight: number;
  passingThreshold: string;
}

interface StrategyGuideContent {
  suggestedStructure?: string[];
  questionsToConsider?: {
    section: string;
    questions: string[];
  }[];
  commonPitfalls?: string[];
  writingTips?: string[];
}

interface CompanyProfile {
  name: string;
  description: string;
  currentMetrics: {
    deploymentFrequency: string;
    leadTimeForChanges: string;
    changeFailureRate: string;
    timeToRestoreService: string;
  };
  teamStructure: {
    development: string;
    operations: string;
    qa: string;
    management: string;
  };
  technologyStack: {
    frontend: string;
    backend: string;
    infrastructure: string;
    ciCd: string;
    monitoring: string;
  };
  currentChallenges: string[];
  businessContext: string;
}

interface RunIndependentWorkspaceProps {
  readonly objective: string;
  readonly companyProfile?: CompanyProfile;
  readonly successCriteria: string[];
  readonly timeTarget?: number;
  readonly minimumRequirements?: string[];
  readonly evaluationRubric?: EvaluationCriterion[];
  readonly strategyGuide?: StrategyGuideContent;
  readonly onSubmit: (submission: string) => void;
  readonly onSaveDraft: (draft: string) => void;
  readonly savedDraft?: string;
}

/** Custom hook for timer and auto-save logic */
function useWorkspaceState(
  savedDraft: string,
  onSaveDraft: (draft: string) => void,
) {
  const [submission, setSubmission] = useState(savedDraft);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showChecklist, setShowChecklist] = useState(true);
  const [checkedCriteria, setCheckedCriteria] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(
      () => setElapsedTime((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!submission) return;
    const timeout = setTimeout(() => onSaveDraft(submission), 30000);
    return () => clearTimeout(timeout);
  }, [submission, onSaveDraft]);

  const handleCriteriaToggle = useCallback((index: number) => {
    setCheckedCriteria((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  }, []);

  const stopTimer = useCallback(() => setIsTimerRunning(false), []);
  const toggleChecklist = useCallback(
    () => setShowChecklist((prev) => !prev),
    [],
  );

  return {
    submission,
    setSubmission,
    elapsedTime,
    showChecklist,
    checkedCriteria,
    handleCriteriaToggle,
    stopTimer,
    toggleChecklist,
  };
}

function CompanyOverview({
  description,
  businessContext,
}: {
  readonly description: string;
  readonly businessContext: string;
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h3 className="text-blue-400 font-semibold mb-2">Company Overview</h3>
      <p className="text-slate-300 text-sm">{description}</p>
      <p className="text-slate-400 text-sm mt-2 italic">{businessContext}</p>
    </div>
  );
}

function CurrentMetrics({
  metrics,
}: {
  readonly metrics: CompanyProfile["currentMetrics"];
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h4 className="text-green-400 font-semibold mb-3 flex items-center">
        <div
          className="w-2 h-2 bg-green-400 rounded-full mr-2"
          aria-hidden="true"
        ></div>
        <span>Current DORA Metrics</span>
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Deployment Frequency:</span>
          <span className="text-slate-300">{metrics.deploymentFrequency}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Lead Time:</span>
          <span className="text-slate-300">{metrics.leadTimeForChanges}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Change Failure Rate:</span>
          <span className="text-slate-300">{metrics.changeFailureRate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Time to Restore:</span>
          <span className="text-slate-300">{metrics.timeToRestoreService}</span>
        </div>
      </div>
    </div>
  );
}

function TeamStructure({
  team,
}: {
  readonly team: CompanyProfile["teamStructure"];
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h4 className="text-purple-400 font-semibold mb-3 flex items-center">
        <div
          className="w-2 h-2 bg-purple-400 rounded-full mr-2"
          aria-hidden="true"
        ></div>
        <span>Team Structure</span>
      </h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Development:</span>
          <span className="text-slate-300">{team.development}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Operations:</span>
          <span className="text-slate-300">{team.operations}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">QA:</span>
          <span className="text-slate-300">{team.qa}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Management:</span>
          <span className="text-slate-300">{team.management}</span>
        </div>
      </div>
    </div>
  );
}

function TechnologyStack({
  stack,
}: {
  readonly stack: CompanyProfile["technologyStack"];
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h4 className="text-cyan-400 font-semibold mb-3 flex items-center">
        <div
          className="w-2 h-2 bg-cyan-400 rounded-full mr-2"
          aria-hidden="true"
        ></div>
        <span>Technology Stack</span>
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-400 mb-1">Frontend:</div>
          <div className="text-slate-300">{stack.frontend}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1">Backend:</div>
          <div className="text-slate-300">{stack.backend}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1">Infrastructure:</div>
          <div className="text-slate-300">{stack.infrastructure}</div>
        </div>
        <div>
          <div className="text-slate-400 mb-1">CI/CD:</div>
          <div className="text-slate-300">{stack.ciCd}</div>
        </div>
        <div className="md:col-span-2">
          <div className="text-slate-400 mb-1">Monitoring:</div>
          <div className="text-slate-300">{stack.monitoring}</div>
        </div>
      </div>
    </div>
  );
}

function CurrentChallenges({ challenges }: { readonly challenges: string[] }) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-4">
      <h4 className="text-red-400 font-semibold mb-3 flex items-center">
        <div
          className="w-2 h-2 bg-red-400 rounded-full mr-2"
          aria-hidden="true"
        ></div>
        <span>Current Challenges</span>
      </h4>
      <ul className="space-y-2">
        {challenges.map((challenge) => (
          <li key={challenge} className="flex items-start text-sm">
            <span className="text-red-400 mr-2 mt-1">•</span>
            <span className="text-slate-300">{challenge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CompanyProfile({ profile }: { readonly profile: CompanyProfile }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-800 rounded-lg border border-blue-600/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-blue-900/30 hover:bg-blue-900/40 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">TC</span>
          </div>
          <div>
            <span className="font-semibold text-blue-400 text-lg">
              {profile.name}
            </span>
            <p className="text-xs text-slate-400">
              Company Profile - Use this as your starting point
            </p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-blue-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="p-6 space-y-6">
          <CompanyOverview
            description={profile.description}
            businessContext={profile.businessContext}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CurrentMetrics metrics={profile.currentMetrics} />
            <TeamStructure team={profile.teamStructure} />
          </div>

          <TechnologyStack stack={profile.technologyStack} />
          <CurrentChallenges challenges={profile.currentChallenges} />
        </div>
      )}
    </div>
  );
}

export default function RunIndependentWorkspace({
  objective,
  companyProfile,
  successCriteria,
  timeTarget,
  minimumRequirements,
  evaluationRubric,
  strategyGuide,
  onSubmit,
  onSaveDraft,
  savedDraft = "",
}: RunIndependentWorkspaceProps) {
  const {
    submission,
    setSubmission,
    elapsedTime,
    showChecklist,
    checkedCriteria,
    handleCriteriaToggle,
    stopTimer,
    toggleChecklist,
  } = useWorkspaceState(savedDraft, onSaveDraft);

  const allCriteriaChecked =
    successCriteria.length > 0 &&
    checkedCriteria.size === successCriteria.length;
  const wordCount = submission.trim().split(/\s+/).filter(Boolean).length;
  const canSubmit = submission.trim().length >= 100;

  const handleSubmit = () => {
    if (!canSubmit) {
      alert(
        "Please provide a more detailed response (at least 100 characters).",
      );
      return;
    }
    stopTimer();
    onSubmit(submission);
  };

  return (
    <div className="space-y-6">
      <TimerBar
        elapsedTime={elapsedTime}
        timeTarget={timeTarget}
        wordCount={wordCount}
        checkedCount={checkedCriteria.size}
        totalCriteria={successCriteria.length}
        allChecked={allCriteriaChecked}
        onSaveDraft={() => onSaveDraft(submission)}
        onToggleChecklist={toggleChecklist}
      />
      {showChecklist && (
        <SelfAssessmentChecklist
          successCriteria={successCriteria}
          checkedCriteria={checkedCriteria}
          onToggle={handleCriteriaToggle}
        />
      )}
      <StrategyGuide
        minimumRequirements={minimumRequirements}
        evaluationRubric={evaluationRubric}
        strategyGuide={strategyGuide}
      />
      {companyProfile && <CompanyProfile profile={companyProfile} />}
      <ResponseEditor
        submission={submission}
        objective={objective}
        onChange={setSubmission}
      />
      <SubmissionGuidelines />
      <SubmitButton
        allCriteriaChecked={allCriteriaChecked}
        uncheckedCount={successCriteria.length - checkedCriteria.size}
        canSubmit={canSubmit}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
