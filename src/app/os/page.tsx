"use client";

import { useState, useEffect } from "react";
import {
  getGrants,
  getConstituents,
  getTransactions,
  getPrograms,
  getOutcomes,
  getAgentActions,
  updateAgentAction,
  runAgent,
} from "@/lib/data";
import type {
  Grant,
  Constituent,
  Transaction,
  Program,
  Outcome,
  AgentAction as AgentActionType,
} from "@/lib/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { AgentAction } from "@/components/ui/agent-action";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

const tabs = [
  "Overview",
  "Grants Agent",
  "Donors",
  "Finance",
  "Compliance",
  "Programs",
  "Outcomes",
  "Marketing",
  "Board",
] as const;
type Tab = (typeof tabs)[number];

const grantStatusVariant: Record<string, "default" | "info" | "warning" | "success"> = {
  prospect: "default",
  applied: "info",
  awarded: "warning",
  active: "success",
  reporting: "info",
  closed: "default",
  declined: "default",
};

const agentTypeLabels: Record<string, string> = {
  grants: "Grants Agent",
  donor_relations: "Donor Relations Agent",
  finance: "Finance Agent",
  compliance: "Compliance Agent",
  marketing: "Marketing Agent",
  board: "Board Agent",
};

function statusToAgentActionStatus(s: string): "auto-approved" | "pending" | "approved" | "rejected" {
  if (s === "auto_approved") return "auto-approved";
  if (s === "pending") return "pending";
  if (s === "approved") return "approved";
  return "rejected";
}

