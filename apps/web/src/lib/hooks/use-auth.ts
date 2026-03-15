'use client';

import { useCallback } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import type { RegisterDto } from '@diamond-factory/types';

export function useAuth() {
  const {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    refreshToken: storeRefresh,
    setUser,
  } = useAuthStore();

  const login = useCallback(
    async (email: string, password: string) => {
      await storeLogin(email, password);
    },
    [storeLogin]
  );

  const register = useCallback(
    async (dto: RegisterDto) => {
      await storeRegister(dto);
    },
    [storeRegister]
  );

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const refreshToken = useCallback(async () => {
    await storeRefresh();
  }, [storeRefresh]);

  return {
    user,
    accessToken,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    refreshToken,
    setUser,
  };
}
