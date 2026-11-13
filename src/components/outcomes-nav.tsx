"use client";

import { useState } from "react";
import Link from "next/link";

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <nav className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl p-6 flex flex-col gap-6 animate-slide-in">
        <button onClick={onClose} aria-label="Close menu" className="self-end p-1 text-slate-500 hover:text-slate-900">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <Link href="/outcomes" onClick={onClose} className="text-base font-medium text-slate-700 hover:text-emerald-600 transition-colors">Explore</Link>
        <Link href="/outcomes/portfolio" onClick={onClose} className="text-base font-medium text-slate-700 hover:text-emerald-600 transition-colors">Portfolio</Link>
        <Link href="/how-it-works" onClick={onClose} className="text-base font-medium text-slate-700 hover:text-emerald-600 transition-colors">How It Works</Link>
        <Link href="/login" onClick={onClose} className="text-base font-medium text-slate-700 hover:text-emerald-600 transition-colors">Sign In</Link>
        <Link href="/outcomes#explore" onClick={onClose} className="mt-2 text-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium">Start Giving</Link>
      </nav>
    </div>
  );
}

export function OutcomesNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main navigation" className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/outcomes" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Perpetual <span className="text-emerald-600">Outcomes</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/outcomes" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Explore
              </Link>
              <Link href="/outcomes/portfolio" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                Portfolio
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors">
                How It Works
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors hidden md:inline">
              Sign In
            </Link>
            <Link
              href="/outcomes#explore"
              className="text-sm font-medium bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors hidden md:inline"
            >
              Start Giving
            </Link>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" className="md:hidden p-1 text-slate-600 hover:text-slate-900">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
