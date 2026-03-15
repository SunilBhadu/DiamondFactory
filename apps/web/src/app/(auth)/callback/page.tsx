'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshToken, setUser } = useAuthStore();

  useEffect(() => {
    const success = searchParams.get('success');
    if (success !== 'true') {
      router.replace('/login?reason=oauth-failed');
      return;
    }

    refreshToken()
      .then(async () => {
        const token = useAuthStore.getState().accessToken;
        if (!token) throw new Error('No token');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/auth/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error('Failed to fetch user');
        const user = await res.json();
        setUser(user);
        router.replace('/dashboard');
      })
      .catch(() => router.replace('/login?reason=oauth-failed'));
  }, [searchParams, router, refreshToken, setUser]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-gold-500 mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-charcoal-600 text-sm">Completing sign in…</p>
      </div>
    </div>
  );
}
