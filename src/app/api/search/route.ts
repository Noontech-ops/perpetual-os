import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  const sector = request.nextUrl.searchParams.get('sector');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json([]);
  }

  const supabase = await createClient();
  let query = supabase
    .from('organizations')
    .select('id, name, mission, sector, address, financials, leadership')
    .eq('public_profile', true);

  if (q) {
    query = query.or(`name.ilike.%${q}%,mission.ilike.%${q}%`);
  }
  if (sector) {
    query = query.eq('sector', sector);
  }

  const { data, error } = await query.limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
