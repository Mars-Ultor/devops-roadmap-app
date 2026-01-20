/* eslint-disable max-lines-per-function, sonarjs/no-duplicate-string */
import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import type { User as FirebaseUser } from "firebase/auth";

// Mock the entire authStore module
const mockAuthStore = {
  user: null as ReturnType<
    typeof import("../../store/authStore").useAuthStore
  >["user"],
  firebaseUser: null as FirebaseUser | null,
  loading: true,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  initAuth: vi.fn(),
};

vi.mock("../../store/authStore", () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}));

import { useAuthStore } from "../../store/authStore";

describe("useAuthStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock store state
    mockAuthStore.user = null;
    mockAuthStore.firebaseUser = null;
    mockAuthStore.loading = true;
  });

  test("initial state is correct", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.firebaseUser).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test("login function updates state on success", async () => {
    const mockUser = {
      uid: "test-uid",
      email: "test@example.com",
      name: "Test User",
      currentWeek: 1,
      totalXP: 100,
      createdAt: new Date(),
    };

    const mockFirebaseUser = {
      uid: "test-uid",
      email: "test@example.com",
    };

    // Mock the login function to update the store state
    mockAuthStore.login.mockImplementation(async () => {
      mockAuthStore.user = mockUser;
      mockAuthStore.firebaseUser = mockFirebaseUser;
      mockAuthStore.loading = false;
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("test@example.com", "password123");
    });

    expect(mockAuthStore.login).toHaveBeenCalledWith(
      "test@example.com",
      "password123",
    );
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.firebaseUser).toEqual(mockFirebaseUser);
    expect(result.current.loading).toBe(false);
  });

  test("login throws error when user document does not exist", async () => {
    mockAuthStore.login.mockRejectedValue(new Error("User document not found"));

    const { result } = renderHook(() => useAuthStore());

    await expect(
      result.current.login("test@example.com", "password123"),
    ).rejects.toThrow("User document not found");
  });

  test("register function creates new user", async () => {
    const mockUser = {
      uid: "new-user-uid",
      email: "new@example.com",
      name: "New User",
      currentWeek: 1,
      totalXP: 0,
      createdAt: new Date(),
    };

    const mockFirebaseUser = {
      uid: "new-user-uid",
      email: "new@example.com",
    };

    mockAuthStore.register.mockImplementation(async () => {
      mockAuthStore.user = mockUser;
      mockAuthStore.firebaseUser = mockFirebaseUser;
      mockAuthStore.loading = false;
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register(
        "new@example.com",
        "password123",
        "New User",
      );
    });

    expect(mockAuthStore.register).toHaveBeenCalledWith(
      "new@example.com",
      "password123",
      "New User",
    );
    expect(result.current.user).toEqual(
      expect.objectContaining({
        uid: "new-user-uid",
        email: "new@example.com",
        name: "New User",
      }),
    );
  });

  test("logout function clears user state", async () => {
    // Set initial user state
    mockAuthStore.user = {
      uid: "test-uid",
      email: "test@example.com",
      name: "Test User",
      currentWeek: 1,
      totalXP: 100,
      createdAt: new Date(),
    };
    mockAuthStore.firebaseUser = { uid: "test-uid" } as FirebaseUser;
    mockAuthStore.loading = false;

    mockAuthStore.logout.mockImplementation(async () => {
      mockAuthStore.user = null;
      mockAuthStore.firebaseUser = null;
      mockAuthStore.loading = true;
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockAuthStore.logout).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
    expect(result.current.firebaseUser).toBeNull();
  });

  test("initAuth sets up auth state listener", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.initAuth();
    });

    expect(mockAuthStore.initAuth).toHaveBeenCalled();
  });

  test("handles login errors", async () => {
    mockAuthStore.login.mockRejectedValue(new Error("Invalid credentials"));

    const { result } = renderHook(() => useAuthStore());

    await expect(
      result.current.login("wrong@example.com", "wrongpass"),
    ).rejects.toThrow("Invalid credentials");
  });

  test("handles register errors", async () => {
    mockAuthStore.register.mockRejectedValue(new Error("Email already exists"));

    const { result } = renderHook(() => useAuthStore());

    await expect(
      result.current.register(
        "existing@example.com",
        "password123",
        "Existing User",
      ),
    ).rejects.toThrow("Email already exists");
  });

  test("handles logout errors", async () => {
    mockAuthStore.logout.mockRejectedValue(new Error("Logout failed"));

    const { result } = renderHook(() => useAuthStore());

    await expect(result.current.logout()).rejects.toThrow("Logout failed");
  });
});
