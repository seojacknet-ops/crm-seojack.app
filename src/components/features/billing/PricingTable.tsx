import React from 'react';
import { Check } from 'lucide-react';

const plans = [
    {
        name: 'Starter',
        price: '£97',
        period: '/month',
        features: ['5 Pages', 'Basic SEO', 'Standard Support', '1 Revision Round'],
        popular: false,
    },
    {
        name: 'Growth',
        price: '£197',
        period: '/month',
        features: ['10 Pages', 'Advanced SEO', 'Priority Support', '3 Revision Rounds', 'Blog Setup'],
        popular: true,
    },
    {
        name: 'Pro',
        price: '£297',
        period: '/month',
        features: ['15+ Pages', 'Technical SEO', '24/7 Concierge', 'Unlimited Revisions', 'E-commerce'],
        popular: false,
    },
];

export const PricingTable = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
            {plans.map((plan) => (
                <div
                    key={plan.name}
                    className={`relative bg-white rounded-2xl shadow-xl p-8 border transition-transform hover:-translate-y-1 ${plan.popular ? 'border-brand-purple ring-2 ring-brand-purple ring-opacity-50' : 'border-gray-100'
                        }`}
                >
                    {plan.popular && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-purple text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                        </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                        <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                        <span className="ml-1 text-gray-500">{plan.period}</span>
                    </div>
                    <ul className="mt-6 space-y-4">
                        {plan.features.map((feature) => (
                            <li key={feature} className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 shrink-0" />
                                <span className="ml-3 text-gray-600">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`mt-8 w-full py-3 px-4 rounded-xl font-bold transition-colors ${plan.popular
                            ? 'bg-brand-purple text-white hover:bg-brand-purple-dark'
                            : 'bg-gray-50 text-brand-purple hover:bg-gray-100'
                            }`}
                    >
                        Choose {plan.name}
                    </button>
                </div>
            ))}
        </div>
    );
};
