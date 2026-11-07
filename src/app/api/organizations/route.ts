import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getOrgId } from '@/lib/supabase/api-utils';

export async function GET() {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 404 });

  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 404 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('organizations')
    .update(body)
    .eq('id', orgId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
