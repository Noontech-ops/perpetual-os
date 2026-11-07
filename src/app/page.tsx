import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">Perpetual</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/outcomes" className="text-sm text-slate-600 hover:text-slate-900">
              For Donors
            </Link>
            <Link href="/os" className="text-sm text-slate-600 hover:text-slate-900">
              For Nonprofits
            </Link>
            <Link
              href="/os"
              className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight">
            The operating system for{" "}
            <span className="text-brand-600">perpetual</span> impact
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nonprofits get an AI-powered operating system that replaces staff busywork.
            Donors get a marketplace where giving feels like investing.
            One data layer connects them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/os"
              className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 text-white rounded-xl text-lg font-medium hover:bg-brand-700 transition-colors text-center"
            >
              Perpetual OS for Nonprofits
            </Link>
            <Link
              href="/outcomes"
              className="w-full sm:w-auto px-8 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl text-lg font-medium hover:border-brand-600 hover:text-brand-600 transition-colors text-center"
            >
              Perpetual Outcomes for Donors
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-24 mb-16 grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-sm font-medium">
              For Nonprofits
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Perpetual OS</h2>
            <p className="text-slate-600 leading-relaxed">
              Six AI agents handle grants, donor relations, finance, compliance,
              marketing, and board management. You make the decisions — they do the work.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                "Grants Agent discovers funders and drafts proposals",
                "Finance Agent tracks restricted funds and forecasts cash",
                "Compliance Agent drafts your 990 and manages registrations",
                "Onboard in days — import your 990, CRM, and bank feed",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-brand-600 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
              For Donors
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Perpetual Outcomes</h2>
            <p className="text-slate-600 leading-relaxed">
              Browse nonprofits by real outcome data — not star ratings. Give via card,
              DAF, stock, or crypto. Track your impact portfolio over time.
            </p>
            <ul className="space-y-3 text-sm text-slate-600">
              {[
                "Explore by cause, geography, and giving amount",
                "Live financials and outcomes — not static 990 summaries",
                "One checkout for card, ACH, DAF, stock, crypto, QCD",
                "Portfolio view tracks your impact like returns",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5">&#10003;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <span>&copy; 2026 Perpetual. All rights reserved.</span>
          <span>perpetualoutcomes.com</span>
        </div>
      </footer>
    </div>
  );
}
