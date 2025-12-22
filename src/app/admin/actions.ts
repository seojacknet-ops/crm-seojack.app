'use server';

import { stripe } from '@/lib/stripe/server';

export interface StripeStats {
    totalRevenue: number;
    activeSubscribers: number;
}

export async function getStripeStats(): Promise<StripeStats> {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn('STRIPE_SECRET_KEY is missing. Returning 0 revenue.');
            return { totalRevenue: 0, activeSubscribers: 0 };
        }

        // Fetch all active subscriptions
        // Limit to 100 for now, but pagination handles larger sets if needed later
        const subscriptions = await stripe.subscriptions.list({
            status: 'active',
            limit: 100,
            expand: ['data.items.data.price'],
        });

        let totalRevenue = 0;

        subscriptions.data.forEach((sub) => {
            // Calculate monthly value for each subscription
            sub.items.data.forEach((item) => {
                const price = item.price;
                if (!price.unit_amount) return;

                let amount = price.unit_amount;

                // Adjust for non-monthly intervals if necessary (normalize to MRR)
                if (price.recurring?.interval === 'year') {
                    amount = Math.round(amount / 12);
                } else if (price.recurring?.interval === 'week') {
                    amount = amount * 4; // Approx
                }

                // Add quantity
                totalRevenue += amount * (item.quantity || 1);
            });
        });

        // specific check for discounts/coupons could be added here

        return {
            totalRevenue: totalRevenue / 100, // Convert cents to base unit (e.g. GBP/USD)
            activeSubscribers: subscriptions.data.length
        };

    } catch (error) {
        console.error('Error fetching Stripe stats:', error);
        return { totalRevenue: 0, activeSubscribers: 0 };
    }
}
