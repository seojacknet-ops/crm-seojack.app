/**
 * Dev Mode - Skip authentication and simulate different user types
 * 
 * Usage:
 * - On login page: Click "Dev Mode" to see options
 * - Use DevToolbar (wrench icon) on any page to switch user types
 * - State persists in localStorage
 */

import { UserDocument } from '@/lib/schemas/firebase';
import { Timestamp } from 'firebase/firestore';

export type DevUserType = 'none' | 'new_user' | 'returning_user' | 'admin';

const DEV_MODE_KEY = 'seojack_dev_mode';
const DEV_USER_TYPE_KEY = 'seojack_dev_user_type';

// Check if we're in development
export function isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
}

// Check if dev mode is enabled
export function isDevModeEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(DEV_MODE_KEY) === 'true';
}

// Enable/disable dev mode
export function setDevMode(enabled: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEV_MODE_KEY, enabled ? 'true' : 'false');
}

// Get current dev user type
export function getDevUserType(): DevUserType {
    if (typeof window === 'undefined') return 'none';
    return (localStorage.getItem(DEV_USER_TYPE_KEY) as DevUserType) || 'none';
}

// Set dev user type
export function setDevUserType(type: DevUserType): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DEV_USER_TYPE_KEY, type);
    if (type !== 'none') {
        setDevMode(true);
    }
}

// Clear dev mode
export function clearDevMode(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(DEV_MODE_KEY);
    localStorage.removeItem(DEV_USER_TYPE_KEY);
}

// Mock user data for each type
export function getMockUserData(type: DevUserType): UserDocument | null {
    const now = Timestamp.now();
    
    const baseUser = {
        id: `dev-${type}`,
        email: `dev-${type}@seojack.test`,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        stripeCustomerId: undefined,
        subscriptionEndDate: undefined,
    };

    switch (type) {
        case 'new_user':
            return {
                ...baseUser,
                id: 'dev-new-user',
                email: 'newuser@seojack.test',
                name: 'New User (Dev)',
                role: 'client',
                plan: 'starter',
                subscriptionStatus: 'trialing',
                onboardingComplete: false,
            };
        
        case 'returning_user':
            return {
                ...baseUser,
                id: 'dev-returning-user',
                email: 'returning@seojack.test',
                name: 'Returning User (Dev)',
                role: 'client',
                plan: 'growth',
                subscriptionStatus: 'active',
                onboardingComplete: true,
                company: 'Demo Company Ltd',
                phone: '+44 7123 456789',
            };
        
        case 'admin':
            return {
                ...baseUser,
                id: 'dev-admin',
                email: 'admin@seojack.test',
                name: 'Admin (Dev)',
                role: 'admin',
                plan: 'pro',
                subscriptionStatus: 'active',
                onboardingComplete: true,
            };
        
        default:
            return null;
    }
}

// Get redirect path for dev user type
export function getDevRedirectPath(type: DevUserType): string {
    switch (type) {
        case 'new_user':
            return '/onboarding';
        case 'returning_user':
            return '/';
        case 'admin':
            return '/admin';
        default:
            return '/login';
    }
}

