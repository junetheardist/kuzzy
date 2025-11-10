'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { restoreFromCookies } from '@/redux/authSlice';
import Cookies from 'js-cookie';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * AuthInitializer
 * Runs on app load to restore authentication state from cookies
 * This ensures userId is available before GlobalAuthProvider checks it
 * 
 * Problem it solves:
 * - User logs in (cookies set, Redux state updated)
 * - User refreshes page
 * - Redux state is lost (client-side only)
 * - GlobalAuthProvider sees userId = null
 * - User gets redirected to /login (shouldn't happen!)
 * 
 * Solution:
 * - AuthInitializer runs first
 * - Checks if cookies exist (kuzzy-token, kuzzy-id, kuzzy-email)
 * - Restores Redux state from cookies
 * - GlobalAuthProvider now sees userId is set
 * - No redirect ✓
 */
export const AuthInitializer = ({ children }: AuthInitializerProps) => {
  const dispatch = useAppDispatch();
  const { userId } = useAppSelector(state => state.auth);

  useEffect(() => {
    // If userId is already set in Redux, auth is already initialized
    if (userId) {
      return;
    }

    // Check if we have valid auth cookies
    const token = Cookies.get('kuzzy-token');
    const id = Cookies.get('kuzzy-id');
    const email = Cookies.get('kuzzy-email');

    // If all three cookies exist, restore auth state
    if (token && id && email) {
      dispatch(restoreFromCookies({
        userId: id,
        token,
        user: { id, email },
        isVerified: true
      }));
    }
  }, [userId, dispatch]);

  return <>{children}</>;
};
