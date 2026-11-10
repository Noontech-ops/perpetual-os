import { NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/api-utils';

export async function GET() {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const { data: profile } = await supabase
    .from('donor_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!profile) return NextResponse.json([]);

  return NextResponse.json([profile]);
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const body = await request.json();
  const { data, error } = await supabase
    .from('donor_profiles')
    .insert({ ...body, user_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
