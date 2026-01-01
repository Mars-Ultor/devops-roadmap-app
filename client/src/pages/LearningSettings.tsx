import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Zap, BookOpen, Target, CheckCircle, ArrowRight } from 'lucide-react';

type LearningMode = 'express' | 'deep-dive';
type LearningRole = 'general' | 'sre' | 'platform-engineer' | 'cloud-architect';

interface LearningPreferences {
  mode: LearningMode;
  role: LearningRole;
  startWeek: number;
  skipValidation: boolean;
}

export default function LearningSettings() {
  const { user } = useAuthStore();
  const [preferences, setPreferences] = useState<LearningPreferences>({
    mode: 'deep-dive',
    role: 'general',
    startWeek: 1,
    skipValidation: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;

      try {
        const prefDoc = await getDoc(doc(db, 'learningPreferences', user.uid));
        if (prefDoc.exists()) {
          setPreferences(prefDoc.data() as LearningPreferences);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    loadPreferences();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await setDoc(doc(db, 'learningPreferences', user.uid), {
        ...preferences,
        userId: user.uid,
        updatedAt: new Date()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const modes = [
    {
      id: 'express' as LearningMode,
      name: 'Express Mode',
      icon: Zap,
      color: 'from-yellow-600 to-orange-600',
      description: 'Fast-paced learning for experienced developers',
      features: [
        'Condensed lessons (15-20 min)',
        'Focus on practical application',
        'Skip basic concepts you already know',
        'Complete in 8-10 weeks'
      ],
      bestFor: 'Developers with programming experience or DevOps exposure'
    },
    {
      id: 'deep-dive' as LearningMode,
      name: 'Deep Dive Mode',
      icon: BookOpen,
      color: 'from-blue-600 to-indigo-600',
      description: 'Comprehensive learning with detailed explanations',
      features: [
        'In-depth lessons (30-45 min)',
        'Detailed explanations and examples',
        'More hands-on labs and exercises',
        'Complete in 12-14 weeks'
      ],
      bestFor: 'New to DevOps or prefer thorough understanding'
    }
  ];

  const roles = [
    {
      id: 'general' as LearningRole,
      name: 'General DevOps',
      icon: Target,
      description: 'Broad coverage of all DevOps practices',
      focus: ['Linux', 'Git', 'AWS', 'Docker', 'Kubernetes', 'CI/CD']
    },
    {
      id: 'sre' as LearningRole,
      name: 'Site Reliability Engineer',
      icon: Target,
      description: 'Focus on reliability, monitoring, and incident response',
      focus: ['Monitoring', 'Observability', 'SLIs/SLOs', 'Incident Management', 'Automation']
    },
    {
      id: 'platform-engineer' as LearningRole,
      name: 'Platform Engineer',
      icon: Target,
      description: 'Build and maintain internal developer platforms',
      focus: ['Kubernetes', 'IaC', 'Developer Experience', 'Self-Service Tools', 'API Design']
    },
    {
      id: 'cloud-architect' as LearningRole,
      name: 'Cloud Architect',
      icon: Target,
      description: 'Design and implement cloud infrastructure',
      focus: ['AWS Architecture', 'Multi-Cloud', 'Cost Optimization', 'Security', 'Scalability']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Learning Settings</h1>
          <p className="text-lg text-slate-300">
            Customize your learning experience
          </p>
        </div>

        {/* Learning Mode Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Learning Mode</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modes.map(mode => {
              const Icon = mode.icon;
              const isSelected = preferences.mode === mode.id;
              
              return (
                <button
                  key={mode.id}
                  onClick={() => setPreferences({ ...preferences, mode: mode.id })}
                  className={`text-left p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${mode.color} mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{mode.name}</h3>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-indigo-500" />
                    )}
                  </div>
                  
                  <p className="text-slate-400 mb-4">{mode.description}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {mode.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <ArrowRight className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="text-sm text-slate-500">
                    <strong>Best for:</strong> {mode.bestFor}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Career Path</h2>
          <p className="text-slate-400 mb-6">
            Choose a role to receive tailored content and recommendations
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            {roles.map(role => {
              const Icon = role.icon;
              const isSelected = preferences.role === role.id;
              
              return (
                <button
                  key={role.id}
                  onClick={() => setPreferences({ ...preferences, role: role.id })}
                  className={`text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-slate-800'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <h3 className="text-lg font-semibold text-white">{role.name}</h3>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-indigo-500" />
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-400 mb-3">{role.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {role.focus.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Advanced Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Skip Lesson Validation</h3>
                <p className="text-sm text-slate-400">
                  Allow skipping lessons without completing quizzes (not recommended)
                </p>
              </div>
              <button
                onClick={() =>
                  setPreferences({ ...preferences, skipValidation: !preferences.skipValidation })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.skipValidation ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.skipValidation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="pt-4 border-t border-slate-700">
              <label className="block text-white font-medium mb-2">
                Starting Week
              </label>
              <p className="text-sm text-slate-400 mb-3">
                Choose which week to start from (based on your experience)
              </p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(week => (
                  <button
                    key={week}
                    onClick={() => setPreferences({ ...preferences, startWeek: week })}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      preferences.startWeek === week
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Week {week}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Save Preferences
              </>
            )}
          </button>
          
          {saved && (
            <div className="text-green-400 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Preferences saved successfully!</span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
          <h3 className="text-blue-400 font-semibold mb-2">💡 Tip</h3>
          <p className="text-slate-300 text-sm">
            Not sure which settings to choose? Take the{' '}
            <a href="/diagnostic" className="text-indigo-400 hover:underline">
              diagnostic assessment
            </a>{' '}
            to get personalized recommendations based on your current skills.
          </p>
        </div>
      </div>
    </div>
  );
}
