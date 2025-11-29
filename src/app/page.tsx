'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, FileText, CreditCard, Zap } from 'lucide-react';
import StatusHero from '@/components/features/dashboard/StatusHero';
import AnalyticsSnapshot from '@/components/features/dashboard/AnalyticsSnapshot';
import RecentActivity from '@/components/features/dashboard/RecentActivity';
import QuickActions from '@/components/features/dashboard/QuickActions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import GetStartedTab from '@/components/features/dashboard/GetStartedTab';
import { DevToolbar, DevUserState } from '@/components/features/dev/DevToolbar';
import { authService } from '@/services/auth';
import { ProjectTimeline } from '@/components/features/dashboard/ProjectTimeline';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function DashboardContent() {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [projectPhase, setProjectPhase] = React.useState("Onboarding");
  const [currentStep, setCurrentStep] = React.useState(1);
  const [devState, setDevState] = React.useState<DevUserState>('real');

  // Fetch real user
  const fetchUser = React.useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Determine phase based on onboarding status
        const profile = await import('@/services/database').then(m => m.databaseService.read<any>('users', currentUser.id));
        if (profile?.onboardingCompleted) {
          setProjectPhase("Design Draft");
          setCurrentStep(2);
        } else {
          setProjectPhase("Onboarding");
          setCurrentStep(1);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle Dev State Changes
  React.useEffect(() => {
    const applyDevState = async () => {
      setLoading(true);
      if (devState === 'real') {
        await fetchUser();
      } else {
        // Simulate User
        const mockUser = {
          id: 'dev-user',
          email: 'dev@example.com',
          name: 'Dev User',
          plan: 'starter'
        };

        if (devState === 'new_user') {
          setUser({ ...mockUser, name: 'New User' });
          setProjectPhase("Onboarding");
          setCurrentStep(1);
        } else if (devState === 'standard_plan') {
          setUser({ ...mockUser, name: 'Standard User', plan: 'growth' });
          setProjectPhase("Design Draft");
          setCurrentStep(2);
        } else if (devState === 'pro_plan') {
          setUser({ ...mockUser, name: 'Pro User', plan: 'pro' });
          setProjectPhase("Development");
          setCurrentStep(3);
        } else if (devState === 'admin') {
          setUser({ ...mockUser, name: 'Admin User', role: 'admin' });
          setProjectPhase("Live");
          setCurrentStep(5);
        }
        setLoading(false);
      }
    };
    applyDevState();
  }, [devState, fetchUser]);

  // Listen for auth changes (only in real mode)
  React.useEffect(() => {
    if (devState !== 'real') return;

    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        await fetchUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [devState, fetchUser]);


  if (loading) {
    return <div className="flex items-center justify-center h-screen text-brand-purple animate-pulse">Loading SEOJack...</div>;
  }

  // User is guaranteed by ProtectedRoute, but handle edge case
  if (!user) {
    return <div className="flex items-center justify-center h-screen text-brand-purple animate-pulse">Loading...</div>;
  }

  const userName = user?.name || "Guest";
  const planName = user?.plan === 'pro' ? "Pro Plan" : user?.plan === 'growth' ? "Growth Plan" : "Starter Plan";
  const nextBillDate = "Dec 12, 2025";
  const totalSteps = 5;

  return (
    <div className="space-y-6 pb-20"> {/* Added padding for toolbar */}
      <Tabs defaultValue="get-started" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl h-auto">
            <TabsTrigger
              value="overview"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-brand-purple data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="get-started"
              className="rounded-lg px-4 py-2 data-[state=active]:bg-brand-purple data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              Get Started
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="get-started" className="mt-0">
          <GetStartedTab />
        </TabsContent>

        <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Enhanced Hero Widget with Progress */}
          <StatusHero
            userName={userName}
            projectPhase={projectPhase}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

          {/* Bento Box Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Main Content Area - 8 columns */}
            <div className="lg:col-span-8 space-y-6">

              {/* Next Action Card - Refined & Clean */}
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-purple"></div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-brand-purple/10 text-brand-purple text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        Action Required
                      </span>
                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Due in 2 days
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">Review Design Draft v1</h3>
                    <p className="text-gray-600 leading-relaxed">
                      The first look at your homepage is ready. Please review the layout and leave your feedback so we can move to development.
                    </p>
                  </div>
                  <button className="bg-brand-purple text-white px-8 py-3.5 rounded-xl font-medium hover:bg-brand-purple-dark transition-all shadow-lg shadow-brand-purple/20 flex items-center whitespace-nowrap group-hover:scale-105">
                    View Draft <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Two Column Grid for Analytics and Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalyticsSnapshot />
                <RecentActivity />
              </div>

              {/* Project Progress Stepper - Full Width */}
              <ProjectTimeline currentStep={currentStep} totalSteps={totalSteps} />

              {/* Quick Actions */}
              <QuickActions />

            </div>

            {/* Sidebar - 4 columns */}
            <div className="lg:col-span-4 space-y-6">

              {/* Your Plan Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Your Plan</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl border border-pink-200/50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-pink-500 text-white rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-pink-600 font-medium">Current Tier</p>
                        <p className="text-sm font-bold text-gray-900">{planName}</p>
                      </div>
                    </div>
                    <Link href="/billing" className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline">
                      Upgrade
                    </Link>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Next Billing</p>
                        <p className="text-sm font-bold text-gray-900">{nextBillDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/billing"
                  className="mt-4 w-full block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors border border-gray-200"
                >
                  Manage Subscription
                </Link>
              </div>

              {/* SEO Health Score */}
              <div className="bg-gradient-to-br from-brand-purple to-brand-purple-dark rounded-2xl p-6 text-white shadow-brand">
                <h3 className="font-bold mb-4 text-lg">SEO Health Score</h3>
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90 w-32 h-32">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="white"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.87)}`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">87</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/80 text-center">
                  Excellent! Your site is well-optimized.
                </p>
                <button className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-2 rounded-xl text-sm font-medium transition-colors border border-white/30">
                  View Full Report
                </button>
              </div>

              {/* Support Widget */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our team is here to support you every step of the way.
                </p>
                <Link
                  href="/messages"
                  className="w-full block text-center bg-brand-purple hover:bg-brand-purple-dark text-white py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-brand-purple/20"
                >
                  Chat with Support
                </Link>
              </div>

            </div>
          </div>
        </TabsContent>
      </Tabs>

      <DevToolbar onSimulate={setDevState} currentState={devState} />
    </div>
  );
}

// Wrap dashboard with ProtectedRoute - requires auth and completed onboarding
export default function DashboardHome() {
  return (
    <ProtectedRoute requireOnboardingComplete>
      <DashboardContent />
    </ProtectedRoute>
  );
}
