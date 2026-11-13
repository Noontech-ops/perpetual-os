"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const agentConfigs = [
  { key: "grants", label: "Grants Agent", description: "Discovers funders, drafts proposals, tracks deadlines, and manages reporting requirements." },
  { key: "donor_relations", label: "Donor Relations", description: "Segments donors, drafts acknowledgments, plans stewardship touchpoints, and flags lapsed donors." },
  { key: "finance", label: "Finance Agent", description: "Categorizes transactions, tracks restricted funds, forecasts cash flow, and prepares financial summaries." },
  { key: "compliance", label: "Compliance Agent", description: "Monitors filing deadlines, drafts Form 990, manages state registrations, and reviews grant restrictions." },
  { key: "marketing", label: "Marketing Agent", description: "Drafts campaigns, generates social media content, manages email sequences, and optimizes your marketplace profile." },
  { key: "board", label: "Board Agent", description: "Prepares board packets, drafts meeting minutes, tracks resolutions, and monitors governance compliance." },
];

const initialTeam = [
  { name: "Jordan Rivera", email: "jordan@balc.org", role: "Admin", status: "active" as const },
  { name: "Casey Nguyen", email: "casey@balc.org", role: "Editor", status: "active" as const },
  { name: "Morgan Blake", email: "morgan@balc.org", role: "Editor", status: "active" as const },
  { name: "Taylor Osei", email: "taylor@balc.org", role: "Viewer", status: "active" as const },
  { name: "Sam Patel", email: "sam@balc.org", role: "Viewer", status: "invited" as const },
];

const integrations = [
  { name: "Bank Account", provider: "Wells Fargo ****4521", connected: true, icon: "bank" },
  { name: "Accounting", provider: "QuickBooks", connected: false, icon: "calculator" },
  { name: "CRM", provider: "Salesforce", connected: false, icon: "users" },
  { name: "Email Marketing", provider: "Mailchimp", connected: true, icon: "mail" },
  { name: "Payment Processor", provider: "Stripe", connected: true, icon: "credit-card" },
];

const integrationIcons: Record<string, React.ReactNode> = {
  bank: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" /></svg>,
  calculator: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth={1.5} /><path strokeWidth={1.5} d="M8 6h8M8 10h2M14 10h2M8 14h2M14 14h2M8 18h2M14 18h2" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" strokeWidth={1.5} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>,
  mail: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  "credit-card": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth={1.5} /><line x1="1" y1="10" x2="23" y2="10" strokeWidth={1.5} /></svg>,
};

type ApproveLevel = "none" | "low" | "all";

export default function SettingsPage() {
  const [orgName, setOrgName] = useState("Bay Area Literacy Coalition");
  const [ein, setEin] = useState("94-1234567");
  const [mission, setMission] = useState("Advancing literacy and educational equity across the San Francisco Bay Area through community-based tutoring, family engagement, and digital access programs.");
  const [website, setWebsite] = useState("https://baliteracy.org");
  const [phone, setPhone] = useState("(415) 555-0142");
  const [address, setAddress] = useState("1234 Mission St, Suite 400, San Francisco, CA 94103");
  const [profileSaved, setProfileSaved] = useState(false);

  const [agents, setAgents] = useState<Record<string, { enabled: boolean; approve: ApproveLevel }>>(
    Object.fromEntries(agentConfigs.map((a) => [a.key, { enabled: true, approve: "low" as ApproveLevel }]))
  );

  const [team] = useState(initialTeam);

  function toggleAgent(key: string) {
    setAgents((prev) => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
  }

  function setApproveLevel(key: string, level: ApproveLevel) {
    setAgents((prev) => ({ ...prev, [key]: { ...prev[key], approve: level } }));
  }

  function handleProfileSave() {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your organization, team, agents, and integrations.</p>
      </div>

      {/* Organization Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                <input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">EIN</label>
                <input
                  value={ein}
                  onChange={(e) => setEin(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleProfileSave}
                className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors"
              >
                Save Changes
              </button>
              {profileSaved && <span className="text-sm text-emerald-600 font-medium">Saved</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Team Members</CardTitle>
          <button className="px-3 py-1.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
            Invite Member
          </button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {team.map((m) => (
                  <tr key={m.email} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{m.name}</td>
                    <td className="py-3 px-4 text-slate-600">{m.email}</td>
                    <td className="py-3 px-4">
                      <select
                        defaultValue={m.role}
                        className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={m.status === "active" ? "success" : "warning"}>
                        {m.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* AI Agent Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentConfigs.map((agent) => {
              const state = agents[agent.key];
              return (
                <div key={agent.key} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-semibold text-slate-900">{agent.label}</p>
                        <Badge variant={state.enabled ? "success" : "default"}>
                          {state.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">{agent.description}</p>
                    </div>
                    <button
                      onClick={() => toggleAgent(agent.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                        state.enabled ? "bg-brand-600" : "bg-slate-200"
                      }`}
                      aria-label={`Toggle ${agent.label}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                          state.enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  {state.enabled && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
                      <label className="text-xs font-medium text-slate-500">Auto-approve:</label>
                      <select
                        value={state.approve}
                        onChange={(e) => setApproveLevel(agent.key, e.target.value as ApproveLevel)}
                        className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="none">None — review everything</option>
                        <option value="low">Low risk only</option>
                        <option value="all">All actions</option>
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {integrations.map((integ) => (
              <div key={integ.name} className="border border-slate-200 rounded-lg p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    {integrationIcons[integ.icon]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{integ.name}</p>
                    <p className="text-xs text-slate-500 truncate">{integ.provider}</p>
                  </div>
                </div>
                {integ.connected ? (
                  <button className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                    Disconnect
                  </button>
                ) : (
                  <button className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shrink-0">
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Billing */}
      <Card>
        <CardHeader>
          <CardTitle>Billing &amp; Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-slate-900">Free Plan</p>
                <Badge variant="info">Current</Badge>
              </div>
              <p className="text-sm text-slate-500 mt-1">All core features included. Upgrade for priority agent processing and premium integrations.</p>
            </div>
            <button className="px-4 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-colors shrink-0">
              Upgrade Plan
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">6/6</p>
              <p className="text-xs text-slate-500 mt-1">Agents Active</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">5</p>
              <p className="text-xs text-slate-500 mt-1">Team Members</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">142</p>
              <p className="text-xs text-slate-500 mt-1">Agent Actions (mo)</p>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-900">2.4 GB</p>
              <p className="text-xs text-slate-500 mt-1">Storage Used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-700">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Export All Data</p>
                <p className="text-xs text-slate-500">Download a ZIP of all your organization data including grants, donors, financials, and documents.</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shrink-0">
                Export
              </button>
            </div>
            <div className="border-t border-slate-100" />
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Archive Organization</p>
                <p className="text-xs text-slate-500">Permanently archive this organization. All data will be retained but the account will be deactivated.</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0">
                Archive
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
