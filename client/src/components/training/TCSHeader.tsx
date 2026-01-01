import { Target, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TCSHeaderProps {
  task: {
    action: string;
    objective: string;
  };
  conditions: {
    resources: string[];
    timeLimit?: number; // in minutes
    teamSize: string;
    documentation: string[];
  };
  standards: {
    criteria: string[];
    completionRequirements: string;
    timeRequirement?: string;
  };
}

export default function TCSHeader({ task, conditions, standards }: TCSHeaderProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-indigo-600 rounded-lg p-2">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Mission Brief: Task-Condition-Standard</h2>
      </div>

      {/* TASK Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-green-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
            TASK
          </div>
          <h3 className="text-lg font-semibold text-white">What You Must Accomplish</h3>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-300 font-medium mb-2">{task.action}</p>
          <p className="text-gray-400">{task.objective}</p>
        </div>
      </div>

      {/* CONDITIONS Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-yellow-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
            CONDITIONS
          </div>
          <h3 className="text-lg font-semibold text-white">Resources & Constraints</h3>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3">
          <div>
            <p className="text-gray-400 text-sm mb-1">Available Resources:</p>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {conditions.resources.map((resource, idx) => (
                <li key={idx}>{resource}</li>
              ))}
            </ul>
          </div>
          
          {conditions.documentation.length > 0 && (
            <div>
              <p className="text-gray-400 text-sm mb-1">Permitted Documentation:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {conditions.documentation.map((doc, idx) => (
                  <li key={idx}>{doc}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300 text-sm">Team Size: <span className="font-medium">{conditions.teamSize}</span></span>
            </div>
            {conditions.timeLimit && (
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">Time Available: <span className="font-medium">{conditions.timeLimit} minutes</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* STANDARDS Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
            STANDARDS
          </div>
          <h3 className="text-lg font-semibold text-white">Success Criteria (Go/No-Go)</h3>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm mb-3">{standards.completionRequirements}</p>
          <ul className="space-y-2">
            {standards.criteria.map((criterion, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">{criterion}</span>
              </li>
            ))}
          </ul>
          {standards.timeRequirement && (
            <div className="mt-4 pt-3 border-t border-slate-700">
              <p className="text-yellow-400 text-sm font-medium">⏱️ {standards.timeRequirement}</p>
            </div>
          )}
        </div>
      </div>

      {/* Go/No-Go Notice */}
      <div className="mt-4 bg-red-900/20 border border-red-600/30 rounded-lg p-3">
        <p className="text-red-400 text-sm font-medium text-center">
          ⚠️ <strong>GO/NO-GO:</strong> ALL standards must be met. No partial credit.
        </p>
      </div>
    </div>
  );
}
