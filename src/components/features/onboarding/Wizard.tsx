'use client'

import React from 'react'
import { useOnboardingStore } from '@/lib/store/onboarding-store'
import { authService } from '@/services/auth'
import { databaseService } from '@/services/database'
import { Step1BusinessInfo } from './steps/Step1BusinessInfo'
import { Step2BrandVoice } from './steps/Step2BrandVoice'
import { Step3TargetCustomer } from './steps/Step3TargetCustomer'
import { Step4VisualDirection } from './steps/Step4VisualDirection'
import { Step5Essentials } from './steps/Step5Essentials'
import { Step6Goals } from './steps/Step6Goals'
import { ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const STEP_CONFIG = [
    { id: 1, title: "Let's Get Acquainted", subtitle: 'Basic business info' },
    { id: 2, title: 'What Makes You Different', subtitle: 'Your unique selling points' },
    { id: 3, title: 'Your Ideal Customer', subtitle: 'Who you serve' },
    { id: 4, title: 'The Look & Feel', subtitle: 'Visual direction' },
    { id: 5, title: 'The Essentials', subtitle: 'Practical details' },
    { id: 6, title: 'The Finish Line', subtitle: 'Goals and timeline' },
]

export const Wizard = () => {
    const { currentStep, setStep, nextStep, prevStep, data } = useOnboardingStore()
    const router = useRouter()
    const totalSteps = 6

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1BusinessInfo />
            case 2:
                return <Step2BrandVoice />
            case 3:
                return <Step3TargetCustomer />
            case 4:
                return <Step4VisualDirection />
            case 5:
                return <Step5Essentials />
            case 6:
                return <Step6Goals />
            default:
                return <Step1BusinessInfo />
        }
    }

    const progress = (currentStep / totalSteps) * 100

    const handleContinue = async () => {
        if (currentStep < totalSteps) {
            nextStep()
            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            // Final step - complete onboarding
            try {
                const user = await authService.getCurrentUser();
                if (user) {
                    await databaseService.update('users', user.id, {
                        onboardingComplete: true,
                        quizData: data,
                        updatedAt: new Date()
                    });

                    // Save detailed onboarding data to 'onboarding' collection
                    await databaseService.set('onboarding', user.id, {
                        userId: user.id,
                        ...data,
                        completedAt: new Date()
                    });
                    toast.success('🎉 Onboarding Complete! Redirecting to your dashboard...')
                    setTimeout(() => {
                        window.location.href = '/'
                    }, 1500)
                } else {
                    toast.error('Error: No user logged in. Please log in and try again.');
                }
            } catch (error) {
                console.error('Error saving onboarding data:', error);
                toast.error('Failed to save your progress. Please try again.');
            }
        }
    }

    const canContinue = () => {
        // Basic validation for each step
        switch (currentStep) {
            case 1:
                return (
                    data.businessInfo.businessName.trim() !== '' &&
                    data.businessInfo.industry !== null &&
                    data.businessInfo.location.trim() !== ''
                )
            case 2:
                return true // No required fields - features are optional
            case 3:
                return data.targetCustomer.customerType.length > 0
            case 4:
                return data.visualDirection.vibe !== null && data.visualDirection.colorPalette !== null
            case 5:
                return (
                    data.essentials.contactMethods.length > 0 &&
                    data.essentials.phone.trim() !== '' &&
                    data.essentials.email.trim() !== ''
                )
            case 6:
                return data.goals.primaryGoal !== null && data.goals.timeline !== null
            default:
                return true
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                            {STEP_CONFIG[currentStep - 1]?.title}
                        </h3>
                        <p className="text-xs text-gray-500">{STEP_CONFIG[currentStep - 1]?.subtitle}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-gray-500">
                            Step {currentStep} of {totalSteps}
                        </div>
                        <div className="text-xs text-gray-400">{Math.round(progress)}% Complete</div>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-brand-purple to-brand-purple-dark h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Step indicators */}
                <div className="mt-4 flex justify-between">
                    {STEP_CONFIG.map((step) => (
                        <div
                            key={step.id}
                            className={`flex-1 text-center ${step.id < currentStep
                                ? 'text-brand-purple'
                                : step.id === currentStep
                                    ? 'text-brand-purple font-semibold'
                                    : 'text-gray-300'
                                }`}
                        >
                            <div
                                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${step.id < currentStep
                                    ? 'bg-brand-purple text-white'
                                    : step.id === currentStep
                                        ? 'bg-brand-purple text-white ring-4 ring-brand-purple/20'
                                        : 'bg-gray-200 text-gray-400'
                                    }`}
                            >
                                {step.id < currentStep ? '✓' : step.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[600px]">{renderStep()}</div>

            {/* Navigation */}
            <div className="flex justify-between mt-6 bg-white rounded-2xl shadow-sm p-6">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center px-6 py-3 rounded-lg text-sm font-medium transition-all ${currentStep === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                </button>

                <div className="flex gap-3">
                    <button
                        className="flex items-center px-6 py-3 text-brand-purple hover:bg-brand-purple/5 rounded-lg text-sm font-medium transition-all border-2 border-brand-purple/20"
                        onClick={() => toast.info('💬 Chat feature coming soon!')}
                    >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Ask SEOJack
                    </button>

                    <button
                        onClick={handleContinue}
                        disabled={!canContinue()}
                        className={`flex items-center px-8 py-3 rounded-lg text-sm font-medium transition-all ${canContinue()
                            ? 'bg-brand-purple text-white hover:bg-brand-purple-dark shadow-lg shadow-brand-purple/30 hover:shadow-xl hover:shadow-brand-purple/40'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {currentStep === totalSteps ? '🎉 Complete Onboarding' : 'Continue'}
                        {currentStep !== totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
                    </button>
                </div>
            </div>

            {/* Encouraging message */}
            {progress >= 50 && progress < 100 && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        🌟 You're {Math.round(progress)}% done - most people finish in 4 minutes!
                    </p>
                </div>
            )}
        </div>
    )
}
