"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { AgentType } from "@/lib/types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('## ')) {
      return <p key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</p>;
    }
    if (line.startsWith('# ')) {
      return <p key={i} className="font-bold text-lg mt-3 mb-1">{line.slice(2)}</p>;
    }
    if (/\*\*.+?\*\*|\*.+?\*/.test(line)) {
      const parts: React.ReactNode[] = [];
      let rem = line;
      let k = 0;
      while (rem) {
        const m = rem.match(/(\*\*(.+?)\*\*|\*(.+?)\*)/);
        if (!m || m.index === undefined) { parts.push(rem); break; }
        if (m.index > 0) parts.push(rem.slice(0, m.index));
        parts.push(m[0].startsWith('**') ? <strong key={k++}>{m[2]}</strong> : <em key={k++}>{m[3]}</em>);
        rem = rem.slice(m.index + m[0].length);
      }
      return <p key={i}>{parts}</p>;
    }
    return <p key={i}>{line || ' '}</p>;
  });
}

const agents: { type: AgentType; label: string; desc: string }[] = [
  { type: "grants", label: "Grants Agent", desc: "Find and manage grant opportunities" },
  { type: "donor_relations", label: "Donor Relations", desc: "Donor engagement and stewardship" },
  { type: "finance", label: "Finance Agent", desc: "Financial analysis and forecasting" },
  { type: "compliance", label: "Compliance", desc: "Regulatory compliance and reporting" },
  { type: "marketing", label: "Marketing", desc: "Communications and outreach" },
  { type: "board", label: "Board Agent", desc: "Board governance and meeting prep" },
];

function AgentChatInner() {
  const searchParams = useSearchParams();
  const initialAgent = (searchParams.get("agent") as AgentType) || "grants";

  const [selectedAgent, setSelectedAgent] = useState<AgentType>(initialAgent);
  const [conversations, setConversations] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messages = conversations[selectedAgent] ?? [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedAgent]);

  async function send() {
    if (!input.trim() || streaming) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const allMessages = [...messages, userMsg];

    setConversations((prev) => ({ ...prev, [selectedAgent]: allMessages }));
    setInput("");
    setStreaming(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setConversations((prev) => ({
      ...prev,
      [selectedAgent]: [...allMessages, assistantMsg],
    }));

    try {
      const res = await fetch("/api/agents/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentType: selectedAgent,
          messages: allMessages,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        setConversations((prev) => ({
          ...prev,
          [selectedAgent]: [
            ...allMessages,
            { role: "assistant", content: err.error || "Something went wrong." },
          ],
        }));
        setStreaming(false);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let content = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              content += parsed.text;
              setConversations((prev) => ({
                ...prev,
                [selectedAgent]: [
                  ...allMessages,
                  { role: "assistant", content },
                ],
              }));
            }
            if (parsed.error) {
              content += `\n\nError: ${parsed.error}`;
              setConversations((prev) => ({
                ...prev,
                [selectedAgent]: [
                  ...allMessages,
                  { role: "assistant", content },
                ],
              }));
            }
          } catch {}
        }
      }

      if (!content) {
        setConversations((prev) => ({
          ...prev,
          [selectedAgent]: [
            ...allMessages,
            { role: "assistant", content: "No response received. Check your API key configuration." },
          ],
        }));
      }
    } catch {
      setConversations((prev) => ({
        ...prev,
        [selectedAgent]: [
          ...allMessages,
          { role: "assistant", content: "Failed to reach the agent. Please try again." },
        ],
      }));
    }

    setStreaming(false);
  }

  const currentAgent = agents.find((a) => a.type === selectedAgent)!;

  return (
    <div className="flex h-[calc(100vh-57px)] -m-4 md:-m-6">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Agent sidebar */}
      <div
        className={`
          w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0
          fixed md:static h-full z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
          transition-transform
        `}
      >
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">AI Agents</h2>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {agents.map((a) => {
            const hasMessages = (conversations[a.type]?.length ?? 0) > 0;
            return (
              <button
                key={a.type}
                onClick={() => {
                  setSelectedAgent(a.type);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                  selectedAgent === a.type
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      selectedAgent === a.type
                        ? "bg-emerald-600/30 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    AI
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{a.label}</p>
                    <p className="text-xs text-slate-500 truncate">{a.desc}</p>
                  </div>
                  {hasMessages && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/dashboard"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-400 hover:text-slate-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center">
            <span className="text-emerald-400 text-xs font-bold">AI</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{currentAgent.label}</p>
            <p className="text-xs text-slate-500">{currentAgent.desc}</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() =>
                setConversations((prev) => ({ ...prev, [selectedAgent]: [] }))
              }
              className="ml-auto text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 text-2xl font-bold">AI</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">{currentAgent.label}</h3>
                <p className="text-sm text-slate-400 mb-6">{currentAgent.desc}</p>
                <div className="space-y-2">
                  {getSuggestions(selectedAgent).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(s);
                        inputRef.current?.focus();
                      }}
                      className="block w-full text-left px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-200 border border-slate-700/50"
                }`}
              >
                {m.role === "assistant" ? renderMarkdown(m.content) : m.content}
                {streaming && i === messages.length - 1 && m.role === "assistant" && (
                  <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-0.5 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-slate-800 bg-slate-900/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${currentAgent.label}...`}
              disabled={streaming}
              className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="px-5 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shrink-0"
            >
              {streaming ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function getSuggestions(type: AgentType): string[] {
  const map: Record<AgentType, string[]> = {
    grants: [
      "Find new grant opportunities for our literacy programs",
      "Draft a renewal proposal for our largest grant",
      "What grants are due this month?",
    ],
    donor_relations: [
      "Which donors need stewardship outreach this month?",
      "Draft a thank-you email for our top donor",
      "Show me lapsed donors we should re-engage",
    ],
    finance: [
      "What's our current cash runway?",
      "Analyze our revenue trends for this year",
      "Flag any budget variances above 10%",
    ],
    compliance: [
      "What compliance deadlines are coming up?",
      "Review our Form 990 readiness",
      "Check if we're meeting all grant reporting requirements",
    ],
    marketing: [
      "Draft a year-end fundraising email campaign",
      "Suggest social media content for our programs",
      "How can we improve donor acquisition?",
    ],
    board: [
      "Prepare a financial summary for the next board meeting",
      "Draft board meeting agenda items",
      "What key decisions need board approval?",
    ],
  };
  return map[type] ?? [];
}

export default function AgentsChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[calc(100vh-57px)] -m-4 md:-m-6">
          <div className="text-slate-400 text-sm">Loading agents...</div>
        </div>
      }
    >
      <AgentChatInner />
    </Suspense>
  );
}
