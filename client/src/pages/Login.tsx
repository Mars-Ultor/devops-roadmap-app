import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Rocket, Zap, Trophy } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (_err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                DevOps Journey 🚀
              </h1>
              <p className="text-2xl text-indigo-200 mb-8">
                From Zero to Job-Ready in 3 Months
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-xl">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">33 Hands-On Labs</h3>
                  <p className="text-gray-300">Master DevOps tools through interactive browser-based labs</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-green-600 to-teal-600 p-3 rounded-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">6000+ XP to Earn</h3>
                  <p className="text-gray-300">Track your progress and earn badges as you learn</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-yellow-600 to-orange-600 p-3 rounded-xl">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Cloud Resume Challenge</h3>
                  <p className="text-gray-300">Build a portfolio project that impresses employers</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome Back! 👋
              </h2>
              <p className="text-gray-400">
                Sign in to continue your DevOps journey
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/10 border-2 border-red-500 text-red-400 px-4 py-3 rounded-lg flex items-start space-x-2">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-slate-600 bg-slate-900 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent text-base font-bold rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link 
                  to="/register" 
                  className="text-indigo-400 hover:text-indigo-300 transition font-medium"
                >
                  Don't have an account? <span className="font-bold">Register here →</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Mobile Features */}
          <div className="lg:hidden mt-8 space-y-4">
            <div className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <Rocket className="w-6 h-6 text-indigo-400" />
              <span className="text-gray-300">33 Interactive Labs</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <Zap className="w-6 h-6 text-green-400" />
              <span className="text-gray-300">6000+ XP & Badges</span>
            </div>
            <div className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span className="text-gray-300">Cloud Resume Project</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
