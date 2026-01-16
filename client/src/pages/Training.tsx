/* eslint-disable max-lines-per-function, react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Zap, Target, Crown, Shield } from 'lucide-react';
import Curriculum from './Curriculum';
import DailyChallenge from './DailyChallenge';
import WeeklyBossBattle from './WeeklyBossBattle';
import CapstoneSimulation from './CapstoneSimulation';
import LeadershipCommand from './LeadershipCommand';
import SpecializedOperations from './SpecializedOperations';
import AdvancedIntegrationScenarios from './AdvancedIntegrationScenarios';
import MasterTraining from './MasterTraining';
import ContentGate from '../components/ContentGate';
import { useAuthStore } from '../store/authStore';
import { curriculumData } from '../data/curriculumData';
import { useProgress } from '../hooks/useProgress';

export default function Training() {
  const { user } = useAuthStore();
  const { getLabProgress } = useProgress();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'overview';
  const subTabFromUrl = searchParams.get('subtab') || 'leadership';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [activeSubTab, setActiveSubTab] = useState(subTabFromUrl);
  const [bossBattleUnlocked, setBossBattleUnlocked] = useState(false);

  console.log('Training: tabFromUrl =', tabFromUrl, 'activeTab =', activeTab);

  // Update active tab and subtab when URL parameters change
  useEffect(() => {
    const tab = searchParams.get('tab');
    const subtab = searchParams.get('subtab');
    if (tab) {
      setActiveTab(tab);
    }
    if (subtab) {
      setActiveSubTab(subtab);
    }
  }, [searchParams]);

  // Check boss battle unlock status
  useEffect(() => {
    const checkBossBattleUnlock = async () => {
      const unlocked = await isBossBattleUnlocked();
      setBossBattleUnlocked(unlocked);
    };
    
    if (user) {
      checkBossBattleUnlock();
    }
  }, [user]);

  // Check if boss battle is unlocked (end of week)
  const isBossBattleUnlocked = async () => {
    if (!user?.currentWeek) return false;
    
    const weekData = curriculumData.find(week => week.weekNumber === user.currentWeek);
    if (!weekData) return false;
    
    // Check if all labs for the current week are completed
    const labPromises = weekData.labs.map(lab => getLabProgress(lab.id));
    const labResults = await Promise.all(labPromises);
    
    return labResults.every(completed => completed === true);
  };

  // Check if capstone is unlocked (week 12)
  const isCapstoneUnlocked = () => {
    return user?.currentWeek === 12;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, component: null },
    { id: 'curriculum', label: 'Core Curriculum', icon: BookOpen, component: Curriculum },
    { id: 'daily', label: 'Daily Challenge', icon: Zap, component: DailyChallenge },
    { id: 'boss', label: 'Boss Battle', icon: Target, component: WeeklyBossBattle, disabled: !bossBattleUnlocked },
    { id: 'capstone', label: 'Capstone', icon: Crown, component: CapstoneSimulation, disabled: !isCapstoneUnlocked() },
    { id: 'advanced', label: 'Advanced Training', icon: Shield, component: null },
  ];

  const advancedSubTabs = [
    { id: 'leadership', label: 'Leadership Command', component: LeadershipCommand },
    { id: 'specialized', label: 'Specialized Ops', component: SpecializedOperations },
    { id: 'integration', label: 'Integration Scenarios', component: AdvancedIntegrationScenarios },
    { id: 'master', label: 'Master Training', component: MasterTraining },
  ];

  // Handle tab changes with URL updates
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', tabId);
    // Reset subtab when switching to non-advanced tabs
    if (tabId !== 'advanced') {
      newParams.delete('subtab');
    }
    setSearchParams(newParams);
  };

  // Handle subtab changes with URL updates
  const handleSubTabChange = (subTabId: string) => {
    setActiveSubTab(subTabId);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', 'advanced');
    newParams.set('subtab', subTabId);
    setSearchParams(newParams);
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component as React.ComponentType | null;
  const activeSubTabData = advancedSubTabs.find(subtab => subtab.id === activeSubTab);
  const ActiveSubComponent = activeSubTabData?.component as React.ComponentType | null;

  console.log('Training: activeTabData =', activeTabData, 'ActiveComponent =', ActiveComponent);

  // Render active component safely
  const renderActiveComponent = () => {
    if (!ActiveComponent) return null;
    return <ActiveComponent />;
  };

  // Render active sub-component safely
  const renderActiveSubComponent = () => {
    if (!ActiveSubComponent) return null;
    return <ActiveSubComponent />;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-4">Welcome to Your DevOps Training Journey! 🚀</h2>
        <p className="text-xl text-indigo-100 mb-6">
          Master DevOps through structured 12-week curriculum, daily challenges, and real-world scenarios.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 rounded-lg p-4">
            <BookOpen className="w-8 h-8 text-indigo-200 mb-2" />
            <h3 className="font-semibold mb-1">12-Week Curriculum</h3>
            <p className="text-sm text-indigo-200">Structured learning path from basics to advanced</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Zap className="w-8 h-8 text-indigo-200 mb-2" />
            <h3 className="font-semibold mb-1">Daily Challenges</h3>
            <p className="text-sm text-indigo-200">Keep your skills sharp with daily practice</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <Target className="w-8 h-8 text-indigo-200 mb-2" />
            <h3 className="font-semibold mb-1">Battle Drills</h3>
            <p className="text-sm text-indigo-200">Test your skills in high-pressure scenarios</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Continue Learning</h3>
          <p className="text-slate-400 mb-4">
            Pick up where you left off in the curriculum or start a new challenge.
          </p>
          <button
            onClick={() => setActiveTab('curriculum')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            View Curriculum
          </button>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-xl font-semibold text-white mb-4">Daily Practice</h3>
          <p className="text-slate-400 mb-4">
            Complete your daily challenge to maintain momentum and earn XP.
          </p>
          <button
            onClick={() => setActiveTab('daily')}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Start Daily Challenge
          </button>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-400">{user?.currentWeek || 1}</div>
            <div className="text-sm text-slate-400">Current Week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{user?.totalXP || 0}</div>
            <div className="text-sm text-slate-400">Total XP</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{user?.currentStreak || 0}</div>
            <div className="text-sm text-slate-400">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">0</div>
            <div className="text-sm text-slate-400">Badges Earned</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">Training Center</h1>
          <p className="text-slate-400">Master DevOps through structured progression and real-world scenarios</p>
        </div>

        {/* Simple tab navigation */}
        <div className="flex flex-wrap gap-2 mb-6 bg-slate-800 p-4 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isDisabled = tab.disabled;

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && handleTabChange(tab.id)}
                disabled={isDisabled}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : isDisabled
                    ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="mt-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'curriculum' && (
            <ContentGate>
              {renderActiveComponent()}
            </ContentGate>
          )}
          {activeTab === 'daily' && renderActiveComponent()}
          {activeTab === 'boss' && !bossBattleUnlocked && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Boss Battle Locked</h3>
              <p className="text-gray-500">Complete more weeks to unlock the boss battle!</p>
            </div>
          )}
          {activeTab === 'boss' && bossBattleUnlocked && renderActiveComponent()}
          {activeTab === 'capstone' && !isCapstoneUnlocked() && (
            <div className="text-center py-12">
              <Crown className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Capstone Locked</h3>
              <p className="text-gray-500">Reach Week 12 to unlock the capstone project!</p>
            </div>
          )}
          {activeTab === 'capstone' && isCapstoneUnlocked() && renderActiveComponent()}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Advanced Training Sub-tabs */}
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  Advanced Training Modules
                </h3>
                <div className="flex flex-wrap gap-2">
                  {advancedSubTabs.map((subtab) => (
                    <button
                      key={subtab.id}
                      onClick={() => handleSubTabChange(subtab.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSubTab === subtab.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {subtab.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Advanced Training Content */}
              <div className="mt-6">
                {renderActiveSubComponent()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}