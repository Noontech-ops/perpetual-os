"use client";

import Link from "next/link";
import { useState } from "react";
import { OutcomesNav } from "@/components/outcomes-nav";

const agents = [
  {
    name: "Grants Agent",
    desc: "Discovers funding opportunities, drafts proposals and LOIs, tracks deadlines, and monitors grant burn rates.",
    examples: ["Find grants matching our literacy programs", "Draft a renewal proposal for our largest funder", "Which reports are due this month?"],
  },
  {
    name: "Donor Relations",
    desc: "Segments donors by giving patterns, flags lapsed donors for re-engagement, and drafts stewardship communications.",
    examples: ["Which donors need a thank-you this month?", "Show me lapsed donors to re-engage", "Draft an impact update for major donors"],
  },
  {
    name: "Finance Agent",
    desc: "Tracks restricted vs unrestricted funds, monitors budget variances, forecasts cash flow, and flags anomalies.",
    examples: ["What's our current cash runway?", "Flag any budget variances above 10%", "Reconcile October transactions"],
  },
  {
    name: "Compliance",
    desc: "Monitors IRS compliance, tracks state registrations, ensures grant covenant adherence, and audits acknowledgment timing.",
    examples: ["What compliance deadlines are coming up?", "Review our Form 990 readiness", "Are we meeting all grant reporting requirements?"],
  },
  {
    name: "Marketing",
    desc: "Generates content from outcome data, drafts campaigns, creates impact stories, and recommends audience targeting.",
    examples: ["Draft a year-end fundraising email", "Create social media content from our latest outcomes", "How can we improve donor acquisition?"],
  },
  {
    name: "Board Agent",
    desc: "Prepares board meeting packets, drafts minutes and resolutions, tracks governance requirements, and summarizes organizational health.",
    examples: ["Prepare a financial summary for the board", "Draft next meeting's agenda items", "What key decisions need board approval?"],
  },
];

const fees = [
  { method: "Card", fee: "2.2% + $0.30", note: "Visa, Mastercard, Amex" },
  { method: "ACH / Bank Transfer", fee: "0.8% (max $5)", note: "Direct bank debit" },
  { method: "Donor Advised Fund", fee: "$5 flat", note: "DAF grant recommendation" },
  { method: "Stock Transfer", fee: "$25 flat", note: "Public equities" },
  { method: "Cryptocurrency", fee: "1.5%", note: "BTC, ETH, and more" },
  { method: "QCD (Qualified Charitable Distribution)", fee: "$0", note: "IRA distributions, age 70.5+" },
  { method: "Bequest Intent", fee: "$0", note: "Planned giving pledge" },
];

const faqs = [
  {
    q: "Is Perpetual free for nonprofits?",
    a: "Yes. Perpetual OS is completely free for nonprofits. There are no subscription fees, no setup costs, and no hidden charges. We sustain our platform through small transaction fees on donations processed through the marketplace.",
  },
  {
    q: "How do you verify nonprofit data?",
    a: "We pull financial data directly from IRS Form 990 filings via the ProPublica Nonprofit Explorer. Outcome metrics are self-reported by nonprofits using our structured data format, which includes methodology documentation so funders can compare organizations apples-to-apples.",
  },
  {
    q: "What AI model powers the agents?",
    a: "Our agents are powered by Claude (Anthropic). Each agent has a specialized system prompt and is injected with the organization's real data — financials, programs, grants, outcomes, and donor information — so responses are specific and actionable, not generic.",
  },
  {
    q: "Can I give through my Donor Advised Fund?",
    a: "Yes. We support DAF grant recommendations through a simple flow. Enter the amount, select DAF as your payment method, and we'll generate a grant recommendation you can submit to your DAF provider. A flat $5 processing fee applies.",
  },
  {
    q: "How is my data protected?",
    a: "All data is stored in a secure Postgres database with row-level security policies. Authentication is handled by Supabase Auth. We never share donor information with third parties, and nonprofits control what data is visible on their public profiles.",
  },
  {
    q: "What's the difference between Perpetual Outcomes and Perpetual OS?",
    a: "Perpetual Outcomes is the donor marketplace — where donors discover nonprofits by impact metrics and give through any payment method. Perpetual OS is the nonprofit operating system — a dashboard with AI agents that helps nonprofits manage grants, donors, finances, compliance, marketing, and board governance.",
  },
  {
    q: "Can I track my giving over time?",
    a: "Yes. Your Impact Portfolio tracks every donation, shows allocation by cause area, giving trends over time, and the outcomes achieved by organizations you support. Think of it like a brokerage statement, but for philanthropy.",
  },
];

