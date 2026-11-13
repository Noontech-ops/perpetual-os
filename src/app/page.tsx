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
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/outcomes" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
              For Donors
            </Link>
            <Link href="/os" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
              For Nonprofits
            </Link>
            <Link href="/how-it-works" className="text-sm text-slate-600 hover:text-slate-900 hidden sm:inline">
              How It Works
            </Link>
            <Link
              href="/outcomes"
              className="text-sm bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
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

      {/* By the Numbers */}
      <section className="bg-gradient-to-b from-indigo-50 to-slate-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            The philanthropic economy, connected
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { value: "$617B", label: "in U.S. charitable giving annually" },
              { value: "1.5M", label: "registered 501(c)(3) organizations" },
              { value: "7–12", label: "disconnected tools per nonprofit" },
              { value: "3.6%", label: "annual decline in donor counts" },
            ].map((s) => (
              <div key={s.value} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-brand-600">{s.value}</p>
                <p className="text-sm text-slate-600 mt-2 leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 max-w-2xl mx-auto">
            Perpetual connects the operating system to the capital. One ledger. Both sides.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Import your 990",
                desc: "Enter your EIN. Perpetual reads your filings, sets up your chart of accounts, and drafts your org profile.",
              },
              {
                step: "2",
                title: "Agents go to work",
                desc: "Six AI agents handle grants, donors, finance, compliance, marketing, and board management. You approve what matters.",
              },
              {
                step: "3",
                title: "Donors find you",
                desc: "Your outcomes data powers your marketplace profile. Donors browse by impact, not star ratings, and give through one checkout.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-lg font-semibold text-white">Perpetual</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                The operating system for perpetual impact.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/os" className="hover:text-white transition-colors">For Nonprofits</Link></li>
                <li><Link href="/outcomes" className="hover:text-white transition-colors">For Donors</Link></li>
                <li><Link href="/board" className="hover:text-white transition-colors">Board View</Link></li>
                <li><Link href="/outcomes/org/org-sfmfb" className="hover:text-white transition-colors">Sample Organization</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><span className="text-slate-400">perpetualoutcomes.com</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
            &copy; 2026 Perpetual. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
