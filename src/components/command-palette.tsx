"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Command {
  id: string;
  label: string;
  description?: string;
  category: "Navigation" | "Actions" | "AI Agents";
  shortcut?: string;
  icon: React.ReactNode;
}

const navIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
);
const chatIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const actionIcon = (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
);

const commands: Command[] = [
  { id: "nav-dashboard", label: "Dashboard", description: "Overview of all agents", category: "Navigation", icon: navIcon },
  { id: "nav-grants", label: "Grants Agent", description: "Track grants & applications", category: "Navigation", icon: navIcon },
  { id: "nav-donors", label: "Donor Relations", description: "Manage donor relationships", category: "Navigation", icon: navIcon },
  { id: "nav-finance", label: "Finance", description: "Budgets, transactions, forecasts", category: "Navigation", icon: navIcon },
  { id: "nav-compliance", label: "Compliance", description: "Registrations & filings", category: "Navigation", icon: navIcon },
  { id: "nav-programs", label: "Programs", description: "Program management & metrics", category: "Navigation", icon: navIcon },
  { id: "nav-outcomes", label: "Outcomes", description: "Impact measurement", category: "Navigation", icon: navIcon },
  { id: "nav-marketing", label: "Marketing", description: "Campaigns, emails, content", category: "Navigation", icon: navIcon },
  { id: "nav-board", label: "Board", description: "Board members & meetings", category: "Navigation", icon: navIcon },
  { id: "nav-settings", label: "Settings", description: "Organization & agent settings", category: "Navigation", icon: navIcon },
  { id: "export-finance-csv", label: "Export Finance CSV", description: "Download transactions as CSV", category: "Actions", icon: actionIcon },
  { id: "toggle-sidebar", label: "Toggle Sidebar", description: "Collapse or expand sidebar", category: "Actions", icon: actionIcon },
  { id: "chat-grants", label: "Chat with Grants Agent", category: "AI Agents", icon: chatIcon },
  { id: "chat-donor_relations", label: "Chat with Donor Relations Agent", category: "AI Agents", icon: chatIcon },
  { id: "chat-finance", label: "Chat with Finance Agent", category: "AI Agents", icon: chatIcon },
  { id: "chat-compliance", label: "Chat with Compliance Agent", category: "AI Agents", icon: chatIcon },
  { id: "chat-marketing", label: "Chat with Marketing Agent", category: "AI Agents", icon: chatIcon },
  { id: "chat-board", label: "Chat with Board Agent", category: "AI Agents", icon: chatIcon },
];

const hashMap: Record<string, string> = {
  "nav-dashboard": "",
  "nav-grants": "#grants",
  "nav-donors": "#donors",
  "nav-finance": "#finance",
  "nav-compliance": "#compliance",
  "nav-programs": "#programs",
  "nav-outcomes": "#outcomes",
  "nav-marketing": "#marketing",
  "nav-board": "#board",
};

export function CommandPalette({ onAction }: { onAction: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelected(0);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const grouped = ["Navigation", "Actions", "AI Agents"]
    .map((cat) => ({
      category: cat,
      items: filtered.filter((c) => c.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const flatItems = grouped.flatMap((g) => g.items);

  const execute = useCallback(
    (cmd: Command) => {
      setOpen(false);
      if (cmd.id in hashMap) {
        const hash = hashMap[cmd.id];
        if (hash) {
          window.location.hash = hash;
        } else {
          window.location.hash = "";
          router.push("/os");
        }
      } else if (cmd.id === "nav-settings") {
        router.push("/os/settings");
      } else {
        onAction(cmd.id);
      }
    },
    [onAction, router]
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Enter" && flatItems[selected]) {
      e.preventDefault();
      execute(flatItems[selected]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${selected}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
          <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={onKeyDown}
            placeholder="Search commands..."
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
          />
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {grouped.length === 0 && (
            <p className="px-4 py-8 text-sm text-slate-500 text-center">No commands found</p>
          )}
          {grouped.map((group) => (
            <div key={group.category}>
              <p className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {group.category}
              </p>
              {group.items.map((cmd) => {
                flatIndex++;
                const idx = flatIndex;
                const isSelected = idx === selected;
                return (
                  <button
                    key={cmd.id}
                    data-index={idx}
                    onClick={() => execute(cmd)}
                    onMouseEnter={() => setSelected(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                      isSelected ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className={isSelected ? "text-brand-600" : "text-slate-400"}>{cmd.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cmd.label}</p>
                      {cmd.description && (
                        <p className="text-xs text-slate-500 truncate">{cmd.description}</p>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-3">
            <span><kbd className="font-medium">↑↓</kbd> navigate</span>
            <span><kbd className="font-medium">↵</kbd> select</span>
            <span><kbd className="font-medium">esc</kbd> close</span>
          </div>
          <span>
            <kbd className="font-medium">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
}
