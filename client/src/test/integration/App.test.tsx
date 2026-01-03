import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../App'

// Mock Zustand store
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

// Import the mocked function
import { useAuthStore } from '../../store/authStore'

// Mock all the components and hooks
vi.mock('../../components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}))

vi.mock('../../pages/Dashboard', () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}))

vi.mock('../../pages/Training', () => ({
  default: () => <div data-testid="training">Training</div>,
}))

vi.mock('../../pages/Lab', () => ({
  default: () => <div data-testid="lab">Lab</div>,
}))

vi.mock('../../pages/Login', () => ({
  default: () => <div data-testid="login">Login</div>,
}))

vi.mock('../../pages/Register', () => ({
  default: () => <div data-testid="register">Register</div>,
}))

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { uid: 'test-user' },
    firebaseUser: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    initAuth: vi.fn(),
  })),
}))

describe('App Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main application structure', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should render navbar
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })

  it('shows loading state when auth is loading', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('redirects to login when no user is authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByTestId('login')).toBeInTheDocument()
  })

  it('shows authenticated routes when user is logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: 'test-user' },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should show dashboard by default
    expect(screen.getByTestId('dashboard')).toBeInTheDocument()
  })

  it('renders training routes correctly', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: 'test-user' },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    })

    // Mock window.location to simulate routing
    Object.defineProperty(window, 'location', {
      value: { pathname: '/training' },
      writable: true,
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByTestId('training')).toBeInTheDocument()
  })

  it('renders lab routes correctly', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: 'test-user' },
      loading: false,
    })

    // Mock window.location to simulate routing
    Object.defineProperty(window, 'location', {
      value: { pathname: '/lab/w1-lab1' },
      writable: true,
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByTestId('lab')).toBeInTheDocument()
  })

  it('includes ContentGate for protected routes', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: 'test-user' },
      loading: false,
    })

    // Mock ContentGate
    vi.mock('../../components/ContentGate', () => ({
      default: ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="content-gate">
          <div data-testid="gate-protected">Gate Protected</div>
          {children}
        </div>
      ),
    }))

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    expect(screen.getByTestId('content-gate')).toBeInTheDocument()
  })

  it('handles unknown routes gracefully', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: 'test-user' },
      loading: false,
    })

    // Mock window.location for unknown route
    Object.defineProperty(window, 'location', {
      value: { pathname: '/unknown-route' },
      writable: true,
    })

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Should still render the app structure
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })
})