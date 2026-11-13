import Link from "next/link";
import type { Metadata } from "next";
import * as mock from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Board View",
  description: "Board governance dashboard for Bay Area Literacy Coalition.",
};

const meetings = [
  { date: "2027-01-15", title: "Q4 2026 Board Meeting", status: "upcoming", items: ["FY26 audit review", "FY27 budget approval", "ED performance review", "Strategic plan update"] },
  { date: "2026-10-16", title: "Q3 2026 Board Meeting", status: "completed", items: ["Q3 financials review", "Grant pipeline update", "New program proposal", "Compliance audit results"] },
  { date: "2026-07-17", title: "Q2 2026 Board Meeting", status: "completed", items: ["Mid-year financials", "Fundraising campaign report", "Staff compensation review"] },
  { date: "2026-04-16", title: "Q1 2026 Board Meeting", status: "completed", items: ["FY25 annual report approval", "Q1 financials", "Board recruitment plan"] },
];

const resolutions = [
  { id: "R-2026-12", date: "2026-10-16", title: "Approve FY27 preliminary budget framework", status: "passed", votes: "7-0" },
  { id: "R-2026-11", date: "2026-10-16", title: "Authorize grant application to Hewlett Foundation ($250K)", status: "passed", votes: "7-0" },
  { id: "R-2026-10", date: "2026-10-16", title: "Accept Q3 2026 financial statements", status: "passed", votes: "6-0-1" },
  { id: "R-2026-09", date: "2026-07-17", title: "Approve new Digital Literacy Program launch", status: "passed", votes: "7-0" },
  { id: "R-2026-08", date: "2026-07-17", title: "Ratify ED compensation adjustment (+3% COLA)", status: "passed", votes: "6-1" },
  { id: "R-2026-07", date: "2026-04-16", title: "Approve FY25 audited financial statements", status: "passed", votes: "7-0" },
];

const compliance = [
  { item: "Form 990 Filing", due: "2026-11-15", status: "on_track", note: "Draft in review by Finance Agent" },
  { item: "State Registration Renewals (CA)", due: "2027-01-31", status: "on_track", note: "Auto-renewal initiated" },
  { item: "Annual Audit", due: "2027-03-31", status: "on_track", note: "Auditor engagement letter signed" },
  { item: "D&O Insurance Renewal", due: "2027-02-15", status: "attention", note: "Broker quote pending — follow up needed" },
  { item: "Board Conflict of Interest Disclosures", due: "2027-01-31", status: "on_track", note: "5 of 7 received" },
  { item: "Grant Covenant Compliance (SF Foundation)", due: "2026-12-31", status: "on_track", note: "87% of outcomes met — on track" },
];

