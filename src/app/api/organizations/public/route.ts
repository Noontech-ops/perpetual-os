import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as mock from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get('slug');
    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      if (slug === 'bay-area-literacy-coalition') {
        return NextResponse.json(mock.organization);
      }
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .eq('public_profile', true)
      .single();

    if (error || !data) {
      if (slug === 'bay-area-literacy-coalition') {
        return NextResponse.json(mock.organization);
      }
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch organization';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
