/**
 * StrategyGuide - Collapsible scaffolding for run-independent challenges
 * Provides structure and prompts without giving away answers
 */

import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, Target, Scale, FileText, HelpCircle, AlertTriangle, PenTool } from 'lucide-react';

interface EvaluationCriterion {
  criterion: string;
  weight: number;
  passingThreshold: string;
}

interface StrategyGuideProps {
  readonly minimumRequirements?: string[];
  readonly evaluationRubric?: EvaluationCriterion[];
}

function StructureTemplate() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span className="font-semibold text-cyan-400">Suggested Structure</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50 space-y-4 text-sm">
          <p className="text-slate-400 italic">Use this structure as a starting point. Adapt it to your approach.</p>
          
          <div className="space-y-3">
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">1. Current State Analysis</h5>
              <p className="text-slate-400">Document where the company is today with specific metrics</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">2. Pain Points Identification</h5>
              <p className="text-slate-400">List problems across culture, process, and technology</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">3. Transformation Roadmap</h5>
              <p className="text-slate-400">Phase 1 → Phase 2 → Phase 3 with timelines</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">4. Cultural Changes</h5>
              <p className="text-slate-400">How to shift mindsets and behaviors</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">5. Technical Implementation</h5>
              <p className="text-slate-400">Tools, pipelines, and infrastructure changes</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">6. Success Metrics</h5>
              <p className="text-slate-400">How you'll measure progress using DORA metrics</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">7. Risks & Mitigation</h5>
              <p className="text-slate-400">What could go wrong and how to handle it</p>
            </div>
            
            <div className="border-l-2 border-cyan-600 pl-3">
              <h5 className="font-semibold text-cyan-400">8. Business Case</h5>
              <p className="text-slate-400">ROI and value to the organization</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PromptsToConsider() {
  const [isOpen, setIsOpen] = useState(false);
  
  const prompts = [
    { section: 'Current State', questions: [
      'What is the current deployment frequency? (daily, weekly, monthly?)',
      'How long does it take from code commit to production?',
      'What percentage of deployments cause incidents?',
      'How do teams currently communicate about releases?'
    ]},
    { section: 'Pain Points', questions: [
      'Where do bottlenecks occur in the delivery pipeline?',
      'What causes friction between development and operations?',
      'What manual processes slow things down?',
      'What visibility gaps exist in the system?'
    ]},
    { section: 'Transformation', questions: [
      'What quick wins can build momentum in Phase 1?',
      'What dependencies exist between changes?',
      'How will you get buy-in from leadership and teams?',
      'What training will people need?'
    ]},
    { section: 'Measurement', questions: [
      'What are the 4 DORA metrics and current baselines?',
      'What targets are realistic for 6 months? 12 months?',
      'How will you collect and visualize these metrics?',
      'What leading indicators predict success?'
    ]}
  ];
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-yellow-400">Questions to Consider</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50 space-y-4 text-sm">
          <p className="text-slate-400 italic">These questions can help you think through each section.</p>
          
          {prompts.map((section) => (
            <div key={section.section} className="space-y-2">
              <h5 className="font-semibold text-yellow-400">{section.section}</h5>
              <ul className="space-y-1 text-slate-300">
                {section.questions.map((q) => (
                  <li key={q} className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommonPitfalls() {
  const [isOpen, setIsOpen] = useState(false);
  
  const pitfalls = [
    {
      pitfall: 'Being too vague with metrics',
      solution: 'Use specific numbers: "Currently deploy once per month" instead of "deploy infrequently"'
    },
    {
      pitfall: 'Focusing only on tools',
      solution: 'DevOps is 80% culture, 20% tools. Spend equal time on people and process changes.'
    },
    {
      pitfall: 'Trying to change everything at once',
      solution: 'Start with quick wins. Phase 1 should be achievable in 3 months.'
    },
    {
      pitfall: 'Ignoring resistance to change',
      solution: 'Address "why change?" and "what\'s in it for me?" for each stakeholder group.'
    },
    {
      pitfall: 'No measurement plan',
      solution: 'Define how you\'ll track progress before starting. Use DORA metrics as your foundation.'
    },
    {
      pitfall: 'Underestimating timeline',
      solution: 'Cultural change takes 6-12 months. Technical changes can be faster but need people to adopt them.'
    }
  ];
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-400" />
          <span className="font-semibold text-orange-400">Common Pitfalls to Avoid</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50 space-y-3 text-sm">
          <p className="text-slate-400 italic">Learn from others who have attempted DevOps transformations.</p>
          
          {pitfalls.map((item) => (
            <div key={item.pitfall} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-300 mb-1">{item.pitfall}</p>
                  <p className="text-slate-400 text-xs">{item.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WritingTips() {
  const [isOpen, setIsOpen] = useState(false);
  
  const tips = [
    'Start with the current state - be specific about problems and metrics',
    'Use the suggested structure but adapt it to flow naturally',
    'Include concrete examples: "Replace manual testing with automated tests" not "improve testing"',
    'Quantify benefits: "Reduce deployment time from 2 weeks to 2 days" not "deploy faster"',
    'Address skeptics: Explain ROI and how changes benefit different roles',
    'Be realistic: Show understanding that transformation takes time and effort',
    'End with next steps: What happens after your strategy is approved?'
  ];
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <PenTool className="w-5 h-5 text-purple-400" />
          <span className="font-semibold text-purple-400">Writing Tips</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50 space-y-3 text-sm">
          <p className="text-slate-400 italic">Make your strategy clear, convincing, and actionable.</p>
          
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="flex items-start text-slate-300">
                <span className="text-purple-400 mr-2 font-bold">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function EvaluationRubricSection({ rubric }: { readonly rubric: EvaluationCriterion[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <Scale className="w-5 h-5 text-green-400" />
          <span className="font-semibold text-green-400">How You&apos;ll Be Evaluated</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50 space-y-3 text-sm">
          {rubric.map((item) => (
            <div key={item.criterion} className="bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-green-400">{item.criterion}</span>
                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                  {item.weight}% weight
                </span>
              </div>
              <p className="text-slate-400 text-xs">{item.passingThreshold}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MinimumRequirementsSection({ requirements }: { readonly requirements: string[] }) {
  const [isOpen, setIsOpen] = useState(true); // Open by default
  
  return (
    <div className="border border-slate-600 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-700/50 hover:bg-slate-700 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-red-400" />
          <span className="font-semibold text-red-400">Minimum Requirements (Must Have)</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-800/50">
          <ul className="space-y-2 text-sm">
            {requirements.map((req) => (
              <li key={req} className="flex items-start text-slate-300">
                <span className="text-red-400 mr-2 font-bold">✓</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function StrategyGuide({ minimumRequirements, evaluationRubric }: StrategyGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-slate-800 rounded-lg border border-indigo-600/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-indigo-900/30 hover:bg-indigo-900/40 transition text-left"
      >
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-6 h-6 text-indigo-400" />
          <div>
            <span className="font-semibold text-indigo-400 text-lg">Strategy Guide</span>
            <p className="text-xs text-slate-400">Structure, prompts, and evaluation criteria to help you succeed</p>
          </div>
        </div>
        {isOpen ? <ChevronDown className="w-6 h-6 text-indigo-400" /> : <ChevronRight className="w-6 h-6 text-indigo-400" />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4">
          <p className="text-slate-400 text-sm">
            This guide provides scaffolding to help you approach the challenge.
            {' '}<span className="text-indigo-400 font-medium">It won&apos;t give you answers</span>, but it will help you structure your thinking.
          </p>
          
          {minimumRequirements && minimumRequirements.length > 0 && (
            <MinimumRequirementsSection requirements={minimumRequirements} />
          )}
          
          <StructureTemplate />
          
          <PromptsToConsider />
          
          <CommonPitfalls />
          
          <WritingTips />
          
          {evaluationRubric && evaluationRubric.length > 0 && (
            <EvaluationRubricSection rubric={evaluationRubric} />
          )}
        </div>
      )}
    </div>
  );
}
