import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('public_profile', true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const orgId = (data as { id: string }).id;
    const [{ data: programs }, { data: outcomes }] = await Promise.all([
      supabase.from('programs').select('*').eq('organization_id', orgId),
      supabase.from('outcomes').select('*').eq('organization_id', orgId),
    ]);

    return NextResponse.json({ ...data, programs: programs ?? [], outcomes: outcomes ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch organization';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
