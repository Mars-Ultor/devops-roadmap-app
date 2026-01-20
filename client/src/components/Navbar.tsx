/**
 * Navbar Component
 * Main navigation for the application
 */

import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Flame, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import {
  DesktopNavLink,
  MobileNavMenu,
  UserStats,
} from "./navbar/NavbarComponents";
import { NAV_LINKS } from "./navbar/navbarData";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="text-xl font-bold text-indigo-400 flex items-center"
              onClick={closeMobileMenu}
            >
              <Flame className="w-6 h-6 mr-2" />
              <span className="hidden sm:block">DevOps Training</span>
              <span className="sm:hidden">DevOps</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink key={link.to} link={link} />
            ))}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            <UserStats
              currentWeek={user?.currentWeek}
              totalXP={user?.totalXP}
              className="hidden sm:block"
            />
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:block">Logout</span>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-slate-700 hover:text-white"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open main menu"}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          currentWeek={user?.currentWeek}
          totalXP={user?.totalXP}
        />
      </div>
    </nav>
  );
}