export default function BoardDashboard() {
  const org = mock.organization;
  const fin = org.financials;
  const programs = mock.programs;
  const outcomes = mock.outcomes;
  const grants = mock.grants;
  const agentActions = mock.agentActions;

  const recentActions = agentActions.slice(0, 8);

  const activeGrants = grants.filter(
    (g) => g.status === "active" || g.status === "awarded"
  );
  const pendingGrants = grants.filter((g) => g.status === "applied");
  const upcomingDeadlines = grants
    .flatMap((g) =>
      g.deadlines
        .filter((d) => !d.completed && new Date(d.date) >= new Date())
        .map((d) => ({ grant: g, deadline: d }))
    )
    .sort(
      (a, b) =>
        new Date(a.deadline.date).getTime() -
        new Date(b.deadline.date).getTime()
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">Perpetual</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/os" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Full Dashboard
              </Link>
              <Link href="/outcomes" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                Marketplace
              </Link>
            </div>
          </div>
          <span className="text-sm font-medium text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full">Board View</span>
        </div>
      </nav>

      {/* Banner */}
      <div className="bg-brand-600 text-white py-3 px-6 text-center text-sm font-medium">
        {org.name} — Board Governance Dashboard
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
            <p className="text-slate-500 mt-1 max-w-2xl">{org.mission}</p>
          </div>
          <p className="text-xs text-slate-400 shrink-0">
            Data as of {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Key Financial Stats */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Revenue YTD", value: formatCurrency(fin?.totalRevenue ?? 0), bg: "bg-emerald-50 border-emerald-200" },
              { label: "Total Expenses", value: formatCurrency(fin?.totalExpenses ?? 0), bg: "bg-white border-slate-200" },
              { label: "Net Assets", value: formatCurrency(fin?.netAssets ?? 0), bg: "bg-emerald-50 border-emerald-200" },
              { label: "Cash on Hand", value: formatCurrency(fin?.cashOnHand ?? 0), bg: "bg-white border-slate-200" },
              { label: "Months of Runway", value: String(fin?.monthsOfRunway ?? 0), bg: (fin?.monthsOfRunway ?? 0) < 6 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200" },
            ].map((s) => (
              <div key={s.label} className={`border rounded-xl p-4 ${s.bg}`}>
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Board Meetings + Compliance side by side */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Board Meetings */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Board Meetings</h2>
            <div className="space-y-3">
              {meetings.map((m) => (
                <div key={m.date} className={`bg-white border rounded-xl p-5 ${m.status === "upcoming" ? "border-brand-300 ring-1 ring-brand-100" : "border-slate-200"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-sm">{m.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${m.status === "upcoming" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-500"}`}>
                      {m.status === "upcoming" ? "Upcoming" : "Completed"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{new Date(m.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {m.items.map((item) => (
                      <span key={item} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Compliance */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Compliance & Governance</h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Item</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Due</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {compliance.map((c) => (
                      <tr key={c.item} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <p className="font-medium text-slate-900">{c.item}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{c.note}</p>
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{formatDate(c.due)}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${c.status === "on_track" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {c.status === "on_track" ? "On Track" : "Needs Attention"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Resolutions */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Board Resolutions</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-500">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Resolution</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Vote</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {resolutions.map((r) => (
                    <tr key={r.id} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-slate-500 font-mono text-xs whitespace-nowrap">{r.id}</td>
                      <td className="py-3 px-4 text-slate-900">{r.title}</td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">{r.votes}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700">
                          Passed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Programs</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs.map((program) => {
              const programOutcomes = outcomes.filter(
                (o) => o.programId === program.id
              );
              const allMetrics = programOutcomes.flatMap((o) => o.metrics);
              const topMetric = allMetrics[0];

              return (
                <div
                  key={program.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{program.name}</h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        program.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {program.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Budget</span>
                      <span className="font-medium">{formatCurrency(program.annualBudget)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">YTD Spend</span>
                      <span className="font-medium">{formatCurrency(program.ytdSpend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Utilization</span>
                      <span className="font-medium">
                        {program.annualBudget > 0
                          ? Math.round((program.ytdSpend / program.annualBudget) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    {program.annualBudget > 0 && (
                      <div className="pt-1">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              program.ytdSpend / program.annualBudget > 0.9
                                ? "bg-amber-500"
                                : "bg-brand-500"
                            }`}
                            style={{ width: `${Math.min(100, Math.round((program.ytdSpend / program.annualBudget) * 100))}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {topMetric && (
                    <div className="border-t border-slate-100 pt-2">
                      <p className="text-xs text-slate-500">Top Outcome</p>
                      <p className="text-sm font-medium text-slate-900">
                        {topMetric.label}: {topMetric.value}
                        <span className="text-slate-400 text-xs">
                          {" "}/ {topMetric.target} {topMetric.unit}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Grant Pipeline + Agent Activity side by side */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Grant Pipeline */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Grant Pipeline</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Active</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{activeGrants.length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Pending</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{pendingGrants.length}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">Pipeline Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {formatCurrency(grants.reduce((s, g) => s + g.amountRequested, 0))}
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Pipeline by Status</h3>
              <div className="space-y-3">
                {(["prospect", "applied", "awarded", "active", "reporting"] as const).map((status) => {
                  const count = grants.filter((g) => g.status === status).length;
                  const total = grants.filter((g) => g.status !== "closed" && g.status !== "declined").length;
                  const colors: Record<string, string> = {
                    prospect: "bg-slate-400",
                    applied: "bg-amber-500",
                    awarded: "bg-blue-500",
                    active: "bg-emerald-500",
                    reporting: "bg-brand-500",
                  };
                  return (
                    <div key={status} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors[status]} shrink-0`} />
                      <span className="text-sm text-slate-600 w-24 capitalize">{status}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${colors[status]}`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
                      </div>
                      <span className="text-sm font-medium text-slate-900 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {upcomingDeadlines.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 mt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Upcoming Deadlines</h3>
                <div className="space-y-3">
                  {upcomingDeadlines.map((item) => (
                    <div
                      key={`${item.grant.id}-${item.deadline.date}`}
                      className="flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {item.grant.funderName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.deadline.description}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-slate-700 whitespace-nowrap">
                        {formatDate(item.deadline.date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Agent Activity */}
          <section>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent AI Agent Actions</h2>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Agent</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Action</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActions.map((action) => (
                      <tr key={action.id} className="border-b border-slate-100">
                        <td className="py-3 px-4 text-slate-600 capitalize whitespace-nowrap">
                          {action.agentType.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4 text-slate-900">{action.description}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                              action.status === "auto_approved"
                                ? "bg-green-50 text-green-700"
                                : action.status === "approved"
                                  ? "bg-blue-50 text-blue-700"
                                  : action.status === "pending"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                          >
                            {action.status.replace(/_/g, " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            {org.legalName} &middot; EIN {org.ein} &middot; {org.address?.city}, {org.address?.state}
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link href="/os" className="text-xs text-brand-600 hover:text-brand-700">
              Open full dashboard
            </Link>
            <Link href="/outcomes" className="text-xs text-brand-600 hover:text-brand-700">
              View marketplace
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
