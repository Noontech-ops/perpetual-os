import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY not configured');
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

export const FEE_RATES: Record<string, number> = {
  card: 0.02,
  ach: 0.005,
  daf: 0,
  stock: 0.01,
  crypto: 0.015,
  qcd: 0,
  wire: 0.005,
  check: 0,
  bequest_intent: 0,
};
