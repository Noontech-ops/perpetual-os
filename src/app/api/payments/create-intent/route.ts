import { NextResponse } from 'next/server';
import { FEE_RATES } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, method, orgId, organizationName, designation, email } = body;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 });
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json({ error: 'Payments not configured', clientSecret: null }, { status: 503 });
    }

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);

    const feeRate = FEE_RATES[method] ?? 0.02;
    const fee = Math.round(amount * feeRate * 100) / 100;
    const amountCents = Math.round(amount * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
      metadata: {
        org_id: orgId || '',
        organization_name: organizationName || '',
        designation: designation || 'Unrestricted',
        giving_method: method,
        donor_email: email || '',
        fee: fee.toString(),
        net_to_org: (amount - fee).toString(),
        platform: 'perpetual',
      },
      receipt_email: email || undefined,
      description: `Donation to ${organizationName}${designation ? ` — ${designation}` : ''}`,
    });

    let transactionId: string | null = null;
    try {
      const { getAuthenticatedClient } = await import('@/lib/supabase/api-utils');
      const auth = await getAuthenticatedClient();
      if (!('error' in auth)) {
        const { supabase, user } = auth;
        const { data: profile } = await supabase
          .from('donor_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profile) {
          const { data: tx } = await supabase
            .from('giving_transactions')
            .insert({
              donor_profile_id: profile.id,
              organization_id: orgId || null,
              amount,
              method,
              fee,
              fee_percent: feeRate * 100,
              net_to_org: amount - fee,
              designation: designation || 'general',
              status: 'pending',
              stripe_payment_intent_id: intent.id,
            })
            .select('id')
            .single();
          transactionId = tx?.id ?? null;
        }
      }
    } catch {
      // Non-critical: transaction record will be created by webhook if this fails
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      transactionId,
      fee,
      netToOrg: amount - fee,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed';
    if (message.includes('STRIPE_SECRET_KEY') || message.includes('not configured')) {
      return NextResponse.json({ error: 'Payments not configured', clientSecret: null }, { status: 503 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
