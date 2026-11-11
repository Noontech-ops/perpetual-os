import type {
  Organization, Constituent, Transaction, Program, Outcome,
  Grant, AgentConfig, AgentAction, DashboardStats, DonorProfile, GivingTransaction,
} from './types';
import * as mock from './mock-data';

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelizeKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(camelizeKeys);
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[snakeToCamel(k)] = camelizeKeys(v);
    }
    return out;
  }
  return obj;
}

const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(path, init);
    if (!res.ok) return null;
    const json = await res.json();
    return camelizeKeys(json) as T;
  } catch {
    return null;
  }
}

function mockFallback<T>(mockData: T): T | null {
  return hasSupabase ? null : mockData;
}

export async function getOrganization(): Promise<Organization> {
  const data = await apiFetch<Organization>('/api/organizations');
  if (data) return data;
  return mockFallback(mock.organization) ?? mock.organization;
}

export async function getConstituents(type?: string): Promise<Constituent[]> {
  const params = type ? `?type=${type}` : '';
  const data = await apiFetch<Constituent[]>(`/api/constituents${params}`);
  if (data) return data;
  const fb = mockFallback(mock.constituents);
  if (!fb) return [];
  return type ? fb.filter(c => c.type === type) : fb;
}

export async function getTransactions(direction?: string): Promise<Transaction[]> {
  const params = direction ? `?direction=${direction}` : '';
  const data = await apiFetch<Transaction[]>(`/api/transactions${params}`);
  if (data) return data;
  const fb = mockFallback(mock.transactions);
  if (!fb) return [];
  return direction ? fb.filter(t => t.direction === direction) : fb;
}

export async function getPrograms(): Promise<Program[]> {
  const data = await apiFetch<Program[]>('/api/programs');
  if (data) return data;
  return mockFallback(mock.programs) ?? [];
}

export async function getOutcomes(): Promise<Outcome[]> {
  const data = await apiFetch<Outcome[]>('/api/outcomes');
  if (data) return data;
  return mockFallback(mock.outcomes) ?? [];
}

export async function getGrants(status?: string): Promise<Grant[]> {
  const params = status ? `?status=${status}` : '';
  const data = await apiFetch<Grant[]>(`/api/grants${params}`);
  if (data) return data;
  const fb = mockFallback(mock.grants);
  if (!fb) return [];
  return status ? fb.filter(g => g.status === status) : fb;
}

export async function getAgentActions(status?: string): Promise<AgentAction[]> {
  const params = status ? `?status=${status}` : '';
  const data = await apiFetch<AgentAction[]>(`/api/agent-actions${params}`);
  if (data) return data;
  const fb = mockFallback(mock.agentActions);
  if (!fb) return [];
  return status ? fb.filter(a => a.status === status) : fb;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const data = await apiFetch<DashboardStats>('/api/dashboard-stats');
  if (data) return data;
  return mockFallback(mock.dashboardStats) ?? mock.dashboardStats;
}

export async function getAgentConfigs(): Promise<AgentConfig[]> {
  const data = await apiFetch<AgentConfig[]>('/api/agent-configs');
  if (data) return data;
  return mockFallback(mock.agentConfigs) ?? [];
}

export async function getDonorProfiles(): Promise<DonorProfile[]> {
  const data = await apiFetch<DonorProfile[]>('/api/donor-profiles');
  if (data) return data;
  return mockFallback(mock.donorProfiles) ?? [];
}

export async function getGivingTransactions(): Promise<GivingTransaction[]> {
  const data = await apiFetch<GivingTransaction[]>('/api/donations');
  if (data) return data;
  return mockFallback(mock.givingTransactions) ?? [];
}

export async function updateAgentAction(id: string, status: 'approved' | 'rejected'): Promise<boolean> {
  try {
    const res = await fetch('/api/agent-actions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function runAgent(agentType: string, task: string): Promise<string> {
  const res = await apiFetch<{ response: string }>('/api/agents/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentType, task }),
  });
  return res?.response ?? 'Agent unavailable. Check API key configuration.';
}

export async function createDonation(data: {
  organization_id: string;
  amount: number;
  method: string;
  designation?: string;
}): Promise<GivingTransaction | null> {
  return apiFetch<GivingTransaction>('/api/donations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function searchOrganizations(q?: string, sector?: string): Promise<(Organization & { outcomes?: Outcome[] })[]> {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (sector) params.set('sector', sector);
  const qs = params.toString();
  const data = await apiFetch<(Organization & { outcomes?: Outcome[] })[]>(`/api/search${qs ? `?${qs}` : ''}`);
  if (data && Array.isArray(data) && data.length > 0) return data;
  return [];
}
