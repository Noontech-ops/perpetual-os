import { NextResponse } from 'next/server';
import { FEE_RATES } from '@/lib/stripe/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, method, organizationName, designation, email } = body;

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Amount must be at least $1' }, { status: 400 });
    }

    const feeRate = FEE_RATES[method] ?? 0.02;
    const fee = Math.round(amount * feeRate * 100) / 100;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ demo: true, fee, netToOrg: amount - fee });
    }

    const { getStripe } = await import('@/lib/stripe/server');
    const stripe = getStripe();
    const amountCents = Math.round(amount * 100);

    const intent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        organization_name: organizationName || '',
        designation: designation || 'Unrestricted',
        giving_method: method,
        fee: fee.toString(),
        net_to_org: (amount - fee).toString(),
      },
      receipt_email: email,
      description: `Donation to ${organizationName}${designation ? ` — ${designation}` : ''}`,
    });

    return NextResponse.json({
      clientSecret: intent.client_secret,
      fee,
      netToOrg: amount - fee,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
