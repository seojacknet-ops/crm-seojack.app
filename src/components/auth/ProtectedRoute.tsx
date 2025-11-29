'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

import { authService } from '@/services/auth';
import { db } from '@/lib/firebase/client';
import { UserDocument } from '@/lib/schemas/firebase';
import { getPostLoginRedirect, shouldRedirectToOnboarding } from '@/lib/auth/redirect';
import { 
    isDevModeEnabled, 
    getDevUserType, 
    getMockUserData,
    clearDevMode,
    DevUserType 
} from '@/lib/dev/dev-mode';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'client' | 'admin';
    requireOnboardingComplete?: boolean;
}

/**
 * ProtectedRoute component that handles:
 * - Authentication check (redirects to /login if not authenticated)
 * - Role-based access control (optional)
 * - Onboarding status check (optional)
 */
export function ProtectedRoute({ 
    children, 
    requiredRole,
    requireOnboardingComplete = false 
}: ProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for dev mode first
        if (isDevModeEnabled()) {
            const devUserType = getDevUserType();
            const mockUser = getMockUserData(devUserType);
            
            if (mockUser) {
                // Validate dev user against route requirements
                if (requiredRole && mockUser.role !== requiredRole) {
                    // Wrong role for this route
                    if (mockUser.role === 'admin') {
                        router.replace('/admin');
                    } else {
                        router.replace('/');
                    }
                    return;
                }

                // Check onboarding for dev users
                if (mockUser.role === 'client' && requireOnboardingComplete && !mockUser.onboardingComplete) {
                    router.replace('/onboarding');
                    return;
                }

                // Dev mode authorized
                setIsAuthorized(true);
                setIsLoading(false);
                return;
            }
        }

        // Normal auth flow
        const unsubscribe = authService.onAuthStateChanged(async (user) => {
            if (!user) {
                // Not authenticated - redirect to login with return URL
                const returnUrl = encodeURIComponent(pathname);
                router.replace(`/login?redirect=${returnUrl}`);
                return;
            }

            try {
                // Fetch user document
                const userDoc = await getDoc(doc(db, 'users', user.id));
                
                if (!userDoc.exists()) {
                    // User document doesn't exist - likely new user, create it
                    console.warn('User document not found, redirecting to onboarding');
                    router.replace('/onboarding');
                    return;
                }

                const userData = userDoc.data() as UserDocument;

                // Check role requirement
                if (requiredRole && userData.role !== requiredRole) {
                    // Wrong role - redirect to appropriate dashboard
                    const destination = getPostLoginRedirect(userData);
                    router.replace(destination);
                    return;
                }

                // Check if admin trying to access client routes
                if (userData.role === 'admin' && pathname === '/') {
                    router.replace('/admin');
                    return;
                }

                // Check onboarding requirement for clients
                if (userData.role === 'client' && requireOnboardingComplete && !userData.onboardingComplete) {
                    router.replace('/onboarding');
                    return;
                }

                // Check if client with incomplete onboarding is on wrong page
                if (
                    userData.role === 'client' && 
                    !userData.onboardingComplete && 
                    pathname !== '/onboarding' &&
                    !pathname.startsWith('/onboarding')
                ) {
                    router.replace('/onboarding');
                    return;
                }

                // All checks passed
                setIsAuthorized(true);
            } catch (error) {
                console.error('Error checking authorization:', error);
                router.replace('/login');
            } finally {
                setIsLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router, pathname, requiredRole, requireOnboardingComplete]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-purple mx-auto" />
                    <p className="mt-3 text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // Will redirect via useEffect
    }

    return <>{children}</>;
}

/**
 * HOC version of ProtectedRoute for wrapping entire pages
 */
export function withAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    options?: {
        requiredRole?: 'client' | 'admin';
        requireOnboardingComplete?: boolean;
    }
) {
    return function WithAuthComponent(props: P) {
        return (
            <ProtectedRoute 
                requiredRole={options?.requiredRole}
                requireOnboardingComplete={options?.requireOnboardingComplete}
            >
                <WrappedComponent {...props} />
            </ProtectedRoute>
        );
    };
}

/**
 * Hook to get current user data with loading state
 */
export function useUser() {
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<UserDocument | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
            setUser(authUser);
            
            if (authUser) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', authUser.id));
                    if (userDoc.exists()) {
                        setUserData(userDoc.data() as UserDocument);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            } else {
                setUserData(null);
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, userData, loading };
}

