"use client";

import Link from "next/link";
import { useState } from "react";

const tabs = ["Overview", "Financials", "Programs", "Outcomes", "Leadership"] as const;
type Tab = (typeof tabs)[number];

const paymentMethods = ["Card", "ACH", "DAF", "Stock", "Crypto", "QCD"] as const;

const orgData = {
  name: "Bay Area Literacy Coalition",
  ein: "82-4019376",
  location: "Oakland, CA",
  founded: 2018,
  mission:
    "Advancing adult and youth literacy across the Bay Area through evidence-based tutoring programs, digital access initiatives, and community partnerships.",
  annualRevenue: 820000,
  totalExpenses: 780000,
  programExpenseRatio: 82,
  peopleServed: 2340,
  programs: 3,
  yearsOperating: 8,
  staff: 12,
  volunteers: 85,
};

const revenueBreakdown = [
  { label: "Foundation Grants", amount: 369000, pct: 45, color: "bg-emerald-500" },
  { label: "Individual Donors", amount: 246000, pct: 30, color: "bg-blue-500" },
  { label: "Events & Fundraising", amount: 123000, pct: 15, color: "bg-amber-500" },
  { label: "Earned Revenue", amount: 82000, pct: 10, color: "bg-purple-500" },
];

const expenseBreakdown = [
  { label: "Programs", amount: 639600, pct: 82, color: "bg-emerald-500" },
  { label: "Administration", amount: 101400, pct: 13, color: "bg-slate-400" },
  { label: "Fundraising", amount: 39000, pct: 5, color: "bg-amber-500" },
];

const fundRestrictions = [
  { label: "Unrestricted", amount: 328000, pct: 40, color: "bg-emerald-500" },
  { label: "Temporarily Restricted", amount: 410000, pct: 50, color: "bg-blue-500" },
  { label: "Permanently Restricted", amount: 82000, pct: 10, color: "bg-purple-500" },
];

const programs = [
  {
    name: "Adult Literacy Program",
    description: "One-on-one and small group tutoring for adults seeking reading proficiency, GED preparation, and workforce literacy skills.",
    budget: 340000,
    served: 920,
    outcomes: [
      { metric: "Adults reaching reading proficiency", value: "847", trend: 12 },
      { metric: "Average grade-level improvement", value: "2.3 levels", trend: 8 },
      { metric: "Participants employed within 6 months", value: "68%", trend: 5 },
    ],
  },
  {
    name: "Youth Reading Initiative",
    description: "After-school and summer reading programs for K-8 students in Title I schools, focusing on reading confidence and grade-level performance.",
    budget: 210000,
    served: 1180,
    outcomes: [
      { metric: "Students reading at grade level", value: "72%", trend: 15 },
      { metric: "Average books read per student", value: "24", trend: 10 },
      { metric: "Parent engagement rate", value: "61%", trend: 18 },
    ],
  },
  {
    name: "Digital Access Bridge",
    description: "Providing devices, internet access, and digital literacy training to bridge the digital divide in underserved communities.",
    budget: 89600,
    served: 240,
    outcomes: [
      { metric: "Households connected", value: "240", trend: 42 },
      { metric: "Digital literacy certification rate", value: "88%", trend: 6 },
      { metric: "Continued internet access at 12 months", value: "94%", trend: 3 },
    ],
  },
];

const outcomeData = [
  { category: "Literacy", metric: "Adults reaching reading proficiency", value: "847", period: "FY2026 YTD", trend: 12, methodology: "Assessed using TABE (Test of Adult Basic Education) at intake and quarterly intervals. Proficiency defined as grade level 9+." },
  { category: "Literacy", metric: "Youth reading at grade level", value: "72%", period: "FY2026 YTD", trend: 15, methodology: "Measured via Fountas & Pinnell Benchmark Assessment System administered at start and end of program cycle." },
  { category: "Employment", metric: "Participants employed within 6 months", value: "68%", period: "FY2026 YTD", trend: 5, methodology: "Self-reported employment status at 90 and 180 day follow-up. Verified through employer confirmation for 40% sample." },
  { category: "Digital Access", metric: "Households connected to broadband", value: "240", period: "FY2026 YTD", trend: 42, methodology: "Direct count of households receiving device + internet subsidy. Connectivity verified via monthly automated ping." },
  { category: "Engagement", metric: "Volunteer hours contributed", value: "8,400", period: "FY2026 YTD", trend: 9, methodology: "Tracked via volunteer management system check-in/check-out logs." },
];

