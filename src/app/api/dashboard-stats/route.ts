import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getOrgId } from '@/lib/supabase/api-utils';

export async function GET() {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const orgId = await getOrgId(supabase, user.id);
  if (!orgId) return NextResponse.json({ error: 'No organization' }, { status: 404 });

  const [
    { count: totalDonors },
    { count: activeGrants },
    { count: pendingActions },
    { count: programCount },
    { data: inbound },
    { data: outbound },
  ] = await Promise.all([
    supabase.from('constituents').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('grants').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).in('status', ['submitted', 'approved']),
    supabase.from('agent_actions').select('*', { count: 'exact', head: true }).eq('organization_id', orgId).eq('status', 'pending'),
    supabase.from('programs').select('*', { count: 'exact', head: true }).eq('organization_id', orgId),
    supabase.from('transactions').select('amount').eq('organization_id', orgId).eq('direction', 'inbound'),
    supabase.from('transactions').select('amount').eq('organization_id', orgId).eq('direction', 'outbound'),
  ]);

  const totalRevenue = (inbound ?? []).reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const totalExpenses = (outbound ?? []).reduce((sum, t) => sum + (t.amount ?? 0), 0);

  return NextResponse.json({
    totalRevenue,
    totalExpenses,
    totalDonors: totalDonors ?? 0,
    activeGrants: activeGrants ?? 0,
    pendingActions: pendingActions ?? 0,
    programCount: programCount ?? 0,
  });
}
