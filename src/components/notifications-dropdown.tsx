"use client";

import { useState, useRef, useEffect } from "react";

interface Notification {
  id: string;
  agent: string;
  action: string;
  time: string;
  read: boolean;
  type: "info" | "action" | "success" | "warning";
}

const mockNotifications: Notification[] = [
  { id: "n1", agent: "Grants Agent", action: "Found 3 new funding opportunities matching your programs", time: "12 min ago", read: false, type: "info" },
  { id: "n2", agent: "Compliance Agent", action: "Massachusetts registration renewal is overdue — form pre-filled", time: "1 hr ago", read: false, type: "warning" },
  { id: "n3", agent: "Finance Agent", action: "Monthly bank reconciliation complete — no discrepancies", time: "2 hrs ago", read: false, type: "success" },
  { id: "n4", agent: "Donor Relations", action: "5 donors approaching lapsed status — stewardship emails drafted", time: "3 hrs ago", read: true, type: "action" },
  { id: "n5", agent: "Marketing Agent", action: "Year-End Appeal email sequence ready for review", time: "5 hrs ago", read: true, type: "action" },
  { id: "n6", agent: "Board Agent", action: "Q4 board packet compiled — ready for distribution", time: "6 hrs ago", read: true, type: "success" },
  { id: "n7", agent: "Grants Agent", action: "Hellman Foundation grant at 72% spend with 4 months remaining", time: "1 day ago", read: true, type: "info" },
];

const typeColors: Record<string, string> = {
  info: "bg-blue-500",
  action: "bg-amber-500",
  success: "bg-emerald-500",
  warning: "bg-rose-500",
};

export function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 hover:bg-slate-50 transition-colors ${
                  !n.read ? "bg-brand-50/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColors[n.type]}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-500">{n.agent}</p>
                    <p className={`text-sm ${!n.read ? "text-slate-900 font-medium" : "text-slate-700"}`}>
                      {n.action}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.time}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50">
            <button className="text-xs text-brand-600 hover:text-brand-700 font-medium w-full text-center">
              View all activity
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