export default function OSDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [agentActions, setAgentActions] = useState<AgentActionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const map: Record<string, Tab> = {
      "#grants": "Grants Agent",
      "#donors": "Donors",
      "#finance": "Finance",
      "#compliance": "Compliance",
      "#programs": "Programs",
      "#outcomes": "Outcomes",
      "#marketing": "Marketing",
      "#board": "Board",
    };
    function onHash() {
      const t = map[window.location.hash];
      if (t) setActiveTab(t);
    }
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getGrants(),
      getConstituents(),
      getTransactions(),
      getPrograms(),
      getOutcomes(),
      getAgentActions(),
    ]).then(([g, c, t, p, o, a]) => {
      if (cancelled) return;
      setGrants(g);
      setConstituents(c);
      setTransactions(t);
      setPrograms(p);
      setOutcomes(o);
      setAgentActions(a);
      setLoading(false);
    }).catch((err) => {
      if (cancelled) return;
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [retryCount]);

  async function handleUpdateAction(id: string, status: "approved" | "rejected") {
    const ok = await updateAgentAction(id, status);
    if (ok) {
      setAgentActions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Tab bar renders immediately */}
        <div className="border-b border-slate-200 -mt-2">
          <nav className="flex gap-1 overflow-x-auto flex-nowrap">
            {tabs.map((tab) => (
              <div key={tab} className="px-4 py-2.5 text-sm font-medium text-slate-300 whitespace-nowrap">
                {tab}
              </div>
            ))}
          </nav>
        </div>
        {/* 4 skeleton stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        {/* 3 skeleton agent action cards + sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="border-b border-slate-200 -mt-2">
          <nav className="flex gap-1 overflow-x-auto flex-nowrap">
            {tabs.map((tab) => (
              <div key={tab} className="px-4 py-2.5 text-sm font-medium text-slate-300 whitespace-nowrap">
                {tab}
              </div>
            ))}
          </nav>
        </div>
        <ErrorState title="Dashboard failed to load" message={error} onRetry={() => setRetryCount(c => c + 1)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 -mt-2">
        <nav className="flex gap-1 overflow-x-auto flex-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0",
                activeTab === tab
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Overview" && (
        <OverviewTab
          grants={grants}
          constituents={constituents}
          transactions={transactions}
          outcomes={outcomes}
          agentActions={agentActions}
          onUpdateAction={handleUpdateAction}
        />
      )}
      {activeTab === "Grants Agent" && (
        <GrantsAgentTab grants={grants} programs={programs} />
      )}
      {activeTab === "Donors" && <DonorsTab constituents={constituents} />}
      {activeTab === "Finance" && (
        <FinanceTab transactions={transactions} grants={grants} />
      )}
      {activeTab === "Programs" && (
        <ProgramsTab programs={programs} outcomes={outcomes} />
      )}
      {activeTab === "Outcomes" && (
        <OutcomesTab programs={programs} outcomes={outcomes} />
      )}
      {activeTab === "Compliance" && <ComplianceTab grants={grants} />}
      {activeTab === "Marketing" && <MarketingTab />}
      {activeTab === "Board" && (
        <BoardTab
          grants={grants}
          transactions={transactions}
          programs={programs}
          outcomes={outcomes}
        />
      )}
    </div>
  );
}

/* ───────────────────────────── Overview Tab ───────────────────────────── */

function OverviewTab({
  grants,
  constituents,
  transactions,
  outcomes,
  agentActions,
  onUpdateAction,
}: {
  grants: Grant[];
  constituents: Constituent[];
  transactions: Transaction[];
  outcomes: Outcome[];
  agentActions: AgentActionType[];
  onUpdateAction: (id: string, status: "approved" | "rejected") => Promise<void>;
}) {
  const totalRevenueYTD = transactions
    .filter((t) => t.direction === "inflow")
    .reduce((sum, t) => sum + t.amount, 0);

  const activeGrantsList = grants.filter(
    (g) => g.status === "active" || g.status === "awarded"
  );

  const donors = constituents.filter((c) => c.type === "donor");

  const allMetrics = outcomes.flatMap((o) => o.metrics);
  const avgOutcomeScore =
    allMetrics.length > 0
      ? Math.round(
          allMetrics.reduce((sum, m) => sum + (m.value / m.target) * 100, 0) /
            allMetrics.length
        )
      : 0;

  const recentActions = agentActions.slice(0, 5);

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

  const restricted = transactions
    .filter((t) => t.direction === "inflow" && t.restriction !== "unrestricted")
    .reduce((s, t) => s + t.amount, 0);
  const unrestricted = transactions
    .filter((t) => t.direction === "inflow" && t.restriction === "unrestricted")
    .reduce((s, t) => s + t.amount, 0);
  const totalCash = restricted + unrestricted;

  const recentDonations = transactions
    .filter((t) => t.direction === "inflow")
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue YTD"
          value={formatCurrency(totalRevenueYTD)}
          change={12.3}
          changeLabel="vs last year"
        />
        <StatCard
          label="Active Grants"
          value={String(activeGrantsList.length)}
          change={2}
          changeLabel="new this quarter"
        />
        <StatCard
          label="Donor Count"
          value={String(donors.length)}
          change={8.1}
          changeLabel="vs last year"
        />
        <StatCard
          label="Outcome Score"
          value={`${avgOutcomeScore}%`}
          change={4.5}
          changeLabel="vs last period"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Agent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActions.map((action) => (
                <AgentAction
                  key={action.id}
                  agentName={agentTypeLabels[action.agentType] ?? action.agentType}
                  agentType={action.agentType.replace("_", "-")}
                  action={action.description}
                  evidence={action.evidence}
                  status={statusToAgentActionStatus(action.status)}
                  timestamp={formatDate(action.createdAt)}
                  onApprove={
                    action.status === "pending"
                      ? () => onUpdateAction(action.id, "approved")
                      : undefined
                  }
                  onReject={
                    action.status === "pending"
                      ? () => onUpdateAction(action.id, "rejected")
                      : undefined
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((item) => (
                <div
                  key={`${item.grant.id}-${item.deadline.date}`}
                  className="flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {item.grant.funderName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {item.deadline.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-700">
                      {formatDate(item.deadline.date)}
                    </p>
                    <Badge variant={grantStatusVariant[item.grant.status]}>
                      {item.deadline.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalCash)}
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Unrestricted</span>
                  <span className="font-medium">
                    {formatCurrency(unrestricted)}
                  </span>
                </div>
                <Progress
                  value={totalCash > 0 ? (unrestricted / totalCash) * 100 : 0}
                  color="default"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Restricted</span>
                  <span className="font-medium">
                    {formatCurrency(restricted)}
                  </span>
                </div>
                <Progress
                  value={totalCash > 0 ? (restricted / totalCash) * 100 : 0}
                  color="warning"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDonations.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(tx.date)} &middot;{" "}
                      <span className="capitalize">
                        {tx.restriction.replace(/_/g, " ")}
                      </span>
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600 shrink-0">
                    +{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ──────────────────────────── Grants Agent Tab ──────────────────────────── */

function GrantsAgentTab({
  grants,
  programs,
}: {
  grants: Grant[];
  programs: Program[];
}) {
  const [agentResult, setAgentResult] = useState<string | null>(null);
  const [agentRunning, setAgentRunning] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);

  async function handleRunAgent() {
    setAgentRunning(true);
    setAgentResult(null);
    setAgentError(null);
    try {
      const result = await runAgent(
        "grants",
        "Find new grant opportunities and draft recommendations for our organization."
      );
      if (!result) {
        setAgentError("Agent unavailable — check your Anthropic API key at console.anthropic.com");
      } else {
        setAgentResult(result);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Agent request failed";
      if (msg.includes("credit") || msg.includes("billing")) {
        setAgentError("Agent unavailable — add API credits at console.anthropic.com");
      } else if (msg.includes("rate") || msg.includes("429")) {
        setAgentError("Agent is rate limited — please try again in a moment");
      } else if (msg.includes("key") || msg.includes("401") || msg.includes("403")) {
        setAgentError("Agent unavailable — check your Anthropic API key");
      } else {
        setAgentError(msg);
      }
    }
    setAgentRunning(false);
  }

  const pipelineValue = grants.reduce((s, g) => s + g.amountRequested, 0);
  const now = new Date();
  const dueThisMonth = grants.filter((g) =>
    g.deadlines.some((d) => {
      const dd = new Date(d.date);
      return !d.completed && dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear();
    })
  );
  const wonGrants = grants.filter(
    (g) => g.status === "active" || g.status === "awarded"
  );
  const closedGrants = grants.filter((g) => g.status === "closed");
  const winRate =
    wonGrants.length + closedGrants.length > 0
      ? Math.round(
          (wonGrants.length / (wonGrants.length + closedGrants.length)) * 100
        )
      : 0;

  const recommendations = [
    {
      id: "rec-1",
      type: "New Funder",
      title: "Silicon Valley Community Foundation — Education Fund",
      evidence:
        "Matches your literacy focus. Gave $2.1M to Bay Area education nonprofits last year. Application window opens Jan 15.",
      priority: "high",
    },
    {
      id: "rec-2",
      type: "Proposal Due",
      title: "Draft renewal for SF Foundation Year 3",
      evidence:
        "Current grant ($75K) expires in 90 days. 87% of outcomes met. Renewal rate for orgs at this level: 78%. Draft is ready for your review.",
      priority: "high",
    },
    {
      id: "rec-3",
      type: "Report Due",
      title: "Mid-year report — Hellman Foundation",
      evidence:
        "Due in 21 days. All outcome data is captured. Financials reconciled through Q2. Ready to generate in their template.",
      priority: "medium",
    },
    {
      id: "rec-4",
      type: "New Funder",
      title: "Chan Zuckerberg Initiative — Community Resilience",
      evidence:
        "New program area announced Oct 2026. Your Digital Access program aligns with their focus on digital equity. LOI deadline: Feb 28.",
      priority: "medium",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Pipeline Value" value={formatCurrency(pipelineValue)} />
        <StatCard
          label="Proposals Due This Month"
          value={String(dueThisMonth.length)}
        />
        <StatCard label="Win Rate" value={`${winRate}%`} change={5} />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Grant Pipeline</CardTitle>
            <button
              onClick={handleRunAgent}
              disabled={agentRunning}
              className="px-4 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
              {agentRunning ? "Running Agent..." : "Run Grants Agent"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {agentError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeWidth="2" d="M12 8v4M12 16h.01" />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-800">{agentError}</p>
                <button onClick={() => setAgentError(null)} className="mt-1 text-xs text-red-600 hover:text-red-700">Dismiss</button>
              </div>
            </div>
          )}
          {agentResult && (
            <div className="mb-4 p-4 bg-brand-50 border border-brand-200 rounded-lg">
              <p className="text-xs font-medium text-brand-700 mb-1">Agent Result</p>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{agentResult}</p>
              <button
                onClick={() => setAgentResult(null)}
                className="mt-2 text-xs text-slate-500 hover:text-slate-700"
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Funder</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Amount</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Status</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Next Deadline</th>
                  <th className="text-left py-3 px-3 text-slate-500 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {grants.map((grant) => {
                  const nextDeadline = grant.deadlines
                    .filter((d) => !d.completed)
                    .sort(
                      (a, b) =>
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                    )[0];
                  return (
                    <tr
                      key={grant.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-3">
                        <p className="font-medium text-slate-900">
                          {grant.funderName}
                        </p>
                        {grant.programId && (
                          <p className="text-xs text-slate-500">
                            {programs.find((p) => p.id === grant.programId)
                              ?.name ?? "General"}
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-3 font-medium">
                        {formatCurrency(grant.amountAwarded ?? grant.amountRequested)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={grantStatusVariant[grant.status]}>
                          {grant.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {nextDeadline ? formatDate(nextDeadline.date) : "—"}
                      </td>
                      <td className="py-3 px-3 w-32">
                        <Progress
                          value={
                            grant.status === "active" && grant.amountAwarded
                              ? (grant.amountSpent / grant.amountAwarded) * 100
                              : grant.status === "awarded"
                                ? 50
                                : grant.status === "applied"
                                  ? 25
                                  : grant.status === "prospect"
                                    ? 10
                                    : 100
                          }
                          color={
                            grant.status === "active" ? "success" : "default"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grants Agent Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-brand-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={rec.priority === "high" ? "warning" : "info"}
                      >
                        {rec.type}
                      </Badge>
                      <span className="text-xs text-slate-400 uppercase">
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">{rec.title}</p>
                    <p className="text-sm text-slate-600">{rec.evidence}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
                      Approve
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─────────────────────────────── Donors Tab ─────────────────────────────── */

function DonorsTab({ constituents }: { constituents: Constituent[] }) {
  const [segment, setSegment] = useState<
    "all" | "major" | "mid" | "grassroots"
  >("all");

  const donors = constituents.filter((c) => c.type === "donor");

  const segmented = donors.filter((d) => {
    if (segment === "all") return true;
    const total = d.givingHistory.totalLifetime;
    if (segment === "major") return total >= 10000;
    if (segment === "mid") return total >= 1000 && total < 10000;
    return total < 1000;
  });

  const majorCount = donors.filter(
    (d) => d.givingHistory.totalLifetime >= 10000
  ).length;
  const midCount = donors.filter(
    (d) =>
      d.givingHistory.totalLifetime >= 1000 &&
      d.givingHistory.totalLifetime < 10000
  ).length;
  const grassrootsCount = donors.filter(
    (d) => d.givingHistory.totalLifetime < 1000
  ).length;

  const donorRecs = [
    {
      id: "dr-1",
      action: "Draft stewardship email",
      donor: "Margaret Cho",
      reason:
        "Annual gift of $15K received 8 months ago. No personalized impact update sent. Founding donor with $85K lifetime giving.",
    },
    {
      id: "dr-2",
      action: "Re-engagement campaign",
      donor: "Patricia Moreno",
      reason:
        "Gave $500/yr for 3 years, no gift in 24 months. Engagement score dropped to 25. Previous event donor — send gala invite.",
    },
    {
      id: "dr-3",
      action: "Upgrade cultivation",
      donor: "Jonathan Liu",
      reason:
        "Consistent $2.5K gifts, increasing trajectory. Works at Stripe (matching gifts available). Engagement score 68, trending up.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 flex-wrap">
        {(
          [
            { key: "all" as const, label: "All Donors", count: donors.length },
            {
              key: "major" as const,
              label: "Major ($10K+)",
              count: majorCount,
            },
            {
              key: "mid" as const,
              label: "Mid-Level ($1K–$10K)",
              count: midCount,
            },
            {
              key: "grassroots" as const,
              label: "Grassroots (<$1K)",
              count: grassrootsCount,
            },
          ] as const
        ).map((seg) => (
          <button
            key={seg.key}
            onClick={() => setSegment(seg.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              segment === seg.key
                ? "bg-brand-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {seg.label}{" "}
            <span
              className={cn(
                "ml-1",
                segment === seg.key ? "text-brand-200" : "text-slate-400"
              )}
            >
              {seg.count}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Type</th>
                  <th className="text-right py-3 px-4 text-slate-500 font-medium">Total Given</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Last Gift</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Engagement</th>
                  <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {segmented.map((donor) => {
                  const score = donor.engagementScore;
                  const status =
                    score >= 70
                      ? "active"
                      : score >= 40
                        ? "upgrade-ready"
                        : "lapsed";
                  return (
                    <tr
                      key={donor.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-900">
                          {donor.firstName} {donor.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{donor.email}</p>
                      </td>
                      <td className="py-3 px-4 capitalize text-slate-600">
                        {donor.type.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {formatCurrency(donor.givingHistory.totalLifetime)}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {donor.givingHistory.lastGiftDate
                          ? formatDate(donor.givingHistory.lastGiftDate)
                          : "—"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress
                              value={score}
                              color={
                                score >= 70
                                  ? "success"
                                  : score >= 40
                                    ? "warning"
                                    : "danger"
                              }
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {score}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            status === "active"
                              ? "success"
                              : status === "upgrade-ready"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Donor Relations Agent Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donorRecs.map((rec) => (
              <div
                key={rec.id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-medium text-slate-900">{rec.action}</p>
                    <p className="text-sm text-brand-600">{rec.donor}</p>
                    <p className="text-sm text-slate-600">{rec.reason}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                      Draft
                    </button>
                    <button className="px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ──────────────────────────── Finance Tab ──────────────────────────── */

function FinanceTab({
  transactions,
  grants,
}: {
  transactions: Transaction[];
  grants: Grant[];
}) {
  const income = transactions
    .filter((t) => t.direction === "inflow")
    .reduce((s, t) => s + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.direction === "outflow")
    .reduce((s, t) => s + t.amount, 0);
  const maxBar = Math.max(income, expenses);

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const forecast = [62000, 58000, 71000, 65000, 54000, 48000, 73000, 68000, 70000];

  const restrictedFunds = grants
    .filter((g) => g.status === "active")
    .map((g) => ({
      name: g.funderName,
      budget: g.amountAwarded ?? g.amountRequested,
      spent: g.amountSpent,
    }));

  const financeActions = [
    {
      id: "fa-1",
      action: "Monthly reconciliation — October 2026",
      status: "complete",
      detail:
        "All 47 transactions matched. Bank balance reconciled to $284,312.50. No discrepancies.",
    },
    {
      id: "fa-2",
      action: "Anomaly detected — Duplicate vendor payment",
      status: "flagged",
      detail:
        "Two payments of $3,200 to Office Depot on Oct 12 and Oct 14. Same invoice #. Likely duplicate. Recommend requesting refund.",
    },
    {
      id: "fa-3",
      action: "Cash forecast updated",
      status: "complete",
      detail:
        "Runway: 3.4 months at current burn. Restricted funds sufficient through grant periods. Unrestricted reserves at 3.1 months.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Income YTD" value={formatCurrency(income)} change={12.3} />
        <StatCard
          label="Total Expenses YTD"
          value={formatCurrency(expenses)}
          change={-3.2}
        />
        <StatCard
          label="Net Position"
          value={formatCurrency(income - expenses)}
          change={18.7}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Revenue</span>
                  <span className="font-medium text-emerald-600">
                    {formatCurrency(income)}
                  </span>
                </div>
                <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-lg transition-all"
                    style={{
                      width: `${maxBar > 0 ? (income / maxBar) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Expenses</span>
                  <span className="font-medium text-rose-600">
                    {formatCurrency(expenses)}
                  </span>
                </div>
                <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-lg transition-all"
                    style={{
                      width: `${maxBar > 0 ? (expenses / maxBar) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 text-slate-500 font-medium">Month</th>
                    <th className="text-right py-2 px-2 text-slate-500 font-medium">Projected Cash</th>
                    <th className="text-left py-2 px-2 text-slate-500 font-medium w-24">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {months.map((month, i) => (
                    <tr key={month} className="border-b border-slate-50">
                      <td className="py-2 px-2 text-slate-700">{month}</td>
                      <td className="py-2 px-2 text-right font-medium">
                        {formatCurrency(forecast[i])}
                      </td>
                      <td className="py-2 px-2">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-500 rounded-full"
                            style={{
                              width: `${(forecast[i] / Math.max(...forecast)) * 100}%`,
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restricted Fund Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {restrictedFunds.map((fund, i) => {
              const ratio = fund.budget > 0 ? fund.spent / fund.budget : 0;
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-900">
                      {fund.name}
                    </span>
                    <span className="text-slate-500">
                      {formatCurrency(fund.spent)} /{" "}
                      {formatCurrency(fund.budget)}
                    </span>
                  </div>
                  <Progress
                    value={ratio * 100}
                    color={
                      ratio > 0.9
                        ? "danger"
                        : ratio > 0.7
                          ? "warning"
                          : "success"
                    }
                  />
                  <p className="text-xs text-slate-500">
                    {formatCurrency(fund.budget - fund.spent)} remaining
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Finance Agent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financeActions.map((action) => (
              <div
                key={action.id}
                className="border border-slate-200 rounded-lg p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {action.action}
                      </p>
                      <Badge
                        variant={
                          action.status === "complete"
                            ? "success"
                            : action.status === "flagged"
                              ? "danger"
                              : "default"
                        }
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{action.detail}</p>
                  </div>
                  {action.status === "flagged" && (
                    <button className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-700 rounded-lg hover:bg-rose-100 shrink-0">
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ──────────────────────────── Programs Tab ──────────────────────────── */

function ProgramsTab({
  programs,
  outcomes,
}: {
  programs: Program[];
  outcomes: Outcome[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => {
          const programOutcomes = outcomes.filter(
            (o) => o.programId === program.id
          );
          const allMetrics = programOutcomes.flatMap((o) => o.metrics);
          const avgPerformance =
            allMetrics.length > 0
              ? Math.round(
                  allMetrics.reduce(
                    (s, m) => s + (m.value / m.target) * 100,
                    0
                  ) / allMetrics.length
                )
              : 0;

          return (
            <Card key={program.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{program.name}</CardTitle>
                  <Badge
                    variant={
                      program.status === "active" ? "success" : "default"
                    }
                  >
                    {program.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">{program.description}</p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Budget</span>
                    <span className="font-medium">
                      {formatCurrency(program.annualBudget)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">YTD Spend</span>
                    <span className="font-medium">
                      {formatCurrency(program.ytdSpend)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Clients Served</span>
                    <span className="font-medium">
                      {program.clientsServed}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Sector</span>
                    <span className="font-medium capitalize">
                      {program.sector === "arts_culture" ? "Arts / Culture"
                        : program.sector === "human_services" ? "Human Services"
                        : program.sector === "essential_rights" ? "Essential Rights"
                        : program.sector.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-500">Outcome Performance</span>
                    <span className="font-medium">{avgPerformance}%</span>
                  </div>
                  <Progress
                    value={avgPerformance}
                    color={
                      avgPerformance >= 80
                        ? "success"
                        : avgPerformance >= 60
                          ? "warning"
                          : "danger"
                    }
                  />
                </div>

                {allMetrics.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Key Metrics
                    </p>
                    {allMetrics.slice(0, 3).map((metric, idx) => {
                      const pct = Math.round((metric.value / metric.target) * 100);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-600 truncate mr-2">
                            {metric.label}
                          </span>
                          <span className="font-medium shrink-0 flex items-center gap-1">
                            {metric.value}
                            <span className="text-slate-400 text-xs">
                              {metric.unit}
                            </span>
                            {pct >= 100 ? (
                              <span className="text-emerald-500 text-xs">
                                &#10003;
                              </span>
                            ) : (
                              <span className="text-slate-400 text-xs">
                                / {metric.target}
                              </span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────── Outcomes Tab ──────────────────────────── */

function OutcomesTab({
  programs,
  outcomes,
}: {
  programs: Program[];
  outcomes: Outcome[];
}) {
  const allMetrics = outcomes.flatMap((o) =>
    o.metrics.map((m) => ({ ...m, outcomeId: o.id, programId: o.programId }))
  );
  const avgPct =
    allMetrics.length > 0
      ? Math.round(
          allMetrics.reduce(
            (s, m) => s + (m.value / m.target) * 100,
            0
          ) / allMetrics.length
        )
      : 0;
  const goalsMet = allMetrics.filter(
    (m) => m.value >= m.target
  ).length;

  const programGroups = programs.map((program) => ({
    program,
    programOutcomes: outcomes.filter((o) => o.programId === program.id),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Metrics Tracked"
          value={String(allMetrics.length)}
        />
        <StatCard
          label="Avg Performance"
          value={`${avgPct}%`}
          change={4.5}
          changeLabel="vs last period"
        />
        <StatCard
          label="Goals Met"
          value={`${goalsMet} / ${allMetrics.length}`}
        />
      </div>

      {programGroups.map(({ program, programOutcomes }) => (
        <Card key={program.id}>
          <CardHeader>
            <CardTitle>{program.name} — Outcomes Ledger</CardTitle>
          </CardHeader>
          <CardContent>
            {programOutcomes.length === 0 ? (
              <p className="text-sm text-slate-500">
                No outcome data captured yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Metric</th>
                      <th className="text-right py-3 px-3 text-slate-500 font-medium">Current</th>
                      <th className="text-right py-3 px-3 text-slate-500 font-medium">Target</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Progress</th>
                      <th className="text-left py-3 px-3 text-slate-500 font-medium">Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programOutcomes.flatMap((outcome) =>
                      outcome.metrics.map((metric, mIdx) => {
                        const pct = Math.round(
                          (metric.value / metric.target) * 100
                        );
                        return (
                          <tr
                            key={`${outcome.id}-${mIdx}`}
                            className="border-b border-slate-100 hover:bg-slate-50"
                          >
                            <td className="py-3 px-3">
                              <p className="font-medium text-slate-900">
                                {metric.label}
                              </p>
                              <p className="text-xs text-slate-500">
                                {metric.unit}
                              </p>
                            </td>
                            <td className="py-3 px-3 text-right font-medium">
                              {metric.value}
                            </td>
                            <td className="py-3 px-3 text-right text-slate-500">
                              {metric.target}
                            </td>
                            <td className="py-3 px-3 w-32">
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={Math.min(pct, 100)}
                                  color={
                                    pct >= 100
                                      ? "success"
                                      : pct >= 70
                                        ? "default"
                                        : pct >= 40
                                          ? "warning"
                                          : "danger"
                                  }
                                />
                                <span className="text-xs text-slate-500 shrink-0">
                                  {pct}%
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-500 text-xs">
                              {metric.periodStart
                                ? `${formatDate(metric.periodStart)} – ${formatDate(metric.periodEnd)}`
                                : outcome.reportingPeriod}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

