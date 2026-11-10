import { NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/api-utils';

export async function GET() {
  try {
    const auth = await getAuthenticatedClient();
    if ('error' in auth) return auth.error;
    const { supabase, user } = auth;

    const { data: profile } = await supabase
      .from('donor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'No donor profile' }, { status: 404 });

    const { data, error } = await supabase
      .from('giving_transactions')
      .select('*')
      .eq('donor_profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch donations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthenticatedClient();
    if ('error' in auth) return auth.error;
    const { supabase, user } = auth;

    const { data: profile } = await supabase
      .from('donor_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!profile) return NextResponse.json({ error: 'No donor profile' }, { status: 404 });

    const body = await request.json();

    const feeRates: Record<string, number> = {
      card: 0.02, ach: 0.005, daf: 0, stock: 0.01,
      crypto: 0.015, qcd: 0, wire: 0.005, check: 0, bequest_intent: 0,
    };
    const feePercent = feeRates[body.method] ?? 0.02;
    const fee = Math.round(body.amount * feePercent * 100) / 100;

    const { data, error } = await supabase
      .from('giving_transactions')
      .insert({
        donor_profile_id: profile.id,
        organization_id: body.organization_id,
        amount: body.amount,
        method: body.method,
        fee,
        fee_percent: feePercent * 100,
        net_to_org: body.amount - fee,
        designation: body.designation,
        status: body.status || 'pending',
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create donation';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
