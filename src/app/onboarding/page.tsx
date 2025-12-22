"use client"

import React from "react"
import { Wizard } from "@/components/features/onboarding/Wizard"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
    const { user, userData, loading } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    // Prevent hydration mismatch for persisted state
    React.useEffect(() => {
        setMounted(true)
    }, [])

    React.useEffect(() => {
        if (!loading && userData?.role === 'admin') {
            router.replace('/admin')
        }
    }, [loading, userData, router])

    if (!mounted) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/seojack-logo-dark.png"
                                alt="SEOJack"
                                className="h-8 w-auto"
                            />
                            <div className="h-8 w-[1px] bg-gray-200 mx-1"></div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-0.5">Client Onboarding</p>
                        </div>
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                            Save & Continue Later
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome Message */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-3">
                            Welcome to SEOJack! 🎉
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Let's build you a website that actually brings in customers. This takes about 5 minutes,
                            and you can save & continue anytime.
                        </p>
                    </div>

                    {/* Wizard */}
                    <Wizard />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm text-gray-500">
                        Need help? Contact us at{" "}
                        <a href="mailto:support@seojack.com" className="text-brand-purple hover:underline">
                            support@seojack.com
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    )
}
