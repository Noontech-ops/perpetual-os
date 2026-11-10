import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const accounts = [
  {
    email: 'ekim@forerunnerventures.com',
    password: 'Perpetual2026!',
    full_name: 'Eurie Kim',
    role: 'org_admin',
    organization_id: 'org-001',
  },
  {
    email: 'inoon@forerunnerventures.com',
    password: 'Perpetual2026!',
    full_name: 'Ibrahim Noon',
    role: 'org_admin',
    organization_id: 'org-001',
  },
  {
    email: 'donor@perpetualoutcomes.com',
    password: 'Perpetual2026!',
    full_name: 'Test Donor',
    role: 'donor',
    organization_id: null,
  },
];

async function setup() {
  for (const account of accounts) {
    console.log(`Creating ${account.email}...`);

    const { data: existing } = await supabase.auth.admin.listUsers();
    const exists = existing?.users?.find(u => u.email === account.email);

    if (exists) {
      console.log(`  Already exists (${exists.id}). Updating profile...`);
      await supabase.from('profiles').upsert({
        id: exists.id,
        email: account.email,
        full_name: account.full_name,
        role: account.role,
        organization_id: account.organization_id,
      }, { onConflict: 'id' });
      console.log(`  Profile updated.`);
      continue;
    }

    const { data: user, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { full_name: account.full_name, role: account.role },
    });

    if (error) {
      console.error(`  Error: ${error.message}`);
      continue;
    }

    console.log(`  Created (${user.user.id})`);

    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.user.id,
      email: account.email,
      full_name: account.full_name,
      role: account.role,
      organization_id: account.organization_id,
    }, { onConflict: 'id' });

    if (profileError) {
      console.error(`  Profile error: ${profileError.message}`);
    } else {
      console.log(`  Profile linked to org ${account.organization_id || '(none - donor)'}`);
    }

    if (account.role === 'donor') {
      await supabase.from('donor_profiles').insert({
        user_id: user.user.id,
        display_name: account.full_name,
        interests: ['education', 'health'],
        geographic_focus: ['local', 'regional'],
        total_given: 0,
      });
      console.log(`  Donor profile created.`);
    }
  }

  console.log('\nDone! Accounts ready:');
  console.log('  ekim@forerunnerventures.com / Perpetual2026! (org admin)');
  console.log('  inoon@forerunnerventures.com / Perpetual2026! (org admin)');
  console.log('  donor@perpetualoutcomes.com / Perpetual2026! (donor)');
}

setup().catch(console.error);
