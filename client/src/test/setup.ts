import '@testing-library/jest-dom'
import React from 'react'
import { vi } from 'vitest'

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {},
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  increment: vi.fn(),
}))

// Mock Zustand stores
vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: null,
    loading: false,
    signIn: vi.fn(),
    signOut: vi.fn(),
  })),
}))

// Mock React Router
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(() => ({})),
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({ pathname: '/', search: '' })),
  Link: vi.fn().mockImplementation(({ children, ...props }) => React.createElement('a', props, children)),
  BrowserRouter: vi.fn().mockImplementation(({ children }) => React.createElement('div', {}, children)),
  Routes: vi.fn().mockImplementation(({ children }) => React.createElement('div', {}, children)),
  Route: vi.fn().mockImplementation(({ children }) => React.createElement('div', {}, children)),
  Navigate: vi.fn().mockImplementation(({ to }) => React.createElement('div', { 'data-testid': 'navigate', 'data-to': to })),
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  CheckCircle: () => React.createElement('div', { 'data-testid': 'check-circle' }),
  CheckCircle2: () => React.createElement('div', { 'data-testid': 'check-circle-2' }),
  XCircle: () => React.createElement('div', { 'data-testid': 'x-circle' }),
  AlertTriangle: () => React.createElement('div', { 'data-testid': 'alert-triangle' }),
  AlertCircle: () => React.createElement('div', { 'data-testid': 'alert-circle' }),
  Clock: () => React.createElement('div', { 'data-testid': 'clock' }),
  Lock: () => React.createElement('div', { 'data-testid': 'lock' }),
  Unlock: () => React.createElement('div', { 'data-testid': 'unlock' }),
  Lightbulb: () => React.createElement('div', { 'data-testid': 'lightbulb' }),
  Target: () => React.createElement('div', { 'data-testid': 'target' }),
  Trophy: () => React.createElement('div', { 'data-testid': 'trophy' }),
  BookOpen: () => React.createElement('div', { 'data-testid': 'book-open' }),
  Terminal: () => React.createElement('div', { 'data-testid': 'terminal' }),
  Calendar: () => React.createElement('div', { 'data-testid': 'calendar' }),
  FileText: () => React.createElement('div', { 'data-testid': 'file-text' }),
  ChevronDown: () => React.createElement('div', { 'data-testid': 'chevron-down' }),
  ChevronRight: () => React.createElement('div', { 'data-testid': 'chevron-right' }),
  Plus: () => React.createElement('div', { 'data-testid': 'plus' }),
  Minus: () => React.createElement('div', { 'data-testid': 'minus' }),
  Circle: () => React.createElement('div', { 'data-testid': 'circle' }),
  CircleCheck: () => React.createElement('div', { 'data-testid': 'circle-check' }),
  TrendingUp: () => React.createElement('div', { 'data-testid': 'trending-up' }),
  TrendingDown: () => React.createElement('div', { 'data-testid': 'trending-down' }),
  Play: () => React.createElement('div', { 'data-testid': 'play' }),
  RotateCcw: () => React.createElement('div', { 'data-testid': 'rotate-ccw' }),
  Activity: () => React.createElement('div', { 'data-testid': 'activity' }),
  CircleAlert: () => React.createElement('div', { 'data-testid': 'circle-alert' }),
  Funnel: () => React.createElement('div', { 'data-testid': 'funnel' }),
  ExternalLink: () => React.createElement('div', { 'data-testid': 'external-link' }),
  Shield: () => React.createElement('div', { 'data-testid': 'shield' }),
  Award: () => React.createElement('div', { 'data-testid': 'award' }),
  Brain: () => React.createElement('div', { 'data-testid': 'brain' }),
  RefreshCw: () => React.createElement('div', { 'data-testid': 'refresh-cw' }),
  Trash2: () => React.createElement('div', { 'data-testid': 'trash-2' }),
  Rocket: () => React.createElement('div', { 'data-testid': 'rocket' }),
  Search: () => React.createElement('div', { 'data-testid': 'search' }),
  ArrowRight: () => React.createElement('div', { 'data-testid': 'arrow-right' }),
  ArrowLeft: () => React.createElement('div', { 'data-testid': 'arrow-left' }),
  CircleCheckBig: () => React.createElement('div', { 'data-testid': 'circle-check-big' }),
  CircleX: () => React.createElement('div', { 'data-testid': 'circle-x' }),
  LockOpen: () => React.createElement('div', { 'data-testid': 'lock-open' }),
  Users: () => React.createElement('div', { 'data-testid': 'users' }),
}))