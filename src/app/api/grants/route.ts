import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient, getOrgId } from '@/lib/supabase/api-utils';

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 404 });

  const status = request.nextUrl.searchParams.get('status');
  let query = supabase.from('grants').select('*').eq('organization_id', orgId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query.order('updated_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 404 });

  const body = await request.json();
  const { data, error } = await supabase
    .from('grants')
    .insert({ ...body, organization_id: orgId })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
