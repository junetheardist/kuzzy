/**
 * withLoginRequired HOC
 * Wraps components to require login
 * Displays modal if not authenticated
 */

import React, { ComponentType } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { LoginRequiredModal } from './LoginRequiredModal';

interface WithLoginRequiredOptions {
  /**
   * Title for the modal
   */
  modalTitle?: string;
  /**
   * Message for the modal
   */
  modalMessage?: string;
  /**
   * Whether to show the content while modal is open
   */
  showContentBehind?: boolean;
}

/**
 * Higher-order component that requires login
 * Usage:
 * const ProtectedComponent = withLoginRequired(MyComponent);
 */
export function withLoginRequired<P extends object>(
  Component: ComponentType<P>,
  options: WithLoginRequiredOptions = {}
) {
  const {
    modalTitle = 'Login Required',
    modalMessage = 'You need to be logged in to access this feature.',
    showContentBehind = false,
  } = options;

  const WrappedComponent = (props: P) => {
    const { userId } = useAppSelector(state => state.auth);
    const isLoggedIn = !!userId;

    return (
      <>
        {/* Show component only if logged in or showContentBehind is true */}
        {(isLoggedIn || showContentBehind) && <Component {...props} />}

        {/* Show modal if not logged in */}
        {!isLoggedIn && (
          <LoginRequiredModal
            title={modalTitle}
            message={modalMessage}
          />
        )}
      </>
    );
  };

  // Set display name for debugging
  WrappedComponent.displayName = `withLoginRequired(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
