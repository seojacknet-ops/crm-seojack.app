import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PlanTier = 'starter' | 'growth' | 'pro'

export interface PlanDetails {
    id: PlanTier
    name: string
    price: number
    pages: number
    features: string[]
}

export const PLANS: Record<PlanTier, PlanDetails> = {
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 499,
        pages: 5,
        features: ['5 Pages', 'Basic SEO', 'Standard Support', '1 Revision Round'],
    },
    growth: {
        id: 'growth',
        name: 'Growth',
        price: 999,
        pages: 10,
        features: ['10 Pages', 'Advanced SEO', 'Priority Support', '3 Revision Rounds', 'Blog Setup'],
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 1999,
        pages: 15,
        features: ['15 Pages', 'Premium SEO', '24/7 Concierge', 'Unlimited Revisions', 'E-commerce Ready'],
    },
}

interface BillingState {
    currentPlan: PlanTier
    status: 'active' | 'past_due' | 'canceled'
    nextBillingDate: string
    paymentMethod: string // Mocked "Visa ending in 4242"

    upgradePlan: (plan: PlanTier) => void
    downgradePlan: (plan: PlanTier) => void
    cancelPlan: () => void
}

export const useBillingStore = create<BillingState>()(
    persist(
        (set) => ({
            currentPlan: 'starter',
            status: 'active',
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: 'Visa ending in 4242',

            upgradePlan: (plan) => {
                // In a real app, this would call Stripe API
                console.log(`Upgrading to ${plan}`)
                set({ currentPlan: plan, status: 'active' })
            },
            downgradePlan: (plan) => {
                // In a real app, this would schedule a downgrade
                console.log(`Downgrading to ${plan}`)
                set({ currentPlan: plan }) // Immediate for mock
            },
            cancelPlan: () => {
                console.log('Canceling plan')
                set({ status: 'canceled' })
            },
        }),
        {
            name: 'seojack-billing-storage',
        }
    )
)
