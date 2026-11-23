'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OutcomesNav } from '@/components/outcomes-nav';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <OutcomesNav />

      <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Get in touch</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question about Perpetual? We&apos;d love to hear from you. Our team typically responds within one business day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-900 mb-2">Message sent!</h2>
                <p className="text-sm text-slate-600 mb-4">Thank you for reaching out. We&apos;ll get back to you within one business day.</p>
                <button onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input id="contact-name" type="text" required value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input id="contact-email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <select id="contact-subject" value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm">
                    <option value="general">General inquiry</option>
                    <option value="nonprofit">I&apos;m a nonprofit</option>
                    <option value="donor">I&apos;m a donor</option>
                    <option value="partnership">Partnership opportunity</option>
                    <option value="press">Press / Media</option>
                    <option value="support">Technical support</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                  <textarea id="contact-message" required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="px-6 py-2.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors text-sm">
                  {loading ? 'Sending...' : 'Send message'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Quick links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/how-it-works" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#faq" className="text-brand-600 hover:text-brand-700 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3">For nonprofits</h3>
              <p className="text-sm text-slate-600 mb-4">
                Ready to get started? Create your free account and import your 990 to begin.
              </p>
              <Link href="/onboarding"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
                Start for free
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-3">For donors</h3>
              <p className="text-sm text-slate-600 mb-4">
                Explore nonprofits by their real outcomes and give with confidence.
              </p>
              <Link href="/outcomes"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Browse marketplace
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-50 border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        <div className="flex items-center justify-center gap-4">
          <Link href="/terms" className="hover:text-slate-700">Terms</Link>
          <span className="text-slate-300">|</span>
          <Link href="/privacy" className="hover:text-slate-700">Privacy</Link>
          <span className="text-slate-300">|</span>
          <Link href="/" className="hover:text-slate-700">Home</Link>
        </div>
        <p className="mt-3 text-xs text-slate-400">&copy; 2026 Perpetual. All rights reserved.</p>
      </footer>
    </div>
  );
}
