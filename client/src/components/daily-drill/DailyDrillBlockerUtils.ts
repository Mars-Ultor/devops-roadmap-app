/**
 * Daily Drill Blocker Utilities and Constants
 * Separated to avoid Fast Refresh violations
 */

// Routes that bypass the daily drill blocker
export const EXEMPT_ROUTES = [
  '/daily-drill',
  '/battle-drill',
  '/achievements',
  '/settings',
  '/help',
  '/'
];

// Check if current path is exempt from drill requirement
export function isExemptRoute(pathname: string): boolean {
  return EXEMPT_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`));
}
