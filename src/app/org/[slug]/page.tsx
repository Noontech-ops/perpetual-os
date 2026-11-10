"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Organization, Program, Outcome } from "@/lib/types";

const sectorColors: Record<string, { bg: string; text: string; accent: string }> = {
  education: { bg: "bg-indigo-50", text: "text-indigo-700", accent: "bg-indigo-600" },
  health: { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-600" },
  essential_rights: { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-600" },
  community: { bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-600" },
  arts_culture: { bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-600" },
  science: { bg: "bg-sky-50", text: "text-sky-700", accent: "bg-sky-600" },
  housing: { bg: "bg-orange-50", text: "text-orange-700", accent: "bg-orange-600" },
  environment: { bg: "bg-green-50", text: "text-green-700", accent: "bg-green-600" },
  workforce: { bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-600" },
  human_services: { bg: "bg-violet-50", text: "text-violet-700", accent: "bg-violet-600" },
};

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[snakeToCamel(k)] = camelizeKeys(v);
    }
    return out;
  }
  return obj;
}

function formatSector(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface OrgData extends Organization {
  programs?: Program[];
  outcomes?: Outcome[];
}

export default function PublicOrgPage({ params }: { params: Promise<{ slug: string }> }) {
  const [org, setOrg] = useState<OrgData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ slug: s }) => {
      fetch(`/api/organizations/public?slug=${encodeURIComponent(s)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && !data.error) setOrg(camelizeKeys(data) as OrgData);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-8 animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-2/3" />
          <div className="h-5 bg-slate-100 rounded w-full" />
          <div className="h-5 bg-slate-100 rounded w-3/4" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!org) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Organization not found</h1>
          <p className="text-slate-500">This organization page doesn&apos;t exist or isn&apos;t public.</p>
          <Link href="/outcomes" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Browse organizations
          </Link>
        </div>
      </div>
    );
  }

  const colors = sectorColors[org.sector] ?? sectorColors.education;
  const location = [org.address?.city, org.address?.state].filter(Boolean).join(", ");
  const founded = org.founded ? new Date(org.founded).getFullYear() : null;
  const leadershipList = org.leadership ?? [];
  const fin = org.financials;
  const programsList = org.programs ?? [];
  const outcomesList = org.outcomes ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className={`${colors.bg} py-16 px-6`}>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${colors.bg} ${colors.text}`}>
              {formatSector(org.sector)}
            </span>
            {location && <span className="text-sm text-slate-500">{location}</span>}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
            {org.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            {org.mission}
          </p>
          {org.vision && (
            <p className="text-sm text-slate-500 italic">{org.vision}</p>
          )}
        </div>
      </section>

      {/* Impact numbers */}
      {fin && (
        <section className="py-12 px-6 border-b border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Annual Revenue", value: fmt(fin.totalRevenue ?? fin.annualBudget ?? 0) },
                { label: "Programs Funded", value: String(org.programIds?.length ?? 0) },
                { label: "Net Assets", value: fmt(fin.netAssets ?? 0) },
                { label: "Runway", value: `${fin.monthsOfRunway ?? 0} months` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Programs */}
      {programsList.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Our Programs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {programsList.map((program, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 leading-snug">{program.name}</h3>
                    {program.status && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        program.status === "active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {program.status}
                      </span>
                    )}
                  </div>
                  {program.description && (
                    <p className="text-sm text-slate-600 line-clamp-2">{program.description}</p>
                  )}
                  <div className="space-y-1 text-sm">
                    {program.annualBudget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Budget</span>
                        <span className="font-medium text-slate-900">{fmt(program.annualBudget)}</span>
                      </div>
                    )}
                    {program.clientsServed > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Served</span>
                        <span className="font-medium text-slate-900">{program.clientsServed.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Outcomes */}
      {outcomesList.length > 0 && (
        <section className={`py-12 px-6 ${colors.bg}`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Impact & Outcomes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {outcomesList.flatMap(o => o.metrics ?? []).slice(0, 6).map((metric, i) => {
                const pct = metric.target > 0 ? Math.min(100, Math.round((metric.value / metric.target) * 100)) : 0;
                return (
                  <div key={i} className="bg-white rounded-xl p-5 border border-slate-100">
                    <p className="text-3xl font-bold text-slate-900">{metric.value.toLocaleString()}</p>
                    <p className="text-sm text-slate-600 mt-1">{metric.unit}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{metric.label}</p>
                    {metric.target > 0 && (
                      <div className="mt-3">
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colors.accent}`} style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {pct}% of {metric.target.toLocaleString()} {metric.unit} target
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Support {org.name}</h2>
          <p className="text-slate-600">
            Every contribution makes a measurable difference. Give via card, ACH, DAF, stock, or crypto.
          </p>
          <Link
            href={`/outcomes/org/${org.id}`}
            className={`inline-block px-8 py-3 ${colors.accent} text-white text-lg font-medium rounded-xl hover:opacity-90 transition-opacity`}
          >
            Support this organization
          </Link>
        </div>
      </section>

      {/* Leadership */}
      {leadershipList.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Leadership</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {leadershipList.map((leader, i) => (
                <div key={i} className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-lg shrink-0`}>
                    {leader.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{leader.name}</p>
                    <p className="text-sm text-slate-500">{leader.title}</p>
                    {leader.bio && (
                      <p className="text-sm text-slate-600 mt-1">{leader.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="text-center sm:text-left">
            <p className="font-medium text-slate-700">{org.legalName ?? org.name}</p>
            <p>EIN: {org.ein} {founded && `· Founded ${founded}`}</p>
          </div>
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:text-emerald-700"
            >
              {org.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </footer>
    </div>
  );
}
