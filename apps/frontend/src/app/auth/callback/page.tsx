'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { setTokens } from '@/lib/auth';
import { authApi } from '@/lib/api';

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (!accessToken || !refreshToken) {
      router.replace('/login');
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    authApi
      .me()
      .then((user) => {
        setTokens({ accessToken, refreshToken, user });
        router.replace('/dashboard');
      })
      .catch(() => {
        router.replace('/login');
      });
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        <span className="text-gray-500 text-lg">Signing you in...</span>
      </div>
    </div>
  );
}
