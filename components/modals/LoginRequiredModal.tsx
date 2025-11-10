/**
 * LoginRequiredModal Component
 * Blocks all view if user is not logged in
 * Provides navigation to login or register
 */

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

interface LoginRequiredModalProps {
  /**
   * Whether to show the modal
   * Defaults to checking auth state
   */
  isOpen?: boolean;
  /**
   * Title of the modal
   */
  title?: string;
  /**
   * Message to display
   */
  message?: string;
  /**
   * Custom close handler
   */
  onClose?: () => void;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  title = 'Login Required',
  message = 'You need to be logged in to access this feature. Please login to continue.',
  onClose,
}) => {
  const router = useRouter();
  const { userId } = useAppSelector(state => state.auth);
  
  // Use provided isOpen or check auth state
  const shouldShow = isOpen !== undefined ? isOpen : !userId;

  if (!shouldShow) {
    return null;
  }

  const handleLogin = () => {
    router.push('/login');
    if (onClose) onClose();
  };

  const handleRegister = () => {
    router.push('/register');
    if (onClose) onClose();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-6 rounded-t-lg">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              {title}
            </h2>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              {message}
            </p>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tip:</span> Create an account to unlock vendor registration and other features.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 flex-col sm:flex-row">
            <button
              onClick={handleLogin}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Login
            </button>
            <button
              onClick={handleRegister}
              className="flex-1 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
