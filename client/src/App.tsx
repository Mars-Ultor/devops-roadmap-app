import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ContentGate from './components/training/ContentGate';
import DailyDrillBlocker from './components/DailyDrillBlocker';

// Lazy load pages for code-splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Training = lazy(() => import('./pages/Training'));
const Week = lazy(() => import('./pages/Week'));
const MasteryLesson = lazy(() => import('./pages/MasteryLesson'));
const Lab = lazy(() => import('./pages/Lab'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const Resources = lazy(() => import('./pages/Resources'));
const Analytics = lazy(() => import('./pages/Analytics'));
const DiagnosticQuiz = lazy(() => import('./pages/DiagnosticQuiz'));
const LearningSettings = lazy(() => import('./pages/LearningSettings'));
const WeekProject = lazy(() => import('./pages/WeekProject'));
const WeekAssessment = lazy(() => import('./pages/WeekAssessment'));
const BattleDrills = lazy(() => import('./pages/BattleDrills'));
const BattleDrillSession = lazy(() => import('./pages/BattleDrillSession'));
const FailureLog = lazy(() => import('./pages/FailureLog'));
const FailureReview = lazy(() => import('./pages/FailureReview'));
const StressTraining = lazy(() => import('./pages/StressTraining'));
const ProductionScenarios = lazy(() => import('./pages/ProductionScenarios'));
const ScenarioExecution = lazy(() => import('./pages/ScenarioExecution'));
const TokenManagement = lazy(() => import('./pages/TokenManagement'));
const AccountabilityDashboard = lazy(() => import('./pages/AccountabilityDashboard'));
const AdaptiveDifficultyDashboard = lazy(() => import('./pages/AdaptiveDifficultyDashboard'));
const AAR = lazy(() => import('./pages/AAR'));
const Settings = lazy(() => import('./pages/Settings'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Projects = lazy(() => import('./pages/Projects'));
const AICoaching = lazy(() => import('./pages/AICoaching'));
const RecertificationDashboard = lazy(() => import('./pages/RecertificationDashboard'));

function App() {
  const { user, loading, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white">
          {user && <Navbar />}
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading page...</p>
                </div>
              </div>
            }
          >
            <DailyDrillBlocker>
              <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/diagnostic" element={user ? <DiagnosticQuiz /> : <Navigate to="/login" />} />
              <Route path="/learning-settings" element={user ? <LearningSettings /> : <Navigate to="/login" />} />
              
              {/* Unified Training Hub - Consolidates all training content */}
              <Route path="/training" element={user ? <Training /> : <Navigate to="/login" />} />
              <Route path="/curriculum" element={<Navigate to="/training" replace />} />
              
              {/* Curriculum Sub-Routes (accessed from Training hub) */}
              <Route path="/week/:weekNumber" element={user ? <Week /> : <Navigate to="/login" />} />
              <Route path="/week/:weekNumber/project" element={user ? <ContentGate contentType="general"><WeekProject /></ContentGate> : <Navigate to="/login" />} />
              <Route path="/week/:weekNumber/assessment" element={user ? <ContentGate contentType="general"><WeekAssessment /></ContentGate> : <Navigate to="/login" />} />
              <Route path="/lesson/:lessonId/:level" element={user ? <ContentGate contentType="lesson"><MasteryLesson /></ContentGate> : <Navigate to="/login" />} />
              <Route path="/quiz/:quizId" element={user ? <ContentGate contentType="quiz"><QuizPage /></ContentGate> : <Navigate to="/login" />} />
              <Route path="/lab/:labId" element={user ? <ContentGate contentType="lab"><Lab /></ContentGate> : <Navigate to="/login" />} />
              
              {/* Redirect old training routes to unified hub - REMOVED: These routes are now consolidated */}
              
              {/* Core Features - 7 Main Navigation Items */}
              <Route path="/battle-drills" element={user ? <BattleDrills /> : <Navigate to="/login" />} />
              <Route path="/battle-drill/:drillId" element={user ? <BattleDrillSession /> : <Navigate to="/login" />} />
              <Route path="/failure-log" element={user ? <FailureLog /> : <Navigate to="/login" />} />
              <Route path="/failure-review" element={user ? <FailureReview /> : <Navigate to="/login" />} />
              <Route path="/aar" element={user ? <AAR /> : <Navigate to="/login" />} />
              <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
              <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
              
              {/* Supporting Pages */}
              <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
              <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
              <Route path="/tokens" element={user ? <TokenManagement /> : <Navigate to="/login" />} />
              <Route path="/accountability" element={user ? <AccountabilityDashboard /> : <Navigate to="/login" />} />
              <Route path="/difficulty" element={user ? <AdaptiveDifficultyDashboard /> : <Navigate to="/login" />} />
              <Route path="/stress-training" element={user ? <StressTraining /> : <Navigate to="/login" />} />
              <Route path="/scenarios" element={user ? <ProductionScenarios /> : <Navigate to="/login" />} />
              <Route path="/scenario/:scenarioId" element={user ? <ScenarioExecution /> : <Navigate to="/login" />} />
              <Route path="/ai-coaching" element={user ? <AICoaching /> : <Navigate to="/login" />} />
              <Route path="/recertification" element={user ? <RecertificationDashboard /> : <Navigate to="/login" />} />
              
              <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
            </DailyDrillBlocker>
          </Suspense>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
