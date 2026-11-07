-- Perpetual — Core Schema
-- Mirrors src/lib/types.ts

-- Custom types
create type constituent_type as enum ('donor', 'funder', 'client', 'volunteer', 'board', 'staff');
create type restriction_level as enum ('unrestricted', 'temporarily_restricted', 'permanently_restricted');
create type transaction_direction as enum ('inflow', 'outflow');
create type transaction_category as enum (
  'individual_donation', 'foundation_grant', 'corporate_gift', 'government_grant',
  'earned_revenue', 'event_revenue', 'investment_income',
  'salary', 'benefits', 'rent', 'supplies', 'professional_services',
  'program_expense', 'travel', 'technology', 'insurance', 'depreciation',
  'fundraising_expense', 'management_general', 'other'
);
create type program_status as enum ('active', 'planned', 'paused', 'completed');
create type grant_status as enum ('prospect', 'applied', 'awarded', 'active', 'reporting', 'closed', 'declined');
create type giving_method as enum ('card', 'ach', 'daf', 'stock', 'crypto', 'qcd', 'wire', 'check', 'bequest_intent');
create type agent_type as enum ('grants', 'donor_relations', 'finance', 'compliance', 'marketing', 'board');
create type agent_action_status as enum ('auto_approved', 'pending', 'approved', 'rejected');
create type sector as enum (
  'education', 'health', 'housing', 'workforce', 'environment',
  'arts_culture', 'community', 'human_services', 'science', 'essential_rights'
);
create type user_role as enum ('org_admin', 'org_staff', 'donor', 'public');

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text,
  role user_role not null default 'public',
  organization_id text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Organizations
