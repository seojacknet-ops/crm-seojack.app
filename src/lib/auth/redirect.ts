import { UserDocument } from '@/lib/schemas/firebase';

/**
 * Determines where to redirect user after successful authentication
 * Based on user role and onboarding status
 */
export function getPostLoginRedirect(userData: UserDocument | null, requestedRedirect?: string): string {
    // If no user data, stay on login
    if (!userData) {
        return '/login';
    }

    // Admin users go to admin dashboard
    if (userData.role === 'admin') {
        return '/admin';
    }

    // If there's a requested redirect and it's valid, use it
    if (requestedRedirect && isValidRedirect(requestedRedirect)) {
        return requestedRedirect;
    }

    // New users (haven't completed onboarding) go to onboarding
    if (!userData.onboardingComplete) {
        return '/onboarding';
    }

    // Returning users go to main dashboard
    return '/';
}

/**
 * Validates redirect URL to prevent open redirects
 */
function isValidRedirect(url: string): boolean {
    // Only allow internal redirects (starting with /)
    if (!url.startsWith('/')) {
        return false;
    }

    // Block redirects to login page (would create loop)
    if (url === '/login' || url.startsWith('/login?')) {
        return false;
    }

    // Block protocol-relative URLs
    if (url.startsWith('//')) {
        return false;
    }

    return true;
}

/**
 * Gets the appropriate dashboard route based on user role
 */
export function getDashboardRoute(userData: UserDocument | null): string {
    if (!userData) return '/login';
    if (userData.role === 'admin') return '/admin';
    return '/';
}

/**
 * Checks if user should be redirected to onboarding
 */
export function shouldRedirectToOnboarding(userData: UserDocument | null): boolean {
    if (!userData) return false;
    if (userData.role === 'admin') return false;
    return !userData.onboardingComplete;
}

