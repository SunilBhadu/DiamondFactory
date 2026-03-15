import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, RegisterDto } from '@diamond-factory/types';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setTokens: (accessToken) => set({ accessToken }),

      setLoading: (isLoading) => set({ isLoading }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await res.json();
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (dto: RegisterDto) => {
        set({ isLoading: true });
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(dto),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Registration failed');
          }

          const data = await res.json();
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
          });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        const token = get().accessToken;
        // Fire and forget logout request
        if (token) {
          fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }).catch(() => {});
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      refreshToken: async () => {
        try {
          const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
          });

          if (res.ok) {
            const data = await res.json();
            set({ accessToken: data.accessToken });
          } else {
            get().logout();
          }
        } catch {
          get().logout();
        }
      },

      initialize: async () => {
        const { user, accessToken, refreshToken } = get();
        if (user && !accessToken) {
          await refreshToken();
        }
      },
    }),
    {
      name: 'diamond-factory-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // Do NOT persist accessToken for security
      }),
    }
  )
);
