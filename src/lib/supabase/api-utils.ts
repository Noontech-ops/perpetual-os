import { createClient } from './server';
import { NextResponse } from 'next/server';

export async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { supabase, user };
}

export async function getOrgId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', userId)
    .single();
  return data?.organization_id ?? null;
}
