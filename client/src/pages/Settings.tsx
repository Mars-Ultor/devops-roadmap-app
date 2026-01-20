/* eslint-disable max-lines-per-function, sonarjs/no-duplicate-string */
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon,
  RefreshCw,
  Sliders,
  User,
  Bell,
  Trash2,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<
    "account" | "tokens" | "difficulty" | "notifications" | "data"
  >("account");
  const { user } = useAuthStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const handleClearProgress = () => {
    if (!user) return;

    try {
      // Clear Master Training progress from localStorage
      localStorage.removeItem(`masterTraining_${user.uid}`);

      // Clear any other stored progress data
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.includes("challenge") ||
            key.includes("scenario") ||
            key.includes("training") ||
            key.includes("progress") ||
            key.includes(user.uid))
        ) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      setShowConfirmDialog(false);
      setClearSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setClearSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error clearing progress:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-indigo-400" />
            Settings
          </h1>
          <p className="text-slate-400 mt-2">
            Manage your training preferences and account settings
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <button
                onClick={() => setActiveTab("account")}
                className={`w-full px-4 py-3 text-left flex items-center transition-colors ${
                  activeTab === "account"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Account
              </button>
              <button
                onClick={() => setActiveTab("tokens")}
                className={`w-full px-4 py-3 text-left flex items-center transition-colors ${
                  activeTab === "tokens"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                Reset Tokens
              </button>
              <button
                onClick={() => setActiveTab("difficulty")}
                className={`w-full px-4 py-3 text-left flex items-center transition-colors ${
                  activeTab === "difficulty"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Sliders className="w-5 h-5 mr-3" />
                Difficulty
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full px-4 py-3 text-left flex items-center transition-colors ${
                  activeTab === "notifications"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("data")}
                className={`w-full px-4 py-3 text-left flex items-center transition-colors ${
                  activeTab === "data"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Trash2 className="w-5 h-5 mr-3" />
                Data Management
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-9">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              {activeTab === "account" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Account Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Email Preferences
                      </label>
                      <p className="text-slate-400 text-sm mb-4">
                        Manage your email and notification settings
                      </p>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Weekly progress reports
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Daily drill reminders
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3 rounded" />
                          <span className="text-slate-300">
                            Marketing emails
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "tokens" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Reset Token Management
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Manage your environment reset tokens. Navigate to the full
                    token management page for detailed history and allocations.
                  </p>
                  <Link
                    to="/tokens"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Go to Token Management
                  </Link>
                </div>
              )}

              {activeTab === "difficulty" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Adaptive Difficulty Settings
                  </h2>
                  <p className="text-slate-400 mb-6">
                    View and manage your adaptive difficulty level and
                    performance-based adjustments.
                  </p>
                  <Link
                    to="/difficulty"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                  >
                    <Sliders className="w-5 h-5 mr-2" />
                    Go to Difficulty Dashboard
                  </Link>
                </div>
              )}

              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Notification Preferences
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">
                        Daily Reminders
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Daily drill notification
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Streak reminder (if not logged in)
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-3">
                        Performance Alerts
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Skill decay warnings
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 rounded"
                            defaultChecked
                          />
                          <span className="text-slate-300">
                            Weekly performance report
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6">
                    Data Management
                  </h2>

                  {clearSuccess && (
                    <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                      <p className="text-green-400 font-medium">
                        ✓ All challenge progress cleared successfully!
                      </p>
                      <p className="text-green-300 text-sm mt-1">
                        Your training data has been reset.
                      </p>
                    </div>
                  )}

                  <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 mb-6">
                    <div className="flex items-start">
                      <Trash2 className="w-6 h-6 text-red-400 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          Clear All Challenge Progress
                        </h3>
                        <p className="text-slate-300 mb-4">
                          This will permanently delete all your challenge
                          completion data, including:
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-1 mb-4">
                          <li>Leadership Command training progress</li>
                          <li>Specialized Operations progress</li>
                          <li>Advanced Integration scenarios</li>
                          <li>Daily challenge completions</li>
                          <li>Weekly boss battle progress</li>
                          <li>Master training paths</li>
                        </ul>
                        <p className="text-red-400 font-medium mb-4">
                          ⚠️ This action cannot be undone!
                        </p>
                        <button
                          onClick={() => setShowConfirmDialog(true)}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                        >
                          Clear All Progress
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Confirm Progress Reset
              </h3>
              <p className="text-slate-300 mb-6">
                Are you absolutely sure you want to clear all your challenge
                progress? This will delete all completion data and cannot be
                undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearProgress}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                >
                  Yes, Clear Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
