import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import type { ReactNode } from 'react';

/**
 * Global mock for AuthContext.
 * All tests get a "logged in" user by default so AppStateProvider works.
 */
vi.mock('../src/auth/AuthContext', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    session: null,
    loading: false,
    signUp: vi.fn().mockResolvedValue({ error: null, session: null }),
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signOut: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('../src/storage/cloudSync', () => ({
  loadCloudSave: vi.fn().mockResolvedValue(null),
  saveCloudData: vi.fn().mockResolvedValue(true),
  clearCloudSave: vi.fn().mockResolvedValue(undefined),
}));
