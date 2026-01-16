/**
 * Navbar Data
 * Navigation link configuration
 */

import { BookOpen, Target, BarChart3, FileText, Settings as SettingsIcon, Book, Brain, Award, type LucideIcon } from 'lucide-react';

// Navigation link data
export interface NavLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_LINKS: NavLink[] = [
  { to: '/training', label: 'Training', icon: BookOpen },
  { to: '/battle-drills', label: 'Battle Drills', icon: Target },
  { to: '/failure-log', label: 'Failure Log', icon: FileText },
  { to: '/aar', label: 'AAR', icon: Book },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/ai-coaching', label: 'AI Coaching', icon: Brain },
  { to: '/recertification', label: 'Recertification', icon: Award },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];
