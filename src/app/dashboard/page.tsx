"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getOrganization,
  getPrograms,
  getOutcomes,
  getGrants,
  getAgentActions,
  getAgentConfigs,
} from "@/lib/data";
import type {
  Organization,
  Program,
  Outcome,
  Grant,
  AgentAction,
  AgentConfig,
  AgentType,
} from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";

const agentLabels: Record<string, string> = {
  grants: "Grants Agent",
  donor_relations: "Donor Relations",
  finance: "Finance Agent",
  compliance: "Compliance",
  marketing: "Marketing",
  board: "Board Agent",
};

export default function DashboardPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [outcomes, setOutcomes] = useState<Outcome[]>([]);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [configs, setConfigs] = useState<AgentConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getOrganization(),
      getPrograms(),
      getOutcomes(),
      getGrants(),
      getAgentActions(),
      getAgentConfigs(),
    ]).then(([o, p, out, g, a, c]) => {
      setOrg(o);
      setPrograms(p);
      setOutcomes(out);
      setGrants(g);
      setActions(a);
      setConfigs(c);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
              <div className="h-3 bg-slate-800 rounded w-20 mb-3" />
              <div className="h-7 bg-slate-800 rounded w-28" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 animate-pulse">
              <div className="h-5 bg-slate-800 rounded w-32 mb-4" />
              <div className="space-y-3">
                <div className="h-4 bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const annualBudget = org?.financials?.annualBudget ?? 0;
  const totalRevenue = org?.financials?.totalRevenue ?? 0;
  const totalExpenses = org?.financials?.totalExpenses ?? 0;
  const netAssets = org?.financials?.netAssets ?? 0;
  const cashOnHand = org?.financials?.cashOnHand ?? 0;
  const runway = org?.financials?.monthsOfRunway ?? 0;

  const activePrograms = programs.filter((p) => p.status === "active");
  const activeGrants = grants.filter((g) => g.status === "active" || g.status === "awarded");
  const pipelineValue = grants.reduce((s, g) => s + g.amountRequested, 0);

  const allMetrics = outcomes.flatMap((o) => o.metrics);
  const avgOutcomeScore =
    allMetrics.length > 0
      ? Math.round(
          allMetrics.reduce((s, m) => s + (m.value / m.target) * 100, 0) /
            allMetrics.length
        )
      : 0;

  const enabledAgents = configs.filter((c) => c.enabled);
  const uniqueAgentTypes = [...new Set(enabledAgents.map((c) => c.type))];
  const recentActions = actions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Org header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 font-bold text-lg shrink-0">
          {org?.name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "NP"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">{org?.name ?? "Organization"}</h2>
          <p className="text-sm text-slate-400">{org?.mission?.slice(0, 100) ?? ""}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Budget", value: formatCurrency(annualBudget, true), sub: `${runway} mo runway` },
          { label: "Active Programs", value: String(activePrograms.length), sub: `${programs.length} total` },
          { label: "Outcome Score", value: `${avgOutcomeScore}%`, sub: `${allMetrics.length} metrics tracked` },
          { label: "AI Agents Active", value: String(uniqueAgentTypes.length), sub: `${enabledAgents.length} configs` },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Financial Overview + Grant Pipeline */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Financial Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">Revenue</span>
                <span className="font-medium text-emerald-400">{formatCurrency(totalRevenue, true)}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-400">Expenses</span>
                <span className="font-medium text-rose-400">{formatCurrency(totalExpenses, true)}</span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: totalRevenue > 0 ? `${(totalExpenses / totalRevenue) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
              <div>
                <p className="text-xs text-slate-500">Net Assets</p>
                <p className="text-sm font-semibold text-slate-200">{formatCurrency(netAssets, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Cash</p>
                <p className="text-sm font-semibold text-slate-200">{formatCurrency(cashOnHand, true)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Runway</p>
                <p className="text-sm font-semibold text-slate-200">{runway} months</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Grant Pipeline</h3>
          <div className="mb-4">
            <p className="text-xs text-slate-500">Total Pipeline</p>
            <p className="text-2xl font-bold text-slate-100">{formatCurrency(pipelineValue, true)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{activeGrants.length} active grants</p>
          </div>
          <div className="space-y-3">
            {grants.slice(0, 4).map((g) => (
              <div key={g.id} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-300 truncate">{g.funderName}</p>
                  <p className="text-xs text-slate-500">{g.status}</p>
                </div>
                <span className="text-sm font-semibold text-slate-200 shrink-0 ml-3">
                  {formatCurrency(g.amountAwarded ?? g.amountRequested, true)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">Programs</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => {
            const pOutcomes = outcomes.filter((o) => o.programId === p.id);
            const pMetrics = pOutcomes.flatMap((o) => o.metrics);
            const perf =
              pMetrics.length > 0
                ? Math.round(pMetrics.reduce((s, m) => s + (m.value / m.target) * 100, 0) / pMetrics.length)
                : 0;
            return (
              <div key={p.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-slate-200">{p.name}</h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      p.status === "active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Budget: {formatCurrency(p.annualBudget, true)}</span>
                  <span className="text-slate-500">{p.clientsServed} served</span>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Outcome performance</span>
                    <span className="text-slate-400">{perf}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        perf >= 80 ? "bg-emerald-500" : perf >= 60 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(perf, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Outcomes Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 mb-4">
          Key Outcomes{" "}
          <span className="text-slate-500 font-normal">({allMetrics.length} metrics)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Metric</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Current</th>
                <th className="text-right py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Target</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-slate-500 uppercase tracking-wide w-32">Progress</th>
              </tr>
            </thead>
            <tbody>
              {outcomes.slice(0, 4).flatMap((o) =>
                o.metrics.slice(0, 2).map((m, i) => {
                  const pct = Math.round((m.value / m.target) * 100);
                  return (
                    <tr key={`${o.id}-${i}`} className="border-b border-slate-800/50">
                      <td className="py-2.5 px-3">
                        <p className="font-medium text-slate-300">{m.label}</p>
                        <p className="text-xs text-slate-500">{m.unit}</p>
                      </td>
                      <td className="py-2.5 px-3 text-right font-medium text-slate-200">
                        {m.value.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        {m.target.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-500" : "bg-amber-500"
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Agents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200">AI Agents</h3>
          <Link
            href="/dashboard/agents"
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Open Chat &#8594;
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(["grants", "donor_relations", "finance", "compliance", "marketing", "board"] as AgentType[]).map(
            (type) => {
              const typeConfigs = configs.filter((c) => c.type === type);
              const enabled = typeConfigs.filter((c) => c.enabled);
              const totalActions = actions.filter((a) => a.agentType === type).length;
              return (
                <Link
                  key={type}
                  href={`/dashboard/agents?agent=${type}`}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-emerald-600/40 transition-colors group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600/30 transition-colors">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{agentLabels[type]}</p>
                      <p className="text-xs text-slate-500">
                        {enabled.length} active &middot; {totalActions} actions
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Start conversation &#8594;
                  </p>
                </Link>
              );
            }
          )}
        </div>
      </div>

      {/* Recent Agent Activity */}
      {recentActions.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Agent Activity</h3>
          <div className="space-y-3">
            {recentActions.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2 border-b border-slate-800/50 last:border-0">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] text-slate-400 font-bold">AI</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">
                      {agentLabels[a.agentType] ?? a.agentType}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        a.status === "approved" || a.status === "auto_approved"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : a.status === "pending"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-0.5">{a.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
