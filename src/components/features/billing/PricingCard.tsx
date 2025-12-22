"use client"

import React from "react"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanDetails, useBillingStore } from "@/lib/store/billing-store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PricingCardProps {
    plan: PlanDetails
}

export const PricingCard = ({ plan }: PricingCardProps) => {
    const { currentPlan, upgradePlan, downgradePlan, isLoading } = useBillingStore()
    const isCurrent = currentPlan === plan.id

    // Simple logic to determine if it's an upgrade or downgrade
    const planLevels = { starter: 1, growth: 2, pro: 3 }
    const currentLevel = planLevels[currentPlan]
    const targetLevel = planLevels[plan.id]
    const isUpgrade = targetLevel > currentLevel

    const handleAction = async () => {
        if (isCurrent) return

        if (isUpgrade) {
            await upgradePlan(plan.id)
            toast.success(`Upgraded to ${plan.name} plan!`)
        } else {
            await downgradePlan(plan.id)
            toast.success(`Switched to ${plan.name} plan`)
        }
    }

    return (
        <Card className={cn(
            "relative flex flex-col transition-all duration-200",
            isCurrent ? "border-brand-purple shadow-brand scale-105 z-10" : "hover:border-brand-purple/50 hover:shadow-lg"
        )}>
            {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-purple text-white px-3 py-1 rounded-full text-xs font-bold">
                    Current Plan
                </div>
            )}

            <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>Perfect for {plan.pages} page sites</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">£{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                </div>

                <ul className="space-y-2">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-brand-purple" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full gap-2"
                    variant={isCurrent ? "outline" : "default"}
                    onClick={handleAction}
                    disabled={isCurrent || isLoading}
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isCurrent ? "Active" : isUpgrade ? "Upgrade" : "Downgrade"}
                </Button>
            </CardFooter>
        </Card>
    )
}
