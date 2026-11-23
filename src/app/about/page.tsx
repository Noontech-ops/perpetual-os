'use client';

import Link from 'next/link';
import { OutcomesNav } from '@/components/outcomes-nav';

const values = [
  {
    title: 'Outcomes Over Overhead',
    description: 'We believe donors deserve to see what their money actually achieves — not just where it goes. Every nonprofit on our platform reports real impact metrics.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    title: 'Technology as Equalizer',
    description: 'Small nonprofits deserve the same operational tools as large ones. Perpetual OS levels the playing field with AI-powered back-office automation.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: 'Radical Transparency',
    description: 'Open financials, verified data, methodology documentation. We publish how every metric is calculated so donors can compare apples to apples.',
    icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  },
  {
    title: 'Nonprofit-First Design',
    description: 'Built by people who have worked in nonprofits. We understand compliance deadlines, grant reporting, and board meetings — and we automate them.',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
];

const stats = [
  { label: 'Nonprofits on Platform', value: '116+' },
  { label: 'Cause Areas', value: '10' },
  { label: 'Cities Covered', value: '20+' },
  { label: 'AI Agent Types', value: '6' },
];

const team = [
  { name: 'Platform Team', role: 'Engineering', description: 'Building the infrastructure that connects donors to outcomes and powers nonprofit operations.' },
  { name: 'Data Science', role: 'Impact Measurement', description: 'Developing methodologies to measure, verify, and compare nonprofit outcomes across cause areas.' },
  { name: 'Nonprofit Success', role: 'Customer Success', description: 'Helping organizations onboard, configure AI agents, and maximize their impact reporting.' },
  { name: 'Policy & Compliance', role: 'Legal & Regulatory', description: 'Ensuring platform compliance with IRS regulations, state requirements, and data privacy laws.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OutcomesNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-50 to-white py-20 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Philanthropy should be{' '}
              <span className="text-emerald-600">evidence-based</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              Perpetual is a two-sided platform that connects donors who give by outcomes
              with nonprofits powered by AI. We&apos;re building the infrastructure to make
              every dollar of charitable giving more effective.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/outcomes" className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                Explore Nonprofits
              </Link>
              <Link href="/how-it-works" className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 px-6 border-b border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">The Problem</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed">
              <p>
                Over $500 billion flows to nonprofits in the US each year, yet donors have almost
                no way to compare what their money actually achieves. Charity rating sites measure
                overhead ratios and financial health — useful, but incomplete. A nonprofit that
                spends 90% on programs tells you nothing about whether those programs work.
              </p>
              <p>
                Meanwhile, nonprofits — especially small and mid-size ones — spend enormous time on
                back-office operations: grant writing, donor acknowledgments, compliance filings,
                board reporting. Time that could go toward their mission instead goes to paperwork.
              </p>
              <p className="font-medium text-slate-900">
                Perpetual solves both sides of this equation.
              </p>
            </div>
          </div>
        </section>

        {/* Two Products */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Two Products, One Mission</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Perpetual Outcomes</h3>
                <p className="text-sm text-emerald-600 font-medium mb-4">For Donors</p>
                <p className="text-slate-600 leading-relaxed">
                  A marketplace where you discover nonprofits by what they achieve. Browse by
                  actual impact metrics — literacy gains, meals served, housing stability — not
                  overhead ratios. One checkout supports card, ACH, DAF, stock, crypto, QCD,
                  and bequest intent. Track your giving like a portfolio.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-slate-200">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Perpetual OS</h3>
                <p className="text-sm text-brand-600 font-medium mb-4">For Nonprofits</p>
                <p className="text-slate-600 leading-relaxed">
                  An AI-powered operating system for nonprofit back-office operations. Six
                  specialized agents handle grants, donor relations, finance, compliance,
                  marketing, and board governance. Import your 990, configure your agents,
                  and reclaim hours every week for your mission.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">What We Believe</h2>
            <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              These principles guide every product decision we make.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value) => (
                <div key={value.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={value.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{value.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-6 bg-slate-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Our Teams</h2>
            <p className="text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              A cross-functional team combining technology, data science, and deep nonprofit expertise.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {team.map((t) => (
                <div key={t.name} className="bg-white rounded-xl p-6 border border-slate-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand-700">{t.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-brand-600">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join the Movement</h2>
            <p className="text-brand-200 mb-8 text-lg">
              Whether you&apos;re a donor looking to give smarter or a nonprofit ready to
              automate your operations, Perpetual is built for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="px-8 py-3 bg-white text-brand-700 rounded-lg font-semibold hover:bg-brand-50 transition-colors">
                Get Started Free
              </Link>
              <Link href="/contact" className="px-8 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Contact Us
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
              <p className="font-semibold text-slate-900 mb-3">Perpetual</p>
              <p className="text-slate-500 leading-relaxed">
                The operating system for perpetual impact. Evidence-based philanthropy, powered by AI.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Product</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/outcomes" className="hover:text-emerald-600">For Donors</Link></li>
                <li><Link href="/os" className="hover:text-emerald-600">For Nonprofits</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Resources</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/how-it-works" className="hover:text-emerald-600">How It Works</Link></li>
                <li><Link href="/contact" className="hover:text-emerald-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Legal</p>
              <ul className="space-y-2 text-slate-500">
                <li><Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-400 text-center">
            &copy; 2026 Perpetual. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
