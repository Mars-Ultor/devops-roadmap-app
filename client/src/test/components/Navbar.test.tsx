import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  currentWeek: 1,
  totalXP: 100,
  createdAt: new Date(),
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderNavbar = () => {
    return render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  };

  describe('when user is not logged in', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: null,
        logout: vi.fn(),
      });
    });

    test('renders the navbar with correct branding', () => {
      renderNavbar();

      expect(screen.getByText('DevOps Training')).toBeInTheDocument();
      expect(screen.getByText('DevOps')).toBeInTheDocument(); // Mobile version
    });

    test('shows login link when no user', () => {
      renderNavbar();

      expect(screen.getByText('Login')).toBeInTheDocument();
    });
  });

  describe('when user is logged in', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: mockUser,
        logout: vi.fn(),
      });
    });

    test('renders navigation links for authenticated user', () => {
      renderNavbar();

      expect(screen.getByText('Training')).toBeInTheDocument();
      expect(screen.getByText('Battle Drills')).toBeInTheDocument();
      expect(screen.getByText('Failure Log')).toBeInTheDocument();
      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    test('shows user name in navbar', () => {
      renderNavbar();

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('logout button calls logout and navigates to login', async () => {
      const mockLogout = vi.fn();
      (useAuthStore as any).mockReturnValue({
        user: mockUser,
        logout: mockLogout,
      });

      renderNavbar();

      const logoutButton = screen.getByRole('button', { name: /logout/i });
      fireEvent.click(logoutButton);

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('mobile menu functionality', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: mockUser,
        logout: vi.fn(),
      });
    });

    test('mobile menu button is visible on small screens', () => {
      renderNavbar();

      const menuButton = screen.getByRole('button', { name: /open main menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    test('mobile menu opens and closes', () => {
      renderNavbar();

      const menuButton = screen.getByRole('button', { name: /open main menu/i });

      // Menu should be closed initially
      expect(screen.queryByText('Training')).not.toBeVisible();

      // Open menu
      fireEvent.click(menuButton);

      // Menu should be open
      expect(screen.getByText('Training')).toBeVisible();

      // Close menu
      const closeButton = screen.getByRole('button', { name: /close menu/i });
      fireEvent.click(closeButton);

      // Menu should be closed
      expect(screen.queryByText('Training')).not.toBeVisible();
    });

    test('clicking mobile menu link closes the menu', () => {
      renderNavbar();

      const menuButton = screen.getByRole('button', { name: /open main menu/i });
      fireEvent.click(menuButton);

      const trainingLink = screen.getByText('Training');
      fireEvent.click(trainingLink);

      // Menu should close after clicking link
      expect(screen.queryByText('Training')).not.toBeVisible();
    });
  });

  describe('navigation links', () => {
    beforeEach(() => {
      (useAuthStore as any).mockReturnValue({
        user: mockUser,
        logout: vi.fn(),
      });
    });

    test('dashboard link has correct href', () => {
      renderNavbar();

      const dashboardLink = screen.getByRole('link', { name: /devops training/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    });

    test('training link has correct href', () => {
      renderNavbar();

      const trainingLink = screen.getByText('Training');
      expect(trainingLink.closest('a')).toHaveAttribute('href', '/training');
    });

    test('battle drills link has correct href', () => {
      renderNavbar();

      const battleDrillsLink = screen.getByText('Battle Drills');
      expect(battleDrillsLink.closest('a')).toHaveAttribute('href', '/battle-drills');
    });
  });
});