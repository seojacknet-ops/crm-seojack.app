'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Play, FileText, MessageSquare, HelpCircle } from 'lucide-react';

export default function GetStartedTab() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple to-brand-purple-dark text-white shadow-brand p-8 sm:p-12">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Welcome to SEOJack
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight">
                            Let's build your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                                dream website.
                            </span>
                        </h1>

                        <p className="text-lg text-white/80 mb-8 leading-relaxed">
                            We've streamlined the entire process. Complete our quick onboarding wizard to tell us about your brand, and we'll handle the rest.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/onboarding"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-brand-purple font-bold rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group"
                            >
                                Start Onboarding
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/messages"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                            >
                                <MessageSquare className="w-5 h-5 mr-2" />
                                Talk to an Expert
                            </Link>
                        </div>
                    </div>

                    {/* Welcome Video Placeholder */}
                    <div className="relative hidden lg:block">
                        <div className="relative aspect-video bg-black/20 rounded-2xl border border-white/10 flex items-center justify-center group cursor-pointer hover:bg-black/30 transition-all backdrop-blur-sm shadow-2xl overflow-hidden hover:scale-[1.02] duration-300">
                            {/* Simple animated background for placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>

                            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center pl-2 shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10 backdrop-blur-md">
                                <Play className="w-8 h-8 text-brand-purple fill-brand-purple" />
                            </div>

                            <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                                <p className="text-sm font-semibold text-white/90 tracking-wide uppercase text-shadow-sm">Watch: Welcome to SEOJack</p>
                                <p className="text-xs text-white/60 mt-1">1 min introduction</p>
                            </div>
                        </div>

                        {/* Decorative elements behind video */}
                        <div className="absolute -top-6 -right-6 w-full h-full border-2 border-white/10 rounded-2xl -z-10 bg-white/5 backdrop-blur-sm"></div>
                    </div>
                </div>
            </div>

            {/* How it Works Grid */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How SEOJack Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        {
                            icon: Play,
                            title: "1. Onboarding",
                            desc: "Share your vision, brand assets, and goals in our simple wizard.",
                            color: "bg-blue-50 text-blue-600",
                            delay: "0"
                        },
                        {
                            icon: FileText,
                            title: "2. Design Draft",
                            desc: "We create a stunning homepage draft for your review within 48 hours.",
                            color: "bg-purple-50 text-purple-600",
                            delay: "100"
                        },
                        {
                            icon: MessageSquare,
                            title: "3. Feedback",
                            desc: "Leave comments directly on the design. We iterate until it's perfect.",
                            color: "bg-pink-50 text-pink-600",
                            delay: "200"
                        },
                        {
                            icon: CheckCircle,
                            title: "4. Launch",
                            desc: "We build, optimize, and launch your site to the world.",
                            color: "bg-green-50 text-green-600",
                            delay: "300"
                        }
                    ].map((step, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${step.color}`}>
                                <step.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Pointers / FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <HelpCircle className="w-6 h-6 text-brand-purple" />
                        <h2 className="text-xl font-bold text-gray-900">Quick Tips for Success</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            "Have your logo and brand colors ready for the onboarding wizard.",
                            "The more specific you are about your target audience, the better.",
                            "You can invite team members to collaborate in the Settings menu.",
                            "Need a custom feature? Just ask us in the chat!"
                        ].map((tip, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-brand-purple/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-brand-purple">{i + 1}</span>
                                </div>
                                <p className="text-gray-600 text-sm">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-xl mb-2">Need Help?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Our concierge team is standing by to help you get set up.
                        </p>
                    </div>
                    <Link
                        href="/messages"
                        className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold text-center hover:bg-gray-100 transition-colors"
                    >
                        Open Chat
                    </Link>
                </div>
            </div>

        </div>
    );
}
