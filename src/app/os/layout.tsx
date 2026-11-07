"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { AgentChat } from "@/components/agent-chat";
import type { AgentType } from "@/lib/types";

const navItems = [
  { href: "/os", label: "Dashboard", icon: "grid" },
  { href: "/os#grants", label: "Grants Agent", icon: "file-text" },
  { href: "/os#donors", label: "Donor Relations", icon: "users" },
  { href: "/os#finance", label: "Finance", icon: "dollar-sign" },
  { href: "/os#compliance", label: "Compliance", icon: "shield" },
  { href: "/os#programs", label: "Programs", icon: "target" },
  { href: "/os#outcomes", label: "Outcomes", icon: "trending-up" },
  { href: "/os#marketing", label: "Marketing", icon: "megaphone" },
  { href: "/os#board", label: "Board", icon: "briefcase" },
];

const icons: Record<string, ReactNode> = {
  grid: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  "file-text": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  "dollar-sign": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  shield: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  target: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  "trending-up": <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  megaphone: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  briefcase: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
};

export default function OSLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();
  const [chatAgent, setChatAgent] = useState<AgentType | null>(null);
  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'ED';

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-16" : "w-60"} bg-white border-r border-slate-200 flex flex-col transition-all duration-200 shrink-0`}
      >
        <div className="p-4 border-b border-slate-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {!collapsed && (
            <span className="text-base font-semibold text-slate-900">Perpetual OS</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-400 hover:text-slate-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/os" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{icons[item.icon]}</span>
                {!collapsed && item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200">
          {!collapsed && (
            <div className="text-xs text-slate-500">
              <p className="font-medium text-slate-700">Bay Area Literacy Coalition</p>
              <p>Free Plan</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/outcomes" className="text-sm text-slate-500 hover:text-brand-600">
              View public page &#8599;
            </Link>
            {user ? (
              <button onClick={signOut} className="text-sm text-slate-500 hover:text-red-600">
                Sign out
              </button>
            ) : (
              <Link href="/login" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                Sign in
              </Link>
            )}
            <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-sm font-medium">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      {/* Agent Chat FAB */}
      <button
        onClick={() => setChatAgent('grants')}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 flex items-center justify-center z-40"
        title="Chat with AI Agent"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {chatAgent && <AgentChat agentType={chatAgent} onClose={() => setChatAgent(null)} />}
    </div>
  );
}
