import { config } from "dotenv";
config({ path: ".env.local" });

import { ProxyAgent, setGlobalDispatcher } from "undici";
import { createClient } from "@supabase/supabase-js";

if (process.env.HTTPS_PROXY) {
  setGlobalDispatcher(new ProxyAgent(process.env.HTTPS_PROXY));
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SEARCH_URL =
  "https://projects.propublica.org/nonprofits/api/v2/search.json";
const ORG_URL =
  "https://projects.propublica.org/nonprofits/api/v2/organizations";
const MAX_ORGS = 500;
const PER_PAGE = 25; // ProPublica default page size
const MIN_REVENUE = 100_000;
const DELAY_MS = 200;

const NTEE_TO_SECTOR: Record<string, string> = {
  A: "arts_culture",
  B: "education",
  C: "environment",
  D: "environment",
  E: "health",
  F: "health",
  G: "health",
  H: "health",
  I: "human_services",
  J: "human_services",
  K: "human_services",
  L: "housing",
  N: "workforce",
  P: "community",
  Q: "community",
  R: "essential_rights",
  S: "essential_rights",
  T: "essential_rights",
  U: "essential_rights",
  V: "essential_rights",
  W: "essential_rights",
};

const AGENT_TYPES = [
  {
    type: "grants",
    name: "Grants Agent",
    description:
      "Discovers funders, drafts proposals, tracks deadlines, writes reports.",
    scope: ["grants", "outcomes", "programs", "constituents:funders"],
    threshold: 5000,
  },
  {
    type: "donor_relations",
    name: "Donor Relations Agent",
    description:
      "Segments donors, drafts stewardship, flags lapsed & upgrade-ready donors.",
    scope: ["constituents:donors", "transactions:donations"],
    threshold: 1000,
  },
  {
    type: "finance",
    name: "Finance Agent",
    description:
      "Restricted-fund tracking, grant burn, monthly close, cash forecast.",
    scope: ["transactions", "grants:financials", "programs:budgets"],
    threshold: 10000,
  },
  {
    type: "compliance",
    name: "Compliance Agent",
    description:
      "Form 990, state registrations, acknowledgment rules, grant covenants.",
    scope: ["organization", "transactions", "grants:compliance"],
    threshold: 0,
  },
  {
    type: "marketing",
    name: "Marketing Agent",
    description:
      "Drafts newsletters, social posts, annual report content.",
    scope: ["programs", "outcomes", "constituents"],
    threshold: 500,
  },
  {
    type: "board",
    name: "Board Agent",
    description:
      "Prepares board packets, meeting agendas, governance calendar.",
    scope: ["organization", "programs", "grants", "financials"],
    threshold: 0,
  },
];

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function formatEin(ein: number | string): string {
  const s = String(ein).replace(/-/g, "");
  if (s.length === 9) return `${s.slice(0, 2)}-${s.slice(2)}`;
  return s;
}

interface ProPublicaSearchOrg {
  ein: number;
  name: string;
  city: string;
  state: string;
  ntee_code: string;
  score?: number;
}

interface ProPublicaFiling {
  tax_prd_yr: number;
  totrevenue: number;
  totfuncexpns: number;
  totassetsend: number;
  totliabend: number;
  pct_compnsatncurrofcrs?: number;
}

interface ProPublicaOrgResponse {
  organization: {
    ein: number;
    name: string;
    city: string;
    state: string;
    ntee_code: string;
    subsection_code?: number;
    ruling_date?: string;
    mission?: string;
  };
  filings_with_data: ProPublicaFiling[];
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  HTTP ${res.status} for ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`  Fetch error for ${url}: ${err}`);
    return null;
  }
}

async function searchOrgs(): Promise<ProPublicaSearchOrg[]> {
  const allOrgs: ProPublicaSearchOrg[] = [];
  const seenEins = new Set<number>();
  let page = 0;

  while (allOrgs.length < MAX_ORGS) {
    const url = `${SEARCH_URL}?q=San+Francisco&state%5Bid%5D=CA&c_code%5Bid%5D=3&page=${page}`;
    console.log(`Fetching search page ${page}...`);

    const data = await fetchJson<{
      organizations: ProPublicaSearchOrg[];
      num_pages: number;
    }>(url);

    if (!data || !data.organizations || data.organizations.length === 0) {
      console.log(`  No more results at page ${page}`);
      break;
    }

    for (const org of data.organizations) {
      if (!seenEins.has(org.ein) && allOrgs.length < MAX_ORGS) {
        seenEins.add(org.ein);
        allOrgs.push(org);
      }
    }

    console.log(
      `  Got ${data.organizations.length} orgs (total unique: ${allOrgs.length})`
    );

    if (page >= (data.num_pages ?? 0) - 1) break;
    page++;
    await sleep(DELAY_MS);
  }

  return allOrgs;
}

