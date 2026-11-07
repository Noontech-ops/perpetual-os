'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

type Step = 'org' | 'programs' | 'agents' | 'done';

export default function OnboardingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>('org');
  const [orgName, setOrgName] = useState('');
  const [ein, setEin] = useState('');
  const [mission, setMission] = useState('');
  const [sector, setSector] = useState('education');
  const [programs, setPrograms] = useState([{ name: '', description: '' }]);
  const [agents, setAgents] = useState<string[]>(['grants', 'donor_relations', 'finance']);

  const sectors = [
    'education', 'health', 'housing', 'workforce', 'environment',
    'arts_culture', 'community', 'human_services', 'science', 'essential_rights',
  ];

  const agentOptions = [
    { id: 'grants', name: 'Grants Agent', desc: 'Find funding, draft proposals, track deadlines' },
    { id: 'donor_relations', name: 'Donor Relations', desc: 'Stewardship, segmentation, upgrade recommendations' },
    { id: 'finance', name: 'Finance Agent', desc: 'Cash forecast, restricted funds, reconciliation' },
    { id: 'compliance', name: 'Compliance', desc: 'Form 990, acknowledgments, grant covenants' },
    { id: 'marketing', name: 'Marketing', desc: 'Impact stories, email campaigns, social content' },
    { id: 'board', name: 'Board Agent', desc: 'Board packets, minutes, governance dashboard' },
  ];

  function toggleAgent(id: string) {
    setAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  }

  async function handleFinish() {
    setStep('done');
    if (user) {
      try {
        await fetch('/api/organizations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: orgName, ein, mission, sector }),
        });
      } catch {}
    }
    setTimeout(() => { window.location.href = '/os'; }, 2000);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set up Perpetual OS</h1>
          <p className="text-gray-500 mt-1">Let&apos;s get your nonprofit running in minutes</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {(['org', 'programs', 'agents'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s ? 'bg-indigo-600 text-white' :
                (['org', 'programs', 'agents'].indexOf(step) > i) ? 'bg-indigo-100 text-indigo-700' :
                'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              {i < 2 && <div className="w-12 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {step === 'org' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Organization</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization name</label>
                <input value={orgName} onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EIN (optional)</label>
                <input value={ein} onChange={e => setEin(e.target.value)} placeholder="XX-XXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mission statement</label>
                <textarea value={mission} onChange={e => setMission(e.target.value)} rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary sector</label>
                <select value={sector} onChange={e => setSector(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  {sectors.map(s => <option key={s} value={s}>{s.replace('_', ' & ').replace(/^\w/, c => c.toUpperCase())}</option>)}
                </select>
              </div>
              <button onClick={() => setStep('programs')} disabled={!orgName}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50">
                Continue
              </button>
            </div>
          )}

          {step === 'programs' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Your Programs</h2>
              <p className="text-sm text-gray-500">What does your organization do? Add your programs.</p>
              {programs.map((p, i) => (
                <div key={i} className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <input value={p.name} onChange={e => { const next = [...programs]; next[i].name = e.target.value; setPrograms(next); }}
                    placeholder="Program name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  <textarea value={p.description} onChange={e => { const next = [...programs]; next[i].description = e.target.value; setPrograms(next); }}
                    placeholder="Brief description" rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              ))}
              <button onClick={() => setPrograms([...programs, { name: '', description: '' }])}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                + Add another program
              </button>
              <div className="flex gap-3">
                <button onClick={() => setStep('org')} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Back</button>
                <button onClick={() => setStep('agents')} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Continue</button>
              </div>
            </div>
          )}

          {step === 'agents' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Enable AI Agents</h2>
              <p className="text-sm text-gray-500">Choose which agents to activate. You can change this later.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agentOptions.map(a => (
                  <button key={a.id} onClick={() => toggleAgent(a.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      agents.includes(a.id)
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="font-medium text-sm text-gray-900">{a.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('programs')} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">Back</button>
                <button onClick={handleFinish} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                  Launch Perpetual OS
                </button>
              </div>
            </div>
          )}

          {step === 'done' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">You&apos;re all set!</h2>
              <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
