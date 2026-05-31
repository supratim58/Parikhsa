'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

export default function Page() {
  const router = useRouter();
  const { userRole, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (userRole) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [userRole, isLoading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Loading...</p>
    </main>
  );
}