create table organizations (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  legal_name text,
  ein text,
  mission text,
  vision text,
  sector sector default 'education',
  founded date,
  website text,
  address jsonb default '{}'::jsonb,
  phone text,
  email text,
  leadership jsonb default '[]'::jsonb,
  financials jsonb default '{}'::jsonb,
  public_profile boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Constituents
create table constituents (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  type constituent_type not null,
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  org_affiliation text,
  title text,
  address jsonb,
  tags text[] default '{}',
  giving_history jsonb default '{}'::jsonb,
  engagement_score integer default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Programs
create table programs (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  description text,
  sector sector default 'education',
  status program_status default 'active',
  start_date date,
  end_date date,
  annual_budget numeric default 0,
  ytd_spend numeric default 0,
  staff_count integer default 0,
  clients_served integer default 0,
  created_at timestamptz default now()
);

-- Outcomes
create table outcomes (
  id text primary key default gen_random_uuid()::text,
  program_id text not null references programs(id) on delete cascade,
  organization_id text not null references organizations(id) on delete cascade,
  sector sector default 'education',
  reporting_period text,
  metrics jsonb default '[]'::jsonb,
  narrative text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- Grants
create table grants (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  funder_id text references constituents(id),
  funder_name text,
  program_id text references programs(id),
  name text not null,
  status grant_status default 'prospect',
  amount_requested numeric default 0,
  amount_awarded numeric,
  amount_spent numeric default 0,
  restriction restriction_level default 'unrestricted',
  start_date date,
  end_date date,
  deadlines jsonb default '[]'::jsonb,
  requirements text[] default '{}',
  probability integer,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Transactions
create table transactions (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  date date not null,
  direction transaction_direction not null,
  amount numeric not null,
  category transaction_category not null,
  restriction restriction_level default 'unrestricted',
  description text,
  constituent_id text references constituents(id),
  grant_id text references grants(id),
  program_id text references programs(id),
  account_code text,
  memo text,
  reconciled boolean default false,
  created_at timestamptz default now()
);

-- Agent configs
create table agent_configs (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  type agent_type not null,
  name text not null,
  description text,
  scope text[] default '{}',
  approval_threshold numeric default 0,
  enabled boolean default false,
  last_run_at timestamptz,
  actions_today integer default 0,
  actions_pending integer default 0,
  unique (organization_id, type)
);

-- Agent actions
create table agent_actions (
  id text primary key default gen_random_uuid()::text,
  organization_id text not null references organizations(id) on delete cascade,
  agent_type agent_type not null,
  action text not null,
  description text,
  status agent_action_status default 'pending',
  evidence text,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Donor profiles (Perpetual Outcomes side)
create table donor_profiles (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references profiles(id) on delete cascade,
  display_name text,
  interests sector[] default '{}',
  geographic_focus text[] default '{}',
  giving_budget jsonb,
  total_given numeric default 0,
  joined_at timestamptz default now()
);

-- Giving transactions (marketplace)
create table giving_transactions (
  id text primary key default gen_random_uuid()::text,
  donor_profile_id text not null references donor_profiles(id) on delete cascade,
  organization_id text not null references organizations(id) on delete cascade,
  amount numeric not null,
  method giving_method not null,
  fee numeric default 0,
  fee_percent numeric default 0,
  net_to_org numeric not null,
  status text default 'pending',
  acknowledgment_sent boolean default false,
  tax_receipt_issued boolean default false,
  designation text,
  created_at timestamptz default now()
);

-- RLS policies
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table constituents enable row level security;
alter table programs enable row level security;
alter table outcomes enable row level security;
alter table grants enable row level security;
alter table transactions enable row level security;
alter table agent_configs enable row level security;
alter table agent_actions enable row level security;
alter table donor_profiles enable row level security;
alter table giving_transactions enable row level security;

-- Profiles: users can read/update their own
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Organizations: org members can read, admins can write. Public orgs readable by all.
create policy "Org members can read their org" on organizations for select
  using (
    public_profile = true
    or id in (select organization_id from profiles where id = auth.uid())
  );
create policy "Org admins can update" on organizations for update
  using (id in (select organization_id from profiles where id = auth.uid() and role = 'org_admin'));
create policy "Org admins can insert" on organizations for insert
  with check (true);

-- Constituents: org members only
create policy "Org members can read constituents" on constituents for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can write constituents" on constituents for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can update constituents" on constituents for update
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can delete constituents" on constituents for delete
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Programs: org members read/write, public orgs readable by all
create policy "Programs readable by org or public" on programs for select
  using (
    organization_id in (select organization_id from profiles where id = auth.uid())
    or organization_id in (select id from organizations where public_profile = true)
  );
create policy "Org members can write programs" on programs for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can update programs" on programs for update
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Outcomes: same as programs
create policy "Outcomes readable by org or public" on outcomes for select
  using (
    organization_id in (select organization_id from profiles where id = auth.uid())
    or organization_id in (select id from organizations where public_profile = true)
  );
create policy "Org members can write outcomes" on outcomes for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Grants: org members only
create policy "Org members can read grants" on grants for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can write grants" on grants for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can update grants" on grants for update
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Transactions: org members only
create policy "Org members can read transactions" on transactions for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can write transactions" on transactions for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Agent configs: org members
create policy "Org members can read agent configs" on agent_configs for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org admins can write agent configs" on agent_configs for update
  using (organization_id in (select organization_id from profiles where id = auth.uid() and role = 'org_admin'));

-- Agent actions: org members
create policy "Org members can read agent actions" on agent_actions for select
  using (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can write agent actions" on agent_actions for insert
  with check (organization_id in (select organization_id from profiles where id = auth.uid()));
create policy "Org members can update agent actions" on agent_actions for update
  using (organization_id in (select organization_id from profiles where id = auth.uid()));

-- Donor profiles: owner reads own, public listing for marketplace
create policy "Donors read own profile" on donor_profiles for select
  using (user_id = auth.uid());
create policy "Donors can insert own profile" on donor_profiles for insert
  with check (user_id = auth.uid());
create policy "Donors can update own profile" on donor_profiles for update
  using (user_id = auth.uid());

-- Giving transactions: donor reads own, org sees theirs
create policy "Donors read own giving" on giving_transactions for select
  using (
    donor_profile_id in (select id from donor_profiles where user_id = auth.uid())
    or organization_id in (select organization_id from profiles where id = auth.uid())
  );
create policy "Donors can insert giving" on giving_transactions for insert
  with check (donor_profile_id in (select id from donor_profiles where user_id = auth.uid()));

-- Indexes
create index idx_constituents_org on constituents(organization_id);
create index idx_constituents_type on constituents(type);
create index idx_programs_org on programs(organization_id);
create index idx_outcomes_program on outcomes(program_id);
create index idx_outcomes_org on outcomes(organization_id);
create index idx_grants_org on grants(organization_id);
create index idx_grants_status on grants(status);
create index idx_transactions_org on transactions(organization_id);
create index idx_transactions_date on transactions(date);
create index idx_agent_actions_org on agent_actions(organization_id);
create index idx_agent_actions_status on agent_actions(status);
create index idx_giving_transactions_donor on giving_transactions(donor_profile_id);
create index idx_giving_transactions_org on giving_transactions(organization_id);

-- Trigger for updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on profiles for each row execute function update_updated_at();
create trigger set_updated_at before update on organizations for each row execute function update_updated_at();
create trigger set_updated_at before update on constituents for each row execute function update_updated_at();
create trigger set_updated_at before update on grants for each row execute function update_updated_at();

-- Function to handle new user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name',
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'public'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
