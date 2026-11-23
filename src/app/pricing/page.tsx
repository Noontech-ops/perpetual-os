"use client";

import Link from "next/link";
import { OutcomesNav } from "@/components/outcomes-nav";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For small nonprofits getting started with AI-powered operations.",
    features: [
      "All 6 AI agents included",
      "Up to 100 agent actions / month",
      "5 team members",
      "2 GB document storage",
      "Public marketplace listing",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
    description: "For growing nonprofits that need more capacity and premium integrations.",
    features: [
      "Everything in Free, plus:",
      "Unlimited agent actions",
      "25 team members",
      "50 GB document storage",
      "Priority agent processing",
      "QuickBooks & Salesforce integrations",
      "Custom email templates",
      "Advanced analytics",
      "Email support (24hr response)",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per org",
    description: "For large nonprofits with complex needs and dedicated support.",
    features: [
      "Everything in Growth, plus:",
      "Unlimited team members",
      "Unlimited storage",
      "Dedicated agent fine-tuning",
      "SSO / SAML authentication",
      "Custom API integrations",
      "Dedicated success manager",
      "SLA guarantee (99.9%)",
      "On-premise deployment option",
      "Phone & Slack support",
    ],
    cta: "Contact Sales",
    href: "mailto:hello@perpetual.org",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is Perpetual OS really free?",
    a: "Yes. The Free plan includes all 6 AI agents with up to 100 actions per month. Most small nonprofits operate comfortably within that limit. We believe every nonprofit deserves AI-powered tools regardless of budget.",
  },
  {
    q: "What counts as an agent action?",
    a: "An agent action is any task an AI agent performs on your behalf — drafting a grant proposal, sending a donor acknowledgment, categorizing a transaction, or filing a compliance document. Reading dashboards and viewing reports don't count.",
  },
  {
    q: "Can I switch plans at any time?",
    a: "Absolutely. Upgrade or downgrade at any time. When upgrading, you'll be prorated for the remainder of the billing period. When downgrading, the change takes effect at your next billing date.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, Amex) and ACH bank transfers. Enterprise customers can pay by invoice with net-30 terms.",
  },
  {
    q: "Is there a discount for annual billing?",
    a: "Yes — annual billing saves 20%. The Growth plan is $39/month when billed annually ($468/year instead of $588).",
  },
  {
    q: "Do you offer discounts for smaller nonprofits?",
    a: "Nonprofits with annual budgets under $500K automatically qualify for our Community tier — the Growth plan at 50% off ($24.50/mo). Contact us to apply.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <OutcomesNav />

      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No hidden fees, no per-seat surprises.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.highlight
                  ? "border-brand-600 shadow-lg shadow-brand-100"
                  : "border-slate-200"
              } bg-white flex flex-col`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <div className="p-6 flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-sm text-slate-500">/{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600">{plan.description}</p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-2.5 rounded-lg font-medium text-sm transition-colors ${
                    plan.highlight
                      ? "bg-brand-600 text-white hover:bg-brand-700"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details key={faq.q} className="group bg-white rounded-xl border border-slate-200">
                <summary className="flex items-center justify-between cursor-pointer px-6 py-4 text-sm font-medium text-slate-900">
                  {faq.q}
                  <svg className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-180 shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-6 pb-4 text-sm text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Ready to transform your nonprofit?</h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Join thousands of nonprofits using AI to maximize their impact. Start free — no credit card required.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/outcomes"
            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Perpetual. All rights reserved.
      </footer>
    </div>
  );
}
