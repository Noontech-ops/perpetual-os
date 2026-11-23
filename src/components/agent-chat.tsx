'use client';

import { useState, useRef, useEffect } from 'react';
import type { AgentType } from '@/lib/types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const agentLabels: Record<AgentType, string> = {
  grants: 'Grants Agent',
  donor_relations: 'Donor Relations',
  finance: 'Finance Agent',
  compliance: 'Compliance',
  marketing: 'Marketing',
  board: 'Board Agent',
};

const agentSuggestions: Record<AgentType, string[]> = {
  grants: ["Find grants for literacy programs", "Draft a LOI for Hellman Foundation", "What deadlines are coming up?"],
  donor_relations: ["Who are our lapsed donors?", "Draft a thank-you email for recent gifts", "Show donor retention trends"],
  finance: ["Summarize our cash position", "Flag any budget variances", "Forecast next quarter's cash flow"],
  compliance: ["What filings are due this month?", "Check our state registration status", "Review restricted fund compliance"],
  marketing: ["Draft a year-end appeal email", "Suggest social media content", "How is our last campaign performing?"],
  board: ["Prepare the next board packet", "Summarize recent resolutions", "What committees need attention?"],
};

export function AgentChat({ agentType, onClose }: { agentType: AgentType; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType, messages: next }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Something went wrong.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to reach the agent. Check your API key configuration.' }]);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 flex flex-col" style={{ height: '70vh' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
              <span className="text-brand-600 text-sm font-bold">AI</span>
            </div>
            <span className="font-semibold text-gray-900">{agentLabels[agentType]}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="mt-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mx-auto mb-3">
                  <span className="text-brand-600 text-lg font-bold">AI</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{agentLabels[agentType]}</p>
                <p className="text-xs text-gray-400 mt-1">Ask anything about your organization</p>
              </div>
              <div className="space-y-2 px-2">
                {agentSuggestions[agentType].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="w-full text-left px-3 py-2.5 text-sm text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm text-gray-500">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200">
          <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`Ask ${agentLabels[agentType]}...`}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
