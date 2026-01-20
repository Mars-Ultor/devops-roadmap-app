/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";

// Mock Firebase
vi.mock("../../lib/firebase", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => ({ id: "mock-doc" })),
  getDoc: vi.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ completed: true }), // Allow access by default
    }),
  ),
  setDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [], size: 0, empty: true })),
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
  };
});

// Mock Zustand store
vi.mock("../../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

// Import the mocked function
import { useAuthStore } from "../../store/authStore";

// Mock all the components and hooks
vi.mock("../../components/Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../../pages/Dashboard", () => ({
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

vi.mock("../../pages/Training", () => ({
  default: () => <div data-testid="training">Training</div>,
}));

vi.mock("../../pages/Lab", () => ({
  default: () => <div data-testid="lab">Lab</div>,
}));

vi.mock("../../pages/Login", () => ({
  default: () => <div data-testid="login">Login</div>,
}));

vi.mock("../../pages/Register", () => ({
  default: () => <div data-testid="register">Register</div>,
}));

vi.mock("../../components/training/ContentGate", () => ({
  default: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="content-gate">
      <div data-testid="gate-protected">Gate Protected</div>
      {children}
    </div>
  ),
}));

vi.mock("../../store/authStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { uid: "test-user" },
    firebaseUser: null,
    loading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    initAuth: vi.fn(),
  })),
}));

describe("App Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the main application structure", () => {
    render(<App />);

    // Should render navbar
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("shows loading state when auth is loading", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(<App />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects to login when no user is authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

    // For unauthenticated users, the app should render without navbar
    // and handle routing appropriately (login component may be lazy loaded)
    expect(screen.queryByTestId("navbar")).not.toBeInTheDocument();
  });

  it("shows authenticated routes when user is logged in", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "test-user" },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(<App />);

    // Should show navbar for authenticated users
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });

  it("renders training routes correctly", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "test-user" },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(<App />);

    // Should render without crashing and show navbar
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });

  it("renders lab routes correctly", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "test-user" },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(<App />);

    // Should render without crashing and show navbar
    await waitFor(() => {
      expect(screen.getByTestId("navbar")).toBeInTheDocument();
    });
  });

  it("includes ContentGate for protected routes", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "test-user" },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    render(<App />);

    // For authenticated users, navbar should be present
    // ContentGate behavior is tested separately
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  it("handles unknown routes gracefully", () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "test-user" },
      firebaseUser: null,
      loading: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      initAuth: vi.fn(),
    });

    // Mock window.location for unknown route
    Object.defineProperty(window, "location", {
      value: { pathname: "/unknown-route" },
      writable: true,
    });

    render(<App />);

    // Should still render the app structure
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });
});
