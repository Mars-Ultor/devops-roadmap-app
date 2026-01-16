/**
 * Navbar Sub-Components
 * Extracted from Navbar.tsx for ESLint compliance
 */

import { Link } from 'react-router-dom';
import { NAV_LINKS, type NavLink } from './navbarData';

// Desktop Nav Link Component
interface DesktopNavLinkProps {
  link: NavLink;
}

export function DesktopNavLink({ link }: DesktopNavLinkProps) {
  const Icon = link.icon;
  return (
    <Link to={link.to}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white">
      <Icon className="w-4 h-4 mr-2" />
      {link.label}
    </Link>
  );
}

// Mobile Nav Link Component
interface MobileNavLinkProps {
  link: NavLink;
  onClick: () => void;
}

export function MobileNavLink({ link, onClick }: MobileNavLinkProps) {
  const Icon = link.icon;
  return (
    <Link to={link.to}
      className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
      onClick={onClick}>
      <Icon className="w-5 h-5 mr-3" />
      {link.label}
    </Link>
  );
}

// User Stats Component
interface UserStatsProps {
  currentWeek?: number;
  totalXP?: number;
  className?: string;
}

export function UserStats({ currentWeek, totalXP, className = '' }: UserStatsProps) {
  return (
    <div className={`text-sm ${className}`}>
      <span className="text-gray-400">Week {currentWeek}/12</span>
      <span className="ml-4 text-indigo-400 font-semibold">{totalXP} XP</span>
    </div>
  );
}

// Mobile Navigation Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek?: number;
  totalXP?: number;
}

export function MobileNavMenu({ isOpen, onClose, currentWeek, totalXP }: MobileMenuProps) {
  if (!isOpen) return null;
  
  return (
    <div className="md:hidden border-t border-slate-700">
      <div className="px-2 pt-2 pb-3 space-y-1">
        {NAV_LINKS.map((link) => (
          <MobileNavLink key={link.to} link={link} onClick={onClose} />
        ))}
      </div>
      <div className="px-3 py-2 border-t border-slate-700 sm:hidden">
        <UserStats currentWeek={currentWeek} totalXP={totalXP} />
      </div>
    </div>
  );
}
