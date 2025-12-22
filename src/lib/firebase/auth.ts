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
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document
            await setDoc(doc(db, 'users', user.uid), {
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
            });
        } else {
            // Update last login
            await setDoc(doc(db, 'users', user.uid), {
                lastLoginAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                ...(user.email === 'solarisnoego@gmail.com' ? { role: 'admin' } : {})
            }, { merge: true });
        }

        return user;
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
