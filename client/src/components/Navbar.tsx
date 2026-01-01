import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Target, LogOut, BarChart3, FileText, Settings as SettingsIcon, Flame, Book, Menu, X, Brain } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-400 flex items-center" onClick={closeMobileMenu}>
              <Flame className="w-6 h-6 mr-2" />
              <span className="hidden sm:block">DevOps Training</span>
              <span className="sm:hidden">DevOps</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/training"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Training
            </Link>
            <Link
              to="/battle-drills"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Battle Drills
            </Link>
            <Link
              to="/failure-log"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Failure Log
            </Link>
            <Link
              to="/aar"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <Book className="w-4 h-4 mr-2" />
              AAR
            </Link>
            <Link
              to="/analytics"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Link>
            <Link
              to="/ai-coaching"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Coaching
            </Link>
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <SettingsIcon className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-sm">
              <span className="text-gray-400">Week {user?.currentWeek}/12</span>
              <span className="ml-4 text-indigo-400 font-semibold">{user?.totalXP} XP</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:block">Logout</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/training"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Training
              </Link>
              <Link
                to="/battle-drills"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <Target className="w-5 h-5 mr-3" />
                Battle Drills
              </Link>
              <Link
                to="/failure-log"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <FileText className="w-5 h-5 mr-3" />
                Failure Log
              </Link>
              <Link
                to="/aar"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <Book className="w-5 h-5 mr-3" />
                AAR
              </Link>
              <Link
                to="/analytics"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <BarChart3 className="w-5 h-5 mr-3" />
                Analytics
              </Link>
              <Link
                to="/ai-coaching"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <Brain className="w-5 h-5 mr-3" />
                AI Coaching
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
                onClick={closeMobileMenu}
              >
                <SettingsIcon className="w-5 h-5 mr-3" />
                Settings
              </Link>
            </div>
            <div className="px-3 py-2 border-t border-slate-700 sm:hidden">
              <div className="text-sm">
                <span className="text-gray-400">Week {user?.currentWeek}/12</span>
                <span className="ml-4 text-indigo-400 font-semibold">{user?.totalXP} XP</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
