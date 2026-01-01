/**
 * Daily Drill Blocker - CANNOT BE BYPASSED
 * Blocks all training access until today's drill is complete
 * Phase 6: Daily Drill Requirement
 */

import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Zap, AlertTriangle, Clock, Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface DailyDrillBlockerProps {
  children: React.ReactNode;
}

// Routes that should NOT be blocked
const EXEMPT_ROUTES = [
  '/login',
  '/register',
  '/dashboard',
  '/settings',
  '/analytics',
  '/aar', // Allow AAR completion
  '/failure-log', // Allow failure logging
];

export default function DailyDrillBlocker({ children }: DailyDrillBlockerProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);

  const isExemptRoute = () => {
    const exemptRoutes = EXEMPT_ROUTES.some(route => location.pathname.startsWith(route));
    
    // Allow access to training page when accessing daily drill
    if (location.pathname === '/training') {
      const urlParams = new URLSearchParams(location.search);
      const tab = urlParams.get('tab');
      console.log('DailyDrillBlocker: pathname =', location.pathname, 'tab =', tab, 'isExempt =', tab === 'daily');
      if (tab === 'daily') {
        return true;
      }
    }
    
    return exemptRoutes;
  };

  const checkDrillStatus = async () => {
    if (!user || isExemptRoute()) {
      console.log('DailyDrillBlocker: No user or exempt route, allowing access');
      setIsBlocked(false);
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const drillRef = doc(db, 'userProgress', user.uid, 'dailyDrills', today);
      const drillSnap = await getDoc(drillRef);

      if (drillSnap.exists() && drillSnap.data().completed) {
        console.log('[DailyDrillBlocker] Drill completed - allowing access');
        setIsBlocked(false);
      } else {
        console.log('[DailyDrillBlocker] Drill NOT completed - blocking access');
        setIsBlocked(true);
      }
    } catch (error) {
      console.error('Error checking drill status:', error);
      // Fail-safe: allow access on error to prevent lockout
      setIsBlocked(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial check
  useEffect(() => {
    checkDrillStatus();
  }, [user, location.pathname]);

  // Re-check every 10 seconds when blocked
  useEffect(() => {
    if (isBlocked && !loading) {
      const interval = setInterval(() => {
        setCheckCount(prev => prev + 1);
        checkDrillStatus();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isBlocked, loading]);

  // Re-check when window gains focus (user returns from another tab)
  useEffect(() => {
    const handleFocus = () => {
      if (isBlocked) {
        checkDrillStatus();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isBlocked]);

  const handleStartDrill = () => {
    console.log('DailyDrillBlocker: handleStartDrill called, navigating to /training?tab=daily');
    try {
      navigate('/training?tab=daily');
      console.log('DailyDrillBlocker: navigation successful');
    } catch (error) {
      console.error('DailyDrillBlocker: navigation failed:', error);
      window.location.href = '/training?tab=daily';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
        <div className="text-white text-xl">Checking daily drill status...</div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full bg-slate-800 border-2 border-yellow-500 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="bg-yellow-900/30 border-b-2 border-yellow-500 px-8 py-6">
            <div className="flex items-center justify-center mb-3">
              <Zap className="w-16 h-16 text-yellow-400 animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-center text-white mb-2">
              Daily Drill Required
            </h2>
            <p className="text-center text-yellow-200">
              Complete today's 5-minute challenge before accessing training content
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Training Access Blocked
                  </h3>
                  <p className="text-slate-300 text-sm">
                    All training content is locked until you complete today's daily drill. 
                    This is not optional - daily practice prevents skill decay and reinforces core concepts.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Target className="w-5 h-5 text-indigo-400 mr-2" />
                Why Daily Drills Matter
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong className="text-white">Prevent Skill Decay:</strong> Regular practice maintains muscle memory</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong className="text-white">Spaced Repetition:</strong> Reviews concepts at optimal intervals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong className="text-white">Real Competence:</strong> Proves you can perform under time pressure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">•</span>
                  <span><strong className="text-white">Just 5 Minutes:</strong> Quick daily touchpoint keeps skills sharp</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center text-sm text-slate-400 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Checking status every 10 seconds... (checked {checkCount} times)
              </div>
              <p className="text-xs text-slate-500">
                Complete the drill in another tab, and this blocker will automatically disappear
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-700 px-8 py-6">
            <button
              onClick={handleStartDrill}
              className="w-full px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold text-lg rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <Zap className="w-6 h-6 mr-2" />
              Start Daily Drill Now
            </button>
            <p className="text-center text-slate-500 text-sm mt-4">
              No shortcuts. No bypassing. Complete the drill to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Drill complete - render children
  return <>{children}</>;
}
