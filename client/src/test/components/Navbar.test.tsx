import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../store/authStore';

// Mock the auth store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Flame: () => <div data-testid="flame-icon" />,
  BookOpen: () => <div data-testid="book-open-icon" />,
  Target: () => <div data-testid="target-icon" />,
  LogOut: () => <div data-testid="logout-icon" />,
  BarChart3: () => <div data-testid="bar-chart-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Settings: () => <div data-testid="settings-icon" />,
  Book: () => <div data-testid="book-icon" />,
  Award: () => <div data-testid="award-icon" />,
  Menu: () => <div data-testid="menu-icon" />,
  X: () => <div data-testid="x-icon" />,
  Brain: () => <div data-testid="brain-icon" />,
}));

// Mock react-router-dom's useNavigate
let mockNavigate = vi.fn();
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
      expect(screen.getByText('AAR')).toBeInTheDocument();
      expect(screen.getByText('Analytics')).toBeInTheDocument();
      expect(screen.getByText('AI Coaching')).toBeInTheDocument();
      expect(screen.getByText('Recertification')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('logout button calls logout and navigates to login', async () => {
      mockNavigate = vi.fn(); // Reset mock for this test
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

      // The mobile menu button should exist but doesn't have specific ARIA labels
      const menuButton = screen.getByTestId('menu-icon').closest('button');
      expect(menuButton).toBeInTheDocument();
    });

    test('mobile menu opens and closes', () => {
      renderNavbar();

      // Initially, mobile menu should not be visible (no mobile menu container)
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();

      // Open menu
      const menuButton = screen.getByTestId('menu-icon').closest('button');
      fireEvent.click(menuButton!);

      // Menu should be open - close icon should be visible
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();

      // Close menu
      const closeButton = screen.getByTestId('x-icon').closest('button');
      fireEvent.click(closeButton!);

      // Menu should be closed
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
    });

    test('clicking mobile menu link closes the menu', () => {
      renderNavbar();

      const menuButton = screen.getByTestId('menu-icon').closest('button');
      fireEvent.click(menuButton!);

      // Find the mobile menu training link (should be the one in the mobile menu section)
      const mobileMenuTrainingLink = screen.getAllByText('Training').find(link => 
        link.closest('a')?.parentElement?.className.includes('px-2')
      );
      
      expect(mobileMenuTrainingLink).toBeInTheDocument();
      fireEvent.click(mobileMenuTrainingLink!);

      // Menu should close after clicking link
      expect(screen.queryByTestId('x-icon')).not.toBeInTheDocument();
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

      const dashboardLink = screen.getByText('DevOps Training');
      expect(dashboardLink.closest('a')).toHaveAttribute('href', '/dashboard');
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