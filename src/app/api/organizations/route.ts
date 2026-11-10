import { NextResponse } from 'next/server';
import { getAuthenticatedClient, getOrgId } from '@/lib/supabase/api-utils';

export async function POST(request: Request) {
  const auth = await getAuthenticatedClient();
  if ('error' in auth) return auth.error;
  const { supabase, user } = auth;

  const existing = await getOrgId(supabase, user.id);
  if (existing) return NextResponse.json({ error: 'User already has an organization' }, { status: 409 });

  const body = await request.json();
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      name: body.name,
      legal_name: body.legalName || body.name,
      ein: body.ein || null,
      mission: body.mission || null,
      sector: body.sector || 'education',
      public_profile: true,
    })
    .select()
    .single();

  if (orgError) return NextResponse.json({ error: orgError.message }, { status: 500 });

  await supabase
    .from('profiles')
    .update({ organization_id: org.id, role: 'org_admin' })
    .eq('id', user.id);

  if (body.programs && Array.isArray(body.programs)) {
    const validPrograms = body.programs.filter((p: { name: string }) => p.name?.trim());
    if (validPrograms.length > 0) {
      await supabase.from('programs').insert(
        validPrograms.map((p: { name: string; description?: string }) => ({
          organization_id: org.id,
          name: p.name,
          description: p.description || null,
          sector: body.sector || 'education',
          status: 'active',
        }))
      );
    }
  }

  if (body.agents && Array.isArray(body.agents)) {
    await supabase.from('agent_configs').insert(
      body.agents.map((agentType: string) => ({
        organization_id: org.id,
        type: agentType,
        name: agentType.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) + ' Agent',
        enabled: true,
        approval_threshold: agentType === 'finance' ? 10000 : agentType === 'grants' ? 5000 : 1000,
      }))
    );
  }

  return NextResponse.json(org, { status: 201 });
}

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
