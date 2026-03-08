import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  // @ts-expect-error Stripe API version types mismatch
  apiVersion: '2024-12-18.acacia', // Latest stable API version (2025+)
  typescript: true,
});