export default function HowItWorksPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OutcomesNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-emerald-50 to-white py-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              How <span className="text-emerald-600">Perpetual</span> Works
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              A two-sided platform connecting donors who give by outcomes with nonprofits powered by AI. Real data, real impact, one checkout.
            </p>
          </div>
        </section>

        {/* For Donors */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full uppercase tracking-wide mb-3">For Donors</span>
              <h2 className="text-3xl font-bold text-slate-900">Give smarter. Track impact like returns.</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Perpetual Outcomes is a donor marketplace where you discover nonprofits by what they achieve, not by overhead ratios or star ratings.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  ),
                  title: "Explore by Outcomes",
                  desc: "Browse nonprofits by actual impact metrics — literacy gains, meals served, housing stability, species conserved. Filter by cause area and geography. Every metric includes methodology so you can compare apples to apples.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
                    </svg>
                  ),
                  title: "Give Any Way You Want",
                  desc: "One checkout for card, ACH, DAF, stock, crypto, QCD, and bequest intent. Automatic tax receipts and acknowledgments. Choose the method with the lowest fees for maximum impact.",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path d="M3 3v18h18" /><path d="M7 16l4-8 4 4 4-6" />
                    </svg>
                  ),
                  title: "Track Your Portfolio",
                  desc: "See your giving as a portfolio over time. Total given, allocation by cause, giving trends, and the outcomes achieved by organizations you support. Like a brokerage statement for philanthropy.",
                },
              ].map((item) => (
                <div key={item.title} className="text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/outcomes#explore" className="inline-flex px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                Explore Nonprofits
              </Link>
            </div>
          </div>
        </section>

        {/* For Nonprofits */}
        <section className="bg-slate-50 py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full uppercase tracking-wide mb-3">For Nonprofits</span>
              <h2 className="text-3xl font-bold text-slate-900">An operating system for your organization</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Perpetual OS gives every nonprofit the operational infrastructure of a $100M endowment — powered by AI, free forever.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Unified Dashboard",
                  desc: "Financial overview, grant pipeline, program performance, and AI agent activity — all in one place. Real-time data from your organization, not static reports.",
                },
                {
                  title: "6 AI Agents",
                  desc: "Specialized agents for Grants, Donor Relations, Finance, Compliance, Marketing, and Board Governance. Each one knows your org's data and provides actionable recommendations.",
                },
                {
                  title: "Outcomes Tracking",
                  desc: "Structured outcome data captured at the point of service. Each metric includes methodology documentation. Your outcomes feed directly into the donor marketplace.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/os" className="inline-flex px-6 py-3 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                View Demo Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* AI Agents */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full uppercase tracking-wide mb-3">AI-Powered</span>
              <h2 className="text-3xl font-bold text-slate-900">Six agents, one mission</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Each agent is a specialist, trained on your organization&apos;s real data. They don&apos;t give generic advice — they give your-data-driven recommendations.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.name} className="border border-slate-200 rounded-xl p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <span className="text-emerald-600 text-xs font-bold">AI</span>
                    </div>
                    <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{agent.desc}</p>
                  <div className="space-y-1.5">
                    {agent.examples.map((ex) => (
                      <p key={ex} className="text-xs text-slate-400 flex items-start gap-1.5">
                        <span className="text-emerald-400 mt-0.5 shrink-0">&rarr;</span>
                        <span className="italic">&ldquo;{ex}&rdquo;</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/os#grants" className="inline-flex px-6 py-3 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                Try the Agents
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-slate-50 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full uppercase tracking-wide mb-3">Pricing</span>
              <h2 className="text-3xl font-bold text-slate-900">Free for nonprofits. Transparent fees for donors.</h2>
              <p className="text-slate-500 mt-3 max-w-xl mx-auto">Nonprofits pay nothing. Donors see exact fees before every transaction. Choose the method with the lowest cost to maximize your impact.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white border-2 border-emerald-200 rounded-xl p-8 text-center">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-2">For Nonprofits</p>
                <p className="text-5xl font-bold text-slate-900">$0</p>
                <p className="text-slate-500 mt-2">Free forever. No catch.</p>
                <ul className="text-sm text-slate-600 mt-6 space-y-2 text-left">
                  <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Full dashboard access</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> All 6 AI agents</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Outcomes tracking</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Public marketplace listing</li>
                  <li className="flex items-center gap-2"><span className="text-emerald-500">&#10003;</span> Donation processing</li>
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-8">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">For Donors</p>
                <p className="text-lg font-bold text-slate-900 mb-1">Transaction fees only</p>
                <p className="text-sm text-slate-500 mb-6">Shown before every donation. No surprises.</p>
                <div className="space-y-3">
                  {fees.map((f) => (
                    <div key={f.method} className="flex items-center justify-between text-sm border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-slate-900">{f.method}</p>
                        <p className="text-xs text-slate-400">{f.note}</p>
                      </div>
                      <span className="font-semibold text-slate-700 shrink-0 ml-4">{f.fee}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-medium text-slate-900 pr-4">{faq.q}</span>
                    <svg
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-600 py-16 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Ready to give by outcomes?</h2>
            <p className="text-emerald-100 max-w-lg mx-auto">
              Join donors who track impact like returns and nonprofits powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/outcomes#explore" className="px-6 py-3 bg-white text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-50 transition-colors">
                Explore Nonprofits
              </Link>
              <Link href="/os" className="px-6 py-3 border border-emerald-300 text-white text-sm font-semibold rounded-lg hover:bg-emerald-500 transition-colors">
                See the Nonprofit OS
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="font-semibold text-slate-900 mb-3">Perpetual Outcomes</p>
              <p className="text-slate-500 leading-relaxed">
                Give smarter. Track impact like returns. Real outcome data, not star ratings.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">For Donors</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/outcomes" className="hover:text-emerald-600">Explore Nonprofits</Link></li>
                <li><Link href="/outcomes/portfolio" className="hover:text-emerald-600">Your Portfolio</Link></li>
                <li><Link href="/how-it-works" className="hover:text-emerald-600">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">For Nonprofits</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/os" className="hover:text-emerald-600">Perpetual OS</Link></li>
                <li><Link href="/how-it-works#pricing" className="hover:text-emerald-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Giving Rails</p>
              <ul className="space-y-2 text-slate-500">
                <li>Card &amp; ACH</li>
                <li>Donor Advised Fund</li>
                <li>Stock &amp; Crypto</li>
                <li>QCD &amp; Bequest</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
            <span>&copy; 2026 Perpetual. All rights reserved.</span>
            <span>perpetualoutcomes.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