async function importOrgs() {
  console.log("=== ProPublica SF Nonprofit Import ===\n");

  const searchResults = await searchOrgs();
  console.log(`\nFound ${searchResults.length} unique orgs from search.\n`);

  let imported = 0;
  let skipped = 0;
  let errored = 0;

  for (let i = 0; i < searchResults.length; i++) {
    const searchOrg = searchResults[i];
    const einStr = String(searchOrg.ein);
    const progress = `[${i + 1}/${searchResults.length}]`;

    try {
      await sleep(DELAY_MS);
      const detail = await fetchJson<ProPublicaOrgResponse>(
        `${ORG_URL}/${einStr}.json`
      );

      if (!detail || !detail.filings_with_data || detail.filings_with_data.length === 0) {
        console.log(`${progress} SKIP ${searchOrg.name} — no filings`);
        skipped++;
        continue;
      }

      const filing = detail.filings_with_data[0];
      const revenue = filing.totrevenue ?? 0;

      if (revenue < MIN_REVENUE) {
        console.log(
          `${progress} SKIP ${searchOrg.name} — revenue $${revenue.toLocaleString()} < $${MIN_REVENUE.toLocaleString()}`
        );
        skipped++;
        continue;
      }

      const nteePrefix = (
        detail.organization.ntee_code ||
        searchOrg.ntee_code ||
        ""
      )
        .charAt(0)
        .toUpperCase();
      const sector = NTEE_TO_SECTOR[nteePrefix] || "community";

      const expenses = filing.totfuncexpns ?? 0;
      const totalAssets = filing.totassetsend ?? 0;
      const totalLiab = filing.totliabend ?? 0;
      const netAssets = totalAssets - totalLiab;
      const monthsOfRunway =
        expenses > 0 ? Math.round(((totalAssets - totalLiab) / (expenses / 12)) * 10) / 10 : 0;

      const orgName = detail.organization.name || searchOrg.name;
      const mission =
        detail.organization.mission ||
        `${orgName} is a San Francisco-based nonprofit organization.`;

      const formattedEin = formatEin(searchOrg.ein);
      const orgId = `pp-${einStr}`;
      const slug = slugify(orgName);

      const rulingDate = detail.organization.ruling_date;
      const founded = rulingDate
        ? `${rulingDate.slice(0, 4)}-${rulingDate.slice(4, 6)}-01`
        : null;

      const orgRecord = {
        id: orgId,
        name: orgName,
        legal_name: orgName,
        ein: formattedEin,
        mission,
        vision: null,
        sector,
        founded,
        website: null,
        address: {
          city: detail.organization.city || "San Francisco",
          state: detail.organization.state || "CA",
        },
        phone: null,
        email: null,
        leadership: [],
        financials: {
          fiscalYearEnd: `${filing.tax_prd_yr}-12-31`,
          annualBudget: revenue,
          totalRevenue: revenue,
          totalExpenses: expenses,
          netAssets: netAssets > 0 ? netAssets : 0,
          cashOnHand: 0,
          monthsOfRunway: monthsOfRunway > 0 ? Math.min(monthsOfRunway, 120) : 0,
        },
        public_profile: true,
        slug,
      };

      const { error: orgErr } = await supabase
        .from("organizations")
        .upsert(orgRecord, { onConflict: "id" });

      if (orgErr) {
        // If slug conflict, retry with ein suffix
        if (orgErr.message.includes("slug") || orgErr.code === "23505") {
          orgRecord.slug = `${slug}-${einStr.slice(-4)}`;
          const { error: retryErr } = await supabase
            .from("organizations")
            .upsert(orgRecord, { onConflict: "id" });
          if (retryErr) {
            console.error(
              `${progress} ERROR ${orgName}: ${retryErr.message}`
            );
            errored++;
            continue;
          }
        } else {
          console.error(`${progress} ERROR ${orgName}: ${orgErr.message}`);
          errored++;
          continue;
        }
      }

      // Upsert agent configs
      const agentRows = AGENT_TYPES.map((at) => ({
        id: `ac-${einStr}-${at.type}`,
        organization_id: orgId,
        type: at.type,
        name: at.name,
        description: at.description,
        scope: at.scope,
        approval_threshold: at.threshold,
        enabled: true,
      }));

      const { error: agentErr } = await supabase
        .from("agent_configs")
        .upsert(agentRows, { onConflict: "id" });

      if (agentErr) {
        console.warn(
          `${progress} WARN agent_configs for ${orgName}: ${agentErr.message}`
        );
      }

      console.log(
        `${progress} OK ${orgName} | ${sector} | $${(revenue / 1_000_000).toFixed(1)}M rev`
      );
      imported++;
    } catch (err) {
      console.error(
        `${progress} ERROR ${searchOrg.name}: ${err instanceof Error ? err.message : err}`
      );
      errored++;
    }
  }

  console.log("\n=== Import Summary ===");
  console.log(`Imported: ${imported}`);
  console.log(`Skipped:  ${skipped} (no filings or revenue < $100K)`);
  console.log(`Errored:  ${errored}`);
  console.log(`Total:    ${searchResults.length}`);

  // Verification
  const { count } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true });
  console.log(`\nTotal orgs in database: ${count}`);

  const { data: sectorCounts } = await supabase.rpc("get_sector_counts").select("*");
  if (sectorCounts) {
    console.log("\nOrgs by sector:");
    for (const row of sectorCounts) {
      console.log(`  ${row.sector}: ${row.count}`);
    }
  } else {
    // Fallback: just query a few sectors
    for (const s of [
      "education",
      "health",
      "arts_culture",
      "community",
      "human_services",
      "housing",
      "environment",
      "essential_rights",
      "workforce",
      "science",
    ]) {
      const { count: c } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("sector", s);
      if (c && c > 0) console.log(`  ${s}: ${c}`);
    }
  }
}

importOrgs().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
