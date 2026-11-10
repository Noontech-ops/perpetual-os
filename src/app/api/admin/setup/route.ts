import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not configured' },
      { status: 503 }
    );
  }

  const adminSecret = process.env.ADMIN_SETUP_SECRET;
  const authHeader = request.headers.get('authorization');
  if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const body = await request.json();
  const users: { email: string; name: string; role: string; password?: string }[] = body.users;
  if (!Array.isArray(users) || users.length === 0) {
    return NextResponse.json({ error: 'users array required' }, { status: 400 });
  }

  const results = [];

  for (const u of users) {
    const password = u.password || 'Perpetual2026!';

    const { data: existing } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', u.email)
      .maybeSingle();

    if (existing) {
      results.push({ email: u.email, status: 'already_exists', id: existing.id });
      continue;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: u.name, role: u.role },
    });

    if (authError) {
      results.push({ email: u.email, status: 'error', error: authError.message });
      continue;
    }

    results.push({
      email: u.email,
      status: 'created',
      id: authData.user.id,
      password,
    });
  }

  return NextResponse.json({ results });
}
