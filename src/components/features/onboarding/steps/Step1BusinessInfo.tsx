'use client'

import React from 'react'
import { useOnboardingStore } from '@/lib/store/onboarding-store'
import { INDUSTRIES, INDUSTRY_CONFIGS } from '@/lib/config/industry-defaults'

interface Step1Props {
    title?: string;
    subtitle?: string;
}

export const Step1BusinessInfo = ({
    title = "Let's Get Acquainted 👋",
    subtitle = "First things first - tell us about your business."
}: Step1Props) => {
    const { data, updateBusinessInfo } = useOnboardingStore()
    const { businessInfo } = data


    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-600">
                    {subtitle}
                </p>
            </div>

            {/* Business Name */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    What's your business called?
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20 transition-all"
                    placeholder="e.g. Smith Plumbing Services"
                    value={businessInfo.businessName}
                    onChange={(e) => updateBusinessInfo({ businessName: e.target.value })}
                />

            </div>

            {/* Industry Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">What do you do?</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INDUSTRIES.map((industry) => (
                        <button
                            key={industry.id}
                            onClick={() => updateBusinessInfo({ industry: industry.id })}
                            className={`p-4 border-2 rounded-lg text-left transition-all hover:scale-105 ${businessInfo.industry === industry.id
                                ? 'border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple/30'
                                : 'border-gray-200 hover:border-brand-purple/50'
                                }`}
                        >
                            <div className="text-3xl mb-2">{industry.icon}</div>
                            <div className="font-semibold text-gray-900">{industry.label}</div>
                        </button>
                    ))}
                </div>
                {businessInfo.industry === 'other' && (
                    <input
                        type="text"
                        className="mt-3 w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                        placeholder="Tell us what you do..."
                        value={businessInfo.customIndustry || ''}
                        onChange={(e) => updateBusinessInfo({ customIndustry: e.target.value })}
                    />
                )}
            </div>

            {/* Location */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                    Where are you based?
                </label>
                <input
                    type="text"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-purple focus:ring-2 focus:ring-brand-purple/20"
                    value={businessInfo.location}
                    onChange={(e) => updateBusinessInfo({ location: e.target.value })}
                />
                <p className="text-sm text-gray-500 mt-2">
                    This helps us target the right customers for you
                </p>
            </div>

            {/* Service Type */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                    Do you travel to customers, or do they come to you?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                        { id: 'travel', label: 'I travel to them', emoji: '🚗' },
                        { id: 'onsite', label: 'They come to me', emoji: '🏢' },
                        { id: 'both', label: 'Both', emoji: '🔄' },
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() =>
                                updateBusinessInfo({
                                    serviceType: option.id as 'travel' | 'onsite' | 'both',
                                })
                            }
                            className={`p-4 border-2 rounded-lg transition-all ${businessInfo.serviceType === option.id
                                ? 'border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple/30'
                                : 'border-gray-200 hover:border-brand-purple/50'
                                }`}
                        >
                            <div className="text-2xl mb-1">{option.emoji}</div>
                            <div className="font-medium text-gray-900">{option.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Years in Business */}
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                    How long have you been in business?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { id: 'starting', label: 'Just starting' },
                        { id: '1-2', label: '1-2 years' },
                        { id: '3-5', label: '3-5 years' },
                        { id: '5+', label: '5+ years veteran' },
                    ].map((option) => (
                        <button
                            key={option.id}
                            onClick={() =>
                                updateBusinessInfo({
                                    yearsInBusiness: option.id as 'starting' | '1-2' | '3-5' | '5+',
                                })
                            }
                            className={`p-3 border-2 rounded-lg transition-all ${businessInfo.yearsInBusiness === option.id
                                ? 'border-brand-purple bg-brand-purple/10 ring-2 ring-brand-purple/30'
                                : 'border-gray-200 hover:border-brand-purple/50'
                                }`}
                        >
                            <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Preview of smart defaults */}
            {businessInfo.industry && businessInfo.industry !== 'other' && (
                <div className="mt-6 p-4 bg-brand-purple/5 border border-brand-purple/20 rounded-lg">
                    <p className="text-sm text-brand-purple font-medium">
                        💡 Great! We've pre-filled some suggestions based on your industry. You can customize
                        everything in the next steps.
                    </p>
                </div>
            )}
        </div>
    )
}
