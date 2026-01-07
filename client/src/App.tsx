import { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import DailyDrillBlocker from './components/DailyDrillBlocker';
import AppRoutes from './routes/AppRoutes';

/** Loading spinner shown during initial auth check */
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}

/** Suspense fallback shown while lazy-loading pages */
function PageLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Loading page...</p>
      </div>
    </div>
  );
}

function App() {
  const { user, loading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          {user && <Navbar />}
          <Suspense fallback={<PageLoadingFallback />}>
            <DailyDrillBlocker>
              <AppRoutes user={user} />
            </DailyDrillBlocker>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
