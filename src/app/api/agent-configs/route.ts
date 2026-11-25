import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key || key === 'proxy-injected') {
      return NextResponse.json([], { status: 200 });
    }
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agent_configs')
      .select('*')
      .order('type');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch agent configs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
