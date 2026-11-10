import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  const { default: StripeLib } = await import('stripe');
  const stripe = new StripeLib(stripeKey);

  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } else {
    // Dev mode: parse without signature verification
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Webhook: Missing Supabase credentials');
    return NextResponse.json({ received: true });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment succeeded: ${intent.id}, amount: ${intent.amount / 100}`);

      const { data: tx } = await supabase
        .from('giving_transactions')
        .select('*')
        .eq('stripe_payment_intent_id', intent.id)
        .single();

      if (tx) {
        await supabase
          .from('giving_transactions')
          .update({
            status: 'completed',
            acknowledgment_sent: false,
            tax_receipt_issued: false,
          })
          .eq('id', tx.id);

        if (tx.organization_id) {
          const amountDollars = intent.amount / 100;
          const category = amountDollars >= 1000 ? 'foundation_grant' : 'individual_donation';

          await supabase.from('transactions').insert({
            organization_id: tx.organization_id,
            description: `Donation via ${intent.metadata.giving_method || 'card'}`,
            amount: amountDollars,
            date: new Date().toISOString().split('T')[0],
            direction: 'inflow',
            category,
            restriction: tx.designation === 'general' ? 'unrestricted' : 'temporarily_restricted',
          });
        }

        if (tx.donor_profile_id) {
          const { data: profile } = await supabase
            .from('donor_profiles')
            .select('total_given')
            .eq('id', tx.donor_profile_id)
            .single();

          if (profile) {
            await supabase
              .from('donor_profiles')
              .update({ total_given: (profile.total_given || 0) + tx.amount })
              .eq('id', tx.donor_profile_id);
          }
        }

        // Send receipt email
        try {
          const { sendDonationReceipt } = await import('@/lib/email/resend');
          const donorEmail = intent.metadata.donor_email || intent.receipt_email;
          if (donorEmail) {
            const { data: orgData } = tx.organization_id
              ? await supabase.from('organizations').select('name, ein').eq('id', tx.organization_id).single()
              : { data: null };

            await sendDonationReceipt({
              donorName: intent.metadata.donor_email?.split('@')[0] || 'Donor',
              donorEmail,
              orgName: orgData?.name || intent.metadata.organization_name || 'Organization',
              amount: tx.amount,
              date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
              ein: orgData?.ein,
            });

            await supabase
              .from('giving_transactions')
              .update({ acknowledgment_sent: true, tax_receipt_issued: true })
              .eq('id', tx.id);
          }
        } catch (emailErr) {
          console.error('Receipt email failed:', emailErr);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment failed: ${intent.id}`);

      await supabase
        .from('giving_transactions')
        .update({ status: 'failed' })
        .eq('stripe_payment_intent_id', intent.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