const leadership = [
  { name: "Maria Santos", title: "Executive Director", since: 2018, bio: "Former education policy director at SF Unified. Ed.D. from UC Berkeley." },
  { name: "James Liu", title: "Director of Programs", since: 2019, bio: "12 years in adult education. Previously at ProLiteracy." },
  { name: "Aisha Johnson", title: "Development Director", since: 2021, bio: "Background in foundation relations and major gifts. Previously at United Way Bay Area." },
  { name: "David Kim", title: "Board Chair", since: 2018, bio: "Partner at Morrison & Foerster. Pro bono legal counsel for education nonprofits." },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function OrgProfilePage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [giveAmount, setGiveAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState<string>("Card");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-6">
        <Link href="/outcomes" className="hover:text-emerald-600">Explore</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{orgData.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shrink-0">
                BA
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{orgData.name}</h1>
                <p className="text-slate-500 mt-1">{orgData.location} &middot; EIN {orgData.ein} &middot; Founded {orgData.founded}</p>
                <p className="text-slate-600 mt-2 leading-relaxed">{orgData.mission}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 mb-6">
            <div className="flex gap-6">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                    tab === t
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          {tab === "Overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Annual Revenue", value: fmt(orgData.annualRevenue) },
                  { label: "Programs", value: String(orgData.programs) },
                  { label: "People Served", value: orgData.peopleServed.toLocaleString() },
                  { label: "Years Operating", value: String(orgData.yearsOperating) },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Key Outcomes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {programs.map((p) => (
                    <div key={p.name} className="border border-slate-200 rounded-lg p-4 space-y-3">
                      <h4 className="font-medium text-slate-900 text-sm">{p.name}</h4>
                      {p.outcomes.slice(0, 1).map((o) => (
                        <div key={o.metric}>
                          <p className="text-2xl font-bold text-slate-900">{o.value}</p>
                          <p className="text-sm text-slate-500">{o.metric}</p>
                          <p className="text-xs text-emerald-600 font-medium mt-1">+{o.trend}% YoY</p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Quick Financials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-2">Revenue Sources</p>
                    <div className="flex rounded-full overflow-hidden h-3 mb-2">
                      {revenueBreakdown.map((r) => (
                        <div key={r.label} className={r.color} style={{ width: `${r.pct}%` }} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {revenueBreakdown.map((r) => (
                        <span key={r.label}>{r.label} {r.pct}%</span>
                      ))}
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-2">Expense Allocation</p>
                    <div className="flex rounded-full overflow-hidden h-3 mb-2">
                      {expenseBreakdown.map((e) => (
                        <div key={e.label} className={e.color} style={{ width: `${e.pct}%` }} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      {expenseBreakdown.map((e) => (
                        <span key={e.label}>{e.label} {e.pct}%</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "Financials" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", value: fmt(orgData.annualRevenue) },
                  { label: "Total Expenses", value: fmt(orgData.totalExpenses) },
                  { label: "Program Expense Ratio", value: `${orgData.programExpenseRatio}%` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  {revenueBreakdown.map((r) => (
                    <div key={r.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{r.label}</span>
                        <span className="font-medium text-slate-900">{fmt(r.amount)} ({r.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className={`${r.color} h-2.5 rounded-full`} style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Expense Allocation</h3>
                <div className="space-y-3">
                  {expenseBreakdown.map((e) => (
                    <div key={e.label}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">{e.label}</span>
                        <span className="font-medium text-slate-900">{fmt(e.amount)} ({e.pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className={`${e.color} h-2.5 rounded-full`} style={{ width: `${e.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Fund Restrictions</h3>
                <div className="flex rounded-full overflow-hidden h-4 mb-3">
                  {fundRestrictions.map((f) => (
                    <div key={f.label} className={f.color} style={{ width: `${f.pct}%` }} />
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {fundRestrictions.map((f) => (
                    <div key={f.label} className="border border-slate-200 rounded-lg p-3">
                      <p className="text-xs text-slate-500">{f.label}</p>
                      <p className="text-lg font-bold text-slate-900">{fmt(f.amount)}</p>
                      <p className="text-xs text-slate-400">{f.pct}% of funds</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Programs" && (
            <div className="space-y-6">
              {programs.map((p) => (
                <div key={p.name} className="border border-slate-200 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">{p.name}</h3>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-lg font-bold text-slate-900">{fmt(p.budget)}</p>
                      <p className="text-xs text-slate-500">annual budget</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{p.served.toLocaleString()} people served</span>
                    <span>&middot;</span>
                    <span>{fmt(Math.round(p.budget / p.served))} cost per participant</span>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {p.outcomes.map((o) => (
                      <div key={o.metric} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-slate-900">{o.value}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{o.metric}</p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">+{o.trend}% YoY</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "Outcomes" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Structured outcome data captured at the point of service. Each metric includes methodology so funders and donors can compare apples to apples.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Metric</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Value</th>
                      <th className="text-right py-3 px-4 font-medium text-slate-500">Trend</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outcomeData.map((o, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">{o.category}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-900">{o.metric}</td>
                        <td className="py-3 px-4 text-right font-semibold text-slate-900">{o.value}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 font-medium">+{o.trend}%</td>
                        <td className="py-3 px-4 text-slate-500">{o.period}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Methodology</h3>
                <div className="space-y-3">
                  {outcomeData.map((o, i) => (
                    <div key={i} className="border border-slate-200 rounded-lg p-4">
                      <p className="font-medium text-slate-900 text-sm">{o.metric}</p>
                      <p className="text-sm text-slate-600 mt-1 leading-relaxed">{o.methodology}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "Leadership" && (
            <div className="grid md:grid-cols-2 gap-4">
              {leadership.map((l) => (
                <div key={l.name} className="border border-slate-200 rounded-lg p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium shrink-0">
                    {l.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{l.name}</p>
                    <p className="text-sm text-emerald-600">{l.title}</p>
                    <p className="text-sm text-slate-500 mt-1">Since {l.since}</p>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{l.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Giving sidebar */}
        <aside id="give" className="lg:w-80 shrink-0">
          <div className="sticky top-20 border border-slate-200 rounded-xl p-6 space-y-5 bg-white shadow-sm">
            <h3 className="font-semibold text-slate-900">Give to {orgData.name}</h3>

            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Amount</label>
              <div className="flex gap-2 mb-2">
                {["25", "50", "100", "250", "500"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setGiveAmount(a)}
                    className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      giveAmount === a
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="text"
                  value={giveAmount}
                  onChange={(e) => setGiveAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Payment Method</label>
              <div className="grid grid-cols-3 gap-1.5">
                {paymentMethods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                      paymentMethod === m
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-medium text-base hover:bg-emerald-700 transition-colors">
              Give ${giveAmount || "0"}
            </button>

            <div className="text-xs text-slate-400 space-y-1">
              {paymentMethod === "Card" && <p>Processing fee: 2.2% + $0.30</p>}
              {paymentMethod === "ACH" && <p>Processing fee: 0.8% (capped at $5)</p>}
              {paymentMethod === "DAF" && <p>Flat fee: $5 per grant recommendation</p>}
              {paymentMethod === "Stock" && <p>Flat fee: $25 per transfer</p>}
              {paymentMethod === "Crypto" && <p>Processing fee: 1.5%</p>}
              {paymentMethod === "QCD" && <p>No processing fee</p>}
              <p>Tax receipt issued automatically via email.</p>
              <p>EIN: {orgData.ein}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
