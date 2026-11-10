import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function upsert(table: string, rows: Record<string, unknown>[]) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) {
    console.error(`  ERROR ${table}: ${error.message}`);
    return false;
  }
  console.log(`  ${table}: ${rows.length} row(s) upserted`);
  return true;
}

async function ensureSlugColumn() {
  // Set slug for existing org-001 if missing
  await supabase
    .from("organizations")
    .update({ slug: "bay-area-literacy-coalition" })
    .eq("id", "org-001")
    .is("slug", null);
}

const organizations = [
  {
    id: "org-002",
    name: "Stable Ground Housing",
    legal_name: "Stable Ground Housing Inc.",
    ein: "27-4518963",
    mission:
      "Providing stable, affordable housing and wraparound support services to families experiencing homelessness in the Denver metro area.",
    vision:
      "A Denver where every family has a safe and stable place to call home.",
    sector: "housing",
    founded: "2015-06-01",
    website: "https://stablegroundhousing.org",
    address: { street: "2100 Stout St, Suite 300", city: "Denver", state: "CO", zip: "80205" },
    phone: "(303) 555-0198",
    email: "info@stablegroundhousing.org",
    leadership: [
      { name: "Ana Gutierrez", title: "Executive Director", since: "2015-06-01", bio: "Former Denver Housing Authority policy director. 12 years in affordable housing." },
      { name: "Michael Torres", title: "Board Chair", since: "2017-03-15", bio: "Managing Partner at Torres Capital. Focused on impact investing in housing." },
      { name: "Rachel Adams", title: "Director of Programs", since: "2019-01-10", bio: "MSW from DU. Previously at Colorado Coalition for the Homeless." },
    ],
    financials: { fiscalYearEnd: "2026-12-31", annualBudget: 2100000, totalRevenue: 1850000, totalExpenses: 1720000, netAssets: 680000, cashOnHand: 310000, monthsOfRunway: 4 },
    public_profile: true,
    slug: "stable-ground-housing",
  },
  {
    id: "org-003",
    name: "Community Health Partners",
    legal_name: "Community Health Partners Inc.",
    ein: "58-7234561",
    mission:
      "Delivering primary care, behavioral health, and preventive services to uninsured and underinsured communities across metro Atlanta.",
    vision:
      "Health equity for every Atlanta resident, regardless of insurance status.",
    sector: "health",
    founded: "2012-09-15",
    website: "https://communityhealthatl.org",
    address: { street: "880 Martin Luther King Jr Dr SW", city: "Atlanta", state: "GA", zip: "30314" },
    phone: "(404) 555-0267",
    email: "info@communityhealthatl.org",
    leadership: [
      { name: "Dr. James Okafor", title: "CEO", since: "2012-09-15", bio: "Board-certified internist. Founded CHP after 10 years at Grady Memorial." },
      { name: "Dr. Priya Mehta", title: "Medical Director", since: "2015-03-01", bio: "Psychiatrist specializing in integrated behavioral health in safety-net clinics." },
      { name: "Lisa Washington", title: "COO", since: "2018-07-20", bio: "MBA from Emory. Previously VP of Operations at Piedmont Healthcare." },
    ],
    financials: { fiscalYearEnd: "2026-12-31", annualBudget: 4200000, totalRevenue: 3800000, totalExpenses: 3500000, netAssets: 1200000, cashOnHand: 520000, monthsOfRunway: 3 },
    public_profile: true,
    slug: "community-health-partners",
  },
  {
    id: "org-004",
    name: "Pacific Arts Collective",
    legal_name: "Pacific Arts Collective",
    ein: "93-6127845",
    mission:
      "Making arts education accessible to every young person in Portland through free after-school programs, public installations, and community studios.",
    vision:
      "A Portland where every young person has access to creative expression and arts education.",
    sector: "arts_culture",
    founded: "2017-01-20",
    website: "https://pacificartscollective.org",
    address: { street: "714 NW Davis St", city: "Portland", state: "OR", zip: "97209" },
    phone: "(503) 555-0134",
    email: "hello@pacificartscollective.org",
    leadership: [
      { name: "Maya Chen", title: "Executive Director", since: "2017-01-20", bio: "MFA from PNCA. Former arts educator at Portland Public Schools." },
      { name: "Carlos Rivera", title: "Artistic Director", since: "2018-05-01", bio: "Muralist and public artist. Work featured in 40+ cities worldwide." },
      { name: "Sarah Kim", title: "Development Director", since: "2020-09-15", bio: "8 years in arts fundraising. Previously at Oregon Shakespeare Festival." },
    ],
    financials: { fiscalYearEnd: "2026-12-31", annualBudget: 890000, totalRevenue: 780000, totalExpenses: 720000, netAssets: 290000, cashOnHand: 145000, monthsOfRunway: 4 },
    public_profile: true,
    slug: "pacific-arts-collective",
  },
  {
    id: "org-005",
    name: "GreenRoots Environmental",
    legal_name: "GreenRoots Environmental Inc.",
    ein: "74-8392156",
    mission:
      "Restoring urban ecosystems and building climate resilience through community-led conservation, urban farming, and environmental education in Central Texas.",
    vision:
      "A climate-resilient Central Texas where communities lead their own environmental future.",
    sector: "environment",
    founded: "2019-04-22",
    website: "https://greenrootsatx.org",
    address: { street: "1100 E 5th St, Suite 200", city: "Austin", state: "TX", zip: "78702" },
    phone: "(512) 555-0187",
    email: "info@greenrootsatx.org",
    leadership: [
      { name: "Marcus Johnson", title: "Executive Director", since: "2019-04-22", bio: "Environmental engineer turned activist. Led Austin's first urban farming cooperative." },
      { name: "Dr. Elena Vasquez", title: "Science Director", since: "2020-01-15", bio: "PhD in Ecology from UT Austin. Published researcher in urban ecosystem restoration." },
      { name: "Tony Hernandez", title: "Farm Director", since: "2020-06-01", bio: "Third-generation farmer. Manages 12 urban farm sites across Central Texas." },
    ],
    financials: { fiscalYearEnd: "2026-12-31", annualBudget: 1400000, totalRevenue: 1200000, totalExpenses: 1100000, netAssets: 480000, cashOnHand: 210000, monthsOfRunway: 4 },
    public_profile: true,
    slug: "greenroots-environmental",
  },
  {
    id: "org-006",
    name: "Digital Rights Alliance",
    legal_name: "Digital Rights Alliance Inc.",
    ein: "52-9481273",
    mission:
      "Defending digital privacy, free expression, and equitable access to technology through litigation, policy advocacy, and public education.",
    vision:
      "A digital world where every person's rights are protected and technology serves democracy.",
    sector: "essential_rights",
    founded: "2016-11-01",
    website: "https://digitalrightsalliance.org",
    address: { street: "1625 K St NW, Suite 800", city: "Washington", state: "DC", zip: "20006" },
    phone: "(202) 555-0243",
    email: "info@digitalrightsalliance.org",
    leadership: [
      { name: "Amara Washington", title: "Executive Director", since: "2016-11-01", bio: "Former ACLU technologist. Georgetown Law adjunct on digital civil liberties." },
      { name: "David Park", title: "Legal Director", since: "2018-02-15", bio: "First Amendment litigator. Argued 3 cases before the Supreme Court." },
      { name: "Jennifer Liu", title: "Policy Director", since: "2019-08-01", bio: "Former Senate Judiciary Committee staff. Expert in tech policy and AI governance." },
    ],
    financials: { fiscalYearEnd: "2026-12-31", annualBudget: 3600000, totalRevenue: 3200000, totalExpenses: 2900000, netAssets: 1800000, cashOnHand: 780000, monthsOfRunway: 6 },
    public_profile: true,
    slug: "digital-rights-alliance",
  },
];

