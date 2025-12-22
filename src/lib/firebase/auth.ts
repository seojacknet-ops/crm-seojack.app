import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './client';

const googleProvider = new GoogleAuthProvider();

export const authService = {
    // Sign up with email/password
    async signUp(email: string, password: string, name: string) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document
        await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email,
            name,
            plan: 'starter',
            subscriptionStatus: 'trialing',
            onboardingComplete: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return user;
    },

    // Sign in with email/password
    async signIn(email: string, password: string) {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // Update last login
        await setDoc(doc(db, 'users', user.uid), {
            lastLoginAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }, { merge: true });

        return user;
    },

    // Sign in with Google
    async signInWithGoogle() {
        const { user } = await signInWithPopup(auth, googleProvider);

        // Check if user document exists
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        let userData: any;

        if (!userDocSnapshot.exists()) {
            // Create new user document
            userData = {
                id: user.uid,
                email: user.email,
                name: user.displayName || 'User',
                avatarUrl: user.photoURL,
                role: user.email === 'solarisnoego@gmail.com' ? 'admin' : 'client',
                plan: 'starter',
                subscriptionStatus: 'trialing',
                onboardingComplete: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userData);
        } else {
            // Update last login
            const updates: any = {
                lastLoginAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            // Force admin role for specific email
            if (user.email === 'solarisnoego@gmail.com') {
                updates.role = 'admin';
            }

            await setDoc(userDocRef, updates, { merge: true });

            // Get the updated data
            userData = { ...userDocSnapshot.data(), ...updates };
            // Ensure serverTimestamp is not returned as object in local state immediately if needed, 
            // but for redirect logic strings/booleans are fine. 
            // Actually, best to return the merged data.
            // If we just updated role, we should make sure userData reflects it.
            if (updates.role) {
                userData.role = updates.role;
            }
        }

        return { user, userData };
    },

    // Sign out
    async signOut() {
        await firebaseSignOut(auth);
    },

    // Password reset
    async resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email);
    },

    // Auth state listener
    onAuthStateChanged(callback: (user: User | null) => void) {
        return firebaseOnAuthStateChanged(auth, callback);
    },

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    },
};
