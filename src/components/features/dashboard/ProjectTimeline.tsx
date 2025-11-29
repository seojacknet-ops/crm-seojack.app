import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ProjectTimelineProps {
    currentStep?: number;
    totalSteps?: number;
}

export const ProjectTimeline = ({ currentStep = 1, totalSteps = 5 }: ProjectTimelineProps) => {
    const steps = [
        { label: 'Onboarding', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'pending', desc: 'Complete' },
        { label: 'Design', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'pending', desc: 'In Progress' },
        { label: 'Development', status: currentStep > 3 ? 'completed' : currentStep === 3 ? 'current' : 'pending', desc: 'Upcoming' },
        { label: 'Review', status: currentStep > 4 ? 'completed' : currentStep === 4 ? 'current' : 'pending', desc: 'Upcoming' },
        { label: 'Live', status: currentStep > 5 ? 'completed' : currentStep === 5 ? 'current' : 'pending', desc: 'Upcoming' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Project Milestones</h2>
            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -translate-y-1/2 hidden sm:block"></div>
                <div
                    className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-green-500 to-brand-purple -translate-y-1/2 hidden sm:block transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {steps.map((step, idx) => (
                        <div key={step.label} className="flex flex-col items-center text-center bg-white sm:bg-transparent p-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all ${step.status === 'completed'
                                ? 'bg-green-500 border-green-100 text-white shadow-lg shadow-green-500/20' :
                                step.status === 'current'
                                    ? 'bg-brand-purple border-brand-purple/20 text-white animate-pulse shadow-lg shadow-brand-purple/30' :
                                    'bg-white border-gray-200 text-gray-300'
                                }`}>
                                {step.status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
                            </div>
                            <p className={`mt-3 text-sm font-bold ${step.status === 'current' ? 'text-brand-purple' :
                                step.status === 'completed' ? 'text-green-600' : 'text-gray-500'
                                }`}>{step.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
