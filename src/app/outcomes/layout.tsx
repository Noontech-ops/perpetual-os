import type { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";
import { OutcomesNav } from "@/components/outcomes-nav";

export const metadata: Metadata = {
  title: "Explore Nonprofits",
  description:
    "Discover nonprofits by actual impact metrics. Browse by cause area, compare outcomes, and give any way you want.",
};

export default function OutcomesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OutcomesNav />
      <main className="flex-1">{children}</main>
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
                <li><Link href="/how-it-works#pricing" className="hover:text-emerald-600">Card &amp; ACH</Link></li>
                <li><Link href="/how-it-works#pricing" className="hover:text-emerald-600">Donor Advised Fund</Link></li>
                <li><Link href="/how-it-works#pricing" className="hover:text-emerald-600">Stock &amp; Crypto</Link></li>
                <li><Link href="/how-it-works#pricing" className="hover:text-emerald-600">QCD &amp; Bequest</Link></li>
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
