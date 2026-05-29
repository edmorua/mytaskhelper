'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authApi } from '@/lib/api';
import { setTokens, clearTokens, getStoredUser, isAuthenticated } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setLoading(false);
      } else {
        authApi
          .me()
          .then((u) => {
            setUser(u);
            localStorage.setItem('user', JSON.stringify(u));
          })
          .catch(() => {
            clearTokens();
            router.push('/login');
          })
          .finally(() => setLoading(false));
      }
    } else {
      setLoading(false);
    }
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const tokens = await authApi.login({ email, password });
      setTokens(tokens);
      setUser(tokens.user);
      router.push('/dashboard');
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearTokens();
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const updateUser = useCallback((updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updated };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  return { user, loading, login, logout, updateUser };
}