const programs = [
  // org-002
  { id: "prog-004", organization_id: "org-002", name: "Family Housing First", description: "Rapid rehousing program connecting families experiencing homelessness with stable, affordable housing and 12 months of wraparound support.", sector: "housing", status: "active", start_date: "2016-01-01", annual_budget: 950000, ytd_spend: 680000, staff_count: 8, clients_served: 156 },
  { id: "prog-005", organization_id: "org-002", name: "Housing Stability Support", description: "Case management, employment coaching, and financial literacy services to help housed families maintain long-term stability.", sector: "housing", status: "active", start_date: "2017-03-01", annual_budget: 750000, ytd_spend: 520000, staff_count: 6, clients_served: 210 },
  { id: "prog-006", organization_id: "org-002", name: "Youth Transition Program", description: "Supportive housing and life-skills training for young adults ages 18-24 aging out of the foster care system.", sector: "housing", status: "active", start_date: "2020-01-01", annual_budget: 400000, ytd_spend: 290000, staff_count: 4, clients_served: 45 },
  // org-003
  { id: "prog-007", organization_id: "org-003", name: "Community Health Centers", description: "Three primary care locations across metro Atlanta providing comprehensive medical, dental, and behavioral health services to uninsured residents.", sector: "health", status: "active", start_date: "2012-09-15", annual_budget: 2400000, ytd_spend: 1800000, staff_count: 32, clients_served: 3214 },
  { id: "prog-008", organization_id: "org-003", name: "Mobile Health Van", description: "Bringing primary care, screenings, and vaccinations directly to underserved neighborhoods via a fully-equipped mobile clinic.", sector: "health", status: "active", start_date: "2019-06-01", annual_budget: 800000, ytd_spend: 580000, staff_count: 6, clients_served: 1847 },
  { id: "prog-009", organization_id: "org-003", name: "Behavioral Health Integration", description: "Embedding licensed counselors and psychiatrists into primary care settings for same-day mental health access.", sector: "health", status: "active", start_date: "2021-01-01", annual_budget: 1000000, ytd_spend: 720000, staff_count: 8, clients_served: 847 },
  // org-004
  { id: "prog-010", organization_id: "org-004", name: "Youth Arts Academy", description: "Free after-school arts education for K-12 students across 8 Portland schools, covering visual arts, music, theater, and digital media.", sector: "arts_culture", status: "active", start_date: "2017-09-01", annual_budget: 450000, ytd_spend: 340000, staff_count: 12, clients_served: 1847 },
  { id: "prog-011", organization_id: "org-004", name: "Community Studio", description: "Open-access studio space in the Pearl District providing free materials, tools, and mentorship to emerging artists of all ages.", sector: "arts_culture", status: "active", start_date: "2019-03-01", annual_budget: 240000, ytd_spend: 180000, staff_count: 4, clients_served: 520 },
  { id: "prog-012", organization_id: "org-004", name: "Public Art Initiative", description: "Commissioning and installing public artworks throughout Portland neighborhoods, with a focus on underrepresented communities.", sector: "arts_culture", status: "active", start_date: "2020-06-01", annual_budget: 200000, ytd_spend: 150000, staff_count: 3, clients_served: 23 },
  // org-005
  { id: "prog-013", organization_id: "org-005", name: "Urban Farm Network", description: "Operating 12 community farm sites across Austin, producing fresh food for food deserts and providing agricultural education.", sector: "environment", status: "active", start_date: "2019-04-22", annual_budget: 600000, ytd_spend: 450000, staff_count: 10, clients_served: 2100 },
  { id: "prog-014", organization_id: "org-005", name: "Watershed Restoration", description: "Restoring riparian buffers, removing invasive species, and improving water quality along Central Texas waterways.", sector: "environment", status: "active", start_date: "2020-09-01", annual_budget: 500000, ytd_spend: 380000, staff_count: 6, clients_served: 45 },
  { id: "prog-015", organization_id: "org-005", name: "Climate Education Corps", description: "Training high school and college students as climate educators who lead workshops in schools and community centers.", sector: "environment", status: "active", start_date: "2021-01-15", annual_budget: 300000, ytd_spend: 220000, staff_count: 5, clients_served: 2100 },
  // org-006
  { id: "prog-016", organization_id: "org-006", name: "Legal Defense Fund", description: "Impact litigation defending digital privacy, free expression, and technology access rights in federal and state courts.", sector: "essential_rights", status: "active", start_date: "2017-01-15", annual_budget: 1800000, ytd_spend: 1300000, staff_count: 12, clients_served: 7 },
  { id: "prog-017", organization_id: "org-006", name: "Policy Lab", description: "Legislative research, policy briefs, and direct advocacy with lawmakers on technology regulation, AI governance, and digital privacy.", sector: "essential_rights", status: "active", start_date: "2018-06-01", annual_budget: 1200000, ytd_spend: 900000, staff_count: 8, clients_served: 3 },
  { id: "prog-018", organization_id: "org-006", name: "Digital Literacy for Democracy", description: "Community workshops and online courses teaching digital rights, media literacy, and privacy protection to the public.", sector: "essential_rights", status: "active", start_date: "2020-03-01", annual_budget: 600000, ytd_spend: 450000, staff_count: 6, clients_served: 15000 },
];

