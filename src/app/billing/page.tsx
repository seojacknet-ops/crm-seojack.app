import { BillingDashboard } from "@/components/features/billing/BillingDashboard"

export default function BillingPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Subscription</h1>
                <p className="text-muted-foreground">Manage your plan, payment methods, and billing history.</p>
            </div>

            <BillingDashboard />
        </div>
    )
}
