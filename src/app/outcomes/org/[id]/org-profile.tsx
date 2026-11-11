"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createDonation } from "@/lib/data";
import { StripeCheckout } from "@/components/stripe-checkout";
import type { Organization, Program, Outcome } from "@/lib/types";

interface OrgWithDetails extends Organization {
  programs?: Program[];
  outcomes?: Outcome[];
}

const tabs = ["Overview", "Financials", "Programs", "Outcomes", "Leadership"] as const;
type Tab = (typeof tabs)[number];

const paymentMethods = ["Card", "ACH", "DAF", "Stock", "Crypto", "QCD"] as const;
const methodApiKeys: Record<string, string> = {
  Card: "card", ACH: "ach", DAF: "daf", Stock: "stock", Crypto: "crypto", QCD: "qcd",
};

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[snakeToCamel(k)] = camelizeKeys(v);
    }
    return out;
  }
  return obj;
}

export default function OrgProfilePage({ orgId }: { orgId: string }) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [giveAmount, setGiveAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState<string>("Card");
  const [giveStatus, setGiveStatus] = useState<"idle" | "loading" | "success" | "error" | "checkout">("idle");

  const [org, setOrg] = useState<OrgWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try public API first (returns programs + outcomes)
        const pubRes = await fetch(`/api/organizations/public?slug=${encodeURIComponent(orgId)}`);
        if (pubRes.ok) {
          const raw = await pubRes.json();
          setOrg(camelizeKeys(raw) as OrgWithDetails);
          setLoading(false);
          return;
        }
        // Fallback to search API (by id)
        const res = await fetch(`/api/search?id=${encodeURIComponent(orgId)}`);
        if (res.ok) {
          const raw = await res.json();
          setOrg(camelizeKeys(raw) as OrgWithDetails);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, [orgId]);

  async function handleGive() {
    const amount = parseFloat(giveAmount);
    if (!amount || amount <= 0 || !org) return;
    const method = methodApiKeys[paymentMethod] || "card";
    if (method === "card" || method === "ach") {
      setGiveStatus("checkout");
      return;
    }
    setGiveStatus("loading");
    const result = await createDonation({
      organization_id: org.id,
      amount,
      method,
      designation: "general",
    });
    setGiveStatus(result ? "success" : "error");
    if (result) {
      setTimeout(() => setGiveStatus("idle"), 3000);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          {/* Org header skeleton */}
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-200 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-7 bg-slate-200 rounded w-1/3 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse" />
              <div className="flex gap-2 mt-1">
                <div className="h-5 w-16 bg-slate-100 rounded-full animate-pulse" />
                <div className="h-5 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          {/* Tabs skeleton */}
          <div className="flex gap-1 border-b border-slate-200 pb-2">
            {["w-20", "w-24", "w-20", "w-24", "w-24"].map((w, i) => (
              <div key={i} className={`h-4 bg-slate-100 rounded ${w} animate-pulse`} />
            ))}
          </div>
          {/* Content grid skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Financials skeleton */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-28 animate-pulse" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-20 animate-pulse" />
                      <div className="h-6 bg-slate-200 rounded w-24 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Programs skeleton */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-24 animate-pulse" />
                {[1, 2].map((i) => (
                  <div key={i} className="border border-slate-100 rounded-lg p-4 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3 animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-full animate-pulse" />
                    <div className="h-3 bg-slate-100 rounded w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            {/* Giving sidebar skeleton */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 h-fit">
              <div className="h-5 bg-slate-200 rounded w-32 animate-pulse" />
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />
                ))}
              </div>
              <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <p className="text-slate-500">Organization not found.</p>
        <Link href="/outcomes" className="text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
          Back to Explore
        </Link>
      </div>
    );
  }

  const location = [org.address?.city, org.address?.state].filter(Boolean).join(", ");
  const founded = org.founded ? new Date(org.founded).getFullYear() : null;
  const initials = org.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const annualRevenue = org.financials?.totalRevenue ?? org.financials?.annualBudget ?? 0;
  const totalExpenses = org.financials?.totalExpenses ?? 0;
  const programExpenseRatio = annualRevenue > 0 ? Math.round((totalExpenses / annualRevenue) * 82) : 0;
  const leadershipList = org.leadership ?? [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-6">
        <Link href="/outcomes" className="hover:text-emerald-600">Explore</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{org.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{org.name}</h1>
                <p className="text-slate-500 mt-1">
                  {location}{location && " · "}
                  {org.ein && `EIN ${org.ein}`}
                  {founded && ` · Founded ${founded}`}
                </p>
                <p className="text-slate-600 mt-2 leading-relaxed">{org.mission}</p>
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
                  { label: "Annual Revenue", value: fmt(annualRevenue) },
                  { label: "Net Assets", value: fmt(org.financials?.netAssets ?? 0) },
                  { label: "Cash on Hand", value: fmt(org.financials?.cashOnHand ?? 0) },
                  { label: "Runway", value: org.financials?.monthsOfRunway ? `${org.financials.monthsOfRunway} mo` : "—" },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              {org.vision && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Vision</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{org.vision}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Quick Financials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-2">Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">{fmt(annualRevenue)}</p>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm text-slate-500 mb-2">Expenses</p>
                    <p className="text-2xl font-bold text-slate-900">{fmt(totalExpenses)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "Financials" && (
            <div className="space-y-8">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Total Revenue", value: fmt(annualRevenue) },
                  { label: "Total Expenses", value: fmt(totalExpenses) },
                  { label: "Program Expense Ratio", value: `${programExpenseRatio}%` },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">{s.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Financial Summary</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Revenue</span>
                      <span className="font-medium text-emerald-600">{fmt(annualRevenue)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: "100%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-600">Expenses</span>
                      <span className="font-medium text-slate-900">{fmt(totalExpenses)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: annualRevenue > 0 ? `${(totalExpenses / annualRevenue) * 100}%` : "0%" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Net Assets", value: fmt(org.financials?.netAssets ?? 0) },
                  { label: "Cash on Hand", value: fmt(org.financials?.cashOnHand ?? 0) },
                  { label: "Months of Runway", value: org.financials?.monthsOfRunway ? `${org.financials.monthsOfRunway}` : "—" },
                ].map((s) => (
                  <div key={s.label} className="border border-slate-200 rounded-lg p-3">
                    <p className="text-xs text-slate-500">{s.label}</p>
                    <p className="text-lg font-bold text-slate-900">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "Programs" && (
            <div className="space-y-6">
              {org.programs && org.programs.length > 0 ? (
                org.programs.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-900">{p.name}</h4>
                      {p.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                          {p.status}
                        </span>
                      )}
                    </div>
                    {p.description && <p className="text-sm text-slate-600 leading-relaxed">{p.description}</p>}
                    {p.annualBudget > 0 && (
                      <p className="text-sm text-slate-500">Budget: {fmt(p.annualBudget)}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>No program data available yet.</p>
                </div>
              )}
            </div>
          )}

          {tab === "Outcomes" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">
                Structured outcome data captured at the point of service. Each metric includes methodology so funders and donors can compare apples to apples.
              </p>
              {org.outcomes && org.outcomes.length > 0 ? (
                org.outcomes.map((o) => (
                  <div key={o.id} className="border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-slate-900">{o.reportingPeriod || "Outcome"}</h4>
                      {o.sector && <span className="text-xs text-slate-500">{
                        o.sector === "arts_culture" ? "Arts / Culture"
                        : o.sector === "human_services" ? "Human Services"
                        : o.sector === "essential_rights" ? "Essential Rights"
                        : String(o.sector).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())
                      }</span>}
                    </div>
                    {o.narrative && <p className="text-sm text-slate-600 leading-relaxed">{o.narrative}</p>}
                    {o.metrics && o.metrics.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {o.metrics.map((m, i) => (
                          <div key={i} className="bg-emerald-50 rounded-lg p-3">
                            <p className="text-xl font-bold text-emerald-700">
                              {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
                              {m.unit && <span className="text-sm font-normal text-emerald-600 ml-1">{m.unit}</span>}
                            </p>
                            <p className="text-xs text-emerald-600 mt-0.5">{m.label}</p>
                            {m.target > 0 && (
                              <div className="mt-2">
                                <div className="flex justify-between text-xs text-emerald-500 mb-0.5">
                                  <span>Progress</span>
                                  <span>{Math.round((m.value / m.target) * 100)}%</span>
                                </div>
                                <div className="w-full bg-emerald-100 rounded-full h-1.5">
                                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (m.value / m.target) * 100)}%` }} />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <p>No outcome data available yet.</p>
                </div>
              )}
            </div>
          )}

          {tab === "Leadership" && (
            <div className="grid md:grid-cols-2 gap-4">
              {leadershipList.length > 0 ? leadershipList.map((l) => (
                <div key={l.name} className="border border-slate-200 rounded-lg p-5 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium shrink-0">
                    {l.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{l.name}</p>
                    <p className="text-sm text-emerald-600">{l.title}</p>
                    {l.since && <p className="text-sm text-slate-500 mt-1">Since {new Date(l.since).getFullYear()}</p>}
                    {l.bio && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{l.bio}</p>}
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 col-span-2 text-center py-8">No leadership information available.</p>
              )}
            </div>
          )}
        </div>

        {/* Giving sidebar */}
        <aside id="give" className="lg:w-80 shrink-0">
          <div className="sticky top-20 border border-slate-200 rounded-xl p-6 space-y-5 bg-white shadow-sm">
            <h3 className="font-semibold text-slate-900">Give to {org.name}</h3>

            <div>
              <label className="block text-sm text-slate-600 mb-1.5">Amount</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                {["25", "50", "100", "250", "500"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setGiveAmount(a)}
                    className={`py-1.5 rounded-lg text-sm font-medium transition-colors ${
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

            {giveStatus === "checkout" ? (
              <StripeCheckout
                amount={parseFloat(giveAmount) || 0}
                method={methodApiKeys[paymentMethod] || "card"}
                organizationId={org.id}
                organizationName={org.name}
                onSuccess={() => {
                  setGiveStatus("success");
                  setTimeout(() => setGiveStatus("idle"), 3000);
                }}
                onError={() => { setGiveStatus("error"); }}
                onCancel={() => setGiveStatus("idle")}
              />
            ) : (
              <>
                <button
                  onClick={handleGive}
                  disabled={giveStatus === "loading" || giveStatus === "success"}
                  className={`w-full py-3 rounded-xl font-medium text-base transition-colors ${
                    giveStatus === "success"
                      ? "bg-green-600 text-white"
                      : giveStatus === "error"
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                  } disabled:opacity-70`}
                >
                  {giveStatus === "loading" && "Processing..."}
                  {giveStatus === "success" && "Donation Recorded!"}
                  {giveStatus === "error" && "Failed — Try Again"}
                  {giveStatus === "idle" && `Give $${giveAmount || "0"}`}
                </button>

                <div className="text-xs text-slate-400 space-y-1">
                  {paymentMethod === "Card" && <p>Processing fee: 2.2% + $0.30</p>}
                  {paymentMethod === "ACH" && <p>Processing fee: 0.8% (capped at $5)</p>}
                  {paymentMethod === "DAF" && <p>Flat fee: $5 per grant recommendation</p>}
                  {paymentMethod === "Stock" && <p>Flat fee: $25 per transfer</p>}
                  {paymentMethod === "Crypto" && <p>Processing fee: 1.5%</p>}
                  {paymentMethod === "QCD" && <p>No processing fee</p>}
                  <p>Tax receipt issued automatically via email.</p>
                  {org.ein && <p>EIN: {org.ein}</p>}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
