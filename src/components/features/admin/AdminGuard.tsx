'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';
import { isDevModeEnabled, getDevUserType } from '@/lib/dev/dev-mode';

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const checkAuth = async () => {
            // Check dev mode first
            if (isDevModeEnabled()) {
                const devUserType = getDevUserType();
                if (devUserType === 'admin') {
                    console.log('AdminGuard: Dev mode admin access granted');
                    setIsAuthorized(true);
                    setIsLoading(false);
                    return;
                } else {
                    console.warn('AdminGuard: Dev mode user is not admin, redirecting');
                    router.push('/');
                    setIsLoading(false);
                    return;
                }
            }

            // Normal auth check
            try {
                const user = await authService.getCurrentUser();
                console.log('AdminGuard Check:', user);
                if (user && user.role === 'admin') {
                    setIsAuthorized(true);
                } else {
                    console.warn('AdminGuard: User not authorized or not admin', user?.role);
                    router.push('/');
                }
            } catch (error) {
                console.error('Admin auth check failed', error);
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="animate-pulse text-brand-purple font-medium">Verifying Access...</div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
};
