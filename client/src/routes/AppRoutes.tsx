/**
 * Application Routes Component
 * Renders all application routes based on route configuration
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, protectedRoutes, redirectRoutes } from './routeConfig';

interface AppRoutesProps {
  readonly user: unknown;
}

/** Renders a protected route that requires authentication */
function ProtectedRoute({ user, element }: { user: unknown; element: React.ReactNode }) {
  return user ? <>{element}</> : <Navigate to="/login" />;
}

/** Renders a guest-only route (redirects authenticated users) */
function GuestRoute({ user, element }: { user: unknown; element: React.ReactNode }) {
  return !user ? <>{element}</> : <Navigate to="/dashboard" />;
}

export default function AppRoutes({ user }: AppRoutesProps) {
  return (
    <Routes>
      {/* Public/Guest routes */}
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            route.guestOnly 
              ? <GuestRoute user={user} element={route.element} />
              : route.element
          }
        />
      ))}

      {/* Protected routes */}
      {protectedRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedRoute user={user} element={route.element} />}
        />
      ))}

      {/* Redirect routes */}
      {redirectRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<Navigate to={route.to} replace />}
        />
      ))}

      {/* Default route */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

