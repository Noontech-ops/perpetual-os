"use client";

import Link from "next/link";

const portfolio = {
  totalGiven: 12750,
  orgsSupported: 5,
  totalImpacted: 1847,
  memberSince: "March 2024",
};

const holdings = [
  {
    id: "bay-area-literacy",
    name: "Bay Area Literacy Coalition",
    sector: "Education",
    totalGiven: 5000,
    allocation: 39.2,
    outcomeMetric: "847 adults reached reading proficiency",
    trend: 12,
    lastGift: "Oct 2026",
  },
  {
    id: "stable-ground-housing",
    name: "Stable Ground Housing",
    sector: "Essential Rights",
    totalGiven: 3000,
    allocation: 23.5,
    outcomeMetric: "18.3 avg months housing stability",
    trend: 8,
    lastGift: "Sep 2026",
  },
  {
    id: "community-health-partners",
    name: "Community Health Partners",
    sector: "Health",
    totalGiven: 2500,
    allocation: 19.6,
    outcomeMetric: "3,214 patients served",
    trend: 21,
    lastGift: "Aug 2026",
  },
  {
    id: "pathways-workforce",
    name: "Pathways Workforce Development",
    sector: "Community",
    totalGiven: 1500,
    allocation: 11.8,
    outcomeMetric: "412 job placements at 90 days",
    trend: 15,
    lastGift: "Oct 2026",
  },
  {
    id: "open-stage-arts",
    name: "Open Stage Arts Collective",
    sector: "Art / Culture",
    totalGiven: 750,
    allocation: 5.9,
    outcomeMetric: "11,480 free performance attendees",
    trend: 34,
    lastGift: "Jul 2026",
  },
];

const monthlyGiving = [
  { month: "Jan", amount: 500 },
  { month: "Feb", amount: 250 },
  { month: "Mar", amount: 1000 },
  { month: "Apr", amount: 500 },
  { month: "May", amount: 750 },
  { month: "Jun", amount: 1500 },
  { month: "Jul", amount: 1000 },
  { month: "Aug", amount: 2500 },
  { month: "Sep", amount: 3000 },
  { month: "Oct", amount: 1750 },
];

const causeAllocation = [
  { cause: "Education", pct: 39.2, color: "bg-emerald-500" },
  { cause: "Essential Rights", pct: 23.5, color: "bg-blue-500" },
  { cause: "Health", pct: 19.6, color: "bg-amber-500" },
  { cause: "Community", pct: 11.8, color: "bg-purple-500" },
  { cause: "Art / Culture", pct: 5.9, color: "bg-rose-400" },
];

const recommended = [
  {
    id: "watershed-collective",
    name: "Watershed Collective",
    sector: "Science",
    location: "Portland, OR",
    metric: "23.7 stream-miles restored",
    reason: "Based on your interest in environmental outcomes",
  },
  {
    id: "bay-area-literacy",
    name: "Eastside Youth Mentors",
    sector: "Education",
    location: "Los Angeles, CA",
    metric: "326 youth matched with mentors",
    reason: "Similar to orgs you support in education",
  },
  {
    id: "community-health-partners",
    name: "Rural Health Access Project",
    sector: "Health",
    location: "Appalachia Region",
    metric: "1,840 telehealth visits delivered",
    reason: "High-performing health org in underserved area",
  },
];

const maxMonthly = Math.max(...monthlyGiving.map((m) => m.amount));

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

export default function PortfolioPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Your Impact Portfolio</h1>
        <p className="text-slate-500 mt-1">Member since {portfolio.memberSince}</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Given", value: fmt(portfolio.totalGiven) },
          { label: "Organizations", value: String(portfolio.orgsSupported) },
          { label: "People Impacted", value: portfolio.totalImpacted.toLocaleString() },
          { label: "Avg Outcome Trend", value: "+18% YoY" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Holdings + chart */}
        <div className="lg:col-span-2 space-y-8">
          {/* Holdings table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200">
              <h2 className="font-semibold text-slate-900">Holdings</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-5 font-medium text-slate-500">Organization</th>
                    <th className="text-right py-3 px-5 font-medium text-slate-500">Given</th>
                    <th className="text-right py-3 px-5 font-medium text-slate-500">Alloc.</th>
                    <th className="text-left py-3 px-5 font-medium text-slate-500">Key Outcome</th>
                    <th className="text-right py-3 px-5 font-medium text-slate-500">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => (
                    <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-5">
                        <Link href={`/outcomes/org/${h.id}`} className="font-medium text-slate-900 hover:text-emerald-600">
                          {h.name}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{h.sector} &middot; Last gift {h.lastGift}</p>
                      </td>
                      <td className="py-3 px-5 text-right font-medium text-slate-900">{fmt(h.totalGiven)}</td>
                      <td className="py-3 px-5 text-right text-slate-600">{h.allocation}%</td>
                      <td className="py-3 px-5 text-slate-600 text-xs">{h.outcomeMetric}</td>
                      <td className="py-3 px-5 text-right text-emerald-600 font-medium">+{h.trend}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Giving over time */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Giving Over Time</h2>
            <div className="flex items-end gap-2 h-40">
              {monthlyGiving.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-medium">{fmt(m.amount)}</span>
                  <div className="w-full relative" style={{ height: `${(m.amount / maxMonthly) * 100}%` }}>
                    <div className="absolute inset-0 bg-emerald-500 rounded-t-md opacity-80" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">{m.month}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">2026 year-to-date</p>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-8">
          {/* Allocation by cause */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Allocation by Cause</h2>
            <div className="flex rounded-full overflow-hidden h-4 mb-4">
              {causeAllocation.map((c) => (
                <div key={c.cause} className={c.color} style={{ width: `${c.pct}%` }} title={c.cause} />
              ))}
            </div>
            <div className="space-y-2">
              {causeAllocation.map((c) => (
                <div key={c.cause} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
                    <span className="text-slate-600">{c.cause}</span>
                  </div>
                  <span className="font-medium text-slate-900">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Recommended for You</h2>
            <div className="space-y-4">
              {recommended.map((r) => (
                <div key={r.name} className="border border-slate-100 rounded-lg p-3 space-y-2 hover:border-emerald-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/outcomes/org/${r.id}`} className="font-medium text-sm text-slate-900 hover:text-emerald-600">
                        {r.name}
                      </Link>
                      <p className="text-xs text-slate-400">{r.location}</p>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded font-medium">{r.sector}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{r.metric}</p>
                  <p className="text-[11px] text-slate-400 italic">{r.reason}</p>
                  <Link
                    href={`/outcomes/org/${r.id}`}
                    className="inline-block text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    View profile &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
