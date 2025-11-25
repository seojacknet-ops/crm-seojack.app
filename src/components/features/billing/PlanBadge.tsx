"use client"

import React from "react"
import { useBillingStore, PLANS } from "@/lib/store/billing-store"
import { cn } from "@/lib/utils"

interface PlanBadgeProps {
    className?: string
}

export const PlanBadge = ({ className }: PlanBadgeProps) => {
    const { currentPlan } = useBillingStore()
    const plan = PLANS[currentPlan]

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
            currentPlan === 'pro' && "bg-brand-purple/10 text-brand-purple border border-brand-purple/20",
            currentPlan === 'growth' && "bg-blue-500/10 text-blue-500 border border-blue-500/20",
            currentPlan === 'starter' && "bg-gray-500/10 text-gray-500 border border-gray-500/20",
            className
        )}>
            {plan.name} Plan
        </span>
    )
}
