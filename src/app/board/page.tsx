import Link from "next/link";
import * as mock from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BoardDashboard() {
  const org = mock.organization;
  const fin = org.financials;
  const programs = mock.programs;
  const outcomes = mock.outcomes;
  const grants = mock.grants;
  const agentActions = mock.agentActions;

  const recentActions = agentActions.slice(0, 10);

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
      {/* Banner */}
      <div className="bg-indigo-600 text-white py-2 px-6 text-center text-sm font-medium">
        Board View — {org.name}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
          <p className="text-slate-500 mt-1">{org.mission}</p>
          <p className="text-xs text-slate-400 mt-2">
            Data as of {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {/* Key Financial Stats */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Financial Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Revenue YTD", value: formatCurrency(fin?.totalRevenue ?? 0) },
              { label: "Total Expenses", value: formatCurrency(fin?.totalExpenses ?? 0) },
              { label: "Net Assets", value: formatCurrency(fin?.netAssets ?? 0) },
              { label: "Cash on Hand", value: formatCurrency(fin?.cashOnHand ?? 0) },
              { label: "Months of Runway", value: String(fin?.monthsOfRunway ?? 0) },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs text-slate-500">{s.label}</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Program Summary */}
        <div>
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
        </div>

        {/* Agent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent AI Agent Actions</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Agent</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Action</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-500">Date</th>
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
                            action.status === "auto_approved" || action.status === "approved"
                              ? "bg-green-50 text-green-700"
                              : action.status === "pending"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {action.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(action.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Grant Pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Grant Pipeline</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">Active Grants</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{activeGrants.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">Pending Applications</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{pendingGrants.length}</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs text-slate-500">Pipeline Value</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(grants.reduce((s, g) => s + g.amountRequested, 0))}
              </p>
            </div>
          </div>

          {upcomingDeadlines.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
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
        </div>

        {/* Footer */}
        <div className="text-center pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-400">
            {org.legalName} &middot; EIN {org.ein} &middot; {org.address?.city}, {org.address?.state}
          </p>
          <Link href="/os" className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 inline-block">
            Open full dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
