/**
 * Authentication Service Interface
 * 
 * This service abstracts authentication logic, making it easy to swap
 * implementations (e.g., from mock to Firebase Auth) without changing components.
 */

export interface AuthUser {
    id: string
    email: string
    name: string
    plan: 'starter' | 'growth' | 'pro'
    avatarUrl?: string
    role?: 'client' | 'admin'
    onboardingComplete?: boolean
}



export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
}

export interface AuthService {
    /**
     * Log in a user with email and password
     */
    login(credentials: LoginCredentials): Promise<AuthUser>

    /**
     * Register a new user
     */
    register(data: RegisterData): Promise<AuthUser>

    /**
     * Log out the current user
     */
    logout(): Promise<void>

    /**
     * Get the currently authenticated user
     */
    getCurrentUser(): Promise<AuthUser | null>

    /**
     * Send a password reset email
     */
    resetPassword(email: string): Promise<void>

    /**
     * Update user profile
     */
    updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser>

    /**
     * Log in with Google
     */
    loginWithGoogle(): Promise<AuthUser>

    /**
     * Subscribe to auth state changes
     */
    onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void

    /**
     * Impersonate a user (Admin only)
     */
    impersonate(userId: string): Promise<void>

    /**
     * Stop impersonating
     */
    stopImpersonation(): Promise<void>

    /**
     * Check if currently impersonating
     */
    isImpersonating(): boolean
}

/**
 * Firebase Auth implementation for production
 */
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateProfile as updateFirebaseProfile,
    User
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { databaseService } from './database';

const IMPERSONATE_KEY = 'seo_jack_impersonate_id';

export class FirebaseAuthService implements AuthService {

    private mapUser(user: User, profileData?: any): AuthUser {
        const isAdminEmail = user.email === 'solarisnoego@gmail.com';
        return {
            id: user.uid,
            email: user.email!,
            name: user.displayName || profileData?.fullName || 'User',
            plan: profileData?.plan || 'starter',
            avatarUrl: user.photoURL || profileData?.avatarUrl,
            role: isAdminEmail ? 'admin' : (profileData?.role || 'client')
        };
    }

    private mapImpersonatedUser(profileData: any): AuthUser {
        return {
            id: profileData.uid || profileData.id,
            email: profileData.email,
            name: profileData.fullName || profileData.name || 'Impersonated User',
            plan: profileData.plan || 'starter',
            avatarUrl: profileData.avatarUrl,
            role: profileData.role || 'client',
            onboardingComplete: profileData.onboardingComplete || false,
        };
    }

    async login(credentials: LoginCredentials): Promise<AuthUser> {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
        );

        // Fetch additional profile data from Firestore
        const profile = await databaseService.read<any>('users', userCredential.user.uid);

        return this.mapUser(userCredential.user, profile);
    }

    async register(data: RegisterData): Promise<AuthUser> {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
        );

        // Update display name in Firebase Auth
        await updateFirebaseProfile(userCredential.user, {
            displayName: data.name
        });

        // Create user profile in Firestore
        const profileData = {
            uid: userCredential.user.uid,
            email: data.email,
            fullName: data.name,
            role: 'client',
            plan: 'starter',
            subscriptionStatus: 'pending',
            onboardingCompleted: false
        };

        await (databaseService as any).set('users', userCredential.user.uid, profileData);

        return this.mapUser(userCredential.user, profileData);
    }

    async loginWithGoogle(): Promise<AuthUser> {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);

        // Check if user exists in Firestore
        let profile = await databaseService.read<any>('users', userCredential.user.uid);

        if (!profile) {
            // Create new profile for Google user
            const profileData = {
                uid: userCredential.user.uid,
                email: userCredential.user.email!,
                fullName: userCredential.user.displayName || 'User',
                role: 'client',
                plan: 'starter',
                subscriptionStatus: 'pending',
                onboardingCompleted: false,
                avatarUrl: userCredential.user.photoURL
            };

            await (databaseService as any).set('users', userCredential.user.uid, profileData);
            profile = profileData;
        } else {
            // Update existing user
            const updates: any = {
                lastLoginAt: new Date().toISOString(), // Use ISO string or serverTimestamp depending on service
                updatedAt: new Date().toISOString()
            };

            // Force admin role for specific email
            if (userCredential.user.email === 'solarisnoego@gmail.com') {
                updates.role = 'admin';
                profile.role = 'admin'; // Update local profile object for mapping
            }

            await (databaseService as any).update('users', userCredential.user.uid, updates);

            // Merge updates into profile for return
            profile = { ...profile, ...updates };
        }

        return this.mapUser(userCredential.user, profile);
    }

    async logout(): Promise<void> {
        this.stopImpersonation();
        await signOut(auth);
    }

    async getCurrentUser(): Promise<AuthUser | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                unsubscribe();
                if (user) {
                    // Check for impersonation
                    const impersonatedId = typeof window !== 'undefined' ? localStorage.getItem(IMPERSONATE_KEY) : null;
                    const realProfile = await databaseService.read<any>('users', user.uid);

                    if (impersonatedId && realProfile?.role === 'admin') {
                        const targetProfile = await databaseService.read<any>('users', impersonatedId);
                        if (targetProfile) {
                            resolve(this.mapImpersonatedUser(targetProfile));
                            return;
                        }
                    }

                    resolve(this.mapUser(user, realProfile));
                } else {
                    resolve(null);
                }
            });
        });
    }

    async resetPassword(email: string): Promise<void> {
        await sendPasswordResetEmail(auth, email);
    }

    async updateProfile(userId: string, data: Partial<AuthUser>): Promise<AuthUser> {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');

        // Update Firestore
        const updatedProfile = await databaseService.update<any>('users', userId, {
            fullName: data.name,
            plan: data.plan
        });

        // Update Auth profile if name changed
        if (data.name) {
            await updateFirebaseProfile(user, { displayName: data.name });
        }

        return this.mapUser(user, updatedProfile);
    }

    onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
        return onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Check for impersonation
                const impersonatedId = typeof window !== 'undefined' ? localStorage.getItem(IMPERSONATE_KEY) : null;
                const realProfile = await databaseService.read<any>('users', user.uid);

                if (impersonatedId && realProfile?.role === 'admin') {
                    const targetProfile = await databaseService.read<any>('users', impersonatedId);
                    if (targetProfile) {
                        callback(this.mapImpersonatedUser(targetProfile));
                        return;
                    }
                }

                callback(this.mapUser(user, realProfile));
            } else {
                callback(null);
            }
        });
    }

    async impersonate(userId: string): Promise<void> {
        const currentUser = await this.getCurrentUser();
        // Note: getCurrentUser might return the impersonated user if already impersonating, 
        // but we should check the REAL user role. 
        // For simplicity, we assume the UI only exposes this to admins.
        // A robust check would be to read the real user from auth.currentUser again.

        if (typeof window !== 'undefined') {
            localStorage.setItem(IMPERSONATE_KEY, userId);
            window.location.href = '/'; // Redirect to home as the new user
        }
    }

    async stopImpersonation(): Promise<void> {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(IMPERSONATE_KEY);
            window.location.reload();
        }
    }

    isImpersonating(): boolean {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem(IMPERSONATE_KEY);
        }
        return false;
    }
}

// Export singleton instance
export const authService = new FirebaseAuthService();