const outcomes = [
  // org-002
  { id: "out-003", program_id: "prog-004", organization_id: "org-002", sector: "housing", reporting_period: "2026 Annual", metrics: [{ label: "Avg months housing stability", value: 18.3, unit: "months", target: 24, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Families maintaining housing 12mo", value: 89, unit: "percent", target: 95, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Families housed in 2026", value: 156, unit: "families", target: 180, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Housing stability continues to improve year-over-year. The average family now maintains housing for 18.3 months, up 8% from 2025." },
  { id: "out-004", program_id: "prog-005", organization_id: "org-002", sector: "housing", reporting_period: "2026 Annual", metrics: [{ label: "Families in case management", value: 210, unit: "families", target: 250, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Employment placement rate", value: 72, unit: "percent", target: 80, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Employment outcomes remain strong with 72% of participants finding stable employment within 6 months of enrollment." },
  // org-003
  { id: "out-005", program_id: "prog-007", organization_id: "org-003", sector: "health", reporting_period: "2026 Annual", metrics: [{ label: "Patients served with no prior access", value: 3214, unit: "patients", target: 3500, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Diabetes management compliance", value: 92, unit: "percent", target: 95, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Behavioral health visits", value: 847, unit: "visits", target: 1000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Patient volume grew 21% year-over-year, driven by expansion of the mobile health van to two additional neighborhoods." },
  { id: "out-006", program_id: "prog-009", organization_id: "org-003", sector: "health", reporting_period: "2026 Annual", metrics: [{ label: "Patients screened for depression", value: 2180, unit: "patients", target: 2500, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Follow-up appointment adherence", value: 78, unit: "percent", target: 85, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Behavioral health integration has reduced ER visits among enrolled patients by an estimated 34%." },
  // org-004
  { id: "out-007", program_id: "prog-010", organization_id: "org-004", sector: "arts_culture", reporting_period: "2026 Annual", metrics: [{ label: "Students enrolled", value: 1847, unit: "students", target: 2000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Public installations completed", value: 23, unit: "installations", target: 25, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Students reporting creative confidence", value: 94, unit: "percent", target: 95, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Student enrollment grew 15% year-over-year with the addition of two new school sites. Creative confidence surveys show consistently high results." },
  { id: "out-008", program_id: "prog-011", organization_id: "org-004", sector: "arts_culture", reporting_period: "2026 Annual", metrics: [{ label: "Studio visitors", value: 520, unit: "visitors", target: 600, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Artist exhibitions hosted", value: 12, unit: "exhibitions", target: 15, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Community Studio usage continues to grow. 12 exhibitions featuring 34 emerging artists from the program." },
  // org-005
  { id: "out-009", program_id: "prog-013", organization_id: "org-005", sector: "environment", reporting_period: "2026 Annual", metrics: [{ label: "Acres restored", value: 45, unit: "acres", target: 60, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Food produced", value: 12000, unit: "lbs", target: 15000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Students in climate education", value: 2100, unit: "students", target: 2500, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Restoration acreage grew 30% with the addition of 3 new sites along Waller Creek. Farm output exceeded expectations despite summer drought." },
  { id: "out-010", program_id: "prog-015", organization_id: "org-005", sector: "environment", reporting_period: "2026 Annual", metrics: [{ label: "Climate educators trained", value: 48, unit: "educators", target: 50, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Community workshops delivered", value: 156, unit: "workshops", target: 180, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Climate Education Corps nearly doubled in size. Educators reached 2,100 students across 18 schools." },
  // org-006
  { id: "out-011", program_id: "prog-016", organization_id: "org-006", sector: "essential_rights", reporting_period: "2026 Annual", metrics: [{ label: "Landmark cases filed", value: 7, unit: "cases", target: 10, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "State privacy laws influenced", value: 3, unit: "laws", target: 5, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "People trained in digital rights", value: 15000, unit: "people", target: 20000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Landmark caseload grew 40% year-over-year. Three state legislatures cited our amicus briefs in passing new digital privacy protections." },
  { id: "out-012", program_id: "prog-018", organization_id: "org-006", sector: "essential_rights", reporting_period: "2026 Annual", metrics: [{ label: "Workshop participants", value: 8500, unit: "participants", target: 10000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }, { label: "Online course completions", value: 6500, unit: "completions", target: 8000, periodStart: "2026-01-01", periodEnd: "2026-12-31" }], narrative: "Digital Literacy program expanded to 12 new cities. Online course platform launched in Q2 with strong enrollment." },
];

const constituents = [
  // org-002
  { id: "con-010", organization_id: "org-002", type: "funder", first_name: "Robert", last_name: "Chen", email: "rchen@coloradotrust.org", phone: "(303) 555-0301", org_affiliation: "The Colorado Trust", title: "Program Officer", tags: ["housing", "funder", "colorado"], giving_history: { totalLifetime: 150000, lastGiftAmount: 75000, lastGiftDate: "2026-03-15", averageGift: 75000, giftCount: 2, firstGiftDate: "2025-02-01" }, engagement_score: 85 },
  { id: "con-011", organization_id: "org-002", type: "donor", first_name: "Linda", last_name: "Morales", email: "linda.morales@gmail.com", phone: "(303) 555-0422", org_affiliation: null, title: null, tags: ["housing", "individual", "recurring"], giving_history: { totalLifetime: 12500, lastGiftAmount: 2500, lastGiftDate: "2026-08-01", averageGift: 2500, giftCount: 5, firstGiftDate: "2022-01-15" }, engagement_score: 72 },
  { id: "con-012", organization_id: "org-002", type: "funder", first_name: "Patricia", last_name: "Webb", email: "pwebb@grantmakers.org", phone: "(303) 555-0190", org_affiliation: "Colorado Housing Finance Authority", title: "Grants Manager", tags: ["housing", "government", "funder"], giving_history: { totalLifetime: 200000, lastGiftAmount: 100000, lastGiftDate: "2026-01-10", averageGift: 100000, giftCount: 2, firstGiftDate: "2024-07-01" }, engagement_score: 90 },
  // org-003
  { id: "con-013", organization_id: "org-003", type: "funder", first_name: "William", last_name: "Foster", email: "wfoster@healthcarega.org", phone: "(404) 555-0318", org_affiliation: "Healthcare Georgia Foundation", title: "Senior Program Officer", tags: ["health", "funder", "foundation"], giving_history: { totalLifetime: 350000, lastGiftAmount: 150000, lastGiftDate: "2026-02-01", averageGift: 116667, giftCount: 3, firstGiftDate: "2021-06-15" }, engagement_score: 92 },
  { id: "con-014", organization_id: "org-003", type: "donor", first_name: "Angela", last_name: "Davis-Brown", email: "angela.db@outlook.com", phone: "(404) 555-0455", org_affiliation: null, title: null, tags: ["health", "individual", "major-donor"], giving_history: { totalLifetime: 25000, lastGiftAmount: 10000, lastGiftDate: "2026-06-15", averageGift: 5000, giftCount: 5, firstGiftDate: "2022-12-01" }, engagement_score: 80 },
  { id: "con-015", organization_id: "org-003", type: "funder", first_name: "Thomas", last_name: "Wright", email: "twright@rwjf.org", phone: "(404) 555-0199", org_affiliation: "Robert Wood Johnson Foundation", title: "Program Director", tags: ["health", "funder", "national"], giving_history: { totalLifetime: 500000, lastGiftAmount: 250000, lastGiftDate: "2026-04-01", averageGift: 250000, giftCount: 2, firstGiftDate: "2024-01-15" }, engagement_score: 95 },
  // org-004
  { id: "con-016", organization_id: "org-004", type: "funder", first_name: "Emily", last_name: "Nakamura", email: "enakamura@meyerfund.org", phone: "(503) 555-0276", org_affiliation: "Meyer Memorial Trust", title: "Arts Program Officer", tags: ["arts", "funder", "oregon"], giving_history: { totalLifetime: 80000, lastGiftAmount: 40000, lastGiftDate: "2026-05-01", averageGift: 40000, giftCount: 2, firstGiftDate: "2024-05-15" }, engagement_score: 88 },
  { id: "con-017", organization_id: "org-004", type: "donor", first_name: "Jason", last_name: "Park", email: "jpark.pdx@gmail.com", phone: "(503) 555-0398", org_affiliation: null, title: null, tags: ["arts", "individual", "recurring"], giving_history: { totalLifetime: 6000, lastGiftAmount: 1000, lastGiftDate: "2026-09-01", averageGift: 1000, giftCount: 6, firstGiftDate: "2021-03-01" }, engagement_score: 65 },
  // org-005
  { id: "con-018", organization_id: "org-005", type: "funder", first_name: "Diane", last_name: "Huang", email: "dhuang@cynthiawoodsmitchell.org", phone: "(512) 555-0233", org_affiliation: "Cynthia and George Mitchell Foundation", title: "Environment Program Officer", tags: ["environment", "funder", "texas"], giving_history: { totalLifetime: 120000, lastGiftAmount: 60000, lastGiftDate: "2026-04-15", averageGift: 60000, giftCount: 2, firstGiftDate: "2024-10-01" }, engagement_score: 87 },
  { id: "con-019", organization_id: "org-005", type: "donor", first_name: "Kevin", last_name: "O'Brien", email: "kob.austin@gmail.com", phone: "(512) 555-0344", org_affiliation: null, title: null, tags: ["environment", "individual", "major-donor"], giving_history: { totalLifetime: 15000, lastGiftAmount: 5000, lastGiftDate: "2026-07-22", averageGift: 3750, giftCount: 4, firstGiftDate: "2023-04-22" }, engagement_score: 75 },
  { id: "con-020", organization_id: "org-005", type: "funder", first_name: "Stephanie", last_name: "Gonzalez", email: "sgonzalez@austincf.org", phone: "(512) 555-0156", org_affiliation: "Austin Community Foundation", title: "Grants Manager", tags: ["environment", "funder", "community-foundation"], giving_history: { totalLifetime: 90000, lastGiftAmount: 45000, lastGiftDate: "2026-03-01", averageGift: 45000, giftCount: 2, firstGiftDate: "2025-01-15" }, engagement_score: 82 },
  // org-006
  { id: "con-021", organization_id: "org-006", type: "funder", first_name: "Margaret", last_name: "Sullivan", email: "msullivan@fordfoundation.org", phone: "(202) 555-0377", org_affiliation: "Ford Foundation", title: "Program Officer, Technology & Society", tags: ["rights", "funder", "national"], giving_history: { totalLifetime: 500000, lastGiftAmount: 250000, lastGiftDate: "2026-01-15", averageGift: 250000, giftCount: 2, firstGiftDate: "2024-06-01" }, engagement_score: 95 },
  { id: "con-022", organization_id: "org-006", type: "donor", first_name: "Ryan", last_name: "Nakamura", email: "rnakamura@techexec.com", phone: "(202) 555-0488", org_affiliation: "Nakamura Ventures", title: "Founder", tags: ["rights", "individual", "tech", "major-donor"], giving_history: { totalLifetime: 50000, lastGiftAmount: 25000, lastGiftDate: "2026-09-01", averageGift: 16667, giftCount: 3, firstGiftDate: "2023-05-15" }, engagement_score: 85 },
  { id: "con-023", organization_id: "org-006", type: "funder", first_name: "Catherine", last_name: "Brooks", email: "cbrooks@knightfoundation.org", phone: "(202) 555-0211", org_affiliation: "John S. and James L. Knight Foundation", title: "Director of Technology Innovation", tags: ["rights", "funder", "journalism", "tech"], giving_history: { totalLifetime: 300000, lastGiftAmount: 150000, lastGiftDate: "2026-03-01", averageGift: 150000, giftCount: 2, firstGiftDate: "2024-09-15" }, engagement_score: 90 },
];

const grants = [
  // org-002
  { id: "grant-007", organization_id: "org-002", funder_id: "con-010", funder_name: "The Colorado Trust", program_id: "prog-004", name: "Family Housing Expansion 2026", status: "active", amount_requested: 75000, amount_awarded: 75000, amount_spent: 48000, restriction: "temporarily_restricted", start_date: "2026-01-15", end_date: "2026-12-31", deadlines: [{ type: "report", date: "2026-12-01", description: "Year-end narrative and financial report", completed: false }], requirements: ["Quarterly housing placement data", "Client satisfaction surveys"], probability: 100, notes: "Second year of funding. Strong relationship with program officer." },
  { id: "grant-008", organization_id: "org-002", funder_id: "con-012", funder_name: "Colorado Housing Finance Authority", program_id: "prog-006", name: "Youth Transition Housing Support", status: "applied", amount_requested: 120000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "application", date: "2026-12-15", description: "Full proposal deadline", completed: false }], requirements: ["Youth outcome tracking", "Foster care system coordination"], probability: 60, notes: "New funder. Submitted LOI in September; invited to full proposal." },
  { id: "grant-009", organization_id: "org-002", funder_id: null, funder_name: "Denver Foundation", program_id: null, name: "General Operating Support 2027", status: "prospect", amount_requested: 50000, amount_awarded: null, amount_spent: 0, restriction: "unrestricted", start_date: null, end_date: null, deadlines: [{ type: "loi", date: "2027-02-15", description: "Letter of inquiry deadline", completed: false }], requirements: [], probability: 40, notes: "Board chair has connection to the foundation." },
  // org-003
  { id: "grant-010", organization_id: "org-003", funder_id: "con-013", funder_name: "Healthcare Georgia Foundation", program_id: "prog-007", name: "Community Health Center Expansion", status: "active", amount_requested: 150000, amount_awarded: 150000, amount_spent: 95000, restriction: "temporarily_restricted", start_date: "2026-01-01", end_date: "2026-12-31", deadlines: [{ type: "report", date: "2026-12-15", description: "Annual outcomes report with patient demographic data", completed: false }], requirements: ["Patient volume by site", "Quality metrics dashboard"], probability: 100, notes: "Third year of a 3-year grant. Renewal conversation expected in Q4." },
  { id: "grant-011", organization_id: "org-003", funder_id: "con-015", funder_name: "Robert Wood Johnson Foundation", program_id: "prog-009", name: "Integrated Behavioral Health Pilot", status: "active", amount_requested: 250000, amount_awarded: 250000, amount_spent: 180000, restriction: "temporarily_restricted", start_date: "2025-07-01", end_date: "2027-06-30", deadlines: [{ type: "report", date: "2027-01-15", description: "Mid-grant evaluation report", completed: false }], requirements: ["Depression screening rates", "ER diversion data", "Cost-effectiveness analysis"], probability: 100, notes: "High-profile national grant. Program officer visiting in December." },
  { id: "grant-012", organization_id: "org-003", funder_id: null, funder_name: "Fulton County Government", program_id: "prog-008", name: "Mobile Health Van Operations 2027", status: "applied", amount_requested: 200000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "application", date: "2026-11-30", description: "County RFP response deadline", completed: false }], requirements: ["Service area heat maps", "Patient outcome data", "Community need assessment"], probability: 70, notes: "Strong track record with county. New RFP format this year." },
  // org-004
  { id: "grant-013", organization_id: "org-004", funder_id: "con-016", funder_name: "Meyer Memorial Trust", program_id: "prog-010", name: "Youth Arts Expansion 2026", status: "active", amount_requested: 40000, amount_awarded: 40000, amount_spent: 28000, restriction: "temporarily_restricted", start_date: "2026-01-01", end_date: "2026-12-31", deadlines: [{ type: "report", date: "2026-12-01", description: "Year-end narrative and financial report", completed: false }], requirements: ["Student enrollment data", "Pre/post creative confidence surveys"], probability: 100, notes: "Strong relationship. Third consecutive year of funding." },
  { id: "grant-014", organization_id: "org-004", funder_id: null, funder_name: "Oregon Arts Commission", program_id: "prog-012", name: "Public Art Installation Grant", status: "awarded", amount_requested: 25000, amount_awarded: 25000, amount_spent: 0, restriction: "temporarily_restricted", start_date: "2027-01-01", end_date: "2027-12-31", deadlines: [{ type: "application", date: "2026-12-15", description: "Grant agreement signing deadline", completed: false }], requirements: ["Community input documentation", "Artist selection process"], probability: 100, notes: "Awarded in October. Paperwork pending." },
  { id: "grant-015", organization_id: "org-004", funder_id: null, funder_name: "Wieden+Kennedy Foundation", program_id: null, name: "Creative Youth Initiative", status: "prospect", amount_requested: 60000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "loi", date: "2027-03-01", description: "Letter of inquiry deadline", completed: false }], requirements: [], probability: 35, notes: "Development director has a warm introduction through a board member." },
  // org-005
  { id: "grant-016", organization_id: "org-005", funder_id: "con-018", funder_name: "Cynthia and George Mitchell Foundation", program_id: "prog-014", name: "Watershed Restoration Initiative", status: "active", amount_requested: 60000, amount_awarded: 60000, amount_spent: 42000, restriction: "temporarily_restricted", start_date: "2026-03-01", end_date: "2027-02-28", deadlines: [{ type: "report", date: "2027-01-15", description: "Year-end ecological impact report", completed: false }], requirements: ["Water quality testing data", "Invasive species removal logs", "Photo documentation"], probability: 100, notes: "Year 2 of a 3-year commitment. Strong outcomes data." },
  { id: "grant-017", organization_id: "org-005", funder_id: "con-020", funder_name: "Austin Community Foundation", program_id: "prog-013", name: "Urban Farm Expansion 2027", status: "applied", amount_requested: 50000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "application", date: "2026-12-01", description: "Full proposal with farm site plans", completed: false }], requirements: ["3-year farm production data", "Community impact assessment"], probability: 65, notes: "Good relationship. Competitive cycle this year." },
  { id: "grant-018", organization_id: "org-005", funder_id: null, funder_name: "Patagonia Environmental Grants", program_id: null, name: "Climate Education Scale-Up", status: "prospect", amount_requested: 80000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "application", date: "2027-04-30", description: "Spring grant cycle deadline", completed: false }], requirements: [], probability: 30, notes: "Patagonia funds grassroots environmental education. Good fit but competitive." },
  // org-006
  { id: "grant-019", organization_id: "org-006", funder_id: "con-021", funder_name: "Ford Foundation", program_id: "prog-016", name: "Digital Rights Litigation 2026-2028", status: "active", amount_requested: 250000, amount_awarded: 250000, amount_spent: 145000, restriction: "temporarily_restricted", start_date: "2026-01-01", end_date: "2028-12-31", deadlines: [{ type: "report", date: "2027-01-31", description: "Annual litigation impact report", completed: false }], requirements: ["Case outcome tracking", "Policy change attribution", "Media coverage log"], probability: 100, notes: "Marquee grant. Ford is deeply invested in our litigation strategy." },
  { id: "grant-020", organization_id: "org-006", funder_id: "con-023", funder_name: "Knight Foundation", program_id: "prog-017", name: "AI Governance Policy Research", status: "active", amount_requested: 150000, amount_awarded: 150000, amount_spent: 110000, restriction: "temporarily_restricted", start_date: "2026-04-01", end_date: "2027-03-31", deadlines: [{ type: "report", date: "2026-12-15", description: "Mid-year policy brief and impact assessment", completed: false }], requirements: ["Published policy briefs", "Legislative testimony log", "Congressional meeting tracker"], probability: 100, notes: "Year 1 of AI governance initiative. Strong engagement with Hill offices." },
  { id: "grant-021", organization_id: "org-006", funder_id: null, funder_name: "Open Society Foundations", program_id: "prog-018", name: "Digital Literacy National Expansion", status: "applied", amount_requested: 200000, amount_awarded: null, amount_spent: 0, restriction: "temporarily_restricted", start_date: null, end_date: null, deadlines: [{ type: "application", date: "2026-12-20", description: "Full proposal with expansion plan", completed: false }, { type: "site_visit", date: "2027-01-15", description: "Virtual program demonstration", completed: false }], requirements: ["Curriculum outline", "Geographic expansion plan", "Partnership MOUs"], probability: 55, notes: "Competitive cycle. Our program model is a strong fit for their digital equity portfolio." },
];

const agentConfigs = [
  // org-002
  { id: "ac-007", organization_id: "org-002", type: "grants", name: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, writes reports.", scope: ["grants", "outcomes", "programs", "constituents:funders"], approval_threshold: 5000, enabled: true },
  { id: "ac-008", organization_id: "org-002", type: "donor_relations", name: "Donor Relations Agent", description: "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.", scope: ["constituents:donors", "transactions:donations"], approval_threshold: 1000, enabled: true },
  { id: "ac-009", organization_id: "org-002", type: "finance", name: "Finance Agent", description: "Restricted-fund tracking, grant burn, monthly close, cash forecast.", scope: ["transactions", "grants:financials", "programs:budgets"], approval_threshold: 10000, enabled: true },
  { id: "ac-010", organization_id: "org-002", type: "compliance", name: "Compliance Agent", description: "Form 990, state registrations, acknowledgment rules, grant covenants.", scope: ["organization", "transactions", "grants:compliance"], approval_threshold: 0, enabled: true },
  { id: "ac-011", organization_id: "org-002", type: "marketing", name: "Marketing Agent", description: "Drafts newsletters, social posts, annual report content.", scope: ["programs", "outcomes", "constituents"], approval_threshold: 500, enabled: true },
  { id: "ac-012", organization_id: "org-002", type: "board", name: "Board Agent", description: "Prepares board packets, meeting agendas, governance calendar.", scope: ["organization", "programs", "grants", "financials"], approval_threshold: 0, enabled: true },
  // org-003
  { id: "ac-013", organization_id: "org-003", type: "grants", name: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, writes reports.", scope: ["grants", "outcomes", "programs", "constituents:funders"], approval_threshold: 5000, enabled: true },
  { id: "ac-014", organization_id: "org-003", type: "donor_relations", name: "Donor Relations Agent", description: "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.", scope: ["constituents:donors", "transactions:donations"], approval_threshold: 1000, enabled: true },
  { id: "ac-015", organization_id: "org-003", type: "finance", name: "Finance Agent", description: "Restricted-fund tracking, grant burn, monthly close, cash forecast.", scope: ["transactions", "grants:financials", "programs:budgets"], approval_threshold: 10000, enabled: true },
  { id: "ac-016", organization_id: "org-003", type: "compliance", name: "Compliance Agent", description: "Form 990, state registrations, acknowledgment rules, grant covenants.", scope: ["organization", "transactions", "grants:compliance"], approval_threshold: 0, enabled: true },
  { id: "ac-017", organization_id: "org-003", type: "marketing", name: "Marketing Agent", description: "Drafts newsletters, social posts, annual report content.", scope: ["programs", "outcomes", "constituents"], approval_threshold: 500, enabled: true },
  { id: "ac-018", organization_id: "org-003", type: "board", name: "Board Agent", description: "Prepares board packets, meeting agendas, governance calendar.", scope: ["organization", "programs", "grants", "financials"], approval_threshold: 0, enabled: true },
  // org-004
  { id: "ac-019", organization_id: "org-004", type: "grants", name: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, writes reports.", scope: ["grants", "outcomes", "programs", "constituents:funders"], approval_threshold: 5000, enabled: true },
  { id: "ac-020", organization_id: "org-004", type: "donor_relations", name: "Donor Relations Agent", description: "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.", scope: ["constituents:donors", "transactions:donations"], approval_threshold: 1000, enabled: true },
  { id: "ac-021", organization_id: "org-004", type: "finance", name: "Finance Agent", description: "Restricted-fund tracking, grant burn, monthly close, cash forecast.", scope: ["transactions", "grants:financials", "programs:budgets"], approval_threshold: 10000, enabled: true },
  { id: "ac-022", organization_id: "org-004", type: "compliance", name: "Compliance Agent", description: "Form 990, state registrations, acknowledgment rules, grant covenants.", scope: ["organization", "transactions", "grants:compliance"], approval_threshold: 0, enabled: true },
  { id: "ac-023", organization_id: "org-004", type: "marketing", name: "Marketing Agent", description: "Drafts newsletters, social posts, annual report content.", scope: ["programs", "outcomes", "constituents"], approval_threshold: 500, enabled: true },
  { id: "ac-024", organization_id: "org-004", type: "board", name: "Board Agent", description: "Prepares board packets, meeting agendas, governance calendar.", scope: ["organization", "programs", "grants", "financials"], approval_threshold: 0, enabled: true },
  // org-005
  { id: "ac-025", organization_id: "org-005", type: "grants", name: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, writes reports.", scope: ["grants", "outcomes", "programs", "constituents:funders"], approval_threshold: 5000, enabled: true },
  { id: "ac-026", organization_id: "org-005", type: "donor_relations", name: "Donor Relations Agent", description: "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.", scope: ["constituents:donors", "transactions:donations"], approval_threshold: 1000, enabled: true },
  { id: "ac-027", organization_id: "org-005", type: "finance", name: "Finance Agent", description: "Restricted-fund tracking, grant burn, monthly close, cash forecast.", scope: ["transactions", "grants:financials", "programs:budgets"], approval_threshold: 10000, enabled: true },
  { id: "ac-028", organization_id: "org-005", type: "compliance", name: "Compliance Agent", description: "Form 990, state registrations, acknowledgment rules, grant covenants.", scope: ["organization", "transactions", "grants:compliance"], approval_threshold: 0, enabled: true },
  { id: "ac-029", organization_id: "org-005", type: "marketing", name: "Marketing Agent", description: "Drafts newsletters, social posts, annual report content.", scope: ["programs", "outcomes", "constituents"], approval_threshold: 500, enabled: true },
  { id: "ac-030", organization_id: "org-005", type: "board", name: "Board Agent", description: "Prepares board packets, meeting agendas, governance calendar.", scope: ["organization", "programs", "grants", "financials"], approval_threshold: 0, enabled: true },
  // org-006
  { id: "ac-031", organization_id: "org-006", type: "grants", name: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, writes reports.", scope: ["grants", "outcomes", "programs", "constituents:funders"], approval_threshold: 5000, enabled: true },
  { id: "ac-032", organization_id: "org-006", type: "donor_relations", name: "Donor Relations Agent", description: "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.", scope: ["constituents:donors", "transactions:donations"], approval_threshold: 1000, enabled: true },
  { id: "ac-033", organization_id: "org-006", type: "finance", name: "Finance Agent", description: "Restricted-fund tracking, grant burn, monthly close, cash forecast.", scope: ["transactions", "grants:financials", "programs:budgets"], approval_threshold: 10000, enabled: true },
  { id: "ac-034", organization_id: "org-006", type: "compliance", name: "Compliance Agent", description: "Form 990, state registrations, acknowledgment rules, grant covenants.", scope: ["organization", "transactions", "grants:compliance"], approval_threshold: 0, enabled: true },
  { id: "ac-035", organization_id: "org-006", type: "marketing", name: "Marketing Agent", description: "Drafts newsletters, social posts, annual report content.", scope: ["programs", "outcomes", "constituents"], approval_threshold: 500, enabled: true },
  { id: "ac-036", organization_id: "org-006", type: "board", name: "Board Agent", description: "Prepares board packets, meeting agendas, governance calendar.", scope: ["organization", "programs", "grants", "financials"], approval_threshold: 0, enabled: true },
];

async function seed() {
  console.log("Seeding Perpetual OS database...\n");

  // Ensure slug on org-001
  await ensureSlugColumn();
  console.log("Ensured slug on org-001\n");

  // Insert in dependency order
  console.log("1. Organizations (5)");
  await upsert("organizations", organizations);

  console.log("\n2. Programs (15)");
  await upsert("programs", programs);

  console.log("\n3. Outcomes (10)");
  await upsert("outcomes", outcomes);

  console.log("\n4. Constituents (14)");
  await upsert("constituents", constituents);

  console.log("\n5. Grants (15)");
  await upsert("grants", grants);

  console.log("\n6. Agent Configs (30)");
  await upsert("agent_configs", agentConfigs);

  // Ensure all orgs have public_profile = true
  console.log("\n7. Ensuring public_profile = true on all orgs");
  const { error: pubErr } = await supabase
    .from("organizations")
    .update({ public_profile: true })
    .in("id", ["org-002", "org-003", "org-004", "org-005", "org-006"]);
  if (pubErr) console.error(`  ERROR: ${pubErr.message}`);
  else console.log("  Done");

  // Verify
  console.log("\n--- Verification ---");
  const { data: orgs } = await supabase
    .from("organizations")
    .select("id, name, sector, public_profile, slug");
  console.log("\nAll organizations:");
  orgs?.forEach((o) =>
    console.log(
      `  ${o.id} | ${o.name} | ${o.sector} | public: ${o.public_profile} | slug: ${o.slug}`
    )
  );

  const { data: progs } = await supabase
    .from("programs")
    .select("id, organization_id, name");
  console.log(`\n${progs?.length ?? 0} total programs`);

  const { data: outs } = await supabase
    .from("outcomes")
    .select("id, organization_id");
  console.log(`${outs?.length ?? 0} total outcomes`);

  const { data: cons } = await supabase
    .from("constituents")
    .select("id, organization_id");
  console.log(`${cons?.length ?? 0} total constituents`);

  const { data: grs } = await supabase.from("grants").select("id, organization_id");
  console.log(`${grs?.length ?? 0} total grants`);

  const { data: acs } = await supabase
    .from("agent_configs")
    .select("id, organization_id");
  console.log(`${acs?.length ?? 0} total agent configs`);

  console.log("\nDone!");
}

seed().catch(console.error);
