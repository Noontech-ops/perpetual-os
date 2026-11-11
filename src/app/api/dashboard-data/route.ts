import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as mock from '@/lib/mock-data';

export async function GET() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({
        org: mock.organization,
        programs: mock.programs,
        outcomes: mock.outcomes,
        agents: mock.agentConfigs,
      });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        org: mock.organization,
        programs: mock.programs,
        outcomes: mock.outcomes,
        agents: mock.agentConfigs,
      });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    const orgId = profile?.organization_id;

    if (!orgId) {
      return NextResponse.json({
        org: mock.organization,
        programs: mock.programs,
        outcomes: mock.outcomes,
        agents: mock.agentConfigs,
      });
    }

    const [orgRes, progsRes, outcomesRes, agentsRes] = await Promise.all([
      supabase.from('organizations').select('*').eq('id', orgId).single(),
      supabase.from('programs').select('*').eq('organization_id', orgId),
      supabase.from('outcomes').select('*').eq('organization_id', orgId),
      supabase.from('agent_configs').select('*').eq('organization_id', orgId),
    ]);

    return NextResponse.json({
      org: orgRes.data ?? mock.organization,
      programs: progsRes.data ?? mock.programs,
      outcomes: outcomesRes.data ?? mock.outcomes,
      agents: agentsRes.data ?? mock.agentConfigs,
    });
  } catch {
    return NextResponse.json({
      org: mock.organization,
      programs: mock.programs,
      outcomes: mock.outcomes,
      agents: mock.agentConfigs,
    });
  }
}
