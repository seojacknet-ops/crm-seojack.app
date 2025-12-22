'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, User, ArrowRight, Wrench, UserPlus, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { doc, getDoc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth';
import { db } from '@/lib/firebase/client';
import { getPostLoginRedirect } from '@/lib/auth/redirect';
import { UserDocument } from '@/lib/schemas/firebase';
import {
    isDevelopment,
    setDevUserType,
    getDevRedirectPath,
    DevUserType
} from '@/lib/dev/dev-mode';

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [showDevMode, setShowDevMode] = useState(false);

    // Dev mode - skip auth for development
    const handleDevLogin = (userType: DevUserType) => {
        setDevUserType(userType);
        const redirectPath = getDevRedirectPath(userType);
        toast.success(`Dev Mode: Entering as ${userType.replace('_', ' ')}`);
        router.push(redirectPath);
    };

    // Get query params
    const action = searchParams.get('action');
    const redirectTo = searchParams.get('redirect');
    const plan = searchParams.get('plan');

    // Set initial tab based on action param
    useEffect(() => {
        if (action === 'register') {
            setActiveTab('register');
        }
    }, [action]);

    // Check if user is already logged in
    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged(async (user) => {
            if (user) {
                // User is logged in, fetch their data and redirect
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.id));
                    const userData = userDoc.exists() ? userDoc.data() as UserDocument : null;
                    const destination = getPostLoginRedirect(userData, redirectTo || undefined);
                    router.replace(destination);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setCheckingAuth(false);
                }
            } else {
                setCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [router, redirectTo]);

    // Login form
    const {
        register: registerLoginField,
        handleSubmit: handleSubmitLogin,
        formState: { errors: loginErrors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Register form
    const {
        register: registerSignupField,
        handleSubmit: handleSubmitRegister,
        formState: { errors: registerErrors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const handleLogin = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const user = await authService.login(data);
            toast.success('Welcome back!');

            // Fetch user document to determine redirect
            const userDoc = await getDoc(doc(db, 'users', user.id));
            const userData = userDoc.exists() ? userDoc.data() as UserDocument : null;
            const destination = getPostLoginRedirect(userData, redirectTo || undefined);
            router.replace(destination);
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.code === 'auth/user-not-found') {
                toast.error('No account found with this email');
            } else if (error.code === 'auth/wrong-password') {
                toast.error('Incorrect password');
            } else {
                toast.error(error.message || 'Failed to sign in');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            await authService.register(data);
            toast.success('Account created! Let\'s get you set up.');

            // New users always go to onboarding
            router.replace('/onboarding');
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('An account with this email already exists');
            } else {
                toast.error(error.message || 'Failed to create account');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setIsLoading(true);
        try {
            const user = await authService.loginWithGoogle();
            toast.success('Signed in with Google!');

            // Fetch user document to determine redirect
            const userDoc = await getDoc(doc(db, 'users', user.id));
            const userData = userDoc.exists() ? userDoc.data() as UserDocument : null;

            const destination = getPostLoginRedirect(userData, redirectTo || undefined);
            router.replace(destination);
        } catch (error: any) {
            console.error('Google auth error:', error);
            toast.error(error.message || 'Failed to sign in with Google');
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading while checking auth status
    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-brand-purple mx-auto" />
                    <p className="mt-2 text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-purple via-brand-purple-dark to-purple-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col justify-center px-16 py-12">
                    {/* Logo */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            SEO<span className="text-pink-300">Jack</span>
                        </h1>
                        <p className="text-purple-200 mt-1">Client Portal</p>
                    </div>

                    {/* Value Props */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Lightning Fast Websites</h3>
                                <p className="text-purple-200 text-sm mt-1">Get your professional website live in days, not months</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Built for Local Business</h3>
                                <p className="text-purple-200 text-sm mt-1">SEO-optimized to attract customers in your area</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Dedicated Support</h3>
                                <p className="text-purple-200 text-sm mt-1">Real humans helping you every step of the way</p>
                            </div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="mt-16 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                        <p className="text-white/90 italic">"SEOJack transformed our online presence. Within a week we had a stunning website that actually brings in leads!"</p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
                                M
                            </div>
                            <div>
                                <p className="text-white font-medium text-sm">Mike Johnson</p>
                                <p className="text-purple-300 text-xs">Johnson's Plumbing Services</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Auth Forms */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <h1 className="text-3xl font-bold text-brand-purple">
                            SEO<span className="text-pink-500">Jack</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Client Portal</p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'login'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === 'register'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                                <p className="text-gray-500 mt-1">Sign in to access your dashboard</p>
                            </div>

                            <form onSubmit={handleSubmitLogin(handleLogin)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="you@company.com"
                                            className="pl-10 h-12"
                                            {...registerLoginField('email')}
                                        />
                                    </div>
                                    {loginErrors.email && (
                                        <p className="text-xs text-red-500">{loginErrors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="login-password">Password</Label>
                                        <button type="button" className="text-xs text-brand-purple hover:underline">
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="login-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-12"
                                            {...registerLoginField('password')}
                                        />
                                    </div>
                                    {loginErrors.password && (
                                        <p className="text-xs text-red-500">{loginErrors.password.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-brand-purple hover:bg-brand-purple-dark text-white font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
                                <p className="text-gray-500 mt-1">Get started with your new website</p>
                            </div>

                            {plan && (
                                <div className="p-3 bg-purple-50 border border-purple-100 rounded-lg">
                                    <p className="text-sm text-purple-700">
                                        You selected the <span className="font-semibold capitalize">{plan}</span> plan
                                    </p>
                                </div>
                            )}

                            <form onSubmit={handleSubmitRegister(handleRegister)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="register-name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="register-name"
                                            type="text"
                                            placeholder="John Smith"
                                            className="pl-10 h-12"
                                            {...registerSignupField('name')}
                                        />
                                    </div>
                                    {registerErrors.name && (
                                        <p className="text-xs text-red-500">{registerErrors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="you@company.com"
                                            className="pl-10 h-12"
                                            {...registerSignupField('email')}
                                        />
                                    </div>
                                    {registerErrors.email && (
                                        <p className="text-xs text-red-500">{registerErrors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="register-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 h-12"
                                            {...registerSignupField('password')}
                                        />
                                    </div>
                                    {registerErrors.password && (
                                        <p className="text-xs text-red-500">{registerErrors.password.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-brand-purple hover:bg-brand-purple-dark text-white font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Create Account
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50 px-2 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google Auth */}
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full h-12 border-gray-200 hover:bg-gray-50"
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </Button>

                    {/* Footer */}
                    <p className="mt-8 text-center text-xs text-gray-500">
                        By continuing, you agree to our{' '}
                        <Link href="https://seojack.net/legal/terms" className="text-brand-purple hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="https://seojack.net/legal/privacy" className="text-brand-purple hover:underline">
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Back to website */}
                    <div className="mt-6 text-center">
                        <Link
                            href="https://seojack.net"
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            ← Back to seojack.net
                        </Link>
                    </div>

                    {/* Dev Mode Toggle - Only in development */}
                    {isDevelopment() && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowDevMode(!showDevMode)}
                                className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-gray-600 mx-auto"
                            >
                                <Wrench className="h-3 w-3" />
                                {showDevMode ? 'Hide Dev Mode' : 'Dev Mode'}
                            </button>

                            {showDevMode && (
                                <div className="mt-4 p-4 bg-gray-900 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-xs text-gray-400 text-center font-medium">
                                        Skip auth & enter as:
                                    </p>

                                    <button
                                        onClick={() => handleDevLogin('new_user')}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                            <UserPlus className="h-4 w-4 text-blue-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">New User</p>
                                            <p className="text-xs text-gray-400">Goes to onboarding</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleDevLogin('returning_user')}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <Users className="h-4 w-4 text-green-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">Returning User</p>
                                            <p className="text-xs text-gray-400">Goes to dashboard</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleDevLogin('admin')}
                                        className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <Shield className="h-4 w-4 text-red-400" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-white">Admin</p>
                                            <p className="text-xs text-gray-400">Goes to admin panel</p>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        }>
            <LoginPageContent />
        </Suspense>
    );
}

