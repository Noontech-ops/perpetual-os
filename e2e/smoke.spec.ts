const pw = require("playwright");

const BASE = "http://localhost:3000";

interface TestResult {
  name: string;
  pass: boolean;
  error?: string;
}

const results: TestResult[] = [];

async function run() {
  const browser = await pw.chromium.launch();

  async function test(name: string, fn: (page: pw.Page) => Promise<void>) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    try {
      await fn(page);
      results.push({ name, pass: true });
      console.log(`  PASS  ${name}`);
    } catch (e: any) {
      results.push({ name, pass: false, error: e.message?.slice(0, 200) });
      console.log(`  FAIL  ${name}: ${e.message?.slice(0, 120)}`);
    } finally {
      await ctx.close();
    }
  }

  // 1. Home page
  await test("Home page loads with hero and nav", async (page) => {
    await page.goto(BASE, { waitUntil: "networkidle", timeout: 20000 });
    const hero = await page.textContent("h1");
    if (!hero?.includes("perpetual")) throw new Error(`Hero missing: got "${hero}"`);
    const nav = await page.locator("nav a, header a").count();
    if (nav < 3) throw new Error(`Expected >=3 nav links, got ${nav}`);
    const forDonors = page.locator('a:has-text("For Donors")');
    if ((await forDonors.count()) === 0) throw new Error("Missing 'For Donors' link");
    const forNonprofits = page.locator('a:has-text("For Nonprofits"), a:has-text("Perpetual OS for Nonprofits")');
    if ((await forNonprofits.count()) === 0) throw new Error("Missing 'For Nonprofits' link");
  });

  // 2. Marketplace loads and search works
  await test("Marketplace loads 116 orgs, search filters", async (page) => {
    await page.goto(`${BASE}/outcomes`, { waitUntil: "networkidle", timeout: 20000 });
    const heading = await page.textContent("h1");
    if (!heading?.includes("nonprofits")) throw new Error(`Bad heading: "${heading}"`);
    // Wait for orgs to load
    await page.waitForSelector('text=/116 nonprofits found/', { timeout: 10000 });
    // Search
    const input = page.locator('input[placeholder*="Search"]');
    await input.fill("Goodwill");
    // Wait for debounce (300ms) + data load
    await page.waitForTimeout(1500);
    // Should filter results — count should be less than 116
    const countText = await page.locator("text=/\\d+ nonprofits? found/").textContent();
    const count = parseInt(countText || "0");
    if (count >= 116) throw new Error(`Search didn't filter, still shows ${count}`);
    const body = await page.textContent("body");
    if (!body?.includes("Goodwill")) throw new Error("Goodwill not found after search");
  });

  // 3. OS Dashboard - all 9 tabs exist and switch
  await test("OS Dashboard loads with 9 tabs, tab switching works", async (page) => {
    await page.goto(`${BASE}/os`, { waitUntil: "networkidle", timeout: 20000 });
    const tabs = ["Overview", "Grants Agent", "Donors", "Finance", "Compliance", "Programs", "Outcomes", "Marketing", "Board"];
    for (const tab of tabs) {
      const el = page.locator(`[role="tab"]:has-text("${tab}")`);
      if ((await el.count()) === 0) throw new Error(`Tab "${tab}" not found`);
    }
    // Click Finance tab
    await page.locator('[role="tab"]:has-text("Finance")').click();
    await page.waitForTimeout(500);
    const financeContent = page.locator('text="Total Income YTD"');
    if ((await financeContent.count()) === 0) throw new Error("Finance tab content not visible after click");
    // Click Grants tab
    await page.locator('[role="tab"]:has-text("Grants Agent")').click();
    await page.waitForTimeout(500);
    const grantsContent = page.locator('text="Grant Pipeline"');
    if ((await grantsContent.count()) === 0) throw new Error("Grants tab content not visible after click");
  });

  // 4. Org profile loads
  await test("Org profile page loads with name and give section", async (page) => {
    await page.goto(`${BASE}/outcomes/org/org-goodwill`, { waitUntil: "networkidle", timeout: 20000 });
    // Wait for the profile to render
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    if (!body?.includes("Goodwill")) throw new Error("Goodwill name not found on profile page");
    // Check for give section
    const giveById = page.locator('#give');
    const giveByText = page.locator('text=/Give to/');
    const giveCount = (await giveById.count()) + (await giveByText.count());
    if (giveCount === 0) throw new Error("Give section not found");
  });

  // 5. Settings page
  await test("Settings page loads with org profile, team, agents", async (page) => {
    await page.goto(`${BASE}/os/settings`, { waitUntil: "networkidle", timeout: 20000 });
    // Org profile form
    const orgName = page.locator('input[value="Bay Area Literacy Coalition"]');
    if ((await orgName.count()) === 0) throw new Error("Org name input not found");
    // Team table
    const teamHeader = page.locator('text="Team Members"');
    if ((await teamHeader.count()) === 0) throw new Error("Team Members section not found");
    const teamRows = page.locator("text=@balc.org");
    if ((await teamRows.count()) < 3) throw new Error("Expected at least 3 team member emails");
    // Agent toggles
    const agentConfig = page.locator('text="AI Agent Configuration"');
    if ((await agentConfig.count()) === 0) throw new Error("AI Agent Configuration section not found");
    const toggles = page.locator('button[aria-label*="Toggle"]');
    if ((await toggles.count()) < 6) throw new Error(`Expected 6 agent toggles, got ${await toggles.count()}`);
  });

  // 6. Portfolio page
  await test("Portfolio page loads with 5 holdings", async (page) => {
    await page.goto(`${BASE}/outcomes/portfolio`, { waitUntil: "networkidle", timeout: 20000 });
    await page.waitForTimeout(2000);
    const title = page.locator('text="Your Impact Portfolio"');
    if ((await title.count()) === 0) throw new Error("Portfolio title not found");
    // Holdings table
    const holdingsHeader = page.locator('text="Holdings"');
    if ((await holdingsHeader.count()) === 0) throw new Error("Holdings section not found");
    // Check for the 5 fallback orgs
    const orgs = ["San Francisco Symphony", "KQED", "Wikimedia Foundation", "San Francisco AIDS Foundation", "SFJAZZ"];
    for (const org of orgs) {
      const el = page.locator(`text="${org}"`);
      if ((await el.count()) === 0) throw new Error(`Holding "${org}" not found`);
    }
    // Stats
    const totalGiven = page.locator('text="$12,750"');
    if ((await totalGiven.count()) === 0) throw new Error("Total given $12,750 not found");
  });

  // 7. Onboarding page
  await test("Onboarding page loads with 3-step wizard", async (page) => {
    await page.goto(`${BASE}/onboarding`, { waitUntil: "networkidle", timeout: 20000 });
    const heading = page.locator('text="Set up Perpetual OS"');
    if ((await heading.count()) === 0) throw new Error("Onboarding heading not found");
    // Step indicators (1, 2, 3)
    const steps = page.locator("text=/^[123]$/");
    if ((await steps.count()) < 3) throw new Error(`Expected 3 step indicators, got ${await steps.count()}`);
    // Org step fields
    const einInput = page.locator('input[placeholder="XX-XXXXXXX"]');
    if ((await einInput.count()) === 0) throw new Error("EIN input not found");
    const orgNameInput = page.locator('text="Organization name"');
    if ((await orgNameInput.count()) === 0) throw new Error("Org name label not found");
    // Continue button
    const continueBtn = page.locator('button:has-text("Continue")');
    if ((await continueBtn.count()) === 0) throw new Error("Continue button not found");
  });

  // 8. How it works page
  await test("How It Works page loads with pricing and FAQ", async (page) => {
    await page.goto(`${BASE}/how-it-works`, { waitUntil: "networkidle", timeout: 20000 });
    const body = await page.textContent("body");
    if (!body?.includes("How")) throw new Error("How it works content missing");
    // Pricing section
    const pricing = page.locator('text=/[Pp]ricing/');
    if ((await pricing.count()) === 0) throw new Error("Pricing section not found");
    // FAQ section
    const faq = page.locator('text=/FAQ|Frequently/');
    if ((await faq.count()) === 0) throw new Error("FAQ section not found");
    // Check for fee info
    const feeInfo = page.locator('text=/free|2\\.9%|fee/i');
    if ((await feeInfo.count()) === 0) throw new Error("Fee/pricing details not found");
  });

  await browser.close();

  // Summary
  console.log("\n" + "=".repeat(50));
  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`Results: ${passed} passed, ${failed} failed out of ${results.length} tests`);
  if (failed > 0) {
    console.log("\nFailed tests:");
    results.filter((r) => !r.pass).forEach((r) => console.log(`  - ${r.name}: ${r.error}`));
  }
  console.log("=".repeat(50));
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
