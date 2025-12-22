'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Step1BusinessInfo } from '@/components/features/onboarding/steps/Step1BusinessInfo';
import { useOnboardingStore } from '@/lib/store/onboarding-store';
import { authService } from '@/services/auth';
import { databaseService } from '@/services/database';
import { ChevronRight } from 'lucide-react';

export default function GetStartedPage() {
    const router = useRouter();
    const { data } = useOnboardingStore();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const isValid = () => {
        return (
            data.businessInfo.businessName.trim() !== '' &&
            data.businessInfo.industry !== null &&
            data.businessInfo.location.trim() !== ''
        );
    };

    const handleContinue = async () => {
        if (!isValid()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const user = await authService.getCurrentUser();
            if (!user) {
                toast.error('You must be logged in to continue');
                return;
            }

            // Save business info to user profile and onboarding collection
            // Mark basic onboarding (lead capture) as complete
            const updates = {
                businessName: data.businessInfo.businessName,
                industry: data.businessInfo.industry,
                location: data.businessInfo.location,
                leadCaptureComplete: true, // Specific flag for this stage
                updatedAt: new Date()
            };

            await databaseService.update('users', user.id, updates);

            // Also update the onboarding store persistence
            await databaseService.set('onboarding', user.id, {
                userId: user.id,
                ...data,
                lastUpdated: new Date()
            });

            toast.success("Great! Let's go to your dashboard.");
            router.push('/');

        } catch (error) {
            console.error('Lead capture error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 flex flex-col">
            {/* Simple Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <img src="/seojack-logo-dark.png" alt="SEOJack" className="h-8 w-auto" />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full p-6 py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <Step1BusinessInfo
                        title="Welcome! Let's get started 🚀"
                        subtitle="We just need a few details to set up your account."
                    />

                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={!isValid() || isSubmitting}
                            className={`flex items-center px-8 py-3 rounded-lg text-sm font-medium transition-all ${isValid() && !isSubmitting
                                    ? 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-lg shadow-brand-purple/30'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? 'Saving...' : 'Go to Dashboard'}
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
