"use client";

import Link from "next/link";
import { useState } from "react";

const causeAreas = ["All", "Education", "Health", "Essential Rights", "Community", "Science", "Art / Culture"] as const;
const geographies = ["All", "Local", "Regional", "National", "International"] as const;

interface OrgCard {
  id: string;
  name: string;
  location: string;
  sector: string;
  mission: string;
  outcomeMetric: string;
  outcomeValue: string;
  outcomeTrend: number;
  annualBudget: number;
  fundingSources: { label: string; pct: number; color: string }[];
  geography: string;
}

const orgs: OrgCard[] = [
  {
    id: "bay-area-literacy",
    name: "Bay Area Literacy Coalition",
    location: "Oakland, CA",
    sector: "Education",
    mission: "Advancing adult and youth literacy across the Bay Area through evidence-based programs.",
    outcomeMetric: "adults reached reading proficiency",
    outcomeValue: "847",
    outcomeTrend: 12,
    annualBudget: 820000,
    fundingSources: [
      { label: "Grants", pct: 45, color: "bg-emerald-500" },
      { label: "Individual", pct: 30, color: "bg-blue-500" },
      { label: "Events", pct: 15, color: "bg-amber-500" },
      { label: "Other", pct: 10, color: "bg-slate-400" },
    ],
    geography: "Local",
  },
  {
    id: "stable-ground-housing",
    name: "Stable Ground Housing",
    location: "Denver, CO",
    sector: "Essential Rights",
    mission: "Preventing homelessness and building long-term housing stability for families.",
    outcomeMetric: "avg months of housing stability",
    outcomeValue: "18.3",
    outcomeTrend: 8,
    annualBudget: 2100000,
    fundingSources: [
      { label: "Government", pct: 40, color: "bg-emerald-500" },
      { label: "Grants", pct: 35, color: "bg-blue-500" },
      { label: "Individual", pct: 25, color: "bg-amber-500" },
    ],
    geography: "Regional",
  },
  {
    id: "community-health-partners",
    name: "Community Health Partners",
    location: "Atlanta, GA",
    sector: "Health",
    mission: "Expanding access to primary and preventive care in underserved communities.",
    outcomeMetric: "patients served with no prior access",
    outcomeValue: "3,214",
    outcomeTrend: 21,
    annualBudget: 4500000,
    fundingSources: [
      { label: "Earned", pct: 50, color: "bg-emerald-500" },
      { label: "Grants", pct: 30, color: "bg-blue-500" },
      { label: "Individual", pct: 20, color: "bg-amber-500" },
    ],
    geography: "Regional",
  },
  {
    id: "pathways-workforce",
    name: "Pathways Workforce Development",
    location: "Chicago, IL",
    sector: "Community",
    mission: "Connecting underemployed adults to living-wage careers through training and placement.",
    outcomeMetric: "job placements retained at 90 days",
    outcomeValue: "412",
    outcomeTrend: 15,
    annualBudget: 1350000,
    fundingSources: [
      { label: "Government", pct: 35, color: "bg-emerald-500" },
      { label: "Corporate", pct: 30, color: "bg-blue-500" },
      { label: "Grants", pct: 25, color: "bg-amber-500" },
      { label: "Individual", pct: 10, color: "bg-slate-400" },
    ],
    geography: "Local",
  },
  {
    id: "watershed-collective",
    name: "Watershed Collective",
    location: "Portland, OR",
    sector: "Science",
    mission: "Restoring urban waterways and building community science capacity.",
    outcomeMetric: "stream-miles restored to health",
    outcomeValue: "23.7",
    outcomeTrend: 6,
    annualBudget: 950000,
    fundingSources: [
      { label: "Grants", pct: 55, color: "bg-emerald-500" },
      { label: "Government", pct: 25, color: "bg-blue-500" },
      { label: "Individual", pct: 20, color: "bg-amber-500" },
    ],
    geography: "Regional",
  },
  {
    id: "open-stage-arts",
    name: "Open Stage Arts Collective",
    location: "Brooklyn, NY",
    sector: "Art / Culture",
    mission: "Making world-class performing arts accessible to all New Yorkers regardless of income.",
    outcomeMetric: "free performance attendees",
    outcomeValue: "11,480",
    outcomeTrend: 34,
    annualBudget: 680000,
    fundingSources: [
      { label: "Individual", pct: 40, color: "bg-emerald-500" },
      { label: "Grants", pct: 30, color: "bg-blue-500" },
      { label: "Earned", pct: 20, color: "bg-amber-500" },
      { label: "Corporate", pct: 10, color: "bg-slate-400" },
    ],
    geography: "Local",
  },
];

function formatBudget(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  return `$${(n / 1_000).toFixed(0)}K`;
}

export default function OutcomesExplorePage() {
  const [search, setSearch] = useState("");
  const [cause, setCause] = useState<string>("All");
  const [geo, setGeo] = useState<string>("All");

  const filtered = orgs.filter((o) => {
    if (cause !== "All" && o.sector !== cause) return false;
    if (geo !== "All" && o.geography !== geo) return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.mission.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-emerald-50 to-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
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
        <p className="text-sm text-slate-500 mb-6">{filtered.length} nonprofit{filtered.length !== 1 ? "s" : ""} found</p>

        {/* Org cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((org) => (
            <div
              key={org.id}
              className="border border-slate-200 rounded-xl bg-white hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 leading-snug">{org.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{org.location}</p>
                  </div>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                    {org.sector}
                  </span>
                </div>

                {/* Outcome metric */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-slate-900">{org.outcomeValue}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{org.outcomeMetric}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                    {org.outcomeTrend}% year-over-year
                  </p>
                </div>

                {/* Budget + Funding */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-500">Annual budget</span>
                    <span className="font-medium text-slate-900">{formatBudget(org.annualBudget)}</span>
                  </div>
                  <div className="flex rounded-full overflow-hidden h-2">
                    {org.fundingSources.map((s) => (
                      <div
                        key={s.label}
                        className={`${s.color}`}
                        style={{ width: `${s.pct}%` }}
                        title={`${s.label}: ${s.pct}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                    {org.fundingSources.map((s) => (
                      <span key={s.label} className="text-[11px] text-slate-400">
                        {s.label} {s.pct}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-3">
                <Link
                  href={`/outcomes/org/${org.id}`}
                  className="flex-1 text-center text-sm font-medium text-slate-700 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  href={`/outcomes/org/${org.id}#give`}
                  className="flex-1 text-center text-sm font-medium text-white py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  Give
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500">No nonprofits match your filters. Try broadening your search.</p>
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
        </div>
      </section>
    </div>
  );
}
