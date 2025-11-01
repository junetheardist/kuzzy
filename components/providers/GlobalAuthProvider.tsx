'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

/**
 * GlobalAuthProvider
 * Provides application-wide authentication redirect
 * Automatically redirects to login page if user is not authenticated
 * 
 * Public Routes (no redirect needed):
 * - /login
 * - /register
 * - /verify-otp
 * - /resend-otp
 * - /forgot-password
 * - /reset-password
 */

interface GlobalAuthProviderProps {
  children: React.ReactNode;
}

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/verify-otp',
  '/resend-otp',
  '/forgot-password',
  '/reset-password',
];

export const GlobalAuthProvider: React.FC<GlobalAuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAppSelector(state => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Don't redirect if checking auth state
    if (userId === undefined) {
      setIsChecking(true);
      return;
    }

    setIsChecking(false);

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

    // Redirect to login if not authenticated and trying to access protected route
    if (!userId && !isPublicRoute) {
      router.push('/login');
    }
  }, [userId, pathname, router]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-white text-lg font-semibold">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
