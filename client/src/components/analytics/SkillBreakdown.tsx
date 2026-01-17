import React from 'react';
import { Brain, Code, Database, Cloud, Shield } from 'lucide-react';

interface SkillData {
  name: string;
  category: string;
  proficiency: number;
  sessionsCompleted: number;
  lastPracticed: string;
}

interface SkillBreakdownProps {
  skills: SkillData[];
}

const SkillBreakdown: React.FC<SkillBreakdownProps> = ({ skills }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="text-center text-gray-400">No skills data available</div>
      </div>
    );
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'development':
        return <Code className="w-5 h-5 text-blue-400" />;
      case 'infrastructure':
        return <Cloud className="w-5 h-5 text-purple-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-green-400" />;
      case 'security':
        return <Shield className="w-5 h-5 text-red-400" />;
      default:
        return <Brain className="w-5 h-5 text-gray-400" />;
    }
  };

  const getProficiencyColor = (proficiency: number) => {
    if (proficiency >= 80) return 'text-green-400';
    if (proficiency >= 60) return 'text-yellow-400';
    if (proficiency >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProficiencyBg = (proficiency: number) => {
    if (proficiency >= 80) return 'from-green-500 to-green-600';
    if (proficiency >= 60) return 'from-yellow-500 to-yellow-600';
    if (proficiency >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-indigo-400" />
        <h2 className="text-xl font-semibold">Skill Breakdown</h2>
      </div>

      <div className="space-y-4">
        {skills.map((skill: SkillData) => (
          <div key={skill.name} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getCategoryIcon(skill.category)}
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-gray-400 capitalize">{skill.category}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${getProficiencyColor(skill.proficiency)}`}>
                  {skill.proficiency}%
                </div>
                <div className="text-sm text-gray-400">proficiency</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-full bg-gray-600 rounded-full h-2 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${getProficiencyBg(skill.proficiency)} h-2 rounded-full transition-all`}
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{skill.sessionsCompleted} sessions completed</span>
                <span>Last practiced: {skill.lastPracticed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillBreakdown;