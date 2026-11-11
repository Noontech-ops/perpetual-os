"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getGivingTransactions, getDonorProfiles } from "@/lib/data";
import type { GivingTransaction, DonorProfile } from "@/lib/types";

const fallbackHoldings = [
  { id: "sf-symphony", name: "San Francisco Symphony", sector: "Arts / Culture", totalGiven: 5000, allocation: 39.2, outcomeMetric: "220 concerts and 75K+ attendees annually", trend: 34, lastGift: "Oct 2026" },
  { id: "kqed", name: "KQED", sector: "Education", totalGiven: 3000, allocation: 23.5, outcomeMetric: "2.1M weekly viewers and listeners", trend: 15, lastGift: "Sep 2026" },
  { id: "wikimedia-foundation", name: "Wikimedia Foundation", sector: "Education", totalGiven: 2500, allocation: 19.6, outcomeMetric: "6.7B monthly pageviews across 300+ languages", trend: 8, lastGift: "Aug 2026" },
  { id: "sf-aids-foundation", name: "San Francisco AIDS Foundation", sector: "Health", totalGiven: 1500, allocation: 11.8, outcomeMetric: "18,000+ clients served annually", trend: 21, lastGift: "Oct 2026" },
  { id: "sfjazz", name: "SFJAZZ", sector: "Arts / Culture", totalGiven: 750, allocation: 5.9, outcomeMetric: "450+ performances and 200K+ attendees", trend: 28, lastGift: "Jul 2026" },
];

const causeColors = ["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500", "bg-rose-400", "bg-teal-500", "bg-indigo-500"];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });
}

function formatMonth(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function PortfolioPage() {
  const [transactions, setTransactions] = useState<GivingTransaction[]>([]);
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [orgNames, setOrgNames] = useState<Map<string, { name: string; sector: string }>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [txs, profiles] = await Promise.all([getGivingTransactions(), getDonorProfiles()]);
      setTransactions(txs);
      setProfile(profiles[0] ?? null);

      if (txs.length > 0) {
        const orgIds = [...new Set(txs.map((t) => t.organizationId))];
        try {
          const res = await fetch(`/api/search?ids=${orgIds.join(",")}`);
          if (res.ok) {
            const orgs = await res.json();
            const nameMap = new Map<string, { name: string; sector: string }>();
            for (const o of Array.isArray(orgs) ? orgs : [orgs]) {
              nameMap.set(o.id, { name: o.name, sector: o.sector || "General" });
            }
            setOrgNames(nameMap);
          }
        } catch {}
      }
      setLoading(false);
    }
    load();
  }, []);

  const hasRealData = transactions.length > 0;

  const holdings = hasRealData
    ? buildHoldings(transactions, orgNames)
    : fallbackHoldings;

  const totalGiven = holdings.reduce((s, h) => s + h.totalGiven, 0);

  const monthlyGiving = hasRealData
    ? buildMonthlyGiving(transactions)
    : [
        { month: "Jan", amount: 500 }, { month: "Feb", amount: 250 }, { month: "Mar", amount: 1000 },
        { month: "Apr", amount: 500 }, { month: "May", amount: 750 }, { month: "Jun", amount: 1500 },
        { month: "Jul", amount: 1000 }, { month: "Aug", amount: 2500 }, { month: "Sep", amount: 3000 },
        { month: "Oct", amount: 1750 },
      ];

  const maxMonthly = Math.max(...monthlyGiving.map((m) => m.amount), 1);

  const causeAllocation = holdings.map((h, i) => ({
    cause: h.sector,
    pct: totalGiven > 0 ? Math.round((h.totalGiven / totalGiven) * 1000) / 10 : 0,
    color: causeColors[i % causeColors.length],
  }));

  const memberSince = profile?.joinedAt
    ? new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "March 2024";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Your Impact Portfolio</h1>
        <p className="text-slate-500 mt-1">Member since {memberSince}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-20 mb-2" />
              <div className="h-8 bg-slate-200 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Given", value: fmt(totalGiven) },
              { label: "Organizations", value: String(holdings.length) },
              { label: "Transactions", value: String(transactions.length || holdings.length) },
              { label: "Avg Gift", value: transactions.length > 0 ? fmt(totalGiven / transactions.length) : fmt(totalGiven / holdings.length) },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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

            <div className="space-y-8">
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

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <h2 className="font-semibold text-slate-900 mb-4">Explore More</h2>
                <p className="text-sm text-slate-500 mb-3">Discover more organizations making an impact.</p>
                <Link href="/outcomes" className="inline-block px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700">
                  Browse Organizations
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function buildHoldings(txs: GivingTransaction[], nameMap: Map<string, { name: string; sector: string }>) {
  const byOrg = new Map<string, { totalGiven: number; lastDate: string; count: number }>();
  for (const tx of txs) {
    const orgId = tx.organizationId;
    const existing = byOrg.get(orgId);
    if (existing) {
      existing.totalGiven += tx.amount;
      existing.count++;
      if (tx.createdAt > existing.lastDate) existing.lastDate = tx.createdAt;
    } else {
      byOrg.set(orgId, { totalGiven: tx.amount, lastDate: tx.createdAt, count: 1 });
    }
  }
  const total = Array.from(byOrg.values()).reduce((s, v) => s + v.totalGiven, 0);
  return Array.from(byOrg.entries()).map(([orgId, data]) => {
    const info = nameMap.get(orgId);
    return {
      id: orgId,
      name: info?.name ?? orgId.slice(0, 8),
      sector: info?.sector ?? "General",
      totalGiven: data.totalGiven,
      allocation: total > 0 ? Math.round((data.totalGiven / total) * 1000) / 10 : 0,
      outcomeMetric: `${data.count} contribution${data.count > 1 ? 's' : ''}`,
      trend: 0,
      lastGift: formatMonth(data.lastDate),
    };
  });
}

function buildMonthlyGiving(txs: GivingTransaction[]) {
  const byMonth = new Map<string, number>();
  for (const tx of txs) {
    const d = new Date(tx.createdAt);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    byMonth.set(key, (byMonth.get(key) ?? 0) + tx.amount);
  }
  return Array.from(byMonth.entries()).map(([month, amount]) => ({ month, amount }));
}
