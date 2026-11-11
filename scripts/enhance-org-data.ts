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

function isGenericMission(mission: string | null | undefined, orgName: string): boolean {
  if (!mission) return true;
  if (mission.length < 30) return true;
  if (mission.toLowerCase() === orgName.toLowerCase()) return true;
  const lower = mission.toLowerCase();
  if (lower.includes("is a san francisco-based")) return true;
  if (lower.includes("is a nonprofit organization")) return true;
  if (lower.includes("is a non-profit organization")) return true;
  if (/^[\w\s]+ is a /.test(lower) && lower.length < 80) return true;
  return false;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProPublica(ein: string) {
  const cleanEin = ein.replace(/-/g, "");
  const url = `https://projects.propublica.org/nonprofits/api/v2/organizations/${cleanEin}.json`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function enhance() {
  console.log("Fetching top 50 organizations by revenue...\n");

  const { data: orgs, error } = await supabase
    .from("organizations")
    .select("id, name, ein, mission, website, financials")
    .order("financials->totalRevenue", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) {
    console.error("Failed to fetch orgs:", error.message);
    process.exit(1);
  }

  if (!orgs || orgs.length === 0) {
    console.log("No organizations found.");
    return;
  }

  console.log(`Found ${orgs.length} organizations. Checking for generic missions...\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const org of orgs) {
    if (!isGenericMission(org.mission, org.name)) {
      skipped++;
      continue;
    }

    if (!org.ein) {
      console.log(`  SKIP ${org.name}: no EIN`);
      skipped++;
      continue;
    }

    try {
      await sleep(300);

      const data = await fetchProPublica(org.ein);
      if (!data || !data.organization) {
        console.log(`  SKIP ${org.name}: not found on ProPublica`);
        skipped++;
        continue;
      }

      const ppOrg = data.organization;
      const filings = data.filings_with_data ?? [];

      let newMission: string | null = null;
      let newWebsite: string | null = null;

      // Try to get mission from the latest filing
      for (const filing of filings) {
        if (filing.mission_description) {
          newMission = filing.mission_description.trim();
          break;
        }
      }

      // Fall back to org-level description
      if (!newMission && ppOrg.description) {
        newMission = ppOrg.description.trim();
      }

      // Try to get website from filing data
      for (const filing of filings) {
        if (filing.website) {
          newWebsite = filing.website.trim();
          break;
        }
      }

      if (!newMission || newMission.length < 10) {
        console.log(`  SKIP ${org.name}: no usable mission from ProPublica`);
        skipped++;
        continue;
      }

      // Capitalize first letter if needed
      newMission = newMission.charAt(0).toUpperCase() + newMission.slice(1);

      const updates: Record<string, string> = { mission: newMission };
      if (newWebsite && !org.website) {
        const url = newWebsite.startsWith("http") ? newWebsite : `https://${newWebsite}`;
        updates.website = url;
      }

      const { error: updateErr } = await supabase
        .from("organizations")
        .update(updates)
        .eq("id", org.id);

      if (updateErr) {
        console.log(`  ERROR ${org.name}: ${updateErr.message}`);
        failed++;
        continue;
      }

      const preview = newMission.length > 80 ? newMission.slice(0, 80) + "..." : newMission;
      console.log(`  Updated ${org.name}: ${preview}`);
      updated++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  ERROR ${org.name}: ${msg}`);
      failed++;
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Failed:  ${failed}`);
  console.log(`  Total:   ${orgs.length}`);
  console.log("\nDone!");
}

enhance().catch(console.error);
