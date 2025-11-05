'use client';

import React, {useEffect, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import Cookies from 'js-cookie';

interface GlobalAuthProviderProps {
    children: React.ReactNode;
}

// Public routes (no auth required)
const PUBLIC_ROUTES = [
    '/login',
    '/register',
    '/verify-otp',
    '/resend-otp',
    '/forgot-password',
    '/reset-password',
];

export const GlobalAuthProvider: React.FC<GlobalAuthProviderProps> = ({children}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [userId, setUserId] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    // Load cookies and check if user is authenticated
    useEffect(() => {
        const token = Cookies.get('kuzzy-token');
        const id = Cookies.get('kuzzy-id');

        // Set the user ID if cookies exist
        if (token && id) {
            setUserId(id);
        } else {
            setUserId(null);
        }
    }, []);

    // Handle redirects when auth or route changes
    useEffect(() => {
        if (userId === null && !isChecking) {
            const isPublic = PUBLIC_ROUTES.some((route) => pathname?.startsWith(route));
            if (!isPublic) router.push('/login');
        }
    }, [userId, pathname, router, isChecking]);

    // Finish the checking state once cookies are read
    useEffect(() => {
        setIsChecking(false);
    }, [userId]);

    if (isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
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
