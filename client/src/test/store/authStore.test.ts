import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the entire authStore module
const mockAuthStore = {
  user: null,
  firebaseUser: null,
  loading: true,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  initAuth: vi.fn(),
};

vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(() => mockAuthStore),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock store state
    mockAuthStore.user = null;
    mockAuthStore.firebaseUser = null;
    mockAuthStore.loading = true;
  });

  test('initial state is correct', () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.user).toBeNull();
    expect(result.current.firebaseUser).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test('login function updates state on success', async () => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      name: 'Test User',
      currentWeek: 1,
      totalXP: 100,
      createdAt: new Date(),
    };

    const mockFirebaseUser = {
      uid: 'test-uid',
      email: 'test@example.com',
    };

    // Mock the login function to update the store state
    mockAuthStore.login.mockImplementation(async () => {
      mockAuthStore.user = mockUser;
      mockAuthStore.firebaseUser = mockFirebaseUser;
      mockAuthStore.loading = false;
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(mockAuthStore.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.firebaseUser).toEqual(mockFirebaseUser);
    expect(result.current.loading).toBe(false);
  });

  test('login throws error when user document does not exist', async () => {
    mockAuthStore.login.mockRejectedValue(new Error('User document not found'));

    const { result } = renderHook(() => useAuthStore());

    await expect(result.current.login('test@example.com', 'password123'))
      .rejects.toThrow('User document not found');
  });

  test('register function creates new user', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const { setDoc } = await import('firebase/firestore');

    const mockFirebaseUser = {
      uid: 'new-user-uid',
      email: 'new@example.com',
    };

    (createUserWithEmailAndPassword as any).mockResolvedValue({
      user: mockFirebaseUser,
    });

    (setDoc as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.register('new@example.com', 'password123', 'New User');
    });

    expect(setDoc).toHaveBeenCalledWith(
      expect.any(Object), // doc reference
      expect.objectContaining({
        uid: 'new-user-uid',
        email: 'new@example.com',
        name: 'New User',
        currentWeek: 1,
        totalXP: 0,
        createdAt: expect.any(Date),
      })
    );

    expect(result.current.user).toEqual(
      expect.objectContaining({
        uid: 'new-user-uid',
        email: 'new@example.com',
        name: 'New User',
      })
    );
  });

  test('logout function clears user state', async () => {
    const { signOut } = await import('firebase/auth');

    (signOut as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useAuthStore());

    // First set a user
    act(() => {
      result.current.user = {
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User',
        currentWeek: 1,
        totalXP: 100,
        createdAt: new Date(),
      };
      result.current.firebaseUser = { uid: 'test-uid' } as any;
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.firebaseUser).toBeNull();
    expect(signOut).toHaveBeenCalled();
  });

  test('initAuth sets up auth state listener', () => {
    const { onAuthStateChanged } = require('firebase/auth');

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.initAuth();
    });

    expect(onAuthStateChanged).toHaveBeenCalled();
  });

  test('handles login errors', async () => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');

    (signInWithEmailAndPassword as any).mockRejectedValue(new Error('Invalid credentials'));

    const { result } = renderHook(() => useAuthStore());

    await expect(result.current.login('wrong@example.com', 'wrongpass'))
      .rejects.toThrow('Invalid credentials');
  });

  test('handles register errors', async () => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    (createUserWithEmailAndPassword as any).mockRejectedValue(new Error('Email already exists'));

    const { result } = renderHook(() => useAuthStore());

    await expect(result.current.register('existing@example.com', 'password123', 'Existing User'))
      .rejects.toThrow('Email already exists');
  });

  test('handles logout errors', async () => {
    const { signOut } = await import('firebase/auth');

    (signOut as any).mockRejectedValue(new Error('Logout failed'));

    const { result } = renderHook(() => useAuthStore());

    await expect(result.current.logout())
      .rejects.toThrow('Logout failed');
  });
});