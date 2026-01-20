/**
 * Route configuration for the application
 * Extracts route definitions from App.tsx to reduce complexity
 */

import { lazy } from "react";
import ContentGate from "../components/training/ContentGate";

// Lazy load pages for code-splitting
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Training = lazy(() => import("../pages/Training"));
const Week = lazy(() => import("../pages/Week"));
const MasteryLesson = lazy(() => import("../pages/MasteryLesson"));
const Lab = lazy(() => import("../pages/Lab"));
const QuizPage = lazy(() => import("../pages/QuizPage"));
const Resources = lazy(() => import("../pages/Resources"));
const Analytics = lazy(() => import("../pages/Analytics"));
const DiagnosticQuiz = lazy(() => import("../pages/DiagnosticQuiz"));
const LearningSettings = lazy(() => import("../pages/LearningSettings"));
const WeekProject = lazy(() => import("../pages/WeekProject"));
const WeekAssessment = lazy(() => import("../pages/WeekAssessment"));
const BattleDrills = lazy(() => import("../pages/BattleDrills"));
const BattleDrillSession = lazy(() => import("../pages/BattleDrillSession"));
const FailureLog = lazy(() => import("../pages/FailureLog"));
const FailureReview = lazy(() => import("../pages/FailureReview"));
const StressTraining = lazy(() => import("../pages/StressTraining"));
const ProductionScenarios = lazy(() => import("../pages/ProductionScenarios"));
const ScenarioExecution = lazy(() => import("../pages/ScenarioExecution"));
const TokenManagement = lazy(() => import("../pages/TokenManagement"));
const AccountabilityDashboard = lazy(
  () => import("../pages/AccountabilityDashboard"),
);
const AdaptiveDifficultyDashboard = lazy(
  () => import("../pages/AdaptiveDifficultyDashboard"),
);
const AAR = lazy(() => import("../pages/AAR"));
const Settings = lazy(() => import("../pages/Settings"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Projects = lazy(() => import("../pages/Projects"));
const AICoaching = lazy(() => import("../pages/AICoaching"));
const RecertificationDashboard = lazy(
  () => import("../pages/RecertificationDashboard"),
);

/** Route configuration interface */
interface RouteConfig {
  readonly path: string;
  readonly element: React.ReactNode;
  readonly requiresAuth: boolean;
  readonly guestOnly?: boolean;
}

/** Public routes accessible without authentication */
export const publicRoutes: readonly RouteConfig[] = [
  { path: "/login", element: <Login />, requiresAuth: false, guestOnly: true },
  {
    path: "/register",
    element: <Register />,
    requiresAuth: false,
    guestOnly: true,
  },
] as const;

/** Protected routes requiring authentication */
export const protectedRoutes: readonly RouteConfig[] = [
  { path: "/dashboard", element: <Dashboard />, requiresAuth: true },
  { path: "/diagnostic", element: <DiagnosticQuiz />, requiresAuth: true },
  {
    path: "/learning-settings",
    element: <LearningSettings />,
    requiresAuth: true,
  },
  { path: "/training", element: <Training />, requiresAuth: true },
  { path: "/week/:weekNumber", element: <Week />, requiresAuth: true },
  {
    path: "/week/:weekNumber/project",
    element: (
      <ContentGate contentType="general">
        <WeekProject />
      </ContentGate>
    ),
    requiresAuth: true,
  },
  {
    path: "/week/:weekNumber/assessment",
    element: (
      <ContentGate contentType="general">
        <WeekAssessment />
      </ContentGate>
    ),
    requiresAuth: true,
  },
  {
    path: "/lesson/:lessonId/:level",
    element: (
      <ContentGate contentType="lesson">
        <MasteryLesson />
      </ContentGate>
    ),
    requiresAuth: true,
  },
  {
    path: "/quiz/:quizId",
    element: (
      <ContentGate contentType="quiz">
        <QuizPage />
      </ContentGate>
    ),
    requiresAuth: true,
  },
  {
    path: "/lab/:labId",
    element: (
      <ContentGate contentType="lab">
        <Lab />
      </ContentGate>
    ),
    requiresAuth: true,
  },
  { path: "/battle-drills", element: <BattleDrills />, requiresAuth: true },
  {
    path: "/battle-drill/:drillId",
    element: <BattleDrillSession />,
    requiresAuth: true,
  },
  { path: "/failure-log", element: <FailureLog />, requiresAuth: true },
  { path: "/failure-review", element: <FailureReview />, requiresAuth: true },
  { path: "/aar", element: <AAR />, requiresAuth: true },
  { path: "/analytics", element: <Analytics />, requiresAuth: true },
  { path: "/settings", element: <Settings />, requiresAuth: true },
  { path: "/resources", element: <Resources />, requiresAuth: true },
  { path: "/projects", element: <Projects />, requiresAuth: true },
  { path: "/tokens", element: <TokenManagement />, requiresAuth: true },
  {
    path: "/accountability",
    element: <AccountabilityDashboard />,
    requiresAuth: true,
  },
  {
    path: "/difficulty",
    element: <AdaptiveDifficultyDashboard />,
    requiresAuth: true,
  },
  { path: "/stress-training", element: <StressTraining />, requiresAuth: true },
  { path: "/scenarios", element: <ProductionScenarios />, requiresAuth: true },
  {
    path: "/scenario/:scenarioId",
    element: <ScenarioExecution />,
    requiresAuth: true,
  },
  { path: "/ai-coaching", element: <AICoaching />, requiresAuth: true },
  {
    path: "/recertification",
    element: <RecertificationDashboard />,
    requiresAuth: true,
  },
] as const;

/** Redirect routes */
export const redirectRoutes = [
  { path: "/curriculum", to: "/training" },
] as const;
