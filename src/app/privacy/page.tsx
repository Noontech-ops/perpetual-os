import { OutcomesNav } from "@/components/outcomes-nav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <OutcomesNav />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-slate-500 mb-10">Last updated: November 2026</p>

          <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">1. Information We Collect</h2>
              <p>We collect information you provide directly: name, email address, organization details, and payment information. We also collect usage data automatically, including pages visited, features used, browser type, IP address, and device information. For nonprofits, we process financial data, donor records, and program outcomes as directed by your organization.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">2. How We Use Your Information</h2>
              <p>We use your information to provide and improve the Service, process donations, generate AI-powered recommendations, send transactional emails, and ensure platform security. We analyze aggregated, anonymized usage data to improve our features. We do not sell your personal information.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">3. Donor Data</h2>
              <p>Donor information is treated with the highest level of confidentiality. Nonprofit organizations control their own donor data within Perpetual OS. Donor giving history and portfolio data on Perpetual Outcomes is visible only to the individual donor. We never share individual donor information with third parties for marketing purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">4. Information Sharing</h2>
              <p>We share information only as follows: with payment processors (Stripe) to complete transactions; with nonprofit organizations to fulfill donations; with service providers who assist in operating the platform under strict confidentiality agreements; and when required by law or to protect our legal rights.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">5. Data Security</h2>
              <p>We implement industry-standard security measures including encryption in transit (TLS 1.3) and at rest (AES-256), regular security audits, role-based access controls, and secure infrastructure hosted on SOC 2 compliant providers. Despite these measures, no method of transmission or storage is completely secure.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">6. Cookies &amp; Tracking</h2>
              <p>We use essential cookies for authentication and session management. We use analytics cookies to understand how users interact with the Service. You can control cookie preferences through your browser settings. We do not use third-party advertising cookies or sell data to advertisers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">7. Data Retention</h2>
              <p>We retain account data for as long as your account is active. Transaction records are retained for seven years for tax and legal compliance. Upon account deletion, personal data is removed within 30 days, except where retention is required by law.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">8. Your Rights</h2>
              <p>You may access, correct, export, or delete your personal data at any time through your account settings or by contacting us. California residents have additional rights under the CCPA, and EU residents have rights under the GDPR, including the right to data portability and the right to object to processing.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">9. Children&apos;s Privacy</h2>
              <p>The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn that we have collected such information, we will delete it promptly.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or through the Service at least 30 days before they take effect. The &quot;Last updated&quot; date at the top reflects the most recent revision.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">11. Contact Us</h2>
              <p>For questions about this Privacy Policy or to exercise your data rights, contact us at <span className="text-emerald-600">privacy@perpetual.org</span>.</p>
            </section>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200 py-8 px-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Perpetual. All rights reserved.
      </footer>
    </div>
  );
}
