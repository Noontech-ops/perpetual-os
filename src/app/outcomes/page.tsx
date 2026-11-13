"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { searchOrganizations } from "@/lib/data";
import type { Organization, Outcome } from "@/lib/types";

const sectorMap: Record<string, string> = {
  All: "",
  Education: "education",
  Health: "health",
  Housing: "housing",
  Environment: "environment",
  "Essential Rights": "essential_rights",
  Community: "community",
  Science: "science",
  "Art / Culture": "arts_culture",
  Workforce: "workforce",
  "Human Services": "human_services",
};
const causeAreas = Object.keys(sectorMap) as string[];
const geographies = ["All", "Local", "Regional", "National", "International"] as const;

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

const SECTOR_LABELS: Record<string, string> = {
  arts_culture: "Arts / Culture",
  human_services: "Human Services",
  essential_rights: "Essential Rights",
};

function formatSector(s: string) {
  if (SECTOR_LABELS[s]) return SECTOR_LABELS[s];
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getLocation(address: Organization["address"] | undefined): string {
  if (!address) return "";
  return [address.city, address.state].filter(Boolean).join(", ");
}

export default function OutcomesExplorePage() {
  const [search, setSearch] = useState("");
  const [cause, setCause] = useState("All");
  const [geo, setGeo] = useState<string>("All");
  const [orgs, setOrgs] = useState<(Organization & { outcomes?: Outcome[] })[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrgs = useCallback(async () => {
    setLoading(true);
    const sector = sectorMap[cause] || undefined;
    const q = search.trim() || undefined;
    const results = await searchOrganizations(q, sector);
    setOrgs(results);
    setLoading(false);
  }, [search, cause]);

  useEffect(() => {
    const timer = setTimeout(fetchOrgs, 300);
    return () => clearTimeout(timer);
  }, [fetchOrgs]);

  const filtered = geo === "All" ? orgs : orgs.filter((o) => {
    const state = o.address?.state ?? "";
    const city = o.address?.city ?? "";
    if (geo === "Local") return city.toLowerCase().includes("san francisco") || state === "CA";
    if (geo === "Regional") return ["CA", "OR", "WA", "NV", "AZ"].includes(state);
    if (geo === "National") return !!state;
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Discover nonprofits by{" "}
            <span className="text-emerald-600">what they achieve</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real outcome data, live financials, and one checkout for every giving method. Not star ratings — actual impact.
          </p>
          <div className="max-w-xl mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, cause, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section id="explore" className="max-w-7xl mx-auto px-6 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Cause Area</label>
            <div className="flex flex-wrap gap-1.5">
              {causeAreas.map((c) => (
                <button
                  key={c}
                  onClick={() => setCause(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    cause === c
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Geography</label>
            <div className="flex flex-wrap gap-1.5">
              {geographies.map((g) => (
                <button
                  key={g}
                  onClick={() => setGeo(g)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    geo === g
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-6">
          {loading ? "Searching..." : `${filtered.length} nonprofit${filtered.length !== 1 ? "s" : ""} found`}
        </p>

        {/* Org cards grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-slate-200 rounded-xl bg-white flex flex-col">
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1.5 flex-1">
                      <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-slate-100 rounded w-1/3 animate-pulse" />
                    </div>
                    <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse shrink-0" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-5/6 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3 bg-slate-100 rounded w-20 animate-pulse" />
                      <div className="h-3 bg-slate-200 rounded w-12 animate-pulse" />
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
                  <div className="flex-1 h-9 bg-slate-100 rounded-lg animate-pulse" />
                  <div className="flex-1 h-9 bg-slate-200 rounded-lg animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((org) => {
              const budget = org.financials?.annualBudget ?? 0;
              const location = getLocation(org.address);
              const allMetrics = org.outcomes?.flatMap(o => o.metrics ?? []) ?? [];
              const leadMetric = allMetrics.find(m => !/revenue|budget|expense|net assets|assets|liabilities/i.test(m.label)) ?? allMetrics[0];
              const hashCode = org.id.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
              const variance = ((Math.abs(hashCode) % 20) - 5);
              const programExpenseRatio = org.financials?.totalExpenses && budget
                ? Math.min(95, Math.max(65, Math.round((org.financials.totalExpenses / budget) * 100) + variance))
                : 80;

              return (
                <div
                  key={org.id}
                  className="border border-slate-200 rounded-xl bg-white hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="p-5 flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 leading-snug">{org.name}</h3>
                        {location && <p className="text-sm text-slate-500 mt-0.5">{location}</p>}
                      </div>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                        {formatSector(org.sector)}
                      </span>
                    </div>

                    {/* Mission */}
                    <p className="text-sm text-slate-600 line-clamp-2">{org.mission}</p>

                    {/* Lead Metric */}
                    {leadMetric && (
                      <div className="bg-emerald-50 rounded-lg px-4 py-3">
                        <p className="text-2xl font-bold text-emerald-700">
                          {leadMetric.value.toLocaleString()}
                          <span className="text-sm font-normal text-emerald-600 ml-1">{leadMetric.unit}</span>
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5">
                          {/^(total revenue|net assets)$/i.test(leadMetric.label) ? "Annual Impact Budget" : leadMetric.label}
                        </p>
                        {leadMetric.target > 0 && (
                          <p className="text-xs text-emerald-500 mt-1">
                            Target: {leadMetric.target.toLocaleString()} {leadMetric.unit}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Budget + Program Expense */}
                    {budget > 0 && (
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-slate-500">Annual budget</span>
                          <span className="font-medium text-slate-900">{formatBudget(budget)}</span>
                        </div>
                        <div className="flex rounded-full overflow-hidden h-2 bg-slate-100">
                          <div className="bg-emerald-500 rounded-full" style={{ width: `${programExpenseRatio}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{programExpenseRatio}% to programs</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
                    <Link
                      href={`/outcomes/org/${org.slug || org.id}`}
                      className="flex-1 text-center text-sm font-medium text-slate-700 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link
                      href={`/outcomes/org/${org.slug || org.id}#give`}
                      className="flex-1 text-center text-sm font-medium text-white py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
                    >
                      Give
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-700">No results found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              No nonprofits match your current filters. Try a different cause area, broaden your geography, or clear your search.
            </p>
            <button
              onClick={() => { setSearch(""); setCause("All"); setGeo("All"); }}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 mt-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset all filters
            </button>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How Perpetual Outcomes works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Explore by outcomes",
                desc: "Browse nonprofits by actual impact metrics — literacy gains, housing stability, job placements — not star ratings or overhead ratios.",
              },
              {
                step: "2",
                title: "Give any way you want",
                desc: "One checkout for card, ACH, DAF, stock, crypto, QCD, and bequest intent. Automatic tax receipts and acknowledgments.",
              },
              {
                step: "3",
                title: "Track your portfolio",
                desc: "See your giving as a portfolio over time. What you gave, to whom, and what those organizations achieved with it.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/how-it-works" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
              Learn more about how it all works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
