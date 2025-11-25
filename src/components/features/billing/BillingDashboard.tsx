"use client"

import React from "react"
import { useBillingStore, PLANS } from "@/lib/store/billing-store"
import { PricingCard } from "./PricingCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar, AlertCircle } from "lucide-react"
import { PlanBadge } from "./PlanBadge"

export const BillingDashboard = () => {
    const { currentPlan, status, nextBillingDate, paymentMethod, cancelPlan } = useBillingStore()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Current Subscription Card */}
                <Card className="flex-1">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Current Subscription</CardTitle>
                            <PlanBadge />
                        </div>
                        <CardDescription>Manage your plan and billing details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-background rounded-md border">
                                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-sm">{paymentMethod}</p>
                                    <p className="text-xs text-muted-foreground">Expires 12/28</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">Update</Button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Next billing date: {formatDate(nextBillingDate)}</span>
                        </div>

                        {status === 'active' && (
                            <Button
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full justify-start px-0"
                                onClick={() => {
                                    if (confirm('Are you sure you want to cancel?')) cancelPlan()
                                }}
                            >
                                Cancel Subscription
                            </Button>
                        )}

                        {status === 'canceled' && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                <span>Your subscription will end on {formatDate(nextBillingDate)}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Usage Stats (Mock) */}
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle>Usage</CardTitle>
                        <CardDescription>Your current plan usage</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Pages Published</span>
                                <span className="font-medium">3 / {PLANS[currentPlan].pages}</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-purple transition-all duration-500"
                                    style={{ width: `${(3 / PLANS[currentPlan].pages) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Storage Used</span>
                                <span className="font-medium">1.2 GB / 5 GB</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-accent-pink transition-all duration-500"
                                    style={{ width: '24%' }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plans Grid */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PricingCard plan={PLANS.starter} />
                    <PricingCard plan={PLANS.growth} />
                    <PricingCard plan={PLANS.pro} />
                </div>
            </div>
        </div>
    )
}
