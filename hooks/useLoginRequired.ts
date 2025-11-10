/**
 * useLoginRequired Hook
 * Check if user is logged in and show modal if needed
 */

import { useAppSelector } from '@/redux/hooks';

interface UseLoginRequiredReturn {
  /**
   * Whether user is logged in
   */
  isLoggedIn: boolean;
  /**
   * User ID if logged in
   */
  userId: string | null;
  /**
   * Whether user needs to login
   */
  needsLogin: boolean;
}

/**
 * Hook to check login status
 * Usage:
 * const { isLoggedIn, needsLogin } = useLoginRequired();
 * if (needsLogin) return <LoginRequiredModal />;
 */
export function useLoginRequired(): UseLoginRequiredReturn {
  const { userId } = useAppSelector(state => state.auth);
  const isLoggedIn = !!userId;

  return {
    isLoggedIn,
    userId: userId || null,
    needsLogin: !isLoggedIn,
  };
}
